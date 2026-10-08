import asyncio
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CYBER-TWIN API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "online", "service": "cyber-twin-orchestrator"}

@app.get("/")
def root():
    return {
        "message": "CYBER-TWIN API is running",
        "endpoints": [
            "/health",
            "/api/v1/agents/red/start",
            "/ws/simulations/{id}"
        ]
    }

@app.post("/api/v1/agents/red/start")
async def start_red_agent():
    return {"message": "Red Agent execution started", "simulation_id": "sim_001"}

@app.websocket("/ws/simulations/{simulation_id}")
async def simulation_websocket(websocket: WebSocket, simulation_id: str):
    await websocket.accept()
    events = [
        "🔴 Red Agent: Reconnaissance started",
        "🔴 Red Agent: Attack path identified (Port 80)",
        "🔵 Blue Agent: Suspicious request detected",
        "🔵 Blue Agent: Incident created",
        "🟣 Purple Agent: Detection gap identified",
        "System: Simulation completed"
    ]
    for event in events:
        await asyncio.sleep(1.5)
        await websocket.send_text(event)
    await websocket.close()