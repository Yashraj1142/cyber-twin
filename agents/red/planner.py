from dataclasses import dataclass


@dataclass(frozen=True)
class AttackStep:
    step_id: str
    name: str
    action: str
    target: str
    description: str
    mitre_technique: str | None = None


@dataclass(frozen=True)
class AttackPlan:
    target: str
    steps: list[AttackStep]


class RedPlanner:
    """Creates the fixed, low-impact plan for the bundled demo target."""

    def create_plan(self, target):
        return AttackPlan(
            target=target,
            steps=[
                AttackStep(
                    step_id="RED-001",
                    name="HTTP reconnaissance",
                    action="http_recon",
                    target=target,
                    description="Request the demo landing page and identify its service response.",
                    mitre_technique="T1595",
                ),
                AttackStep(
                    step_id="RED-002",
                    name="Security header review",
                    action="security_header_check",
                    target=target,
                    description="Review common browser security headers on the landing page.",
                ),
                AttackStep(
                    step_id="RED-003",
                    name="Demo credential audit",
                    action="auth_bruteforce",
                    target=target,
                    description="Try at most three fixed demo credentials against the local test login.",
                    mitre_technique="T1110",
                ),
            ],
        )
