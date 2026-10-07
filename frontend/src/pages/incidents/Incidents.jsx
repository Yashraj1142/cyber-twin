import { useMemo, useState } from "react";
import {
    Activity,
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    ChevronRight,
    Clock3,
    FileSearch,
    Filter,
    Lock,
    MessageSquare,
    Network,
    Search,
    Server,
    ShieldAlert,
    UserRound,
    X,
    Zap,
} from "lucide-react";

const incidents = [
    {
        id: "INC-2026-024",
        title: "Suspicious Lateral Movement",
        severity: "Critical",
        status: "Investigating",
        assignee: "A. Sharma",
        created: "09:46:21",
        updated: "09:48:05",
        alerts: 4,
        assets: ["APP-01", "WEB-01"],
        technique: "T1021",
        category: "Lateral Movement",
        description:
            "Multiple correlated remote-service events were observed across the application segment during the Red Agent simulation.",
    },
    {
        id: "INC-2026-023",
        title: "Privilege Escalation Activity",
        severity: "High",
        status: "Contained",
        assignee: "R. Mehta",
        created: "09:41:08",
        updated: "09:45:27",
        alerts: 3,
        assets: ["WEB-01"],
        technique: "T1068",
        category: "Privilege Escalation",
        description:
            "Endpoint telemetry indicates a simulated privilege boundary transition requiring investigation.",
    },
    {
        id: "INC-2026-022",
        title: "Credential Exposure Pattern",
        severity: "High",
        status: "Open",
        assignee: "Unassigned",
        created: "09:37:44",
        updated: "09:39:18",
        alerts: 2,
        assets: ["WIN-DC"],
        technique: "T1552",
        category: "Credential Access",
        description:
            "Identity telemetry generated a simulated credential exposure condition.",
    },
    {
        id: "INC-2026-021",
        title: "Public Application Anomaly",
        severity: "Medium",
        status: "Resolved",
        assignee: "N. Kapoor",
        created: "09:28:17",
        updated: "09:35:41",
        alerts: 2,
        assets: ["WEB-01"],
        technique: "T1190",
        category: "Initial Access",
        description:
            "A simulated public-facing application anomaly was detected and automatically correlated.",
    },
];

const timeline = [
    {
        time: "09:46:21",
        type: "DETECTION",
        title: "Initial alert generated",
        description: "EDR generated a high-confidence behavioral alert.",
    },
    {
        time: "09:46:44",
        type: "CORRELATION",
        title: "Related events identified",
        description: "Three related telemetry events were correlated.",
    },
    {
        time: "09:47:12",
        type: "ESCALATION",
        title: "Incident created",
        description: "Alert cluster promoted to incident INC-2026-024.",
    },
    {
        time: "09:47:39",
        type: "INVESTIGATION",
        title: "Analyst investigation started",
        description: "Incident assigned to A. Sharma for analysis.",
    },
    {
        time: "09:48:05",
        type: "CONTAINMENT",
        title: "Affected asset isolated",
        description: "APP-01 marked as contained within the simulation environment.",
    },
];

const evidence = [
    {
        name: "EDR Event Cluster",
        type: "Telemetry",
        source: "APP-01",
        integrity: "Verified",
    },
    {
        name: "Network Flow Summary",
        type: "Network",
        source: "SEGMENT-03",
        integrity: "Verified",
    },
    {
        name: "Identity Events",
        type: "Authentication",
        source: "WIN-DC",
        integrity: "Verified",
    },
];

const statusFlow = ["Open", "Investigating", "Contained", "Resolved"];

