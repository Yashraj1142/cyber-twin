import { useEffect, useMemo, useState } from "react";
import {
    Activity,
    CheckCircle2,
    ChevronRight,
    CircleAlert,
    Crosshair,
    Eye,
    GitBranch,
    Network,
    Pause,
    Play,
    Radio,
    RotateCcw,
    Server,
    ShieldAlert,
    Skull,
    Square,
    Target,
    Terminal,
    Zap,
} from "lucide-react";

const scenarios = [
    {
        id: "privilege",
        name: "Privilege Boundary Assessment",
        description:
            "Evaluate whether the simulated environment exposes privilege escalation paths.",
        technique: "T1068",
        stages: 4,
        risk: "High",
    },
    {
        id: "credential",
        name: "Credential Exposure Assessment",
        description:
            "Simulate credential exposure conditions across selected digital-twin assets.",
        technique: "T1552",
        stages: 3,
        risk: "High",
    },
    {
        id: "lateral",
        name: "Lateral Movement Simulation",
        description:
            "Model movement between connected assets inside the isolated environment.",
        technique: "T1021",
        stages: 5,
        risk: "Critical",
    },
    {
        id: "web",
        name: "Web Attack Path Assessment",
        description:
            "Evaluate the simulated web application attack surface and trust boundaries.",
        technique: "T1190",
        stages: 4,
        risk: "Medium",
    },
];

const assets = [
    {
        id: "WEB-01",
        name: "Web Server",
        ip: "10.10.20.11",
        type: "Linux",
        zone: "DMZ",
    },
    {
        id: "APP-01",
        name: "Application Server",
        ip: "10.10.30.21",
        type: "Linux",
        zone: "Application",
    },
    {
        id: "DB-01",
        name: "Database Server",
        ip: "10.10.40.15",
        type: "Linux",
        zone: "Database",
    },
    {
        id: "WIN-DC",
        name: "Domain Controller",
        ip: "10.10.50.10",
        type: "Windows",
        zone: "Identity",
    },
];

const techniques = [
    {
        id: "T1190",
        name: "Exploit Public-Facing Application",
        phase: "Initial Access",
    },
    {
        id: "T1078",
        name: "Valid Accounts",
        phase: "Initial Access",
    },
    {
        id: "T1068",
        name: "Exploitation for Privilege Escalation",
        phase: "Privilege Escalation",
    },
    {
        id: "T1021",
        name: "Remote Services",
        phase: "Lateral Movement",
    },
    {
        id: "T1005",
        name: "Data from Local System",
        phase: "Collection",
    },
];

const initialLogs = [
    {
        time: "09:41:02",
        type: "SYSTEM",
        message: "Red Agent workspace initialized.",
    },
    {
        time: "09:41:04",
        type: "SCOPE",
        message: "Digital Twin environment loaded successfully.",
    },
    {
        time: "09:41:07",
        type: "READY",
        message: "Simulation plan awaiting validation.",
    },
];

