import { useEffect, useState } from "react";
import type { TemplateInfo } from "../types";
import { CATALOGO, DEV_PORT_POR_TEMPLATE } from "../types";
import { supabase } from "../lib/supabase";

const BRAND = "#5A1B5E";
const WHATSAPP_CONTACTO = "573057502790";
const GRADIENT_BORDER = "linear-gradient(to bottom, #C49B3A, #5A1B5E, #E8B4BC, #7A2E8A, #C49B3A)";

function previewSrc(t: TemplateInfo): string {
  if (import.meta.env.DEV && DEV_PORT_POR_TEMPLATE[t.id]) {
    const base = `http://localhost:${DEV_PORT_POR_TEMPLATE[t.id]}`;
    if (t.esFree) return `${base}?titulo=%C2%A1Lleg%C3%B3+el+momento%0Ade+festejar%21&fecha=23+de+Julio&hora=6%3A00+PM&lugar=Casa+de+Mar%C3%ADa%2C+Bogot%C3%A1&bg=fce7f3`;
    return base;
  }
  return t.baseUrl;
}

// Evita el 301 redirect (/ → /demo) que descarta ?preview=1
// En dev: el SPA sirve todo desde root, ?preview=1 funciona directo
// En prod: /demo?preview=1 lo sirve la regla /* → index.html sin redirect
function previewSrcModal(t: TemplateInfo): string {
  if (import.meta.env.DEV && DEV_PORT_POR_TEMPLATE[t.id]) {
    return `http://localhost:${DEV_PORT_POR_TEMPLATE[t.id]}?preview=1`;
  }
  if (t.esFree) {
    const base = t.baseUrl;
    return `${base}?preview=1`;
  }
  return `${t.baseUrl}/demo?preview=1`;
}

// ── Iconos ────────────────────────────────────────────────────────────────────
function CategoryIcon({ category, size = 28, color = "#fff" }: { category: TemplateInfo["categoria"]; size?: number; color?: string }) {
  const s = { stroke: color, strokeWidth: 1.8, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (category === "Boda") return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="8" cy="9" r="4" {...s} /><circle cx="16" cy="9" r="4" {...s} />
      <path d="M8 13v7M16 13v7" {...s} />
    </svg>
  );
  if (category === "Cumpleaños") return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="10" width="16" height="9" rx="2" {...s} />
      <path d="M12 10V6M9 6h6" {...s} />
      <path d="M12 4.2c.8.5.8 1.2 0 1.8-.8-.6-.8-1.3 0-1.8Z" fill={color} stroke="none" />
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 13c0-4 2.8-7 8-7s8 3 8 7v5H4z" {...s} />
      <path d="M8 10c.7-1 1.6-1.5 2.6-1.5M16 10c-.7-1-1.6-1.5-2.6-1.5M12 14v5" {...s} />
    </svg>
  );
}

