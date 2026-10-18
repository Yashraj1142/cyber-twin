# CYBER-TWIN AI Developer Knowledge Graph

## 1. System Overview
* **System Objective:** Simulate a real cyber attack-defense cycle against a safe, isolated copy of an authorized application/environment using AI Red, Blue, and Purple agents.[cite: 1]
* **Core Workflow:** Attack $\rightarrow$ Detect $\rightarrow$ Respond $\rightarrow$ Analyze $\rightarrow$ Improve $\rightarrow$ Attack Again.[cite: 1]

## 2. Entities and Relationships
* **Project:** A project contains the Application, Agent Runs (Red, Blue, Purple), Security Events, Incidents, Attack Paths, and Reports.[cite: 1]
* **Application:** Each application is associated with a Digital Twin.[cite: 1]
* **Digital Twin:** Contains the Application, API, Database, Network, Services, Users, and Security Controls.[cite: 1]
    * Managed by the Infrastructure Engineer.[cite: 1]
    * Accessed via a Local Connector.[cite: 1]
    * Operates within an Isolated Network and supports Snapshot/Rollback capabilities.[cite: 1]

## 3. Agent Ecosystem
* **Red Agent (Offensive):**
    * **Pipeline:** Attack planner $\rightarrow$ Attack-path generation $\rightarrow$ Tool selection $\rightarrow$ Controlled execution $\rightarrow$ Result interpretation.[cite: 1]
    * **Metrics:** Attack success rate, Attack path length, Time to objective, Successful vulnerability identification.[cite: 1]
* **Blue Agent (Defensive):**
    * **Pipeline:** Telemetry $\rightarrow$ Event collection $\rightarrow$ Detection $\rightarrow$ Correlation $\rightarrow$ Incident investigation $\rightarrow$ Risk scoring $\rightarrow$ Response.[cite: 1]
    * **Metrics:** Detection rate, False positive rate, Mean Time to Detect (MTTD), Mean Time to Respond (MTTR).[cite: 1]
* **Purple Agent (Analytical):**
    * **Pipeline:** Correlates Red and Blue activity $\rightarrow$ Identifies Detection gaps $\rightarrow$ Generates Security recommendations.[cite: 1]
    * **Metrics:** Detection-gap identification accuracy, MITRE technique coverage, Recommendation quality.[cite: 1]

## 4. Testing Framework
* **Unit Testing:** Each developer tests their own module (Red Agent, Blue Agent, Twin, API).[cite: 1]
* **Integration Testing:** Tests interactions such as Red $\rightarrow$ Twin, Blue $\rightarrow$ Telemetry, and Purple $\rightarrow$ Red + Blue.[cite: 1]
* **System Testing:** Validates the entire application flow from User $\rightarrow$ Simulation $\rightarrow$ Report.[cite: 1]
* **Security Testing:** Tests CYBER-TWIN's own authentication, API authorization, container escape resistance, secret exposure, and prompt injection resistance.[cite: 1]

## 5. MVP Requirements
* **Scope:** 1 application, 1 Digital Twin, 1 Red scenario, 1 Blue detection, 1 Purple analysis, and 1 dashboard.[cite: 1]

## 6. Frontend and Source Onboarding
* **Implemented frontend:** The React/Vite application is under `frontend/` (not `dashboard/`). Recent frontend commits add login/register, dashboard, projects/project overview, Digital Twin, simulations, Red Agent, Blue SOC, Purple Analysis, incidents, vulnerabilities, MITRE ATT&CK, reports, and settings pages, with shared layout/components and styling. Routes are defined in `frontend/src/App.jsx`.
* **Digital Twin UI status:** `frontend/src/pages/twin/DigitalTwin.jsx` renders topology nodes, environment selection, status/metrics, health and event panels. These are hard-coded sample values. “Sync Twin” only toggles a local spinner for 800ms; the other buttons have no backend action. There is no upload input, source path field, build form, or connector selection.
* **Backend integration status:** The new application onboarding page uses `fetch` against `VITE_API_BASE_URL` (default `http://127.0.0.1:8000`) for ZIP upload, build status polling, and twin start/stop/delete. Existing login/register, project, simulation, and Twin dashboard pages remain presentation-only.
* **Source onboarding:** ZIP upload is implemented for local development. The archive must contain a `Dockerfile` at its root or inside one top-level folder; the backend does not yet generate one from `requirements.txt`. The user supplies the container's listening port (default `8000`). The UI shows build progress and the resulting loopback URL. Local path selection through a trusted connector remains planned; backend paths must never be treated as a user's local path.
* **Relationship:** `Frontend` submits a ZIP and application settings to `Backend API`; the API validates and extracts the archive, records build state in SQLite, and builds/starts the app image plus an optional `demo/Dockerfile` target image. The app and demo target share a per-application internal network with no published container ports. A trusted Nginx sidecar joins that network and a separate bridge, publishes a loopback-only host port, routes `/` to the dashboard/API and `/demo/` to the target login page. The UI polls status and can start, stop, or delete the app, optional demo target, and proxy.
* **Build boundary:** `SourceArchive` -> ZIP validation and build context -> per-application `DockerImage` -> constrained `TwinContainer` on an internal network -> trusted reverse proxy on a separate bridge -> loopback URL. The image represents the supplied application itself, not the CYBER-TWIN backend image. Local path resolution via a connector remains future work. Runtime limits, no privileged mode, secret handling, build isolation, and artifact cleanup are part of the sandbox policy.

