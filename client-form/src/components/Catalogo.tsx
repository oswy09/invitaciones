import { useEffect, useRef, useState } from "react";
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

// Usa /demo?preview=1 directo para evitar el 301 (/ → /demo) que descarta query params
function previewSrcForModal(t: TemplateInfo): string {
  if (import.meta.env.DEV && DEV_PORT_POR_TEMPLATE[t.id]) {
    return `http://localhost:${DEV_PORT_POR_TEMPLATE[t.id]}?preview=1`;
  }
  if (t.esFree) return `${t.baseUrl}?preview=1`;
  return `${t.baseUrl}/demo?preview=1`;
}

const WHATSAPP_MENSAJE = "¡Hola! Tengo una duda sobre las invitaciones digitales antes de hacer mi pedido.";

interface CatalogoProps {
  onSelect: (template: TemplateInfo) => void;
  onBack?: () => void;
}

function CategoryStrokeIcon({ category, size = 28, color = "#2f1b3a" }: { category: TemplateInfo["categoria"]; size?: number; color?: string }) {
  const stroke = { stroke: color, strokeWidth: 1.8, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  if (category === "Boda") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="8" cy="9" r="4" {...stroke} />
        <circle cx="16" cy="9" r="4" {...stroke} />
        <path d="M8 13v7M16 13v7" {...stroke} />
      </svg>
    );
  }

  if (category === "Cumpleaños") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="10" width="16" height="9" rx="2" {...stroke} />
        <path d="M12 10V6" {...stroke} />
        <path d="M9 6h6" {...stroke} />
        <path d="M12 4.2c.8.5.8 1.2 0 1.8-.8-.6-.8-1.3 0-1.8Z" fill={color} stroke="none" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 13c0-4 2.8-7 8-7s8 3 8 7v5H4z" {...stroke} />
      <path d="M8 10c.7-1 1.6-1.5 2.6-1.5M16 10c-.7-1-1.6-1.5-2.6-1.5" {...stroke} />
      <path d="M12 14v5" {...stroke} />
    </svg>
  );
}

function FeatureStrokeIcon({ label, size = 14 }: { label: string; size?: number }) {
  const text = label.toLowerCase();
  const stroke = { stroke: "#5f4d73", strokeWidth: 1.8, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  if (text.includes("sobre")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="6" width="18" height="12" rx="2" {...stroke} />
        <path d="M4 8l8 6 8-6" {...stroke} />
      </svg>
    );
  }
  if (text.includes("muro") || text.includes("firma")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h16v10H9l-5 4V6z" {...stroke} />
      </svg>
    );
  }
  if (text.includes("rsvp") || text.includes("confirm")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="3" {...stroke} />
        <path d="M8 12l3 3 5-6" {...stroke} />
      </svg>
    );
  }
  if (text.includes("cuenta") || text.includes("countdown")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="13" r="7" {...stroke} />
        <path d="M12 13l3-2" {...stroke} />
        <path d="M9 3h6" {...stroke} />
      </svg>
    );
  }
  if (text.includes("mapa") || text.includes("ubic")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2z" {...stroke} />
        <path d="M9 4v14M15 6v14" {...stroke} />
      </svg>
    );
  }
  if (text.includes("música") || text.includes("musica")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 18V7l9-2v11" {...stroke} />
        <circle cx="8" cy="18" r="2" {...stroke} />
        <circle cx="19" cy="16" r="2" {...stroke} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" {...stroke} />
    </svg>
  );
}

