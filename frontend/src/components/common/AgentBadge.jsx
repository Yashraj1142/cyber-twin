import {
    Activity,
    Shield,
    Scale,
} from "lucide-react";

const agents = {
    red: {
        label: "RED AGENT",
        icon: Activity,
    },

    blue: {
        label: "BLUE AGENT",
        icon: Shield,
    },

    purple: {
        label: "PURPLE AGENT",
        icon: Scale,
    },
};

function AgentBadge({ type = "red" }) {
    const agent = agents[type];
    const Icon = agent.icon;

    return (
        <div className={`agent-badge ${type}`}>
            <Icon size={14} />
            <span>{agent.label}</span>
        </div>
    );
}

export default AgentBadge;