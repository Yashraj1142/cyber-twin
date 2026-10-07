import { useMemo, useState } from "react";
import {
    Activity,
    AlertCircle,
    ArrowUpRight,
    CheckCircle2,
    ChevronRight,
    CircleAlert,
    Clock3,
    Eye,
    Filter,
    Lock,
    Network,
    Search,
    Server,
    Shield,
    ShieldAlert,
    Terminal,
    UserRound,
    X,
    Zap,
} from "lucide-react";

const alerts = [
    {
        id: "ALT-1042",
        severity: "Critical",
        title: "Suspicious lateral movement detected",
        source: "EDR / Network",
        asset: "APP-01",
        time: "09:46:21",
        technique: "T1021",
        status: "Open",
        description:
            "Multiple simulated remote-service events were correlated across the application segment.",
    },
    {
        id: "ALT-1041",
        severity: "High",
        title: "Privilege escalation behavior",
        source: "Endpoint",
        asset: "WEB-01",
        time: "09:45:08",
        technique: "T1068",
        status: "Investigating",
        description:
            "Behavioral indicators suggest an attempted privilege boundary transition.",
    },
    {
        id: "ALT-1040",
        severity: "High",
        title: "Credential exposure pattern",
        source: "Identity",
        asset: "WIN-DC",
        time: "09:43:52",
        technique: "T1552",
        status: "Open",
        description:
            "The simulation generated a credential exposure condition requiring analyst review.",
    },
    {
        id: "ALT-1039",
        severity: "Medium",
        title: "Unexpected web application activity",
        source: "WAF",
        asset: "WEB-01",
        time: "09:42:16",
        technique: "T1190",
        status: "Closed",
        description:
            "A simulated public-facing application event was detected and automatically classified.",
    },
    {
        id: "ALT-1038",
        severity: "Low",
        title: "Unusual authentication pattern",
        source: "Identity",
        asset: "APP-01",
        time: "09:40:44",
        technique: "T1078",
        status: "Closed",
        description:
            "Authentication behavior deviated from the configured baseline.",
    },
];

const telemetry = [
    {
        time: "09:46:21",
        source: "EDR",
        event: "Remote service activity",
        asset: "APP-01",
        severity: "Critical",
    },
    {
        time: "09:45:08",
        source: "Endpoint",
        event: "Privilege boundary event",
        asset: "WEB-01",
        severity: "High",
    },
    {
        time: "09:44:31",
        source: "Network",
        event: "East-west traffic anomaly",
        asset: "APP-01",
        severity: "High",
    },
    {
        time: "09:43:52",
        source: "Identity",
        event: "Credential exposure indicator",
        asset: "WIN-DC",
        severity: "High",
    },
    {
        time: "09:42:16",
        source: "WAF",
        event: "Public application anomaly",
        asset: "WEB-01",
        severity: "Medium",
    },
    {
        time: "09:41:47",
        source: "EDR",
        event: "Process behavior deviation",
        asset: "DB-01",
        severity: "Medium",
    },
];

const detections = [
    {
        name: "Lateral Movement Detection",
        technique: "T1021",
        coverage: 91,
        status: "Strong",
    },
    {
        name: "Privilege Escalation Detection",
        technique: "T1068",
        coverage: 78,
        status: "Good",
    },
    {
        name: "Credential Exposure Detection",
        technique: "T1552",
        coverage: 69,
        status: "Needs tuning",
    },
    {
        name: "Public Application Detection",
        technique: "T1190",
        coverage: 84,
        status: "Strong",
    },
];

const assets = [
    {
        id: "WEB-01",
        name: "Web Server",
        status: "Alert",
        events: 38,
        score: 72,
    },
    {
        id: "APP-01",
        name: "Application Server",
        status: "Critical",
        events: 57,
        score: 41,
    },
    {
        id: "DB-01",
        name: "Database Server",
        status: "Monitored",
        events: 21,
        score: 89,
    },
    {
        id: "WIN-DC",
        name: "Domain Controller",
        status: "Alert",
        events: 31,
        score: 63,
    },
];

