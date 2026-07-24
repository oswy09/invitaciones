const FLAG_COLORS = [
  "var(--party-green)",
  "var(--party-orange)",
  "var(--cream)",
  "var(--party-teal)",
  "var(--party-green)",
  "var(--party-orange)",
  "var(--cream)",
  "var(--party-green)",
]

export function Bunting() {
  const count = FLAG_COLORS.length
  const step = 100 / count

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 22"
      preserveAspectRatio="none"
      className="absolute left-0 top-0 h-16 w-full"
    >
      {/* string */}
      <path
        d="M0 3 Q 50 12 100 3"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="0.6"
        opacity="0.55"
      />
      {FLAG_COLORS.map((color, i) => {
        const x = i * step + step / 2
        // follow the sagging string
        const t = x / 100
        const y = 3 + 9 * (4 * t * (1 - t))
        return (
          <g
            key={i}
            className="animate-sway-bunting"
            style={{ animationDelay: `${i * 0.15}s`, transformBox: "fill-box" }}
          >
            <path
              d={`M ${x - step / 2 + 0.6} ${y} L ${x + step / 2 - 0.6} ${y} L ${x} ${y + 8} Z`}
              fill={color}
              stroke="var(--ink)"
              strokeOpacity="0.15"
              strokeWidth="0.3"
            />
          </g>
        )
      })}
    </svg>
  )
}
