import { useEffect, useRef, useState } from "react";
import type { InvitationData, TemplateInfo } from "../types";
import { datosEjemplo, WHATSAPP_CONTACTO, DEV_PORT_POR_TEMPLATE } from "../types";
import { supabase } from "../lib/supabase";
import BuscadorCancion from "./BuscadorCancion";
import type { CancionSeleccionada } from "./BuscadorCancion";

interface FormularioConPreviewProps {
  template: TemplateInfo;
  onBack: () => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const PASOS = ["El evento", "Fecha & lugar", "Personalización", "Confirmación"];

const BRAND = "#5A1B5E";
const BRAND2 = "#7A2E8A";

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  border: "1.5px solid #e8dcef",
  borderRadius: 9,
  padding: "0.6rem 0.85rem",
  fontSize: "0.88rem",
  background: "#faf8ff",
  color: "#1A0A20",
  boxSizing: "border-box",
  fontFamily: "inherit",
  outline: "none",
  transition: "border-color 0.2s",
};

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 700, color: "#6b5c7a", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function FormularioConPreview({ template, onBack }: FormularioConPreviewProps) {
  const [draft, setDraft] = useState<InvitationData>(() => datosEjemplo(template.id));
  const [paso, setPaso] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const templateBaseUrl =
    template.baseUrl || `http://localhost:${DEV_PORT_POR_TEMPLATE[template.id] ?? 3101}`;
  const previewUrl = `${templateBaseUrl}/?preview=1`;

  function sendDraftToPreview() {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "invitation:update", data: draft, pagado: false },
      "*"
    );
  }

  useEffect(() => { sendDraftToPreview(); }, [draft]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "invitation:ready") {
        sendDraftToPreview();
      } else if (event.data?.type === "preview:focus-field") {
        const fieldName = event.data.field as string;
        setTimeout(() => {
          const id = `input-${fieldName.replace(".", "-")}`;
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            element.focus();
            element.classList.add("ring-4", "ring-sky-500", "outline-none");
            setTimeout(() => element.classList.remove("ring-4", "ring-sky-500"), 1500);
          }
        }, 150);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  function update<K extends keyof InvitationData>(key: K, value: InvitationData[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }
  function updateLugar(key: keyof InvitationData["lugar"], value: string) {
    setDraft((prev) => ({ ...prev, lugar: { ...prev.lugar, [key]: value } }));
  }
  function updateFeature(key: keyof InvitationData["features"], value: boolean) {
    setDraft((prev) => ({ ...prev, features: { ...prev.features, [key]: value } }));
  }
  const cancionSeleccionada =
    (draft.extra?.cancionSeleccionada as CancionSeleccionada | undefined) ?? null;
  function updateCancion(cancion: CancionSeleccionada | null) {
    setDraft((prev) => ({ ...prev, extra: { ...prev.extra, cancionSeleccionada: cancion } }));
  }

  function puedeAvanzar(): boolean {
    if (paso === 0)
      return !!(draft.tituloEvento.trim() && draft.nombresPrincipales[0]?.trim());
    if (paso === 1) return !!draft.fecha;
    return true;
  }

  async function handleSubmit() {
    setError(null);
    const telContacto = (draft.extra?.telefonoContacto as string | undefined)?.trim();
    if (!telContacto) {
      setError("Ingresa tu número de WhatsApp para que podamos contactarte.");
      return;
    }
    const eventoId = `${slugify(draft.nombresPrincipales[0])}-${slugify(template.id)}-${Date.now().toString(36)}`;
    const datosFinal: InvitationData = { ...draft, eventoId };
    setSubmitting(true);
    const { error: insertError } = await supabase.from("eventos").insert({
      id: eventoId,
      template_id: template.id,
      nombre_evento: draft.tituloEvento,
      fecha_evento: draft.fecha,
      datos: datosFinal,
      pagado: false,
      aprobado: false,
    });
    setSubmitting(false);
    if (insertError) {
      setError(`No se pudo enviar: ${insertError.message}`);
      return;
    }
    setResultUrl(`${templateBaseUrl}/${eventoId}`);
  }

  // ── Pantalla de éxito ──
  if (resultUrl) {
    const mensajeWhatsapp =
      `¡Hola! Ya llené el formulario de mi invitación "${draft.tituloEvento}" (${template.nombre}).\n` +
      `Quiero proceder con el pago de activación.\nLink: ${resultUrl}`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_CONTACTO}?text=${encodeURIComponent(mensajeWhatsapp)}`;
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#faf8ff", padding: 24 }}>
        <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
          <div style={{ width: 68, height: 68, borderRadius: "50%", background: `linear-gradient(135deg,${BRAND},${BRAND2})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 8px 24px rgba(90,27,94,0.3)" }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1A0A20", marginBottom: 8 }}>¡Invitación Creada!</h2>
          <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.65, marginBottom: 28 }}>
            Tu borrador con marca de agua está listo. Para activar la versión final (sin marca de agua y con todas las funciones), escríbenos por WhatsApp.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <a href={resultUrl} target="_blank" rel="noopener noreferrer"
              style={{ background: `linear-gradient(135deg,${BRAND},${BRAND2})`, color: "#fff", fontWeight: 800, fontSize: 15, padding: "14px 0", borderRadius: 12, textAlign: "center", textDecoration: "none", display: "block" }}>
              Ver mi invitación
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              style={{ border: "2px solid #25D366", color: "#25D366", fontWeight: 700, fontSize: 14, padding: "12px 0", borderRadius: 12, textAlign: "center", textDecoration: "none", display: "block" }}>
              Activar por WhatsApp
            </a>
            <button onClick={onBack}
              style={{ background: "none", border: "none", color: "#9b8aa8", fontWeight: 600, fontSize: 13, cursor: "pointer", padding: "8px 0" }}>
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progreso = ((paso) / (PASOS.length - 1)) * 100;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "inherit", background: "#f5f0fa" }}>

      {/* ──────────────── LEFT: formulario paso a paso ──────────────── */}
      <div
        className="form-panel"
        style={{ width: 420, flexShrink: 0, display: "flex", flexDirection: "column", background: "#fff", borderRight: "1px solid #ede8f5", overflowY: "auto" }}
      >
        {/* Header */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f0eaf5", display: "flex", alignItems: "center", gap: 10, flexShrink: 0, background: "#fff" }}>
          <button onClick={onBack}
            style={{ background: "none", border: "none", cursor: "pointer", color: BRAND, fontWeight: 700, fontSize: 12, padding: 0, display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
            ← Catálogo
          </button>
          <div style={{ width: 1, height: 16, background: "#e0d6ea", margin: "0 4px" }} />
          <span style={{ fontSize: 22 }}>{template.emoji}</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#1A0A20", lineHeight: 1.2 }}>{template.nombreDisplay}</div>
            <div style={{ fontSize: 10, color: "#9b8aa8", marginTop: 1 }}>Vista en tiempo real →</div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div style={{ padding: "14px 20px 0", flexShrink: 0 }}>
          {/* Barra continua */}
          <div style={{ height: 5, background: "#f0eaf5", borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
            <div style={{ height: "100%", width: `${((paso + 1) / PASOS.length) * 100}%`, background: `linear-gradient(90deg,${BRAND},${BRAND2})`, borderRadius: 3, transition: "width 0.4s ease" }} />
          </div>
          {/* Etiquetas de pasos */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {PASOS.map((label, i) => (
              <button
                key={i}
                onClick={() => { if (i < paso) setPaso(i); }}
                style={{
                  background: "none", border: "none", padding: 0, cursor: i < paso ? "pointer" : "default",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flex: 1,
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: i < paso ? BRAND : i === paso ? `linear-gradient(135deg,${BRAND},${BRAND2})` : "#e8dcf0",
                  color: i <= paso ? "#fff" : "#b0a0bf",
                  fontSize: 10, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.3s",
                  boxShadow: i === paso ? `0 2px 10px rgba(90,27,94,0.4)` : "none",
                }}>
                  {i < paso ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 9, fontWeight: i === paso ? 800 : 500, color: i === paso ? BRAND : i < paso ? "#888" : "#bbb", whiteSpace: "nowrap", letterSpacing: "0.02em" }}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Contenido del paso */}
        <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", gap: 14, overflowY: "auto" }}>

          {/* PASO 0: El evento */}
          {paso === 0 && (
            <>
              <div style={{ background: "linear-gradient(135deg,#fdf5ff,#f5f0fa)", borderRadius: 12, padding: "12px 14px", marginBottom: 2 }}>
                <p style={{ fontSize: 12, color: "#7a5c8a", margin: 0, lineHeight: 1.5 }}>
                  ✨ Empieza con lo básico — lo ves reflejado al instante en el celular de la derecha.
                </p>
              </div>
              <Campo label="Título del evento *">
                <input id="input-tituloEvento" style={INPUT_STYLE}
                  placeholder="Baby Shower de Sofía..."
                  value={draft.tituloEvento}
                  onChange={(e) => update("tituloEvento", e.target.value)} />
              </Campo>
              <Campo label="Nombre principal (bebé, novios...) *">
                <input id="input-nombresPrincipales" style={INPUT_STYLE}
                  placeholder="Ej: Sofía"
                  value={draft.nombresPrincipales[0] ?? ""}
                  onChange={(e) => update("nombresPrincipales", [e.target.value])} />
              </Campo>
              <Campo label="Anfitriones">
                <input id="input-anfitriones" style={INPUT_STYLE}
                  placeholder="Ej: Familia Pérez"
                  value={draft.anfitriones ?? ""}
                  onChange={(e) => update("anfitriones", e.target.value)} />
              </Campo>
              <Campo label="Mensaje de bienvenida">
                <textarea id="input-mensajePersonalizado" style={{ ...INPUT_STYLE, resize: "none" }} rows={3}
                  placeholder="¡Te invitamos a celebrar con nosotros!"
                  value={draft.mensajePersonalizado ?? ""}
                  onChange={(e) => update("mensajePersonalizado", e.target.value)} />
              </Campo>
            </>
          )}

          {/* PASO 1: Fecha & lugar */}
          {paso === 1 && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Campo label="Fecha *">
                  <input id="input-fecha" type="date" style={INPUT_STYLE}
                    value={draft.fecha}
                    onChange={(e) => update("fecha", e.target.value)} />
                </Campo>
                <Campo label="Hora">
                  <input id="input-hora" type="time" style={INPUT_STYLE}
                    value={draft.hora}
                    onChange={(e) => update("hora", e.target.value)} />
                </Campo>
              </div>
              <Campo label="Nombre del lugar">
                <input id="input-lugar-nombre" style={INPUT_STYLE}
                  placeholder="Salón Los Rosales"
                  value={draft.lugar.nombre}
                  onChange={(e) => updateLugar("nombre", e.target.value)} />
              </Campo>
              <Campo label="Dirección">
                <input id="input-lugar-direccion" style={INPUT_STYLE}
                  placeholder="Calle 80 #12-34, Bogotá"
                  value={draft.lugar.direccion}
                  onChange={(e) => updateLugar("direccion", e.target.value)} />
              </Campo>
              <Campo label="Vestimenta (opcional)">
                <input id="input-vestimenta" style={INPUT_STYLE}
                  placeholder="Ej: Azul pastel y blanco"
                  value={draft.vestimenta ?? ""}
                  onChange={(e) => update("vestimenta", e.target.value)} />
              </Campo>
            </>
          )}

          {/* PASO 2: Personalización */}
          {paso === 2 && (
            <>
              <Campo label="Canción de fondo (opcional)">
                <BuscadorCancion value={cancionSeleccionada} onChange={updateCancion} />
                <p style={{ fontSize: 11, color: "#9b8aa8", marginTop: 4, lineHeight: 1.4 }}>
                  La vincularemos a tu invitación final tras confirmar el pedido.
                </p>
              </Campo>
              <Campo label="WhatsApp para RSVP (opcional)">
                <input id="input-whatsappNumero" style={INPUT_STYLE}
                  placeholder="573000000000"
                  value={draft.whatsappNumero ?? ""}
                  onChange={(e) => update("whatsappNumero", e.target.value)} />
              </Campo>
              <Campo label="Fecha límite de RSVP (opcional)">
                <input id="input-extra-rsvpDeadline" style={INPUT_STYLE}
                  placeholder="Ej: 26 de junio"
                  value={(draft.extra?.rsvpDeadline as string) ?? ""}
                  onChange={(e) => update("extra", { ...draft.extra, rsvpDeadline: e.target.value })} />
              </Campo>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#6b5c7a", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Funciones activas
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {(["muroDeseos", "rsvp", "countdown", "mapa", "musica"] as const).map((key) => (
                    <label key={key}
                      style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#555", cursor: "pointer", background: draft.features[key] ? "#f0e8f8" : "#f5f5f5", padding: "5px 10px", borderRadius: 8, border: draft.features[key] ? `1px solid #d0b0e0` : "1px solid #e0e0e0", transition: "all 0.2s" }}>
                      <input type="checkbox" checked={draft.features[key]}
                        onChange={(e) => updateFeature(key, e.target.checked)}
                        style={{ accentColor: BRAND }} />
                      {key}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* PASO 3: Confirmación */}
          {paso === 3 && (
            <>
              <div style={{ background: "linear-gradient(135deg,#fdf5ff,#f5f0fa)", border: "1px solid #e8dcf0", borderRadius: 12, padding: "14px 16px" }}>
                <p style={{ fontSize: 13, color: "#6b5c7a", lineHeight: 1.6, margin: 0 }}>
                  Revisaremos tu pedido y te escribimos para activar la invitación final sin marca de agua. El proceso es rápido — normalmente en menos de 24h.
                </p>
              </div>
              <Campo label="Tu número de WhatsApp / Celular *">
                <input id="input-extra-telefonoContacto" style={INPUT_STYLE}
                  placeholder="3150000000"
                  value={(draft.extra?.telefonoContacto as string) ?? ""}
                  onChange={(e) => update("extra", { ...draft.extra, telefonoContacto: e.target.value })} />
              </Campo>
              <Campo label="Observaciones adicionales (opcional)">
                <textarea id="input-extra-observaciones" style={{ ...INPUT_STYLE, resize: "none" }} rows={4}
                  placeholder="Cualquier detalle especial que debamos saber..."
                  value={(draft.extra?.observaciones as string) ?? ""}
                  onChange={(e) => update("extra", { ...draft.extra, observaciones: e.target.value })} />
              </Campo>
              {error && (
                <p style={{ fontSize: 13, color: "#dc2626", margin: 0, background: "#fef2f2", padding: "10px 12px", borderRadius: 8 }}>
                  {error}
                </p>
              )}
            </>
          )}
        </div>

        {/* Botones de navegación */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid #f0eaf5", display: "flex", gap: 10, flexShrink: 0, background: "#fff" }}>
          {paso > 0 && (
            <button onClick={() => setPaso((p) => p - 1)}
              style={{ flex: 0, padding: "11px 18px", borderRadius: 10, border: "1.5px solid #e0d6ea", background: "#fff", color: BRAND, fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>
              ← Atrás
            </button>
          )}
          {paso < PASOS.length - 1 ? (
            <button
              onClick={() => { if (puedeAvanzar()) setPaso((p) => p + 1); }}
              disabled={!puedeAvanzar()}
              style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "none", background: puedeAvanzar() ? `linear-gradient(135deg,${BRAND},${BRAND2})` : "#d1c4dc", color: "#fff", fontWeight: 800, fontSize: 14, cursor: puedeAvanzar() ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
              Siguiente →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting}
              style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "none", background: submitting ? "#a89ab2" : `linear-gradient(135deg,${BRAND},${BRAND2})`, color: "#fff", fontWeight: 800, fontSize: 14, cursor: submitting ? "not-allowed" : "pointer" }}>
              {submitting ? "Enviando..." : "Crear mi invitación →"}
            </button>
          )}
        </div>
      </div>

      {/* ──────────────── RIGHT: Phone frame en vivo ──────────────── */}
      <div
        className="phone-panel"
        style={{ flex: 1, background: "linear-gradient(145deg, #1A0A20 0%, #2d1045 60%, #1a0a20 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}
      >
        {/* Fondo decorativo: puntos/estrellas */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {[...Array(24)].map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              width: i % 4 === 0 ? 3 : 2,
              height: i % 4 === 0 ? 3 : 2,
              borderRadius: "50%",
              background: "white",
              opacity: 0.15 + (i % 5) * 0.07,
              top: `${5 + (i * 17) % 90}%`,
              left: `${8 + (i * 23) % 84}%`,
            }} />
          ))}
        </div>

        {/* Label superior */}
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: "0.18em", fontWeight: 700, textTransform: "uppercase", marginBottom: 20, zIndex: 1 }}>
          Vista previa en tiempo real
        </p>

        {/* Phone frame */}
        <div style={{
          width: 292,
          height: 614,
          background: "#111",
          borderRadius: 50,
          border: "9px solid #2a2a2a",
          boxShadow: "0 0 0 1px #3d3d3d, 0 50px 120px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05)",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
          zIndex: 1,
        }}>
          {/* Notch */}
          <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 108, height: 26, background: "#111", borderRadius: "0 0 18px 18px", zIndex: 10 }} />
          {/* Botón lateral derecho */}
          <div style={{ position: "absolute", right: -10, top: 95, width: 3, height: 38, background: "#1e1e1e", borderRadius: 2 }} />
          {/* Botones laterales izquierdos */}
          <div style={{ position: "absolute", left: -10, top: 82, width: 3, height: 28, background: "#1e1e1e", borderRadius: 2 }} />
          <div style={{ position: "absolute", left: -10, top: 120, width: 3, height: 48, background: "#1e1e1e", borderRadius: 2 }} />
          {/* Iframe escalado */}
          <iframe
            ref={iframeRef}
            src={previewUrl}
            style={{
              width: "390px",
              height: "844px",
              border: "none",
              transform: `scale(${274 / 390})`,
              transformOrigin: "top left",
              marginTop: 26,
              pointerEvents: "none",
            }}
            title="Vista previa"
          />
        </div>

        {/* Indicador de paso actual */}
        <div style={{ marginTop: 20, display: "flex", gap: 6, zIndex: 1 }}>
          {PASOS.map((_, i) => (
            <div key={i} style={{
              width: i === paso ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background: i === paso ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .phone-panel { display: none !important; }
          .form-panel { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
