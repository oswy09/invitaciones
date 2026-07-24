const COLORS = [
  "var(--party-pink)",
  "var(--party-orange)",
  "var(--party-green)",
  "var(--party-teal)",
]

// Deterministic pseudo-random so server and client render identically.
const PIECES = Array.from({ length: 24 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280
  const rnd = seed / 233280
  const rnd2 = ((i * 4099 + 12345) % 233280) / 233280
  return {
    left: Math.round(rnd * 100),
    delay: (rnd2 * 6).toFixed(2),
    duration: (5 + rnd * 5).toFixed(2),
    size: 6 + Math.round(rnd2 * 8),
    color: COLORS[i % COLORS.length],
    round: i % 3 === 0,
  }
})

export function Confetti() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {PIECES.map((p, i) => (
        <span
          key={i}
          className="animate-confetti absolute top-0 block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.round ? p.size : p.size * 0.5,
            backgroundColor: p.color,
            borderRadius: p.round ? "9999px" : "2px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
