import {
    Activity,
    ArrowUpRight,
    Bot,
    BrainCircuit,
    Clock3,
    ShieldAlert,
    ShieldCheck,
    Skull,
    Target,
    TrendingUp,
    Zap,
} from "lucide-react";

import StatCard from "../../components/common/StatCard";
import AgentBadge from "../../components/common/AgentBadge";
import SectionHeader from "../../components/common/SectionHeader";
import ProgressBar from "../../components/ui/ProgressBar";
import RiskBadge from "../../components/ui/RiskBadge";

function Dashboard() {

    const events = [
        {
            time: "09:42:51",
            agent: "purple",
            text: "Detection gap identified",
            detail: "Privilege Escalation",
        },
        {
            time: "09:42:42",
            agent: "blue",
            text: "Incident created",
            detail: "INC-0241",
        },
        {
            time: "09:42:38",
            agent: "blue",
            text: "Suspicious request detected",
            detail: "POST /admin/export",
        },
        {
            time: "09:42:31",
            agent: "red",
            text: "Attack path generated",
            detail: "Path #07",
        },
        {
            time: "09:42:17",
            agent: "red",
            text: "Endpoint discovered",
            detail: "/api/admin",
        },
    ];

    return (
        <div className="dashboard-page animate-fade">

            <div className="page-heading-row">

                <div>
                    <div className="page-eyebrow">
                        SECURITY OPERATIONS / OVERVIEW
                    </div>

                    <h1>Command Center</h1>

                    <p>
                        Real-time overview of your CYBER-TWIN
                        security environment.
                    </p>
                </div>

                <div className="heading-actions">

                    <button className="secondary-button">
                        <Clock3 size={14} />
                        Last 24 hours
                    </button>

                    <button className="primary-button">
                        <Zap size={14} />
                        Start Simulation
                    </button>

                </div>

            </div>

            {/* Stats */}

            <div className="stats-grid">

                <StatCard
                    label="SECURITY SCORE"
                    value="91"
                    description="Excellent posture"
                    trend="+43%"
                    icon={ShieldCheck}
                />

                <StatCard
                    label="ATTACK SUCCESS"
                    value="21%"
                    description="Target compromise"
                    trend="-57%"
                    trendType="down"
                    icon={Skull}
                />

                <StatCard
                    label="DETECTION COVERAGE"
                    value="89%"
                    description="Techniques detected"
                    trend="+47%"
                    icon={Target}
                />

                <StatCard
                    label="ACTIVE INCIDENTS"
                    value="03"
                    description="1 requires attention"
                    trend="2 new"
                    icon={ShieldAlert}
                />

            </div>

            {/* Main grid */}

            <div className="dashboard-main-grid">

                {/* Security loop */}

                <section className="panel simulation-panel">

                    <SectionHeader
                        eyebrow="LIVE SIMULATION"
                        title="Attack → Defend → Evaluate"
                        description="Simulation #SIM-024 is currently active."
                        action={
                            <span className="live-pill">
                                <span className="status-dot online" />
                                LIVE
                            </span>
                        }
                    />

                    <div className="agent-flow">

                        <div className="flow-agent red-flow">

                            <div className="flow-agent-icon">
                                <Skull size={23} />
                            </div>

                            <AgentBadge type="red" />

                            <strong>Attack Path Found</strong>

                            <span>
                                Objective: Sensitive Data
                            </span>

                            <div className="flow-progress">
                                <ProgressBar
                                    value={76}
                                    type="red"
                                />
                                <small>76% success probability</small>
                            </div>

                        </div>

                        <div className="flow-arrow">
                            →
                        </div>

                        <div className="flow-agent blue-flow">

                            <div className="flow-agent-icon">
                                <ShieldCheck size={23} />
                            </div>

                            <AgentBadge type="blue" />

                            <strong>Threat Detected</strong>

                            <span>
                                Incident #INC-0241
                            </span>

                            <div className="flow-progress">
                                <ProgressBar
                                    value={89}
                                    type="blue"
                                />
                                <small>89% detection coverage</small>
                            </div>

                        </div>

                        <div className="flow-arrow">
                            →
                        </div>

                        <div className="flow-agent purple-flow">

                            <div className="flow-agent-icon">
                                <BrainCircuit size={23} />
                            </div>

                            <AgentBadge type="purple" />

                            <strong>Gap Identified</strong>

                            <span>
                                Privilege Escalation
                            </span>

                            <div className="flow-progress">
                                <ProgressBar
                                    value={71}
                                    type="purple"
                                />
                                <small>71% coverage</small>
                            </div>

                        </div>

                    </div>

                </section>

                {/* Security score */}

                <section className="panel score-panel">

                    <SectionHeader
                        eyebrow="POSTURE"
                        title="Security Score"
                    />

                    <div className="score-circle">

                        <div>
                            <strong>91</strong>
                            <span>/100</span>
                        </div>

                    </div>

                    <div className="score-label">
                        <span className="status-dot online" />
                        Strong security posture
                    </div>

                    <div className="score-bars">

                        <div>
                            <span>Detection</span>
                            <strong>92%</strong>
                        </div>

                        <ProgressBar value={92} />

                        <div>
                            <span>Response</span>
                            <strong>86%</strong>
                        </div>

                        <ProgressBar value={86} type="blue" />

                        <div>
                            <span>Resistance</span>
                            <strong>88%</strong>
                        </div>

                        <ProgressBar value={88} type="purple" />

                    </div>

                </section>

            </div>

            {/* Lower section */}

            <div className="dashboard-lower-grid">

                {/* Live events */}

                <section className="panel">

                    <SectionHeader
                        eyebrow="EVENT STREAM"
                        title="Live Security Activity"
                        action={
                            <button className="icon-text-button">
                                View all
                                <ArrowUpRight size={13} />
                            </button>
                        }
                    />

                    <div className="event-list">

                        {events.map((event) => (

                            <div
                                className="event-row"
                                key={event.time}
                            >

                                <span className="event-time">
                                    {event.time}
                                </span>

                                <div className={`event-agent ${event.agent}`} />

                                <div className="event-content">

                                    <strong>
                                        {event.text}
                                    </strong>

                                    <span>
                                        {event.detail}
                                    </span>

                                </div>

                                <ArrowUpRight
                                    size={13}
                                    className="event-arrow"
                                />

                            </div>

                        ))}

                    </div>

                </section>

                {/* Risk */}

                <section className="panel">

                    <SectionHeader
                        eyebrow="ATTENTION"
                        title="Critical Findings"
                    />

                    <div className="finding-list">

                        <div className="finding-row">

                            <div className="finding-icon critical">
                                <ShieldAlert size={15} />
                            </div>

                            <div>
                                <strong>
                                    Privilege escalation
                                </strong>

                                <span>
                                    Detection gap / T1068
                                </span>
                            </div>

                            <RiskBadge level="Critical" />

                        </div>

                        <div className="finding-row">

                            <div className="finding-icon high">
                                <Activity size={15} />
                            </div>

                            <div>
                                <strong>
                                    Sensitive data access
                                </strong>

                                <span>
                                    Weak telemetry coverage
                                </span>
                            </div>

                            <RiskBadge level="High" />

                        </div>

                        <div className="finding-row">

                            <div className="finding-icon medium">
                                <Bot size={15} />
                            </div>

                            <div>
                                <strong>
                                    Authentication anomaly
                                </strong>

                                <span>
                                    Multiple failed attempts
                                </span>
                            </div>

                            <RiskBadge level="Medium" />

                        </div>

                    </div>

                </section>

            </div>

        </div>
    );
}

export default Dashboard;