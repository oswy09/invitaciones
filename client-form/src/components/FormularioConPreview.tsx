import { useEffect, useRef, useState } from "react";
import { InvitationData, TemplateInfo, datosEjemplo, WHATSAPP_CONTACTO } from "../types";
import { supabase } from "../lib/supabase";
import BuscadorCancion, { CancionSeleccionada } from "./BuscadorCancion";

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
  const [draft, setDraft] = useState<InvitationData>(() => datosEjemplo(template.id));
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const previewUrl = `${template.baseUrl}/?preview=1`;

  function sendDraftToPreview() {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "invitation:update", data: draft, pagado: false },
      "*"
    );
  }

  // Reenvía el borrador cada vez que cambia, para que se vea en tiempo real
  useEffect(() => {
    sendDraftToPreview();
  }, [draft]);

  // El iframe avisa cuando ya montó y está listo para recibir el primer mensaje,
  // y también procesa eventos del preview para enfocar campos del formulario.
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "invitation:ready") {
        sendDraftToPreview();
      } else if (event.data?.type === "preview:focus-field") {
        const fieldName = event.data.field as string;
        setPanelAbierto(true);
        // Esperamos a que se abra el panel antes de enfocar
        setTimeout(() => {
          const id = `input-${fieldName.replace(".", "-")}`;
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            element.focus();
            
            // Efecto de highlight temporal
            element.classList.add("ring-4", "ring-sky-500", "outline-none", "transition-all", "duration-300");
            setTimeout(() => {
              element.classList.remove("ring-4", "ring-sky-500");
            }, 1500);
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

  const cancionSeleccionada = (draft.extra?.cancionSeleccionada as CancionSeleccionada | undefined) ?? null;

  function updateCancion(cancion: CancionSeleccionada | null) {
    setDraft((prev) => ({ ...prev, extra: { ...prev.extra, cancionSeleccionada: cancion } }));
  }

  async function handleSubmit() {
    setError(null);

    const telContacto = (draft.extra?.telefonoContacto as string | undefined)?.trim();
    if (!draft.tituloEvento.trim() || !draft.nombresPrincipales[0]?.trim() || !draft.fecha || !telContacto) {
      setError("Completa al menos el título, el nombre principal, la fecha y tu número de contacto.");
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

    setResultUrl(`${template.baseUrl}/${eventoId}`);
  }

  if (resultUrl) {
    const mensajeWhatsapp =
      `¡Hola! Ya llené el formulario de mi invitación "${draft.tituloEvento}" (plantilla ${template.nombre}).\n` +
      `Quiero proceder con el pago de activación.\n` +
      `Link de mi invitación: ${resultUrl}`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_CONTACTO}?text=${encodeURIComponent(mensajeWhatsapp)}`;

    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-3">¡Invitación Creada Exitosamente! 🎉</h2>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
          Tu diseño de prueba con marca de agua ya está listo para que lo revises. Para activar la invitación final (remover la marca de agua y habilitar todas las funciones premium), por favor ponte en contacto con nosotros a través de WhatsApp para recibir las instrucciones de pago.
        </p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <a
            href={resultUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            Ver Vista Previa ➔
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            💬 Activar Invitación por WhatsApp
          </a>
          <button
            onClick={onBack}
            className="text-slate-500 hover:text-slate-700 font-semibold px-6 py-3 cursor-pointer text-sm"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative overflow-hidden bg-slate-900">
      {/* Barra superior flotante */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-2.5 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm flex-wrap gap-2">
        <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-700 cursor-pointer font-medium">
          ← Catálogo
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPanelAbierto((v) => !v)}
            className={`text-xs sm:text-sm font-bold px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl cursor-pointer transition-colors ${
              panelAbierto ? "bg-slate-800 text-white" : "bg-sky-500 text-white hover:bg-sky-600 shadow-sm"
            }`}
          >
            {panelAbierto ? "✕ Cerrar Panel" : "✏️ Personalizar"}
          </button>
          {!panelAbierto && (
            <a
              href={`https://wa.me/${WHATSAPP_CONTACTO}?text=${encodeURIComponent(
                `¡Hola! Estoy interesado en la plantilla ${template.nombre} y me gustaría que me ayudaran a crear mi invitación.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-bold px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer transition-colors shadow-sm flex items-center gap-1.5 decoration-none"
            >
              💬 Contactar WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* La invitación real, a pantalla completa, con su flujo normal (intro incluida) */}
      <iframe ref={iframeRef} src={previewUrl} className="w-full h-full pt-[52px]" title="Invitación" />

      {/* Panel de personalización, se desliza encima sin recargar el preview */}
      <div
        className={`absolute top-[52px] right-0 bottom-0 w-full sm:w-[420px] bg-white border-l border-slate-200 shadow-2xl z-20 overflow-y-auto transition-transform duration-300 ${
          panelAbierto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 space-y-4">
          <h2 className="text-lg font-bold text-slate-800">Personaliza tu invitación</h2>
          <p className="text-xs text-slate-400">Los cambios se reflejan al instante en la invitación de fondo.</p>

          <Campo label="Título del evento">
            <input
              id="input-tituloEvento"
              className="input"
              placeholder="Baby Shower de..."
              value={draft.tituloEvento}
              onChange={(e) => update("tituloEvento", e.target.value)}
            />
          </Campo>

          <Campo label="Nombre principal (bebé, novios, etc.)">
            <input
              id="input-nombresPrincipales"
              className="input"
              placeholder="Ej: Sofía"
              value={draft.nombresPrincipales[0] ?? ""}
              onChange={(e) => update("nombresPrincipales", [e.target.value])}
            />
          </Campo>

          <Campo label="Anfitriones">
            <input
              id="input-anfitriones"
              className="input"
              placeholder="Ej: Familia Pérez"
              value={draft.anfitriones ?? ""}
              onChange={(e) => update("anfitriones", e.target.value)}
            />
          </Campo>

          <div className="grid grid-cols-2 gap-3">
            <Campo label="Fecha">
              <input
                id="input-fecha"
                type="date"
                className="input"
                value={draft.fecha}
                onChange={(e) => update("fecha", e.target.value)}
              />
            </Campo>
            <Campo label="Hora">
              <input
                id="input-hora"
                type="time"
                className="input"
                value={draft.hora}
                onChange={(e) => update("hora", e.target.value)}
              />
            </Campo>
          </div>

          <Campo label="Lugar">
            <input
              id="input-lugar-nombre"
              className="input"
              placeholder="Nombre del lugar"
              value={draft.lugar.nombre}
              onChange={(e) => updateLugar("nombre", e.target.value)}
            />
          </Campo>

          <Campo label="Dirección">
            <input
              id="input-lugar-direccion"
              className="input"
              placeholder="Dirección completa"
              value={draft.lugar.direccion}
              onChange={(e) => updateLugar("direccion", e.target.value)}
            />
          </Campo>

          <Campo label="Vestimenta (opcional)">
            <input
              id="input-vestimenta"
              className="input"
              placeholder="Ej: Azul pastel y blanco"
              value={draft.vestimenta ?? ""}
              onChange={(e) => update("vestimenta", e.target.value)}
            />
          </Campo>

          <Campo label="WhatsApp para RSVP (opcional)">
            <input
              id="input-whatsappNumero"
              className="input"
              placeholder="573000000000"
              value={draft.whatsappNumero ?? ""}
              onChange={(e) => update("whatsappNumero", e.target.value)}
            />
          </Campo>



          <Campo label="Fecha límite de RSVP (opcional)">
            <input
              id="input-extra-rsvpDeadline"
              className="input"
              placeholder="Ej: 26 de junio"
              value={(draft.extra?.rsvpDeadline as string) ?? ""}
              onChange={(e) => update("extra", { ...draft.extra, rsvpDeadline: e.target.value })}
            />
          </Campo>

          <Campo label="Mensaje de bienvenida / Introducción (opcional)">
            <textarea
              id="input-mensajePersonalizado"
              className="input"
              rows={3}
              placeholder="Texto introductorio de la tarjeta o invitación (ej: ¡Te invitamos a celebrar con nosotros!)"
              value={draft.mensajePersonalizado ?? ""}
              onChange={(e) => update("mensajePersonalizado", e.target.value)}
            />
          </Campo>

          <Campo label="Canción de fondo (opcional)">
            <BuscadorCancion value={cancionSeleccionada} onChange={updateCancion} />
            <p className="text-xs text-slate-400 mt-1">
              Esta canción no sonará en esta vista previa — solo nos sirve como referencia. La
              vincularemos manualmente a tu invitación final tras confirmar tu pedido.
            </p>
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

          <Campo label="Observaciones / Notas internas (opcional)">
            <textarea
              id="input-extra-observaciones"
              className="input"
              rows={3}
              placeholder="Detalles adicionales para el operador (no aparecerán en la invitación)."
              value={(draft.extra?.observaciones as string) ?? ""}
              onChange={(e) => update("extra", { ...draft.extra, observaciones: e.target.value })}
            />
          </Campo>

          <div className="border-t border-slate-200 pt-4 mt-6">
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
              <span>👤</span> Información de Contacto del Cliente
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Usaremos este número para escribirte o llamarte ante cualquier duda sobre tu pedido.
            </p>
            <Campo label="Número de WhatsApp o Celular *">
              <input
                id="input-extra-telefonoContacto"
                className="input border-sky-200 focus:border-sky-500 focus:ring-sky-500/20 bg-sky-50/10"
                required
                placeholder="Tu número personal para seguimiento"
                value={(draft.extra?.telefonoContacto as string) ?? ""}
                onChange={(e) => update("extra", { ...draft.extra, telefonoContacto: e.target.value })}
              />
            </Campo>
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
