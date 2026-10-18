from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


REPO_ROOT = Path(__file__).resolve().parents[1]
PACKAGE_ROOT = REPO_ROOT / "mvp" / "cyber_twin_mvp"
OUTPUT = REPO_ROOT / "mvp" / "cyber_twin_fullstack.zip"

INCLUDED_FILES = [
    (PACKAGE_ROOT / "Dockerfile", "Dockerfile"),
    (PACKAGE_ROOT / "backend" / "main.py", "backend/main.py"),
    (PACKAGE_ROOT / "backend" / "red_agent.py", "backend/red_agent.py"),
    (PACKAGE_ROOT / "backend" / "requirements.txt", "backend/requirements.txt"),
    (PACKAGE_ROOT / "dashboard" / "package.json", "dashboard/package.json"),
    (PACKAGE_ROOT / "dashboard" / "package-lock.json", "dashboard/package-lock.json"),
    (REPO_ROOT / "mvp" / "demo" / "app.py", "demo/app.py"),
    (REPO_ROOT / "mvp" / "demo" / "Dockerfile", "demo/Dockerfile"),
    (REPO_ROOT / "mvp" / "demo" / "requirements.txt", "demo/requirements.txt"),
    (REPO_ROOT / "agents" / "core" / "__init__.py", "agents/core/__init__.py"),
    (REPO_ROOT / "agents" / "core" / "state_machine.py", "agents/core/state_machine.py"),
    (REPO_ROOT / "agents" / "red" / "__init__.py", "agents/red/__init__.py"),
    (REPO_ROOT / "agents" / "red" / "planner.py", "agents/red/planner.py"),
    (REPO_ROOT / "agents" / "red" / "selector.py", "agents/red/selector.py"),
    (REPO_ROOT / "agents" / "red" / "executor.py", "agents/red/executor.py"),
]
INCLUDED_DIRS = [
    (PACKAGE_ROOT / "dashboard" / "src", "dashboard/src"),
    (PACKAGE_ROOT / "dashboard" / "public", "dashboard/public"),
]

with ZipFile(OUTPUT, "w", compression=ZIP_DEFLATED, compresslevel=6) as archive:
    for file_path, archive_name in INCLUDED_FILES:
        archive.write(file_path, archive_name)
    for directory, archive_prefix in INCLUDED_DIRS:
        for file_path in sorted(directory.rglob("*")):
            if file_path.is_file():
                relative_path = file_path.relative_to(directory).as_posix()
                archive.write(file_path, f"{archive_prefix}/{relative_path}")

print(f"Created {OUTPUT}")
