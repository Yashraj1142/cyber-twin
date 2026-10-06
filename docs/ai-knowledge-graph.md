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