import {
    Activity,
    AlertTriangle,
    ArrowRight,
    BarChart3,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Crosshair,
    FileText,
    Filter,
    Flame,
    History,
    Pause,
    Play,
    Plus,
    RotateCcw,
    Search,
    Shield,
    Skull,
    Target,
    Terminal,
    Timer,
    TrendingUp,
    X,
    Zap,
} from "lucide-react";

import { useState } from "react";
import { Link } from "react-router-dom";

function Simulations() {
    const [showCreate, setShowCreate] = useState(false);
    const [search, setSearch] = useState("");

    const simulations = [
        {
            id: "SIM-024",
            name: "Privilege Escalation Assessment",
            project: "E-Commerce Platform",
            type: "Attack Path",
            agent: "Red Agent",
            status: "Completed",
            risk: "High",
            score: 91,
            duration: "04:28",
            date: "Today, 09:31",
        },
        {
            id: "SIM-023",
            name: "Credential Attack Simulation",
            project: "Banking API",
            type: "Credential",
            agent: "Red Agent",
            status: "Completed",
            risk: "Medium",
            score: 84,
            duration: "07:14",
            date: "Yesterday, 18:42",
        },
        {
            id: "SIM-022",
            name: "API Abuse Scenario",
            project: "E-Commerce Platform",
            type: "Application",
            agent: "Purple Agent",
            status: "Completed",
            risk: "Medium",
            score: 81,
            duration: "05:51",
            date: "Oct 05, 14:17",
        },
        {
            id: "SIM-021",
            name: "Lateral Movement Test",
            project: "Healthcare Core",
            type: "Network",
            agent: "Red Agent",
            status: "Stopped",
            risk: "Critical",
            score: 63,
            duration: "02:11",
            date: "Oct 04, 11:28",
        },
        {
            id: "SIM-020",
            name: "Data Exfiltration Exercise",
            project: "Banking API",
            type: "Exfiltration",
            agent: "Purple Agent",
            status: "Completed",
            risk: "High",
            score: 76,
            duration: "09:32",
            date: "Oct 03, 16:04",
        },
    ];

    const filteredSimulations = simulations.filter((simulation) =>
        `${simulation.id} ${simulation.name} ${simulation.project}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="page-wrapper simulation-page animate-fade">

            {/* HEADER */}

            <div className="simulation-header">

                <div>
                    <div className="page-eyebrow">
                        SECURITY OPERATIONS / SIMULATIONS
                    </div>

                    <h1>Simulation Center</h1>

                    <p>
                        Design, execute and analyze controlled security
                        scenarios inside your Digital Twin.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={() => setShowCreate(true)}
                >
                    <Plus size={14} />
                    New Simulation
                </button>

            </div>

            {/* KPI */}

            <div className="simulation-kpi-grid">

                <div className="simulation-kpi">
                    <div className="simulation-kpi-icon cyan">
                        <Activity size={17} />
                    </div>

                    <div>
                        <span>SIMULATIONS</span>
                        <strong>24</strong>
                        <small>+6 this week</small>
                    </div>
                </div>

                <div className="simulation-kpi">
                    <div className="simulation-kpi-icon green">
                        <CheckCircle2 size={17} />
                    </div>

                    <div>
                        <span>SUCCESSFUL</span>
                        <strong>21</strong>
                        <small>87.5% completion</small>
                    </div>
                </div>

                <div className="simulation-kpi">
                    <div className="simulation-kpi-icon red">
                        <AlertTriangle size={17} />
                    </div>

                    <div>
                        <span>FINDINGS</span>
                        <strong>37</strong>
                        <small>8 high priority</small>
                    </div>
                </div>

                <div className="simulation-kpi">
                    <div className="simulation-kpi-icon purple">
                        <TrendingUp size={17} />
                    </div>

                    <div>
                        <span>AVG. SCORE</span>
                        <strong>83</strong>
                        <small>+11 this month</small>
                    </div>
                </div>

            </div>

            {/* ACTIVE SIMULATION */}

            <section className="panel active-simulation-panel">

                <div className="section-header">

                    <div>
                        <div className="section-eyebrow">
                            LIVE EXECUTION
                        </div>

                        <h2>
                            Current Simulation
                        </h2>
                    </div>

                    <span className="simulation-live-badge">
                        <span />
                        IDLE
                    </span>

                </div>

                <div className="simulation-idle-state">

                    <div className="simulation-idle-icon">
                        <Crosshair size={25} />
                    </div>

                    <div>
                        <strong>
                            No simulation currently running
                        </strong>

                        <span>
                            Launch a controlled attack scenario against
                            a Digital Twin environment.
                        </span>
                    </div>

                    <button
                        className="secondary-button"
                        onClick={() => setShowCreate(true)}
                    >
                        <Play size={13} />
                        Launch Simulation
                    </button>

                </div>

            </section>

            {/* TOOLBAR */}

            <div className="simulation-toolbar">

                <div className="simulation-search">

                    <Search size={14} />

                    <input
                        type="text"
                        placeholder="Search simulations..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                </div>

                <button className="simulation-filter">
                    <Filter size={13} />
                    All types
                    <ChevronRight size={11} />
                </button>

                <button className="simulation-filter">
                    <History size={13} />
                    All status
                    <ChevronRight size={11} />
                </button>

            </div>

            {/* HISTORY */}

            <section className="panel simulation-history-panel">

                <div className="section-header">

                    <div>
                        <div className="section-eyebrow">
                            EXECUTION HISTORY
                        </div>

                        <h2>
                            Recent Simulations
                        </h2>
                    </div>

                    <button className="icon-text-button">
                        Export history
                        <FileText size={13} />
                    </button>

                </div>

                <div className="simulation-table">

                    <div className="simulation-table-head">
                        <span>ID / NAME</span>
                        <span>PROJECT</span>
                        <span>TYPE</span>
                        <span>AGENT</span>
                        <span>STATUS</span>
                        <span>SCORE</span>
                        <span>DATE</span>
                        <span />
                    </div>

                    {filteredSimulations.map((simulation) => (

                        <div
                            className="simulation-table-row"
                            key={simulation.id}
                        >

                            <div className="simulation-name-cell">

                                <div className="simulation-row-icon">
                                    <Zap size={13} />
                                </div>

                                <div>
                                    <strong>
                                        {simulation.name}
                                    </strong>

                                    <span>
                                        {simulation.id}
                                    </span>
                                </div>

                            </div>

                            <span className="table-project">
                                {simulation.project}
                            </span>

                            <span className="simulation-type">
                                {simulation.type}
                            </span>

                            <span className="simulation-agent">
                                <span
                                    className={
                                        simulation.agent === "Red Agent"
                                            ? "agent-red-dot"
                                            : "agent-purple-dot"
                                    }
                                />
                                {simulation.agent}
                            </span>

                            <span
                                className={`simulation-status ${simulation.status.toLowerCase()}`}
                            >
                                {simulation.status}
                            </span>

                            <strong className="simulation-score">
                                {simulation.score}
                            </strong>

                            <span className="simulation-date">
                                {simulation.date}
                            </span>

                            <Link
                                to={`/simulations/${simulation.id}`}
                                className="simulation-open"
                            >
                                <ChevronRight size={14} />
                            </Link>

                        </div>

                    ))}

                </div>

            </section>

            {/* QUICK SCENARIOS */}

            <section className="quick-scenarios">

                <div className="section-header">

                    <div>
                        <div className="section-eyebrow">
                            QUICK LAUNCH
                        </div>

                        <h2>
                            Security Scenarios
                        </h2>
                    </div>

                </div>

                <div className="scenario-grid">

                    <button
                        className="scenario-card red"
                        onClick={() => setShowCreate(true)}
                    >

                        <div className="scenario-icon">
                            <Skull size={19} />
                        </div>

                        <div>
                            <strong>
                                Privilege Escalation
                            </strong>

                            <span>
                                Test identity and privilege boundaries.
                            </span>
                        </div>

                        <ArrowRight size={14} />

                    </button>

                    <button
                        className="scenario-card orange"
                        onClick={() => setShowCreate(true)}
                    >

                        <div className="scenario-icon">
                            <Flame size={19} />
                        </div>

                        <div>
                            <strong>
                                Credential Attack
                            </strong>

                            <span>
                                Evaluate authentication resilience.
                            </span>
                        </div>

                        <ArrowRight size={14} />

                    </button>

                    <button
                        className="scenario-card purple"
                        onClick={() => setShowCreate(true)}
                    >

                        <div className="scenario-icon">
                            <Target size={19} />
                        </div>

                        <div>
                            <strong>
                                Data Exfiltration
                            </strong>

                            <span>
                                Test data protection and detection.
                            </span>
                        </div>

                        <ArrowRight size={14} />

                    </button>

                    <button
                        className="scenario-card blue"
                        onClick={() => setShowCreate(true)}
                    >

                        <div className="scenario-icon">
                            <NetworkIcon />
                        </div>

                        <div>
                            <strong>
                                Lateral Movement
                            </strong>

                            <span>
                                Validate network segmentation.
                            </span>
                        </div>

                        <ArrowRight size={14} />

                    </button>

                </div>

            </section>

            {/* CREATE MODAL */}

            {showCreate && (
                <CreateSimulationModal
                    onClose={() => setShowCreate(false)}
                />
            )}

        </div>
    );
}


/* =========================================================
   CREATE SIMULATION MODAL
========================================================= */

function CreateSimulationModal({ onClose }) {
    const [scenario, setScenario] = useState(
        "Privilege Escalation"
    );

    const [intensity, setIntensity] = useState("Controlled");

    const [agent, setAgent] = useState("Red Agent");

    const [target, setTarget] = useState(
        "E-Commerce Platform"
    );

    return (
        <div className="modal-backdrop">

            <div className="simulation-modal">

                <div className="simulation-modal-header">

                    <div>

                        <div className="section-eyebrow">
                            SIMULATION CONFIGURATION
                        </div>

                        <h2>
                            Create Simulation
                        </h2>

                    </div>

                    <button
                        className="modal-close"
                        onClick={onClose}
                    >
                        <X size={17} />
                    </button>

                </div>

                <div className="simulation-modal-body">

                    {/* TARGET */}

                    <div className="simulation-form-section">

                        <label>
                            TARGET ENVIRONMENT
                        </label>

                        <div className="target-selector">

                            <div className="target-icon">
                                <Shield size={17} />
                            </div>

                            <div>
                                <strong>
                                    {target}
                                </strong>

                                <span>
                                    PROD-TWIN-001 · Production
                                </span>
                            </div>

                            <ChevronRight size={14} />

                        </div>

                    </div>

                    {/* SCENARIO */}

                    <div className="simulation-form-section">

                        <label>
                            ATTACK SCENARIO
                        </label>

                        <div className="scenario-select-grid">

                            {[
                                "Privilege Escalation",
                                "Credential Attack",
                                "Data Exfiltration",
                                "Lateral Movement",
                            ].map((item) => (

                                <button
                                    key={item}
                                    className={
                                        scenario === item
                                            ? "scenario-select active"
                                            : "scenario-select"
                                    }
                                    onClick={() =>
                                        setScenario(item)
                                    }
                                >

                                    <Crosshair size={13} />

                                    {item}

                                </button>

                            ))}

                        </div>

                    </div>

                    {/* AGENT */}

                    <div className="simulation-form-section">

                        <label>
                            EXECUTION AGENT
                        </label>

                        <div className="agent-select-grid">

                            <button
                                className={
                                    agent === "Red Agent"
                                        ? "agent-select active red"
                                        : "agent-select red"
                                }
                                onClick={() =>
                                    setAgent("Red Agent")
                                }
                            >

                                <div className="agent-select-icon">
                                    <Skull size={15} />
                                </div>

                                <div>
                                    <strong>
                                        Red Agent
                                    </strong>

                                    <span>
                                        Offensive simulation
                                    </span>
                                </div>

                            </button>

                            <button
                                className={
                                    agent === "Purple Agent"
                                        ? "agent-select active purple"
                                        : "agent-select purple"
                                }
                                onClick={() =>
                                    setAgent("Purple Agent")
                                }
                            >

                                <div className="agent-select-icon">
                                    <Target size={15} />
                                </div>

                                <div>
                                    <strong>
                                        Purple Agent
                                    </strong>

                                    <span>
                                        Attack + detection analysis
                                    </span>
                                </div>

                            </button>

                        </div>

                    </div>

                    {/* INTENSITY */}

                    <div className="simulation-form-section">

                        <label>
                            SIMULATION INTENSITY
                        </label>

                        <div className="intensity-options">

                            {[
                                ["Controlled", "Low impact"],
                                ["Standard", "Normal execution"],
                                ["Aggressive", "Maximum coverage"],
                            ].map(([name, description]) => (

                                <button
                                    key={name}
                                    className={
                                        intensity === name
                                            ? "intensity-option active"
                                            : "intensity-option"
                                    }
                                    onClick={() =>
                                        setIntensity(name)
                                    }
                                >

                                    <div>

                                        <span
                                            className={
                                                intensity === name
                                                    ? "radio active"
                                                    : "radio"
                                            }
                                        />

                                        <strong>
                                            {name}
                                        </strong>

                                    </div>

                                    <small>
                                        {description}
                                    </small>

                                </button>

                            ))}

                        </div>

                    </div>

                    {/* WARNING */}

                    <div className="simulation-warning">

                        <AlertTriangle size={15} />

                        <div>

                            <strong>
                                Controlled environment only
                            </strong>

                            <span>
                                This simulation will execute only against
                                the selected Digital Twin and will not
                                interact with the production environment.
                            </span>

                        </div>

                    </div>

                </div>

                <div className="simulation-modal-footer">

                    <button
                        className="secondary-button"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button className="primary-button">

                        <Play size={13} />

                        Launch Simulation

                    </button>

                </div>

            </div>

        </div>
    );
}


/* =========================================================
   NETWORK ICON
========================================================= */

function NetworkIcon() {
    return (
        <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
        >
            <circle cx="12" cy="5" r="2.5" />
            <circle cx="5" cy="18" r="2.5" />
            <circle cx="19" cy="18" r="2.5" />
            <path d="M10.5 7 6.5 16" />
            <path d="M13.5 7 17.5 16" />
            <path d="M7.5 18h9" />
        </svg>
    );
}

export default Simulations;