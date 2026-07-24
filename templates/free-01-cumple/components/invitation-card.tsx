import { Bunting } from "./bunting"
import { Balloons } from "./balloons"
import { Cake } from "./cake"
import { Confetti } from "./confetti"

const STARS = [
  { top: "18%", left: "42%", size: 16, delay: 0 },
  { top: "30%", left: "12%", size: 12, delay: 0.8 },
  { top: "52%", left: "8%", size: 14, delay: 1.4 },
  { top: "44%", left: "60%", size: 10, delay: 0.4 },
  { top: "66%", left: "50%", size: 12, delay: 1.1 },
]

function Star({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z" fill="var(--party-teal)" />
    </svg>
  )
}

interface InvitationCardProps {
  saludo?: string
  titulo?: string
  frase?: string
  fecha?: string
  hora?: string
  lugar?: string
  bg?: string
}

export function InvitationCard({
  saludo = "¡Hola!",
  titulo = "¡Llegó el momento\nde festejar!",
  frase = "Queremos compartir esta alegría contigo y crear recuerdos juntos. ¡La fiesta no estará completa sin ti!",
  fecha = "23 de Julio",
  hora = "6:00 PM",
  lugar = "Calle 116 #14-00, Bogotá",
  bg,
}: InvitationCardProps) {
  const tituloLines = titulo.split("\n")
  const bgColor = bg ? `#${bg.replace("#", "")}` : "var(--color-cream)"

  return (
    <div
      className="min-h-dvh flex items-stretch justify-center"
      style={{ backgroundColor: bgColor }}
    >
      <div className="relative w-full max-w-[480px] min-h-dvh overflow-hidden">

        <Confetti />

        {STARS.map((s, i) => (
          <span
            key={i}
            className="animate-twinkle pointer-events-none absolute"
            style={{ top: s.top, left: s.left, animationDelay: `${s.delay}s` }}
          >
            <Star size={s.size} />
          </span>
        ))}

        <Bunting />

        <div className="pointer-events-none absolute -right-4 top-4 h-72 w-56">
          <Balloons />
        </div>

        <div className="relative px-10 pb-6 pt-36">
          <p className="animate-pop-in text-2xl font-semibold text-party-orange" style={{ animationDelay: "0.15s" }}>
            {saludo}
          </p>

          <h1
            className="animate-pop-in mt-2 text-[3.4rem] font-bold leading-[0.93] text-party-pink"
            style={{ animationDelay: "0.3s" }}
          >
            {tituloLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < tituloLines.length - 1 && <br />}
              </span>
            ))}
          </h1>

          <p
            className="animate-pop-in mt-4 text-[0.82rem] leading-relaxed text-ink"
            style={{ animationDelay: "0.45s", fontWeight: 500, maxWidth: "75%" }}
          >
            {frase}
          </p>

          {/* Separador */}
          <div className="animate-pop-in mt-5 mb-4 h-px w-12 bg-party-orange/40" style={{ animationDelay: "0.5s" }} />

          {/* Fecha y hora */}
          <div
            className="animate-pop-in flex flex-col gap-1"
            style={{ animationDelay: "0.55s" }}
          >
            {hora && (
              <div className="flex items-center gap-2">
                <span className="text-party-orange text-base">🕕</span>
                <span className="font-mono text-[13px] font-bold uppercase tracking-[0.12em] text-party-orange">{hora}</span>
              </div>
            )}
            {fecha && (
              <div className="flex items-center gap-2">
                <span className="text-party-pink text-base">📅</span>
                <span className="font-mono text-[13px] font-bold uppercase tracking-[0.12em] text-party-pink">{fecha}</span>
              </div>
            )}
            {lugar && (
              <div className="flex items-start gap-2 mt-1">
                <span className="text-ink text-base leading-none mt-0.5">📍</span>
                <address className="font-mono text-[13px] font-bold not-italic uppercase tracking-[0.1em] text-ink leading-snug">
                  {lugar.split(",").map((part, i) => (
                    <span key={i}>
                      {part.trim()}
                      {i < lugar.split(",").length - 1 && <br />}
                    </span>
                  ))}
                </address>
              </div>
            )}
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-[65%] max-w-xs">
          <Cake />
        </div>

      </div>
    </div>
  )
}
