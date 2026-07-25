import { useState } from "react";
import type { TemplateInfo } from "../types";
import { DEV_PORT_POR_TEMPLATE } from "../types";

interface Props {
  template: TemplateInfo;
  onBack: () => void;
}

const COLORES_BG = [
  { label: "Crema festivo", value: "fef3c7", texto: "#92400e" },
  { label: "Rosa dulce",    value: "fce7f3", texto: "#9d174d" },
  { label: "Verde menta",   value: "d1fae5", texto: "#065f46" },
];

const DEMO = {
  saludo: "¡Hola!",
  titulo: "¡Llegó el momento\nde festejar!",
  frase: "Queremos compartir esta alegría contigo y crear recuerdos juntos. ¡La fiesta no estará completa sin ti!",
  fecha: "23 de Julio",
  hora: "6:00 PM",
  lugar: "Calle 116 #14-00, Bogotá",
  bg: COLORES_BG[0].value,
};

function buildUrl(template: TemplateInfo, campos: typeof DEMO): string {
  const isDev = import.meta.env.DEV;
  const base = isDev
    ? `http://localhost:${DEV_PORT_POR_TEMPLATE[template.id]}`
    : template.baseUrl;
  const params = new URLSearchParams();
  Object.entries(campos).forEach(([k, v]) => { if (v?.trim()) params.set(k, v.trim()); });
  return `${base}?${params.toString()}`;
}

