import {
    Activity,
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Crosshair,
    Eye,
    FileText,
    Flame,
    Lock,
    Network,
    Pause,
    Play,
    RotateCcw,
    Server,
    Shield,
    ShieldAlert,
    Skull,
    Terminal,
    Timer,
    TrendingUp,
    User,
    Wifi,
    XCircle,
    Zap,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function SimulationDetails() {
    const { simulationId } = useParams();

    const [running, setRunning] = useState(false);
    const [elapsed, setElapsed] = useState(268);
    const [activeStep, setActiveStep] = useState(4);

    useEffect(() => {
        if (!running) return;

        const timer = setInterval(() => {
            setElapsed((value) => value + 1);

            setActiveStep((value) => {
                if (value >= 6) return value;
                return value + 1;
            });
        }, 2500);

        return () => clearInterval(timer);
    }, [running]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");

        const secs = (seconds % 60)
            .toString()
            .padStart(2, "0");

        return `${minutes}:${secs}`;
    };

    const attackSteps = [
        {
            id: 1,
            name: "Initial Access",
            technique: "T1190",
            description: "Exploit Public-Facing Application",
            status: "completed",
            time: "00:32",
        },
        {
            id: 2,
            name: "Execution",
            technique: "T1059",
            description: "Command and Scripting Interpreter",
            status: "completed",
            time: "01:08",
        },
        {
            id: 3,
            name: "Discovery",
            technique: "T1087",
            description: "Account Discovery",
            status: "completed",
            time: "01:47",
        },
        {
            id: 4,
            name: "Privilege Escalation",
            technique: "T1068",
            description: "Exploitation for Privilege Escalation",
            status: "active",
            time: "03:12",
        },
        {
            id: 5,
            name: "Lateral Movement",
            technique: "T1021",
            description: "Remote Services",
            status: "pending",
            time: "--:--",
        },
        {
            id: 6,
            name: "Collection",
            technique: "T1005",
            description: "Data from Local System",
            status: "pending",
            time: "--:--",
        },
    ];

    const events = [
        {
            time: "09:31:04",
            type: "system",
            message: "Simulation environment initialized",
        },
        {
            time: "09:31:21",
            type: "attack",
            message: "Initial access vector activated",
        },
        {
            time: "09:32:08",
            type: "attack",
            message: "Execution phase initiated",
        },
        {
            time: "09:32:47",
            type: "detection",
            message: "Suspicious process activity detected",
        },
        {
            time: "09:33:12",
            type: "attack",
            message: "Account discovery behavior observed",
        },
        {
            time: "09:34:26",
            type: "detection",
            message: "Privilege escalation attempt detected",
        },
        {
            time: "09:35:03",
            type: "system",
            message: "Telemetry synchronized successfully",
        },
        {
            time: "09:35:41",
            type: "warning",
            message: "Database access anomaly detected",
        },
    ];

    return (
        <div className="page-wrapper simulation-details-page animate-fade">

            {/* =====================================================
          TOP BAR
      ====================================================== */}

            <div className="simulation-details-topbar">

                <div className="simulation-breadcrumb">

                    <Link to="/simulations">
                        <ArrowLeft size={14} />
                        Simulations
                    </Link>

                    <ChevronRight size={12} />

                    <span>
                        {simulationId || "SIM-024"}
                    </span>

                </div>

                <div className="simulation-control-actions">

                    <button className="secondary-button">
                        <RotateCcw size={13} />
                        Restart
                    </button>

                    <button
                        className={
                            running
                                ? "simulation-pause-button"
                                : "primary-button"
                        }
                        onClick={() => setRunning((value) => !value)}
                    >

                        {running ? (
                            <>
                                <Pause size={13} />
                                Pause Simulation
                            </>
                        ) : (
                            <>
                                <Play size={13} />
                                Resume Simulation
                            </>
                        )}

                    </button>

                </div>

            </div>

            {/* =====================================================
          SIMULATION HEADER
      ====================================================== */}

            <section className="simulation-execution-header">

                <div className="execution-title">

                    <div className="execution-icon">
                        <Skull size={22} />
                    </div>

                    <div>

                        <div className="page-eyebrow">
                            RED AGENT / ACTIVE SIMULATION
                        </div>

                        <h1>
                            Privilege Escalation Assessment
                        </h1>

                        <div className="execution-meta">

                            <span>
                                {simulationId || "SIM-024"}
                            </span>

                            <i />

                            <span>
                                E-Commerce Platform
                            </span>

                            <i />

                            <span>
                                Production Twin
                            </span>

                        </div>

                    </div>

                </div>

                <div className="execution-state">

                    <div className="execution-live">

                        <span />

                        {running ? "RUNNING" : "PAUSED"}

                    </div>

                    <div className="execution-timer">

                        <Timer size={13} />

                        {formatTime(elapsed)}

                    </div>

                </div>

            </section>

            {/* =====================================================
          SUMMARY BAR
      ====================================================== */}

            <div className="execution-summary">

                <div>
                    <span>ATTACKER</span>
                    <strong className="red-text">
                        RED AGENT
                    </strong>
                </div>

                <div>
                    <span>TARGET</span>
                    <strong>
                        api-gateway-01
                    </strong>
                </div>

                <div>
                    <span>ATTACK PATH</span>
                    <strong>
                        6 stages
                    </strong>
                </div>

                <div>
                    <span>TECHNIQUES</span>
                    <strong>
                        06
                    </strong>
                </div>

                <div>
                    <span>DETECTIONS</span>
                    <strong className="green-text">
                        04
                    </strong>
                </div>

                <div>
                    <span>RISK</span>
                    <strong className="red-text">
                        HIGH
                    </strong>
                </div>

            </div>

            {/* =====================================================
          MAIN EXECUTION GRID
      ====================================================== */}

            <div className="execution-main-grid">

                {/* =================================================
            ATTACK CHAIN
        ================================================== */}

                <section className="panel attack-chain-panel">

                    <div className="section-header">

                        <div>

                            <div className="section-eyebrow">
                                ATTACK PATH
                            </div>

                            <h2>
                                Attack Chain
                            </h2>

                        </div>

                        <span className="chain-progress">
                            {Math.min(activeStep, 6)} / 6
                        </span>

                    </div>

                    <div className="attack-chain">

                        {attackSteps.map((step, index) => (

                            <div
                                className={`attack-step ${step.status}`}
                                key={step.id}
                            >

                                <div className="attack-step-number">

                                    {step.status === "completed" ? (
                                        <CheckCircle2 size={13} />
                                    ) : step.status === "active" ? (
                                        <Zap size={13} />
                                    ) : (
                                        step.id
                                    )}

                                </div>

                                <div className="attack-step-content">

                                    <div className="attack-step-top">

                                        <strong>
                                            {step.name}
                                        </strong>

                                        <span>
                                            {step.time}
                                        </span>

                                    </div>

                                    <span className="attack-step-description">
                                        {step.description}
                                    </span>

                                    <div className="mitre-tag">
                                        MITRE {step.technique}
                                    </div>

                                </div>

                                {index < attackSteps.length - 1 && (
                                    <div className="attack-chain-line" />
                                )}

                            </div>

                        ))}

                    </div>

                </section>

                {/* =================================================
            LIVE TERMINAL
        ================================================== */}

                <section className="panel execution-terminal-panel">

                    <div className="terminal-header">

                        <div>

                            <div className="section-eyebrow">
                                EXECUTION STREAM
                            </div>

                            <h2>
                                Agent Console
                            </h2>

                        </div>

                        <div className="terminal-status">
                            <span />
                            LIVE
                        </div>

                    </div>

                    <div className="terminal-window">

                        <div className="terminal-top">

                            <span />
                            <span />
                            <span />

                            <label>
                                red-agent@sim-024
                            </label>

                        </div>

                        <div className="terminal-content">

                            <div className="terminal-line muted">
                                <span>09:31:04</span>
                                Environment initialized...
                            </div>

                            <div className="terminal-line cyan">
                                <span>09:31:21</span>
                                [*] Attack path loaded
                            </div>

                            <div className="terminal-line">
                                <span>09:32:08</span>
                [] Executing stage: Initial Access
                            </div>

                            <div className="terminal-line">
                                <span>09:32:47</span>
                [] Moving to Execution
                            </div>

                            <div className="terminal-line green">
                                <span>09:33:12</span>
                                [+] Discovery activity completed
                            </div>

                            <div className="terminal-line yellow">
                                <span>09:34:26</span>
                                [!] Detection received from Blue Agent
                            </div>

                            <div className="terminal-line">
                                <span>09:34:42</span>
                [] Evaluating privilege boundary
                            </div>

                            <div className="terminal-line red">
                                <span>09:35:03</span>
                                [!] Elevated context detected
                            </div>

                            <div className="terminal-line cyan">
                                <span>09:35:41</span>
                                [*] Collecting telemetry
                            </div>

                            <div className="terminal-cursor">
                                <span>root@red-agent:~$</span>
                                <i />
                            </div>

                        </div>

                    </div>

                </section>

            </div>

            {/* =====================================================
          SECOND ROW
      ====================================================== */}

            <div className="execution-lower-grid">

                {/* DETECTIONS */}

                <section className="panel">

                    <div className="section-header">

                        <div>

                            <div className="section-eyebrow">
                                BLUE AGENT
                            </div>

                            <h2>
                                Detection Coverage
                            </h2>

                        </div>

                        <span className="detection-score">
                            67%
                        </span>

                    </div>

                    <div className="detection-meter">

                        <div>
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                        </div>

                    </div>

                    <div className="detection-summary">

                        <div>
                            <strong>04</strong>
                            <span>Detected</span>
                        </div>

                        <div>
                            <strong>02</strong>
                            <span>Undetected</span>
                        </div>

                        <div>
                            <strong>01</strong>
                            <span>Critical gap</span>
                        </div>

                    </div>

                    <div className="detection-list">

                        <div>
                            <CheckCircle2 size={13} />
                            Initial access
                            <b>Detected</b>
                        </div>

                        <div>
                            <CheckCircle2 size={13} />
                            Execution
                            <b>Detected</b>
                        </div>

                        <div>
                            <CheckCircle2 size={13} />
                            Discovery
                            <b>Detected</b>
                        </div>

                        <div className="undetected">
                            <XCircle size={13} />
                            Privilege escalation
                            <b>Missed</b>
                        </div>

                    </div>

                </section>

                {/* TELEMETRY */}

                <section className="panel">

                    <div className="section-header">

                        <div>

                            <div className="section-eyebrow">
                                OBSERVABILITY
                            </div>

                            <h2>
                                Live Telemetry
                            </h2>

                        </div>

                        <Activity size={15} className="telemetry-header-icon" />

                    </div>

                    <div className="execution-metric-grid">

                        <div className="execution-metric">

                            <div>
                                <CpuIcon />
                            </div>

                            <span>CPU</span>

                            <strong>
                                72%
                            </strong>

                            <small>
                                +18%
                            </small>

                        </div>

                        <div className="execution-metric">

                            <div>
                                <Network size={13} />
                            </div>

                            <span>NETWORK</span>

                            <strong>
                                3.8 GB/s
                            </strong>

                            <small>
                                +12%
                            </small>

                        </div>

                        <div className="execution-metric">

                            <div>
                                <Terminal size={13} />
                            </div>

                            <span>EVENTS</span>

                            <strong>
                                428
                            </strong>

                            <small>
                                +67
                            </small>

                        </div>

                        <div className="execution-metric">

                            <div>
                                <Server size={13} />
                            </div>

                            <span>HOSTS</span>

                            <strong>
                                07
                            </strong>

                            <small>
                                impacted
                            </small>

                        </div>

                    </div>

                    <div className="telemetry-graph">

                        <div className="graph-grid" />

                        <svg
                            viewBox="0 0 500 130"
                            preserveAspectRatio="none"
                        >

                            <polyline
                                points="
                        0,105
                        35,102
                        70,108
                        105,92
                        140,97
                        175,73
                        210,81
                        245,54
                        280,63
                        315,38
                        350,45
                        385,28
                        420,35
                        455,15
                        500,21
                "
                                className="telemetry-line"
                            />

                            <polyline
                                points="
                    0,115
                    50,113
                    100,116
                    150,110
                    200,112
                    250,105
                    300,107
                    350,99
                    400,101
                    450,95
                    500,96
                "
                                className="telemetry-line-secondary"
                            />

                        </svg>

                    </div>

                </section>

                {/* TARGET */}

                <section className="panel">

                    <div className="section-header">

                        <div>

                            <div className="section-eyebrow">
                                TARGET
                            </div>

                            <h2>
                                Compromised Assets
                            </h2>

                        </div>

                    </div>

                    <div className="asset-list">

                        <div className="asset-item">

                            <div className="asset-icon critical">
                                <Server size={14} />
                            </div>

                            <div>

                                <strong>
                                    api-gateway-01
                                </strong>

                                <span>
                                    10.20.4.18
                                </span>

                            </div>

                            <b className="critical-text">
                                HIGH
                            </b>

                        </div>

                        <div className="asset-item">

                            <div className="asset-icon warning">
                                <Server size={14} />
                            </div>

                            <div>

                                <strong>
                                    auth-service-02
                                </strong>

                                <span>
                                    10.20.5.12
                                </span>

                            </div>

                            <b className="warning-text">
                                MED
                            </b>

                        </div>

                        <div className="asset-item">

                            <div className="asset-icon safe">
                                <Server size={14} />
                            </div>

                            <div>

                                <strong>
                                    database-01
                                </strong>

                                <span>
                                    10.30.1.20
                                </span>

                            </div>

                            <b className="safe-text">
                                SAFE
                            </b>

                        </div>

                    </div>

                </section>

            </div>

            {/* =====================================================
          EVENT STREAM
      ====================================================== */}

            <section className="panel execution-events-panel">

                <div className="section-header">

                    <div>

                        <div className="section-eyebrow">
                            EVENT STREAM
                        </div>

                        <h2>
                            Simulation Activity
                        </h2>

                    </div>

                    <div className="event-stream-actions">

                        <span>
                            <span className="live-dot" />
                            8 events
                        </span>

                        <button className="icon-text-button">
                            Export
                            <FileText size={13} />
                        </button>

                    </div>

                </div>

                <div className="execution-event-list">

                    {events.map((event, index) => (

                        <div
                            className="execution-event"
                            key={index}
                        >

                            <span className="execution-event-time">
                                {event.time}
                            </span>

                            <span
                                className={`execution-event-icon ${event.type}`}
                            >

                                {event.type === "attack" && (
                                    <Skull size={11} />
                                )}

                                {event.type === "detection" && (
                                    <ShieldCheckIcon />
                                )}

                                {event.type === "system" && (
                                    <Activity size={11} />
                                )}

                                {event.type === "warning" && (
                                    <AlertTriangle size={11} />
                                )}

                            </span>

                            <div>

                                <strong>
                                    {event.message}
                                </strong>

                                <span>
                                    Source:{" "}
                                    {event.type === "attack"
                                        ? "Red Agent"
                                        : event.type === "detection"
                                            ? "Blue Agent"
                                            : "Simulation Engine"}
                                </span>

                            </div>

                        </div>

                    ))}

                </div>

            </section>

            {/* =====================================================
          RESULTS PREVIEW
      ====================================================== */}

            <section className="simulation-results-preview">

                <div>

                    <div className="section-eyebrow">
                        CURRENT ASSESSMENT
                    </div>

                    <h2>
                        Simulation Security Score
                    </h2>

                    <p>
                        The current attack path exposed weaknesses in
                        privilege boundaries and detection coverage.
                    </p>

                </div>

                <div className="result-score">

                    <div className="result-score-ring">

                        <strong>
                            67
                        </strong>

                        <span>
                            /100
                        </span>

                    </div>

                    <div>

                        <strong>
                            Needs Improvement
                        </strong>

                        <span>
                            2 critical security gaps identified
                        </span>

                    </div>

                </div>

                <Link
                    to={`/simulations/${simulationId || "SIM-024"}/results`}
                    className="primary-button"
                >

                    View Full Results

                    <ChevronRight size={13} />

                </Link>

            </section>

        </div>
    );
}


/* =========================================================
   SMALL ICON HELPERS
========================================================= */

function CpuIcon() {
    return (
        <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
        >
            <rect x="5" y="5" width="14" height="14" rx="2" />
            <path d="M9 1v4M15 1v4M9 19v4M15 19v4" />
            <path d="M1 9h4M1 15h4M19 9h4M19 15h4" />
        </svg>
    );
}

function ShieldCheckIcon() {
    return (
        <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M12 3 5 6v5c0 4.5 2.9 8.5 7 10 4.1-1.5 7-5.5 7-10V6l-7-3Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

export default SimulationDetails;