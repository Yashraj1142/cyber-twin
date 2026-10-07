import re
import shutil
import stat
import threading
import uuid
import zipfile
from datetime import datetime, timezone
from pathlib import PurePosixPath

from fastapi import APIRouter, BackgroundTasks, File, Form, HTTPException, UploadFile

from backend.services import application_store as store
from backend.services.docker_manager import DockerUnavailable, TwinDockerManager

router = APIRouter()
MAX_ARCHIVE_BYTES = 50 * 1024 * 1024
MAX_EXTRACTED_BYTES = 200 * 1024 * 1024
MAX_ARCHIVE_FILES = 5000
SAFE_NAME = re.compile(r"^[a-zA-Z0-9][a-zA-Z0-9 ._-]{0,79}$")
_build_locks = {}
_lock_guard = threading.Lock()


def utc_now():
    return datetime.now(timezone.utc).isoformat()


def public_application(record):
    return {key: record[key] for key in (
        "id", "name", "status", "build_id", "build_status", "build_error",
        "twin_id", "app_port", "target_url", "created_at", "updated_at",
    )}


def safe_extract(archive_path, destination):
    try:
        archive = zipfile.ZipFile(archive_path)
    except (zipfile.BadZipFile, OSError) as exc:
        raise ValueError("Upload must be a valid ZIP archive") from exc

    with archive:
        entries = archive.infolist()
        if not entries or len(entries) > MAX_ARCHIVE_FILES:
            raise ValueError("ZIP must contain between 1 and 5000 files")
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
        extracted_total = 0
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
                    extracted_total += len(chunk)
                    if extracted_total > MAX_EXTRACTED_BYTES:
                        raise ValueError("Expanded ZIP exceeds the 200 MB limit")
                    output.write(chunk)

    roots = list(destination.iterdir())
    if len(roots) == 1 and roots[0].is_dir():
        destination = roots[0]
    if not (destination / "Dockerfile").is_file():
        raise ValueError("ZIP must contain a Dockerfile at its root (or one top-level folder)")
    return destination


def run_build(application_id, build_id, context_path, app_port):
    with _lock_guard:
        lock = _build_locks.setdefault(application_id, threading.Lock())
    with lock:
        record = store.get_application(application_id)
        if not record:
            return
        store.update_application(application_id, build_status="building", status="building", updated_at=utc_now())
        manager = None
        try:
            manager = TwinDockerManager()
            result = manager.build_and_start(application_id, build_id, context_path, app_port)
            now = utc_now()
            store.update_application(
                application_id,
                build_status="ready",
                status="running",
                build_error=None,
                twin_id=application_id,
                updated_at=now,
                **result,
            )
        except DockerUnavailable as exc:
            store.update_application(
                application_id, build_status="failed", status="failed",
                build_error=str(exc), updated_at=utc_now(),
            )
        except Exception as exc:
            if manager and record.get("container_id"):
                try:
                    manager.remove(record["container_id"], record["network_name"], record["image_tag"])
                except Exception:
                    pass
            store.update_application(
                application_id, build_status="failed", status="failed",
                build_error=f"Build or container startup failed: {str(exc)[:2000]}", updated_at=utc_now(),
            )


