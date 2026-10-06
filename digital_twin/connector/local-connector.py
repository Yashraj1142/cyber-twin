import requests
import time
import os

ORCHESTRATOR_URL = os.getenv("ORCHESTRATOR_API", "http://localhost:8000/api/v1/connectors")
CONNECTOR_ID = "conn_twin_001"

def register_connector():
    """Registers the local connector with the main CYBER-TWIN backend."""
    payload = {"connector_id": CONNECTOR_ID, "status": "active"}
    response = requests.post(f"{ORCHESTRATOR_URL}/register", json=payload)
    return response.status_code == 200

def send_heartbeat():
    """Maintains health check ping with the orchestrator."""
    while True:
        try:
            requests.post(f"{ORCHESTRATOR_URL}/{CONNECTOR_ID}/heartbeat")
            time.sleep(30)
        except requests.exceptions.ConnectionError:
            print("Orchestrator unreachable. Retrying...")
            time.sleep(5)

if __name__ == "__main__":
    if register_connector():
        send_heartbeat()