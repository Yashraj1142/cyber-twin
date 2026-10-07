import { ArrowUpRight, ArrowDownRight } from "lucide-react";

function StatCard({
    label,
    value,
    description,
    trend,
    trendType = "up",
    icon: Icon,
}) {
    return (
        <div className="stat-card">

            <div className="stat-card-top">
                <span className="stat-label">
                    {label}
                </span>

                {Icon && (
                    <div className="stat-icon">
                        <Icon size={17} />
                    </div>
                )}
            </div>

            <div className="stat-value">
                {value}
            </div>

            <div className="stat-bottom">

                <span className="stat-description">
                    {description}
                </span>

                {trend && (
                    <span className={`trend ${trendType}`}>
                        {trendType === "up" ? (
                            <ArrowUpRight size={12} />
                        ) : (
                            <ArrowDownRight size={12} />
                        )}

                        {trend}
                    </span>
                )}

            </div>

        </div>
    );
}

export default StatCard;