function BlueSOC() {
    const [selectedAlert, setSelectedAlert] = useState(alerts[0]);
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [toast, setToast] = useState("");

    const filteredAlerts = useMemo(() => {
        return alerts.filter((alert) => {
            const matchesFilter =
                filter === "All" || alert.severity === filter;

            const query = search.toLowerCase();

            const matchesSearch =
                !query ||
                alert.id.toLowerCase().includes(query) ||
                alert.title.toLowerCase().includes(query) ||
                alert.asset.toLowerCase().includes(query);

            return matchesFilter && matchesSearch;
        });
    }, [filter, search]);

    const showToast = (message) => {
        setToast(message);

        setTimeout(() => {
            setToast("");
        }, 2200);
    };

    const acknowledgeAlert = () => {
        showToast(`${selectedAlert.id} acknowledged by analyst.`);
    };

    const escalateAlert = () => {
        showToast(`${selectedAlert.id} escalated to incident queue.`);
    };

    return (
        <main className="page-wrapper blue-soc-page">
            <div className="blue-soc-topbar">
                <div className="blue-soc-breadcrumb">
                    <span>CYBER-TWIN</span>
                    <ChevronRight size={13} />
                    <span>BLUE SOC</span>
                    <ChevronRight size={13} />
                    <strong>DEFENSIVE OPERATIONS</strong>
                </div>

                <div className="blue-soc-live">
                    <span />
                    LIVE TELEMETRY
                </div>
            </div>

            <section className="blue-soc-header animate-fade">
                <div>
                    <div className="page-eyebrow green-text">
                        <Shield size={14} />
                        BLUE TEAM OPERATIONS
                    </div>

                    <h1>Security Operations Center</h1>

                    <p>
                        Monitor simulated security telemetry, investigate detections and
                        measure defensive visibility across the Cyber-Twin environment.
                    </p>
                </div>

                <div className="blue-soc-header-status">
                    <div>
                        <span>SOC STATUS</span>
                        <strong className="green-text">OPERATIONAL</strong>
                    </div>

                    <div>
                        <span>ACTIVE ALERTS</span>
                        <strong>08</strong>
                    </div>

                    <div>
                        <span>DETECTION</span>
                        <strong>82%</strong>
                    </div>
                </div>
            </section>

            <section className="blue-soc-metrics">
                <div className="panel blue-soc-metric">
                    <div className="blue-soc-metric-icon red">
                        <AlertCircle size={17} />
                    </div>
                    <span>CRITICAL ALERTS</span>
                    <strong>02</strong>
                    <small>Require immediate investigation</small>
                </div>

                <div className="panel blue-soc-metric">
                    <div className="blue-soc-metric-icon orange">
                        <ShieldAlert size={17} />
                    </div>
                    <span>HIGH SEVERITY</span>
                    <strong>03</strong>
                    <small>Awaiting analyst action</small>
                </div>

                <div className="panel blue-soc-metric">
                    <div className="blue-soc-metric-icon cyan">
                        <Activity size={17} />
                    </div>
                    <span>EVENTS / MIN</span>
                    <strong>146</strong>
                    <small>Across simulated telemetry</small>
                </div>

                <div className="panel blue-soc-metric">
                    <div className="blue-soc-metric-icon green">
                        <CheckCircle2 size={17} />
                    </div>
                    <span>MTTR</span>
                    <strong>04m 18s</strong>
                    <small>Mean simulated response time</small>
                </div>
            </section>

            <section className="blue-soc-main-grid">
                <div className="panel blue-soc-alert-panel">
                    <div className="section-header">
                        <div>
                            <span className="section-eyebrow">01 / ALERT QUEUE</span>
                            <h2>Detection Inbox</h2>
                        </div>

                        <span className="blue-soc-alert-count">
                            {filteredAlerts.length} EVENTS
                        </span>
                    </div>

                    <div className="blue-soc-toolbar">
                        <div className="blue-soc-search">
                            <Search size={14} />
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search alerts..."
                            />
                        </div>

                        <div className="blue-soc-filters">
                            {["All", "Critical", "High", "Medium", "Low"].map(
                                (item) => (
                                    <button
                                        key={item}
                                        className={filter === item ? "active" : ""}
                                        onClick={() => setFilter(item)}
                                    >
                                        {item}
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    <div className="blue-soc-alert-list">
                        {filteredAlerts.map((alert) => (
                            <button
                                key={alert.id}
                                className={`blue-soc-alert ${selectedAlert.id === alert.id ? "selected" : ""
                                    }`}
                                onClick={() => setSelectedAlert(alert)}
                            >
                                <div
                                    className={`blue-soc-severity severity-${alert.severity.toLowerCase()}`}
                                >
                                    {alert.severity.slice(0, 1)}
                                </div>

                                <div className="blue-soc-alert-content">
                                    <div className="blue-soc-alert-title">
                                        <strong>{alert.title}</strong>
                                        <span>{alert.id}</span>
                                    </div>

                                    <div className="blue-soc-alert-meta">
                                        <span>{alert.source}</span>
                                        <span>{alert.asset}</span>
                                        <span>{alert.technique}</span>
                                        <span>{alert.time}</span>
                                    </div>
                                </div>

                                <ChevronRight size={14} />
                            </button>
                        ))}

                        {!filteredAlerts.length && (
                            <div className="blue-soc-empty">
                                <CircleAlert size={18} />
                                No alerts match the current filter.
                            </div>
                        )}
                    </div>
                </div>

                <div className="blue-soc-right-column">
                    <div className="panel blue-soc-investigation">
                        <div className="section-header">
                            <div>
                                <span className="section-eyebrow">02 / INVESTIGATION</span>
                                <h2>Alert Detail</h2>
                            </div>

                            <button
                                className="blue-soc-close"
                                onClick={() => setSelectedAlert(alerts[0])}
                            >
                                <X size={14} />
                            </button>
                        </div>

                        <div className="blue-soc-alert-detail-header">
                            <div
                                className={`blue-soc-detail-severity severity-${selectedAlert.severity.toLowerCase()}`}
                            >
                                {selectedAlert.severity}
                            </div>

                            <span>{selectedAlert.id}</span>
                        </div>

                        <h3>{selectedAlert.title}</h3>

                        <p className="blue-soc-detail-description">
                            {selectedAlert.description}
                        </p>

                        <div className="blue-soc-detail-grid">
                            <div>
                                <span>ASSET</span>
                                <strong>{selectedAlert.asset}</strong>
                            </div>

                            <div>
                                <span>SOURCE</span>
                                <strong>{selectedAlert.source}</strong>
                            </div>

                            <div>
                                <span>TECHNIQUE</span>
                                <strong>{selectedAlert.technique}</strong>
                            </div>

                            <div>
                                <span>STATUS</span>
                                <strong>{selectedAlert.status}</strong>
                            </div>
                        </div>

                        <div className="blue-soc-action-row">
                            <button
                                className="secondary-button"
                                onClick={acknowledgeAlert}
                            >
                                <CheckCircle2 size={14} />
                                Acknowledge
                            </button>

                            <button
                                className="primary-button"
                                onClick={escalateAlert}
                            >
                                <ArrowUpRight size={14} />
                                Escalate
                            </button>
                        </div>
                    </div>

                    <div className="panel blue-soc-investigation">
                        <div className="section-header">
                            <div>
                                <span className="section-eyebrow">CORRELATION</span>
                                <h2>Attack Context</h2>
                            </div>

                            <GitBranchIcon />
                        </div>

                        <div className="blue-soc-context">
                            <div className="blue-soc-context-node">
                                <Server size={14} />
                                <div>
                                    <span>SOURCE</span>
                                    <strong>WEB-01</strong>
                                </div>
                            </div>

                            <div className="blue-soc-context-line" />

                            <div className="blue-soc-context-node active">
                                <ShieldAlert size={14} />
                                <div>
                                    <span>DETECTION</span>
                                    <strong>{selectedAlert.technique}</strong>
                                </div>
                            </div>

                            <div className="blue-soc-context-line" />

                            <div className="blue-soc-context-node">
                                <Network size={14} />
                                <div>
                                    <span>RELATED ASSET</span>
                                    <strong>APP-01</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="blue-soc-lower-grid">
                <div className="panel blue-soc-telemetry">
                    <div className="section-header">
                        <div>
                            <span className="section-eyebrow">03 / TELEMETRY STREAM</span>
                            <h2>Security Events</h2>
                        </div>

                        <Terminal size={17} />
                    </div>

                    <div className="blue-soc-table">
                        <div className="blue-soc-table-head">
                            <span>TIME</span>
                            <span>SOURCE</span>
                            <span>EVENT</span>
                            <span>ASSET</span>
                            <span>SEVERITY</span>
                        </div>

                        {telemetry.map((event, index) => (
                            <div className="blue-soc-table-row" key={`${event.time}-${index}`}>
                                <span className="mono">{event.time}</span>
                                <span>{event.source}</span>
                                <span>{event.event}</span>
                                <span className="mono">{event.asset}</span>
                                <span
                                    className={`telemetry-${event.severity.toLowerCase()}`}
                                >
                                    {event.severity}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="panel blue-soc-detection">
                    <div className="section-header">
                        <div>
                            <span className="section-eyebrow">04 / DETECTION ENGINE</span>
                            <h2>Coverage Health</h2>
                        </div>

                        <Zap size={17} />
                    </div>

                    <div className="blue-soc-detection-list">
                        {detections.map((detection) => (
                            <div className="blue-soc-detection-row" key={detection.technique}>
                                <div className="blue-soc-detection-title">
                                    <div>
                                        <strong>{detection.name}</strong>
                                        <span>{detection.technique}</span>
                                    </div>

                                    <strong>{detection.coverage}%</strong>
                                </div>

                                <div className="blue-soc-bar">
                                    <div style={{ width: `${detection.coverage}%` }} />
                                </div>

                                <span className="blue-soc-detection-status">
                                    {detection.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="panel blue-soc-assets">
                <div className="section-header">
                    <div>
                        <span className="section-eyebrow">05 / ASSET MONITORING</span>
                        <h2>Environment Health</h2>
                    </div>

                    <Server size={17} />
                </div>

                <div className="blue-soc-asset-grid">
                    {assets.map((asset) => (
                        <div className="blue-soc-asset-card" key={asset.id}>
                            <div className="blue-soc-asset-top">
                                <div className="blue-soc-asset-icon">
                                    <Server size={16} />
                                </div>

                                <span
                                    className={`asset-status-${asset.status.toLowerCase()}`}
                                >
                                    {asset.status}
                                </span>
                            </div>

                            <strong>{asset.name}</strong>
                            <span className="blue-soc-asset-id">{asset.id}</span>

                            <div className="blue-soc-asset-stats">
                                <div>
                                    <span>EVENTS</span>
                                    <strong>{asset.events}</strong>
                                </div>

                                <div>
                                    <span>HEALTH</span>
                                    <strong>{asset.score}%</strong>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {toast && (
                <div className="blue-soc-toast">
                    <CheckCircle2 size={15} />
                    {toast}
                </div>
            )}
        </main>
    );
}

function GitBranchIcon() {
    return <Network size={17} />;
}

export default BlueSOC;