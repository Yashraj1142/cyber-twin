# Docker build trust boundary

The first local-development flow accepts ZIPs containing a Dockerfile. Building a Dockerfile executes its instructions and the backend talks to the host Docker daemon, which is highly privileged. Only upload source you trust. Do not expose this development API to the network or accept uploads from untrusted users. For untrusted source, move builds into a disposable VM or isolated builder service before enabling uploads.

The resulting runtime container is placed on a per-application internal bridge network, published only on host loopback, and started with memory, CPU, PID, read-only-root-filesystem, dropped-capability, and no-new-privileges settings. These controls reduce runtime impact; they do not make an untrusted image build safe.
