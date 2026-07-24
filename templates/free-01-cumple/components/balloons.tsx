type BalloonProps = {
  x: number
  y: number
  rx: number
  ry: number
  fill: string
  pattern?: "stripes" | "dots" | "swirl"
  patternColor?: string
  delay?: number
}

function Balloon({ x, y, rx, ry, fill, pattern, patternColor = "var(--cream)", delay = 0 }: BalloonProps) {
  return (
    <g
      className="animate-float-balloon"
      style={{ animationDelay: `${delay}s`, transformOrigin: `${x}px ${y}px` }}
    >
      {/* string down to the knot area */}
      <path
        d={`M ${x} ${y + ry} C ${x - 6} ${y + ry + 40}, ${x + 8} ${y + ry + 80}, ${x} ${y + ry + 130}`}
        fill="none"
        stroke="var(--ink)"
        strokeWidth="1.2"
        opacity="0.5"
      />
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={fill} />
      {/* knot */}
      <path
        d={`M ${x - 4} ${y + ry} L ${x + 4} ${y + ry} L ${x} ${y + ry + 7} Z`}
        fill={fill}
      />
      {/* highlight */}
      <ellipse cx={x - rx * 0.35} cy={y - ry * 0.4} rx={rx * 0.18} ry={ry * 0.26} fill="white" opacity="0.35" />

      {pattern === "stripes" && (
        <g clipPath={`url(#clip-${x}-${y})`}>
          {[-2, -1, 0, 1, 2].map((k) => (
            <path
              key={k}
              d={`M ${x - rx} ${y + k * ry * 0.42} Q ${x} ${y + k * ry * 0.42 - 8} ${x + rx} ${y + k * ry * 0.42}`}
              stroke={patternColor}
              strokeWidth={ry * 0.16}
              fill="none"
              opacity="0.85"
            />
          ))}
        </g>
      )}

      {pattern === "dots" && (
        <g clipPath={`url(#clip-${x}-${y})`}>
          {Array.from({ length: 5 }).map((_, r) =>
            Array.from({ length: 4 }).map((_, c) => (
              <circle
                key={`${r}-${c}`}
                cx={x - rx + 8 + c * (rx / 2.1)}
                cy={y - ry + 10 + r * (ry / 2.4)}
                r={ry * 0.07}
                fill={patternColor}
                opacity="0.85"
              />
            )),
          )}
        </g>
      )}

      {pattern === "swirl" && (
        <g clipPath={`url(#clip-${x}-${y})`}>
          {[-1.6, -0.8, 0, 0.8, 1.6].map((k) => (
            <path
              key={k}
              d={`M ${x - rx} ${y + k * ry * 0.5} Q ${x - rx * 0.3} ${y + k * ry * 0.5 - 14} ${x + rx * 0.4} ${y + k * ry * 0.5} T ${x + rx} ${y + k * ry * 0.5}`}
              stroke={patternColor}
              strokeWidth={ry * 0.12}
              fill="none"
              opacity="0.8"
            />
          ))}
        </g>
      )}

      <defs>
        <clipPath id={`clip-${x}-${y}`}>
          <ellipse cx={x} cy={y} rx={rx} ry={ry} />
        </clipPath>
      </defs>
    </g>
  )
}

export function Balloons() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 260 320"
      className="h-full w-full overflow-visible"
    >
      <Balloon x={150} y={70} rx={46} ry={54} fill="var(--party-green)" pattern="swirl" delay={0} />
      <Balloon x={95} y={120} rx={40} ry={48} fill="var(--party-orange)" delay={0.6} />
      <Balloon x={185} y={150} rx={42} ry={50} fill="var(--party-pink)" pattern="dots" patternColor="var(--party-orange)" delay={1.1} />
      <Balloon x={120} y={185} rx={38} ry={46} fill="#e0533b" pattern="stripes" delay={0.35} />
    </svg>
  )
}