function RedAgent() {
    const [selectedScenario, setSelectedScenario] = useState("privilege");
    const [selectedAssets, setSelectedAssets] = useState([
        "WEB-01",
        "APP-01",
        "DB-01",
    ]);
    const [selectedTechniques, setSelectedTechniques] = useState([
        "T1190",
        "T1068",
        "T1021",
    ]);

    const [status, setStatus] = useState("READY");
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState(initialLogs);

    const scenario = useMemo(
        () => scenarios.find((item) => item.id === selectedScenario),
        [selectedScenario]
    );

    useEffect(() => {
        if (status !== "RUNNING") return;

        const timer = setInterval(() => {
            setProgress((current) => {
                if (current >= 100) {
                    clearInterval(timer);
                    setStatus("COMPLETED");

                    setLogs((previous) => [
                        ...previous,
                        {
                            time: new Date().toLocaleTimeString("en-GB"),
                            type: "DONE",
                            message: "Simulation sequence completed successfully.",
                        },
                    ]);

                    return 100;
                }

                const next = Math.min(current + 8, 100);

                if (next % 24 === 0) {
                    setLogs((previous) => [
                        ...previous,
                        {
                            time: new Date().toLocaleTimeString("en-GB"),
                            type: "EVENT",
                            message: `Simulation stage progressed to ${next}% completion.`,
                        },
                    ]);
                }

                return next;
            });
        }, 700);

        return () => clearInterval(timer);
    }, [status]);

    const toggleAsset = (assetId) => {
        setSelectedAssets((current) =>
            current.includes(assetId)
                ? current.filter((id) => id !== assetId)
                : [...current, assetId]
        );
    };

    const toggleTechnique = (techniqueId) => {
        setSelectedTechniques((current) =>
            current.includes(techniqueId)
                ? current.filter((id) => id !== techniqueId)
                : [...current, techniqueId]
        );
    };

    const validatePlan = () => {
        setLogs((previous) => [
            ...previous,
            {
                time: new Date().toLocaleTimeString("en-GB"),
                type: "VALID",
                message: "Simulation plan validated. No scope conflicts detected.",
            },
        ]);

        setStatus("VALIDATED");
    };

    const startSimulation = () => {
        if (!selectedAssets.length || !selectedTechniques.length) return;

        setProgress(0);
        setStatus("RUNNING");

        setLogs((previous) => [
            ...previous,
            {
                time: new Date().toLocaleTimeString("en-GB"),
                type: "START",
                message: `Started ${scenario.name}.`,
            },
        ]);
    };

    const pauseSimulation = () => {
        setStatus("PAUSED");

        setLogs((previous) => [
            ...previous,
            {
                time: new Date().toLocaleTimeString("en-GB"),
                type: "PAUSE",
                message: "Simulation execution paused by operator.",
            },
        ]);
    };

    const stopSimulation = () => {
        setStatus("STOPPED");

        setLogs((previous) => [
            ...previous,
            {
                time: new Date().toLocaleTimeString("en-GB"),
                type: "STOP",
                message: "Simulation execution terminated by operator.",
            },
        ]);
    };

    const resetWorkspace = () => {
        setStatus("READY");
        setProgress(0);
        setLogs(initialLogs);
    };

    return (
        <main className="page-wrapper red-agent-page">
            <div className="red-agent-topbar">
                <div className="red-agent-breadcrumb">
                    <span>CYBER-TWIN</span>
                    <ChevronRight size={13} />
                    <span>RED AGENT</span>
                    <ChevronRight size={13} />
                    <strong>SIMULATION WORKSPACE</strong>
                </div>

                <div className="red-agent-status">
                    <span className="red-agent-status-dot" />
                    ISOLATED ENVIRONMENT
                </div>
            </div>

            <section className="red-agent-header animate-fade">
                <div>
                    <div className="page-eyebrow red-text">
                        <Skull size={14} />
                        RED TEAM OPERATIONS
                    </div>

                    <h1>Red Agent</h1>

                    <p>
                        Design and execute controlled adversarial scenarios against the
                        Cyber-Twin environment.
                    </p>
                </div>

                <div className="red-agent-header-metrics">
                    <div>
                        <span>AGENT</span>
                        <strong>RED-01</strong>
                    </div>

                    <div>
                        <span>MODE</span>
                        <strong>SIMULATION</strong>
                    </div>

                    <div>
                        <span>STATUS</span>
                        <strong className={status === "RUNNING" ? "red-text" : ""}>
                            {status}
                        </strong>
                    </div>
                </div>
            </section>

            <section className="red-agent-commandbar panel">
                <div className="red-agent-command-title">
                    <Crosshair size={18} />
                    <div>
                        <span className="section-eyebrow">OPERATION CONTROL</span>
                        <strong>Adversarial Simulation Controller</strong>
                    </div>
                </div>

                <div className="red-agent-actions">
                    <button className="secondary-button" onClick={validatePlan}>
                        <CheckCircle2 size={15} />
                        Validate Plan
                    </button>

                    {status !== "RUNNING" ? (
                        <button
                            className="primary-button red-agent-run-button"
                            onClick={startSimulation}
                            disabled={!selectedAssets.length || !selectedTechniques.length}
                        >
                            <Play size={15} />
                            Start Simulation
                        </button>
                    ) : (
                        <>
                            <button className="secondary-button" onClick={pauseSimulation}>
                                <Pause size={15} />
                                Pause
                            </button>

                            <button className="secondary-button red-agent-stop" onClick={stopSimulation}>
                                <Square size={14} />
                                Stop
                            </button>
                        </>
                    )}

                    <button className="icon-text-button" onClick={resetWorkspace}>
                        <RotateCcw size={14} />
                        Reset
                    </button>
                </div>
            </section>

            <section className="red-agent-layout">
                <div className="red-agent-left">
                    <div className="panel red-agent-panel">
                        <div className="section-header">
                            <div>
                                <span className="section-eyebrow">01 / SCENARIO LIBRARY</span>
                                <h2>Select Assessment</h2>
                            </div>
                            <Zap size={17} />
                        </div>

                        <div className="red-agent-scenarios">
                            {scenarios.map((item) => (
                                <button
                                    key={item.id}
                                    className={`red-agent-scenario ${selectedScenario === item.id ? "active" : ""
                                        }`}
                                    onClick={() => setSelectedScenario(item.id)}
                                >
                                    <div className="red-agent-scenario-top">
                                        <span>{item.technique}</span>
                                        <span className={`risk-${item.risk.toLowerCase()}`}>
                                            {item.risk}
                                        </span>
                                    </div>

                                    <strong>{item.name}</strong>

                                    <p>{item.description}</p>

                                    <div className="red-agent-scenario-footer">
                                        <span>{item.stages} stages</span>
                                        <ChevronRight size={14} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="panel red-agent-panel">
                        <div className="section-header">
                            <div>
                                <span className="section-eyebrow">02 / TARGET SCOPE</span>
                                <h2>Digital Twin Assets</h2>
                            </div>
                            <Target size={17} />
                        </div>

                        <div className="red-agent-assets">
                            {assets.map((asset) => {
                                const selected = selectedAssets.includes(asset.id);

                                return (
                                    <button
                                        key={asset.id}
                                        className={`red-agent-asset ${selected ? "selected" : ""}`}
                                        onClick={() => toggleAsset(asset.id)}
                                    >
                                        <div className="red-agent-checkbox">
                                            {selected && <CheckCircle2 size={14} />}
                                        </div>

                                        <div className="red-agent-asset-icon">
                                            <Server size={16} />
                                        </div>

                                        <div className="red-agent-asset-info">
                                            <strong>{asset.name}</strong>
                                            <span>
                                                {asset.id} · {asset.ip}
                                            </span>
                                        </div>

                                        <span className="red-agent-zone">{asset.zone}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="red-agent-center">
                    <div className="panel red-agent-panel red-agent-plan-panel">
                        <div className="section-header">
                            <div>
                                <span className="section-eyebrow">03 / ATTACK PLAN</span>
                                <h2>Technique Sequence</h2>
                            </div>

                            <GitBranch size={17} />
                        </div>

                        <div className="red-agent-chain">
                            {selectedTechniques.map((techniqueId, index) => {
                                const technique = techniques.find(
                                    (item) => item.id === techniqueId
                                );

                                return (
                                    <div className="red-agent-chain-item" key={techniqueId}>
                                        <div className="red-agent-chain-index">
                                            0{index + 1}
                                        </div>

                                        <div className="red-agent-chain-content">
                                            <div>
                                                <span>{technique.phase}</span>
                                                <strong>{technique.name}</strong>
                                            </div>

                                            <code>{technique.id}</code>
                                        </div>

                                        {index < selectedTechniques.length - 1 && (
                                            <div className="red-agent-chain-line" />
                                        )}
                                    </div>
                                );
                            })}

                            {!selectedTechniques.length && (
                                <div className="red-agent-empty">
                                    <CircleAlert size={18} />
                                    Select at least one technique.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="panel red-agent-panel red-agent-technique-panel">
                        <div className="section-header">
                            <div>
                                <span className="section-eyebrow">TECHNIQUE CATALOG</span>
                                <h2>MITRE Technique Selection</h2>
                            </div>

                            <ShieldAlert size={17} />
                        </div>

                        <div className="red-agent-techniques">
                            {techniques.map((technique) => {
                                const selected = selectedTechniques.includes(technique.id);

                                return (
                                    <button
                                        key={technique.id}
                                        className={`red-agent-technique ${selected ? "selected" : ""
                                            }`}
                                        onClick={() => toggleTechnique(technique.id)}
                                    >
                                        <div>
                                            <code>{technique.id}</code>
                                            <strong>{technique.name}</strong>
                                        </div>

                                        <span>{technique.phase}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="red-agent-right">
                    <div className="panel red-agent-panel red-agent-overview">
                        <div className="section-header">
                            <div>
                                <span className="section-eyebrow">OPERATION SNAPSHOT</span>
                                <h2>Current Plan</h2>
                            </div>

                            <Activity size={17} />
                        </div>

                        <div className="red-agent-overview-grid">
                            <div>
                                <span>SCENARIO</span>
                                <strong>{scenario.name}</strong>
                            </div>

                            <div>
                                <span>TARGETS</span>
                                <strong>{selectedAssets.length}</strong>
                            </div>

                            <div>
                                <span>TECHNIQUES</span>
                                <strong>{selectedTechniques.length}</strong>
                            </div>

                            <div>
                                <span>RISK LEVEL</span>
                                <strong className="red-text">{scenario.risk}</strong>
                            </div>
                        </div>

                        <div className="red-agent-progress">
                            <div className="red-agent-progress-header">
                                <span>EXECUTION PROGRESS</span>
                                <strong>{progress}%</strong>
                            </div>

                            <div className="red-agent-progress-track">
                                <div
                                    className="red-agent-progress-fill"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="panel red-agent-panel red-agent-console">
                        <div className="section-header">
                            <div>
                                <span className="section-eyebrow">LIVE CONSOLE</span>
                                <h2>Agent Telemetry</h2>
                            </div>

                            <Radio size={17} />
                        </div>

                        <div className="red-agent-console-header">
                            <div>
                                <span className="red-agent-console-dot" />
                                STREAMING
                            </div>

                            <span>RED-01 / SIM-ENV</span>
                        </div>

                        <div className="red-agent-log">
                            {logs.map((log, index) => (
                                <div className="red-agent-log-line" key={`${log.time}-${index}`}>
                                    <span className="red-agent-log-time">{log.time}</span>
                                    <span
                                        className={`red-agent-log-type type-${log.type.toLowerCase()}`}
                                    >
                                        {log.type}
                                    </span>
                                    <span className="red-agent-log-message">
                                        {log.message}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="red-agent-console-input">
                            <Terminal size={14} />
                            <span>Agent console is simulation-only</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="red-agent-bottom-grid">
                <div className="panel red-agent-stat-card">
                    <div>
                        <Network size={18} />
                        <span>ASSET COVERAGE</span>
                    </div>
                    <strong>{selectedAssets.length}/4</strong>
                    <small>Digital-twin assets in scope</small>
                </div>

                <div className="panel red-agent-stat-card">
                    <div>
                        <Crosshair size={18} />
                        <span>TECHNIQUE COVERAGE</span>
                    </div>
                    <strong>{selectedTechniques.length}/5</strong>
                    <small>ATT&amp;CK techniques selected</small>
                </div>

                <div className="panel red-agent-stat-card">
                    <div>
                        <Eye size={18} />
                        <span>BLUE TEAM VISIBILITY</span>
                    </div>
                    <strong>78%</strong>
                    <small>Estimated detection coverage</small>
                </div>

                <div className="panel red-agent-stat-card">
                    <div>
                        <ShieldAlert size={18} />
                        <span>SIMULATION RISK</span>
                    </div>
                    <strong className="red-text">{scenario.risk}</strong>
                    <small>Based on selected scenario</small>
                </div>
            </section>
        </main>
    );
}

export default RedAgent;