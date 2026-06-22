import { useEffect, useRef, useState } from "react";
import { InvitationData, TemplateInfo, detallesVacios } from "../types";
import { supabase } from "../lib/supabase";

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

export default function FormularioConPreview({ template, onBack }: FormularioConPreviewProps) {
  const [draft, setDraft] = useState<InvitationData>(detallesVacios(template.id));
  const [submitting, setSubmitting] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const previewUrl = `http://localhost:${template.devPort}/?preview=1`;

  function sendDraftToPreview() {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "invitation:update", data: draft, pagado: false },
      "*"
    );
  }

  // Reenvía el borrador cada vez que cambia
  useEffect(() => {
    sendDraftToPreview();
  }, [draft]);

  // El iframe avisa cuando ya montó y está listo para recibir el primer mensaje
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "invitation:ready") sendDraftToPreview();
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  });

  function update<K extends keyof InvitationData>(key: K, value: InvitationData[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function updateLugar(key: keyof InvitationData["lugar"], value: string) {
    setDraft((prev) => ({ ...prev, lugar: { ...prev.lugar, [key]: value } }));
  }

  function updateFeature(key: keyof InvitationData["features"], value: boolean) {
    setDraft((prev) => ({ ...prev, features: { ...prev.features, [key]: value } }));
  }

  async function handleSubmit() {
    setError(null);

    if (!draft.tituloEvento.trim() || !draft.nombresPrincipales[0]?.trim() || !draft.fecha) {
      setError("Completa al menos el título, el nombre principal y la fecha.");
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

    setResultUrl(`http://localhost:${template.devPort}/?evento=${eventoId}`);
  }

  if (resultUrl) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-3">¡Listo! 🎉</h2>
        <p className="text-slate-500 mb-6">
          Tu invitación fue creada como vista previa con marca de agua. Cuando se confirme el pago, el
          operador la aprobará y la marca de agua desaparecerá en este mismo link.
        </p>
        <a
          href={resultUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 py-3 rounded-xl"
        >
          Ver mi invitación
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-700 mb-4 cursor-pointer">
        ← Cambiar plantilla
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Personaliza tu invitación</h2>

          <Campo label="Título del evento">
            <input
              className="input"
              placeholder="Baby Shower de..."
              value={draft.tituloEvento}
              onChange={(e) => update("tituloEvento", e.target.value)}
            />
          </Campo>

          <Campo label="Nombre principal (bebé, novios, etc.)">
            <input
              className="input"
              placeholder="Ej: Sofía"
              value={draft.nombresPrincipales[0] ?? ""}
              onChange={(e) => update("nombresPrincipales", [e.target.value])}
            />
          </Campo>

          <Campo label="Anfitriones">
            <input
              className="input"
              placeholder="Ej: Familia Pérez"
              value={draft.anfitriones ?? ""}
              onChange={(e) => update("anfitriones", e.target.value)}
            />
          </Campo>

          <div className="grid grid-cols-2 gap-3">
            <Campo label="Fecha">
              <input
                type="date"
                className="input"
                value={draft.fecha}
                onChange={(e) => update("fecha", e.target.value)}
              />
            </Campo>
            <Campo label="Hora">
              <input
                type="time"
                className="input"
                value={draft.hora}
                onChange={(e) => update("hora", e.target.value)}
              />
            </Campo>
          </div>

          <Campo label="Lugar">
            <input
              className="input"
              placeholder="Nombre del lugar"
              value={draft.lugar.nombre}
              onChange={(e) => updateLugar("nombre", e.target.value)}
            />
          </Campo>

          <Campo label="Dirección">
            <input
              className="input"
              placeholder="Dirección completa"
              value={draft.lugar.direccion}
              onChange={(e) => updateLugar("direccion", e.target.value)}
            />
          </Campo>

          <Campo label="Vestimenta (opcional)">
            <input
              className="input"
              placeholder="Ej: Azul pastel y blanco"
              value={draft.vestimenta ?? ""}
              onChange={(e) => update("vestimenta", e.target.value)}
            />
          </Campo>

          <Campo label="WhatsApp para RSVP (opcional)">
            <input
              className="input"
              placeholder="573000000000"
              value={draft.whatsappNumero ?? ""}
              onChange={(e) => update("whatsappNumero", e.target.value)}
            />
          </Campo>

          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-2">Funciones activas</label>
            <div className="flex flex-wrap gap-3">
              {(["muroDeseos", "rsvp", "countdown", "mapa", "musica"] as const).map((key) => (
                <label key={key} className="flex items-center gap-1.5 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={draft.features[key]}
                    onChange={(e) => updateFeature(key, e.target.checked)}
                  />
                  {key}
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl cursor-pointer"
          >
            {submitting ? "Enviando..." : "Enviar y generar mi invitación"}
          </button>
        </div>

        {/* Preview en vivo */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 h-[640px] sticky top-8">
          <iframe ref={iframeRef} src={previewUrl} className="w-full h-full" title="Preview" />
        </div>
      </div>

      <style>{`.input { width: 100%; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 0.6rem 0.9rem; font-size: 0.95rem; }`}</style>
    </div>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-600 block mb-1">{label}</label>
      {children}
    </div>
  );
}
