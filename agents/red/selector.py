from dataclasses import dataclass
from typing import Dict

from agents.red.planner import AttackStep


class ToolNotAllowedError(Exception):
    """Raised when the planner requests a tool that is not allowlisted."""
    pass


@dataclass
class SelectedTool:
    name: str
    action: str
    description: str


class RedToolSelector:
    """
    Maps Red Agent actions to explicitly allowlisted capabilities.

    The planner never receives direct shell access. Only actions
    registered here may reach the executor.
    """

    ALLOWED_TOOLS: Dict[str, SelectedTool] = {
        "http_recon": SelectedTool(
            name="HTTP Recon Tool",
            action="http_recon",
            description="Collect basic HTTP information from the Digital Twin."
        ),

        "security_header_check": SelectedTool(
            name="Security Header Analyzer",
            action="security_header_check",
            description="Inspect HTTP security headers on the Digital Twin."
        ),

        "auth_bruteforce": SelectedTool(
            name="Controlled Authentication Tester",
            action="auth_bruteforce",
            description=(
                "Perform a bounded authentication-resilience test "
                "against the authorized Digital Twin."
            )
        ),
    }

    def select(self, step: AttackStep) -> SelectedTool:
        if step.action not in self.ALLOWED_TOOLS:
            raise ToolNotAllowedError(
                f"Action '{step.action}' is not allowed by Red Agent policy."
            )

        return self.ALLOWED_TOOLS[step.action]

    def is_allowed(self, action: str) -> bool:
        return action in self.ALLOWED_TOOLS

    def list_allowed_tools(self):
        return list(self.ALLOWED_TOOLS.keys())