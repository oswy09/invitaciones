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

interface PreviewNavigateMessage {
  type: "preview:navigate";
  topRatio: number;
  openIfNeeded?: boolean;
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
  width: "100%", border: "1.5px solid #e8dcef", borderRadius: 9,
  padding: "0.6rem 0.85rem", fontSize: "0.88rem", background: "#faf8ff",
  color: "#1A0A20", boxSizing: "border-box", fontFamily: "inherit", outline: "none",
};

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#6b5c7a", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

// ── Picker de hora ─────────────────────────────────────────────────────────
const HORAS_PRESET = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM",  "2:00 PM",  "3:00 PM",  "4:00 PM",
  "5:00 PM",  "6:00 PM",  "7:00 PM",  "8:00 PM",
];

function to24h(label: string): string {
  const m = label.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!m) return label;
  let h = parseInt(m[1]);
  const min = m[2];
  const period = m[3].toUpperCase();
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${min}`;
}

function HoraPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [custom, setCustom] = useState(false);
  // Convert value to display label for matching
  const valueAsLabel = HORAS_PRESET.find(h => to24h(h) === value) ?? value;
  const esPreset = HORAS_PRESET.some(h => to24h(h) === value);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5 }}>
        {HORAS_PRESET.map((h) => (
          <button key={h} type="button" onClick={() => { onChange(to24h(h)); setCustom(false); }}
            style={{
              padding: "6px 2px", borderRadius: 8,
              border: `1.5px solid ${to24h(h) === value ? BRAND : "#e8dcef"}`,
              background: to24h(h) === value ? "#f0e8f8" : "#faf8ff",
              color: to24h(h) === value ? BRAND : "#555",
              fontSize: 11, fontWeight: to24h(h) === value ? 800 : 500, cursor: "pointer",
            }}>
            {h}
          </button>
        ))}
        <button type="button" onClick={() => setCustom(true)}
          style={{
            padding: "6px 2px", borderRadius: 8,
            border: `1.5px solid ${custom || (!esPreset && value) ? BRAND : "#e8dcef"}`,
            background: custom || (!esPreset && value) ? "#f0e8f8" : "#faf8ff",
            color: custom || (!esPreset && value) ? BRAND : "#666",
            fontSize: 11, fontWeight: 500, cursor: "pointer",
          }}>
          Otra ✎
        </button>
      </div>
      {(custom || (!esPreset && value)) && (
        <input type="time" style={INPUT_STYLE}
          value={!esPreset ? value : ""}
          onChange={(e) => onChange(e.target.value)} />
      )}
      {value && (
        <p style={{ margin: 0, fontSize: 11, color: BRAND, fontWeight: 600 }}>✓ {valueAsLabel}</p>
      )}
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────
export default function FormularioConPreview({ template, onBack }: FormularioConPreviewProps) {
  const [draft, setDraft] = useState<InvitationData>(() => datosEjemplo(template.id));
  const [paso, setPaso] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Hint: auto-desaparece a los 2.5s o al primer toque
  const [showHint, setShowHint] = useState(true);
  const [playingYtId, setPlayingYtId] = useState<string | null>(null);
  const iframeSrcRef = useRef<string>("");

  const localPort = DEV_PORT_POR_TEMPLATE[template.id];
  const templateBaseUrl =
    import.meta.env.DEV && localPort
      ? `http://127.0.0.1:${localPort}`
      : (template.baseUrl || `http://localhost:${localPort ?? 3101}`);
  const previewUrl = `${templateBaseUrl}/?preview=1`;

  useEffect(() => { iframeSrcRef.current = previewUrl; }, [previewUrl]);

  // Auto-ocultar hint tras 2.5s
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 2500);
    return () => clearTimeout(t);
  }, []);

  function sendDraftToPreview(data?: InvitationData) {
    iframeRef.current?.contentWindow?.postMessage(
      // En el editor siempre mostramos la invitacion limpia, sin marca de agua.
      { type: "invitation:update", data: data ?? draft, pagado: true }, "*"
    );
  }

  function sendPreviewNavigation(topRatio: number, openIfNeeded = true) {
    const iframeWindow = iframeRef.current?.contentWindow;
    if (!iframeWindow) return;

    const safeRatio = Math.max(0, Math.min(1, topRatio));
    const msg: PreviewNavigateMessage = {
      type: "preview:navigate",
      topRatio: safeRatio,
      openIfNeeded,
    };
    iframeWindow.postMessage(msg, "*");
  }

  function getPreviewRatioFromInputId(inputId: string): number {
    if (inputId.includes("tituloEvento") || inputId.includes("nombresPrincipales") || inputId.includes("mensajePersonalizado")) return 0.08;
    if (inputId.includes("fecha") || inputId.includes("hora") || inputId.includes("lugar")) return 0.34;
    if (inputId.includes("whatsappNumero") || inputId.includes("extra-telefonoContacto")) return 0.62;
    if (inputId.includes("extra-observaciones")) return 0.82;
    return paso === 0 ? 0.08 : paso === 1 ? 0.34 : paso === 2 ? 0.62 : 0.82;
  }

  function handleFormFocusCapture(event: React.FocusEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (!target) return;
    if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA" && target.tagName !== "SELECT") return;

    const inputId = (target as HTMLInputElement).id || "";
    sendPreviewNavigation(getPreviewRatioFromInputId(inputId), true);
  }

  // Reiniciar animación
  function reiniciarAnimacion() {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Mantener el estado actual del formulario al reiniciar la animacion.
    const draftActual = draft;
    const restartUrl = `${previewUrl}&restart=${Date.now()}`;

    const onLoad = () => {
      sendDraftToPreview(draftActual);
    };

    iframe.addEventListener("load", onLoad, { once: true });
    iframe.src = restartUrl;

    // Respaldo por si el evento ready/load se retrasa.
    setTimeout(() => sendDraftToPreview(draftActual), 300);
    setShowHint(true);
    // El hint se auto-oculta de nuevo a los 2.5s desde el reinicio
    setTimeout(() => setShowHint(false), 2500);
  }

  useEffect(() => { sendDraftToPreview(); }, [draft]);

  useEffect(() => {
    const ratioByStep = [0.08, 0.34, 0.62, 0.82];
    sendPreviewNavigation(ratioByStep[paso] ?? 0.08, true);
  }, [paso]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "invitation:ready") sendDraftToPreview();
      else if (event.data?.type === "preview:focus-field") {
        const id = `input-${(event.data.field as string).replace(".", "-")}`;
        setTimeout(() => { document.getElementById(id)?.focus(); }, 150);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  function update<K extends keyof InvitationData>(key: K, value: InvitationData[K]) {
    setShowHint(false);
    setDraft((prev) => ({ ...prev, [key]: value }));
  }
  function updateLugar(key: keyof InvitationData["lugar"], value: string) {
    setShowHint(false);
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

  function puedeAvanzar() {
    if (paso === 0) return !!(draft.tituloEvento.trim() && draft.nombresPrincipales[0]?.trim());
    if (paso === 1) return !!draft.fecha;
    return true;
  }

  function pasoEstaCompleto(i: number) {
    // Solo se marca completo un paso que ya fue recorrido.
    if (i >= paso) return false;
    if (i === 0) return !!(draft.tituloEvento.trim() && draft.nombresPrincipales[0]?.trim());
    if (i === 1) return !!draft.fecha;
    return true;
  }

  async function handleSubmit() {
    setError(null);
    const tel = (draft.extra?.telefonoContacto as string | undefined)?.trim();
    if (!tel) { setError("Ingresa tu número de WhatsApp."); return; }
    const eventoId = `${slugify(draft.nombresPrincipales[0])}-${slugify(template.id)}-${Date.now().toString(36)}`;
    setSubmitting(true);
    const { error: err } = await supabase.from("eventos").insert({
      id: eventoId, template_id: template.id,
      nombre_evento: draft.tituloEvento, fecha_evento: draft.fecha,
      datos: { ...draft, eventoId }, pagado: false, aprobado: false,
    });
    setSubmitting(false);
    if (err) { setError(`No se pudo enviar: ${err.message}`); return; }
    setResultUrl(`${templateBaseUrl}/${eventoId}`);
  }

  // ── Éxito ─────────────────────────────────────────────────────────────────
  if (resultUrl) {
    const wa = `https://wa.me/${WHATSAPP_CONTACTO}?text=${encodeURIComponent(
      `¡Hola! Llené el formulario de "${draft.tituloEvento}" (${template.nombre}).\nQuiero activarla.\nLink: ${resultUrl}`
    )}`;
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#faf8ff", padding: 24 }}>
        <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
          <div style={{ width: 68, height: 68, borderRadius: "50%", background: `linear-gradient(135deg,${BRAND},${BRAND2})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 8px 24px rgba(90,27,94,0.3)" }}>
            <svg width="30" height="30" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1A0A20", marginBottom: 8 }}>¡Invitación Creada!</h2>
          <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.65, marginBottom: 28 }}>
            Tu borrador está listo. Escríbenos para activar la versión final.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <a href={resultUrl} target="_blank" rel="noopener noreferrer"
              style={{ background: `linear-gradient(135deg,${BRAND},${BRAND2})`, color: "#fff", fontWeight: 800, fontSize: 15, padding: "14px 0", borderRadius: 12, textAlign: "center", textDecoration: "none", display: "block" }}>
              Ver mi invitación
            </a>
            <a href={wa} target="_blank" rel="noopener noreferrer"
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

  // ── Campos por paso ───────────────────────────────────────────────────────
  const campos = (
    <>
      {paso === 0 && (
        <>
          <div style={{ background: "linear-gradient(135deg,#fdf5ff,#f5f0fa)", borderRadius: 10, padding: "9px 12px" }}>
            <p style={{ fontSize: 12, color: "#7a5c8a", margin: 0, lineHeight: 1.5 }}>
              ✨ Toca la pantalla del celular para abrir la invitación, luego edita aquí.
            </p>
          </div>
          <Campo label="Título del evento *">
            <input id="input-tituloEvento" style={INPUT_STYLE} placeholder="Baby Shower de Sofía..."
              value={draft.tituloEvento} onChange={(e) => update("tituloEvento", e.target.value)} />
          </Campo>
          <Campo label="Nombre principal *">
            <input id="input-nombresPrincipales" style={INPUT_STYLE} placeholder="Ej: Sofía"
              value={draft.nombresPrincipales[0] ?? ""}
              onChange={(e) => update("nombresPrincipales", [e.target.value])} />
          </Campo>
          <Campo label="Anfitriones">
            <input id="input-anfitriones" style={INPUT_STYLE} placeholder="Ej: Familia Pérez"
              value={draft.anfitriones ?? ""} onChange={(e) => update("anfitriones", e.target.value)} />
          </Campo>
          <Campo label="Mensaje de bienvenida">
            <textarea id="input-mensajePersonalizado" style={{ ...INPUT_STYLE, resize: "none" }} rows={3}
              placeholder="¡Te invitamos a celebrar con nosotros!"
              value={draft.mensajePersonalizado ?? ""} onChange={(e) => update("mensajePersonalizado", e.target.value)} />
          </Campo>
        </>
      )}

      {paso === 1 && (
        <>
          <Campo label="Fecha *">
            <input id="input-fecha" type="date" style={INPUT_STYLE}
              value={draft.fecha} onChange={(e) => update("fecha", e.target.value)} />
          </Campo>
          <Campo label="Hora del evento">
            <HoraPicker value={draft.hora} onChange={(v) => update("hora", v)} />
          </Campo>
          <Campo label="Nombre del lugar">
            <input id="input-lugar-nombre" style={INPUT_STYLE} placeholder="Salón Los Rosales"
              value={draft.lugar.nombre} onChange={(e) => updateLugar("nombre", e.target.value)} />
          </Campo>
          <Campo label="Dirección">
            <input id="input-lugar-direccion" style={INPUT_STYLE} placeholder="Calle 80 #12-34, Bogotá"
              value={draft.lugar.direccion} onChange={(e) => updateLugar("direccion", e.target.value)} />
          </Campo>
          <Campo label="Vestimenta (opcional)">
            <input id="input-vestimenta" style={INPUT_STYLE} placeholder="Ej: Azul pastel y blanco"
              value={draft.vestimenta ?? ""} onChange={(e) => update("vestimenta", e.target.value)} />
          </Campo>
        </>
      )}

      {paso === 2 && (
        <>
          <Campo label="Canción de fondo (opcional)">
            <BuscadorCancion value={cancionSeleccionada} onChange={updateCancion}
              onPlay={(id) => setPlayingYtId(id)} />
          </Campo>
          <Campo label="WhatsApp para RSVP">
            <input id="input-whatsappNumero" style={INPUT_STYLE} placeholder="573000000000"
              value={draft.whatsappNumero ?? ""} onChange={(e) => update("whatsappNumero", e.target.value)} />
          </Campo>
        </>
      )}

      {paso === 3 && (
        <>
          <div style={{ background: "linear-gradient(135deg,#fdf5ff,#f5f0fa)", border: "1px solid #e8dcf0", borderRadius: 12, padding: "12px 14px" }}>
            <p style={{ fontSize: 13, color: "#6b5c7a", lineHeight: 1.6, margin: 0 }}>
              Revisaremos tu pedido y te escribimos para activar la invitación final en menos de 24h.
            </p>
          </div>
          <Campo label="Tu número de WhatsApp *">
            <input id="input-extra-telefonoContacto" style={INPUT_STYLE} placeholder="3150000000"
              value={(draft.extra?.telefonoContacto as string) ?? ""}
              onChange={(e) => update("extra", { ...draft.extra, telefonoContacto: e.target.value })} />
          </Campo>
          <Campo label="Observaciones (opcional)">
            <textarea id="input-extra-observaciones" style={{ ...INPUT_STYLE, resize: "none" }} rows={3}
              placeholder="Cualquier detalle especial..."
              value={(draft.extra?.observaciones as string) ?? ""}
              onChange={(e) => update("extra", { ...draft.extra, observaciones: e.target.value })} />
          </Campo>
          {error && <p style={{ fontSize: 13, color: "#dc2626", margin: 0, background: "#fef2f2", padding: "10px 12px", borderRadius: 8 }}>{error}</p>}
        </>
      )}
    </>
  );

  // ── Layout ────────────────────────────────────────────────────────────────
  return (
    <div className="fp-root" style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "inherit", background: "#f5f0fa" }}>

      {/* ── Panel PREVIEW (derecha en desktop, arriba en mobile) ── */}
      <div className="fp-preview"
        style={{ flex: 1, background: "linear-gradient(145deg,#1A0A20 0%,#2d1045 60%,#1a0a20 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>

        {/* Estrellas */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {[...Array(18)].map((_, i) => (
            <div key={i} style={{ position: "absolute", width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: "50%", background: "white", opacity: 0.1 + (i % 5) * 0.06, top: `${5 + (i * 17) % 90}%`, left: `${8 + (i * 23) % 84}%` }} />
          ))}
        </div>

        {/* Phone frame */}
        <div className="fp-frame-wrapper" style={{ position: "relative", zIndex: 1 }}>
          <div className="fp-phone-shell" style={{
            width: 292, height: 614, background: "#111", borderRadius: 50,
            border: "9px solid #2a2a2a",
            boxShadow: "0 0 0 1px #3d3d3d, 0 40px 100px rgba(0,0,0,0.8)",
            position: "relative", overflow: "hidden", flexShrink: 0,
          }}>
            {/* Notch */}
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 108, height: 26, background: "#111", borderRadius: "0 0 18px 18px", zIndex: 10 }} />
            {/* Botones laterales */}
            <div style={{ position: "absolute", right: -10, top: 95, width: 3, height: 38, background: "#1e1e1e", borderRadius: 2 }} />
            <div style={{ position: "absolute", left: -10, top: 82, width: 3, height: 28, background: "#1e1e1e", borderRadius: 2 }} />
            <div style={{ position: "absolute", left: -10, top: 120, width: 3, height: 48, background: "#1e1e1e", borderRadius: 2 }} />

            {/* Hint — pointer-events:none para no bloquear el iframe */}
            {showHint && (
              <div style={{ position: "absolute", inset: 0, zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ textAlign: "center", background: "rgba(30,10,40,0.7)", borderRadius: 16, padding: "12px 18px", backdropFilter: "blur(8px)", animation: "fadeInHint 0.3s ease" }}>
                  <div style={{ fontSize: 28, animation: "bounceUp 1.3s ease infinite" }}>👆</div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.95)", marginTop: 4, letterSpacing: "0.05em" }}>Toca para abrir</div>
                </div>
              </div>
            )}

            {/* Iframe — siempre interactivo (scroll + click libre) */}
            <iframe
              ref={iframeRef}
              src={previewUrl}
              style={{
                width: "390px", height: "844px", border: "none",
                transform: `scale(${274 / 390})`,
                transformOrigin: "top left",
                marginTop: 26,
                pointerEvents: "auto",
              }}
              title="Vista previa"
            />
          </div>
        </div>

        {/* Dots + botón reiniciar */}
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12, zIndex: 1 }}>
          <div style={{ display: "flex", gap: 5 }}>
            {PASOS.map((_, i) => (
              <div key={i} style={{ width: i === paso ? 18 : 5, height: 5, borderRadius: 3, background: i === paso ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)", transition: "all 0.3s" }} />
            ))}
          </div>
          <button onClick={reiniciarAnimacion}
            title="Reiniciar animación"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 99, color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 700, padding: "5px 12px", cursor: "pointer", backdropFilter: "blur(6px)" }}>
            ↺ Reiniciar
          </button>
        </div>
      </div>

      {/* ── Panel FORMULARIO (izquierda en desktop, abajo en mobile) ── */}
      <div className="fp-form"
        style={{ width: 420, flexShrink: 0, display: "flex", flexDirection: "column", background: "#fff", borderLeft: "1px solid #ede8f5", overflowY: "auto", order: -1 }}>

        {/* Header */}
        <div style={{ padding: "12px 18px", borderBottom: "1px solid #f0eaf5", display: "flex", alignItems: "center", gap: 10, flexShrink: 0, position: "sticky", top: 0, background: "#fff", zIndex: 10 }}>
          <button onClick={onBack}
            style={{ background: "none", border: "none", cursor: "pointer", color: BRAND, fontWeight: 700, fontSize: 12, padding: 0, whiteSpace: "nowrap" }}>
            ← Catálogo
          </button>
          <div style={{ width: 1, height: 14, background: "#e0d6ea" }} />
          <span style={{ fontSize: 20 }}>{template.emoji}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 13, color: "#1A0A20" }}>{template.nombreDisplay}</div>
            <div style={{ fontSize: 9, color: "#9b8aa8" }}>Vista en tiempo real →</div>
          </div>
        </div>

        {/* Stepper */}
        <div className="fp-stepper" style={{ padding: "12px 18px 0", flexShrink: 0 }}>
          {/* Barra de progreso */}
          <div style={{ position: "relative", height: 5, background: "#f0eaf5", borderRadius: 3, overflow: "hidden", marginBottom: 12 }}>
            <div style={{
              height: "100%",
              width: `${(paso / (PASOS.length - 1)) * 100}%`,
              background: "linear-gradient(90deg,#16a34a,#22c55e)",
              borderRadius: 3,
              transition: "width 0.4s ease",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {PASOS.map((label, i) => {
              const completo = pasoEstaCompleto(i);
              const activo = i === paso;
              const clickable = i !== paso && (i < paso || completo);
              const bgColor = completo && !activo
                ? "linear-gradient(135deg,#16a34a,#22c55e)"
                : activo
                  ? `linear-gradient(135deg,${BRAND},${BRAND2})`
                  : "#e8dcf0";
              const shadow = activo
                ? "0 2px 10px rgba(90,27,94,0.4)"
                : completo && !activo
                  ? "0 2px 8px rgba(22,163,74,0.35)"
                  : "none";
              return (
                <button key={i}
                  onClick={() => { if (clickable) setPaso(i); }}
                  title={clickable ? `Ir a ${label}` : undefined}
                  style={{ background: "none", border: "none", padding: 0, cursor: clickable ? "pointer" : "default", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flex: 1 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: bgColor,
                    color: activo || completo ? "#fff" : "#b0a0bf",
                    fontSize: 10, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: shadow,
                    transition: "all 0.3s",
                  }}>
                    {completo && !activo ? "✓" : i + 1}
                  </div>
                  <span style={{
                    fontSize: 9,
                    fontWeight: activo ? 800 : 500,
                    color: activo ? BRAND : completo ? "#16a34a" : "#bbb",
                    whiteSpace: "nowrap",
                  }}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Campos */}
        <div className="fp-campos" onFocusCapture={handleFormFocusCapture} style={{ flex: 1, padding: "18px", display: "flex", flexDirection: "column", gap: 14 }}>
          {campos}
        </div>

        {/* Navegación */}
        <div style={{ padding: "12px 18px", borderTop: "1px solid #f0eaf5", display: "flex", gap: 8, flexShrink: 0, background: "#fff", position: "sticky", bottom: 0 }}>
          {paso > 0 && (
            <button onClick={() => setPaso((p) => p - 1)}
              style={{ padding: "10px 16px", borderRadius: 10, border: "1.5px solid #e0d6ea", background: "#fff", color: BRAND, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              ← Atrás
            </button>
          )}
          {paso < PASOS.length - 1 ? (
            <button onClick={() => { if (puedeAvanzar()) setPaso((p) => p + 1); }}
              disabled={!puedeAvanzar()}
              style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: puedeAvanzar() ? `linear-gradient(135deg,${BRAND},${BRAND2})` : "#d1c4dc", color: "#fff", fontWeight: 800, fontSize: 14, cursor: puedeAvanzar() ? "pointer" : "not-allowed" }}>
              Siguiente →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting}
              style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: submitting ? "#a89ab2" : `linear-gradient(135deg,${BRAND},${BRAND2})`, color: "#fff", fontWeight: 800, fontSize: 14, cursor: submitting ? "not-allowed" : "pointer" }}>
              {submitting ? "Enviando..." : "Crear mi invitación →"}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeHint  { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes bounceUp  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes gradientFlow { from{background-position:0 0} to{background-position:0 100%} }

        /* ── MOBILE: preview arriba, form abajo ── */
        @media (max-width: 768px) {
          .fp-root {
            flex-direction: column !important;
            height: 100dvh !important;
            overflow: hidden !important;
          }
          /* Preview: mitad superior */
          .fp-preview {
            width: 100% !important;
            flex: 0 0 60% !important;
            min-height: 0 !important;
            padding: 0 !important;
            justify-content: flex-start !important;
            border-radius: 0 0 24px 24px;
          }
          .fp-preview-label { display: none !important; }
          .fp-frame-wrapper {
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          /* En mobile: reemplazar el phone shell con contenedor simple */
          .fp-phone-shell {
            width: calc(100% - 32px) !important;
            height: 100% !important;
            border-radius: 20px !important;
            border-width: 4px !important;
            box-shadow: none !important;
          }
          .fp-phone-shell iframe {
            width: 100% !important;
            height: 100% !important;
            transform: none !important;
            margin-top: 0 !important;
          }

          /* Form: mitad inferior — scrollable */
          .fp-form {
            width: 100% !important;
            flex: 0 0 40% !important;
            min-height: 0 !important;
            order: 0 !important;
            border-left: none !important;
            border-top: 1px solid #ede8f5 !important;
            overflow-y: auto !important;
          }
          /* Compact form fields on mobile */
          .fp-stepper {
            padding: 8px 12px 0 !important;
          }
          .fp-campos {
            padding: 10px 12px !important;
            gap: 8px !important;
            overflow-y: auto !important;
          }
          .fp-form input,
          .fp-form textarea,
          .fp-form select {
            font-size: 13px !important;
            padding: 7px 10px !important;
          }
        }
      `}</style>
    </div>
  );
}
