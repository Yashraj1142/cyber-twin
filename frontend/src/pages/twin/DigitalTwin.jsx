import {
    Activity,
    AlertTriangle,
    ArrowDown,
    ArrowUp,
    Box,
    Cable,
    CheckCircle2,
    ChevronDown,
    Circle,
    Clock3,
    Cpu,
    Database,
    Globe,
    HardDrive,
    Layers3,
    LockKeyhole,
    MoreHorizontal,
    Network,
    Play,
    RefreshCw,
    Server,
    Settings2,
    Shield,
    ShieldCheck,
    Terminal,
    Wifi,
    XCircle,
    Zap,
} from "lucide-react";

import { useState } from "react";

function DigitalTwin() {
    const [environment, setEnvironment] = useState("Production");
    const [selectedNode, setSelectedNode] = useState("gateway");
    const [isRefreshing, setIsRefreshing] = useState(false);

    const nodes = [
        {
            id: "internet",
            name: "Internet",
            type: "External",
            icon: Globe,
            status: "online",
            x: "8%",
            y: "45%",
        },
        {
            id: "gateway",
            name: "API Gateway",
            type: "Network",
            icon: Network,
            status: "online",
            x: "27%",
            y: "45%",
        },
        {
            id: "web",
            name: "Web Cluster",
            type: "Application",
            icon: Server,
            status: "online",
            x: "48%",
            y: "28%",
        },
        {
            id: "auth",
            name: "Auth Service",
            type: "Service",
            icon: LockKeyhole,
            status: "online",
            x: "48%",
            y: "63%",
        },
        {
            id: "database",
            name: "Primary DB",
            type: "Database",
            icon: Database,
            status: "warning",
            x: "72%",
            y: "45%",
        },
        {
            id: "storage",
            name: "Object Storage",
            type: "Storage",
            icon: HardDrive,
            status: "online",
            x: "90%",
            y: "45%",
        },
    ];

    const selected =
        nodes.find((node) => node.id === selectedNode) || nodes[1];

    const handleRefresh = () => {
        setIsRefreshing(true);

        setTimeout(() => {
            setIsRefreshing(false);
        }, 800);
    };

    return (
        <div className="page-wrapper twin-page animate-fade">

            {/* =====================================================
          HEADER
      ====================================================== */}

            <div className="twin-header">

                <div>

                    <div className="page-eyebrow">
                        CYBER-TWIN / DIGITAL ENVIRONMENT
                    </div>

                    <div className="twin-title-row">

                        <div className="twin-main-icon">
                            <Layers3 size={23} />
                        </div>

                        <div>

                            <h1>
                                Digital Twin
                            </h1>

                            <div className="twin-subtitle">

                                <span className="status-dot online" />

                                Environment synchronized

                                <span className="twin-separator">
                                    /
                                </span>

                                Last sync 8 sec ago

                            </div>

                        </div>

                    </div>

                </div>

                <div className="twin-header-actions">

                    <div className="twin-environment-selector">

                        <span>
                            ENVIRONMENT
                        </span>

                        <select
                            value={environment}
                            onChange={(event) =>
                                setEnvironment(event.target.value)
                            }
                        >
                            <option>Production</option>
                            <option>Staging</option>
                            <option>Development</option>
                        </select>

                        <ChevronDown size={12} />

                    </div>

                    <button
                        className="secondary-button"
                        onClick={handleRefresh}
                    >

                        <RefreshCw
                            size={14}
                            className={
                                isRefreshing
                                    ? "spin"
                                    : ""
                            }
                        />

                        Sync Twin

                    </button>

                    <button className="primary-button">

                        <Play size={14} />

                        Simulate Attack

                    </button>

                </div>

            </div>

            {/* =====================================================
          STATUS BAR
      ====================================================== */}

            <div className="twin-status-bar">

                <div className="twin-status-main">

                    <div className="twin-live-indicator">

                        <span />

                        LIVE

                    </div>

                    <div className="twin-status-divider" />

                    <div>

                        <span className="twin-status-label">
                            TWIN STATE
                        </span>

                        <strong>
                            Operational
                        </strong>

                    </div>

                </div>

                <div className="twin-status-metrics">

                    <div>
                        <span>HOSTS</span>
                        <strong>14</strong>
                    </div>

                    <div>
                        <span>SERVICES</span>
                        <strong>37</strong>
                    </div>

                    <div>
                        <span>CONTAINERS</span>
                        <strong>27</strong>
                    </div>

                    <div>
                        <span>NETWORKS</span>
                        <strong>06</strong>
                    </div>

                    <div>
                        <span>TELEMETRY</span>
                        <strong className="green">
                            98.7%
                        </strong>
                    </div>

                </div>

            </div>

            {/* =====================================================
          MAIN GRID
      ====================================================== */}

            <div className="twin-main-grid">

                {/* =================================================
            TOPOLOGY
        ================================================== */}

                <section className="panel twin-topology-panel">

                    <div className="section-header">

                        <div>

                            <div className="section-eyebrow">
                                INFRASTRUCTURE MAP
                            </div>

                            <h2>
                                Environment Topology
                            </h2>

                            <p>
                                Live representation of the
                                simulated infrastructure.
                            </p>

                        </div>

                        <div className="topology-controls">

                            <button className="topology-control active">
                                <Network size={12} />
                                Topology
                            </button>

                            <button className="topology-control">
                                <Activity size={12} />
                                Traffic
                            </button>

                            <button className="topology-control">
                                <Shield size={12} />
                                Security
                            </button>

                        </div>

                    </div>

                    <div className="topology-canvas">

                        {/* GRID */}

                        <div className="topology-grid-background" />

                        {/* CONNECTIONS */}

                        <svg
                            className="topology-connections"
                            viewBox="0 0 1000 500"
                            preserveAspectRatio="none"
                        >

                            <line
                                x1="80"
                                y1="250"
                                x2="270"
                                y2="250"
                                className="connection-line"
                            />

                            <line
                                x1="270"
                                y1="250"
                                x2="480"
                                y2="150"
                                className="connection-line"
                            />

                            <line
                                x1="270"
                                y1="250"
                                x2="480"
                                y2="350"
                                className="connection-line"
                            />

                            <line
                                x1="480"
                                y1="150"
                                x2="720"
                                y2="250"
                                className="connection-line"
                            />

                            <line
                                x1="480"
                                y1="350"
                                x2="720"
                                y2="250"
                                className="connection-line"
                            />

                            <line
                                x1="720"
                                y1="250"
                                x2="900"
                                y2="250"
                                className="connection-line"
                            />

                            <circle
                                cx="350"
                                cy="208"
                                r="4"
                                className="traffic-dot"
                            />

                            <circle
                                cx="590"
                                cy="202"
                                r="4"
                                className="traffic-dot"
                            />

                            <circle
                                cx="805"
                                cy="250"
                                r="4"
                                className="traffic-dot"
                            />

                        </svg>

                        {/* NODES */}

                        {nodes.map((node) => {

                            const Icon = node.icon;

                            const isSelected =
                                selectedNode === node.id;

                            return (
                                <button
                                    key={node.id}
                                    className={`twin-node ${isSelected
                                            ? "selected"
                                            : ""
                                        } ${node.status}`}
                                    style={{
                                        left: node.x,
                                        top: node.y,
                                    }}
                                    onClick={() =>
                                        setSelectedNode(node.id)
                                    }
                                >

                                    <div className="twin-node-icon">

                                        <Icon size={17} />

                                        <span
                                            className={`node-status ${node.status
                                                }`}
                                        />

                                    </div>

                                    <strong>
                                        {node.name}
                                    </strong>

                                    <span>
                                        {node.type}
                                    </span>

                                </button>
                            );
                        })}

                        {/* LEGEND */}

                        <div className="topology-legend">

                            <span>
                                <i className="legend-dot green" />
                                Online
                            </span>

                            <span>
                                <i className="legend-dot yellow" />
                                Warning
                            </span>

                            <span>
                                <i className="legend-dot red" />
                                Critical
                            </span>

                        </div>

                    </div>

                </section>

                {/* =================================================
            NODE DETAILS
        ================================================== */}

                <section className="panel node-details-panel">

                    <div className="section-header">

                        <div>

                            <div className="section-eyebrow">
                                NODE INSPECTOR
                            </div>

                            <h2>
                                Selected Node
                            </h2>

                        </div>

                        <button className="icon-button">
                            <MoreHorizontal size={16} />
                        </button>

                    </div>

                    <div className="selected-node-header">

                        <div className="selected-node-icon">

                            <selected.icon size={22} />

                        </div>

                        <div>

                            <strong>
                                {selected.name}
                            </strong>

                            <span>
                                {selected.type} node
                            </span>

                        </div>

                        <span className="node-online-badge">

                            <span />

                            {selected.status === "warning"
                                ? "WARNING"
                                : "ONLINE"}

                        </span>

                    </div>

                    <div className="node-health">

                        <div className="node-health-heading">

                            <span>
                                NODE HEALTH
                            </span>

                            <strong>
                                {selected.status === "warning"
                                    ? "78%"
                                    : "97%"}
                            </strong>

                        </div>

                        <div className="health-track">

                            <div
                                className={
                                    selected.status === "warning"
                                        ? "warning"
                                        : ""
                                }
                                style={{
                                    width:
                                        selected.status === "warning"
                                            ? "78%"
                                            : "97%",
                                }}
                            />

                        </div>

                    </div>

                    <div className="node-properties">

                        <div>
                            <span>NODE ID</span>
                            <strong>
                                {selected.id.toUpperCase()}-01
                            </strong>
                        </div>

                        <div>
                            <span>IP ADDRESS</span>
                            <strong>
                                10.20.4.18
                            </strong>
                        </div>

                        <div>
                            <span>OS / PLATFORM</span>
                            <strong>
                                Linux x86_64
                            </strong>
                        </div>

                        <div>
                            <span>UPTIME</span>
                            <strong>
                                14d 08h 32m
                            </strong>
                        </div>

                        <div>
                            <span>CPU</span>
                            <strong>
                                42%
                            </strong>
                        </div>

                        <div>
                            <span>MEMORY</span>
                            <strong>
                                61%
                            </strong>
                        </div>

                    </div>

                    <div className="node-actions">

                        <button className="secondary-button">

                            <Terminal size={13} />

                            Terminal

                        </button>

                        <button className="secondary-button">

                            <Settings2 size={13} />

                            Configure

                        </button>

                    </div>

                </section>

            </div>

            {/* =====================================================
          LOWER GRID
      ====================================================== */}

            <div className="twin-lower-grid">

                {/* NETWORK SEGMENTS */}

                <section className="panel">

                    <div className="section-header">

                        <div>

                            <div className="section-eyebrow">
                                NETWORK
                            </div>

                            <h2>
                                Network Segments
                            </h2>

                        </div>

                        <button className="icon-button">
                            <MoreHorizontal size={16} />
                        </button>

                    </div>

                    <div className="network-segments">

                        <div className="network-segment">

                            <div className="network-segment-icon public">
                                <Globe size={14} />
                            </div>

                            <div>

                                <strong>
                                    Public Network
                                </strong>

                                <span>
                                    10.10.0.0/24
                                </span>

                            </div>

                            <div className="network-segment-stat">
                                <b>08</b>
                                <span>hosts</span>
                            </div>

                            <span className="segment-status">
                                HEALTHY
                            </span>

                        </div>

                        <div className="network-segment">

                            <div className="network-segment-icon private">
                                <LockKeyhole size={14} />
                            </div>

                            <div>

                                <strong>
                                    Application Network
                                </strong>

                                <span>
                                    10.20.0.0/24
                                </span>

                            </div>

                            <div className="network-segment-stat">
                                <b>17</b>
                                <span>hosts</span>
                            </div>

                            <span className="segment-status">
                                HEALTHY
                            </span>

                        </div>

                        <div className="network-segment">

                            <div className="network-segment-icon database">
                                <Database size={14} />
                            </div>

                            <div>

                                <strong>
                                    Database Network
                                </strong>

                                <span>
                                    10.30.0.0/24
                                </span>

                            </div>

                            <div className="network-segment-stat">
                                <b>06</b>
                                <span>hosts</span>
                            </div>

                            <span className="segment-status warning">
                                REVIEW
                            </span>

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
                                Telemetry Streams
                            </h2>

                        </div>

                        <div className="telemetry-live">
                            <span />
                            LIVE
                        </div>

                    </div>

                    <div className="telemetry-list">

                        <div className="telemetry-row">

                            <div className="telemetry-icon green">
                                <Activity size={14} />
                            </div>

                            <div>
                                <strong>
                                    Network Traffic
                                </strong>
                                <span>
                                    4.8 GB / min
                                </span>
                            </div>

                            <div className="telemetry-chart">
                                <span style={{ height: "40%" }} />
                                <span style={{ height: "65%" }} />
                                <span style={{ height: "50%" }} />
                                <span style={{ height: "80%" }} />
                                <span style={{ height: "60%" }} />
                                <span style={{ height: "90%" }} />
                                <span style={{ height: "70%" }} />
                                <span style={{ height: "100%" }} />
                            </div>

                        </div>

                        <div className="telemetry-row">

                            <div className="telemetry-icon blue">
                                <Cpu size={14} />
                            </div>

                            <div>
                                <strong>
                                    Host Metrics
                                </strong>
                                <span>
                                    14 / 14 reporting
                                </span>
                            </div>

                            <div className="telemetry-value green">
                                100%
                            </div>

                        </div>

                        <div className="telemetry-row">

                            <div className="telemetry-icon purple">
                                <Terminal size={14} />
                            </div>

                            <div>
                                <strong>
                                    Application Logs
                                </strong>
                                <span>
                                    1,284 events/min
                                </span>
                            </div>

                            <div className="telemetry-value">
                                98.2%
                            </div>

                        </div>

                    </div>

                </section>

                {/* TWIN HEALTH */}

                <section className="panel">

                    <div className="section-header">

                        <div>

                            <div className="section-eyebrow">
                                SYSTEM HEALTH
                            </div>

                            <h2>
                                Twin Health
                            </h2>

                        </div>

                        <button className="icon-button">
                            <MoreHorizontal size={16} />
                        </button>

                    </div>

                    <div className="twin-health-score">

                        <div className="health-ring">

                            <div>

                                <strong>
                                    94
                                </strong>

                                <span>
                                    /100
                                </span>

                            </div>

                        </div>

                        <div>

                            <strong>
                                Excellent
                            </strong>

                            <span>
                                Digital Twin is accurately
                                synchronized with the environment.
                            </span>

                        </div>

                    </div>

                    <div className="health-checks">

                        <div>
                            <CheckCircle2 size={13} />
                            Infrastructure sync
                            <b>OK</b>
                        </div>

                        <div>
                            <CheckCircle2 size={13} />
                            Telemetry ingestion
                            <b>OK</b>
                        </div>

                        <div>
                            <AlertTriangle size={13} />
                            Database replication
                            <b className="yellow">WARN</b>
                        </div>

                    </div>

                </section>

            </div>

            {/* =====================================================
          RECENT EVENTS
      ====================================================== */}

            <section className="panel twin-events-panel">

                <div className="section-header">

                    <div>

                        <div className="section-eyebrow">
                            EVENT STREAM
                        </div>

                        <h2>
                            Recent Twin Activity
                        </h2>

                    </div>

                    <button className="icon-text-button">
                        View all events
                        <ArrowUp size={13} />
                    </button>

                </div>

                <div className="twin-events">

                    <div className="twin-event">

                        <div className="event-time">
                            09:42:18
                        </div>

                        <div className="event-dot green" />

                        <div className="event-content">

                            <strong>
                                Environment synchronized
                            </strong>

                            <span>
                                14 hosts and 37 services successfully
                                reconciled with the Digital Twin.
                            </span>

                        </div>

                        <span className="event-source">
                            SYNC ENGINE
                        </span>

                    </div>

                    <div className="twin-event">

                        <div className="event-time">
                            09:40:51
                        </div>

                        <div className="event-dot yellow" />

                        <div className="event-content">

                            <strong>
                                Database replication latency increased
                            </strong>

                            <span>
                                Primary DB replication delay exceeded
                                the normal threshold.
                            </span>

                        </div>

                        <span className="event-source">
                            TELEMETRY
                        </span>

                    </div>

                    <div className="twin-event">

                        <div className="event-time">
                            09:38:04
                        </div>

                        <div className="event-dot blue" />

                        <div className="event-content">

                            <strong>
                                New container detected
                            </strong>

                            <span>
                                Container api-worker-07 added to the
                                application network.
                            </span>

                        </div>

                        <span className="event-source">
                            ORCHESTRATOR
                        </span>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default DigitalTwin;