## 7. Backend API Mapping and Current Implementation Status
* The architecture document proposes `/api/v1/applications/*`, `/api/v1/twins/*`, `/api/v1/connectors/*`, health endpoints, snapshot endpoints, and `/ws/simulations/{id}`. The MVP implements `POST /api/v1/applications` (multipart ZIP upload and background build), `GET /api/v1/applications`, `GET /api/v1/applications/{id}`, `POST /api/v1/applications/{id}/start`, `POST /api/v1/applications/{id}/stop`, `DELETE /api/v1/applications/{id}`, and `/health`, with SQLite persistence. Agent, simulation, snapshot, connector, telemetry, and live-event APIs remain unimplemented.
* The original connector still posts to `/connectors/register` and `/{connector_id}/heartbeat`, but those routes do not exist in the backend. The new ZIP flow does not depend on that connector. The connector has no source path, build, twin lifecycle, status, or command handling API.
* The original Docker Compose template still cannot build the supplied application. The new API builds each uploaded ZIP's Dockerfile as its own Docker image, separate from the CYBER-TWIN backend.
* Remaining API work includes authentication/project authorization, build cancellation and retry, health checks beyond container running state, and live event streaming. The MVP rejects ZIP traversal and symlinks, caps archives at 200 MiB compressed / 200 MiB expanded / 12,000 entries, keeps app and optional demo containers on an internal network, publishes only the trusted proxy on loopback, and applies runtime limits. Building uploaded Dockerfiles executes their instructions with access to the host Docker daemon; accept trusted source only and keep the development API local.

## 8. Implemented Digital Twin Components (Current Checkout)
* `backend/api/v1/router.py` provides the first ZIP upload, build status, and twin lifecycle endpoints. `backend/services/application_store.py` persists metadata in SQLite; `backend/services/docker_manager.py` builds the target and trusted Nginx proxy, keeping the target on an internal bridge and exposing only the proxy on loopback.
* `frontend/src/pages/applications/NewApplication.jsx` provides the upload/build/start/stop/delete UI. `samples/dockerized-web-app/` and `frontend/public/sample-app.zip` provide a small example to upload.
* `digital_twin/docker/proxy/Dockerfile` and `default.conf.template` define the trusted Nginx reverse proxy. It listens on container port `8080`, forwards HTTP and WebSocket traffic to the target's user-supplied port, and is the only container with a loopback-published host port. The target itself has no host port binding. This avoids Docker's behavior where a container connected only to an `internal` bridge can have a stored port binding without an active published port.
* If an uploaded archive contains `demo/Dockerfile`, the manager builds and starts that as a second image/container on the same internal network. Nginx routes `/demo/` to this container while `/` and `/api` go to the app image. The Red Agent uses the Docker DNS name `cybertwin-demo-<application_id>:3000` to reach it. ZIPs without this optional Dockerfile keep the single-app behavior.
* `digital_twin/docker/docker-compose.yml` sketches a target app, Postgres, connector, and internal bridge network. It remains a template and is not used by the new ZIP flow.
* `digital_twin/docker/Dockerfile` is a generic Python/uvicorn template. It installs unpinned dependencies as root, installs curl/netcat, and does not set runtime restrictions; it should not be used as a safe arbitrary-source builder without hardening.
* `digital_twin/snapshots/twin-manager.py` can inspect a named container, commit its writable layer, and replace it with an image on a hard-coded network. It is not called by an API. Snapshot pause/unpause is not protected by `finally`, and the replacement does not retain the original container configuration, mounts, ports, environment, or resource limits.
* `digital_twin/connector/local-connector.py` registers and heartbeats in a loop. It lacks request timeouts, authentication, TLS configuration, retry backoff beyond a fixed delay, and Docker/build command handling. The heartbeat loop catches only connection errors.

