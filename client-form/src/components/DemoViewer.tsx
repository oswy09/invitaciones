import { CATALOGO, DEV_PORT_POR_TEMPLATE, WHATSAPP_CONTACTO } from "../types";
import type { TemplateInfo } from "../types";

interface DemoViewerProps {
  templateId: string;
  onPersonalizar: (t: TemplateInfo) => void;
  onBack: () => void;
}

function demoSrc(t: TemplateInfo): string {
  if (import.meta.env.DEV && DEV_PORT_POR_TEMPLATE[t.id]) {
    return `http://localhost:${DEV_PORT_POR_TEMPLATE[t.id]}`;
  }
  if (t.esFree) return t.baseUrl;
  return `${t.baseUrl}/demo`;
}

export default function DemoViewer({ templateId, onPersonalizar, onBack }: DemoViewerProps) {
  const t = CATALOGO.find((tmpl) => tmpl.id === templateId);

  if (!t) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100dvh", fontFamily: "sans-serif", color: "#5A1B5E" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 18, marginBottom: 12 }}>Plantilla no encontrada</p>
          <button onClick={onBack} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#5A1B5E", color: "#fff", cursor: "pointer" }}>← Volver</button>
        </div>
      </div>
    );
  }

  const waMsg = encodeURIComponent(`¡Hola! Me gustaría solicitar la plantilla *${t.nombreDisplay}*. ¿Pueden armarla por mí?`);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", display: "flex", flexDirection: "column" }}>
      {/* iframe full-screen */}
      <iframe
        src={demoSrc(t)}
        title={t.nombreDisplay}
        allow="autoplay; encrypted-media"
        style={{ flex: 1, border: "none", width: "100%", height: "100%" }}
      />

      {/* Barra flotante inferior */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(to top, rgba(10,4,20,0.96) 70%, transparent 100%)",
        padding: "28px 20px 20px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
      }}>
        <div style={{ display: "flex", gap: 10, width: "100%", maxWidth: 380 }}>
          <button
            onClick={() => onPersonalizar(t)}
            style={{
              flex: 1, padding: "13px 0", borderRadius: 999,
              border: "none", background: "linear-gradient(135deg,#5A1B5E,#7A2E8A)",
              color: "#fff", fontWeight: 800, fontSize: 14,
              cursor: "pointer", boxShadow: "0 4px 20px rgba(90,27,94,0.45)",
            }}
          >
            Personalizar →
          </button>
          <a
            href={`https://wa.me/${WHATSAPP_CONTACTO}?text=${waMsg}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              flex: 1, padding: "13px 0", borderRadius: 999,
              border: "1.5px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.08)",
              color: "#fff", fontWeight: 700, fontSize: 14,
              textDecoration: "none", textAlign: "center",
              backdropFilter: "blur(6px)",
            }}
          >
            Solicitar 💬
          </a>
        </div>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.45)", fontSize: 12, cursor: "pointer", padding: "4px 8px" }}
        >
          ← Volver al catálogo
        </button>
      </div>
    </div>
  );
}
