# Cyber Twin sample app

This tiny HTTP service is the first uploadable application for the local ZIP-to-Docker flow.

1. ZIP the contents of this directory (the ZIP root must contain `Dockerfile`).
2. In the frontend, choose the ZIP and set the application port to `8000`.
3. When the build completes, open the returned loopback URL. `/health` returns a small JSON health response.

The backend's Docker daemon access is privileged. Use this sample or other source you trust; do not use this development flow with untrusted archives or expose the API to the network.
