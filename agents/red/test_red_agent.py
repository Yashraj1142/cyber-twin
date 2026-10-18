import pytest

from agents.core.state_machine import (
    AgentState,
    AgentStateMachine,
)

from agents.red.planner import (
    AttackStep,
    RedPlanner,
)

from agents.red.selector import (
    RedToolSelector,
    ToolNotAllowedError,
)


# ============================================================
# TEST 1: ATTACK PLANNER
# ============================================================

def test_red_planner_creates_expected_attack_plan():

    planner = RedPlanner()

    plan = planner.create_plan(
        "http://localhost:3000"
    )

    assert len(plan.steps) == 3

    assert plan.steps[0].step_id == "RED-001"
    assert plan.steps[0].action == "http_recon"
    assert plan.steps[0].mitre_technique == "T1595"

    assert plan.steps[1].step_id == "RED-002"
    assert plan.steps[1].action == "security_header_check"

    assert plan.steps[2].step_id == "RED-003"
    assert plan.steps[2].action == "auth_bruteforce"
    assert plan.steps[2].mitre_technique == "T1110"


# ============================================================
# TEST 2: SELECTOR ALLOWS APPROVED TOOLS
# ============================================================

def test_selector_allows_approved_actions():

    planner = RedPlanner()
    selector = RedToolSelector()

    plan = planner.create_plan(
        "http://localhost:3000"
    )

    for step in plan.steps:

        tool = selector.select(step)

        assert tool.action == step.action


# ============================================================
# TEST 3: SELECTOR BLOCKS UNKNOWN ACTION
# ============================================================

def test_selector_rejects_unapproved_action():

    selector = RedToolSelector()

    unsafe_step = AttackStep(
        step_id="TEST-001",
        name="Unapproved Action",
        action="arbitrary_shell",
        target="http://localhost:3000",
        description="Test policy rejection",
    )

    with pytest.raises(ToolNotAllowedError):

        selector.select(
            unsafe_step
        )


# ============================================================
# TEST 4: STATE MACHINE SUPPORTS MULTI-STEP LOOP
# ============================================================

def test_state_machine_supports_attack_loop():

    sm = AgentStateMachine()

    sm.transition(
        AgentState.RECONNAISSANCE
    )

    sm.transition(
        AgentState.PLANNING
    )

    # RED-001

    sm.transition(
        AgentState.SELECTING
    )

    sm.transition(
        AgentState.EXECUTING
    )

    sm.transition(
        AgentState.ANALYZING
    )

    # RED-002

    sm.transition(
        AgentState.SELECTING
    )

    sm.transition(
        AgentState.EXECUTING
    )

    sm.transition(
        AgentState.ANALYZING
    )

    # RED-003

    sm.transition(
        AgentState.SELECTING
    )

    sm.transition(
        AgentState.EXECUTING
    )

    sm.transition(
        AgentState.ANALYZING
    )

    sm.transition(
        AgentState.COMPLETED
    )

    assert sm.get_state() == "completed"


# ============================================================
# TEST 5: INVALID STATE TRANSITION IS BLOCKED
# ============================================================

def test_state_machine_rejects_invalid_transition():

    sm = AgentStateMachine()

    with pytest.raises(ValueError):

        sm.transition(
            AgentState.EXECUTING
        )