function Incidents() {
    const [selectedIncident, setSelectedIncident] = useState(incidents[0]);
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [toast, setToast] = useState("");
    const [note, setNote] = useState("");

    const filteredIncidents = useMemo(() => {
        return incidents.filter((incident) => {
            const matchesFilter =
                filter === "All" || incident.severity === filter;

            const query = search.toLowerCase();

            const matchesSearch =
                !query ||
                incident.id.toLowerCase().includes(query) ||
                incident.title.toLowerCase().includes(query) ||
                incident.status.toLowerCase().includes(query);

            return matchesFilter && matchesSearch;
        });
    }, [filter, search]);

    const showToast = (message) => {
        setToast(message);

        setTimeout(() => {
            setToast("");
        }, 2200);
    };

    const changeStatus = (status) => {
        setSelectedIncident((current) => ({
            ...current,
            status,
            updated: new Date().toLocaleTimeString("en-GB"),
        }));

        showToast(`Incident status changed to ${status}.`);
    };

    const addNote = () => {
        if (!note.trim()) return;

        setNote("");
        showToast("Investigation note added.");
    };

    const currentStatusIndex = statusFlow.indexOf(selectedIncident.status);

    return (
        <main className="page-wrapper incidents-page">
            <div className="incidents-topbar">
                <div className="incidents-breadcrumb">
                    <span>CYBER-TWIN</span>
                    <ChevronRight size={13} />
                    <span>INCIDENTS</span>
                    <ChevronRight size={13} />
                    <strong>INCIDENT RESPONSE</strong>
                </div>

                <div className="incidents-live">
                    <span />
                    RESPONSE CENTER ONLINE
                </div>
            </div>

            <section className="incidents-header animate-fade">
                <div>
                    <div className="page-eyebrow red-text">
                        <ShieldAlert size={14} />
                        INCIDENT RESPONSE
                    </div>

                    <h1>Incident Management</h1>

                    <p>
                        Investigate correlated security events, track response progress
                        and manage incidents across the simulated environment.
                    </p>
                </div>

                <div className="incidents-header-stats">
                    <div>
                        <span>OPEN</span>
                        <strong>04</strong>
                    </div>

                    <div>
                        <span>CRITICAL</span>
                        <strong className="red-text">01</strong>
                    </div>

                    <div>
                        <span>MTTR</span>
                        <strong>04m</strong>
                    </div>

                    <div>
                        <span>RESOLVED</span>
                        <strong className="green-text">87%</strong>
                    </div>
                </div>
            </section>

            <section className="incidents-layout">
                <div className="panel incidents-queue">
                    <div className="section-header">
                        <div>
                            <span className="section-eyebrow">01 / INCIDENT QUEUE</span>
                            <h2>Active Investigations</h2>
                        </div>

                        <span className="incidents-count">
                            {filteredIncidents.length} INCIDENTS
                        </span>
                    </div>

                    <div className="incidents-toolbar">
                        <div className="incidents-search">
                            <Search size={14} />
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search incidents..."
                            />
                        </div>

                        <div className="incidents-filters">
                            {["All", "Critical", "High", "Medium"].map((item) => (
                                <button
                                    key={item}
                                    className={filter === item ? "active" : ""}
                                    onClick={() => setFilter(item)}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="incidents-list">
                        {filteredIncidents.map((incident) => (
                            <button
                                key={incident.id}
                                className={`incident-item ${selectedIncident.id === incident.id ? "selected" : ""
                                    }`}
                                onClick={() => setSelectedIncident(incident)}
                            >
                                <div
                                    className={`incident-severity ${incident.severity.toLowerCase()}`}
                                >
                                    {incident.severity.slice(0, 1)}
                                </div>

                                <div className="incident-item-main">
                                    <div className="incident-item-title">
                                        <strong>{incident.title}</strong>
                                        <span>{incident.id}</span>
                                    </div>

                                    <div className="incident-item-meta">
                                        <span>{incident.category}</span>
                                        <span>{incident.technique}</span>
                                        <span>{incident.updated}</span>
                                    </div>

                                    <div className="incident-item-status">
                                        <span
                                            className={`status-dot status-${incident.status
                                                .toLowerCase()
                                                .replace(" ", "-")}`}
                                        />
                                        {incident.status}
                                    </div>
                                </div>

                                <ChevronRight size={14} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="incidents-detail-column">
                    <div className="panel incident-detail">
                        <div className="section-header">
                            <div>
                                <span className="section-eyebrow">02 / INVESTIGATION</span>
                                <h2>Incident Detail</h2>
                            </div>

                            <button
                                className="incident-close"
                                onClick={() => setSelectedIncident(incidents[0])}
                            >
                                <X size={14} />
                            </button>
                        </div>

                        <div className="incident-detail-id">
                            <span
                                className={`incident-detail-severity ${selectedIncident.severity.toLowerCase()}`}
                            >
                                {selectedIncident.severity}
                            </span>

                            <code>{selectedIncident.id}</code>
                        </div>

                        <h3>{selectedIncident.title}</h3>

                        <p className="incident-description">
                            {selectedIncident.description}
                        </p>

                        <div className="incident-info-grid">
                            <div>
                                <span>CATEGORY</span>
                                <strong>{selectedIncident.category}</strong>
                            </div>

                            <div>
                                <span>TECHNIQUE</span>
                                <strong>{selectedIncident.technique}</strong>
                            </div>

                            <div>
                                <span>ASSIGNEE</span>
                                <strong>{selectedIncident.assignee}</strong>
                            </div>

                            <div>
                                <span>AFFECTED ASSETS</span>
                                <strong>{selectedIncident.assets.join(", ")}</strong>
                            </div>
                        </div>

                        <div className="incident-status-flow">
                            {statusFlow.map((status, index) => (
                                <div
                                    key={status}
                                    className={`incident-flow-step ${index <= currentStatusIndex ? "complete" : ""
                                        } ${status === selectedIncident.status ? "current" : ""}`}
                                >
                                    <div>
                                        {index <= currentStatusIndex ? (
                                            <CheckCircle2 size={13} />
                                        ) : (
                                            <span>{index + 1}</span>
                                        )}
                                    </div>

                                    <span>{status}</span>

                                    {index < statusFlow.length - 1 && (
                                        <i
                                            className={
                                                index < currentStatusIndex ? "complete" : ""
                                            }
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="incident-actions">
                            {selectedIncident.status !== "Investigating" && (
                                <button
                                    className="secondary-button"
                                    onClick={() => changeStatus("Investigating")}
                                >
                                    <FileSearch size={14} />
                                    Investigate
                                </button>
                            )}

                            {selectedIncident.status !== "Contained" &&
                                selectedIncident.status !== "Resolved" && (
                                    <button
                                        className="secondary-button"
                                        onClick={() => changeStatus("Contained")}
                                    >
                                        <Lock size={14} />
                                        Contain
                                    </button>
                                )}

                            {selectedIncident.status !== "Resolved" && (
                                <button
                                    className="primary-button"
                                    onClick={() => changeStatus("Resolved")}
                                >
                                    <CheckCircle2 size={14} />
                                    Resolve
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="panel incident-timeline">
                        <div className="section-header">
                            <div>
                                <span className="section-eyebrow">03 / INCIDENT TIMELINE</span>
                                <h2>Event History</h2>
                            </div>

                            <Clock3 size={17} />
                        </div>

                        <div className="incident-timeline-list">
                            {timeline.map((event, index) => (
                                <div className="incident-timeline-item" key={event.time}>
                                    <div className="incident-timeline-marker">
                                        {index === timeline.length - 1 ? (
                                            <Lock size={12} />
                                        ) : (
                                            <Activity size={12} />
                                        )}
                                    </div>

                                    {index < timeline.length - 1 && (
                                        <div className="incident-timeline-line" />
                                    )}

                                    <div className="incident-timeline-content">
                                        <div>
                                            <span>{event.time}</span>
                                            <code>{event.type}</code>
                                        </div>

                                        <strong>{event.title}</strong>
                                        <p>{event.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="incidents-lower-grid">
                <div className="panel incident-evidence">
                    <div className="section-header">
                        <div>
                            <span className="section-eyebrow">04 / EVIDENCE</span>
                            <h2>Investigation Artifacts</h2>
                        </div>

                        <FileSearch size={17} />
                    </div>

                    <div className="incident-evidence-list">
                        {evidence.map((item) => (
                            <div className="incident-evidence-row" key={item.name}>
                                <div className="incident-evidence-icon">
                                    {item.type === "Network" ? (
                                        <Network size={15} />
                                    ) : item.type === "Authentication" ? (
                                        <Lock size={15} />
                                    ) : (
                                        <Activity size={15} />
                                    )}
                                </div>

                                <div>
                                    <strong>{item.name}</strong>
                                    <span>
                                        {item.type} · Source: {item.source}
                                    </span>
                                </div>

                                <div className="incident-integrity">
                                    <CheckCircle2 size={12} />
                                    {item.integrity}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="panel incident-assets">
                    <div className="section-header">
                        <div>
                            <span className="section-eyebrow">05 / AFFECTED ASSETS</span>
                            <h2>Environment Impact</h2>
                        </div>

                        <Server size={17} />
                    </div>

                    <div className="incident-asset-list">
                        {selectedIncident.assets.map((asset, index) => (
                            <div className="incident-asset" key={asset}>
                                <div className="incident-asset-icon">
                                    <Server size={15} />
                                </div>

                                <div>
                                    <strong>{asset}</strong>
                                    <span>
                                        {index === 0 ? "Primary affected asset" : "Related asset"}
                                    </span>
                                </div>

                                <span className="incident-asset-status">
                                    {index === 0 ? "CONTAINED" : "MONITORED"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="panel incident-notes">
                <div className="section-header">
                    <div>
                        <span className="section-eyebrow">06 / ANALYST NOTES</span>
                        <h2>Investigation Journal</h2>
                    </div>

                    <MessageSquare size={17} />
                </div>

                <div className="incident-note-area">
                    <div className="incident-note-author">
                        <div>
                            <UserRound size={15} />
                        </div>

                        <span>ANALYST / A. SHARMA</span>
                    </div>

                    <textarea
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        placeholder="Add an investigation observation, decision or response note..."
                    />

                    <div className="incident-note-footer">
                        <span>
                            Notes are stored as part of the simulated investigation record.
                        </span>

                        <button className="primary-button" onClick={addNote}>
                            <MessageSquare size={14} />
                            Add Note
                        </button>
                    </div>
                </div>
            </section>

            <section className="incident-footer-metrics">
                <div>
                    <AlertCircle size={15} />
                    <span>OPEN INCIDENTS</span>
                    <strong>04</strong>
                </div>

                <div>
                    <Clock3 size={15} />
                    <span>AVG RESPONSE</span>
                    <strong>04m 18s</strong>
                </div>

                <div>
                    <Zap size={15} />
                    <span>AUTOMATED CORRELATION</span>
                    <strong>91%</strong>
                </div>

                <div>
                    <CheckCircle2 size={15} />
                    <span>RESOLUTION RATE</span>
                    <strong>87%</strong>
                </div>
            </section>

            {toast && (
                <div className="incident-toast">
                    <CheckCircle2 size={15} />
                    {toast}
                </div>
            )}
        </main>
    );
}

export default Incidents;