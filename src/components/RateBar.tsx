interface Props {
    rate: number;   // 0–1 decimal
    label: string;
}

function getColor(rate: number) {
    if (rate < 0.05) return '#10b981'; // green
    if (rate < 0.10) return '#f59e0b'; // amber
    return '#ef4444';                   // red
}

export default function RateBar({ rate, label }: Props) {
    const pct = Math.min(rate * 100, 100);
    const color = getColor(rate);

    return (
        <div className="rate-bar-wrap">
            <div className="rate-bar-header">
                <span className="rate-bar-label">{label}</span>
                <span className="rate-bar-pct" style={{ color }}>{pct.toFixed(2)}%</span>
            </div>
            <div className="rate-bar-track">
                <div
                    className="rate-bar-fill"
                    style={{
                        width: `${pct}%`,
                        background: color,
                    }}
                />
            </div>
        </div>
    );
}
