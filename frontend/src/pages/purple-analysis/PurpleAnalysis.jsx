import { useMemo, useState } from "react";
import {
    Activity,
    AlertTriangle,
    ArrowDown,
    ArrowUp,
    CheckCircle2,
    ChevronRight,
    Crosshair,
    Eye,
    GitCompare,
    Network,
    Shield,
    ShieldAlert,
    Target,
    TrendingDown,
    TrendingUp,
    Zap,
} from "lucide-react";

const techniqueMatrix = [
    {
        id: "T1190",
        name: "Exploit Public-Facing Application",
        tactic: "Initial Access",
        red: 92,
        blue: 84,
        gap: 8,
        status: "Covered",
    },
    {
        id: "T1078",
        name: "Valid Accounts",
        tactic: "Initial Access",
        red: 76,
        blue: 61,
        gap: 15,
        status: "Partial",
    },
    {
        id: "T1068",
        name: "Privilege Escalation",
        tactic: "Privilege Escalation",
        red: 88,
        blue: 78,
        gap: 10,
        status: "Covered",
    },
    {
        id: "T1021",
        name: "Remote Services",
        tactic: "Lateral Movement",
        red: 95,
        blue: 91,
        gap: 4,
        status: "Strong",
    },
    {
        id: "T1005",
        name: "Data from Local System",
        tactic: "Collection",
        red: 71,
        blue: 48,
        gap: 23,
        status: "Gap",
    },
];

const findings = [
    {
        id: "GAP-01",
        severity: "Critical",
        title: "Collection activity has weak detection coverage",
        technique: "T1005",
        impact: "High",
        recommendation:
            "Improve telemetry coverage for sensitive file access and correlate collection behavior with asset context.",
    },
    {
        id: "GAP-02",
        severity: "High",
        title: "Credential-related activity is only partially detected",
        technique: "T1078",
        impact: "Medium",
        recommendation:
            "Tune identity detections and strengthen authentication-event correlation.",
    },
    {
        id: "GAP-03",
        severity: "Medium",
        title: "Privilege escalation detection needs additional context",
        technique: "T1068",
        impact: "Medium",
        recommendation:
            "Add endpoint context and process lineage to improve analyst confidence.",
    },
];

const remediation = [
    {
        priority: "P1",
        title: "Strengthen collection detection",
        owner: "Blue Team",
        effort: "Medium",
        improvement: "+12",
    },
    {
        priority: "P2",
        title: "Tune identity correlation rules",
        owner: "SOC Engineering",
        effort: "Low",
        improvement: "+8",
    },
    {
        priority: "P3",
        title: "Expand endpoint telemetry",
        owner: "Platform",
        effort: "Medium",
        improvement: "+6",
    },
];

