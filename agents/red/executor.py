from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from typing import Any, Dict
from urllib.parse import urlparse
import time

import requests

from agents.red.planner import AttackStep
from agents.red.selector import SelectedTool
from agents.core.target import DigitalTwinTarget


@dataclass
class ExecutionResult:
    step_id: str
    action: str
    target: str
    status: str
    timestamp: str
    duration_ms: float
    evidence: Dict[str, Any]
    error: str | None = None

    def to_dict(self):
        return asdict(self)

@dataclass
class SecurityFinding:
    finding_id: str
    step_id: str
    title: str
    severity: str
    description: str
    evidence: Dict[str, Any]
    mitre_technique: str | None = None

    def to_dict(self):
        return asdict(self)
    
class RedExecutor:
    """
    Executes allowlisted Red Agent capabilities against
    an authorized Digital Twin HTTP endpoint.
    """
    MAX_AUTH_ATTEMPTS = 5

    def __init__(self, timeout: int = 5):
        self.timeout = timeout

    def execute(
        self,
        step: AttackStep,
        tool: SelectedTool,
        target_config: DigitalTwinTarget | None = None,
    ) -> ExecutionResult:

        self._validate_target(step.target)

        if tool.action == "auth_bruteforce":
            if target_config is None:
                raise ValueError(
                    "Authentication testing requires DigitalTwinTarget configuration."
                )

            return self.execute_auth_test(
                step,
                tool,
                target_config,
            )

        if tool.action != step.action:
            raise ValueError(
                "Selected tool does not match requested attack action."
            )

        handlers = {
            "http_recon": self._http_recon,
            "security_header_check": self._security_header_check,
        }

        handler = handlers.get(tool.action)

        if handler is None:
            raise ValueError(
                f"No executor registered for action '{tool.action}'"
            )

        start = time.perf_counter()

        try:
            evidence = handler(step.target)

            duration_ms = (
                time.perf_counter() - start
            ) * 1000

            step.status = "success"

            return ExecutionResult(
                step_id=step.step_id,
                action=step.action,
                target=step.target,
                status="success",
                timestamp=datetime.now(
                    timezone.utc
                ).isoformat(),
                duration_ms=round(duration_ms, 2),
                evidence=evidence,
            )

        except requests.RequestException as exc:
            duration_ms = (
                time.perf_counter() - start
            ) * 1000

            step.status = "failed"

            return ExecutionResult(
                step_id=step.step_id,
                action=step.action,
                target=step.target,
                status="failed",
                timestamp=datetime.now(
                    timezone.utc
                ).isoformat(),
                duration_ms=round(duration_ms, 2),
                evidence={},
                error=str(exc),
            )

    def _validate_target(self, target: str):
        parsed = urlparse(target)

        if parsed.scheme not in ("http", "https"):
            raise ValueError(
                "Red Agent target must use HTTP or HTTPS."
            )

        if not parsed.hostname:
            raise ValueError(
                "Red Agent target must contain a hostname."
            )

    def _http_recon(self, target: str) -> Dict[str, Any]:
        response = requests.get(
            target,
            timeout=self.timeout,
            allow_redirects=True,
        )

        return {
            "status_code": response.status_code,
            "final_url": response.url,
            "content_type": response.headers.get(
                "Content-Type"
            ),
            "server": response.headers.get("Server"),
            "content_length": len(response.content),
        }

    def _security_header_check(
        self,
        target: str
    ) -> Dict[str, Any]:

        response = requests.get(
            target,
            timeout=self.timeout,
            allow_redirects=True,
        )

        expected_headers = [
            "Content-Security-Policy",
            "X-Content-Type-Options",
            "X-Frame-Options",
            "Referrer-Policy",
        ]

        present = {}
        missing = []

        for header in expected_headers:
            value = response.headers.get(header)

            if value:
                present[header] = value
            else:
                missing.append(header)

        return {
            "status_code": response.status_code,
            "final_url": response.url,
            "present_headers": present,
            "missing_headers": missing,
            "missing_count": len(missing),
        }

    def analyze_result(
        self,
        step: AttackStep,
        result: ExecutionResult
    ) -> list[SecurityFinding]:

        findings = []

        if result.status != "success":
            return findings

        if step.action == "auth_bruteforce":

            succeeded = result.evidence.get(
                "authentication_succeeded",
                False,
            )

            attempts = result.evidence.get(
                "attempt_count",
                0,
            )

            if succeeded:
                findings.append(
                    SecurityFinding(
                        finding_id=f"FIND-{step.step_id}",
                        step_id=step.step_id,
                        title=(
                            "Authentication Resilience Weakness"
                        ),
                        severity="HIGH",
                        description=(
                            "The controlled authentication test "
                            "successfully authenticated using the "
                            "bounded test credential set."
                        ),
                        evidence={
                            "attempt_count": attempts,
                            "successful_attempt":
                                result.evidence.get(
                                    "successful_attempt"
                                ),
                        },
                        mitre_technique=step.mitre_technique,
                    )
                )

        if step.action == "security_header_check":
            missing_headers = result.evidence.get(
                "missing_headers", []
            )

            if missing_headers:
                findings.append(
                    SecurityFinding(
                        finding_id=f"FIND-{step.step_id}",
                        step_id=step.step_id,
                        title="Missing HTTP Security Headers",
                        severity="LOW",
                        description=(
                            "The Digital Twin response is missing "
                            "recommended HTTP security headers."
                        ),
                        evidence={
                            "missing_headers": missing_headers
                        },
                        mitre_technique=step.mitre_technique,
                    )
                )

        return findings


    def execute_auth_test(
            self,
            step: AttackStep,
            tool: SelectedTool,
            target_config: DigitalTwinTarget,
        ) -> ExecutionResult:

            if tool.action != "auth_bruteforce":
                raise ValueError(
                    "Incorrect tool supplied for authentication test."
                )

            if step.action != "auth_bruteforce":
                raise ValueError(
                    "Attack step is not an authentication test."
                )

            auth_url = target_config.get_auth_url()

            if not auth_url:
                raise ValueError(
                    "Digital Twin does not define an authentication endpoint."
                )

            if not target_config.test_username:
                raise ValueError(
                    "Digital Twin does not define a test username."
                )

            self._validate_target(auth_url)

            # Small bounded credential fixture for the isolated Digital Twin.
            test_passwords = [
                "test123",
                "password123",
                "cybertwin123",
            ]

            test_passwords = test_passwords[:self.MAX_AUTH_ATTEMPTS]

            attempts = []
            successful_attempt = None

            start = time.perf_counter()

            try:
                for attempt_number, password in enumerate(
                    test_passwords,
                    start=1,
                ):
                    payload = {
                        target_config.username_field:
                            target_config.test_username,

                        target_config.password_field:
                            password,
                    }

                    response = requests.post(
                        auth_url,
                        json=payload,
                        timeout=self.timeout,
                        allow_redirects=False,
                    )

                    attempt = {
                        "attempt_number": attempt_number,
                        "status_code": response.status_code,
                    }

                    attempts.append(attempt)

                    # MVP success convention:
                    # authentication endpoints should return 2xx on success.
                    if 200 <= response.status_code < 300:
                        successful_attempt = attempt_number
                        break

                duration_ms = (
                    time.perf_counter() - start
                ) * 1000

                step.status = "success"

                return ExecutionResult(
                    step_id=step.step_id,
                    action=step.action,
                    target=auth_url,
                    status="success",
                    timestamp=datetime.now(
                        timezone.utc
                    ).isoformat(),
                    duration_ms=round(duration_ms, 2),
                    evidence={
                        "attempt_count": len(attempts),
                        "attempts": attempts,
                        "authentication_succeeded":
                            successful_attempt is not None,
                        "successful_attempt":
                            successful_attempt,
                        "max_attempts":
                            self.MAX_AUTH_ATTEMPTS,
                    },
                )

            except requests.RequestException as exc:
                duration_ms = (
                    time.perf_counter() - start
                ) * 1000

                step.status = "failed"

                return ExecutionResult(
                    step_id=step.step_id,
                    action=step.action,
                    target=auth_url,
                    status="failed",
                    timestamp=datetime.now(
                        timezone.utc
                    ).isoformat(),
                    duration_ms=round(duration_ms, 2),
                    evidence={
                        "attempt_count": len(attempts),
                        "attempts": attempts,
                    },
                    error=str(exc),
                )