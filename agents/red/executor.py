import json
import re
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import HTTPRedirectHandler, Request, build_opener

from agents.red.selector import SelectedTool


class UnsafeTargetError(ValueError):
    pass


class _NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, request, file_pointer, code, message, headers, new_url):
        return None


class RedToolExecutor:
    """Runs allowlisted HTTP checks against the bundled local demo only."""

    _demo_hosts = {"127.0.0.1", "localhost"}
    _demo_port = 3000
    _credential_candidates = (
        ("admin", "admin"),
        ("cybertwin", "cybertwin"),
        ("cybertwin_admin", "cybertwin_admin"),
        ("abc","abc"),
        ("cybertwin_test", "cybertwin123"),
        ("demo", "demo"),
    )
    _attempt_delay_seconds = 0.9

    def __init__(self):
        self._http = build_opener(_NoRedirect())

    def execute(self, step, tool: SelectedTool, on_event=None):
        if step.action != tool.action:
            raise ValueError("Selected tool does not match the planned step")
        base_url = self._validate_target(step.target)

        if step.action == "http_recon":
            status, _headers, body = self._request(base_url, "GET")
            preview = body.decode("utf-8", errors="replace").strip().replace("\n", " ")[:180]
            return f"{step.step_id} RECON: GET / returned HTTP {status}: {preview}"

        if step.action == "security_header_check":
            status, headers, _body = self._request(base_url, "GET")
            expected = ("Content-Security-Policy", "X-Frame-Options", "X-Content-Type-Options")
            missing = [name for name in expected if name.lower() not in {key.lower() for key in headers}]
            if missing:
                return f"{step.step_id} HEADERS: HTTP {status}; missing {', '.join(missing)}"
            return f"{step.step_id} HEADERS: HTTP {status}; expected security headers are present"

        if step.action == "auth_bruteforce":
            attempts = 0
            for username, password in self._credential_candidates:
                attempts += 1
                if attempts > 1:
                    time.sleep(self._attempt_delay_seconds)
                if on_event:
                    on_event(
                        f"{step.step_id} ATTEMPT {attempts}/{len(self._credential_candidates)}: "
                        f"submitting demo username '{username}'"
                    )
                payload = json.dumps({"username": username, "password": password}).encode("utf-8")
                status, _headers, body = self._request(
                    f"{base_url}/api/login", "POST", payload, agent_request=True
                )
                try:
                    result = json.loads(body.decode("utf-8"))
                except (ValueError, UnicodeDecodeError):
                    result = {}
                if status == 200 and result.get("authenticated") is True:
                    if on_event:
                        on_event(f"{step.step_id} RESULT {attempts}/{len(self._credential_candidates)}: demo login accepted")
                    return (
                        f"{step.step_id} CREDENTIAL AUDIT: the demo accepted its built-in test account "
                        f"after {attempts} of at most {len(self._credential_candidates)} local attempts"
                    )
                if on_event:
                    on_event(f"{step.step_id} RESULT {attempts}/{len(self._credential_candidates)}: demo login rejected")
            return f"{step.step_id} CREDENTIAL AUDIT: no fixed demo credential worked after {attempts} attempts"

        raise ValueError(f"No executor is registered for action: {step.action}")

    @classmethod
    def _validate_target(cls, target):
        parsed = urlparse(target)
        host_is_demo_container = bool(
            parsed.hostname and re.fullmatch(r"cybertwin-demo-[a-f0-9]{12}", parsed.hostname)
        )
        if (
            parsed.scheme != "http"
            or (parsed.hostname not in cls._demo_hosts and not host_is_demo_container)
            or parsed.port != cls._demo_port
            or parsed.path not in ("", "/")
            or parsed.username is not None
            or parsed.password is not None
            or parsed.query
            or parsed.fragment
        ):
            raise UnsafeTargetError("Red Agent is restricted to the bundled localhost demo on port 3000")
        return f"http://{parsed.hostname}:{parsed.port}"

    def _request(self, url, method, body=None, agent_request=False):
        headers = {"Accept": "application/json"}
        if agent_request:
            headers["X-Cybertwin-Agent"] = "red-agent"
        if body is not None:
            headers["Content-Type"] = "application/json"
        request = Request(url, data=body, headers=headers, method=method)
        try:
            with self._http.open(request, timeout=3) as response:
                return response.status, response.headers, response.read(4096)
        except HTTPError as response:
            return response.code, response.headers, response.read(4096)
        except URLError as exc:
            raise RuntimeError(f"Demo target is unavailable at {url}: {exc.reason}") from exc
