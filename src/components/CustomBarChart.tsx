import { useState, useRef, useCallback, useEffect } from 'react';

interface BarData {
    name: string;
    value: number;
    color: string;
}

interface Props {
    data: BarData[];
    formatValue?: (v: number) => string;
    height?: number;
}

const defaultFormat = (v: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

export default function CustomBarChart({ data, formatValue = defaultFormat, height = 300 }: Props) {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; item: BarData } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dims, setDims] = useState({ w: 400, h: height });

    // Track container dimensions
    useEffect(() => {
        if (!containerRef.current) return;
        const ro = new ResizeObserver(([entry]) => {
            setDims({ w: entry.contentRect.width, h: height });
        });
        ro.observe(containerRef.current);
        setDims({ w: containerRef.current.clientWidth, h: height });
        return () => ro.disconnect();
    }, [height]);

    const paddingX = 40;
    const paddingY = 20;
    const paddingBottom = 40;
    const chartW = dims.w - paddingX * 2;
    const chartH = dims.h - paddingY - paddingBottom;
    const maxValue = Math.max(...data.map((d) => d.value), 1);
    const barWidth = Math.min(60, (chartW / data.length) * 0.5);
    const colW = chartW / data.length;

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<SVGSVGElement>) => {
            const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
            const relX = e.clientX - rect.left - paddingX;
            const col = Math.floor((relX / chartW) * data.length);
            if (col >= 0 && col < data.length) {
                const item = data[col];
                const barX = paddingX + col * colW + colW / 2;
                const barH = (item.value / maxValue) * chartH;
                const barY = paddingY + chartH - barH;
                setTooltip({ x: barX, y: barY, item });
            }
        },
        [data, chartW, colW, chartH, maxValue, paddingX, paddingY]
    );

    const handleMouseLeave = useCallback(() => setTooltip(null), []);

    const r = 8; // corner radius for bar tops

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%', height: `${height}px` }}>
            <svg
                width="100%"
                height={dims.h}
                viewBox={`0 0 ${dims.w} ${dims.h}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ overflow: 'visible' }}
            >
                {/* Gridlines */}
                {[0.25, 0.5, 0.75, 1].map((f) => {
                    const y = paddingY + chartH * (1 - f);
                    return (
                        <line
                            key={f}
                            x1={paddingX}
                            x2={dims.w - paddingX}
                            y1={y}
                            y2={y}
                            stroke="currentColor"
                            strokeOpacity={0.06}
                            strokeWidth={1}
                        />
                    );
                })}

                {/* Bars */}
                {data.map((d, i) => {
                    const barH = Math.max((d.value / maxValue) * chartH, 4);
                    const x = paddingX + i * colW + colW / 2 - barWidth / 2;
                    const y = paddingY + chartH - barH;
                    const isHovered = tooltip?.item === d;
                    return (
                        <g key={i}>
                            {/* Rounded-top bar using path */}
                            <path
                                d={`
                  M ${x + r} ${y}
                  Q ${x} ${y} ${x} ${y + r}
                  L ${x} ${y + barH}
                  L ${x + barWidth} ${y + barH}
                  L ${x + barWidth} ${y + r}
                  Q ${x + barWidth} ${y} ${x + barWidth - r} ${y}
                  Z
                `}
                                fill={d.color}
                                opacity={isHovered ? 1 : 0.85}
                                style={{ transition: 'opacity 0.15s' }}
                            />
                            {/* Glow on hover */}
                            {isHovered && (
                                <path
                                    d={`
                    M ${x + r} ${y}
                    Q ${x} ${y} ${x} ${y + r}
                    L ${x} ${y + barH}
                    L ${x + barWidth} ${y + barH}
                    L ${x + barWidth} ${y + r}
                    Q ${x + barWidth} ${y} ${x + barWidth - r} ${y}
                    Z
                  `}
                                    fill={d.color}
                                    opacity={0.2}
                                    filter="blur(8px)"
                                />
                            )}
                            {/* X-axis label */}
                            <text
                                x={paddingX + i * colW + colW / 2}
                                y={paddingY + chartH + 24}
                                textAnchor="middle"
                                fill="currentColor"
                                opacity={0.5}
                                fontSize={12}
                            >
                                {d.name}
                            </text>
                        </g>
                    );
                })}
            </svg>

            {/* HTML Tooltip — precisely positioned relative to container */}
            {tooltip && (
                <div
                    style={{
                        position: 'absolute',
                        left: tooltip.x,
                        top: tooltip.y - 12,
                        transform: 'translate(-50%, -100%)',
                        background: 'var(--bg-card)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid var(--border)',
                        borderRadius: '10px',
                        padding: '0.5rem 0.9rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--text)',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                        zIndex: 100,
                    }}
                >
                    <div style={{ color: tooltip.item.color, marginBottom: 2, fontSize: '0.7rem', fontWeight: 700 }}>
                        {tooltip.item.name}
                    </div>
                    {formatValue(tooltip.item.value)}
                    {/* Arrow */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: -5,
                            left: '50%',
                            transform: 'translateX(-50%) rotate(45deg)',
                            width: 10,
                            height: 10,
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderLeft: 'none',
                            borderTop: 'none',
                        }}
                    />
                </div>
            )}
        </div>
    );
}
