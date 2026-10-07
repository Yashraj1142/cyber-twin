import { useMemo, useState } from "react";
import {
    AlertTriangle,
    ArrowDown,
    ArrowUp,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Filter,
    Lock,
    Network,
    Search,
    Server,
    ShieldAlert,
    Target,
    TrendingDown,
    TrendingUp,
    X,
    Zap,
} from "lucide-react";

const vulnerabilities = [
    {
        id: "VULN-1042",
        cve: "CVE-2026-18421",
        title: "Application Server Privilege Boundary Weakness",
        severity: "Critical",
        cvss: 9.4,
        asset: "APP-01",
        category: "Privilege Escalation",
        status: "Open",
        discovered: "06 Oct 2026",
        age: "1 day",
        description:
            "A simulated vulnerability affecting the application server creates an elevated-risk privilege boundary condition.",
        remediation:
            "Apply the recommended security update and validate privilege boundaries through a follow-up simulation.",
    },
    {
        id: "VULN-1041",
        cve: "CVE-2026-17309",
        title: "Web Service Input Validation Weakness",
        severity: "High",
        cvss: 8.1,
        asset: "WEB-01",
        category: "Application Security",
        status: "In Progress",
        discovered: "04 Oct 2026",
        age: "3 days",
        description:
            "The simulated web service contains an input validation weakness that increases attack-surface exposure.",
        remediation:
            "Harden validation controls and verify the application's defensive behavior with a controlled assessment.",
    },
    {
        id: "VULN-1040",
        cve: "CVE-2026-16542",
        title: "Authentication Configuration Weakness",
        severity: "High",
        cvss: 7.8,
        asset: "WIN-DC",
        category: "Identity",
        status: "Open",
        discovered: "03 Oct 2026",
        age: "4 days",
        description:
            "An insecure authentication configuration was identified within the simulated identity environment.",
        remediation:
            "Strengthen authentication policy and review related identity detection coverage.",
    },
    {
        id: "VULN-1039",
        cve: "CVE-2026-14981",
        title: "Outdated Database Component",
        severity: "Medium",
        cvss: 6.4,
        asset: "DB-01",
        category: "Configuration",
        status: "Scheduled",
        discovered: "29 Sep 2026",
        age: "8 days",
        description:
            "The database server contains an outdated component with a moderate simulated security impact.",
        remediation:
            "Schedule the component update during the next maintenance window.",
    },
    {
        id: "VULN-1038",
        cve: "CVE-2026-14217",
        title: "Excessive Service Permissions",
        severity: "Medium",
        cvss: 5.9,
        asset: "APP-01",
        category: "Configuration",
        status: "Resolved",
        discovered: "26 Sep 2026",
        age: "11 days",
        description:
            "Service permissions were broader than required for the simulated application workload.",
        remediation:
            "Restrict service permissions according to least-privilege requirements.",
    },
];

const assets = [
    {
        id: "APP-01",
        name: "Application Server",
        vulnerabilities: 2,
        critical: 1,
        risk: 82,
    },
    {
        id: "WEB-01",
        name: "Web Server",
        vulnerabilities: 1,
        critical: 0,
        risk: 67,
    },
    {
        id: "WIN-DC",
        name: "Domain Controller",
        vulnerabilities: 1,
        critical: 0,
        risk: 71,
    },
    {
        id: "DB-01",
        name: "Database Server",
        vulnerabilities: 1,
        critical: 0,
        risk: 48,
    },
];

const remediationSteps = [
    {
        priority: "P1",
        title: "Remediate APP-01 privilege weakness",
        owner: "Platform Team",
        due: "08 Oct",
        progress: 20,
    },
    {
        priority: "P2",
        title: "Harden WEB-01 input validation",
        owner: "Application Team",
        due: "10 Oct",
        progress: 55,
    },
    {
        priority: "P2",
        title: "Review WIN-DC authentication policy",
        owner: "Identity Team",
        due: "11 Oct",
        progress: 35,
    },
];

