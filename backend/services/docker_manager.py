import socket
import time
from pathlib import Path

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
        image_tag = f"cyber-twin/{app_id}:{build_id}"
        proxy_image_tag = f"cyber-twin-proxy/{app_id}:{build_id}"
        network_name = f"cybertwin-{app_id}"
        proxy_network_name = f"cybertwin-proxy-{app_id}"
        container_name = f"cybertwin-app-{app_id}"
        proxy_name = f"cybertwin-proxy-{app_id}"

        app_network = None
        proxy_network = None
        app_container = None
        proxy_container = None
        try:
            self.client.images.build(path=str(context_path), tag=image_tag, rm=True, forcerm=True)
            self.client.images.build(path=str(PROXY_CONTEXT), tag=proxy_image_tag, rm=True, forcerm=True)
            app_network = self.client.networks.create(
                network_name,
                driver="bridge",
                internal=True,
                labels={"cybertwin.application": app_id, "cybertwin.role": "target"},
            )
            # Only the trusted reverse proxy joins this host-facing bridge. The
            # user application remains attached exclusively to the internal net.
            proxy_network = self.client.networks.create(
                proxy_network_name,
                driver="bridge",
                internal=False,
                labels={"cybertwin.application": app_id, "cybertwin.role": "proxy"},
            )
            app_container = self.client.containers.run(
                image_tag,
                name=container_name,
                detach=True,
                network=app_network.name,
                mem_limit="256m",
                nano_cpus=500_000_000,
                pids_limit=128,
                cap_drop=["ALL"],
                security_opt=["no-new-privileges:true"],
                read_only=True,
                tmpfs={"/tmp": "rw,noexec,nosuid,size=32m"},
                labels={"cybertwin.application": app_id, "cybertwin.build": build_id, "cybertwin.role": "target"},
                restart_policy={"Name": "no"},
            )

            host_port = self._reserve_loopback_port()
            proxy_container = self.client.containers.create(
                proxy_image_tag,
                name=proxy_name,
                detach=True,
                network=proxy_network.name,
                ports={"8080/tcp": ("127.0.0.1", host_port)},
                environment={
                    "TARGET_HOST": container_name,
                    "TARGET_PORT": str(app_port),
                    "NGINX_ENVSUBST_FILTER": "^TARGET_",
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
            self._wait_for_port(assigned_port, timeout=30)

            return {
                "image_tag": image_tag,
                "proxy_image_tag": proxy_image_tag,
                "network_name": network_name,
                "proxy_network_name": proxy_network_name,
                "container_id": app_container.id,
                "proxy_container_id": proxy_container.id,
                "target_url": f"http://127.0.0.1:{assigned_port}",
            }
        except Exception:
            self._remove_if_present(proxy_container)
            self._remove_if_present(app_container)
            self._remove_network_if_present(proxy_network_name)
            self._remove_network_if_present(network_name)
            self._remove_image_if_present(proxy_image_tag)
            self._remove_image_if_present(image_tag)
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

    def stop(self, container_id, proxy_container_id=None):
        app = self.client.containers.get(container_id)
        proxy = self.client.containers.get(proxy_container_id) if proxy_container_id else None
        for container in (proxy, app):
            if container and container.status == "running":
                container.stop(timeout=10)
                container.reload()
        return app

    def start(self, container_id, proxy_container_id=None):
        app = self.client.containers.get(container_id)
        proxy = self.client.containers.get(proxy_container_id) if proxy_container_id else None
        if app.status != "running":
            app.start()
        if proxy and proxy.status != "running":
            proxy.start()
        app.reload()
        if not proxy:
            return app, None
        proxy.reload()
        binding = (proxy.attrs.get("NetworkSettings") or {}).get("Ports", {}).get("8080/tcp")
        host_port = int(binding[0]["HostPort"]) if binding else None
        return app, f"http://127.0.0.1:{host_port}" if host_port else None

    def remove(self, container_id, network_name, image_tag,
               proxy_container_id=None, proxy_network_name=None, proxy_image_tag=None):
        self._remove_by_id(container_id)
        self._remove_by_id(proxy_container_id)
        self._remove_network_if_present(network_name)
        self._remove_network_if_present(proxy_network_name)
        self._remove_image_if_present(image_tag)
        self._remove_image_if_present(proxy_image_tag)

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
