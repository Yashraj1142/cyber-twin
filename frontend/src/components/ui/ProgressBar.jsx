function ProgressBar({
    value = 0,
    type = "cyan",
}) {
    return (
        <div className="progress-track">
            <div
                className={`progress-fill ${type}`}
                style={{
                    width: `${Math.min(100, Math.max(0, value))}%`,
                }}
            />
        </div>
    );
}

export default ProgressBar;