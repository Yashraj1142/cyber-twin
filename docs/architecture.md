# CYBER-TWIN Architecture Document

## 1. Project Objective & Workflow
* **Objective:** Create a safe, isolated copy of an authorized application/environment and let AI Red, Blue, and Purple agents simulate a real cyber attack–defense cycle against it.[cite: 1]
* **Workflow Goal:** Evaluate how effectively an AI-driven attacker can test an application, an AI-driven defender can detect and stop the attack, and an AI evaluator can identify weaknesses and improve the security posture.[cite: 1]
* **Core Loop:** Attack $\rightarrow$ Detect $\rightarrow$ Respond $\rightarrow$ Analyze $\rightarrow$ Improve $\rightarrow$ Attack Again.[cite: 1]

---

## 2. Core Modules & Agent Responsibilities

### System Architect + Red Agent
* **Responsibilities:** Overall architecture, Red Agent, agent orchestration, security testing methodology, and integration.[cite: 1]
* **Red Agent Pipeline:** Attack planner $\rightarrow$ Attack-path generation $\rightarrow$ Tool selection $\rightarrow$ Controlled execution $\rightarrow$ Result interpretation.[cite: 1]
* **Ownership Areas:** LangGraph/agent architecture, attack state machine, MITRE ATT&CK mapping from the offensive side, inter-agent communication, and overall integration.[cite: 1]

### Blue Team + Detection Engineer
* **Responsibilities:** Owns the defensive side, acting as the SOC/security detection specialist.[cite: 1]
* **Blue Agent Pipeline:** Telemetry $\rightarrow$ Event collection $\rightarrow$ Detection $\rightarrow$ Correlation $\rightarrow$ Incident investigation $\rightarrow$ Risk scoring $\rightarrow$ Response.[cite: 1]
* **Ownership Areas:** Log collector, event normalization, detection engine, anomaly detection, incident correlation, Blue Agent, response mechanisms, and alert generation.[cite: 1]
* **Event Flow:** HTTP logs + Authentication logs + Process events + Network events $\rightarrow$ Blue Agent $\rightarrow$ Security Incident.[cite: 1]

### Digital Twin + Infrastructure Engineer
* **Responsibilities:** Owns the infrastructure and acts as the DevSecOps/infrastructure engineer.[cite: 1]
* **Digital Twin Components:** Application, API, Database, Network, Services, Users, and Security Controls.[cite: 1]
* **Infrastructure Components:** Docker, Docker Compose, isolated network, containers, environment creation, snapshot/rollback, local connector, and environment health checks.[cite: 1]
* **Architecture Flow:** User's Application $\rightarrow$ Connector $\rightarrow$ Digital Twin $\rightarrow$ Isolated Network $\rightarrow$ Red/Blue Agents.[cite: 1]

### Purple Agent + Frontend + Analytics
* **Responsibilities:** Owns the Purple Agent and the React frontend/dashboard.[cite: 1]
* **Purple Agent Pipeline:** Red activity + Blue activity $\rightarrow$ Correlation $\rightarrow$ Detection gaps $\rightarrow$ Security recommendations.[cite: 1]
* **Frontend Ownership:** Dashboard, Attack Graph, Live Events, Security Score, Reports.[cite: 1]
* **Analytics Handling:** Attack visualization, MITRE ATT&CK visualization, security metrics, charts, incident timeline, and report generation UI.[cite: 1]

---

## 3. Incremental Feature Builds
* **MVP:** 1 application, 1 Digital Twin, 1 Red scenario, 1 Blue detection, 1 Purple analysis, 1 dashboard.[cite: 1]
* **V2:** Multiple attacks, Multiple detection mechanisms, Attack graphs, MITRE mapping, Risk scoring.[cite: 1]
* **V3:** Autonomous planning, Adaptive attacks, Automated defensive response, Snapshot rollback, Iterative re-testing.[cite: 1]
* **Final:** Local connector, Multiple applications, Advanced analytics, Research evaluation.[cite: 1]

---

## 4. Database Schema
* **Entities (Min Requirement):** Users, Projects, Applications, DigitalTwins, Assets, Services, Agents, AgentRuns, SecurityEvents, AttackSteps, Incidents, Vulnerabilities, MITRETechniques, DetectionRules, Responses, Snapshots, Reports.[cite: 1]
* **Relationships:** 
  * Project contains Application (which contains Digital Twin).[cite: 1]
  * Project contains Agent Runs (Red, Blue, Purple).[cite: 1]
  * Project contains Security Events, Incidents, Attack Paths, and Reports.[cite: 1]

