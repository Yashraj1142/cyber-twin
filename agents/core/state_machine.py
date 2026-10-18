from enum import Enum


class AgentState(str, Enum):
    IDLE = "idle"
    RECONNAISSANCE = "reconnaissance"
    PLANNING = "planning"
    SELECTING = "selecting"
    EXECUTING = "executing"
    ANALYZING = "analyzing"
    COMPLETED = "completed"
    FAILED = "failed"


class AgentStateMachine:
    _allowed_transitions = {
        AgentState.IDLE: {AgentState.RECONNAISSANCE},
        AgentState.RECONNAISSANCE: {AgentState.PLANNING, AgentState.FAILED},
        AgentState.PLANNING: {AgentState.SELECTING, AgentState.FAILED},
        AgentState.SELECTING: {AgentState.EXECUTING, AgentState.FAILED},
        AgentState.EXECUTING: {AgentState.ANALYZING, AgentState.FAILED},
        AgentState.ANALYZING: {AgentState.SELECTING, AgentState.COMPLETED, AgentState.FAILED},
        AgentState.COMPLETED: set(),
        AgentState.FAILED: set(),
    }

    def __init__(self):
        self._state = AgentState.IDLE

    def transition(self, new_state):
        try:
            next_state = new_state if isinstance(new_state, AgentState) else AgentState(new_state)
        except ValueError as exc:
            raise ValueError(f"Unknown agent state: {new_state}") from exc

        if next_state not in self._allowed_transitions[self._state]:
            raise ValueError(f"Invalid state transition: {self._state.value} -> {next_state.value}")
        self._state = next_state
        return self._state

    def get_state(self):
        return self._state.value
