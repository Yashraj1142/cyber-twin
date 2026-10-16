from typing import TypedDict, List

import requests
from langgraph.graph import StateGraph, START, END

from agents.core.target import DigitalTwinTarget
from agents.core.state_machine import (
    AgentState,
    AgentStateMachine,
)

from agents.red.planner import (
    AttackPlan,
    RedPlanner,
)

from agents.red.selector import RedToolSelector

from agents.red.executor import (
    RedExecutor,
    ExecutionResult,
    SecurityFinding,
)

from orchestrator.communication import (
    EventBus,
    EventType,
)


# ============================================================
# LANGGRAPH SHARED STATE
# ============================================================

class RedGraphState(TypedDict):
    """
    State shared between all nodes in the Red Agent graph.
    """

    target: DigitalTwinTarget
    plan: AttackPlan | None
    current_step: int
    results: List[ExecutionResult]
    findings: List[SecurityFinding]
    error: str | None


# ============================================================
# RED AGENT ORCHESTRATOR
# ============================================================

class RedAgentOrchestrator:

    def __init__(self):

        # Red Agent components
        self.planner = RedPlanner()
        self.selector = RedToolSelector()
        self.executor = RedExecutor()

        # Shared infrastructure
        self.state_machine = AgentStateMachine()
        self.event_bus = EventBus()

        # Build and compile LangGraph
        self.graph = self._build_graph()

    # ========================================================
    # BUILD LANGGRAPH
    # ========================================================

    def _build_graph(self):

        workflow = StateGraph(RedGraphState)

        # -------------------------
        # Register graph nodes
        # -------------------------

        workflow.add_node(
            "recon",
            self._recon_node,
        )

        workflow.add_node(
            "plan",
            self._plan_node,
        )

        workflow.add_node(
            "execute_step",
            self._execute_step_node,
        )

        workflow.add_node(
            "analyze",
            self._analyze_node,
        )

        workflow.add_node(
            "complete",
            self._complete_node,
        )

        # -------------------------
        # Define graph flow
        # -------------------------

        workflow.add_edge(
            START,
            "recon",
        )

        workflow.add_edge(
            "recon",
            "plan",
        )

        workflow.add_edge(
            "plan",
            "execute_step",
        )

        workflow.add_edge(
            "execute_step",
            "analyze",
        )

        # After analyzing a step:
        #
        # more steps -> execute_step
        # no steps   -> complete

        workflow.add_conditional_edges(
            "analyze",
            self._route_after_analysis,
            {
                "continue": "execute_step",
                "complete": "complete",
            },
        )

        workflow.add_edge(
            "complete",
            END,
        )

        return workflow.compile()

    # ========================================================
    # NODE 1: RECONNAISSANCE
    # ========================================================

    def _recon_node(
        self,
        state: RedGraphState,
    ):

        target = state["target"]

        self.state_machine.transition(
            AgentState.RECONNAISSANCE,
            "Red Agent reconnaissance started",
        )

        self.event_bus.publish(
            EventType.RECON_STARTED,
            "red",
            {
                "twin_id": target.twin_id,
                "target": target.base_url,
            },
        )

        try:

            response = requests.get(
                target.base_url,
                timeout=5,
            )

            self.event_bus.publish(
                EventType.RECON_COMPLETED,
                "red",
                {
                    "reachable": True,
                    "status_code": response.status_code,
                },
            )

            return {}

        except requests.RequestException as exc:

            self.state_machine.fail(
                f"Target unreachable: {exc}"
            )

            self.event_bus.publish(
                EventType.AGENT_FAILED,
                "red",
                {
                    "reason": str(exc),
                },
            )

            raise

    # ========================================================
    # NODE 2: ATTACK PLANNING
    # ========================================================

    def _plan_node(
        self,
        state: RedGraphState,
    ):

        self.state_machine.transition(
            AgentState.PLANNING,
            "Generating Red Agent attack plan",
        )

        target = state["target"]

        plan = self.planner.create_plan(
            target.base_url
        )

        self.event_bus.publish(
            EventType.PLAN_CREATED,
            "red",
            {
                "plan_id": plan.plan_id,
                "objective": plan.objective,
                "step_count": len(plan.steps),
            },
        )

        return {
            "plan": plan,
            "current_step": 0,
        }

    # ========================================================
    # NODE 3: SELECT + EXECUTE ATTACK STEP
    # ========================================================

    def _execute_step_node(
        self,
        state: RedGraphState,
    ):

        plan = state["plan"]

        if plan is None:
            raise ValueError(
                "Attack plan has not been created."
            )

        index = state["current_step"]

        if index >= len(plan.steps):
            raise IndexError(
                "Current attack step is outside the attack plan."
            )

        step = plan.steps[index]

        # -------------------------
        # Tool selection
        # -------------------------

        self.state_machine.transition(
            AgentState.SELECTING,
            f"Selecting tool for {step.step_id}",
        )

        tool = self.selector.select(step)

        # -------------------------
        # Execution
        # -------------------------

        self.state_machine.transition(
            AgentState.EXECUTING,
            f"Executing {step.step_id}",
        )

        self.event_bus.publish(
            EventType.STEP_STARTED,
            "red",
            {
                "step_id": step.step_id,
                "name": step.name,
                "action": step.action,
                "mitre_technique":
                    step.mitre_technique,
            },
        )

        result = self.executor.execute(
            step,
            tool,
            state["target"],
        )

        # Preserve previous results
        results = list(
            state.get("results", [])
        )

        results.append(result)

        # -------------------------
        # Publish execution event
        # -------------------------

        event_type = (
            EventType.STEP_COMPLETED
            if result.status == "success"
            else EventType.STEP_FAILED
        )

        self.event_bus.publish(
            event_type,
            "red",
            {
                "step_id": step.step_id,
                "action": step.action,
                "status": result.status,
            },
        )

        return {
            "results": results,
        }

    # ========================================================
    # NODE 4: ANALYZE EXECUTION RESULT
    # ========================================================

    def _analyze_node(
        self,
        state: RedGraphState,
    ):

        self.state_machine.transition(
            AgentState.ANALYZING,
            "Analyzing Red Agent execution result",
        )

        plan = state["plan"]

        if plan is None:
            raise ValueError(
                "Attack plan missing during analysis."
            )

        index = state["current_step"]

        step = plan.steps[index]

        if not state["results"]:
            raise ValueError(
                "No execution result available for analysis."
            )

        # Latest execution result belongs to current step
        result = state["results"][-1]

        # Interpret raw execution evidence
        new_findings = (
            self.executor.analyze_result(
                step,
                result,
            )
        )

        # Preserve previous findings
        findings = list(
            state.get("findings", [])
        )

        findings.extend(new_findings)

        # -------------------------
        # Publish findings
        # -------------------------

        for finding in new_findings:

            self.event_bus.publish(
                EventType.FINDING_CREATED,
                "red",
                finding.to_dict(),
            )

        # Move to next attack step
        return {
            "findings": findings,
            "current_step": index + 1,
        }

    # ========================================================
    # CONDITIONAL ROUTING
    # ========================================================

    def _route_after_analysis(
        self,
        state: RedGraphState,
    ):

        plan = state["plan"]

        if plan is None:
            return "complete"

        # More attack steps remain
        if state["current_step"] < len(
            plan.steps
        ):
            return "continue"

        # Attack plan finished
        return "complete"

    # ========================================================
    # NODE 5: COMPLETE RED AGENT RUN
    # ========================================================

    def _complete_node(
        self,
        state: RedGraphState,
    ):

        self.state_machine.transition(
            AgentState.COMPLETED,
            "Red Agent simulation completed",
        )

        self.event_bus.publish(
            EventType.AGENT_COMPLETED,
            "red",
            {
                "results": len(
                    state.get("results", [])
                ),
                "findings": len(
                    state.get("findings", [])
                ),
            },
        )

        return {}

    # ========================================================
    # PUBLIC ENTRY POINT
    # ========================================================

    def run(
        self,
        target: DigitalTwinTarget,
    ):

        # Reset state for a new run
        self.state_machine = AgentStateMachine()
        self.event_bus = EventBus()

        self.event_bus.publish(
            EventType.AGENT_STARTED,
            "red",
            {
                "twin_id": target.twin_id,
                "target": target.base_url,
            },
        )

        initial_state: RedGraphState = {
            "target": target,
            "plan": None,
            "current_step": 0,
            "results": [],
            "findings": [],
            "error": None,
        }

        return self.graph.invoke(
            initial_state
        )