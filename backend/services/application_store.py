import os
import sqlite3
from contextlib import contextmanager
from pathlib import Path


DATA_DIR = Path(os.getenv("CYBERTWIN_DATA_DIR", Path(__file__).resolve().parents[1] / "data"))
UPLOAD_DIR = DATA_DIR / "uploads"
BUILD_DIR = DATA_DIR / "builds"
DATA_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
BUILD_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = DATA_DIR / "cyber_twin.sqlite3"


@contextmanager
def connect():
    connection = sqlite3.connect(DB_PATH, timeout=15)
    connection.row_factory = sqlite3.Row
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


def initialize():
    with connect() as db:
        db.execute("PRAGMA journal_mode=WAL")
        db.execute(
            """CREATE TABLE IF NOT EXISTS applications (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                status TEXT NOT NULL,
                build_id TEXT NOT NULL,
                build_status TEXT NOT NULL,
                build_error TEXT,
                twin_id TEXT,
                image_tag TEXT,
                container_id TEXT,
                network_name TEXT,
                proxy_image_tag TEXT,
                proxy_container_id TEXT,
                proxy_network_name TEXT,
                app_port INTEGER NOT NULL,
                target_url TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )"""
        )
        columns = {row[1] for row in db.execute("PRAGMA table_info(applications)")}
        for name in ("proxy_image_tag", "proxy_container_id", "proxy_network_name"):
            if name not in columns:
                db.execute(f"ALTER TABLE applications ADD COLUMN {name} TEXT")


def create_application(record):
    fields = (
        "id", "name", "status", "build_id", "build_status", "build_error",
        "twin_id", "image_tag", "container_id", "network_name",
        "proxy_image_tag", "proxy_container_id", "proxy_network_name", "app_port",
        "target_url", "created_at", "updated_at",
    )
    with connect() as db:
        db.execute(
            f"INSERT INTO applications ({','.join(fields)}) VALUES ({','.join('?' for _ in fields)})",
            tuple(record[field] for field in fields),
        )


def get_application(application_id):
    with connect() as db:
        row = db.execute("SELECT * FROM applications WHERE id = ?", (application_id,)).fetchone()
        return dict(row) if row else None


def list_applications():
    with connect() as db:
        return [dict(row) for row in db.execute("SELECT * FROM applications ORDER BY created_at DESC")]


def update_application(application_id, **fields):
    if not fields:
        return
    assignments = ", ".join(f"{field} = ?" for field in fields)
    with connect() as db:
        db.execute(
            f"UPDATE applications SET {assignments} WHERE id = ?",
            (*fields.values(), application_id),
        )


def delete_application(application_id):
    with connect() as db:
        db.execute("DELETE FROM applications WHERE id = ?", (application_id,))


initialize()
