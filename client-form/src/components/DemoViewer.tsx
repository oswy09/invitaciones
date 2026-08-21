import { useState, useEffect } from "react";
import { CATALOGO, WHATSAPP_CONTACTO } from "../types";
import type { TemplateInfo } from "../types";

interface DemoViewerProps {
  templateId: string;
  onPersonalizar: (t: TemplateInfo) => void;
  onBack: () => void;
}

function demoSrc(t: TemplateInfo): string {
  // Siempre usa la URL de producción — el template ya está deployado
  if (t.esFree) return t.baseUrl;
  return `${t.baseUrl}/demo`;
}

export default function DemoViewer({ templateId, onPersonalizar, onBack }: DemoViewerProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const t = CATALOGO.find((tmpl) => tmpl.id === templateId);

  // Oculta el botón de WhatsApp flotante y el cursor "Ver más" del layout de Astro mientras el demo está abierto
  useEffect(() => {
    const wa = document.querySelector<HTMLElement>('a[href*="wa.me"]');
    const cursor = document.getElementById("cursor-vermas");
    if (wa) wa.style.display = "none";
    if (cursor) cursor.style.display = "none";
    return () => {
      if (wa) wa.style.display = "";
      if (cursor) cursor.style.display = "";
    };
  }, []);

  if (!t) {
    return (
      <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg,#0a0410,#1a0a20)", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center", color: "#fff" }}>
          <p style={{ fontSize: 18, marginBottom: 12 }}>Plantilla no encontrada</p>
          <button onClick={onBack} style={{ padding: "10px 20px", borderRadius: 999, border: "none", background: "#5A1B5E", color: "#fff", cursor: "pointer" }}>← Volver</button>
        </div>
      </div>
    );
  }

  const waMsg = encodeURIComponent(`¡Hola! Me gustaría solicitar la plantilla *${t.nombreDisplay}*. ¿Pueden armarla por mí?`);
  const src = demoSrc(t);
  const hasUrl = !!t.baseUrl;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10001, background: t.gradiente, display: "flex", flexDirection: "column" }}>

      {/* Loading shimmer — se oculta cuando carga */}
      {!loaded && !error && hasUrl && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          background: t.gradiente, gap: 16,
        }}>
          <div style={{ fontSize: 48 }}>{t.emoji}</div>
          <p style={{ color: "#fff", fontFamily: "'Poppins',sans-serif", fontSize: 14, opacity: 0.7, margin: 0 }}>
            Cargando {t.nombreDisplay}…
          </p>
          <div style={{ width: 40, height: 40, border: "3px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Error — plantilla no tiene URL o iframe bloqueado */}
      {(error || !hasUrl) && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          background: t.gradiente, gap: 12, padding: "0 24px",
        }}>
          <div style={{ fontSize: 44 }}>{t.emoji}</div>
          <h2 style={{ color: "#fff", fontFamily: "'Playfair Display',serif", fontSize: 22, margin: 0, textAlign: "center" }}>
            {t.nombreDisplay}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontFamily: "sans-serif", fontSize: 14, textAlign: "center", margin: 0, lineHeight: 1.5 }}>
            El demo completo se abre en su propia pestaña.
          </p>
          <a
            href={src}
            target="_blank" rel="noopener noreferrer"
            style={{ padding: "12px 28px", borderRadius: 999, background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.4)", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none", backdropFilter: "blur(8px)" }}
          >
            Abrir demo ↗
          </a>
        </div>
      )}

      {/* iframe */}
      {hasUrl && (
        <iframe
          key={src}
          src={src}
          title={t.nombreDisplay}
          allow="autoplay; encrypted-media"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{ flex: 1, border: "none", width: "100%", height: "100%", opacity: loaded ? 1 : 0, transition: "opacity 0.4s ease" }}
        />
      )}

      {/* Barra flotante inferior */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10,
        background: "linear-gradient(to top, rgba(8,3,16,0.88) 0%, rgba(8,3,16,0.72) 45%, transparent 100%)",
        padding: "40px 20px 18px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
      }}>
        <div style={{ display: "flex", gap: 10, width: "100%", maxWidth: 380 }}>
          <button
            onClick={() => onPersonalizar(t)}
            style={{
              flex: 1, padding: "13px 0", borderRadius: 999,
              border: "none", background: "linear-gradient(135deg,#5A1B5E,#7A2E8A)",
              color: "#fff", fontWeight: 800, fontSize: 14,
              cursor: "pointer", boxShadow: "0 4px 20px rgba(90,27,94,0.5)",
              fontFamily: "'Poppins',sans-serif",
            }}
          >
            Personalizar →
          </button>
          <a
            href={`https://wa.me/${WHATSAPP_CONTACTO}?text=${waMsg}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              flex: 1, padding: "13px 0", borderRadius: 999,
              border: "1.5px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.1)",
              color: "#fff", fontWeight: 700, fontSize: 14,
              textDecoration: "none", textAlign: "center",
              backdropFilter: "blur(6px)",
              fontFamily: "'Poppins',sans-serif",
            }}
          >
            Solicitar 💬
          </a>
        </div>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.45)", fontSize: 12, cursor: "pointer", padding: "4px 8px", fontFamily: "sans-serif" }}
        >
          ← Volver al catálogo
        </button>
      </div>
    </div>
  );
}
