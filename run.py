from agents.core.target import DigitalTwinTarget
from orchestrator.langgraph_app import RedAgentOrchestrator


target = DigitalTwinTarget(
    twin_id="twin-demo-001",
    base_url="http://localhost:3000",
    auth_endpoint="/api/login",
    username_field="username",
    password_field="password",
    test_username="cybertwin_test",
)


red_agent = RedAgentOrchestrator()

result = red_agent.run(target)


print("\n=== CYBER-TWIN RED AGENT ===")
print("Final State:", red_agent.state_machine.get_state())


print("\n=== EXECUTION RESULTS ===")

for item in result["results"]:
    print(
        item.step_id,
        "|",
        item.action,
        "|",
        item.status,
    )


print("\n=== SECURITY FINDINGS ===")

for finding in result["findings"]:
    print(
        finding.title,
        "| Severity:",
        finding.severity,
        "| MITRE:",
        finding.mitre_technique,
    )


print("\n=== EVENT TIMELINE ===")

for event in red_agent.event_bus.get_events():
    print(
        event.event_type.value,
        "->",
        event.data,
    )