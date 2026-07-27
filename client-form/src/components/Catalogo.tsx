import { useEffect, useState } from "react";
import type { TemplateInfo } from "../types";
import { CATALOGO, WHATSAPP_CONTACTO, DEV_PORT_POR_TEMPLATE } from "../types";
import { supabase } from "../lib/supabase";

function previewSrc(t: TemplateInfo): string {
  if (import.meta.env.DEV && DEV_PORT_POR_TEMPLATE[t.id]) {
    const base = `http://localhost:${DEV_PORT_POR_TEMPLATE[t.id]}`;
    if (t.esFree) {
      return `${base}?titulo=%C2%A1Lleg%C3%B3+el+momento%0Ade+festejar%21&fecha=23+de+Julio&hora=6%3A00+PM&lugar=Calle+116+%2314-00%2C+Bogot%C3%A1&bg=fce7f3`;
    }
    return base;
  }
  return t.baseUrl;
}

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
  precioLabel,
}: {
  t: TemplateInfo;
  onSelect: (t: TemplateInfo) => void;
  precioLabel: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onClick={() => onSelect(t)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="js-card"
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
      {/* ── PREVIEW: imagen estática o iframe ── */}
      <div
        style={{
          height: "240px",
          background: t.gradiente,
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {t.previewImg ? (
          <img
            src={t.previewImg}
            alt={`Preview ${t.nombreDisplay}`}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center top",
              display: "block", pointerEvents: "none",
            }}
          />
        ) : (
          <iframe
            src={previewSrc(t)}
            title={`Preview ${t.nombreDisplay}`}
            scrolling="no"
            loading="eager"
            allow="autoplay 'none'"
            style={{
              width: "390px", height: "844px",
              border: "none",
              transform: "scale(0.64)",
              transformOrigin: "top center",
              pointerEvents: "none",
              display: "block",
              position: "absolute", top: 0, left: "50%", marginLeft: "-249px",
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
          zIndex: 1,
        }} />

        {/* Tag categoría — esquina superior derecha */}
        <span style={{
          position: "absolute", top: 12, right: 12, zIndex: 2,
          fontSize: "0.6rem", fontWeight: 800,
          textTransform: "uppercase", letterSpacing: "0.1em",
          padding: "4px 10px", borderRadius: "4px",
          backgroundColor: "rgba(0,0,0,0.55)",
          color: "white",
          backdropFilter: "blur(4px)",
        }}>
          {t.categoria}
        </span>
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
              {precioLabel}
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
  const [moneda, setMoneda] = useState<"cop" | "usd">("cop");
  const [tasaCambio, setTasaCambio] = useState<number | null>(null);
  const [precios, setPrecios] = useState<Precios>({
    "01-dino": { cop: 70000, usd: 20 },
    "02-stork": { cop: 60000, usd: 18 },
    "03-space": { cop: 70000, usd: 20 },
    "04-Moderna": { cop: 80000, usd: 22 },
  });

  useEffect(() => {
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

    // Tasa de cambio USD real del día
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((r) => r.json())
      .then((data) => { if (data?.rates?.COP) setTasaCambio(data.rates.COP); })
      .catch(() => {});
  }, []);

  function precioEnMoneda(t: TemplateInfo): string {
    const cop = precios[t.id]?.cop ?? t.precioDefault.cop;
    if (moneda === "cop") return `$${cop.toLocaleString("es-CO")} COP`;
    if (!tasaCambio) return "...";
    return `$${(cop / tasaCambio).toFixed(2)} USD`;
  }

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
        <p className="text-sm leading-relaxed mb-5" style={{ opacity: 0.7 }}>
          Selecciona una plantilla, personalízala con tus datos y compártela al
          instante por WhatsApp.
        </p>

        {/* Toggle COP / USD */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 4, backgroundColor: "#F0E0E8", borderRadius: 12, padding: 4 }}>
          <button
            type="button"
            onClick={() => setMoneda("cop")}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: "0.75rem", fontWeight: 700,
              padding: "6px 14px", borderRadius: 9,
              border: "none", cursor: "pointer",
              backgroundColor: moneda === "cop" ? "white" : "transparent",
              color: moneda === "cop" ? "#5A1B5E" : "#9B6B9B",
              boxShadow: moneda === "cop" ? "0 1px 4px rgba(90,27,94,0.15)" : "none",
              transition: "all 0.2s",
            }}
          >
            🇨🇴 COP
          </button>
          <button
            type="button"
            onClick={() => setMoneda("usd")}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: "0.75rem", fontWeight: 700,
              padding: "6px 14px", borderRadius: 9,
              border: "none", cursor: "pointer",
              backgroundColor: moneda === "usd" ? "white" : "transparent",
              color: moneda === "usd" ? "#5A1B5E" : "#9B6B9B",
              boxShadow: moneda === "usd" ? "0 1px 4px rgba(90,27,94,0.15)" : "none",
              transition: "all 0.2s",
            }}
          >
            🇺🇸 USD
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {CATALOGO.map((t) => (
            <TemplateCard
              key={t.id}
              t={t}
              onSelect={onSelect}
              precioLabel={precioEnMoneda(t)}
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