function PurpleAnalysis() {
    const [selectedTechnique, setSelectedTechnique] = useState(
        techniqueMatrix[4]
    );

    const [view, setView] = useState("matrix");

    const averageCoverage = useMemo(() => {
        const total = techniqueMatrix.reduce(
            (sum, item) => sum + item.blue,
            0
        );

        return Math.round(total / techniqueMatrix.length);
    }, []);

    const detectionGaps = techniqueMatrix.filter((item) => item.gap >= 15);

    return (
        <main className="page-wrapper purple-page">
            <div className="purple-topbar">
                <div className="purple-breadcrumb">
                    <span>CYBER-TWIN</span>
                    <ChevronRight size={13} />
                    <span>PURPLE ANALYSIS</span>
                    <ChevronRight size={13} />
                    <strong>ATTACK / DETECTION CORRELATION</strong>
                </div>

                <div className="purple-live">
                    <span />
                    ANALYSIS ENGINE READY
                </div>
            </div>

            <section className="purple-header animate-fade">
                <div>
                    <div className="page-eyebrow purple-text">
                        <GitCompare size={14} />
                        PURPLE TEAM OPERATIONS
                    </div>

                    <h1>Purple Analysis</h1>

                    <p>
                        Correlate adversarial simulation results with defensive telemetry
                        to identify detection gaps and prioritize security improvements.
                    </p>
                </div>

                <div className="purple-header-score">
                    <span>DEFENSIVE READINESS</span>
                    <strong>{averageCoverage}%</strong>
                    <small>Current detection coverage</small>
                </div>
            </section>

            <section className="purple-summary-grid">
                <div className="panel purple-summary-card">
                    <div className="purple-card-icon red">
                        <Crosshair size={17} />
                    </div>
                    <span>RED TECHNIQUE EXECUTION</span>
                    <strong>84%</strong>
                    <small>Attack path completion</small>
                </div>

                <div className="panel purple-summary-card">
                    <div className="purple-card-icon green">
                        <Shield size={17} />
                    </div>
                    <span>BLUE DETECTION COVERAGE</span>
                    <strong>{averageCoverage}%</strong>
                    <small>Average across techniques</small>
                </div>

                <div className="panel purple-summary-card">
                    <div className="purple-card-icon yellow">
                        <AlertTriangle size={17} />
                    </div>
                    <span>DETECTION GAPS</span>
                    <strong>{detectionGaps.length}</strong>
                    <small>Require remediation</small>
                </div>

                <div className="panel purple-summary-card">
                    <div className="purple-card-icon cyan">
                        <TrendingUp size={17} />
                    </div>
                    <span>IMPROVEMENT POTENTIAL</span>
                    <strong>+26</strong>
                    <small>Projected security score</small>
                </div>
            </section>

            <section className="panel purple-correlation">
                <div className="section-header">
                    <div>
                        <span className="section-eyebrow">
                            01 / RED VS BLUE CORRELATION
                        </span>
                        <h2>Technique Coverage Matrix</h2>
                    </div>

                    <div className="purple-view-switch">
                        <button
                            className={view === "matrix" ? "active" : ""}
                            onClick={() => setView("matrix")}
                        >
                            Matrix
                        </button>
                        <button
                            className={view === "gaps" ? "active" : ""}
                            onClick={() => setView("gaps")}
                        >
                            Gaps
                        </button>
                    </div>
                </div>

                {view === "matrix" ? (
                    <div className="purple-matrix-layout">
                        <div className="purple-matrix-table">
                            <div className="purple-table-head">
                                <span>TECHNIQUE</span>
                                <span>TACTIC</span>
                                <span>RED</span>
                                <span>BLUE</span>
                                <span>GAP</span>
                                <span>STATUS</span>
                            </div>

                            {techniqueMatrix.map((item) => (
                                <button
                                    key={item.id}
                                    className={`purple-table-row ${selectedTechnique.id === item.id ? "selected" : ""
                                        }`}
                                    onClick={() => setSelectedTechnique(item)}
                                >
                                    <div>
                                        <code>{item.id}</code>
                                        <strong>{item.name}</strong>
                                    </div>

                                    <span>{item.tactic}</span>

                                    <div className="purple-score red-score">
                                        {item.red}%
                                    </div>

                                    <div className="purple-score blue-score">
                                        {item.blue}%
                                    </div>

                                    <div
                                        className={`purple-gap ${item.gap >= 15 ? "danger" : ""
                                            }`}
                                    >
                                        {item.gap}%
                                    </div>

                                    <span
                                        className={`purple-status status-${item.status
                                            .toLowerCase()
                                            .replace(" ", "-")}`}
                                    >
                                        {item.status}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="purple-technique-detail">
                            <div className="purple-detail-heading">
                                <div>
                                    <code>{selectedTechnique.id}</code>
                                    <h3>{selectedTechnique.name}</h3>
                                </div>

                                <Target size={18} />
                            </div>

                            <span className="purple-detail-tactic">
                                {selectedTechnique.tactic}
                            </span>

                            <div className="purple-comparison">
                                <div>
                                    <div className="purple-comparison-label">
                                        <span>RED EXECUTION</span>
                                        <strong>{selectedTechnique.red}%</strong>
                                    </div>

                                    <div className="purple-bar red">
                                        <div
                                            style={{
                                                width: `${selectedTechnique.red}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="purple-comparison-label">
                                        <span>BLUE DETECTION</span>
                                        <strong>{selectedTechnique.blue}%</strong>
                                    </div>

                                    <div className="purple-bar blue">
                                        <div
                                            style={{
                                                width: `${selectedTechnique.blue}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="purple-gap-callout">
                                {selectedTechnique.gap >= 15 ? (
                                    <AlertTriangle size={17} />
                                ) : (
                                    <CheckCircle2 size={17} />
                                )}

                                <div>
                                    <span>DETECTION GAP</span>
                                    <strong>{selectedTechnique.gap}%</strong>
                                    <small>
                                        {selectedTechnique.gap >= 15
                                            ? "This technique requires defensive improvement."
                                            : "Detection performance is within an acceptable range."}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="purple-gap-grid">
                        {detectionGaps.map((gap) => (
                            <div className="purple-gap-card" key={gap.id}>
                                <div className="purple-gap-card-top">
                                    <span>{gap.id}</span>
                                    <span className="purple-gap-danger">
                                        {gap.gap}% GAP
                                    </span>
                                </div>

                                <code>{gap.id === "GAP-01" ? "T1005" : gap.id === "GAP-02" ? "T1078" : "T1068"}</code>

                                <h3>{gap.title}</h3>

                                <p>
                                    Blue detection coverage is significantly below the
                                    adversarial execution score for this technique.
                                </p>

                                <div className="purple-gap-footer">
                                    <span>PRIORITY</span>
                                    <strong>{gap.severity}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="purple-lower-grid">
                <div className="panel purple-attack-path">
                    <div className="section-header">
                        <div>
                            <span className="section-eyebrow">02 / ATTACK PATH</span>
                            <h2>Simulation Correlation</h2>
                        </div>

                        <Network size={17} />
                    </div>

                    <div className="purple-path">
                        <div className="purple-path-node complete">
                            <div className="purple-node-icon">
                                <Crosshair size={14} />
                            </div>
                            <div>
                                <span>INITIAL ACCESS</span>
                                <strong>T1190</strong>
                            </div>
                            <CheckCircle2 size={14} />
                        </div>

                        <div className="purple-path-line" />

                        <div className="purple-path-node complete">
                            <div className="purple-node-icon">
                                <Zap size={14} />
                            </div>
                            <div>
                                <span>PRIVILEGE ESCALATION</span>
                                <strong>T1068</strong>
                            </div>
                            <CheckCircle2 size={14} />
                        </div>

                        <div className="purple-path-line" />

                        <div className="purple-path-node warning">
                            <div className="purple-node-icon">
                                <Network size={14} />
                            </div>
                            <div>
                                <span>LATERAL MOVEMENT</span>
                                <strong>T1021</strong>
                            </div>
                            <AlertTriangle size={14} />
                        </div>

                        <div className="purple-path-line" />

                        <div className="purple-path-node danger">
                            <div className="purple-node-icon">
                                <Eye size={14} />
                            </div>
                            <div>
                                <span>COLLECTION</span>
                                <strong>T1005</strong>
                            </div>
                            <AlertTriangle size={14} />
                        </div>
                    </div>
                </div>

                <div className="panel purple-risk-panel">
                    <div className="section-header">
                        <div>
                            <span className="section-eyebrow">03 / RISK ANALYSIS</span>
                            <h2>Security Impact</h2>
                        </div>

                        <ShieldAlert size={17} />
                    </div>

                    <div className="purple-risk-score">
                        <div className="purple-risk-ring">
                            <strong>67</strong>
                            <span>/ 100</span>
                        </div>

                        <div>
                            <span>OVERALL SECURITY SCORE</span>
                            <strong>Needs Improvement</strong>
                            <small>
                                Detection gaps remain concentrated around collection and
                                identity activity.
                            </small>
                        </div>
                    </div>

                    <div className="purple-risk-items">
                        <div>
                            <span>INITIAL ACCESS</span>
                            <strong className="green-text">LOW</strong>
                        </div>

                        <div>
                            <span>PRIVILEGE ESCALATION</span>
                            <strong className="yellow-text">MEDIUM</strong>
                        </div>

                        <div>
                            <span>LATERAL MOVEMENT</span>
                            <strong className="green-text">LOW</strong>
                        </div>

                        <div>
                            <span>COLLECTION</span>
                            <strong className="red-text">HIGH</strong>
                        </div>
                    </div>
                </div>
            </section>

            <section className="panel purple-findings">
                <div className="section-header">
                    <div>
                        <span className="section-eyebrow">04 / DETECTION GAPS</span>
                        <h2>Priority Findings</h2>
                    </div>

                    <AlertTriangle size={17} />
                </div>

                <div className="purple-findings-list">
                    {findings.map((finding) => (
                        <div className="purple-finding" key={finding.id}>
                            <div className={`purple-finding-severity ${finding.severity.toLowerCase()}`}>
                                {finding.severity}
                            </div>

                            <div className="purple-finding-main">
                                <div>
                                    <code>{finding.id}</code>
                                    <h3>{finding.title}</h3>
                                </div>

                                <div className="purple-finding-meta">
                                    <span>
                                        TECHNIQUE <strong>{finding.technique}</strong>
                                    </span>
                                    <span>
                                        IMPACT <strong>{finding.impact}</strong>
                                    </span>
                                </div>

                                <p>{finding.recommendation}</p>
                            </div>

                            <ChevronRight size={16} />
                        </div>
                    ))}
                </div>
            </section>

            <section className="panel purple-remediation">
                <div className="section-header">
                    <div>
                        <span className="section-eyebrow">05 / REMEDIATION</span>
                        <h2>Improvement Roadmap</h2>
                    </div>

                    <TrendingUp size={17} />
                </div>

                <div className="purple-remediation-list">
                    {remediation.map((item) => (
                        <div className="purple-remediation-row" key={item.priority}>
                            <div className="purple-priority">{item.priority}</div>

                            <div className="purple-remediation-main">
                                <strong>{item.title}</strong>
                                <span>
                                    Owner: {item.owner} · Effort: {item.effort}
                                </span>
                            </div>

                            <div className="purple-improvement">
                                <TrendingUp size={13} />
                                {item.improvement}
                            </div>

                            <button className="icon-text-button">
                                Review
                                <ChevronRight size={13} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="purple-footer-metrics">
                <div>
                    <ArrowUp size={15} />
                    <span>RED EXECUTION</span>
                    <strong>84%</strong>
                </div>

                <div>
                    <ArrowDown size={15} />
                    <span>BLUE COVERAGE</span>
                    <strong>{averageCoverage}%</strong>
                </div>

                <div>
                    <TrendingDown size={15} />
                    <span>OPEN GAPS</span>
                    <strong>{detectionGaps.length}</strong>
                </div>

                <div>
                    <CheckCircle2 size={15} />
                    <span>REMEDIATION POTENTIAL</span>
                    <strong>+26</strong>
                </div>
            </section>
        </main>
    );
}

export default PurpleAnalysis;