export default function FormularioFree({ template, onBack }: Props) {
  const [campos, setCampos] = useState(DEMO);
  const [linkGenerado, setLinkGenerado] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [panelAbierto, setPanelAbierto] = useState(false);

  const previewUrl = buildUrl(template, campos);

  const set = (k: keyof typeof DEMO) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setCampos(prev => ({ ...prev, [k]: e.target.value }));

  function generar() {
    setLinkGenerado(previewUrl);
    setCopiado(false);
  }

  function copiar() {
    navigator.clipboard.writeText(linkGenerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "inherit" }}>

      {/* ── Preview iframe ── */}
      <div style={{ flex: 1, background: "#1A0A20", position: "relative" }}>
        <iframe
          key={previewUrl}
          src={previewUrl}
          style={{ width: "100%", height: "100%", border: "none" }}
          title="Preview invitación"
        />
        {/* Botón mobile flotante para abrir el panel */}
        <button
          onClick={() => setPanelAbierto(true)}
          style={{
            display: "none",
            position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
            background: "#5A1B5E", color: "#fff", fontWeight: 800, fontSize: 15,
            padding: "14px 32px", borderRadius: 99, border: "none", cursor: "pointer",
            boxShadow: "0 4px 24px rgba(90,27,94,0.35)", whiteSpace: "nowrap",
          }}
          className="mobile-cta-btn"
        >
          Personalizar mi invitación →
        </button>
      </div>

      {/* ── Panel lateral ── */}
      <div style={{
        width: 360, flexShrink: 0, background: "#fff",
        borderLeft: "1px solid #f0eaf5", display: "flex", flexDirection: "column",
        overflowY: "auto",
      }} className={`panel-lateral${panelAbierto ? " panel-open" : ""}`}>
        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f0eaf5" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "#5A1B5E", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
              ← Volver
            </button>
            <button onClick={() => setPanelAbierto(false)} className="mobile-close-btn" style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#9b8aa8", fontSize: 20, lineHeight: 1 }}>
              ✕
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 28 }}>{template.emoji}</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#1A0A20" }}>{template.nombreDisplay}</div>
              <span style={{ display: "inline-block", padding: "1px 8px", borderRadius: 99, background: "#e8f5e9", color: "#2e7d32", fontSize: 11, fontWeight: 700 }}>GRATIS</span>
            </div>
          </div>
        </div>

        {/* Campos */}
        <div style={{ padding: "16px 24px", flex: 1 }}>

          <Field label="Saludo">
            <input
              value={campos.saludo}
              onChange={set("saludo")}
              style={inputStyle}
              placeholder="¡Hola!"
            />
          </Field>

          <Field label="Título *" hint="Usa \\n para salto de línea">
            <textarea
              rows={2}
              value={campos.titulo}
              onChange={set("titulo")}
              style={inputStyle}
            />
          </Field>

          <Field label="Frase de invitación">
            <textarea
              rows={3}
              value={campos.frase}
              onChange={set("frase")}
              style={inputStyle}
            />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Fecha">
              <input value={campos.fecha} onChange={set("fecha")} style={inputStyle} placeholder="23 de Julio" />
            </Field>
            <Field label="Hora">
              <input value={campos.hora} onChange={set("hora")} style={inputStyle} placeholder="6:00 PM" />
            </Field>
          </div>

          <Field label="Lugar">
            <input value={campos.lugar} onChange={set("lugar")} style={inputStyle} placeholder="Calle 116 #14-00, Bogotá" />
          </Field>

          {/* Color de fondo */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Color de fondo</label>
            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              {COLORES_BG.map(c => (
                <button
                  key={c.value}
                  onClick={() => setCampos(prev => ({ ...prev, bg: c.value }))}
                  title={c.label}
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: `#${c.value}`,
                    border: campos.bg === c.value ? "3px solid #5A1B5E" : "2px solid #e8dcef",
                    cursor: "pointer", transition: "border 0.15s",
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Botón generar */}
          <button
            onClick={generar}
            style={{
              width: "100%", padding: "13px 0", borderRadius: 12, border: "none",
              background: "#5A1B5E",
              color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer",
              marginBottom: 10,
            }}
          >
            Generar mi link gratis
          </button>

          {/* Botón WhatsApp alternativo */}
          <a
            href={`https://wa.me/573057502790?text=${encodeURIComponent("¡Hola! Me gustaría que me ayudaran a crear mi invitación de cumpleaños.")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block", width: "100%", padding: "11px 0", borderRadius: 12,
              border: "2px solid #25D366", background: "transparent",
              color: "#25D366", fontWeight: 700, fontSize: 14, cursor: "pointer",
              marginBottom: 12, textAlign: "center", textDecoration: "none",
            }}
          >
            Contactar por WhatsApp
          </a>

          {/* Link generado */}
          {linkGenerado && (
            <div style={{ background: "#faf8ff", borderRadius: 14, padding: "16px", border: "2px solid #f472b6" }}>
              <p style={{ margin: "0 0 8px", fontWeight: 700, color: "#1A0A20", fontSize: 13 }}>
                🔗 Tu invitación está lista:
              </p>
              <div style={{ wordBreak: "break-all", fontSize: 11, color: "#5A1B5E", marginBottom: 10, lineHeight: 1.5 }}>
                {linkGenerado}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={copiar}
                  style={{
                    flex: 1, padding: "9px 0", borderRadius: 9, border: "none",
                    background: copiado ? "#2e7d32" : "#5A1B5E",
                    color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                  }}
                >
                  {copiado ? "✅ ¡Copiado!" : "📋 Copiar"}
                </button>
                <a
                  href={linkGenerado}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1, padding: "9px 0", borderRadius: 9,
                    border: "2px solid #5A1B5E", color: "#5A1B5E",
                    fontWeight: 700, fontSize: 13, textDecoration: "none",
                    textAlign: "center", display: "inline-block",
                  }}
                >
                  👁 Ver
                </a>
              </div>
              <p style={{ margin: "10px 0 0", fontSize: 11, color: "#a89ab2", textAlign: "center" }}>
                Comparte por WhatsApp, Instagram o como prefieras 🎊
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .mobile-cta-btn { display: block !important; }
          .mobile-close-btn { display: block !important; }
          .panel-lateral { display: none !important; }
          .panel-lateral.panel-open { display: flex !important; position: fixed !important; inset: 0 !important; width: 100% !important; z-index: 100; overflow-y: auto; }
          #cursor-vermas { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      {hint && <p style={{ margin: "0 0 4px", fontSize: 10, color: "#9b8aa8" }}>{hint}</p>}
      {children}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontWeight: 700, fontSize: 12, color: "#1A0A20", marginBottom: 5,
};

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  padding: "9px 12px", borderRadius: 9,
  border: "1.5px solid #e8dcef", fontSize: 13,
  color: "#1A0A20", outline: "none", background: "#faf8ff",
  resize: "vertical" as const,
};
