import { useMemo, useState } from "react";
import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    ChevronRight,
    Crosshair,
    Eye,
    Filter,
    GitCompare,
    Layers,
    Lock,
    Network,
    Radar,
    Search,
    Shield,
    Target,
} from "lucide-react";

const techniques = [
    {
        id: "T1595",
        name: "Active Scanning",
        tactic: "Reconnaissance",
        red: 82,
        blue: 74,
        purple: 88,
        status: "covered",
        description:
            "Simulated reconnaissance activity used to identify exposed services and attack surface.",
    },
    {
        id: "T1190",
        name: "Exploit Public-Facing Application",
        tactic: "Initial Access",
        red: 78,
        blue: 61,
        purple: 69,
        status: "gap",
        description:
            "Simulation scenario representing attempts against an exposed application.",
    },
    {
        id: "T1059",
        name: "Command and Scripting Interpreter",
        tactic: "Execution",
        red: 91,
        blue: 86,
        purple: 92,
        status: "covered",
        description:
            "Tracks simulated command execution behavior across monitored endpoints.",
    },
    {
        id: "T1053",
        name: "Scheduled Task/Job",
        tactic: "Persistence",
        red: 73,
        blue: 58,
        purple: 64,
        status: "gap",
        description:
            "Persistence behavior mapped to scheduled execution mechanisms.",
    },
    {
        id: "T1078",
        name: "Valid Accounts",
        tactic: "Defense Evasion",
        red: 68,
        blue: 72,
        purple: 76,
        status: "covered",
        description:
            "Models suspicious use of legitimate credentials within the simulated environment.",
    },
    {
        id: "T1087",
        name: "Account Discovery",
        tactic: "Discovery",
        red: 84,
        blue: 79,
        purple: 87,
        status: "covered",
        description:
            "Simulated discovery of accounts and identity information.",
    },
    {
        id: "T1049",
        name: "System Network Connections Discovery",
        tactic: "Discovery",
        red: 88,
        blue: 69,
        purple: 78,
        status: "partial",
        description:
            "Maps simulated network discovery activity to available detection coverage.",
    },
    {
        id: "T1021",
        name: "Remote Services",
        tactic: "Lateral Movement",
        red: 76,
        blue: 55,
        purple: 63,
        status: "gap",
        description:
            "Represents simulated movement between systems using remote services.",
    },
    {
        id: "T1071",
        name: "Application Layer Protocol",
        tactic: "Command and Control",
        red: 81,
        blue: 77,
        purple: 84,
        status: "covered",
        description:
            "Maps simulated command-and-control communication patterns.",
    },
    {
        id: "T1560",
        name: "Archive Collected Data",
        tactic: "Collection",
        red: 66,
        blue: 63,
        purple: 71,
        status: "partial",
        description:
            "Represents preparation of collected information before simulated transfer.",
    },
    {
        id: "T1041",
        name: "Exfiltration Over C2 Channel",
        tactic: "Exfiltration",
        red: 62,
        blue: 49,
        purple: 57,
        status: "gap",
        description:
            "Maps simulated data-transfer behavior over an established communication channel.",
    },
    {
        id: "T1486",
        name: "Data Encrypted for Impact",
        tactic: "Impact",
        red: 59,
        blue: 82,
        purple: 75,
        status: "covered",
        description:
            "Represents simulated destructive-impact behavior involving data availability.",
    },
];

const tactics = [
    "All",
    "Reconnaissance",
    "Initial Access",
    "Execution",
    "Persistence",
    "Defense Evasion",
    "Discovery",
    "Lateral Movement",
    "Command and Control",
    "Collection",
    "Exfiltration",
    "Impact",
];

const tacticIcons = {
    Reconnaissance: Radar,
    "Initial Access": Target,
    Execution: Activity,
    Persistence: Lock,
    "Defense Evasion": Shield,
    Discovery: Search,
    "Lateral Movement": Network,
    "Command and Control": GitCompare,
    Collection: Layers,
    Exfiltration: Crosshair,
    Impact: AlertTriangle,
};

