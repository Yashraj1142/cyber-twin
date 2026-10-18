# CYBER-TWIN full-stack MVP

This package serves the React dashboard and FastAPI Red Agent API from one container, plus a separate Flask demo-target image. The API serves the dashboard at `/`, health at `/health`, the Red Agent trigger at `/api/v1/agents/red/start`, and live events at `/ws/simulations/{simulation_id}`. The demo login page is available at `/demo/` on the returned proxy URL.

## Upload it to the local twin builder

Use `mvp/cyber_twin_fullstack.zip` from the repository. In the CYBER-TWIN UI, choose **Add Application**, upload this archive, and set the container port to `8000`. The ZIP has a Dockerfile at its root and a second Dockerfile at `demo/Dockerfile`; it excludes `node_modules`.

## Docker layout

The root `Dockerfile` uses Node 24 to build the dashboard, then copies its React output into the Python/FastAPI image. The builder also builds `demo/Dockerfile` as a distinct target image. The API and demo target share a private internal Docker network; neither target gets a host port. The trusted Nginx sidecar publishes the loopback URL, routes `/` to the dashboard/API, and routes `/demo/` to the target login UI.

The **Run scoped Red Agent** button executes the three-step plan from `agents/red/planner.py`: HTTP reconnaissance, security-header review, and at most three fixed credential checks against `cybertwin-demo-<id>:3000` on the private network. Each attempt and result streams to the dashboard and appears in the `/demo/` login page's live activity panel. The executor rejects other hosts and unapproved actions. The demo credentials are intentionally weak test fixtures; do not reuse them.

To build the dashboard/API image without the twin builder, run `docker build -t cyber-twin-mvp .` from this directory, then `docker run --rm -p 8000:8000 cyber-twin-mvp`. Note that this direct command does not start the separate demo target or proxy. The twin builder handles all three containers together.

Only use source you trust. Docker builds execute Dockerfile instructions through the host Docker daemon.
