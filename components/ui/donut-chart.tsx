"use client";

type Segment = {
  label: string;
  value: number;
  color: string;
};

type Props = {
  segments: Segment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string | number;
};

export function DonutChart({
  segments,
  size = 160,
  strokeWidth = 28,
  centerLabel,
  centerValue,
}: Props) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let cumulativePercent = 0;

  const arcs = segments.map((seg) => {
    const percent = seg.value / total;
    const offset = circumference * (1 - cumulativePercent);
    const dashArray = `${circumference * percent} ${circumference * (1 - percent)}`;
    // Rotate so 0° is at top
    const rotate = -90 + 360 * cumulativePercent;
    cumulativePercent += percent;
    return { ...seg, offset, dashArray, rotate, percent };
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background track */}
          <circle
            cx={center} cy={center} r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />
          {/* Segments */}
          {arcs.map((arc, i) => (
            <circle
              key={i}
              cx={center} cy={center} r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={strokeWidth}
              strokeDasharray={arc.dashArray}
              strokeDashoffset={arc.offset}
              strokeLinecap="butt"
              transform={`rotate(${arc.rotate} ${center} ${center})`}
              style={{ transition: "stroke-dasharray 0.6s ease" }}
            />
          ))}
        </svg>
        {/* Center text */}
        {(centerLabel || centerValue !== undefined) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {centerValue !== undefined && (
              <p className="font-display text-xl font-bold text-ink-900 leading-none">{centerValue}</p>
            )}
            {centerLabel && (
              <p className="text-xs text-ink-500 mt-0.5">{centerLabel}</p>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-xs text-ink-600">
              {seg.label}{" "}
              <span className="font-semibold text-ink-900">{seg.value}</span>
              <span className="text-ink-400"> ({total > 0 ? Math.round((seg.value / total) * 100) : 0}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
