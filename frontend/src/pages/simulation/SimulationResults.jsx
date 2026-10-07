import {
    AlertTriangle,
    ArrowDownRight,
    ArrowLeft,
    ArrowUpRight,
    CheckCircle2,
    ChevronRight,
    CircleAlert,
    Download,
    ExternalLink,
    FileText,
    Lock,
    Network,
    Shield,
    ShieldAlert,
    Skull,
    Target,
    TrendingDown,
    TrendingUp,
    XCircle,
    Zap,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

function SimulationResults() {
    const { simulationId } = useParams();

    const techniques = [
        {
            id: "T1190",
            name: "Exploit Public-Facing Application",
            tactic: "Initial Access",
            result: "detected",
            severity: "High",
        },
        {
            id: "T1059",
            name: "Command and Scripting Interpreter",
            tactic: "Execution",
            result: "detected",
            severity: "Medium",
        },
        {
            id: "T1087",
            name: "Account Discovery",
            tactic: "Discovery",
            result: "detected",
            severity: "Low",
        },
        {
            id: "T1068",
            name: "Exploitation for Privilege Escalation",
            tactic: "Privilege Escalation",
            result: "missed",
            severity: "Critical",
        },
        {
            id: "T1021",
            name: "Remote Services",
            tactic: "Lateral Movement",
            result: "missed",
            severity: "High",
        },
        {
            id: "T1005",
            name: "Data from Local System",
            tactic: "Collection",
            result: "detected",
            severity: "High",
        },
    ];

    const findings = [
        {
            id: "F-001",
            severity: "Critical",
            title: "Privilege boundary bypass detected",
            asset: "api-gateway-01",
            description:
                "The simulation successfully crossed the configured privilege boundary without generating a corresponding high-confidence detection.",
        },
        {
            id: "F-002",
            severity: "High",
            title: "Insufficient lateral movement detection",
            asset: "auth-service-02",
            description:
                "Remote service activity was observed but did not trigger the expected detection rule.",
        },
        {
            id: "F-003",
            severity: "Medium",
            title: "Excessive account discovery visibility",
            asset: "api-gateway-01",
            description:
                "Account enumeration generated telemetry but lacks an associated response workflow.",
        },
    ];

    return (
        <div className="page-wrapper simulation-results-page animate-fade">

            {/* =====================================================
          TOP NAVIGATION
      ====================================================== */}

            <div className="results-topbar">

                <div className="results-breadcrumb">

                    <Link to={`/simulations/${simulationId || "SIM-024"}`}>
                        <ArrowLeft size={14} />
                        Simulation
                    </Link>

                    <ChevronRight size={11} />

                    <span>
                        Results
                    </span>

                </div>

                <div className="results-actions">

                    <button className="secondary-button">
                        <Download size={13} />
                        Export PDF
                    </button>

                    <button className="primary-button">
                        <FileText size={13} />
                        Generate Report
                    </button>

                </div>

            </div>

            {/* =====================================================
          HEADER
      ====================================================== */}

            <section className="results-header">

                <div>

                    <div className="page-eyebrow">
                        SECURITY ASSESSMENT / FINAL RESULTS
                    </div>

                    <h1>
                        Simulation Security Assessment
                    </h1>

                    <p>
                        Privilege Escalation Assessment ·{" "}
                        {simulationId || "SIM-024"} ·
                        E-Commerce Platform
                    </p>

                </div>

                <div className="results-completion">

                    <CheckCircle2 size={15} />

                    Simulation completed

                    <span>
                        09:35:41
                    </span>

                </div>

            </section>

            {/* =====================================================
          SCORE HERO
      ====================================================== */}

            <section className="results-score-hero">

                <div className="score-visual">

                    <div className="large-score-ring">

                        <div>

                            <strong>
                                67
                            </strong>

                            <span>
                                / 100
                            </span>

                        </div>

                    </div>

                    <div className="score-rating">

                        <span>
                            SECURITY POSTURE
                        </span>

                        <strong>
                            NEEDS IMPROVEMENT
                        </strong>

                        <small>
                            11 points below target
                        </small>

                    </div>

                </div>

                <div className="score-summary">

                    <div>
                        <span>ATTACK SUCCESS</span>
                        <strong className="red-text">
                            4 / 6
                        </strong>
                    </div>

                    <div>
                        <span>DETECTION RATE</span>
                        <strong className="yellow-text">
                            67%
                        </strong>
                    </div>

                    <div>
                        <span>CRITICAL FINDINGS</span>
                        <strong className="red-text">
                            01
                        </strong>
                    </div>

                    <div>
                        <span>ASSETS IMPACTED</span>
                        <strong>
                            02
                        </strong>
                    </div>

                </div>

            </section>

            {/* =====================================================
          RISK OVERVIEW
      ====================================================== */}

            <div className="results-grid-three">

                <section className="panel">

                    <div className="section-header">

                        <div>

                            <div className="section-eyebrow">
                                RISK ANALYSIS
                            </div>

                            <h2>
                                Risk Distribution
                            </h2>

                        </div>

                        <ShieldAlert
                            size={15}
                            className="risk-header-icon"
                        />

                    </div>

                    <div className="risk-donut-wrap">

                        <div className="risk-donut">

                            <div>
                                <strong>
                                    07
                                </strong>

                                <span>
                                    findings
                                </span>
                            </div>

                        </div>

                        <div className="risk-legend">

                            <div>
                                <i className="critical-dot" />
                                <span>Critical</span>
                                <b>01</b>
                            </div>

                            <div>
                                <i className="high-dot" />
                                <span>High</span>
                                <b>02</b>
                            </div>

                            <div>
                                <i className="medium-dot" />
                                <span>Medium</span>
                                <b>03</b>
                            </div>

                            <div>
                                <i className="low-dot" />
                                <span>Low</span>
                                <b>01</b>
                            </div>

                        </div>

                    </div>

                </section>

                {/* BLUE AGENT */}

                <section className="panel">

                    <div className="section-header">

                        <div>

                            <div className="section-eyebrow">
                                BLUE AGENT
                            </div>

                            <h2>
                                Detection Performance
                            </h2>

                        </div>

                        <Target
                            size={15}
                            className="blue-agent-icon"
                        />

                    </div>

                    <div className="blue-score">

                        <strong>
                            67%
                        </strong>

                        <span>
                            Detection Coverage
                        </span>

                    </div>

                    <div className="blue-progress">

                        <span />

                    </div>

                    <div className="blue-stats">

                        <div>
                            <strong>
                                04
                            </strong>
                            <span>
                                Detected
                            </span>
                        </div>

                        <div>
                            <strong>
                                02
                            </strong>
                            <span>
                                Missed
                            </span>
                        </div>

                        <div>
                            <strong>
                                01
                            </strong>
                            <span>
                                Critical gap
                            </span>
                        </div>

                    </div>

                    <div className="blue-assessment">

                        <AlertTriangle size={13} />

                        <span>
                            Privilege escalation was not detected
                            at the expected confidence threshold.
                        </span>

                    </div>

                </section>

                {/* TREND */}

                <section className="panel">

                    <div className="section-header">

                        <div>

                            <div className="section-eyebrow">
                                COMPARISON
                            </div>

                            <h2>
                                Security Trend
                            </h2>

                        </div>

                        <TrendingUp
                            size={15}
                            className="trend-icon"
                        />

                    </div>

                    <div className="trend-score">

                        <strong>
                            +11
                        </strong>

                        <span>
                            points vs previous simulation
                        </span>

                        <div className="trend-positive">
                            <ArrowUpRight size={12} />
                            Improving
                        </div>

                    </div>

                    <div className="trend-bars">

                        <div>
                            <span>SIM-021</span>
                            <i style={{ width: "52%" }} />
                            <b>52</b>
                        </div>

                        <div>
                            <span>SIM-022</span>
                            <i style={{ width: "59%" }} />
                            <b>59</b>
                        </div>

                        <div>
                            <span>SIM-023</span>
                            <i style={{ width: "63%" }} />
                            <b>63</b>
                        </div>

                        <div className="current">
                            <span>SIM-024</span>
                            <i style={{ width: "67%" }} />
                            <b>67</b>
                        </div>

                    </div>

                </section>

            </div>

            {/* =====================================================
          ATTACK PATH
      ====================================================== */}

            <section className="panel results-attack-panel">

                <div className="section-header">

                    <div>

                        <div className="section-eyebrow">
                            ATTACK ANALYSIS
                        </div>

                        <h2>
                            Attack Path Results
                        </h2>

                    </div>

                    <span className="attack-result-label">
                        4 SUCCESSFUL · 2 BLOCKED
                    </span>

                </div>

                <div className="results-attack-path">

                    {[
                        ["01", "Initial Access", "T1190", "blocked"],
                        ["02", "Execution", "T1059", "blocked"],
                        ["03", "Discovery", "T1087", "blocked"],
                        ["04", "Privilege Escalation", "T1068", "successful"],
                        ["05", "Lateral Movement", "T1021", "successful"],
                        ["06", "Collection", "T1005", "blocked"],
                    ].map(([number, name, technique, status]) => (

                        <div
                            key={number}
                            className={`result-attack-node ${status}`}
                        >

                            <div className="result-node-number">
                                {status === "blocked" ? (
                                    <CheckCircle2 size={12} />
                                ) : (
                                    <Skull size={12} />
                                )}
                            </div>

                            <div>

                                <strong>
                                    {name}
                                </strong>

                                <span>
                                    MITRE {technique}
                                </span>

                            </div>

                            <b>
                                {status === "blocked"
                                    ? "BLOCKED"
                                    : "SUCCESSFUL"}
                            </b>

                        </div>

                    ))}

                </div>

            </section>

            {/* =====================================================
          MITRE MATRIX
      ====================================================== */}

            <section className="panel mitre-results-panel">

                <div className="section-header">

                    <div>

                        <div className="section-eyebrow">
                            ATT&CK MAPPING
                        </div>

                        <h2>
                            MITRE ATT&CK Coverage
                        </h2>

                    </div>

                    <button className="icon-text-button">
                        Open ATT&CK Matrix
                        <ExternalLink size={12} />
                    </button>

                </div>

                <div className="mitre-results-table">

                    <div className="mitre-results-head">
                        <span>TECHNIQUE</span>
                        <span>TACTIC</span>
                        <span>SEVERITY</span>
                        <span>RESULT</span>
                        <span />
                    </div>

                    {techniques.map((technique) => (

                        <div
                            className="mitre-results-row"
                            key={technique.id}
                        >

                            <div className="mitre-technique-name">

                                <div>
                                    <Network size={12} />
                                </div>

                                <span>

                                    <strong>
                                        {technique.name}
                                    </strong>

                                    <small>
                                        {technique.id}
                                    </small>

                                </span>

                            </div>

                            <span className="mitre-tactic">
                                {technique.tactic}
                            </span>

                            <span
                                className={`severity-pill ${technique.severity.toLowerCase()}`}
                            >
                                {technique.severity}
                            </span>

                            <span
                                className={`technique-result ${technique.result}`}
                            >

                                {technique.result === "detected" ? (
                                    <>
                                        <CheckCircle2 size={11} />
                                        Detected
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={11} />
                                        Missed
                                    </>
                                )}

                            </span>

                            <ChevronRight
                                size={13}
                                className="technique-arrow"
                            />

                        </div>

                    ))}

                </div>

            </section>

            {/* =====================================================
          FINDINGS
      ====================================================== */}

            <section className="panel findings-results-panel">

                <div className="section-header">

                    <div>

                        <div className="section-eyebrow">
                            SECURITY FINDINGS
                        </div>

                        <h2>
                            Vulnerabilities & Gaps
                        </h2>

                    </div>

                    <span className="findings-count">
                        03 priority findings
                    </span>

                </div>

                <div className="finding-results-list">

                    {findings.map((finding) => (

                        <div
                            className="result-finding"
                            key={finding.id}
                        >

                            <div
                                className={`finding-severity-bar ${finding.severity.toLowerCase()}`}
                            />

                            <div className="finding-result-icon">

                                {finding.severity === "Critical" ? (
                                    <CircleAlert size={16} />
                                ) : (
                                    <AlertTriangle size={16} />
                                )}

                            </div>

                            <div className="finding-result-content">

                                <div className="finding-result-title">

                                    <strong>
                                        {finding.title}
                                    </strong>

                                    <span
                                        className={`severity-pill ${finding.severity.toLowerCase()}`}
                                    >
                                        {finding.severity}
                                    </span>

                                </div>

                                <p>
                                    {finding.description}
                                </p>

                                <div className="finding-result-meta">

                                    <span>
                                        ID: {finding.id}
                                    </span>

                                    <span>
                                        Asset: {finding.asset}
                                    </span>

                                </div>

                            </div>

                            <button className="finding-view-button">
                                View
                                <ChevronRight size={12} />
                            </button>

                        </div>

                    ))}

                </div>

            </section>

            {/* =====================================================
          REMEDIATION
      ====================================================== */}

            <section className="results-remediation">

                <div>

                    <div className="section-eyebrow">
                        PURPLE TEAM ANALYSIS
                    </div>

                    <h2>
                        Recommended Remediation
                    </h2>

                    <p>
                        Address the following controls to improve detection
                        coverage and reduce the attack surface identified
                        during this simulation.
                    </p>

                </div>

                <div className="remediation-list">

                    <div>

                        <span>
                            01
                        </span>

                        <div>

                            <strong>
                                Harden privilege boundaries
                            </strong>

                            <small>
                                Priority: Critical · Estimated effort: Medium
                            </small>

                        </div>

                        <ArrowUpRight size={13} />

                    </div>

                    <div>

                        <span>
                            02
                        </span>

                        <div>

                            <strong>
                                Add privilege escalation detection rules
                            </strong>

                            <small>
                                Priority: High · Estimated effort: Low
                            </small>

                        </div>

                        <ArrowUpRight size={13} />

                    </div>

                    <div>

                        <span>
                            03
                        </span>

                        <div>

                            <strong>
                                Strengthen remote-service monitoring
                            </strong>

                            <small>
                                Priority: High · Estimated effort: Medium
                            </small>

                        </div>

                        <ArrowUpRight size={13} />

                    </div>

                </div>

            </section>

            {/* =====================================================
          FOOTER SUMMARY
      ====================================================== */}

            <div className="results-footer-summary">

                <div>

                    <Shield size={16} />

                    <span>
                        Assessment completed by Cyber-Twin Engine
                    </span>

                </div>

                <span>
                    Generated 07 Oct 2026 · 09:35 IST
                </span>

            </div>

        </div>
    );
}

export default SimulationResults;