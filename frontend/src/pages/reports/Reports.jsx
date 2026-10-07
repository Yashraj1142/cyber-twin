import { useMemo, useState } from "react";
import {
    Activity,
    AlertTriangle,
    Calendar,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Download,
    FileBarChart2,
    FileText,
    Filter,
    Search,
    Shield,
    Target,
    TrendingDown,
    XCircle,
} from "lucide-react";

const reports = [
    {
        id: "RPT-2026-041",
        name: "Full Environment Security Assessment",
        type: "Security Assessment",
        project: "Cyber-Twin Enterprise Lab",
        date: "08 Oct 2026",
        time: "08:42",
        status: "completed",
        severity: "High",
        findings: 17,
        score: 76,
        size: "2.8 MB",
    },
    {
        id: "RPT-2026-040",
        name: "Purple Team Validation Report",
        type: "Purple Validation",
        project: "Corporate Network Twin",
        date: "07 Oct 2026",
        time: "17:16",
        status: "completed",
        severity: "Medium",
        findings: 11,
        score: 84,
        size: "1.9 MB",
    },
    {
        id: "RPT-2026-039",
        name: "Blue Team Detection Analysis",
        type: "SOC Analysis",
        project: "Cyber-Twin Enterprise Lab",
        date: "07 Oct 2026",
        time: "13:04",
        status: "completed",
        severity: "Medium",
        findings: 9,
        score: 81,
        size: "1.5 MB",
    },
    {
        id: "RPT-2026-038",
        name: "Vulnerability Exposure Assessment",
        type: "Vulnerability",
        project: "DMZ Simulation",
        date: "06 Oct 2026",
        time: "20:31",
        status: "completed",
        severity: "Critical",
        findings: 24,
        score: 63,
        size: "3.4 MB",
    },
    {
        id: "RPT-2026-037",
        name: "Red Team Simulation Summary",
        type: "Red Simulation",
        project: "Corporate Network Twin",
        date: "06 Oct 2026",
        time: "15:48",
        status: "completed",
        severity: "High",
        findings: 14,
        score: 71,
        size: "2.1 MB",
    },
    {
        id: "RPT-2026-036",
        name: "Incident Response Readiness",
        type: "Incident Analysis",
        project: "Cyber-Twin Enterprise Lab",
        date: "05 Oct 2026",
        time: "11:22",
        status: "completed",
        severity: "Low",
        findings: 6,
        score: 91,
        size: "1.2 MB",
    },
];

const reportTypes = [
    "All Reports",
    "Security Assessment",
    "Purple Validation",
    "SOC Analysis",
    "Vulnerability",
    "Red Simulation",
    "Incident Analysis",
];

function severityClass(severity) {
    if (severity === "Critical") return "reports-critical";
    if (severity === "High") return "reports-high";
    if (severity === "Medium") return "reports-medium";
    return "reports-low";
}

