# CYBER-TWIN AI Developer Knowledge Graph

## 1. System Overview
* **System Objective:** Simulate a real cyber attack-defense cycle against a safe, isolated copy of an authorized application/environment using AI Red, Blue, and Purple agents.[cite: 1]
* **Core Workflow:** Attack $\rightarrow$ Detect $\rightarrow$ Respond $\rightarrow$ Analyze $\rightarrow$ Improve $\rightarrow$ Attack Again.[cite: 1]

## 2. Entities and Relationships
* **Project:** A project contains the Application, Agent Runs (Red, Blue, Purple), Security Events, Incidents, Attack Paths, and Reports.[cite: 1]
* **Application:** Each application is associated with a Digital Twin.[cite: 1]
* **Digital Twin:** Contains the Application, API, Database, Network, Services, Users, and Security Controls.[cite: 1]
    * Managed by the Infrastructure Engineer.[cite: 1]
    * Accessed via a Local Connector.[cite: 1]
    * Operates within an Isolated Network and supports Snapshot/Rollback capabilities.[cite: 1]

## 3. Agent Ecosystem
* **Red Agent (Offensive):**
    * **Pipeline:** Attack planner $\rightarrow$ Attack-path generation $\rightarrow$ Tool selection $\rightarrow$ Controlled execution $\rightarrow$ Result interpretation.[cite: 1]
    * **Metrics:** Attack success rate, Attack path length, Time to objective, Successful vulnerability identification.[cite: 1]
* **Blue Agent (Defensive):**
    * **Pipeline:** Telemetry $\rightarrow$ Event collection $\rightarrow$ Detection $\rightarrow$ Correlation $\rightarrow$ Incident investigation $\rightarrow$ Risk scoring $\rightarrow$ Response.[cite: 1]
    * **Metrics:** Detection rate, False positive rate, Mean Time to Detect (MTTD), Mean Time to Respond (MTTR).[cite: 1]
* **Purple Agent (Analytical):**
    * **Pipeline:** Correlates Red and Blue activity $\rightarrow$ Identifies Detection gaps $\rightarrow$ Generates Security recommendations.[cite: 1]
    * **Metrics:** Detection-gap identification accuracy, MITRE technique coverage, Recommendation quality.[cite: 1]

## 4. Testing Framework
* **Unit Testing:** Each developer tests their own module (Red Agent, Blue Agent, Twin, API).[cite: 1]
* **Integration Testing:** Tests interactions such as Red $\rightarrow$ Twin, Blue $\rightarrow$ Telemetry, and Purple $\rightarrow$ Red + Blue.[cite: 1]
* **System Testing:** Validates the entire application flow from User $\rightarrow$ Simulation $\rightarrow$ Report.[cite: 1]
* **Security Testing:** Tests CYBER-TWIN's own authentication, API authorization, container escape resistance, secret exposure, and prompt injection resistance.[cite: 1]

## 5. MVP Requirements
* **Scope:** 1 application, 1 Digital Twin, 1 Red scenario, 1 Blue detection, 1 Purple analysis, and 1 dashboard.[cite: 1]

## 6. Red Agent MVP Implementation

### Implementation Status
The Red Agent MVP is implemented on `dev-parnika` and has been validated against a local controlled test target.

### Red Agent Execution Flow

DigitalTwinTarget → Reconnaissance → Deterministic Planner → AttackPlan → Tool Selector → Controlled Executor → Result Analysis → Security Finding

The complete workflow is orchestrated using LangGraph:

START → Recon → Plan → Execute Step → Analyze → More Steps? → Execute Next Step / Complete → END

### Digital Twin Target Contract

`DigitalTwinTarget` provides deployment-independent target configuration to the Red Agent.

Current fields include:

- `twin_id`
- `base_url`
- `auth_endpoint`
- `username_field`
- `password_field`
- `test_username`

This prevents Red Agent modules from hardcoding URLs such as `localhost:3000`. The same Red Agent can later operate against a container-network endpoint by changing the target configuration.

### Attack Planner

File: `agents/red/planner.py`

The current MVP planner is deterministic and generates structured `AttackPlan` and `AttackStep` objects.

Current attack path:

RED-001 HTTP Reconnaissance → RED-002 Security Header Assessment → RED-003 Controlled Authentication Test

