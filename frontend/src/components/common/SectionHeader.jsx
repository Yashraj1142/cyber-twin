function SectionHeader({
    eyebrow,
    title,
    description,
    action,
}) {
    return (
        <div className="section-header">

            <div>
                {eyebrow && (
                    <div className="section-eyebrow">
                        {eyebrow}
                    </div>
                )}

                <h2>{title}</h2>

                {description && (
                    <p>{description}</p>
                )}
            </div>

            {action && (
                <div className="section-action">
                    {action}
                </div>
            )}

        </div>
    );
}

export default SectionHeader;