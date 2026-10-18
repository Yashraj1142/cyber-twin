import asyncio
import os
from pathlib import Path
import uuid

from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from red_agent import RedAgent

app = FastAPI(title="CYBER-TWIN Demo App")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

STATIC_DIR = Path(__file__).resolve().parent / "static"
DEMO_TARGET_URL = os.getenv("DEMO_TARGET_URL", "http://127.0.0.1:3000")
MAX_SIMULATION_CHANNELS = 32
simulation_queues = {}


@app.get("/health")
def health_check():
    return {"status": "online", "service": "cyber-twin-demo"}


@app.post("/api/v1/agents/red/start")
async def start_red_agent():
    if len(simulation_queues) >= MAX_SIMULATION_CHANNELS:
        raise HTTPException(status_code=429, detail="Too many recent demo runs; retry shortly")

    simulation_id = uuid.uuid4().hex[:12]
    events = asyncio.Queue()
    simulation_queues[simulation_id] = events

    async def emit_event(message):
        await events.put(message)

    async def run_agent():
        try:
            await RedAgent(DEMO_TARGET_URL, emit_event).run()
        except Exception as exc:
            await emit_event(f"RED: Simulation failed: {exc}")
        finally:
            await events.put(None)

    asyncio.create_task(run_agent())
    return {
        "message": "Red Agent execution started against the bundled demo target",
        "simulation_id": simulation_id,
        "target": DEMO_TARGET_URL,
    }


@app.websocket("/ws/simulations/{simulation_id}")
async def simulation_websocket(websocket: WebSocket, simulation_id: str):
    events = simulation_queues.get(simulation_id)
    if events is None:
        await websocket.close(code=4404)
        return

    await websocket.accept()
    while True:
        event = await events.get()
        if event is None:
            break
        await websocket.send_text(event)
    await websocket.close()
    simulation_queues.pop(simulation_id, None)


@app.get("/", include_in_schema=False)
@app.get("/{asset_path:path}", include_in_schema=False)
async def serve_dashboard(asset_path: str = ""):
    if asset_path in {"api", "ws"} or asset_path.startswith(("api/", "ws/")):
        raise HTTPException(status_code=404, detail="Not Found")

    static_root = STATIC_DIR.resolve()
    requested_file = (static_root / asset_path).resolve()
    if requested_file != static_root and static_root not in requested_file.parents:
        raise HTTPException(status_code=404, detail="Not Found")

    if requested_file.is_file():
        return FileResponse(requested_file)

    index_file = static_root / "index.html"
    if index_file.is_file():
        return FileResponse(index_file)

    raise HTTPException(status_code=404, detail="Dashboard assets are missing")
