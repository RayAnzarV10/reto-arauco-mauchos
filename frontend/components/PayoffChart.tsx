// Server-compatible SVG payoff chart for derivative strategies

interface Point { x: number; y: number }

interface Series {
  label: string;
  color: string;
  points: Point[];
  dashed?: boolean;
  strokeWidth?: number;
}

interface PayoffChartProps {
  id: string;
  series: Series[];
  xDomain: [number, number];
  yDomain: [number, number];
  xTicks: number[];
  yTicks: number[];
  refLines?: Array<{ x?: number; y?: number; label?: string }>;
  xLabel?: string;
  height?: number;
}

export function PayoffChart({
  id,
  series,
  xDomain,
  yDomain,
  xTicks,
  yTicks,
  refLines = [],
  xLabel = "Tipo de cambio al vencimiento (USD/MXN)",
  height = 220,
}: PayoffChartProps) {
  const W = 480;
  const H = height;
  const PAD = { t: 12, r: 20, b: 52, l: 62 };
  const cW = W - PAD.l - PAD.r;
  const cH = H - PAD.t - PAD.b;

  const toX = (v: number) =>
    PAD.l + ((v - xDomain[0]) / (xDomain[1] - xDomain[0])) * cW;
  const toY = (v: number) =>
    PAD.t + cH - ((v - yDomain[0]) / (yDomain[1] - yDomain[0])) * cH;

  const pathStr = (pts: Point[]) =>
    pts
      .map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.x).toFixed(1)},${toY(p.y).toFixed(1)}`)
      .join(" ");

  const fmt = (v: number) =>
    v === 0 ? "0" : `${v > 0 ? "+" : ""}${v.toFixed(0)}M`;

  const clipId = `clip-${id}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={PAD.l} y={PAD.t} width={cW} height={cH} />
        </clipPath>
      </defs>

      {/* Background */}
      <rect x={PAD.l} y={PAD.t} width={cW} height={cH} fill="#f9fafb" rx="3" />

      {/* Y gridlines */}
      {yTicks.map((v) => (
        <line
          key={v}
          x1={PAD.l}
          x2={PAD.l + cW}
          y1={toY(v)}
          y2={toY(v)}
          stroke={v === 0 ? "#6b7280" : "#e5e7eb"}
          strokeWidth={v === 0 ? 1.5 : 0.6}
        />
      ))}

      {/* Vertical reference lines */}
      {refLines
        .filter((r) => r.x !== undefined)
        .map((r, i) => (
          <g key={i}>
            <line
              x1={toX(r.x!)}
              x2={toX(r.x!)}
              y1={PAD.t}
              y2={PAD.t + cH}
              stroke="#d1d5db"
              strokeWidth={1}
              strokeDasharray="4,3"
            />
            {r.label && (
              <text
                x={toX(r.x!)}
                y={PAD.t + cH + 11}
                textAnchor="middle"
                fontSize="8"
                fill="#9ca3af"
              >
                {r.label}
              </text>
            )}
          </g>
        ))}

      {/* Data series */}
      <g clipPath={`url(#${clipId})`}>
        {series.map((s, i) => (
          <path
            key={i}
            d={pathStr(s.points)}
            fill="none"
            stroke={s.color}
            strokeWidth={s.strokeWidth ?? 2.2}
            strokeDasharray={s.dashed ? "6,4" : undefined}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* Axes */}
      <line
        x1={PAD.l}
        x2={PAD.l + cW}
        y1={PAD.t + cH}
        y2={PAD.t + cH}
        stroke="#d1d5db"
        strokeWidth={1}
      />
      <line
        x1={PAD.l}
        x2={PAD.l}
        y1={PAD.t}
        y2={PAD.t + cH}
        stroke="#d1d5db"
        strokeWidth={1}
      />

      {/* X tick labels */}
      {xTicks.map((v) => (
        <text
          key={v}
          x={toX(v)}
          y={PAD.t + cH + 13}
          textAnchor="middle"
          fontSize="8.5"
          fill="#6b7280"
        >
          {v.toFixed(2)}
        </text>
      ))}

      {/* Y tick labels */}
      {yTicks.map((v) => (
        <text
          key={v}
          x={PAD.l - 5}
          y={toY(v) + 3.5}
          textAnchor="end"
          fontSize="8.5"
          fill={v === 0 ? "#374151" : "#9ca3af"}
          fontWeight={v === 0 ? "600" : "normal"}
        >
          {fmt(v)}
        </text>
      ))}

      {/* X axis label */}
      <text
        x={PAD.l + cW / 2}
        y={H - 3}
        textAnchor="middle"
        fontSize="8"
        fill="#9ca3af"
      >
        {xLabel}
      </text>

      {/* Legend */}
      {series.map((s, i) => {
        const spacing = Math.min(140, cW / series.length);
        const lx = PAD.l + i * spacing + 4;
        const ly = PAD.t + cH + 36;
        return (
          <g key={i}>
            <line
              x1={lx}
              x2={lx + 16}
              y1={ly}
              y2={ly}
              stroke={s.color}
              strokeWidth={2}
              strokeDasharray={s.dashed ? "5,3" : undefined}
            />
            <text x={lx + 20} y={ly + 3.5} fontSize="8.5" fill="#374151">
              {s.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
