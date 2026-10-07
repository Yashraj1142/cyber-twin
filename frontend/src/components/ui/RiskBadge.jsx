function RiskBadge({ level = "Medium" }) {
    const normalized = level.toLowerCase();

    return (
        <span className={`risk-badge ${normalized}`}>
            {level}
        </span>
    );
}

export default RiskBadge;