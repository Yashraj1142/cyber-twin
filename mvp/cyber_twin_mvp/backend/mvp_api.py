import asyncio
import re
import shutil
import stat
import threading
import uuid
import zipfile
from datetime import datetime, timezone
from pathlib import PurePosixPath

from fastapi import FastAPI, BackgroundTasks, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CYBER-TWIN MVP API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_ARCHIVE_BYTES = 200 * 1024 * 1024  # 200 MiB compressed
MAX_EXTRACTED_BYTES = 200 * 1024 * 1024  # 200 MiB extracted
MAX_ARCHIVE_FILES = 5000

SAFE_NAME = re.compile(r"^[a-zA-Z0-9][a-zA-Z0-9 ._-]{0,79}$")


class MemoryStore:
    def __init__(self):
        self.applications = {}

    def create_application(self, data):
        self.applications[data["id"]] = data
        return data

    def get_application(self, app_id):
        return self.applications.get(app_id)

    def update_application(self, app_id, data):
        if app_id in self.applications:
            self.applications[app_id].update(data)
            self.applications[app_id]["updated_at"] = self._utc_now()

    def list_applications(self):
        return list(self.applications.values())

    def delete_application(self, app_id):
        if app_id in self.applications:
            del self.applications[app_id]

    def _utc_now(self):
        return datetime.now(timezone.utc).isoformat()


store = MemoryStore()


def utc_now():
    return datetime.now(timezone.utc).isoformat()


def safe_extract(archive_path, destination):
    try:
        archive = zipfile.ZipFile(archive_path)
    except (zipfile.BadZipFile, OSError) as exc:
        raise ValueError("Upload must be a valid ZIP archive") from exc

    with archive:
        entries = archive.infolist()
        if not entries or len(entries) > MAX_ARCHIVE_FILES:
            raise ValueError(f"ZIP must contain between 1 and {MAX_ARCHIVE_FILES} files")
        total_size = 0
        for entry in entries:
            raw_name = entry.filename
            if "\\" in raw_name:
                raise ValueError("ZIP paths must use forward slashes")
            path = PurePosixPath(raw_name)
            mode = entry.external_attr >> 16
            if path.is_absolute() or ".." in path.parts or any(":" in part for part in path.parts) or (mode and stat.S_ISLNK(mode)):
                raise ValueError("ZIP contains an unsafe path or symlink")
            total_size += entry.file_size
            if total_size > MAX_EXTRACTED_BYTES:
                raise ValueError("Expanded ZIP exceeds the 200 MB limit")

        destination.mkdir(parents=True, exist_ok=True)
        for entry in entries:
            path = PurePosixPath(entry.filename)
            if not path.parts:
                continue
            target = destination.joinpath(*path.parts)
            if not target.resolve().is_relative_to(destination.resolve()):
                raise ValueError("ZIP path escapes the extraction directory")
            if entry.is_dir():
                target.mkdir(parents=True, exist_ok=True)
                continue
            target.parent.mkdir(parents=True, exist_ok=True)
            with archive.open(entry) as source, target.open("wb") as output:
                while chunk := source.read(1024 * 1024):
                    output.write(chunk)

    roots = list(destination.iterdir())
    if len(roots) == 1 and roots[0].is_dir():
        destination = roots[0]
    if not (destination / "Dockerfile").is_file():
        raise ValueError("ZIP must contain a Dockerfile at its root (or one top-level folder)")
    return destination


@app.get("/api/v1/health")
def health_check():
    return {"status": "online", "service": "cyber-twin-mvp"}