@router.post("/applications", status_code=202)
async def create_application(
    background_tasks: BackgroundTasks,
    name: str = Form(...),
    app_port: int = Form(8000),
    archive: UploadFile = File(...),
):
    name = name.strip()
    if not SAFE_NAME.fullmatch(name):
        raise HTTPException(422, "Name must be 1-80 letters, numbers, spaces, dots, underscores, or hyphens")
    if app_port < 1 or app_port > 65535:
        raise HTTPException(422, "Application port must be between 1 and 65535")

    application_id = uuid.uuid4().hex[:12]
    build_id = uuid.uuid4().hex[:12]
    app_upload_dir = store.UPLOAD_DIR / application_id
    app_upload_dir.mkdir(parents=True)
    archive_path = app_upload_dir / "source.zip"
    size = 0
    try:
        with archive_path.open("wb") as output:
            while chunk := await archive.read(1024 * 1024):
                size += len(chunk)
                if size > MAX_ARCHIVE_BYTES:
                    raise HTTPException(413, "ZIP upload exceeds the 50 MB limit")
                output.write(chunk)
        await archive.close()
        context_path = safe_extract(archive_path, store.BUILD_DIR / application_id)
    except HTTPException:
        shutil.rmtree(app_upload_dir, ignore_errors=True)
        shutil.rmtree(store.BUILD_DIR / application_id, ignore_errors=True)
        raise
    except (ValueError, zipfile.BadZipFile) as exc:
        shutil.rmtree(app_upload_dir, ignore_errors=True)
        shutil.rmtree(store.BUILD_DIR / application_id, ignore_errors=True)
        detail = str(exc) if isinstance(exc, ValueError) else "Upload must be a valid ZIP archive"
        raise HTTPException(422, detail) from exc

    now = utc_now()
    store.create_application({
        "id": application_id, "name": name, "status": "queued", "build_id": build_id,
        "build_status": "queued", "build_error": None, "twin_id": None,
        "image_tag": None, "container_id": None, "network_name": None,
        "proxy_image_tag": None, "proxy_container_id": None, "proxy_network_name": None,
        "app_port": app_port, "target_url": None, "created_at": now, "updated_at": now,
    })
    background_tasks.add_task(run_build, application_id, build_id, context_path, app_port)
    return public_application(store.get_application(application_id))


@router.get("/applications")
def list_applications():
    return [public_application(record) for record in store.list_applications()]


@router.get("/applications/{application_id}")
def get_application(application_id: str):
    record = store.get_application(application_id)
    if not record:
        raise HTTPException(404, "Application not found")
    return public_application(record)


@router.post("/applications/{application_id}/stop")
def stop_application(application_id: str):
    record = store.get_application(application_id)
    if not record:
        raise HTTPException(404, "Application not found")
    if not record["container_id"]:
        raise HTTPException(409, "Twin container is not available")
    try:
        container = TwinDockerManager().stop(record["container_id"], record.get("proxy_container_id"))
    except DockerUnavailable as exc:
        raise HTTPException(503, str(exc)) from exc
    except Exception as exc:
        raise HTTPException(502, f"Could not stop twin: {exc}") from exc
    store.update_application(application_id, status=container.status, updated_at=utc_now())
    return public_application(store.get_application(application_id))


@router.post("/applications/{application_id}/start")
def start_application(application_id: str):
    record = store.get_application(application_id)
    if not record:
        raise HTTPException(404, "Application not found")
    if not record["container_id"]:
        raise HTTPException(409, "Twin container is not available")
    try:
        container, target_url = TwinDockerManager().start(record["container_id"], record.get("proxy_container_id"))
    except DockerUnavailable as exc:
        raise HTTPException(503, str(exc)) from exc
    except Exception as exc:
        raise HTTPException(502, f"Could not start twin: {exc}") from exc
    store.update_application(
        application_id, status=container.status, target_url=target_url, updated_at=utc_now()
    )
    return public_application(store.get_application(application_id))


@router.delete("/applications/{application_id}", status_code=204)
def delete_application(application_id: str):
    record = store.get_application(application_id)
    if not record:
        raise HTTPException(404, "Application not found")
    if record["container_id"] or record["proxy_container_id"]:
        try:
            TwinDockerManager().remove(
                record["container_id"], record["network_name"], record["image_tag"],
                record.get("proxy_container_id"), record.get("proxy_network_name"),
                record.get("proxy_image_tag"),
            )
        except DockerUnavailable as exc:
            raise HTTPException(503, str(exc)) from exc
    shutil.rmtree(store.UPLOAD_DIR / application_id, ignore_errors=True)
    shutil.rmtree(store.BUILD_DIR / application_id, ignore_errors=True)
    store.delete_application(application_id)
