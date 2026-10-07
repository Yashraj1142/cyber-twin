function StatusDot({
    status = "online",
    label,
}) {
    return (
        <span className="status-wrapper">
            <span className={`status-dot ${status}`} />
            {label && <span>{label}</span>}
        </span>
    );
}

export default StatusDot;