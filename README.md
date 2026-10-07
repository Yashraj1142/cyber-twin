# CYBER-TWIN local ZIP-to-Docker slice

## Run locally

Prerequisites: Python 3.10+ with pip, Node.js 20.19+ or 22.12+ with npm, and Docker Desktop with its Linux container engine running. On Windows, Docker Desktop must be in Linux container mode; its WSL 2 backend is supported.

From the repository root, install the backend dependencies and start the API:

```powershell
python -m pip install -r requirements.txt
python -m uvicorn backend.main:app --reload
```

In another terminal, start the frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL (normally `http://localhost:5173`), then choose **Add Application**. The sample ZIP is available from that page. It exposes `/` and `/health` on container port `8000`; the backend displays the loopback URL published by the proxy after the build finishes.

## ZIP upload and Docker layout

The ZIP must contain a `Dockerfile` at its root or in one top-level directory. Set the UI's container port to the port the app listens on (default `8000`). The API currently does not generate a Dockerfile from `requirements.txt`. Uploads are limited to 50 MiB compressed, 200 MiB extracted, and 5,000 entries.

The backend builds the uploaded app image and runs it only on an internal Docker bridge. It builds a trusted proxy from `digital_twin/docker/proxy/Dockerfile` and `default.conf.template`; that Nginx sidecar joins the internal bridge and a separate bridge, and publishes a dynamically selected port on `127.0.0.1`. The app URL shown in the UI points to the proxy. `digital_twin/docker/Dockerfile` and `digital_twin/docker/docker-compose.yml` are older templates and are not used by this upload flow.

The uploaded API MVP has no `/` route, so visiting the base URL returns FastAPI's `{"detail":"Not Found"}`. Use `/health` to check that service. The included sample app responds on both `/` and `/health`.

Set `VITE_API_BASE_URL` before starting Vite to use another local API URL. The backend data, upload archives, and build contexts are stored under `backend/data` by default; set `CYBERTWIN_DATA_DIR` to change that location.

## Trust boundary

This is a local development MVP. A Dockerfile can execute arbitrary build steps, and the backend uses the host Docker daemon. Only upload code you trust. Keep the API bound to localhost and do not expose it to the network. The target container stays on an internal per-application network with no published port. A small Nginx sidecar joins that network and a separate bridge, then publishes a loopback-only host port. The target gets CPU/memory/PID limits, a read-only root filesystem, dropped Linux capabilities, and no-new-privileges. Those runtime controls do not sandbox the image build itself; untrusted uploads require a disposable VM or isolated builder service.