export default function Reports() {
    const [selectedReport, setSelectedReport] = useState(reports[0]);
    const [selectedType, setSelectedType] = useState("All Reports");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredReports = useMemo(() => {
        return reports.filter((report) => {
            const matchesType =
                selectedType === "All Reports" || report.type === selectedType;

            const query = searchTerm.toLowerCase();

            const matchesSearch =
                report.id.toLowerCase().includes(query) ||
                report.name.toLowerCase().includes(query) ||
                report.project.toLowerCase().includes(query) ||
                report.type.toLowerCase().includes(query);

            return matchesType && matchesSearch;
        });
    }, [selectedType, searchTerm]);

    return (
        <div className="page-wrapper reports-page">
            <div className="reports-header animate-fade">
                <div>
                    <div className="page-eyebrow">
                        <FileBarChart2 size={14} />
                        SECURITY REPORTING
                    </div>

                    <h1>Reports</h1>

                    <p>
                        Generate, review and export security intelligence from your Cyber-Twin
                        simulations and investigations.
                    </p>
                </div>

                <button className="primary-button reports-generate-button">
                    <FileText size={15} />
                    Generate Report
                </button>
            </div>

            {/* Overview */}
            <section className="reports-overview-grid animate-fade">
                <div className="panel reports-summary-card">
                    <div className="reports-summary-icon cyan">
                        <FileText size={18} />
                    </div>

                    <div>
                        <span>TOTAL REPORTS</span>
                        <strong>41</strong>
                        <small>+6 this month</small>
                    </div>
                </div>

                <div className="panel reports-summary-card">
                    <div className="reports-summary-icon red">
                        <AlertTriangle size={18} />
                    </div>

                    <div>
                        <span>CRITICAL FINDINGS</span>
                        <strong>08</strong>
                        <small>3 unresolved</small>
                    </div>
                </div>

                <div className="panel reports-summary-card">
                    <div className="reports-summary-icon green">
                        <TrendingDown size={18} />
                    </div>

                    <div>
                        <span>RISK REDUCTION</span>
                        <strong>24.6%</strong>
                        <small>vs previous cycle</small>
                    </div>
                </div>

                <div className="panel reports-summary-card">
                    <div className="reports-summary-icon purple">
                        <Shield size={18} />
                    </div>

                    <div>
                        <span>AVG SECURITY SCORE</span>
                        <strong>81%</strong>
                        <small>+4.8% improvement</small>
                    </div>
                </div>
            </section>

            {/* Main content */}
            <section className="reports-main-grid animate-fade">
                <div className="panel reports-list-panel">
                    <div className="section-header">
                        <div>
                            <div className="section-eyebrow">REPORT ARCHIVE</div>
                            <h2>Security Reports</h2>
                        </div>

                        <span className="reports-count">
                            {filteredReports.length} RESULTS
                        </span>
                    </div>

                    <div className="reports-toolbar">
                        <div className="reports-search">
                            <Search size={15} />

                            <input
                                type="text"
                                placeholder="Search reports..."
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                            />
                        </div>

                        <div className="reports-filter">
                            <Filter size={14} />

                            <select
                                value={selectedType}
                                onChange={(event) => setSelectedType(event.target.value)}
                            >
                                {reportTypes.map((type) => (
                                    <option key={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="reports-table">
                        <div className="reports-table-head">
                            <span>REPORT</span>
                            <span>TYPE</span>
                            <span>DATE</span>
                            <span>FINDINGS</span>
                            <span>SCORE</span>
                            <span>STATUS</span>
                        </div>

                        {filteredReports.map((report) => (
                            <button
                                key={report.id}
                                className={`reports-table-row ${selectedReport.id === report.id ? "selected" : ""
                                    }`}
                                onClick={() => setSelectedReport(report)}
                            >
                                <div className="reports-name-cell">
                                    <div className="reports-file-icon">
                                        <FileText size={15} />
                                    </div>

                                    <div>
                                        <strong>{report.name}</strong>
                                        <span>{report.id}</span>
                                    </div>
                                </div>

                                <span className="reports-type-cell">{report.type}</span>

                                <div className="reports-date-cell">
                                    <span>{report.date}</span>
                                    <small>{report.time}</small>
                                </div>

                                <span className="reports-findings">
                                    {report.findings}
                                </span>

                                <span className="reports-score">{report.score}%</span>

                                <span className="reports-completed">
                                    <CheckCircle2 size={12} />
                                    READY
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Preview */}
                <aside className="panel reports-preview-panel">
                    <div className="reports-preview-header">
                        <div>
                            <div className="section-eyebrow">REPORT PREVIEW</div>
                            <span className="reports-preview-id">
                                {selectedReport.id}
                            </span>
                        </div>

                        <button className="reports-icon-button" title="Download report">
                            <Download size={15} />
                        </button>
                    </div>

                    <div className="reports-document">
                        <div className="reports-document-brand">
                            <div className="reports-document-logo">
                                <Shield size={17} />
                            </div>

                            <div>
                                <strong>CYBER-TWIN</strong>
                                <span>SECURITY INTELLIGENCE</span>
                            </div>
                        </div>

                        <div className="reports-document-title">
                            <span>SECURITY REPORT</span>
                            <h2>{selectedReport.name}</h2>
                            <p>
                                Generated {selectedReport.date} at {selectedReport.time}
                            </p>
                        </div>

                        <div className="reports-document-score">
                            <div>
                                <span>SECURITY SCORE</span>
                                <strong>{selectedReport.score}%</strong>
                            </div>

                            <div className={severityClass(selectedReport.severity)}>
                                {selectedReport.severity.toUpperCase()} RISK
                            </div>
                        </div>

                        <div className="reports-document-grid">
                            <div>
                                <span>PROJECT</span>
                                <strong>{selectedReport.project}</strong>
                            </div>

                            <div>
                                <span>REPORT TYPE</span>
                                <strong>{selectedReport.type}</strong>
                            </div>

                            <div>
                                <span>FINDINGS</span>
                                <strong>{selectedReport.findings}</strong>
                            </div>

                            <div>
                                <span>FILE SIZE</span>
                                <strong>{selectedReport.size}</strong>
                            </div>
                        </div>

                        <div className="reports-preview-chart">
                            <div className="reports-chart-title">
                                <span>RISK DISTRIBUTION</span>
                                <small>Current assessment</small>
                            </div>

                            <div className="reports-bars">
                                <div className="reports-bar">
                                    <span>Critical</span>
                                    <div>
                                        <i style={{ width: "18%" }} />
                                    </div>
                                    <strong>18%</strong>
                                </div>

                                <div className="reports-bar">
                                    <span>High</span>
                                    <div>
                                        <i style={{ width: "34%" }} />
                                    </div>
                                    <strong>34%</strong>
                                </div>

                                <div className="reports-bar">
                                    <span>Medium</span>
                                    <div>
                                        <i style={{ width: "31%" }} />
                                    </div>
                                    <strong>31%</strong>
                                </div>

                                <div className="reports-bar">
                                    <span>Low</span>
                                    <div>
                                        <i style={{ width: "17%" }} />
                                    </div>
                                    <strong>17%</strong>
                                </div>
                            </div>
                        </div>

                        <div className="reports-document-footer">
                            <span>CYBER-TWIN / INTERNAL</span>
                            <span>PAGE 01 / 12</span>
                        </div>
                    </div>

                    <div className="reports-preview-actions">
                        <button className="secondary-button">
                            <FileText size={14} />
                            View Full Report
                        </button>

                        <button className="primary-button">
                            <Download size={14} />
                            Export PDF
                        </button>
                    </div>
                </aside>
            </section>

            {/* Analytics */}
            <section className="reports-analytics-grid animate-fade">
                <div className="panel reports-analytics-panel">
                    <div className="section-header">
                        <div>
                            <div className="section-eyebrow">REPORT ACTIVITY</div>
                            <h2>Generation Activity</h2>
                        </div>

                        <Calendar size={16} className="reports-muted-icon" />
                    </div>

                    <div className="reports-activity-chart">
                        <div className="reports-y-axis">
                            <span>12</span>
                            <span>9</span>
                            <span>6</span>
                            <span>3</span>
                            <span>0</span>
                        </div>

                        <div className="reports-chart-area">
                            <div className="reports-grid-line" />
                            <div className="reports-grid-line" />
                            <div className="reports-grid-line" />
                            <div className="reports-grid-line" />

                            <div className="reports-column-group">
                                {[4, 7, 5, 9, 6, 10, 8, 12, 7, 9, 11, 8].map(
                                    (height, index) => (
                                        <div className="reports-column-wrap" key={index}>
                                            <div
                                                className="reports-column"
                                                style={{ height: `${height * 7}%` }}
                                            />
                                            <span>{index + 1}</span>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="panel reports-breakdown-panel">
                    <div className="section-header">
                        <div>
                            <div className="section-eyebrow">REPORT BREAKDOWN</div>
                            <h2>Report Types</h2>
                        </div>
                    </div>

                    <div className="reports-breakdown-list">
                        <div>
                            <span>
                                <i className="reports-dot cyan-dot" />
                                Security Assessment
                            </span>
                            <strong>14</strong>
                        </div>

                        <div>
                            <span>
                                <i className="reports-dot purple-dot" />
                                Purple Validation
                            </span>
                            <strong>09</strong>
                        </div>

                        <div>
                            <span>
                                <i className="reports-dot blue-dot" />
                                SOC Analysis
                            </span>
                            <strong>07</strong>
                        </div>

                        <div>
                            <span>
                                <i className="reports-dot red-dot" />
                                Red Simulation
                            </span>
                            <strong>06</strong>
                        </div>

                        <div>
                            <span>
                                <i className="reports-dot yellow-dot" />
                                Vulnerability
                            </span>
                            <strong>05</strong>
                        </div>
                    </div>
                </div>

                <div className="panel reports-health-panel">
                    <div className="section-header">
                        <div>
                            <div className="section-eyebrow">REPORT PIPELINE</div>
                            <h2>System Health</h2>
                        </div>

                        <Activity size={16} className="green-text" />
                    </div>

                    <div className="reports-health-item">
                        <div>
                            <span>
                                <CheckCircle2 size={13} />
                                Report Engine
                            </span>
                            <strong>100%</strong>
                        </div>

                        <div className="reports-health-bar">
                            <i style={{ width: "100%" }} />
                        </div>
                    </div>

                    <div className="reports-health-item">
                        <div>
                            <span>
                                <Clock3 size={13} />
                                Avg. Generation
                            </span>
                            <strong>14.8s</strong>
                        </div>

                        <div className="reports-health-bar">
                            <i style={{ width: "82%" }} />
                        </div>
                    </div>

                    <div className="reports-health-item">
                        <div>
                            <span>
                                <Target size={13} />
                                Data Completeness
                            </span>
                            <strong>97%</strong>
                        </div>

                        <div className="reports-health-bar">
                            <i style={{ width: "97%" }} />
                        </div>
                    </div>

                    <div className="reports-health-status">
                        <CheckCircle2 size={14} />
                        All reporting services operational
                    </div>
                </div>
            </section>

            <div className="reports-footer">
                <span>
                    <FileBarChart2 size={13} />
                    REPORT ENGINE: ONLINE
                </span>

                <span>LAST GENERATED: {selectedReport.date}</span>

                <span className="green-text">
                    <CheckCircle2 size={12} />
                    ALL SERVICES OPERATIONAL
                </span>
            </div>
        </div>
    );
}