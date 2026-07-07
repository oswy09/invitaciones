import { WHATSAPP_CONTACTO } from "../types";

const WHATSAPP_MENSAJE = encodeURIComponent("¡Hola! Quiero saber más sobre las invitaciones digitales de Celebrarte.");

const PASOS = [
  {
    num: "01",
    titulo: "Elige tu plantilla",
    desc: "Explora nuestras invitaciones y elige la que mejor se adapte a tu celebración.",
  },
  {
    num: "02",
    titulo: "Personalizala",
    desc: "Agrega el nombre, fecha, lugar y un mensaje especial. Previsualiza en tiempo real.",
  },
  {
    num: "03",
    titulo: "Compártela",
    desc: "Recibe el enlace listo para enviar por WhatsApp, Instagram o donde quieras.",
  },
];

const EVENTOS = [
  { emoji: "🦖", nombre: "Baby Shower Dino", tag: "Disponible" },
  { emoji: "🦢", nombre: "Cigüeña Dulce", tag: "Próximamente" },
  { emoji: "🚀", nombre: "Aventura Espacial", tag: "Próximamente" },
];

// Gold oscuro para texto sobre fondos claros (#F8F5F0 ivory) — contraste ~5.2:1
const GOLD_TEXT = "#7A5C10";

export default function Landing({ onVerPlantillas }: { onVerPlantillas: () => void }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F5F0", color: "#2B2B2B", fontFamily: "'Poppins', sans-serif" }}>

      {/* NAV */}
      <nav aria-label="Navegación principal" className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <img src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1783378436/logo-celebrarte_bxkmva.png" alt="Celebrarte" className="h-8 w-auto" />
        <button
          onClick={onVerPlantillas}
          className="text-sm font-semibold px-4 py-2 rounded-full transition-all cursor-pointer"
          style={{ backgroundColor: "#5A1B5E", color: "#F8F5F0" }}
        >
          Ver plantillas
        </button>
      </nav>

      <main>
        {/* HERO */}
        <section className="text-center px-6 pt-16 pb-20 max-w-3xl mx-auto">
          <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: GOLD_TEXT }}>
            Invitaciones digitales
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif", color: "#5A1B5E" }}>
            Tu celebración merece una primera impresión memorable
          </h1>
          <p className="text-base md:text-lg leading-relaxed mb-10" style={{ color: "#4A4A4A" }}>
            Diseñamos invitaciones digitales para baby showers, bodas y cumpleaños, listas para compartir por WhatsApp en segundos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onVerPlantillas}
              className="w-full sm:w-auto text-base font-semibold px-8 py-3.5 rounded-full transition-all cursor-pointer shadow-lg"
              style={{ backgroundColor: "#5A1B5E", color: "#F8F5F0" }}
            >
              Explorar plantillas
            </button>
            <a
              href={`https://wa.me/${WHATSAPP_CONTACTO}?text=${WHATSAPP_MENSAJE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-base font-semibold px-8 py-3.5 rounded-full border-2 transition-all text-center"
              style={{ borderColor: "#5A1B5E", color: "#5A1B5E" }}
            >
              Preguntar por WhatsApp
            </a>
          </div>
        </section>

        {/* PLANTILLAS PREVIEW */}
        <section aria-label="Muestra de plantillas" className="px-6 pb-20 max-w-4xl mx-auto">
          <h2 className="text-center text-2xl font-bold mb-10" style={{ fontFamily: "'Playfair Display', serif", color: "#5A1B5E" }}>
            Nuestras plantillas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {EVENTOS.map((e) => (
              <div
                key={e.nombre}
                className="rounded-2xl p-6 text-center flex flex-col items-center gap-3 border"
                style={{ backgroundColor: "white", borderColor: "#E8B4BC" }}
              >
                <span className="text-5xl" role="img" aria-hidden="true">{e.emoji}</span>
                <p className="font-semibold text-base" style={{ color: "#5A1B5E", fontFamily: "'Playfair Display', serif" }}>{e.nombre}</p>
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: e.tag === "Disponible" ? "#5A1B5E" : "#F8F5F0",
                    color: e.tag === "Disponible" ? "#F8F5F0" : GOLD_TEXT,
                    border: e.tag !== "Disponible" ? `1px solid ${GOLD_TEXT}` : "none",
                  }}
                >
                  {e.tag}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={onVerPlantillas}
              className="text-sm font-semibold px-6 py-2.5 rounded-full cursor-pointer transition-all"
              style={{ backgroundColor: "#5A1B5E", color: "#F8F5F0" }}
            >
              Ver todas las plantillas →
            </button>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section aria-label="Cómo funciona" className="px-6 py-20" style={{ backgroundColor: "#5A1B5E" }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center text-2xl font-bold mb-12" style={{ fontFamily: "'Playfair Display', serif", color: "#F8F5F0" }}>
              ¿Cómo funciona?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {PASOS.map((p) => (
                <div key={p.num} className="text-center">
                  <p className="text-4xl font-bold mb-3" style={{ color: "#C49B3A", fontFamily: "'Playfair Display', serif" }}>{p.num}</p>
                  <p className="font-semibold text-base mb-2" style={{ color: "#F8F5F0" }}>{p.titulo}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#E8B4BC" }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="px-6 py-20 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "#5A1B5E" }}>
            ¿Lista para sorprender a tus invitados?
          </h2>
          <p className="text-sm mb-8" style={{ color: "#4A4A4A" }}>
            Personaliza tu invitación en minutos y compártela al instante.
          </p>
          <button
            onClick={onVerPlantillas}
            className="text-base font-semibold px-10 py-4 rounded-full cursor-pointer shadow-lg transition-all"
            style={{ backgroundColor: "#5A1B5E", color: "#F8F5F0" }}
          >
            Crear mi invitación
          </button>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="px-6 py-8 border-t text-center text-xs" style={{ borderColor: "#E8B4BC", color: "#5A5A5A" }}>
        © 2026 Celebrarte · Invitaciones digitales · Hecho con amor ✨
      </footer>
    </div>
  );
}
