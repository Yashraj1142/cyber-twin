import {
    Activity,
    ArrowUpRight,
    Box,
    Calendar,
    ChevronRight,
    Clock3,
    MoreHorizontal,
    Plus,
    Search,
    ShieldCheck,
    SlidersHorizontal,
    Users,
} from "lucide-react";

import { Link } from "react-router-dom";

import RiskBadge from "../../components/ui/RiskBadge";
import ProgressBar from "../../components/ui/ProgressBar";

function Projects() {
    const projects = [
        {
            id: "ecommerce-prod",
            name: "E-Commerce Platform",
            code: "PROD-TWIN-001",
            description:
                "Production-grade digital twin for the primary e-commerce application.",
            status: "Active",
            score: 91,
            vulnerabilities: 9,
            critical: 1,
            simulations: 24,
            lastSimulation: "12 min ago",
            environment: "Production",
            team: 8,
            color: "cyan",
        },
        {
            id: "banking-api",
            name: "Banking API",
            code: "BANK-TWIN-004",
            description:
                "API security environment for transaction and authentication services.",
            status: "Active",
            score: 84,
            vulnerabilities: 14,
            critical: 3,
            simulations: 18,
            lastSimulation: "1 hr ago",
            environment: "Staging",
            team: 5,
            color: "blue",
        },
        {
            id: "healthcare-core",
            name: "Healthcare Core",
            code: "HEALTH-TWIN-002",
            description:
                "Isolated healthcare service environment for security validation.",
            status: "Paused",
            score: 76,
            vulnerabilities: 21,
            critical: 5,
            simulations: 11,
            lastSimulation: "Yesterday",
            environment: "Development",
            team: 6,
            color: "purple",
        },
    ];

    return (
        <div className="page-wrapper animate-fade">

            {/* HEADER */}

            <div className="page-heading-row">

                <div>
                    <div className="page-eyebrow">
                        SECURITY OPERATIONS / PROJECTS
                    </div>

                    <h1>Projects</h1>

                    <p>
                        Manage your applications, Digital Twins and
                        security simulation environments.
                    </p>
                </div>

                <div className="heading-actions">

                    <button className="secondary-button">
                        <SlidersHorizontal size={14} />
                        Filters
                    </button>

                    <button className="primary-button">
                        <Plus size={14} />
                        New Project
                    </button>

                </div>

            </div>

            {/* OVERVIEW STRIP */}

            <div className="project-overview-strip">

                <div className="project-overview-item">
                    <span>ACTIVE PROJECTS</span>
                    <strong>02</strong>
                </div>

                <div className="project-overview-item">
                    <span>DIGITAL TWINS</span>
                    <strong>03</strong>
                </div>

                <div className="project-overview-item">
                    <span>RUNNING SIMULATIONS</span>
                    <strong className="cyan">01</strong>
                </div>

                <div className="project-overview-item">
                    <span>OPEN FINDINGS</span>
                    <strong className="red">44</strong>
                </div>

                <div className="project-overview-item">
                    <span>AVG. SECURITY SCORE</span>
                    <strong className="green">84</strong>
                </div>

            </div>

            {/* SEARCH */}

            <div className="projects-toolbar">

                <div className="project-search">

                    <Search size={15} />

                    <input
                        type="text"
                        placeholder="Search projects..."
                    />

                    <kbd>⌘ K</kbd>

                </div>

                <div className="project-filter">
                    <span>All environments</span>
                    <ChevronRight size={13} />
                </div>

                <div className="project-filter">
                    <span>All statuses</span>
                    <ChevronRight size={13} />
                </div>

            </div>

            {/* PROJECT GRID */}

            <div className="projects-grid">

                {projects.map((project) => (

                    <article
                        className="project-card"
                        key={project.id}
                    >

                        <div className={`project-card-top ${project.color}`}>

                            <div className="project-icon">
                                <Box size={20} />
                            </div>

                            <div className="project-status">
                                <span className="status-dot online" />
                                {project.status}
                            </div>

                            <button className="project-more">
                                <MoreHorizontal size={17} />
                            </button>

                        </div>

                        <div className="project-card-body">

                            <div className="project-code">
                                {project.code}
                            </div>

                            <h2>{project.name}</h2>

                            <p>
                                {project.description}
                            </p>

                            <div className="project-environment">

                                <span>
                                    <Activity size={12} />
                                    {project.environment}
                                </span>

                                <span>
                                    <Users size={12} />
                                    {project.team} members
                                </span>

                            </div>

                            <div className="project-score">

                                <div>
                                    <span>SECURITY SCORE</span>
                                    <strong>{project.score}/100</strong>
                                </div>

                                <ProgressBar
                                    value={project.score}
                                    type={
                                        project.score >= 90
                                            ? "cyan"
                                            : project.score >= 80
                                                ? "blue"
                                                : "purple"
                                    }
                                />

                            </div>

                            <div className="project-stats">

                                <div>
                                    <span>VULNERABILITIES</span>
                                    <strong>
                                        {project.vulnerabilities}
                                    </strong>
                                </div>

                                <div>
                                    <span>CRITICAL</span>
                                    <strong className="red">
                                        {project.critical}
                                    </strong>
                                </div>

                                <div>
                                    <span>SIMULATIONS</span>
                                    <strong>
                                        {project.simulations}
                                    </strong>
                                </div>

                            </div>

                        </div>

                        <div className="project-card-footer">

                            <div className="project-last-run">
                                <Clock3 size={12} />
                                Last simulation {project.lastSimulation}
                            </div>

                            <Link
                                to={`/projects/${project.id}`}
                                className="project-open"
                            >
                                Open
                                <ArrowUpRight size={13} />
                            </Link>

                        </div>

                    </article>

                ))}

                {/* CREATE PROJECT */}

                <button className="new-project-card">

                    <div className="new-project-icon">
                        <Plus size={22} />
                    </div>

                    <strong>
                        Create a new project
                    </strong>

                    <span>
                        Initialize a Digital Twin security environment.
                    </span>

                </button>

            </div>

            {/* RECENT ACTIVITY */}

            <section className="panel projects-activity">

                <div className="section-header">

                    <div>
                        <div className="section-eyebrow">
                            RECENT ACTIVITY
                        </div>

                        <h2>
                            Project Operations
                        </h2>
                    </div>

                    <button className="icon-text-button">
                        View activity
                        <ArrowUpRight size={13} />
                    </button>

                </div>

                <div className="project-activity-list">

                    <div className="project-activity-row">

                        <div className="activity-icon green">
                            <ShieldCheck size={14} />
                        </div>

                        <div>
                            <strong>
                                Security score improved
                            </strong>

                            <span>
                                E-Commerce Platform · 12 minutes ago
                            </span>
                        </div>

                        <b className="green">+7</b>

                    </div>

                    <div className="project-activity-row">

                        <div className="activity-icon red">
                            <Activity size={14} />
                        </div>

                        <div>
                            <strong>
                                Simulation completed
                            </strong>

                            <span>
                                Banking API · 1 hour ago
                            </span>
                        </div>

                        <b>SIM-023</b>

                    </div>

                    <div className="project-activity-row">

                        <div className="activity-icon purple">
                            <Box size={14} />
                        </div>

                        <div>
                            <strong>
                                Digital Twin updated
                            </strong>

                            <span>
                                Healthcare Core · Yesterday
                            </span>
                        </div>

                        <RiskBadge level="Medium" />

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Projects;