## 9. Docker Files, Runtime Topology, and Isolation
* **App image:** Built from the uploaded archive's root Dockerfile and context. For the full-stack MVP this image serves the dashboard and FastAPI on container port 8000. `requirements.txt` is application input for that Dockerfile, not a build recipe the platform currently interprets.
* **Internal services:** The app container runs on `cybertwin-<application_id>`, an `internal=true` bridge, with 256 MiB memory, 0.5 CPU, 128 PIDs, all capabilities dropped, `no-new-privileges`, read-only root, and a 32 MiB `/tmp` tmpfs. If `demo/Dockerfile` exists, a separate demo container joins the same network with 128 MiB memory, 0.25 CPU, 64 PIDs, all capabilities dropped, read-only root, and a 16 MiB `/tmp` tmpfs. Neither service gets a host port.
* **Proxy image and container:** Built from `digital_twin/docker/proxy/Dockerfile` plus `default.conf.template`. The Nginx container joins the internal service network and `cybertwin-proxy-<application_id>` (a separate bridge). It runs as UID/GID 101, listens on container port 8080, routes `/` to the app and `/demo/` to the optional demo target, supports WebSocket upgrades for the API, and binds a dynamically selected host port only to `127.0.0.1`. The returned app URL points to the proxy.
* **Other Docker files:** `digital_twin/docker/Dockerfile` and `digital_twin/docker/docker-compose.yml` are legacy templates and are not involved in ZIP onboarding. `samples/dockerized-web-app/Dockerfile` builds the sample app; `frontend/public/sample-app.zip` is the ready-to-upload archive.
* **Lifecycle and persistence:** SQLite stores application/build status, app/proxy/optional demo image tags and container IDs, network names, app port, loopback URL, and demo login URL under `backend/data/cyber_twin.sqlite3`. Uploads and extracted contexts are stored in `backend/data/uploads` and `backend/data/builds`; `CYBERTWIN_DATA_DIR` changes the root directory. Stop/start controls the app, optional demo target, and proxy; delete removes their containers, networks, images, and local source copies.

## 10. Project Prerequisites and Local Startup
* **Prerequisites:** Python 3.10 or newer with pip, Node.js 20.19+ or 22.12+ with npm (Vite 8 requirement), and Docker Desktop with the Linux container engine running. On Windows, use Docker Desktop's Linux container mode (WSL 2 is supported). The first build may need network access to download the target's base image, the `nginx:alpine` proxy base, and application dependencies.
* **Backend dependencies:** `requirements.txt` installs FastAPI, Uvicorn, Docker SDK for Python, and `python-multipart` for ZIP form uploads.
* **Frontend dependencies:** `frontend/package.json` installs React, React DOM, React Router, Lucide icons, Vite, and Oxlint.
* **Start the API from the repository root:** `python -m pip install -r requirements.txt`, then `python -m uvicorn backend.main:app --reload`. The API defaults to `http://127.0.0.1:8000` and `/health` should return `{"status":"ok"}`.
* **Start the UI in a second terminal:** `cd frontend`, `npm install`, then `npm run dev`. Open the Vite URL, usually `http://localhost:5173`, and use **Add Application**. `VITE_API_BASE_URL` overrides the API URL.
* **Sample behavior:** The sample ZIP serves JSON at `/` and `/health` on container port 8000. The uploaded API MVP has no root route, so `/` returns `{"detail":"Not Found"}` by design; its `/health` route verifies the service.
* **Trust boundary:** This is a local development flow for trusted source. The backend controls the host Docker daemon, and Dockerfile build steps execute during image creation. Do not expose the API to the network or accept untrusted archives; container runtime restrictions do not sandbox the image build.

## 11. Full-Stack API MVP Package
* The earlier API-only archive had no frontend route, so `/` correctly returned FastAPI `{"detail":"Not Found"}`. The dashboard now builds with React Scripts and is copied into the FastAPI image as static assets.
* `mvp/cyber_twin_mvp/Dockerfile` is a multi-stage build: Node 24 runs `npm ci` and builds `dashboard/`; Python runs `backend/main.py` and serves the compiled files from `backend/static` (the image's `/app/static`). Node 24 replaced the Node 18 stage after the uploaded build reported `npm ci` failure; the complete Docker image now builds successfully. One container and one uploaded port (`8000`) serve both frontend and API.
* FastAPI serves `/` and React routes from the dashboard, retains `/health` and `/api/v1/agents/red/start`, and continues to stream simulation events at `/ws/simulations/{simulation_id}`. The dashboard calls the API and opens WebSockets on `window.location`, so it follows the published proxy URL rather than a hard-coded localhost endpoint.
* The dashboard simulation button runs the planner, allowlist selector, state machine, and HTTP executor described by `agents/red/test_red_agent.py`. The three permitted steps are `http_recon` (T1595), `security_header_check`, and a maximum of three fixed credential checks (T1110) against the separate demo-target image. Each credential attempt/result streams to the dashboard and is recorded by the target; `/demo/` polls the target's bounded activity feed and displays accepted/rejected attempts live. The agent uses the private Docker network endpoint.
* The demo target is built from `demo/Dockerfile` and runs as its own container on the internal network at `cybertwin-demo-<application_id>:3000`. Nginx exposes its login page at `/demo/`; the Red Agent calls its private Docker DNS endpoint. The executor rejects all other hosts; arbitrary shell actions and external targets are unavailable. Agent results stream over the simulation WebSocket.
* `mvp/cyber_twin_fullstack.zip` is the clean upload bundle. `mvp/package_cyber_twin_fullstack.py` recreates it from the app Dockerfile, optional demo Dockerfile, API and agent source, package manifests, frontend source, and public files; it excludes `node_modules` and generated build output. Upload it through **Add Application** with container port `8000` to create a new twin URL; the demo login is at `<new URL>/demo/`.
* Validation recorded for this package: React production build and Docker build completed successfully; the Red Agent streamed reconnaissance, missing headers, and the accepted demo credentials through its WebSocket. The upload archive contains both Dockerfiles and required source files without `node_modules`.
