import {
    Activity,
    BarChart3,
    Bot,
    Box,
    BrainCircuit,
    ChevronDown,
    CircleDot,
    FileText,
    FolderKanban,
    Gauge,
    LayoutDashboard,
    Network,
    Radar,
    Settings,
    ShieldAlert,
    ShieldCheck,
    Skull,
    Target,
    TriangleAlert,
    Waypoints,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {

    const navigation = [
        {
            title: "COMMAND",
            items: [
                {
                    label: "Command Center",
                    path: "/dashboard",
                    icon: LayoutDashboard,
                },
                {
                    label: "Projects",
                    path: "/projects",
                    icon: FolderKanban,
                },
            ],
        },

        {
            title: "OPERATIONS",
            items: [
                {
                    label: "Digital Twins",
                    path: "/digital-twin/main",
                    icon: Box,
                },
                {
                    label: "Simulations",
                    path: "/simulations",
                    icon: Activity,
                },
                {
                    label: "Incidents",
                    path: "/incidents",
                    icon: ShieldAlert,
                    badge: "03",
                },
            ],
        },

        {
            title: "INTELLIGENCE",
            items: [
                {
                    label: "Red Agent",
                    path: "/simulations/sim-024/red",
                    icon: Skull,
                    className: "red-nav",
                },
                {
                    label: "Blue SOC",
                    path: "/simulations/sim-024/blue",
                    icon: ShieldCheck,
                    className: "blue-nav",
                },
                {
                    label: "Purple Analysis",
                    path: "/simulations/sim-024/purple",
                    icon: BrainCircuit,
                    className: "purple-nav",
                },
                {
                    label: "Attack Paths",
                    path: "/simulations/sim-024",
                    icon: Waypoints,
                },
                {
                    label: "MITRE ATT&CK",
                    path: "/mitre",
                    icon: Target,
                },
            ],
        },

        {
            title: "SECURITY",
            items: [
                {
                    label: "Vulnerabilities",
                    path: "/vulnerabilities",
                    icon: TriangleAlert,
                    badge: "09",
                },
                {
                    label: "Security Score",
                    path: "/security-score",
                    icon: Gauge,
                },
                {
                    label: "Reports",
                    path: "/reports",
                    icon: FileText,
                },
            ],
        },
    ];

    return (
        <aside className="sidebar">

            {/* Brand */}
            <div className="sidebar-brand">

                <div className="sidebar-logo">
                    <Radar size={20} />
                </div>

                <div>
                    <div className="sidebar-title">
                        CYBER<span>-</span>TWIN
                    </div>

                    <div className="sidebar-subtitle">
                        SECURITY OPERATIONS
                    </div>
                </div>

            </div>

            {/* Environment */}
            <div className="environment-card">

                <div className="environment-top">
                    <CircleDot size={13} />
                    <span>ACTIVE ENVIRONMENT</span>
                </div>

                <div className="environment-name">
                    E-Commerce / PROD-TWIN
                </div>

                <div className="environment-status">
                    <span className="status-dot online" />
                    Digital Twin Online
                </div>

            </div>

            {/* Navigation */}
            <nav className="sidebar-navigation">

                {navigation.map((group) => (
                    <div
                        className="nav-group"
                        key={group.title}
                    >

                        <div className="nav-group-title">
                            {group.title}
                        </div>

                        {group.items.map((item) => {

                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.label}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `nav-item ${isActive ? "active" : ""
                                        } ${item.className || ""}`
                                    }
                                >

                                    <Icon size={17} />

                                    <span>{item.label}</span>

                                    {item.badge && (
                                        <span className="nav-badge">
                                            {item.badge}
                                        </span>
                                    )}

                                </NavLink>
                            );
                        })}

                    </div>
                ))}

            </nav>

            {/* Bottom */}
            <div className="sidebar-bottom">

                <NavLink
                    to="/settings"
                    className="nav-item"
                >
                    <Settings size={17} />
                    <span>Settings</span>
                </NavLink>

                <div className="sidebar-version">
                    <span>CYBER-TWIN</span>
                    <span>v0.1.0 / LOCAL</span>
                </div>

            </div>

        </aside>
    );
}

export default Sidebar;