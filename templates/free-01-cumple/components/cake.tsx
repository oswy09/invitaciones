function Candle({ x, base, color, delay }: { x: number; base: number; color: string; delay: number }) {
  return (
    <g>
      {/* candle body */}
      <rect x={x - 3} y={base - 34} width={6} height={34} rx={2} fill={color} />
      <rect x={x - 3} y={base - 34} width={6} height={34} rx={2} fill="var(--cream)" opacity="0.25" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={x - 3} y={base - 30 + i * 11} width={6} height={4} fill="var(--cream)" opacity="0.6" />
      ))}
      {/* wick */}
      <rect x={x - 0.6} y={base - 40} width={1.2} height={6} fill="var(--ink)" />
      {/* flame */}
      <g className="animate-flame" style={{ animationDelay: `${delay}s`, transformOrigin: `${x}px ${base - 40}px` }}>
        <ellipse cx={x} cy={base - 45} rx={4} ry={8} fill="var(--party-orange)" />
        <ellipse cx={x} cy={base - 44} rx={2.2} ry={5} fill="#ffe27a" />
      </g>
    </g>
  )
}

export function Cake() {
  return (
    <svg aria-hidden viewBox="0 0 300 260" className="h-full w-full overflow-visible">
      {/* candles on the tall pink cake */}
      <Candle x={150} base={92} color="var(--party-orange)" delay={0} />
      <Candle x={180} base={92} color="var(--party-pink)" delay={0.18} />
      <Candle x={210} base={92} color="var(--party-teal)" delay={0.32} />
      <Candle x={240} base={92} color="#e0533b" delay={0.1} />

      {/* ---- Tall pink cake (right) ---- */}
      <rect x={122} y={92} width={150} height={140} rx={10} fill="var(--party-pink)" />
      {/* frosting drips top */}
      <path
        d="M122 104 q12 -20 25 0 q12 -20 25 0 q12 -20 25 0 q12 -20 25 0 q12 -20 25 0 v-14 h-125 z"
        fill="#f4a0c8"
      />
      {/* polka dots */}
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3, 4].map((c) => (
          <circle key={`${r}-${c}`} cx={138 + c * 28} cy={128 + r * 34} r={3.4} fill="var(--cream)" opacity="0.85" />
        )),
      )}
      {/* wavy band near bottom */}
      <path
        d="M122 196 q18 -14 37 0 q18 14 37 0 q18 -14 37 0 q18 14 39 0 v22 h-150 z"
        fill="#f4a0c8"
      />
      <path d="M122 210 h150" stroke="var(--cream)" strokeWidth="3" opacity="0.7" strokeLinecap="round" />

      {/* cherries on top */}
      <circle cx={140} cy={86} r={7} fill="#e0533b" />
      <circle cx={168} cy={88} r={7} fill="#e0533b" />
      <circle cx={196} cy={86} r={7} fill="#e0533b" />

      {/* ---- Short teal cake (left / front) ---- */}
      <rect x={40} y={158} width={104} height={74} rx={10} fill="var(--party-teal)" />
      <path
        d="M40 170 q11 -16 22 0 q11 -16 22 0 q11 -16 22 0 q11 -16 22 0 v-12 h-88 z"
        fill="#a9e3d8"
      />
      <path d="M40 208 h104" stroke="var(--cream)" strokeWidth="3" opacity="0.7" strokeLinecap="round" />

      {/* orange slice + candle on the teal cake */}
      <Candle x={64} base={158} color="var(--party-pink)" delay={0.24} />
      <g transform="translate(96 150)">
        <path d="M0 0 A22 22 0 0 1 44 0 Z" fill="var(--party-orange)" />
        <path d="M4 -1 A18 18 0 0 1 40 -1 Z" fill="#ffd08a" />
        {[10, 22, 34].map((px) => (
          <path key={px} d={`M22 -1 L${px} -14`} stroke="var(--party-orange)" strokeWidth="1.5" />
        ))}
      </g>

      {/* plate */}
      <ellipse cx={150} cy={234} rx={140} ry={12} fill="var(--ink)" opacity="0.08" />
    </svg>
  )
}
