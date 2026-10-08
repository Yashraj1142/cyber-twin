import os
import zipfile

# Define the flat file structure for the backend API
files = {
    "requirements.txt": "fastapi==0.104.1\nuvicorn==0.24.0\nwebsockets==12.0",
    
    # Dockerfile is now at the root
    "Dockerfile": "FROM python:3.9-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nEXPOSE 8000\nCMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]",
    
    "main.py": """import asyncio
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
    return {"message": "CYBER-TWIN API is running", "endpoints": ["/health", "/api/v1/agents/red/start", "/ws/simulations/{id}"]}

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
    await websocket.close()""",

    "README.md": """# CYBER-TWIN MVP Backend

This archive contains the backend API for the CYBER-TWIN MVP.

## Endpoints

- `GET /` - Root endpoint with API info
- `GET /health` - Health check
- `POST /api/v1/agents/red/start` - Start red agent simulation
- `WS /ws/simulations/{id}` - WebSocket for simulation events

## Docker

Build and run:
```bash
docker build -t cyber-twin-api .
docker run -p 8000:8000 cyber-twin-api
```
"""
}

base_dir = "cyber_twin_api"
os.makedirs(base_dir, exist_ok=True)

# Write all files to the root of the directory
for file_path, content in files.items():
    full_path = os.path.join(base_dir, file_path)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

# Compress the directory into a zip file
zip_filename = "cyber_twin_api_root1.zip"
with zipfile.ZipFile(zip_filename, "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, _, filenames in os.walk(base_dir):
        for file in filenames:
            file_path = os.path.join(root, file)
            # Store files directly at the root of the ZIP
            arcname = os.path.relpath(file_path, base_dir)
            zipf.write(file_path, arcname)

print(f"Successfully generated '{zip_filename}' with the Dockerfile at the root.")