Adaptive/LLM-based attack planning is planned as future work. The structured `AttackPlan` contract allows the planning strategy to change without redesigning downstream execution components.

### Tool Selection and Safety Policy

File: `agents/red/selector.py`

The selector acts as a deterministic policy boundary between planning and execution.

Current allowlisted actions:

- `http_recon`
- `security_header_check`
- `auth_bruteforce`

Unknown actions are rejected before reaching the executor.

The Red Agent does not provide the planner with unrestricted shell execution.

### Controlled Executor

File: `agents/red/executor.py`

The executor currently supports:

- HTTP reconnaissance
- HTTP security-header assessment
- Bounded authentication-resilience testing

Execution produces structured `ExecutionResult` objects. Results are interpreted into structured `SecurityFinding` objects where applicable.

Current controls include:

- Explicit allowlisted actions
- Explicit executor handlers
- HTTP/HTTPS target validation
- Bounded authentication attempts
- Authentication testing only against the configured Digital Twin authentication endpoint
- Password values are not written into execution evidence

### MITRE ATT&CK Mapping

- RED-001 HTTP Reconnaissance → T1595 Active Scanning
- RED-002 Security Header Assessment → T1595 Active Scanning
- RED-003 Controlled Authentication Test → T1110 Brute Force

### Controlled Authentication Scenario

The current authentication-resilience scenario operates only against the configured authorized Digital Twin test endpoint.

Observed local test sequence:

Attempt 1 → HTTP 401  
Attempt 2 → HTTP 401  
Attempt 3 → HTTP 200

A successful bounded authentication attempt produces a HIGH-severity `Authentication Resilience Weakness` finding mapped to T1110.

### Agent State Machine

File: `agents/core/state_machine.py`

Lifecycle:

IDLE → RECONNAISSANCE → PLANNING → SELECTING → EXECUTING → ANALYZING

For multi-step plans:

ANALYZING → SELECTING → EXECUTING → ANALYZING

When no steps remain:

ANALYZING → COMPLETED

Failures transition to `FAILED`.

State-transition history and timestamps are retained.

### LangGraph Orchestration

File: `orchestrator/langgraph_app.py`

`RedAgentOrchestrator` coordinates the Red Agent components.

Graph:

START → Recon → Plan → Execute → Analyze → Conditional Routing → Complete → END

After every analyzed attack step, conditional routing determines whether another `AttackStep` remains. If so, execution loops to the next step.

### Inter-Agent Communication Contract

File: `orchestrator/communication.py`

The MVP uses an in-memory structured `EventBus`.

Current event types include:

- `agent_started`
- `recon_started`
- `recon_completed`
- `plan_created`
- `step_started`
- `step_completed`
- `step_failed`
- `finding_created`
- `agent_completed`
- `agent_failed`

This decouples Red Agent execution from future Blue Agent, Purple Agent, frontend, persistence, and reporting consumers.

The in-memory implementation can later be replaced or extended using WebSockets, Redis, message queues, or persistent event storage.

## 7. Red Agent Testing

Framework: `pytest`

Current component-test result: **5/5 tests passed**

Validated behaviors:

- Planner generates the expected three-step attack plan.
- Selector accepts allowlisted actions.
- Selector rejects an unknown/unapproved action.
- State machine supports the multi-step attack loop.
- State machine rejects invalid state transitions.

Local integration testing has also successfully executed the complete LangGraph workflow against the controlled Flask test target.

Observed end-to-end result:

Recon → Plan → RED-001 → Analyze → RED-002 → Analyze → RED-003 → Analyze → Complete

Three execution results were produced and two security findings were generated.

## 8. Current Integration Status

Implemented and locally validated:

- Red Agent structured planning
- Policy-controlled tool selection
- HTTP reconnaissance
- Security-header assessment
- Bounded T1110 authentication simulation
- Result interpretation
- MITRE mapping
- State machine
- Event bus
- LangGraph orchestration
- Local end-to-end Red Agent workflow

Prepared but not yet validated on `dev-parnika`:

- Docker definition for the controlled demo target

Pending integration:

- Red Agent against the team's Docker Digital Twin
- Blue Agent telemetry/detection integration
- Purple Agent Red/Blue correlation
- Dashboard event streaming
- Adaptive/LLM attack planning