---

## 5. API Definitions

### Core Management APIs
* **Authentication (`/api/v1/auth/*`):** Register, login, logout, refresh, me, password.[cite: 1]
* **Projects (`/api/v1/projects/*`):** Create, list, details, update, delete.[cite: 1]
* **Applications (`/api/v1/applications/*`):** Add, list, details, update, remove, discover.[cite: 1]

### Digital Twin & Snapshot APIs
* **Digital Twin (`/api/v1/twins/*`):** Create, info, status, start, stop, restart, destroy, list assets, list services, network info.[cite: 1]
* **Snapshots (`/api/v1/snapshots/*`):** Create, list, details, restore, delete.[cite: 1]

### Simulation & Agent APIs
* **Simulations (`/api/v1/simulations/*`):** Create, list, details, start, pause, resume, stop, cancel, status, retest.[cite: 1]
* **Red Agent (`/api/v1/agents/red/*`):** Start, plan, status, actions, attack-paths, stop.[cite: 1]
* **Blue Agent (`/api/v1/agents/blue/*`):** Start, status, alerts, incidents, investigate, risk, stop.[cite: 1]
* **Purple Agent (`/api/v1/agents/purple/*`):** Start, status, analyze, gaps, recommendations, mitre, score.[cite: 1]

### Security Operations APIs
* **Telemetry (`/api/v1/telemetry/*`):** Submit event, batch submit, retrieve, details, summary.[cite: 1]
* **Alerts & Incidents (`/api/v1/alerts/*`, `/api/v1/incidents/*`):** List, details, update, acknowledge, resolve, investigate, close.[cite: 1]
* **Attack Paths & Vulnerabilities (`/api/v1/attack-paths/*`, `/api/v1/vulnerabilities/*`):** List, details, create finding, update finding.[cite: 1]
* **MITRE ATT&CK (`/api/v1/mitre/*`):** Techniques, tactics, simulation mapping.[cite: 1]
* **Security Responses (`/api/v1/responses/*`):** Available, approve, execute, cancel, status.[cite: 1]
* **Policies (`/api/v1/policies/*`):** List, create, update, delete, check allowed actions.[cite: 1]

### System & Integration APIs
* **Local Connector (`/api/v1/connectors/*`):** Register, list, status, heartbeat, send command, remove.[cite: 1]
* **Scores & Reports (`/api/v1/reports/*`, `/api/v1/security-score`):** Generate, list, download, score history, comparison.[cite: 1]
* **WebSockets (`/ws/simulations/{id}`):** Stream live SOC events for Red, Blue, Purple, and System.[cite: 1]
* **Health Monitoring:** `/health`, `/api/v1/health`, `/api/v1/system/status`, `/api/v1/twins/{id}/health`.[cite: 1]

---

## 6. Security Requirements
* **Checklist:** Authentication, authorization, API authentication, encrypted communication, audit logging, tool allowlists, execution policies, sandbox isolation, resource limits, human approval for high-risk actions, and secrets management.[cite: 1]

---

## 7. Testing & Metrics

### Four Levels of Testing
1. **Unit Testing:** Red Agent, Blue Agent, Twin, API tests.[cite: 1]
2. **Integration Testing:** Red $\rightarrow$ Twin, Blue $\rightarrow$ Telemetry, Purple $\rightarrow$ Red + Blue.[cite: 1]
3. **System Testing:** User $\rightarrow$ Simulation $\rightarrow$ Report.[cite: 1]
4. **Security Testing:** Authentication, API authorization, injection, container escape resistance, secret exposure, unsafe agent behavior, prompt injection resistance.[cite: 1]

### Performance Metrics
* **Red Agent:** Attack success rate, Attack path length, Time to objective, Successful vulnerability identification.[cite: 1]
* **Blue Agent:** Detection rate, False positive rate, Mean Time to Detect, Mean Time to Respond.[cite: 1]
* **Purple Agent:** Detection-gap identification accuracy, MITRE technique coverage, Recommendation quality.[cite: 1]
* **Overall Goal (Before vs After):** Improve Attack Success from 78% to 21%, Detection Coverage from 42% to 89%, Critical Gaps from 9 to 2, MTTD from 4m to 45s, and Security Score from 48 to 91.[cite: 1]