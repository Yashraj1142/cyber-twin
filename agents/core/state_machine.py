from enum import Enum
from dataclasses import dataclass
from datetime import datetime, timezone


class AgentState(str, Enum):
    IDLE = "idle"
    RECONNAISSANCE = "reconnaissance"
    PLANNING = "planning"
    SELECTING = "selecting"
    EXECUTING = "executing"
    ANALYZING = "analyzing"
    COMPLETED = "completed"
    FAILED = "failed"


@dataclass
class StateTransition:
    previous_state: AgentState
    new_state: AgentState
    timestamp: str
    reason: str = ""


class AgentStateMachine:
    """
    Tracks the lifecycle of a CYBER-TWIN agent run.
    """

    VALID_TRANSITIONS = {
        AgentState.IDLE: {
            AgentState.RECONNAISSANCE,
            AgentState.FAILED,
        },
        AgentState.RECONNAISSANCE: {
            AgentState.PLANNING,
            AgentState.FAILED,
        },
        AgentState.PLANNING: {
            AgentState.SELECTING,
            AgentState.FAILED,
        },
        AgentState.SELECTING: {
            AgentState.EXECUTING,
            AgentState.FAILED,
        },
        AgentState.EXECUTING: {
            AgentState.ANALYZING,
            AgentState.FAILED,
        },
        AgentState.ANALYZING: {
            AgentState.SELECTING,
            AgentState.COMPLETED,
            AgentState.FAILED,
        },
        AgentState.COMPLETED: set(),
        AgentState.FAILED: set(),
    }

    def __init__(self):
        self.state = AgentState.IDLE
        self.history = []

    def transition(self, new_state: AgentState, reason: str = ""):
        allowed_states = self.VALID_TRANSITIONS[self.state]

        if new_state not in allowed_states:
            raise ValueError(
                f"Invalid state transition: "
                f"{self.state.value} -> {new_state.value}"
            )

        transition = StateTransition(
            previous_state=self.state,
            new_state=new_state,
            timestamp=datetime.now(timezone.utc).isoformat(),
            reason=reason,
        )

        self.history.append(transition)
        self.state = new_state

        return transition

    def fail(self, reason: str):
        if self.state in (AgentState.COMPLETED, AgentState.FAILED):
            raise ValueError(
                f"Cannot fail agent from terminal state: {self.state.value}"
            )

        return self.transition(AgentState.FAILED, reason)

    def get_state(self) -> str:
        return self.state.value

    def get_history(self):
        return [
            {
                "previous_state": item.previous_state.value,
                "new_state": item.new_state.value,
                "timestamp": item.timestamp,
                "reason": item.reason,
            }
            for item in self.history
        ]