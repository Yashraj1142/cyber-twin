from dataclasses import dataclass


class ToolNotAllowedError(ValueError):
    pass


@dataclass(frozen=True)
class SelectedTool:
    action: str
    name: str


class RedToolSelector:
    """Maps plans only to the three harmless, demo-scoped HTTP checks."""

    _allowed_tools = {
        "http_recon": "HTTP GET reconnaissance",
        "security_header_check": "HTTP security-header review",
        "auth_bruteforce": "Bounded demo credential audit",
    }

    def select(self, step):
        tool_name = self._allowed_tools.get(step.action)
        if tool_name is None:
            raise ToolNotAllowedError(f"Action is not allowed: {step.action}")
        return SelectedTool(action=step.action, name=tool_name)