// ── Dropdown Nav ─────────────────────────────────────────────────────────────
function NavCategories() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const cats = [
    { label: "Baby Shower", href: "/baby-shower" },
    { label: "Bodas",       href: "/boda" },
    { label: "Cumpleaños",  href: "/cumpleanos" },
  ];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 13, fontWeight: 700, color: "#5A1B5E",
          display: "flex", alignItems: "center", gap: 5, padding: "4px 0",
        }}
      >
        Categorías
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path d="M2 4l4 4 4-4" stroke="#5A1B5E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 10px)", right: 0,
          background: "#fff", borderRadius: 14, border: "1px solid #ede0f5",
          boxShadow: "0 8px 32px rgba(90,27,94,0.15)", minWidth: 180,
          padding: "6px 0", zIndex: 300,
          animation: "dropIn 0.18s ease",
        }}>
          {cats.map((c) => (
            <a
              key={c.href}
              href={c.href}
              onClick={() => setOpen(false)}
              style={{
                display: "block", padding: "10px 18px",
                fontSize: 13, fontWeight: 600, color: "#3A1140",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f9f0fb")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              {c.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Modal de plantilla ────────────────────────────────────────────────────────
function ModalPlantilla({
  t,
  precioLabel,
  onClose,
  onPersonalizar,
}: {
  t: TemplateInfo;
  precioLabel: string;
  onClose: () => void;
  onPersonalizar: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  const compactFeatures = t.features.slice(0, 4);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(10,4,20,0.82)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
    >
      <style>{`
        @keyframes modalIn { from { opacity:0; transform:scale(0.94) translateY(12px); } to { opacity:1; transform:none; } }
        @keyframes dropIn  { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:none; } }
        .modal-shell {
          background:#fff; width:100%; max-width:760px;
          height:min(90dvh, 760px); max-height:90dvh; overflow:hidden;
          border-radius:24px;
          display:flex; flex-direction:row;
          box-shadow:0 32px 80px rgba(0,0,0,0.55);
          animation: modalIn 0.22s ease;
        }
        .modal-preview { display:flex !important; }
        .modal-info-panel { display:flex; flex-direction:column; min-height:0; }
        .modal-features-desktop { display:block; }
        .modal-features-mobile { display:none; }
        .modal-desc-full { display:block; }
        .modal-desc-compact { display:none; }
        @media (max-width: 640px) {
          .modal-shell {
            display:flex;
            flex-direction:column;
            width:100%;
            max-width:100%;
            height:92dvh;
            max-height:92dvh;
            border-radius:22px;
          }
          .modal-preview { display:none !important; }
          .modal-info-panel {
            overflow:hidden !important;
          }
          .modal-hero-mobile {
            display:block !important;
            height:60% !important;
            min-height:60% !important;
            max-height:60% !important;
          }
          .modal-details-mobile {
            height:40% !important;
            min-height:40% !important;
            max-height:40% !important;
            overflow-y:auto;
          }
          .modal-features-section { display:none !important; }
          .modal-header-mobile { padding: 10px 14px 8px !important; }
          .modal-price-mobile { padding: 8px 14px !important; }
          .modal-actions-mobile { padding: 10px 14px 12px !important; gap: 7px !important; }
          .modal-actions-mobile button { padding: 11px 0 !important; border-radius: 999px !important; font-size: 14px !important; }
          .modal-actions-mobile a { padding: 10px 0 !important; border-radius: 999px !important; font-size: 12px !important; }
          .modal-features-desktop { display:none !important; }
          .modal-features-mobile { display:block !important; }
          .modal-desc-full { display:none !important; }
          .modal-desc-compact { display:block !important; }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-shell"
      >
        {/* sin drag handle */}

        {/* Preview izquierda (solo desktop) */}
        <div className="modal-preview" style={{
          width: 300, flexShrink: 0,
          background: t.gradiente, position: "relative",
          overflow: "hidden", display: "none",
          alignItems: "center", justifyContent: "center",
        }}>
          <iframe
            src={previewSrc(t)}
            title={`Preview ${t.nombreDisplay}`}
            scrolling="no"
            allow="autoplay 'none'"
            style={{
              width: "390px",
              height: "844px",
              border: "none",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) scale(0.72)",
              transformOrigin: "center center",
              pointerEvents: "none",
            }}
            loading="eager"
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)" }} />
          <span style={{
            position: "absolute", bottom: 16, left: 16,
            background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
            color: "#fff", fontSize: 11, fontWeight: 800,
            padding: "4px 10px", borderRadius: 20, letterSpacing: "0.08em", textTransform: "uppercase",
          }}>
            {t.categoria}
          </span>
        </div>

        {/* Info panel */}
        <div className="modal-info-panel" style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", minHeight: 0 }}>
          {/* Hero mobile: imagen compacta arriba */}
          <div className="modal-hero-mobile" style={{
            display: "none", height: 120, flexShrink: 0,
            background: t.gradiente, position: "relative", overflow: "hidden",
          }}>
            <style>{`@media (max-width:640px) { .modal-hero-mobile { display:block !important; } }`}</style>
            {t.previewImg ? (
              <img
                src={t.previewImg}
                alt={`Preview ${t.nombreDisplay}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
              />
            ) : (
              <iframe
                key={t.id}
                src={previewSrcForModal(t)}
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
            )}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)" }} />
            <span style={{
              position: "absolute", bottom: 10, left: 14,
              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
              color: "#fff", fontSize: 10, fontWeight: 800,
              padding: "3px 10px", borderRadius: 20, letterSpacing: "0.1em", textTransform: "uppercase",
            }}>
              {t.categoria}
            </span>
          </div>

          <div className="modal-details-mobile" style={{ display: "flex", flexDirection: "column", minHeight: 0, overflowY: "auto" }}>
          {/* Header */}
          <div className="modal-header-mobile" style={{ padding: "18px 20px 14px", borderBottom: "1px solid #f0eaf5", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
            <div>
              <div style={{ marginBottom: 4 }}>
                <CategoryStrokeIcon category={t.categoria} size={28} color="#3A1140" />
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#1A0A20", margin: "4px 0 3px" }}>
                {t.nombreDisplay}
              </h2>
              <p className="modal-desc-full" style={{ fontSize: 12, color: "#7a6890", margin: 0 }}>{t.descripcion}</p>
              <p className="modal-desc-compact" style={{ fontSize: 11, color: "#7a6890", margin: 0 }}>
                {t.categoria} • {t.features.length} módulos
              </p>
            </div>
            <button onClick={onClose}
              style={{ background: "#f5f0fa", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 16, color: "#9b8aa8", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              ✕
            </button>
          </div>

          {/* Precio */}
          <div className="modal-price-mobile" style={{ padding: "12px 20px", borderBottom: "1px solid #f9f0fb", flexShrink: 0 }}>
            <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#C49B3A", marginBottom: 2 }}>Precio</p>
            <p style={{ fontSize: 21, fontWeight: 800, color: "#3A1140", margin: 0 }}>{precioLabel}</p>
            {t.esFree && <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 700 }}>¡Totalmente gratis!</span>}
          </div>

          {/* Features */}
          <div className="modal-features-section" style={{ padding: "12px 20px", flex: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9b8aa8", marginBottom: 8 }}>Incluye</p>
            <div className="modal-features-desktop" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px" }}>
              {t.features.map((f) => (
                <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#444" }}>
                  <FeatureStrokeIcon label={f.label} />
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
            <div className="modal-features-mobile" style={{ display: "none" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 10px" }}>
                {compactFeatures.map((f) => (
                  <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#4b4453" }}>
                    <FeatureStrokeIcon label={f.label} size={13} />
                    <span>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="modal-actions-mobile" style={{ padding: "12px 20px 14px", borderTop: "1px solid #f0eaf5", display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
            <button
              onClick={onPersonalizar}
              style={{ width: "100%", padding: "13px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#5A1B5E,#7A2E8A)", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 16px rgba(90,27,94,0.3)" }}
            >
              Personalizar esta invitación →
            </button>
            <a
              href={`${t.baseUrl}/demo`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ width: "100%", padding: "11px 0", borderRadius: 12, border: "1.5px solid #e0d0ea", background: "#fff", color: "#5A1B5E", fontWeight: 700, fontSize: 13, cursor: "pointer", textAlign: "center", textDecoration: "none", display: "block" }}
            >
              Ver demo completo ↗
            </a>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Precios {
  [id: string]: { cop: number; usd: number };
}

const GRADIENT_BORDER = "linear-gradient(to bottom, #C49B3A, #5A1B5E, #E8B4BC, #7A2E8A, #C49B3A)";

// ── Card desktop ──────────────────────────────────────────────────────────────
function TemplateCard({
  t, onSelect, precioLabel,
}: { t: TemplateInfo; onSelect: (t: TemplateInfo) => void; precioLabel: string; }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onClick={() => onSelect(t)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "white", borderRadius: "1rem", overflow: "hidden",
        display: "flex", flexDirection: "column", cursor: "pointer",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 20px 48px rgba(90,27,94,0.18), 0 4px 12px rgba(90,27,94,0.08)"
          : "0 2px 8px rgba(90,27,94,0.07)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: "1px solid #EDD5E8",
      }}
    >
      <div style={{ height: 240, background: t.gradiente, position: "relative", overflow: "hidden", flexShrink: 0 }}>
        {t.previewImg ? (
          <img src={t.previewImg} alt={`Preview ${t.nombreDisplay}`}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block", pointerEvents: "none" }} />
        ) : (
          <iframe
            src={previewSrc(t)}
            title={`Preview ${t.nombreDisplay}`}
            scrolling="no" loading="eager" allow="autoplay 'none'"
            style={{ width: "390px", height: "844px", border: "none", transform: "scale(0.64)", transformOrigin: "top center", pointerEvents: "none", display: "block", position: "absolute", top: 0, left: "50%", marginLeft: "-249px" }}
          />
        )}
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(30,10,40,0.38)", opacity: hovered ? 1 : 0, transition: "opacity 0.3s ease", pointerEvents: "none", zIndex: 1 }} />
        <span style={{ position: "absolute", top: 12, right: 12, zIndex: 2, fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", padding: "4px 10px", borderRadius: "4px", backgroundColor: "rgba(0,0,0,0.55)", color: "white", backdropFilter: "blur(4px)" }}>
          {t.categoria}
        </span>
      </div>

      <div style={{ display: "flex", flex: 1, padding: "1rem" }}>
        <div style={{ width: 3, borderRadius: 3, flexShrink: 0, marginRight: "0.85rem", background: GRADIENT_BORDER, backgroundSize: "100% 300%", animation: "gradientFlow 2.8s ease infinite alternate" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.45rem" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#3A1140", margin: 0 }}>
            {t.nombreDisplay}
          </p>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.22rem" }}>
            {t.features.map((f) => (
              <li key={f.label} style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.68rem", color: "#555" }}>
                <FeatureStrokeIcon label={f.label} size={12} />
                <span>{f.label}</span>
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
        <div style={{ width: "100%", fontWeight: 700, fontSize: "0.875rem", padding: "0.7rem 0", borderRadius: "0.875rem", textAlign: "center", backgroundColor: hovered ? "#3A1140" : "#5A1B5E", color: "#F8F5F0", transition: "background-color 0.22s ease", letterSpacing: "0.01em" }}>
          Ver plantilla →
        </div>
      </div>
    </article>
  );
}

// ── Card mobile (estilo app) ──────────────────────────────────────────────────
function MobileCard({
  t, onSelect, precioLabel,
}: { t: TemplateInfo; onSelect: (t: TemplateInfo) => void; precioLabel: string; }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(t)}
      style={{
        display: "flex", flexDirection: "row", alignItems: "center",
        background: "#fff", border: "1px solid #ede0f5",
        borderRadius: 16, cursor: "pointer",
        boxShadow: "0 2px 10px rgba(90,27,94,0.07)",
        width: "100%", padding: 8,
        gap: 10, textAlign: "left",
        WebkitTapHighlightColor: "transparent",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 24px rgba(90,27,94,0.18)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(90,27,94,0.08)")}
    >
      {/* Mini preview */}
      <div style={{
        width: 64, height: 64, borderRadius: 999, background: t.gradiente,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden", flexShrink: 0,
        border: "1px solid #e8dcef",
      }}>
        {t.previewImg ? (
          <img src={t.previewImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
        ) : (
          <CategoryStrokeIcon category={t.categoria} size={34} color="#ffffff" />
        )}
      </div>

      {/* Info compacta */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#1A0A20", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {t.nombreDisplay}
        </p>
        <p style={{ margin: 0, fontSize: 11, color: "#7a6890", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {t.categoria}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: 12, fontWeight: 800, color: "#3A1140" }}>
          {precioLabel}
        </p>
      </div>

      <div style={{
        width: 26, height: 26, borderRadius: "50%", border: "1px solid #e6d7ef",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#5A1B5E", fontSize: 14, fontWeight: 900, flexShrink: 0,
      }}>
        ›
      </div>
    </button>
  );
}

type CategoriaFiltro = "Todas" | TemplateInfo["categoria"];

function FiltroCategorias({
  value,
  onChange,
}: {
  value: CategoriaFiltro;
  onChange: (next: CategoriaFiltro) => void;
}) {
  const categorias = Array.from(new Set(CATALOGO.map((t) => t.categoria))) as TemplateInfo["categoria"][];
  const opciones: CategoriaFiltro[] = ["Todas", ...categorias];

  return (
    <div style={{
      display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2,
      WebkitOverflowScrolling: "touch", scrollbarWidth: "none",
    }}>
      {opciones.map((op) => {
        const activo = value === op;
        return (
          <button
            key={op}
            type="button"
            onClick={() => onChange(op)}
            style={{
              borderRadius: 999,
              border: activo ? "1.5px solid #5A1B5E" : "1px solid #e3d6ec",
              background: activo ? "#5A1B5E" : "#fff",
              color: activo ? "#fff" : "#6d5b7f",
              padding: "7px 12px",
              fontSize: 11,
              fontWeight: 700,
              whiteSpace: "nowrap",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {op}
          </button>
        );
      })}
    </div>
  );
}

// ── Catalogo principal ────────────────────────────────────────────────────────
export default function Catalogo({ onSelect, onBack }: CatalogoProps) {
  const [modalTemplate, setModalTemplate] = useState<TemplateInfo | null>(null);
  const [moneda, setMoneda] = useState<"cop" | "usd">("cop");
  const [categoriaFiltro, setCategoriaFiltro] = useState<CategoriaFiltro>("Todas");
  const [tasaCambio, setTasaCambio] = useState<number | null>(null);
  const [precios, setPrecios] = useState<Precios>({
    "01-dino":    { cop: 70000, usd: 20 },
    "02-stork":   { cop: 60000, usd: 18 },
    "03-space":   { cop: 70000, usd: 20 },
    "04-Moderna": { cop: 80000, usd: 22 },
  });

  useEffect(() => {
    async function cargarPrecios() {
      try {
        const { data } = await supabase
          .from("eventos").select("datos").eq("id", "config-precios").maybeSingle();
        if (data?.datos?.precios) setPrecios((prev) => ({ ...prev, ...data.datos.precios }));
      } catch {}
    }
    cargarPrecios();
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((r) => r.json())
      .then((data) => { if (data?.rates?.COP) setTasaCambio(data.rates.COP); })
      .catch(() => {});
  }, []);

  function precioEnMoneda(t: TemplateInfo): string {
    if (t.esFree) return "¡Gratis!";
    const cop = precios[t.id]?.cop ?? t.precioDefault.cop;
    if (moneda === "cop") return `$${cop.toLocaleString("es-CO")} COP`;
    if (!tasaCambio) return "...";
    return `$${(cop / tasaCambio).toFixed(2)} USD`;
  }

  const plantillasFiltradas = categoriaFiltro === "Todas"
    ? CATALOGO
    : CATALOGO.filter((t) => t.categoria === categoriaFiltro);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F5F0", fontFamily: "'Poppins', sans-serif", color: "#2B2B2B" }}>
      {/* ── ENCABEZADO ── */}
      <div style={{ textAlign: "center", padding: "40px 20px 36px", maxWidth: 640, margin: "0 auto" }}>
        <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C49B3A", marginBottom: 10 }}>
          Nuestras plantillas
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px,5vw,38px)", fontWeight: 700, color: "#5A1B5E", margin: "0 0 10px" }}>
          Elige tu diseño
        </h1>
        <p style={{ fontSize: 14, color: "#7a6890", margin: "0 0 18px", lineHeight: 1.6 }}>
          Selecciona una plantilla, personalízala con tus datos y compártela por WhatsApp.
        </p>

        {/* Toggle COP/USD */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#F0E0E8", borderRadius: 12, padding: 4 }}>
          {(["cop", "usd"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMoneda(m)}
              style={{
                fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 9,
                border: "none", cursor: "pointer",
                background: moneda === m ? "white" : "transparent",
                color: moneda === m ? "#5A1B5E" : "#9B6B9B",
                boxShadow: moneda === m ? "0 1px 4px rgba(90,27,94,0.15)" : "none",
                transition: "all 0.2s",
              }}
            >
              {m === "cop" ? "COP" : "USD"}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 14 }}>
          <FiltroCategorias value={categoriaFiltro} onChange={setCategoriaFiltro} />
        </div>
      </div>

      {/* ── GRIDS ── */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 16px 80px" }}>
        {/* Desktop grid (≥ 640px): igual que antes, 3 columnas */}
        <div className="desktop-grid" style={{ display: "none" }}>
          <style>{`@media (min-width:641px) { .desktop-grid { display:grid !important; grid-template-columns:repeat(3,1fr); gap:24px; } .mobile-grid { display:none !important; } }`}</style>
          {plantillasFiltradas.map((t) => (
            <TemplateCard key={t.id} t={t} onSelect={(tmpl) => setModalTemplate(tmpl)} precioLabel={precioEnMoneda(t)} />
          ))}
        </div>

        {/* Mobile list (< 641px): estilo app compacto */}
        <div className="mobile-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
          {plantillasFiltradas.map((t) => (
            <MobileCard key={t.id} t={t} onSelect={(tmpl) => setModalTemplate(tmpl)} precioLabel={precioEnMoneda(t)} />
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalTemplate && (
        <ModalPlantilla
          t={modalTemplate}
          precioLabel={precioEnMoneda(modalTemplate)}
          onClose={() => setModalTemplate(null)}
          onPersonalizar={() => { setModalTemplate(null); onSelect(modalTemplate); }}
        />
      )}

      {/* CTA diseño a medida */}
      <div style={{ maxWidth: 1000, margin: "0 auto 80px", padding: "0 16px" }}>
        <div style={{ background: "#3A1140", borderRadius: 24, padding: "28px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#F8F5F0", margin: "0 0 6px" }}>
              ¿Tienes una idea única en mente?
            </h3>
            <p style={{ fontSize: 13, color: "#E8B4BC", margin: 0, lineHeight: 1.5 }}>
              Creamos tu invitación desde cero, completamente a tu gusto.
            </p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_CONTACTO}?text=${encodeURIComponent("¡Hola! Me gustaría cotizar un diseño 100% personalizado.")}`}
            target="_blank" rel="noopener noreferrer"
            style={{ background: "#C49B3A", color: "#fff", fontWeight: 800, fontSize: 14, padding: "11px 24px", borderRadius: 99, textDecoration: "none" }}
          >
            Solicitar diseño a medida →
          </a>
        </div>
      </div>

      <style>{`
        @keyframes gradientFlow { from { background-position:0% 0%; } to { background-position:0% 100%; } }
      `}</style>
    </div>
  );
}