function getStatusLabel(status) {
    if (status === "covered") return "Covered";
    if (status === "partial") return "Partial";
    return "Detection Gap";
}

function getStatusClass(status) {
    if (status === "covered") return "mitre-status-covered";
    if (status === "partial") return "mitre-status-partial";
    return "mitre-status-gap";
}

export default function MitreAttack() {
    const [selectedTactic, setSelectedTactic] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTechnique, setSelectedTechnique] = useState(techniques[2]);

    const filteredTechniques = useMemo(() => {
        return techniques.filter((technique) => {
            const matchesTactic =
                selectedTactic === "All" || technique.tactic === selectedTactic;

            const query = searchTerm.toLowerCase();

            const matchesSearch =
                technique.id.toLowerCase().includes(query) ||
                technique.name.toLowerCase().includes(query) ||
                technique.tactic.toLowerCase().includes(query);

            return matchesTactic && matchesSearch;
        });
    }, [selectedTactic, searchTerm]);

    const averageCoverage = Math.round(
        techniques.reduce((sum, item) => sum + item.purple, 0) / techniques.length
    );

    const coveredCount = techniques.filter(
        (item) => item.status === "covered"
    ).length;

    const gapCount = techniques.filter((item) => item.status === "gap").length;

    const partialCount = techniques.filter(
        (item) => item.status === "partial"
    ).length;

    return (
        <div className="page-wrapper mitre-page">
            <div className="mitre-header animate-fade">
                <div>
                    <div className="page-eyebrow">
                        <Shield size={14} />
                        ATT&CK FRAMEWORK
                    </div>

                    <h1>MITRE ATT&CK</h1>

                    <p>
                        Map adversary behavior to simulated techniques and measure Red,
                        Blue and Purple team coverage.
                    </p>
                </div>

                <div className="mitre-header-status">
                    <span className="mitre-live-dot" />
                    ENVIRONMENT MAPPED
                </div>
            </div>

            {/* Coverage overview */}
            <section className="mitre-overview-grid animate-fade">
                <div className="panel mitre-score-card">
                    <div className="mitre-card-label">
                        <Shield size={15} />
                        OVERALL ATT&CK COVERAGE
                    </div>

                    <div className="mitre-score-row">
                        <div className="mitre-score">{averageCoverage}%</div>

                        <div className="mitre-score-info">
                            <span>SIMULATION COVERAGE</span>
                            <small>Across mapped enterprise techniques</small>
                        </div>
                    </div>

                    <div className="mitre-progress">
                        <div
                            className="mitre-progress-fill"
                            style={{ width: `${averageCoverage}%` }}
                        />
                    </div>

                    <div className="mitre-score-footer">
                        <span>Target: 85%</span>
                        <span className="green-text">+6.2% this cycle</span>
                    </div>
                </div>

                <div className="panel mitre-stat-card">
                    <span className="mitre-stat-icon green">
                        <CheckCircle2 size={18} />
                    </span>

                    <div>
                        <span>TECHNIQUES COVERED</span>
                        <strong>{coveredCount}</strong>
                        <small>Strong detection coverage</small>
                    </div>
                </div>

                <div className="panel mitre-stat-card">
                    <span className="mitre-stat-icon yellow">
                        <Eye size={18} />
                    </span>

                    <div>
                        <span>PARTIAL COVERAGE</span>
                        <strong>{partialCount}</strong>
                        <small>Requires purple validation</small>
                    </div>
                </div>

                <div className="panel mitre-stat-card">
                    <span className="mitre-stat-icon red">
                        <AlertTriangle size={18} />
                    </span>

                    <div>
                        <span>DETECTION GAPS</span>
                        <strong>{gapCount}</strong>
                        <small>Priority improvement areas</small>
                    </div>
                </div>
            </section>

            {/* Tactics */}
            <section className="panel mitre-tactics-panel animate-fade">
                <div className="section-header">
                    <div>
                        <div className="section-eyebrow">TACTIC COVERAGE</div>
                        <h2>ATT&CK Enterprise Matrix</h2>
                    </div>

                    <span className="mitre-tech-count">
                        {techniques.length} MAPPED TECHNIQUES
                    </span>
                </div>

                <div className="mitre-tactic-grid">
                    {tactics.map((tactic) => {
                        const Icon =
                            tactic === "All" ? Layers : tacticIcons[tactic] || Shield;

                        const count =
                            tactic === "All"
                                ? techniques.length
                                : techniques.filter((item) => item.tactic === tactic).length;

                        return (
                            <button
                                key={tactic}
                                className={`mitre-tactic ${selectedTactic === tactic ? "active" : ""
                                    }`}
                                onClick={() => setSelectedTactic(tactic)}
                            >
                                <Icon size={17} />

                                <div>
                                    <strong>{tactic}</strong>
                                    <span>{count} techniques</span>
                                </div>

                                <ChevronRight size={14} />
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Technique inventory */}
            <section className="mitre-main-grid animate-fade">
                <div className="panel mitre-techniques-panel">
                    <div className="section-header">
                        <div>
                            <div className="section-eyebrow">TECHNIQUE INVENTORY</div>
                            <h2>Mapped Behaviors</h2>
                        </div>

                        <span className="mitre-results-count">
                            {filteredTechniques.length} RESULTS
                        </span>
                    </div>

                    <div className="mitre-toolbar">
                        <div className="mitre-search">
                            <Search size={15} />
                            <input
                                type="text"
                                placeholder="Search technique, ID or tactic..."
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                            />
                        </div>

                        <div className="mitre-filter-label">
                            <Filter size={14} />
                            {selectedTactic === "All" ? "ALL TACTICS" : selectedTactic}
                        </div>
                    </div>

                    <div className="mitre-table">
                        <div className="mitre-table-head">
                            <span>TECHNIQUE</span>
                            <span>TACTIC</span>
                            <span>RED</span>
                            <span>BLUE</span>
                            <span>PURPLE</span>
                            <span>STATUS</span>
                        </div>

                        {filteredTechniques.map((technique) => (
                            <button
                                key={technique.id}
                                className={`mitre-table-row ${selectedTechnique.id === technique.id ? "selected" : ""
                                    }`}
                                onClick={() => setSelectedTechnique(technique)}
                            >
                                <div className="mitre-technique-name">
                                    <strong>{technique.id}</strong>
                                    <span>{technique.name}</span>
                                </div>

                                <span className="mitre-tactic-name">
                                    {technique.tactic}
                                </span>

                                <span className="mitre-mini-value red">
                                    {technique.red}%
                                </span>

                                <span className="mitre-mini-value blue">
                                    {technique.blue}%
                                </span>

                                <span className="mitre-mini-value purple">
                                    {technique.purple}%
                                </span>

                                <span className={getStatusClass(technique.status)}>
                                    {getStatusLabel(technique.status)}
                                </span>
                            </button>
                        ))}

                        {filteredTechniques.length === 0 && (
                            <div className="mitre-empty">
                                No techniques match the current filters.
                            </div>
                        )}
                    </div>
                </div>

                {/* Selected technique */}
                <aside className="panel mitre-detail-panel">
                    <div className="mitre-detail-top">
                        <span className="mitre-detail-id">{selectedTechnique.id}</span>

                        <span className={getStatusClass(selectedTechnique.status)}>
                            {getStatusLabel(selectedTechnique.status)}
                        </span>
                    </div>

                    <h2>{selectedTechnique.name}</h2>

                    <div className="mitre-detail-tactic">
                        <Crosshair size={14} />
                        {selectedTechnique.tactic}
                    </div>

                    <p className="mitre-description">
                        {selectedTechnique.description}
                    </p>

                    <div className="mitre-detail-divider" />

                    <div className="mitre-coverage-title">
                        <span>TEAM COVERAGE</span>
                        <small>Current simulation cycle</small>
                    </div>

                    <div className="mitre-team-bars">
                        <div className="mitre-team-row">
                            <div>
                                <span className="team-red-dot" />
                                Red Team
                            </div>
                            <strong>{selectedTechnique.red}%</strong>
                        </div>

                        <div className="mitre-team-progress">
                            <div
                                className="red-fill"
                                style={{ width: `${selectedTechnique.red}%` }}
                            />
                        </div>

                        <div className="mitre-team-row">
                            <div>
                                <span className="team-blue-dot" />
                                Blue Team
                            </div>
                            <strong>{selectedTechnique.blue}%</strong>
                        </div>

                        <div className="mitre-team-progress">
                            <div
                                className="blue-fill"
                                style={{ width: `${selectedTechnique.blue}%` }}
                            />
                        </div>

                        <div className="mitre-team-row">
                            <div>
                                <span className="team-purple-dot" />
                                Purple Validation
                            </div>
                            <strong>{selectedTechnique.purple}%</strong>
                        </div>

                        <div className="mitre-team-progress">
                            <div
                                className="purple-fill"
                                style={{ width: `${selectedTechnique.purple}%` }}
                            />
                        </div>
                    </div>

                    <div className="mitre-detail-actions">
                        <button className="secondary-button">
                            <GitCompare size={15} />
                            Compare Coverage
                        </button>

                        <button className="primary-button">
                            <Activity size={15} />
                            Simulate
                        </button>
                    </div>
                </aside>
            </section>

            {/* Detection gaps */}
            <section className="mitre-bottom-grid animate-fade">
                <div className="panel mitre-gaps-panel">
                    <div className="section-header">
                        <div>
                            <div className="section-eyebrow">PURPLE TEAM PRIORITIES</div>
                            <h2>Detection Gaps</h2>
                        </div>

                        <AlertTriangle size={17} className="yellow-text" />
                    </div>

                    <div className="mitre-gap-list">
                        {techniques
                            .filter((item) => item.status === "gap")
                            .map((item) => (
                                <button
                                    key={item.id}
                                    className="mitre-gap-item"
                                    onClick={() => setSelectedTechnique(item)}
                                >
                                    <div>
                                        <strong>{item.id}</strong>
                                        <span>{item.name}</span>
                                    </div>

                                    <div className="mitre-gap-score">
                                        <small>PURPLE</small>
                                        <strong>{item.purple}%</strong>
                                    </div>

                                    <ChevronRight size={15} />
                                </button>
                            ))}
                    </div>
                </div>

                <div className="panel mitre-flow-panel">
                    <div className="section-header">
                        <div>
                            <div className="section-eyebrow">RED → BLUE → PURPLE</div>
                            <h2>Validation Flow</h2>
                        </div>
                    </div>

                    <div className="mitre-flow">
                        <div className="mitre-flow-node red-node">
                            <Crosshair size={19} />
                            <strong>RED</strong>
                            <span>Simulate</span>
                        </div>

                        <ChevronRight size={18} />

                        <div className="mitre-flow-node blue-node">
                            <Eye size={19} />
                            <strong>BLUE</strong>
                            <span>Detect</span>
                        </div>

                        <ChevronRight size={18} />

                        <div className="mitre-flow-node purple-node">
                            <GitCompare size={19} />
                            <strong>PURPLE</strong>
                            <span>Validate</span>
                        </div>
                    </div>

                    <div className="mitre-flow-note">
                        <CheckCircle2 size={14} />
                        Technique coverage is recalculated after each completed simulation.
                    </div>
                </div>
            </section>

            <div className="mitre-footer">
                <span>
                    <Activity size={13} />
                    ATT&CK DATASET: ENTERPRISE
                </span>

                <span>LAST MAPPING UPDATE: 08:42:16</span>

                <span className="green-text">SYSTEM READY</span>
            </div>
        </div>
    );
}