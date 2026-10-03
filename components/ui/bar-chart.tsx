"use client";

type Bar = {
  label: string;
  value: number;
  color?: string;
};

type Props = {
  bars: Bar[];
  height?: number;
  barColor?: string;
  showValues?: boolean;
  unit?: string;
};

export function BarChart({
  bars,
  height = 140,
  barColor = "#16a34a",
  showValues = true,
  unit = "",
}: Props) {
  const max = Math.max(...bars.map((b) => b.value), 1);
  const barWidth = 100 / bars.length;

  return (
    <div className="w-full">
      {/* SVG bars */}
      <div className="relative w-full" style={{ height }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${bars.length * 48} ${height}`}
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          {/* Gridlines */}
          {[0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1="0"
              y1={height - height * ratio}
              x2={bars.length * 48}
              y2={height - height * ratio}
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Bars */}
          {bars.map((bar, i) => {
            const barH = (bar.value / max) * (height - 20);
            const x = i * 48 + 6;
            const y = height - barH;
            const color = bar.color ?? barColor;
            return (
              <g key={bar.label}>
                <rect
                  x={x}
                  y={y}
                  width={36}
                  height={barH}
                  rx={4}
                  fill={color}
                  opacity={0.85}
                  style={{ transition: "height 0.5s ease, y 0.5s ease" }}
                />
                {showValues && bar.value > 0 && (
                  <text
                    x={x + 18}
                    y={y - 5}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="600"
                    fill={color}
                  >
                    {bar.value}{unit}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* X-axis labels */}
      <div
        className="mt-1 grid text-center"
        style={{ gridTemplateColumns: `repeat(${bars.length}, 1fr)` }}
      >
        {bars.map((bar) => (
          <span key={bar.label} className="text-[10px] font-medium text-ink-500 truncate px-0.5">
            {bar.label}
          </span>
        ))}
      </div>
    </div>
  );
}