@app.post("/api/v1/applications")
async def upload_application(
    name: str = Form(...),
    app_port: int = Form(...),
    archive: UploadFile = File(...),
    background_tasks: BackgroundTasks = None,
):
    name = name.strip()
    if not SAFE_NAME.fullmatch(name):
        raise HTTPException(422, "Name must be 1-80 letters, numbers, spaces, dots, underscores, or hyphens")
    if app_port < 1 or app_port > 65535:
        raise HTTPException(422, "Application port must be between 1 and 65535")

    application_id = uuid.uuid4().hex[:12]
    build_id = uuid.uuid4().hex[:12]
    app_upload_dir = store.UPLOAD_DIR / application_id
    app_upload_dir.mkdir(parents=True, exist_ok=True)
    archive_path = app_upload_dir / "source.zip"
    size = 0
    try:
        with archive_path.open("wb") as output:
            while chunk := await archive.read(1024 * 1024):
                size += len(chunk)
                if size > MAX_ARCHIVE_BYTES:
                    raise HTTPException(413, "ZIP upload exceeds the 200 MB limit")
                output.write(chunk)
        await archive.close()
        context_path = safe_extract(archive_path, store.BUILD_DIR / application_id)

        store.create_application({
            "id": application_id, "name": name, "status": "queued", "build_id": build_id,
            "build_status": "queued", "build_error": None, "twin_id": None,
            "app_port": app_port, "target_url": None, "created_at": utc_now(), "updated_at": utc_now(),
        })

        background_tasks.add_task(run_build, application_id, build_id, context_path, app_port)
        return store.get_application(application_id)

    except HTTPException:
        shutil.rmtree(app_upload_dir, ignore_errors=True)
        shutil.rmtree(store.BUILD_DIR / application_id, ignore_errors=True)
        raise
    except (ValueError, zipfile.BadZipFile) as exc:
        shutil.rmtree(app_upload_dir, ignore_errors=True)
        shutil.rmtree(store.BUILD_DIR / application_id, ignore_errors=True)
        detail = str(exc) if isinstance(exc, ValueError) else "Upload must be a valid ZIP archive"
        raise HTTPException(422, detail) from exc


@app.get("/api/v1/applications")
def list_applications():
    return store.list_applications()


@app.get("/api/v1/applications/{application_id}")
def get_application(application_id: str):
    return store.get_application(application_id)


@app.post("/api/v1/applications/{application_id}/start")
async def start_application(application_id: str):
    application = store.get_application(application_id)
    if not application:
        raise HTTPException(404, "Application not found")

    application["status"] = "running"
    application["build_status"] = "ready"
    application["twin_id"] = f"twin_{application_id}"
    application["target_url"] = f"http://127.0.0.1:{application['app_port']}"
    application["updated_at"] = utc_now()
    return application


@app.post("/api/v1/applications/{application_id}/stop")
async def stop_application(application_id: str):
    application = store.get_application(application_id)
    if not application:
        raise HTTPException(404, "Application not found")

    application["status"] = "stopped"
    application["updated_at"] = utc_now()
    return application


@app.delete("/api/v1/applications/{application_id}")
async def delete_application(application_id: str):
    application = store.get_application(application_id)
    if not application:
        raise HTTPException(404, "Application not found")

    store.delete_application(application_id)
    return {"message": "Application deleted", "id": application_id}


async def run_build(application_id: str, build_id: str, context_path: str, app_port: int):
    try:
        store.update_application(application_id, {"build_status": "building"})

        # Build Docker image from the extracted context
        import docker
        client = docker.from_env()

        dockerfile_path = None
        dockerfile_content = None
        for root, dirs, files in os_walk(context_path):
            for f in files:
                if f == "Dockerfile":
                    dockerfile_path = os.path.join(root, f)
                    break

        if not dockerfile_path:
            store.update_application(application_id, {"build_status": "failed", "build_error": "Dockerfile not found in uploaded ZIP"})
            return

        with open(dockerfile_path, 'r') as f:
            dockerfile_content = f.read()

        image_name = f"cybertwin-{application_id}:latest"

        # Build the Docker image
        image, build_logs = client.images.build(
            path=context_path,
            dockerfile=dockerfile_path.replace(context_path, ""),
            tag=image_name,
            rm=True
        )

        # Run the container on an internal network
        container = client.containers.run(
            image_name,
            ports={f"{app_port}/tcp": None},  # Publish to internal only
            detach=True,
            remove=True,
            network="bridge",
            tty=False
        )

        # Get the assigned port
        container_ports = container.attrs['NetworkSettings']['Ports']
        published_port = None
        if container_ports.get(f"{app_port}/tcp"):
            published_port = container_ports[f"{app_port}/tcp"][0]['HostPort']

        store.update_application(application_id, {
            "build_status": "ready",
            "build_error": None,
            "twin_id": f"twin_{application_id}",
            "target_url": f"http://127.0.0.1:{published_port or app_port}"
        })

    except Exception as exc:
        store.update_application(application_id, {"build_status": "failed", "build_error": str(exc)})


if __name__ == "__main__":
    import os
    import os_walk

    os.makedirs("backend/data/uploads", exist_ok=True)
    os.makedirs("backend/data/builds", exist_ok=True)

    store.UPLOAD_DIR = os.path.join("backend/data/uploads")
    store.BUILD_DIR = os.path.join("backend/data/builds")

    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)