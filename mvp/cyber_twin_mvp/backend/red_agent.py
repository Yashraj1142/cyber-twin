"""Adapter that runs the shared Red Agent plan and streams its findings."""

import asyncio

from agents.core.state_machine import AgentState, AgentStateMachine
from agents.red.executor import RedToolExecutor
from agents.red.planner import RedPlanner
from agents.red.selector import RedToolSelector


class RedAgent:
    """Run the fixed, allowlisted plan against the bundled localhost demo."""

    def __init__(self, target_url, emit_event):
        self.target_url = target_url
        self.emit_event = emit_event
        self.state_machine = AgentStateMachine()
        self.planner = RedPlanner()
        self.selector = RedToolSelector()
        self.executor = RedToolExecutor()
        loop = asyncio.get_running_loop()

        def emit_from_worker(message):
            asyncio.run_coroutine_threadsafe(self.emit_event(message), loop).result(timeout=3)

        self.emit_from_worker = emit_from_worker

    async def run(self):
        self.state_machine.transition(AgentState.RECONNAISSANCE)
        await self.emit_event("RED: Starting scoped reconnaissance against the bundled local demo.")

        self.state_machine.transition(AgentState.PLANNING)
        plan = self.planner.create_plan(self.target_url)
        await self.emit_event(f"RED: Plan ready with {len(plan.steps)} allowlisted checks.")

        for step in plan.steps:
            self.state_machine.transition(AgentState.SELECTING)
            tool = self.selector.select(step)
            technique = step.mitre_technique or "MITRE unmapped"
            await self.emit_event(f"RED: {step.step_id} selected {tool.name} ({technique}).")

            self.state_machine.transition(AgentState.EXECUTING)
            result = await asyncio.to_thread(
                self.executor.execute,
                step,
                tool,
                self.emit_from_worker if step.action == "auth_bruteforce" else None,
            )
            await self.emit_event(result)

            self.state_machine.transition(AgentState.ANALYZING)
            await self.emit_event(f"PURPLE: Recorded result for {step.step_id}.")

        self.state_machine.transition(AgentState.COMPLETED)
        await self.emit_event("SYSTEM: Demo simulation completed.")