function FeatureIcon({ label, size = 14 }: { label: string; size?: number }) {
  const text = label.toLowerCase();
  const s = { stroke: "#5f4d73", strokeWidth: 1.8, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (text.includes("sobre")) return <svg width={size} height={size} viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2" {...s} /><path d="M4 8l8 6 8-6" {...s} /></svg>;
  if (text.includes("muro") || text.includes("firma")) return <svg width={size} height={size} viewBox="0 0 24 24"><path d="M4 6h16v10H9l-5 4V6z" {...s} /></svg>;
  if (text.includes("rsvp") || text.includes("confirm")) return <svg width={size} height={size} viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" {...s} /><path d="M8 12l3 3 5-6" {...s} /></svg>;
  if (text.includes("cuenta") || text.includes("countdown")) return <svg width={size} height={size} viewBox="0 0 24 24"><circle cx="12" cy="13" r="7" {...s} /><path d="M12 13l3-2M9 3h6" {...s} /></svg>;
  if (text.includes("mapa") || text.includes("ubic")) return <svg width={size} height={size} viewBox="0 0 24 24"><path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2z" {...s} /><path d="M9 4v14M15 6v14" {...s} /></svg>;
  if (text.includes("música") || text.includes("musica")) return <svg width={size} height={size} viewBox="0 0 24 24"><path d="M10 18V7l9-2v11" {...s} /><circle cx="8" cy="18" r="2" {...s} /><circle cx="19" cy="16" r="2" {...s} /></svg>;
  return <svg width={size} height={size} viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" {...s} /></svg>;
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ t, precioLabel, onClose, onPersonalizar }: {
  t: TemplateInfo; precioLabel: string; onClose: () => void; onPersonalizar: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, []);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(10,4,20,0.82)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <style>{`
        @keyframes hp-modalIn { from { opacity:0; transform:scale(0.94) translateY(12px); } to { opacity:1; transform:none; } }
        .hp-modal-shell {
          background:#fff; width:100%; max-width:760px;
          height:min(90dvh,760px); max-height:90dvh; overflow:hidden;
          border-radius:24px; display:flex; flex-direction:row;
          box-shadow:0 32px 80px rgba(0,0,0,0.55);
          animation:hp-modalIn 0.22s ease;
        }
        .hp-modal-preview { display:flex !important; }
        .hp-modal-hero    { display:none !important; }
        @media (max-width:640px) {
          .hp-modal-shell {
            flex-direction:column; width:100%; max-width:100%;
            height:92dvh; max-height:92dvh; border-radius:22px;
          }
          .hp-modal-preview { display:none !important; }
          .hp-modal-hero    { display:block !important; height:58% !important; min-height:58% !important; max-height:58% !important; }
          .hp-modal-details { height:42% !important; overflow-y:auto; }
          .hp-modal-features { display:none !important; }
          .hp-modal-actions button { border-radius:999px !important; }
          .hp-modal-actions a      { border-radius:999px !important; }
        }
      `}</style>

      <div onClick={(e) => e.stopPropagation()} className="hp-modal-shell">
        {/* Preview izquierda — solo desktop */}
        <div className="hp-modal-preview" style={{
          width: 300, flexShrink: 0, background: t.gradiente,
          position: "relative", overflow: "hidden",
          alignItems: "center", justifyContent: "center", display: "none",
        }}>
          <iframe
            src={previewSrcModal(t)}
            title={`Preview ${t.nombreDisplay}`}
            scrolling="no" allow="autoplay 'none'"
            style={{ width: 390, height: 844, border: "none", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) scale(0.72)", transformOrigin: "center center", pointerEvents: "none" }}
            loading="eager"
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)" }} />
          <span style={{ position: "absolute", bottom: 16, left: 16, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 20, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {t.categoria}
          </span>
        </div>

        {/* Info panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          {/* Hero mobile — iframe con URL directa /demo?preview=1 (sin redirect) */}
          <div className="hp-modal-hero" style={{
            display: "none", background: t.gradiente,
            position: "relative", overflow: "hidden", flexShrink: 0,
          }}>
            <iframe
              key={t.id}
              src={previewSrcModal(t)}
              title={`Preview ${t.nombreDisplay}`}
              scrolling="no"
              allow="autoplay; encrypted-media"
              style={{
                width: 390, height: 844, border: "none",
                position: "absolute",
                top: 0, left: "50%",
                transform: "translateX(-50%) scale(0.56)",
                transformOrigin: "top center",
                pointerEvents: "none",
              }}
              loading="eager"
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)" }} />
            <span style={{ position: "absolute", bottom: 10, left: 14, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {t.categoria}
            </span>
          </div>

          {/* Detalles */}
          <div className="hp-modal-details" style={{ display: "flex", flexDirection: "column", minHeight: 0, flex: 1 }}>
            {/* Header */}
            <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid #f0eaf5", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
              <div>
                <CategoryIcon category={t.categoria} size={28} color="#3A1140" />
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#1A0A20", margin: "4px 0 3px" }}>{t.nombreDisplay}</h2>
                <p style={{ fontSize: 12, color: "#7a6890", margin: 0 }}>{t.descripcion}</p>
              </div>
              <button onClick={onClose} style={{ background: "#f5f0fa", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 16, color: "#9b8aa8", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            {/* Precio */}
            <div style={{ padding: "12px 20px", borderBottom: "1px solid #f9f0fb", flexShrink: 0 }}>
              <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#C49B3A", marginBottom: 2 }}>Precio</p>
              <p style={{ fontSize: 21, fontWeight: 800, color: "#3A1140", margin: 0 }}>{precioLabel}</p>
              {t.esFree && <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 700 }}>¡Totalmente gratis!</span>}
            </div>

            {/* Features */}
            <div className="hp-modal-features" style={{ padding: "12px 20px", flex: 1 }}>
              <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9b8aa8", marginBottom: 8 }}>Incluye</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px" }}>
                {t.features.map((f) => (
                  <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#444" }}>
                    <FeatureIcon label={f.label} />
                    <span>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones */}
            <div className="hp-modal-actions" style={{ padding: "12px 20px 14px", borderTop: "1px solid #f0eaf5", display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
              <button onClick={onPersonalizar} style={{ width: "100%", padding: "13px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#5A1B5E,#7A2E8A)", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 16px rgba(90,27,94,0.3)" }}>
                Personalizar esta invitación →
              </button>
              <a href={`${t.baseUrl}/demo`} target="_blank" rel="noopener noreferrer" style={{ width: "100%", padding: "11px 0", borderRadius: 12, border: "1.5px solid #e0d0ea", background: "#fff", color: BRAND, fontWeight: 700, fontSize: 13, textAlign: "center", textDecoration: "none", display: "block" }}>
                Ver demo completo ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Card desktop ──────────────────────────────────────────────────────────────
function DesktopCard({ t, onSelect, precioLabel }: { t: TemplateInfo; onSelect: () => void; precioLabel: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <article
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="js-card"
      style={{
        backgroundColor: "white", borderRadius: "1rem", overflow: "hidden",
        display: "flex", flexDirection: "column", cursor: "pointer",
        transform: hovered ? "translateY(-8px)" : "none",
        boxShadow: hovered ? "0 20px 48px rgba(90,27,94,0.18), 0 4px 12px rgba(90,27,94,0.08)" : "0 2px 8px rgba(90,27,94,0.07)",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)", border: "1px solid #EDD5E8",
      }}
    >
      <div style={{ height: 240, background: t.gradiente, position: "relative", overflow: "hidden", flexShrink: 0 }}>
        {t.previewImg ? (
          <img src={t.previewImg} alt={`Preview ${t.nombreDisplay}`} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block", pointerEvents: "none" }} />
        ) : (
          <iframe
            src={previewSrc(t)} title={`Preview ${t.nombreDisplay}`}
            scrolling="no" loading="eager" allow="autoplay 'none'"
            style={{ width: 390, height: 844, border: "none", transform: "scale(0.64)", transformOrigin: "top center", pointerEvents: "none", display: "block", position: "absolute", top: 0, left: "50%", marginLeft: -249 }}
          />
        )}
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(30,10,40,0.38)", opacity: hovered ? 1 : 0, transition: "opacity 0.3s", pointerEvents: "none", zIndex: 1 }} />
        <span style={{ position: "absolute", top: 12, right: 12, zIndex: 2, fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", padding: "4px 10px", borderRadius: 4, backgroundColor: "rgba(0,0,0,0.55)", color: "white", backdropFilter: "blur(4px)" }}>
          {t.categoria}
        </span>
      </div>

      <div style={{ display: "flex", flex: 1, padding: "1rem" }}>
        <div style={{ width: 3, borderRadius: 3, flexShrink: 0, marginRight: "0.85rem", background: GRADIENT_BORDER, backgroundSize: "100% 300%", animation: "hp-gradientFlow 2.8s ease infinite alternate" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.45rem" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#3A1140", margin: 0 }}>{t.nombreDisplay}</p>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.22rem" }}>
            {t.features.map((f) => (
              <li key={f.label} style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.68rem", color: "#555" }}>
                <FeatureIcon label={f.label} size={12} /><span>{f.label}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "auto", paddingTop: "0.5rem", borderTop: "1px solid #F0E0E8" }}>
            <p style={{ fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#7A5C10", marginBottom: 2 }}>Precio</p>
            <p style={{ fontSize: "0.95rem", fontWeight: 800, color: "#3A1140", margin: 0 }}>{precioLabel}</p>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 1rem 1rem" }}>
        <div style={{ width: "100%", fontWeight: 700, fontSize: "0.875rem", padding: "0.7rem 0", borderRadius: "0.875rem", textAlign: "center", backgroundColor: hovered ? "#3A1140" : BRAND, color: "#F8F5F0", transition: "background-color 0.22s ease" }}>
          Ver plantilla →
        </div>
      </div>
    </article>
  );
}

// ── Card mobile ───────────────────────────────────────────────────────────────
function MobileCard({ t, onSelect, precioLabel }: { t: TemplateInfo; onSelect: () => void; precioLabel: string }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="js-card"
      style={{
        display: "flex", flexDirection: "row", alignItems: "center",
        background: "#fff", border: "1px solid #ede0f5",
        borderRadius: 16, cursor: "pointer",
        boxShadow: "0 2px 10px rgba(90,27,94,0.07)",
        width: "100%", padding: 8, gap: 10, textAlign: "left",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div style={{
        width: 66, height: 66, borderRadius: 999, background: t.gradiente,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden", flexShrink: 0,
        border: "1px solid #e8dcef",
      }}>
        {t.previewImg ? (
          <img src={t.previewImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
        ) : (
          <CategoryIcon category={t.categoria} size={34} />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#1A0A20", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {t.nombreDisplay}
        </p>
        <p style={{ margin: 0, fontSize: 11, color: "#7a6890" }}>{t.categoria}</p>
        <p style={{ margin: "2px 0 0", fontSize: 12, fontWeight: 800, color: t.esFree ? "#16a34a" : "#3A1140" }}>{precioLabel}</p>
      </div>

      <div style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid #e6d7ef", display: "flex", alignItems: "center", justifyContent: "center", color: BRAND, fontSize: 16, fontWeight: 900, flexShrink: 0 }}>
        ›
      </div>
    </button>
  );
}

// ── Principal ─────────────────────────────────────────────────────────────────
interface Precios { [id: string]: { cop: number } }

export default function HomePlantillas() {
  const [modal, setModal] = useState<TemplateInfo | null>(null);
  const [moneda, setMoneda] = useState<"cop" | "usd">("cop");
  const [precios, setPrecios] = useState<Precios>({
    "01-dino":    { cop: 87000 },
    "02-stork":   { cop: 65000 },
    "03-space":   { cop: 75000 },
    "04-Moderna": { cop: 75000 },
  });
  const [tasaCambio, setTasaCambio] = useState<number | null>(null);

  useEffect(() => {
    supabase.from("eventos").select("datos").eq("id", "config-precios").maybeSingle()
      .then(({ data }) => {
        if (data?.datos?.precios) setPrecios((p) => ({ ...p, ...data.datos.precios }));
      }, () => {});
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((r) => r.json())
      .then((d) => { if (d?.rates?.COP) setTasaCambio(d.rates.COP); })
      .catch(() => {});
  }, []);

  function precioLabel(t: TemplateInfo): string {
    if (t.esFree) return "¡Gratis!";
    const cop = precios[t.id]?.cop ?? t.precioDefault.cop;
    if (moneda === "cop") return `$${cop.toLocaleString("es-CO")} COP`;
    if (!tasaCambio) return "...";
    return `$${(cop / tasaCambio).toFixed(2)} USD`;
  }

  function handlePersonalizar(t: TemplateInfo) {
    sessionStorage.setItem("openTemplate", t.id);
    window.location.href = "/plantillas";
  }

  return (
    <div>
      <style>{`
        @keyframes hp-gradientFlow { from { background-position:0% 0%; } to { background-position:0% 100%; } }
        .hp-mobile  { display:flex; flex-direction:column; gap:10px; }
        .hp-desktop { display:none; }
        @media (min-width:641px) {
          .hp-mobile  { display:none !important; }
          .hp-desktop { display:grid !important; grid-template-columns:repeat(3,1fr); gap:24px; }
        }
      `}</style>

      {/* Toggle moneda */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#F0E0E8", borderRadius: 12, padding: 4 }}>
          {(["cop", "usd"] as const).map((m) => (
            <button key={m} type="button" onClick={() => setMoneda(m)} style={{
              fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 9,
              border: "none", cursor: "pointer",
              background: moneda === m ? "white" : "transparent",
              color: moneda === m ? BRAND : "#9B6B9B",
              boxShadow: moneda === m ? "0 1px 4px rgba(90,27,94,0.15)" : "none",
              transition: "all 0.2s",
            }}>
              {m.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile list */}
      <div className="hp-mobile">
        {CATALOGO.map((t) => (
          <MobileCard key={t.id} t={t} onSelect={() => setModal(t)} precioLabel={precioLabel(t)} />
        ))}
      </div>

      {/* Desktop grid */}
      <div className="hp-desktop">
        {CATALOGO.map((t) => (
          <DesktopCard key={t.id} t={t} onSelect={() => setModal(t)} precioLabel={precioLabel(t)} />
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <Modal
          t={modal}
          precioLabel={precioLabel(modal)}
          onClose={() => setModal(null)}
          onPersonalizar={() => handlePersonalizar(modal)}
        />
      )}
    </div>
  );
}
