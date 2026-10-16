from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List


class EventType(str, Enum):
    AGENT_STARTED = "agent_started"

    RECON_STARTED = "recon_started"
    RECON_COMPLETED = "recon_completed"

    PLAN_CREATED = "plan_created"

    STEP_STARTED = "step_started"
    STEP_COMPLETED = "step_completed"
    STEP_FAILED = "step_failed"

    FINDING_CREATED = "finding_created"

    AGENT_COMPLETED = "agent_completed"
    AGENT_FAILED = "agent_failed"


@dataclass
class AgentEvent:
    event_type: EventType
    source: str
    timestamp: str
    data: Dict[str, Any]

    def to_dict(self):
        result = asdict(self)
        result["event_type"] = self.event_type.value
        return result


class EventBus:
    """
    Simple in-memory event bus for the CYBER-TWIN MVP.

    Later this can be replaced by WebSockets, Redis,
    a message queue, or persistent event storage.
    """

    def __init__(self):
        self.events: List[AgentEvent] = []

    def publish(
        self,
        event_type: EventType,
        source: str,
        data: Dict[str, Any] | None = None,
    ) -> AgentEvent:

        event = AgentEvent(
            event_type=event_type,
            source=source,
            timestamp=datetime.now(
                timezone.utc
            ).isoformat(),
            data=data or {},
        )

        self.events.append(event)

        return event

    def get_events(self) -> List[AgentEvent]:
        return self.events.copy()

    def get_events_by_source(
        self,
        source: str,
    ) -> List[AgentEvent]:

        return [
            event
            for event in self.events
            if event.source == source
        ]

    def clear(self):
        self.events.clear()