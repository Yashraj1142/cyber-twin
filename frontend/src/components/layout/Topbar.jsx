import {
    Bell,
    ChevronDown,
    Command,
    Search,
    ShieldCheck,
} from "lucide-react";

function Topbar() {
    return (
        <header className="topbar">

            <div className="topbar-left">

                <div className="breadcrumb">
                    <span>CYBER-TWIN</span>
                    <span>/</span>
                    <strong>COMMAND CENTER</strong>
                </div>

            </div>

            <div className="topbar-right">

                <button className="search-button">
                    <Search size={15} />
                    <span>Search</span>
                    <kbd>
                        <Command size={10} /> K
                    </kbd>
                </button>

                <div className="topbar-divider" />

                <button className="notification-button">
                    <Bell size={17} />
                    <span />
                </button>

                <div className="user-menu">

                    <div className="user-avatar">
                        Y
                    </div>

                    <div className="user-details">
                        <strong>Security Analyst</strong>
                        <span>Administrator</span>
                    </div>

                    <ChevronDown size={14} />

                </div>

            </div>

        </header>
    );
}

export default Topbar;