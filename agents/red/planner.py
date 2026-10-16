from dataclasses import dataclass, asdict
from typing import List, Optional
from uuid import uuid4


@dataclass
class AttackStep:
    step_id: str
    name: str
    action: str
    target: str
    description: str
    mitre_technique: Optional[str] = None
    status: str = "pending"

    def to_dict(self):
        return asdict(self)


@dataclass
class AttackPlan:
    plan_id: str
    target: str
    objective: str
    steps: List[AttackStep]

    def to_dict(self):
        return {
            "plan_id": self.plan_id,
            "target": self.target,
            "objective": self.objective,
            "steps": [step.to_dict() for step in self.steps],
        }


class RedPlanner:
    """
    Creates controlled attack plans for an authorized Digital Twin.

    MVP:
        Uses deterministic planning.

    Future:
        The planning strategy can be replaced with an LLM/agentic
        planner without changing the AttackPlan contract.
    """

    def create_plan(
        self,
        target: str,
        objective: str = "Assess exposed web attack surface",
    ) -> AttackPlan:

        if not target:
            raise ValueError("A target must be provided")

        steps = [
            AttackStep(
                step_id="RED-001",
                name="HTTP Reconnaissance",
                action="http_recon",
                target=target,
                description=(
                    "Inspect the authorized Digital Twin web service "
                    "and collect basic HTTP information."
                ),
                mitre_technique="T1595",
            ),

            AttackStep(
                step_id="RED-002",
                name="Security Header Assessment",
                action="security_header_check",
                target=target,
                description=(
                    "Inspect HTTP response headers for missing "
                    "or weak security controls."
                ),
                mitre_technique="T1595",
            ),

            AttackStep(
                step_id="RED-003",
                name="Controlled Authentication Test",
                action="auth_bruteforce",
                target=target,
                description=(
                    "Perform a bounded authentication-resilience test "
                    "against the authorized Digital Twin."
                ),
                mitre_technique="T1110",
            ),
        ]

        return AttackPlan(
            plan_id=f"PLAN-{uuid4().hex[:8]}",
            target=target,
            objective=objective,
            steps=steps,
        )   