function Vulnerabilities() {
    const [selected, setSelected] = useState(vulnerabilities[0]);
    const [severity, setSeverity] = useState("All");
    const [status, setStatus] = useState("All");
    const [search, setSearch] = useState("");
    const [toast, setToast] = useState("");

    const filteredVulnerabilities = useMemo(() => {
        return vulnerabilities.filter((item) => {
            const matchesSeverity =
                severity === "All" || item.severity === severity;

            const matchesStatus =
                status === "All" || item.status === status;

            const query = search.toLowerCase();

            const matchesSearch =
                !query ||
                item.id.toLowerCase().includes(query) ||
                item.cve.toLowerCase().includes(query) ||
                item.title.toLowerCase().includes(query) ||
                item.asset.toLowerCase().includes(query);

            return matchesSeverity && matchesStatus && matchesSearch;
        });
    }, [severity, status, search]);

    const showToast = (message) => {
        setToast(message);

        setTimeout(() => {
            setToast("");
        }, 2200);
    };

    return (
        <main className="page-wrapper vulnerabilities-page">
            <div className="vulnerabilities-topbar">
                <div className="vulnerabilities-breadcrumb">
                    <span>CYBER-TWIN</span>
                    <ChevronRight size={13} />
                    <span>VULNERABILITIES</span>
                    <ChevronRight size={13} />
                    <strong>RISK MANAGEMENT</strong>
                </div>

                <div className="vulnerabilities-live">
                    <span />
                    SCANNER DATA SYNCHRONIZED
                </div>
            </div>

            <section className="vulnerabilities-header animate-fade">
                <div>
                    <div className="page-eyebrow yellow-text">
                        <ShieldAlert size={14} />
                        VULNERABILITY MANAGEMENT
                    </div>

                    <h1>Vulnerability Center</h1>

                    <p>
                        Identify, prioritize and track security weaknesses across the
                        Cyber-Twin environment using asset risk and remediation status.
                    </p>
                </div>

                <div className="vulnerabilities-header-score">
                    <span>ENVIRONMENT RISK</span>
                    <strong>68</strong>
                    <small>Moderate exposure</small>
                </div>
            </section>

            <section className="vulnerability-metrics">
                <div className="panel vulnerability-metric">
                    <div className="vulnerability-metric-icon red">
                        <AlertTriangle size={17} />
                    </div>
                    <span>CRITICAL</span>
                    <strong>01</strong>
                    <small>Requires immediate action</small>
                </div>

                <div className="panel vulnerability-metric">
                    <div className="vulnerability-metric-icon orange">
                        <ShieldAlert size={17} />
                    </div>
                    <span>HIGH</span>
                    <strong>02</strong>
                    <small>Priority remediation</small>
                </div>

                <div className="panel vulnerability-metric">
                    <div className="vulnerability-metric-icon yellow">
                        <Clock3 size={17} />
                    </div>
                    <span>OPEN ITEMS</span>
                    <strong>03</strong>
                    <small>Awaiting remediation</small>
                </div>

                <div className="panel vulnerability-metric">
                    <div className="vulnerability-metric-icon green">
                        <TrendingDown size={17} />
                    </div>
                    <span>RISK REDUCTION</span>
                    <strong>18%</strong>
                    <small>Since previous assessment</small>
                </div>
            </section>

            <section className="vulnerabilities-main">
                <div className="panel vulnerability-list-panel">
                    <div className="section-header">
                        <div>
                            <span className="section-eyebrow">
                                01 / VULNERABILITY INVENTORY
                            </span>
                            <h2>Security Findings</h2>
                        </div>

                        <span className="vulnerability-count">
                            {filteredVulnerabilities.length} FINDINGS
                        </span>
                    </div>

                    <div className="vulnerability-toolbar">
                        <div className="vulnerability-search">
                            <Search size={14} />

                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search CVE, asset or vulnerability..."
                            />
                        </div>

                        <div className="vulnerability-filters">
                            <div>
                                <Filter size={12} />

                                <select
                                    value={severity}
                                    onChange={(event) => setSeverity(event.target.value)}
                                >
                                    <option>All</option>
                                    <option>Critical</option>
                                    <option>High</option>
                                    <option>Medium</option>
                                </select>
                            </div>

                            <div>
                                <select
                                    value={status}
                                    onChange={(event) => setStatus(event.target.value)}
                                >
                                    <option>All</option>
                                    <option>Open</option>
                                    <option>In Progress</option>
                                    <option>Scheduled</option>
                                    <option>Resolved</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="vulnerability-table">
                        <div className="vulnerability-table-head">
                            <span>FINDING</span>
                            <span>SEVERITY</span>
                            <span>ASSET</span>
                            <span>CVSS</span>
                            <span>STATUS</span>
                            <span />
                        </div>

                        {filteredVulnerabilities.map((item) => (
                            <button
                                key={item.id}
                                className={`vulnerability-row ${selected.id === item.id ? "selected" : ""
                                    }`}
                                onClick={() => setSelected(item)}
                            >
                                <div className="vulnerability-name">
                                    <code>{item.cve}</code>
                                    <strong>{item.title}</strong>
                                    <span>{item.id}</span>
                                </div>

                                <span
                                    className={`vulnerability-severity ${item.severity.toLowerCase()}`}
                                >
                                    {item.severity}
                                </span>

                                <span className="vulnerability-asset">
                                    {item.asset}
                                </span>

                                <strong className="vulnerability-cvss">
                                    {item.cvss}
                                </strong>

                                <span
                                    className={`vulnerability-status status-${item.status
                                        .toLowerCase()
                                        .replace(" ", "-")}`}
                                >
                                    {item.status}
                                </span>

                                <ChevronRight size={14} />
                            </button>
                        ))}

                        {!filteredVulnerabilities.length && (
                            <div className="vulnerability-empty">
                                <AlertTriangle size={17} />
                                No vulnerabilities match the current filters.
                            </div>
                        )}
                    </div>
                </div>

                <div className="vulnerability-detail-column">
                    <div className="panel vulnerability-detail">
                        <div className="section-header">
                            <div>
                                <span className="section-eyebrow">02 / FINDING DETAIL</span>
                                <h2>Risk Assessment</h2>
                            </div>

                            <button
                                className="vulnerability-close"
                                onClick={() => setSelected(vulnerabilities[0])}
                            >
                                <X size={14} />
                            </button>
                        </div>

                        <div className="vulnerability-detail-top">
                            <div
                                className={`vulnerability-detail-severity ${selected.severity.toLowerCase()}`}
                            >
                                {selected.severity}
                            </div>

                            <code>{selected.cve}</code>
                        </div>

                        <h3>{selected.title}</h3>

                        <p>{selected.description}</p>

                        <div className="vulnerability-score">
                            <div className="vulnerability-score-circle">
                                <strong>{selected.cvss}</strong>
                                <span>CVSS</span>
                            </div>

                            <div>
                                <span>RISK PRIORITY</span>
                                <strong>
                                    {selected.cvss >= 9
                                        ? "Immediate"
                                        : selected.cvss >= 7
                                            ? "High Priority"
                                            : "Planned"}
                                </strong>

                                <small>
                                    Based on severity, asset exposure and simulation impact.
                                </small>
                            </div>
                        </div>

                        <div className="vulnerability-detail-grid">
                            <div>
                                <span>AFFECTED ASSET</span>
                                <strong>{selected.asset}</strong>
                            </div>

                            <div>
                                <span>CATEGORY</span>
                                <strong>{selected.category}</strong>
                            </div>

                            <div>
                                <span>DISCOVERED</span>
                                <strong>{selected.discovered}</strong>
                            </div>

                            <div>
                                <span>AGE</span>
                                <strong>{selected.age}</strong>
                            </div>
                        </div>

                        <div className="vulnerability-remediation-box">
                            <div>
                                <Zap size={15} />
                                <span>RECOMMENDED REMEDIATION</span>
                            </div>

                            <p>{selected.remediation}</p>
                        </div>

                        <div className="vulnerability-detail-actions">
                            <button
                                className="secondary-button"
                                onClick={() => showToast("Finding marked for remediation.")}
                            >
                                <Target size={14} />
                                Prioritize
                            </button>

                            <button
                                className="primary-button"
                                onClick={() => showToast("Remediation workflow started.")}
                            >
                                <CheckCircle2 size={14} />
                                Start Remediation
                            </button>
                        </div>
                    </div>

                    <div className="panel vulnerability-risk">
                        <div className="section-header">
                            <div>
                                <span className="section-eyebrow">03 / RISK DISTRIBUTION</span>
                                <h2>Severity Profile</h2>
                            </div>

                            <TrendingUp size={17} />
                        </div>

                        <div className="vulnerability-risk-bars">
                            <RiskBar label="Critical" value={20} count="01" type="critical" />
                            <RiskBar label="High" value={40} count="02" type="high" />
                            <RiskBar label="Medium" value={40} count="02" type="medium" />
                        </div>

                        <div className="vulnerability-risk-footer">
                            <span>AVERAGE CVSS</span>
                            <strong>7.9</strong>
                            <ArrowUp size={13} />
                            <small>+0.4 from previous scan</small>
                        </div>
                    </div>
                </div>
            </section>

            <section className="panel vulnerability-assets">
                <div className="section-header">
                    <div>
                        <span className="section-eyebrow">
                            04 / ASSET RISK
                        </span>
                        <h2>Most Exposed Assets</h2>
                    </div>

                    <Server size={17} />
                </div>

                <div className="vulnerability-asset-grid">
                    {assets.map((asset) => (
                        <div className="vulnerability-asset-card" key={asset.id}>
                            <div className="vulnerability-asset-top">
                                <div className="vulnerability-server-icon">
                                    <Server size={16} />
                                </div>

                                <span
                                    className={`asset-risk ${asset.risk >= 75
                                            ? "critical"
                                            : asset.risk >= 60
                                                ? "high"
                                                : "medium"
                                        }`}
                                >
                                    {asset.risk >= 75
                                        ? "HIGH RISK"
                                        : asset.risk >= 60
                                            ? "ELEVATED"
                                            : "MODERATE"}
                                </span>
                            </div>

                            <strong>{asset.name}</strong>
                            <code>{asset.id}</code>

                            <div className="vulnerability-asset-riskbar">
                                <div style={{ width: `${asset.risk}%` }} />
                            </div>

                            <div className="vulnerability-asset-stats">
                                <div>
                                    <span>FINDINGS</span>
                                    <strong>{asset.vulnerabilities}</strong>
                                </div>

                                <div>
                                    <span>CRITICAL</span>
                                    <strong>{asset.critical}</strong>
                                </div>

                                <div>
                                    <span>RISK</span>
                                    <strong>{asset.risk}</strong>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="panel vulnerability-remediation">
                <div className="section-header">
                    <div>
                        <span className="section-eyebrow">
                            05 / REMEDIATION TRACKING
                        </span>
                        <h2>Priority Remediation</h2>
                    </div>

                    <CheckCircle2 size={17} />
                </div>

                <div className="vulnerability-remediation-list">
                    {remediationSteps.map((item) => (
                        <div
                            className="vulnerability-remediation-row"
                            key={item.priority}
                        >
                            <div className="vulnerability-priority">
                                {item.priority}
                            </div>

                            <div className="vulnerability-remediation-main">
                                <strong>{item.title}</strong>
                                <span>
                                    Owner: {item.owner} · Due: {item.due}
                                </span>
                            </div>

                            <div className="vulnerability-progress">
                                <div>
                                    <span>PROGRESS</span>
                                    <strong>{item.progress}%</strong>
                                </div>

                                <div className="vulnerability-progress-track">
                                    <div style={{ width: `${item.progress}%` }} />
                                </div>
                            </div>

                            <ChevronRight size={15} />
                        </div>
                    ))}
                </div>
            </section>

            <section className="vulnerability-footer">
                <div>
                    <ShieldAlert size={15} />
                    <span>TOTAL FINDINGS</span>
                    <strong>05</strong>
                </div>

                <div>
                    <ArrowDown size={15} />
                    <span>REMEDIATED</span>
                    <strong>01</strong>
                </div>

                <div>
                    <TrendingDown size={15} />
                    <span>RISK REDUCTION</span>
                    <strong>18%</strong>
                </div>

                <div>
                    <Network size={15} />
                    <span>ASSETS SCANNED</span>
                    <strong>04</strong>
                </div>
            </section>

            {toast && (
                <div className="vulnerability-toast">
                    <CheckCircle2 size={15} />
                    {toast}
                </div>
            )}
        </main>
    );
}

function RiskBar({ label, value, count, type }) {
    return (
        <div className="vulnerability-risk-row">
            <div className="vulnerability-risk-label">
                <span>{label}</span>
                <strong>{count}</strong>
            </div>

            <div className="vulnerability-risk-track">
                <div
                    className={`risk-fill ${type}`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}

export default Vulnerabilities;