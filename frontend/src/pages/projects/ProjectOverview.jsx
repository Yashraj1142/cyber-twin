import {
    Activity,
    ArrowLeft,
    ArrowUpRight,
    Box,
    BrainCircuit,
    Calendar,
    ChevronRight,
    CircleDot,
    FileText,
    Play,
    ShieldAlert,
    ShieldCheck,
    Skull,
    Target,
    Users,
    Waypoints,
    Zap,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

import AgentBadge from "../../components/common/AgentBadge";
import ProgressBar from "../../components/ui/ProgressBar";
import RiskBadge from "../../components/ui/RiskBadge";

function ProjectOverview() {
    const { projectId } = useParams();

    return (
        <div className="page-wrapper animate-fade">

            {/* HEADER */}

            <div className="project-detail-header">

                <div>

                    <Link
                        to="/projects"
                        className="back-page-link"
                    >
                        <ArrowLeft size={13} />
                        ALL PROJECTS
                    </Link>

                    <div className="project-detail-title">

                        <div className="project-detail-icon">
                            <Box size={22} />
                        </div>

                        <div>
                            <div className="page-eyebrow">
                                PROJECT / {projectId?.toUpperCase()}
                            </div>

                            <h1>
                                E-Commerce Platform
                            </h1>

                            <div className="project-detail-meta">

                                <span>
                                    <CircleDot size={10} />
                                    PROD-TWIN-001
                                </span>

                                <span>
                                    <span className="status-dot online" />
                                    Digital Twin Online
                                </span>

                                <span>
                                    <Users size={11} />
                                    8 members
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

                <div className="heading-actions">

                    <button className="secondary-button">
                        <FileText size={14} />
                        View Report
                    </button>

                    <button className="primary-button">
                        <Play size={14} />
                        New Simulation
                    </button>

                </div>

            </div>

            {/* PROJECT STATUS */}

            <div className="project-status-banner">

                <div className="project-status-main">

                    <div className="status-large-icon">
                        <ShieldCheck size={22} />
                    </div>

                    <div>

                        <span>
                            SECURITY POSTURE
                        </span>

                        <strong>
                            Strong
                        </strong>

                    </div>

                </div>

                <div className="status-score">

                    <strong>91</strong>
                    <span>/100</span>

                </div>

                <div className="status-score-bar">

                    <ProgressBar
                        value={91}
                        type="cyan"
                    />

                    <div>
                        <span>Previous score: 84</span>
                        <b className="green">+7 points</b>
                    </div>

                </div>

            </div>

            {/* KPI */}

            <div className="project-kpi-grid">

                <div className="project-kpi">

                    <div className="project-kpi-icon red">
                        <Skull size={17} />
                    </div>

                    <div>
                        <span>ATTACK PATHS</span>
                        <strong>07</strong>
                        <small>2 exploitable</small>
                    </div>

                </div>

                <div className="project-kpi">

                    <div className="project-kpi-icon blue">
                        <ShieldCheck size={17} />
                    </div>

                    <div>
                        <span>DETECTION COVERAGE</span>
                        <strong>89%</strong>
                        <small>+12% this week</small>
                    </div>

                </div>

                <div className="project-kpi">

                    <div className="project-kpi-icon purple">
                        <BrainCircuit size={17} />
                    </div>

                    <div>
                        <span>DETECTION GAPS</span>
                        <strong>03</strong>
                        <small>1 critical</small>
                    </div>

                </div>

                <div className="project-kpi">

                    <div className="project-kpi-icon green">
                        <ShieldAlert size={17} />
                    </div>

                    <div>
                        <span>OPEN INCIDENTS</span>
                        <strong>03</strong>
                        <small>1 requires attention</small>
                    </div>

                </div>

            </div>

            {/* MAIN */}

            <div className="project-detail-grid">

                {/* DIGITAL TWIN */}

                <section className="panel">

                    <div className="section-header">

                        <div>
                            <div className="section-eyebrow">
                                DIGITAL TWIN
                            </div>

                            <h2>
                                Environment Overview
                            </h2>

                            <p>
                                Current state of the isolated
                                application environment.
                            </p>
                        </div>

                        <Link
                            to="/digital-twin/main"
                            className="icon-text-button"
                        >
                            Open Twin
                            <ArrowUpRight size={13} />
                        </Link>

                    </div>

                    <div className="environment-map">

                        <div className="environment-node internet">

                            <div>
                                <Activity size={16} />
                            </div>

                            <span>INTERNET</span>

                        </div>

                        <div className="environment-line" />

                        <div className="environment-node">

                            <div>
                                <Box size={16} />
                            </div>

                            <span>WEB SERVER</span>

                        </div>

                        <div className="environment-line" />

                        <div className="environment-node">

                            <div>
                                <Waypoints size={16} />
                            </div>

                            <span>API GATEWAY</span>

                        </div>

                        <div className="environment-line" />

                        <div className="environment-node database">

                            <div>
                                <Target size={16} />
                            </div>

                            <span>DATABASE</span>

                        </div>

                    </div>

                    <div className="environment-details">

                        <div>
                            <span>HOSTS</span>
                            <strong>14</strong>
                        </div>

                        <div>
                            <span>CONTAINERS</span>
                            <strong>27</strong>
                        </div>

                        <div>
                            <span>ENDPOINTS</span>
                            <strong>43</strong>
                        </div>

                        <div>
                            <span>NETWORKS</span>
                            <strong>06</strong>
                        </div>

                    </div>

                </section>

                {/* AGENT STATUS */}

                <section className="panel">

                    <div className="section-header">

                        <div>
                            <div className="section-eyebrow">
                                AUTONOMOUS AGENTS
                            </div>

                            <h2>
                                Agent Status
                            </h2>
                        </div>

                    </div>

                    <div className="agent-status-list">

                        <div className="agent-status-row">

                            <AgentBadge type="red" />

                            <div>
                                <strong>
                                    Red Agent
                                </strong>

                                <span>
                                    Attack simulation ready
                                </span>
                            </div>

                            <span className="agent-online">
                                READY
                            </span>

                        </div>

                        <div className="agent-status-row">

                            <AgentBadge type="blue" />

                            <div>
                                <strong>
                                    Blue Agent
                                </strong>

                                <span>
                                    Monitoring telemetry
                                </span>
                            </div>

                            <span className="agent-online">
                                ACTIVE
                            </span>

                        </div>

                        <div className="agent-status-row">

                            <AgentBadge type="purple" />

                            <div>
                                <strong>
                                    Purple Agent
                                </strong>

                                <span>
                                    Analysis engine ready
                                </span>
                            </div>

                            <span className="agent-online">
                                READY
                            </span>

                        </div>

                    </div>

                    <div className="agent-cycle">

                        <div className="agent-cycle-title">
                            CONTINUOUS SECURITY LOOP
                        </div>

                        <div className="agent-cycle-flow">
                            ATTACK
                            <ChevronRight size={12} />
                            DETECT
                            <ChevronRight size={12} />
                            ANALYZE
                            <ChevronRight size={12} />
                            IMPROVE
                        </div>

                    </div>

                </section>

            </div>

            {/* FINDINGS + SIMULATIONS */}

            <div className="project-detail-grid">

                <section className="panel">

                    <div className="section-header">

                        <div>
                            <div className="section-eyebrow">
                                SECURITY FINDINGS
                            </div>

                            <h2>
                                Priority Findings
                            </h2>
                        </div>

                        <Link
                            to="/vulnerabilities"
                            className="icon-text-button"
                        >
                            View all
                            <ArrowUpRight size={13} />
                        </Link>

                    </div>

                    <div className="priority-findings">

                        <div className="priority-finding">

                            <div className="priority-number critical">
                                01
                            </div>

                            <div className="priority-content">

                                <strong>
                                    Privilege Escalation
                                </strong>

                                <span>
                                    Detection gap identified during
                                    Simulation #SIM-024
                                </span>

                            </div>

                            <RiskBadge level="Critical" />

                        </div>

                        <div className="priority-finding">

                            <div className="priority-number high">
                                02
                            </div>

                            <div className="priority-content">

                                <strong>
                                    Sensitive Data Exposure
                                </strong>

                                <span>
                                    Weak telemetry around database access
                                </span>

                            </div>

                            <RiskBadge level="High" />

                        </div>

                        <div className="priority-finding">

                            <div className="priority-number medium">
                                03
                            </div>

                            <div className="priority-content">

                                <strong>
                                    Authentication Anomaly
                                </strong>

                                <span>
                                    Repeated failed authentication attempts
                                </span>

                            </div>

                            <RiskBadge level="Medium" />

                        </div>

                    </div>

                </section>

                <section className="panel">

                    <div className="section-header">

                        <div>
                            <div className="section-eyebrow">
                                SIMULATION HISTORY
                            </div>

                            <h2>
                                Recent Runs
                            </h2>
                        </div>

                        <Link
                            to="/simulations"
                            className="icon-text-button"
                        >
                            All simulations
                            <ArrowUpRight size={13} />
                        </Link>

                    </div>

                    <div className="simulation-history">

                        <div className="simulation-row">

                            <div className="simulation-icon">
                                <Zap size={14} />
                            </div>

                            <div>
                                <strong>
                                    SIM-024
                                </strong>

                                <span>
                                    Completed 12 minutes ago
                                </span>
                            </div>

                            <b className="green">
                                91
                            </b>

                        </div>

                        <div className="simulation-row">

                            <div className="simulation-icon">
                                <Zap size={14} />
                            </div>

                            <div>
                                <strong>
                                    SIM-023
                                </strong>

                                <span>
                                    Completed yesterday
                                </span>
                            </div>

                            <b>
                                84
                            </b>

                        </div>

                        <div className="simulation-row">

                            <div className="simulation-icon">
                                <Zap size={14} />
                            </div>

                            <div>
                                <strong>
                                    SIM-022
                                </strong>

                                <span>
                                    Completed 2 days ago
                                </span>
                            </div>

                            <b>
                                81
                            </b>

                        </div>

                    </div>

                </section>

            </div>

        </div>
    );
}

export default ProjectOverview;