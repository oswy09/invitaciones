import { useEffect, useState } from "react";
import { CATALOGO, TemplateInfo, WHATSAPP_CONTACTO } from "../types";
import { supabase } from "../lib/supabase";

const WHATSAPP_MENSAJE = "¡Hola! Tengo una duda sobre las invitaciones digitales antes de hacer mi pedido.";

interface CatalogoProps {
  onSelect: (template: TemplateInfo) => void;
  onBack?: () => void;
}

interface Precios {
  [id: string]: { cop: number; usd: number };
}

const GRADIENT_BORDER =
  "linear-gradient(to bottom, #C49B3A, #5A1B5E, #E8B4BC, #7A2E8A, #C49B3A)";

function TemplateCard({
  t,
  onSelect,
  isColombia,
  precios,
}: {
  t: TemplateInfo;
  onSelect: (t: TemplateInfo) => void;
  isColombia: boolean;
  precios: Precios;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onClick={() => onSelect(t)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "white",
        borderRadius: "1rem",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 20px 48px rgba(90,27,94,0.18), 0 4px 12px rgba(90,27,94,0.08)"
          : "0 2px 8px rgba(90,27,94,0.07)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: "1px solid #EDD5E8",
      }}
    >
      {/* ── PREVIEW ── */}
      <div
        style={{
          height: "240px",
          background: t.gradiente,
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {t.esEspacio && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0,
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        )}

        {/* Overlay oscuro en hover */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundColor: "rgba(30,10,40,0.38)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }} />

        {/* Tag categoría — esquina superior derecha */}
        <span style={{
          position: "absolute", top: 12, right: 12,
          fontSize: "0.6rem", fontWeight: 800,
          textTransform: "uppercase", letterSpacing: "0.1em",
          padding: "4px 10px", borderRadius: "4px",
          backgroundColor: "rgba(0,0,0,0.55)",
          color: "white",
          backdropFilter: "blur(4px)",
        }}>
          {t.categoria}
        </span>

        {/* Círculo "Ver más" — siempre visible, flota en hover */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            backgroundColor: "white",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 2,
            boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
            animation: hovered ? "floatAround 3.5s ease-in-out infinite" : "none",
            transition: "box-shadow 0.3s ease",
          }}>
            <span style={{ fontSize: "1.1rem", color: "#3A1140", lineHeight: 1 }}>↗</span>
            <span style={{
              fontSize: "0.58rem", fontWeight: 800,
              color: "#3A1140", textAlign: "center",
              textTransform: "uppercase", letterSpacing: "0.04em",
              lineHeight: 1.3,
            }}>Ver más</span>
          </div>
        </div>
      </div>

      {/* ── CUERPO con borde izquierdo animado ── */}
      <div style={{ display: "flex", flex: 1, padding: "1rem" }}>
        {/* Borde gradient animado */}
        <div style={{
          width: 3, borderRadius: 3, flexShrink: 0, marginRight: "0.85rem",
          background: GRADIENT_BORDER,
          backgroundSize: "100% 300%",
          animation: "gradientFlow 2.8s ease infinite alternate",
        }} />

        {/* Contenido */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.45rem" }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1rem", fontWeight: 700, color: "#3A1140", margin: 0,
          }}>
            {t.nombreDisplay}
          </p>

          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.22rem" }}>
            {t.features.map((f) => (
              <li key={f.label} style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.68rem", color: "#555" }}>
                <span style={{ fontSize: "0.75rem" }}>{f.emoji}</span>
                <span>{f.label}</span>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "auto", paddingTop: "0.5rem", borderTop: "1px solid #F0E0E8" }}>
            <p style={{ fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#7A5C10", marginBottom: 2 }}>Precio</p>
            <p style={{ fontSize: "0.95rem", fontWeight: 800, color: "#3A1140", margin: 0 }}>
              {isColombia
                ? `$${(precios[t.id]?.cop ?? t.precioDefault.cop).toLocaleString("es-CO")} COP`
                : `$${precios[t.id]?.usd ?? t.precioDefault.usd} USD`}
            </p>
          </div>
        </div>
      </div>

      {/* Botón Ver plantilla */}
      <div style={{ padding: "0 1rem 1rem" }}>
        <div style={{
          width: "100%", fontWeight: 700, fontSize: "0.875rem",
          padding: "0.7rem 0", borderRadius: "0.875rem", textAlign: "center",
          backgroundColor: hovered ? "#3A1140" : "#5A1B5E",
          color: "#F8F5F0",
          transition: "background-color 0.22s ease",
          letterSpacing: "0.01em",
        }}>
          Ver plantilla →
        </div>
      </div>
    </article>
  );
}

export default function Catalogo({ onSelect, onBack }: CatalogoProps) {
  const [isColombia, setIsColombia] = useState(true);
  const [precios, setPrecios] = useState<Precios>({
    "01-dino": { cop: 70000, usd: 20 },
    "02-stork": { cop: 60000, usd: 18 },
    "03-space": { cop: 70000, usd: 20 },
    "04-Moderna": { cop: 80000, usd: 22 },
  });

  useEffect(() => {
    async function geolocalizar() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const json = await res.json();
        setIsColombia(json.country_code === "CO");
      } catch {
        try {
          const res = await fetch("https://ip-api.com/json");
          const json = await res.json();
          setIsColombia(json.countryCode === "CO");
        } catch {
          setIsColombia(true);
        }
      }
    }
    geolocalizar();

    async function cargarPrecios() {
      try {
        const { data } = await supabase
          .from("eventos")
          .select("datos")
          .eq("id", "config-precios")
          .maybeSingle();
        if (data?.datos?.precios) {
          setPrecios((prev) => ({ ...prev, ...data.datos.precios }));
        }
      } catch (err) {
        console.error("Error al cargar precios:", err);
      }
    }
    cargarPrecios();
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#F8F5F0",
        fontFamily: "'Poppins', sans-serif",
        color: "#2B2B2B",
      }}
    >
      {/* NAV — fondo blanco full-width (mismo que landing) */}
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid #F0E0E8",
          boxShadow: "0 1px 4px rgba(90,27,94,0.07)",
        }}
      >
        <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
          {onBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm font-semibold cursor-pointer transition-opacity hover:opacity-70"
              style={{ color: "#5A1B5E" }}
            >
              <span>←</span>
              <img
                src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1783378436/logo-celebrarte_bxkmva.png"
                alt="Celebrarte"
                className="h-7 w-auto"
              />
            </button>
          ) : (
            <img
              src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1783378436/logo-celebrarte_bxkmva.png"
              alt="Celebrarte"
              className="h-8 w-auto"
            />
          )}
          <a
            href={`https://wa.me/${WHATSAPP_CONTACTO}?text=${encodeURIComponent(WHATSAPP_MENSAJE)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold px-4 py-2 rounded-full border-2 transition-all hover:bg-[#5A1B5E] hover:text-white"
            style={{ borderColor: "#5A1B5E", color: "#5A1B5E" }}
          >
            💬 ¿Tienes dudas?
          </a>
        </nav>
      </header>

      {/* ENCABEZADO */}
      <div className="text-center px-6 pt-12 pb-14 max-w-2xl mx-auto">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: "#C49B3A" }}
        >
          Nuestras plantillas
        </p>
        <h1
          className="text-3xl md:text-4xl font-bold mb-3"
          style={{ fontFamily: "'Playfair Display', serif", color: "#5A1B5E" }}
        >
          Elige tu diseño
        </h1>
        <p className="text-sm leading-relaxed" style={{ opacity: 0.7 }}>
          Selecciona una plantilla, personalízala con tus datos y compártela al
          instante por WhatsApp.
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {CATALOGO.map((t) => (
            <TemplateCard
              key={t.id}
              t={t}
              onSelect={onSelect}
              isColombia={isColombia}
              precios={precios}
            />
          ))}
        </div>

        {/* CTA diseño personalizado */}
        <div
          className="mt-14 rounded-3xl p-7 sm:p-9 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ backgroundColor: "#3A1140" }}
        >
          <div className="space-y-2 text-center md:text-left">
            <h3
              className="text-lg font-bold"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#F8F5F0",
              }}
            >
              ¿Tienes una idea única en mente?
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#E8B4BC" }}>
              Creamos tu invitación digital desde cero con colores, temática y
              detalles completamente a tu gusto.
            </p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_CONTACTO}?text=${encodeURIComponent(
              "¡Hola! Me gustaría cotizar un diseño 100% personalizado para mi invitación digital."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold px-6 py-3 rounded-2xl transition-all cursor-pointer whitespace-nowrap text-sm text-center w-full md:w-auto hover:brightness-110"
            style={{ backgroundColor: "#C49B3A", color: "#F8F5F0" }}
          >
            Solicitar diseño a medida →
          </a>
        </div>
      </div>
    </div>
  );
}
