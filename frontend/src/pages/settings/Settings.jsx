import { useState } from "react";
import {
    Bell,
    CheckCircle2,
    ChevronRight,
    Database,
    Eye,
    KeyRound,
    Lock,
    Monitor,
    Moon,
    Palette,
    Save,
    Server,
    Shield,
    SlidersHorizontal,
    User,
    Zap,
} from "lucide-react";

const settingSections = [
    {
        id: "profile",
        label: "Profile",
        icon: User,
    },
    {
        id: "appearance",
        label: "Appearance",
        icon: Palette,
    },
    {
        id: "simulation",
        label: "Simulation",
        icon: Zap,
    },
    {
        id: "notifications",
        label: "Notifications",
        icon: Bell,
    },
    {
        id: "environment",
        label: "Environment",
        icon: Server,
    },
    {
        id: "security",
        label: "Security",
        icon: Shield,
    },
];

export default function Settings() {
    const [activeSection, setActiveSection] = useState("profile");

    const [profile, setProfile] = useState({
        name: "Cyber-Twin Operator",
        email: "operator@cybertwin.local",
        role: "Security Analyst",
        organization: "Cyber-Twin Lab",
    });

    const [appearance, setAppearance] = useState({
        compactMode: true,
        animations: true,
        gridLines: true,
        darkMode: true,
    });

    const [simulation, setSimulation] = useState({
        autoSave: true,
        safeMode: true,
        telemetry: true,
        autoCleanup: false,
    });

    const [notifications, setNotifications] = useState({
        critical: true,
        simulation: true,
        incidents: true,
        reports: false,
    });

    const [environment, setEnvironment] = useState({
        environmentName: "Cyber-Twin Enterprise Lab",
        region: "IN-NORTH-01",
        maxConcurrent: "05",
        retention: "30 Days",
    });

    const [saved, setSaved] = useState(false);

    const updateToggle = (setter, key) => {
        setter((current) => ({
            ...current,
            [key]: !current[key],
        }));
    };

    const handleSave = () => {
        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 2200);
    };

    return (
        <div className="page-wrapper settings-page">
            <div className="settings-header animate-fade">
                <div>
                    <div className="page-eyebrow">
                        <SlidersHorizontal size={14} />
                        SYSTEM CONFIGURATION
                    </div>

                    <h1>Settings</h1>

                    <p>
                        Configure your Cyber-Twin environment, simulation behavior,
                        security preferences and operator profile.
                    </p>
                </div>

                <button className="primary-button" onClick={handleSave}>
                    <Save size={15} />
                    Save Changes
                </button>
            </div>

            <div className="settings-layout animate-fade">
                {/* Sidebar */}
                <aside className="panel settings-sidebar">
                    <div className="settings-sidebar-title">
                        <span>CONFIGURATION</span>
                        <small>CYBER-TWIN v1.0</small>
                    </div>

                    <div className="settings-nav">
                        {settingSections.map((section) => {
                            const Icon = section.icon;

                            return (
                                <button
                                    key={section.id}
                                    className={`settings-nav-item ${activeSection === section.id ? "active" : ""
                                        }`}
                                    onClick={() => setActiveSection(section.id)}
                                >
                                    <Icon size={15} />

                                    <span>{section.label}</span>

                                    <ChevronRight size={13} />
                                </button>
                            );
                        })}
                    </div>

                    <div className="settings-sidebar-status">
                        <div>
                            <span className="settings-status-dot" />
                            SYSTEM ONLINE
                        </div>

                        <small>Configuration sync enabled</small>
                    </div>
                </aside>

                {/* Content */}
                <main className="settings-content">
                    {/* Profile */}
                    {activeSection === "profile" && (
                        <section className="panel settings-panel">
                            <div className="settings-section-heading">
                                <div className="settings-heading-icon cyan">
                                    <User size={18} />
                                </div>

                                <div>
                                    <div className="section-eyebrow">OPERATOR PROFILE</div>
                                    <h2>Account Information</h2>
                                    <p>
                                        Manage the identity and role associated with this
                                        Cyber-Twin workspace.
                                    </p>
                                </div>
                            </div>

                            <div className="settings-profile-banner">
                                <div className="settings-avatar">
                                    <User size={24} />
                                </div>

                                <div>
                                    <strong>{profile.name}</strong>
                                    <span>{profile.role}</span>
                                </div>

                                <div className="settings-profile-status">
                                    <span />
                                    ACTIVE
                                </div>
                            </div>

                            <div className="settings-form-grid">
                                <label>
                                    <span>DISPLAY NAME</span>

                                    <input
                                        value={profile.name}
                                        onChange={(event) =>
                                            setProfile({
                                                ...profile,
                                                name: event.target.value,
                                            })
                                        }
                                    />
                                </label>

                                <label>
                                    <span>EMAIL ADDRESS</span>

                                    <input
                                        value={profile.email}
                                        onChange={(event) =>
                                            setProfile({
                                                ...profile,
                                                email: event.target.value,
                                            })
                                        }
                                    />
                                </label>

                                <label>
                                    <span>ROLE</span>

                                    <input value={profile.role} readOnly />
                                </label>

                                <label>
                                    <span>ORGANIZATION</span>

                                    <input
                                        value={profile.organization}
                                        onChange={(event) =>
                                            setProfile({
                                                ...profile,
                                                organization: event.target.value,
                                            })
                                        }
                                    />
                                </label>
                            </div>

                            <div className="settings-info-box">
                                <CheckCircle2 size={15} />

                                <div>
                                    <strong>Operator verification active</strong>
                                    <span>
                                        Your account is authorized to access simulation,
                                        investigation and reporting modules.
                                    </span>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Appearance */}
                    {activeSection === "appearance" && (
                        <section className="panel settings-panel">
                            <div className="settings-section-heading">
                                <div className="settings-heading-icon purple">
                                    <Palette size={18} />
                                </div>

                                <div>
                                    <div className="section-eyebrow">INTERFACE</div>
                                    <h2>Appearance</h2>
                                    <p>
                                        Customize the Cyber-Twin dashboard experience.
                                    </p>
                                </div>
                            </div>

                            <div className="settings-theme-card">
                                <div className="settings-theme-preview">
                                    <div className="theme-preview-top" />
                                    <div className="theme-preview-body">
                                        <div />
                                        <div />
                                        <div />
                                    </div>
                                </div>

                                <div>
                                    <span>ACTIVE THEME</span>
                                    <strong>Cyber Dark</strong>
                                    <small>Optimized for security operations.</small>
                                </div>

                                <div className="settings-theme-active">
                                    <CheckCircle2 size={14} />
                                    ACTIVE
                                </div>
                            </div>

                            <div className="settings-option-list">
                                <SettingToggle
                                    icon={Moon}
                                    title="Dark Mode"
                                    description="Use the dark cybersecurity interface."
                                    value={appearance.darkMode}
                                    onChange={() =>
                                        updateToggle(setAppearance, "darkMode")
                                    }
                                />

                                <SettingToggle
                                    icon={Monitor}
                                    title="Compact Mode"
                                    description="Reduce spacing to display more operational data."
                                    value={appearance.compactMode}
                                    onChange={() =>
                                        updateToggle(setAppearance, "compactMode")
                                    }
                                />

                                <SettingToggle
                                    icon={Zap}
                                    title="Interface Animations"
                                    description="Enable subtle dashboard transitions and motion."
                                    value={appearance.animations}
                                    onChange={() =>
                                        updateToggle(setAppearance, "animations")
                                    }
                                />

                                <SettingToggle
                                    icon={Eye}
                                    title="Grid Lines"
                                    description="Display technical grid overlays throughout the UI."
                                    value={appearance.gridLines}
                                    onChange={() =>
                                        updateToggle(setAppearance, "gridLines")
                                    }
                                />
                            </div>
                        </section>
                    )}

                    {/* Simulation */}
                    {activeSection === "simulation" && (
                        <section className="panel settings-panel">
                            <div className="settings-section-heading">
                                <div className="settings-heading-icon yellow">
                                    <Zap size={18} />
                                </div>

                                <div>
                                    <div className="section-eyebrow">SIMULATION ENGINE</div>
                                    <h2>Simulation Preferences</h2>
                                    <p>
                                        Control how Cyber-Twin simulations store state,
                                        telemetry and temporary resources.
                                    </p>
                                </div>
                            </div>

                            <div className="settings-warning">
                                <Shield size={16} />

                                <div>
                                    <strong>Safe simulation mode is enabled</strong>
                                    <span>
                                        Simulations are isolated from production infrastructure.
                                    </span>
                                </div>
                            </div>

                            <div className="settings-option-list">
                                <SettingToggle
                                    icon={Save}
                                    title="Automatic Save"
                                    description="Automatically save simulation state and results."
                                    value={simulation.autoSave}
                                    onChange={() =>
                                        updateToggle(setSimulation, "autoSave")
                                    }
                                />

                                <SettingToggle
                                    icon={Shield}
                                    title="Safe Mode"
                                    description="Restrict simulations to the isolated Cyber-Twin environment."
                                    value={simulation.safeMode}
                                    onChange={() =>
                                        updateToggle(setSimulation, "safeMode")
                                    }
                                    locked
                                />

                                <SettingToggle
                                    icon={ActivityIcon}
                                    title="Telemetry Collection"
                                    description="Collect simulation events for Blue and Purple analysis."
                                    value={simulation.telemetry}
                                    onChange={() =>
                                        updateToggle(setSimulation, "telemetry")
                                    }
                                />

                                <SettingToggle
                                    icon={Database}
                                    title="Automatic Cleanup"
                                    description="Remove temporary simulation artifacts after completion."
                                    value={simulation.autoCleanup}
                                    onChange={() =>
                                        updateToggle(setSimulation, "autoCleanup")
                                    }
                                />
                            </div>
                        </section>
                    )}

                    {/* Notifications */}
                    {activeSection === "notifications" && (
                        <section className="panel settings-panel">
                            <div className="settings-section-heading">
                                <div className="settings-heading-icon cyan">
                                    <Bell size={18} />
                                </div>

                                <div>
                                    <div className="section-eyebrow">ALERTING</div>
                                    <h2>Notifications</h2>
                                    <p>
                                        Choose which Cyber-Twin events should generate operator
                                        notifications.
                                    </p>
                                </div>
                            </div>

                            <div className="settings-notification-summary">
                                <div>
                                    <Bell size={17} />
                                </div>

                                <span>
                                    <strong>Notification Center</strong>
                                    <small>
                                        {Object.values(notifications).filter(Boolean).length} of{" "}
                                        {Object.keys(notifications).length} channels enabled
                                    </small>
                                </span>
                            </div>

                            <div className="settings-option-list">
                                <SettingToggle
                                    icon={Shield}
                                    title="Critical Security Alerts"
                                    description="Notify when critical security events are detected."
                                    value={notifications.critical}
                                    onChange={() =>
                                        updateToggle(setNotifications, "critical")
                                    }
                                />

                                <SettingToggle
                                    icon={Zap}
                                    title="Simulation Events"
                                    description="Notify when simulations start, finish or fail."
                                    value={notifications.simulation}
                                    onChange={() =>
                                        updateToggle(setNotifications, "simulation")
                                    }
                                />

                                <SettingToggle
                                    icon={Bell}
                                    title="Incident Alerts"
                                    description="Notify when incidents require analyst attention."
                                    value={notifications.incidents}
                                    onChange={() =>
                                        updateToggle(setNotifications, "incidents")
                                    }
                                />

                                <SettingToggle
                                    icon={FileIcon}
                                    title="Report Generation"
                                    description="Notify when a requested report becomes available."
                                    value={notifications.reports}
                                    onChange={() =>
                                        updateToggle(setNotifications, "reports")
                                    }
                                />
                            </div>
                        </section>
                    )}

                    {/* Environment */}
                    {activeSection === "environment" && (
                        <section className="panel settings-panel">
                            <div className="settings-section-heading">
                                <div className="settings-heading-icon green">
                                    <Server size={18} />
                                </div>

                                <div>
                                    <div className="section-eyebrow">LAB ENVIRONMENT</div>
                                    <h2>Environment Configuration</h2>
                                    <p>
                                        Configure the logical environment used by the Cyber-Twin
                                        simulation engine.
                                    </p>
                                </div>
                            </div>

                            <div className="settings-environment-status">
                                <div className="settings-environment-icon">
                                    <Server size={19} />
                                </div>

                                <div>
                                    <strong>Environment Operational</strong>
                                    <span>
                                        Digital Twin infrastructure is available.
                                    </span>
                                </div>

                                <span className="settings-online-badge">
                                    ONLINE
                                </span>
                            </div>

                            <div className="settings-form-grid">
                                <label>
                                    <span>ENVIRONMENT NAME</span>

                                    <input
                                        value={environment.environmentName}
                                        onChange={(event) =>
                                            setEnvironment({
                                                ...environment,
                                                environmentName: event.target.value,
                                            })
                                        }
                                    />
                                </label>

                                <label>
                                    <span>REGION</span>

                                    <input
                                        value={environment.region}
                                        onChange={(event) =>
                                            setEnvironment({
                                                ...environment,
                                                region: event.target.value,
                                            })
                                        }
                                    />
                                </label>

                                <label>
                                    <span>MAX CONCURRENT SIMULATIONS</span>

                                    <select
                                        value={environment.maxConcurrent}
                                        onChange={(event) =>
                                            setEnvironment({
                                                ...environment,
                                                maxConcurrent: event.target.value,
                                            })
                                        }
                                    >
                                        <option>01</option>
                                        <option>03</option>
                                        <option>05</option>
                                        <option>10</option>
                                    </select>
                                </label>

                                <label>
                                    <span>DATA RETENTION</span>

                                    <select
                                        value={environment.retention}
                                        onChange={(event) =>
                                            setEnvironment({
                                                ...environment,
                                                retention: event.target.value,
                                            })
                                        }
                                    >
                                        <option>07 Days</option>
                                        <option>30 Days</option>
                                        <option>90 Days</option>
                                        <option>180 Days</option>
                                    </select>
                                </label>
                            </div>

                            <div className="settings-environment-metrics">
                                <div>
                                    <Database size={15} />
                                    <span>DATABASE</span>
                                    <strong>CONNECTED</strong>
                                </div>

                                <div>
                                    <Server size={15} />
                                    <span>SIMULATION NODES</span>
                                    <strong>05 / 05</strong>
                                </div>

                                <div>
                                    <ActivityIcon size={15} />
                                    <span>TELEMETRY</span>
                                    <strong>ACTIVE</strong>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Security */}
                    {activeSection === "security" && (
                        <section className="panel settings-panel">
                            <div className="settings-section-heading">
                                <div className="settings-heading-icon red">
                                    <Lock size={18} />
                                </div>

                                <div>
                                    <div className="section-eyebrow">ACCESS CONTROL</div>
                                    <h2>Security Settings</h2>
                                    <p>
                                        Manage authentication and operator security controls.
                                    </p>
                                </div>
                            </div>

                            <div className="settings-security-score">
                                <div className="settings-security-ring">
                                    <strong>94</strong>
                                    <span>/ 100</span>
                                </div>

                                <div>
                                    <strong>Security posture: Strong</strong>
                                    <span>
                                        Your current Cyber-Twin account configuration meets the
                                        recommended security baseline.
                                    </span>
                                </div>
                            </div>

                            <div className="settings-security-list">
                                <SecurityItem
                                    icon={KeyRound}
                                    title="Password"
                                    description="Last changed 18 days ago"
                                    status="SECURE"
                                />

                                <SecurityItem
                                    icon={Shield}
                                    title="Two-Factor Authentication"
                                    description="Additional authentication layer enabled"
                                    status="ENABLED"
                                />

                                <SecurityItem
                                    icon={Monitor}
                                    title="Active Sessions"
                                    description="1 active operator session"
                                    status="1 ACTIVE"
                                />

                                <SecurityItem
                                    icon={Lock}
                                    title="Session Timeout"
                                    description="Automatic lock after inactivity"
                                    status="30 MIN"
                                />
                            </div>

                            <button className="settings-danger-button">
                                <Lock size={14} />
                                Review Access Controls
                            </button>
                        </section>
                    )}
                </main>
            </div>

            {saved && (
                <div className="settings-save-toast">
                    <CheckCircle2 size={15} />
                    Configuration saved successfully
                </div>
            )}

            <div className="settings-footer">
                <span>
                    <Shield size={13} />
                    CYBER-TWIN CONFIGURATION
                </span>

                <span>VERSION 1.0.0</span>

                <span className="green-text">
                    <CheckCircle2 size={12} />
                    SYSTEM READY
                </span>
            </div>
        </div>
    );
}

function SettingToggle({
    icon: Icon,
    title,
    description,
    value,
    onChange,
    locked = false,
}) {
    return (
        <div className="settings-option">
            <div className="settings-option-icon">
                <Icon size={15} />
            </div>

            <div className="settings-option-text">
                <strong>{title}</strong>
                <span>{description}</span>
            </div>

            <button
                className={`settings-toggle ${value ? "active" : ""}`}
                onClick={onChange}
                disabled={locked}
                aria-label={`Toggle ${title}`}
            >
                <span />
            </button>

            {locked && <Lock size={12} className="settings-lock" />}
        </div>
    );
}

function SecurityItem({ icon: Icon, title, description, status }) {
    return (
        <div className="settings-security-item">
            <div className="settings-security-icon">
                <Icon size={15} />
            </div>

            <div>
                <strong>{title}</strong>
                <span>{description}</span>
            </div>

            <span>{status}</span>
        </div>
    );
}

function ActivityIcon(props) {
    return <Activity {...props} />;
}

function FileIcon(props) {
    return <FileText {...props} />;
}

function FileText(props) {
    return <FileIconBase {...props} />;
}

function FileIconBase({ size = 18, ...props }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    );
}