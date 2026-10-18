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

The ZIP must contain a `Dockerfile` at its root or in one top-level directory. Set the UI's container port to the port the app listens on (default `8000`). The API currently does not generate a Dockerfile from `requirements.txt`. An optional `demo/Dockerfile` builds a separate target image on the private twin network. Uploads are limited to 200 MiB compressed, 200 MiB extracted, and 12,000 entries.

The backend builds the uploaded app image and runs it only on an internal Docker bridge. If `demo/Dockerfile` is present, it also builds a separate demo-target image and runs it on that same private bridge. A trusted proxy built from `digital_twin/docker/proxy/Dockerfile` and `default.conf.template` joins the internal bridge and a separate bridge, publishes a dynamically selected port on `127.0.0.1`, routes `/` to the dashboard/API, and routes `/demo/` to the demo login page. The Red Agent reaches the target by its private Docker DNS name. `digital_twin/docker/Dockerfile` and `digital_twin/docker/docker-compose.yml` are older templates and are not used by this upload flow.

An API-only upload with no frontend returns FastAPI's `{"detail":"Not Found"}` at `/`. The full-stack MVP archive serves its dashboard at `/` and the separate demo login UI at `/demo/`; the Red Agent checks that target internally. Use `/health` to check the app API.

Set `VITE_API_BASE_URL` before starting Vite to use another local API URL. The backend data, upload archives, and build contexts are stored under `backend/data` by default; set `CYBERTWIN_DATA_DIR` to change that location.

## Trust boundary

This is a local development MVP. Dockerfile build steps execute with host Docker daemon access; only upload trusted code and keep the API bound to localhost. The app and optional demo target containers have no published host ports and stay on an internal per-application network. Nginx is the only container with a loopback-published port. All runtime containers get resource limits, read-only roots, dropped capabilities, and no-new-privileges. The demo Red Agent can only access the demo service over that private network. Runtime controls do not sandbox image builds; untrusted uploads require a disposable VM or isolated builder service.
