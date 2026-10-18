import socket
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import urlopen

import docker


class DockerUnavailable(RuntimeError):
    pass


PROXY_CONTEXT = Path(__file__).resolve().parents[2] / "digital_twin" / "docker" / "proxy"


class TwinDockerManager:
    def __init__(self):
        try:
            self.client = docker.from_env(timeout=120)
            self.client.ping()
        except Exception as exc:
            raise DockerUnavailable("Docker is unavailable. Start Docker Desktop and retry.") from exc

    def build_and_start(self, app_id, build_id, context_path, app_port):
        context_path = Path(context_path)
        demo_context = context_path / "demo"
        has_demo = (demo_context / "Dockerfile").is_file()

        app_image = f"cyber-twin/{app_id}:{build_id}"
        proxy_image = f"cyber-twin-proxy/{app_id}:{build_id}"
        demo_image = f"cyber-twin-demo/{app_id}:{build_id}" if has_demo else None
        app_network_name = f"cybertwin-{app_id}"
        proxy_network_name = f"cybertwin-proxy-{app_id}"
        app_name = f"cybertwin-app-{app_id}"
        proxy_name = f"cybertwin-proxy-{app_id}"
        demo_name = f"cybertwin-demo-{app_id}" if has_demo else None

        app_network = None
        proxy_network = None
        app_container = None
        proxy_container = None
        demo_container = None
        try:
            self.client.images.build(path=str(context_path), tag=app_image, rm=True, forcerm=True)
            self.client.images.build(path=str(PROXY_CONTEXT), tag=proxy_image, rm=True, forcerm=True)
            if has_demo:
                self.client.images.build(path=str(demo_context), tag=demo_image, rm=True, forcerm=True)

            app_network = self.client.networks.create(
                app_network_name,
                driver="bridge",
                internal=True,
                labels={"cybertwin.application": app_id, "cybertwin.role": "private-services"},
            )
            proxy_network = self.client.networks.create(
                proxy_network_name,
                driver="bridge",
                internal=False,
                labels={"cybertwin.application": app_id, "cybertwin.role": "proxy"},
            )

            if has_demo:
                demo_container = self.client.containers.run(
                    demo_image,
                    name=demo_name,
                    detach=True,
                    network=app_network.name,
                    user="10001:10001",
                    mem_limit="128m",
                    nano_cpus=250_000_000,
                    pids_limit=64,
                    cap_drop=["ALL"],
                    security_opt=["no-new-privileges:true"],
                    read_only=True,
                    tmpfs={"/tmp": "rw,noexec,nosuid,size=16m"},
                    labels={"cybertwin.application": app_id, "cybertwin.build": build_id, "cybertwin.role": "demo-target"},
                    restart_policy={"Name": "no"},
                )

            app_environment = {}
            if has_demo:
                app_environment["DEMO_TARGET_URL"] = f"http://{demo_name}:3000"
            app_container = self.client.containers.run(
                app_image,
                name=app_name,
                detach=True,
                network=app_network.name,
                environment=app_environment,
                mem_limit="256m",
                nano_cpus=500_000_000,
                pids_limit=128,
                cap_drop=["ALL"],
                security_opt=["no-new-privileges:true"],
                read_only=True,
                tmpfs={"/tmp": "rw,noexec,nosuid,size=32m"},
                labels={"cybertwin.application": app_id, "cybertwin.build": build_id, "cybertwin.role": "dashboard-api"},
                restart_policy={"Name": "no"},
            )

            host_port = self._reserve_loopback_port()
            proxy_container = self.client.containers.create(
                proxy_image,
                name=proxy_name,
                detach=True,
                network=proxy_network.name,
                ports={"8080/tcp": ("127.0.0.1", host_port)},
                environment={
                    "APP_HOST": app_name,
                    "APP_PORT": str(app_port),
                    "DEMO_ENABLED": "1" if has_demo else "0",
                    "DEMO_HOST": demo_name or app_name,
                    "DEMO_PORT": "3000" if has_demo else str(app_port),
                    "NGINX_ENVSUBST_FILTER": "^(APP|DEMO)_",
                },
                user="101:101",
                mem_limit="64m",
                nano_cpus=250_000_000,
                pids_limit=64,
                cap_drop=["ALL"],
                security_opt=["no-new-privileges:true"],
                read_only=True,
                tmpfs={
                    "/tmp": "rw,noexec,nosuid,size=8m,uid=101,gid=101",
                    "/var/cache/nginx": "rw,noexec,nosuid,size=16m,uid=101,gid=101",
                    "/var/run": "rw,noexec,nosuid,size=2m,uid=101,gid=101",
                    "/etc/nginx/conf.d": "rw,noexec,nosuid,size=1m,uid=101,gid=101",
                },
                labels={"cybertwin.application": app_id, "cybertwin.build": build_id, "cybertwin.role": "proxy"},
                restart_policy={"Name": "no"},
            )
            app_network.connect(proxy_container)
            proxy_container.start()
            proxy_container.reload()

            binding = (proxy_container.attrs.get("NetworkSettings") or {}).get("Ports", {}).get("8080/tcp")
            if not binding:
                port_state = (proxy_container.attrs.get("NetworkSettings") or {}).get("Ports") or {}
                raise RuntimeError(
                    "Docker did not publish the loopback proxy port. "
                    f"PortBindings={proxy_container.attrs.get('HostConfig', {}).get('PortBindings')}; "
                    f"NetworkPorts={port_state}"
                )

            assigned_port = int(binding[0]["HostPort"])
            if has_demo:
                demo_url = f"http://127.0.0.1:{assigned_port}/demo/"
                self._wait_for_http(f"http://127.0.0.1:{assigned_port}/demo/health", timeout=30)
            else:
                demo_url = None
                self._wait_for_port(assigned_port, timeout=30)

            return {
                "image_tag": app_image,
                "proxy_image_tag": proxy_image,
                "demo_image_tag": demo_image,
                "network_name": app_network_name,
                "proxy_network_name": proxy_network_name,
                "container_id": app_container.id,
                "proxy_container_id": proxy_container.id,
                "demo_container_id": demo_container.id if demo_container else None,
                "target_url": f"http://127.0.0.1:{assigned_port}",
                "demo_url": demo_url,
            }
        except Exception:
            self._remove_if_present(proxy_container)
            self._remove_if_present(app_container)
            self._remove_if_present(demo_container)
            self._remove_network_if_present(proxy_network_name)
            self._remove_network_if_present(app_network_name)
            self._remove_image_if_present(proxy_image)
            self._remove_image_if_present(app_image)
            self._remove_image_if_present(demo_image)
            raise

    @staticmethod
    def _reserve_loopback_port():
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.bind(("127.0.0.1", 0))
            return sock.getsockname()[1]

    @staticmethod
    def _wait_for_port(host_port, timeout):
        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            try:
                with socket.create_connection(("127.0.0.1", host_port), timeout=1):
                    return
            except OSError:
                time.sleep(0.5)
        raise RuntimeError(f"Reverse proxy did not accept connections on host port {host_port} within {timeout} seconds")

    @staticmethod
    def _wait_for_http(url, timeout):
        deadline = time.monotonic() + timeout
        last_error = "no response"
        while time.monotonic() < deadline:
            try:
                with urlopen(url, timeout=1) as response:
                    if 200 <= response.status < 300:
                        return
                    last_error = f"HTTP {response.status}"
            except HTTPError as exc:
                last_error = f"HTTP {exc.code}"
            except URLError as exc:
                last_error = str(exc.reason)
            except OSError as exc:
                last_error = str(exc)
            time.sleep(0.5)
        raise RuntimeError(f"Demo target did not become healthy through the proxy: {last_error}")

    def stop(self, container_id, proxy_container_id=None, demo_container_id=None):
        app = self.client.containers.get(container_id)
        proxy = self.client.containers.get(proxy_container_id) if proxy_container_id else None
        demo = self.client.containers.get(demo_container_id) if demo_container_id else None
        for container in (proxy, app, demo):
            if container and container.status == "running":
                container.stop(timeout=10)
                container.reload()
        return app

    def start(self, container_id, proxy_container_id=None, demo_container_id=None):
        app = self.client.containers.get(container_id)
        proxy = self.client.containers.get(proxy_container_id) if proxy_container_id else None
        demo = self.client.containers.get(demo_container_id) if demo_container_id else None
        for container in (demo, app, proxy):
            if container and container.status != "running":
                container.start()
        app.reload()
        if not proxy:
            return app, None
        proxy.reload()
        binding = (proxy.attrs.get("NetworkSettings") or {}).get("Ports", {}).get("8080/tcp")
        host_port = int(binding[0]["HostPort"]) if binding else None
        return app, f"http://127.0.0.1:{host_port}" if host_port else None

    def remove(self, container_id, network_name, image_tag,
               proxy_container_id=None, proxy_network_name=None, proxy_image_tag=None,
               demo_container_id=None, demo_image_tag=None):
        self._remove_by_id(container_id)
        self._remove_by_id(proxy_container_id)
        self._remove_by_id(demo_container_id)
        self._remove_network_if_present(network_name)
        self._remove_network_if_present(proxy_network_name)
        self._remove_image_if_present(image_tag)
        self._remove_image_if_present(proxy_image_tag)
        self._remove_image_if_present(demo_image_tag)

    def _remove_by_id(self, container_id):
        if not container_id:
            return
        try:
            self.client.containers.get(container_id).remove(force=True)
        except docker.errors.NotFound:
            pass

    def _remove_if_present(self, container):
        if container:
            try:
                container.remove(force=True)
            except Exception:
                pass

    def _remove_network_if_present(self, name):
        if not name:
            return
        try:
            self.client.networks.get(name).remove()
        except docker.errors.NotFound:
            pass

    def _remove_image_if_present(self, tag):
        if not tag:
            return
        try:
            self.client.images.remove(tag, force=True)
        except docker.errors.NotFound:
            pass
