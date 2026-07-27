// FormularioAsistido — campos dinámicos según categoría de plantilla
import { useState, useEffect } from "react";
import type { InvitationData, TemplateInfo } from "../types";
import { CATALOGO, WHATSAPP_CONTACTO } from "../types";
import { supabase } from "../lib/supabase";
import BuscadorCancion from "./BuscadorCancion";
import type { CancionSeleccionada } from "./BuscadorCancion";

interface FormularioAsistidoProps {
  onBack?: () => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Solo plantillas de pago (excluye las free)
const PLANTILLAS_ASISTIDO = CATALOGO.filter((t) => !t.esFree);

type Cat = "Baby Shower" | "Boda";

function getCat(t: TemplateInfo): Cat {
  return t.categoria === "Boda" ? "Boda" : "Baby Shower";
}

// ─── Estado separado por categoría ───────────────────────────────────────────

interface CamposBaby {
  tituloEvento: string; nombreBebe: string; anfitriones: string;
  fecha: string; hora: string;
  lugarNombre: string; lugarDireccion: string;
  vestimenta: string; mensajePersonalizado: string; rsvpDeadline: string;
  telefonoContacto: string; whatsappNumero: string; observaciones: string;
}
interface CamposBoda {
  tituloEvento: string; nombreNovia: string; nombreNovio: string;
  fecha: string; hora: string;
  ceremoniaNombre: string; ceremoniaDireccion: string;
  recepcionNombre: string; recepcionDireccion: string;
  vestimenta: string; mensajePersonalizado: string; rsvpDeadline: string;
  telefonoContacto: string; whatsappNumero: string; observaciones: string;
}

const BABY0: CamposBaby = { tituloEvento: "", nombreBebe: "", anfitriones: "", fecha: "", hora: "", lugarNombre: "", lugarDireccion: "", vestimenta: "", mensajePersonalizado: "", rsvpDeadline: "", telefonoContacto: "", whatsappNumero: "", observaciones: "" };
const BODA0: CamposBoda = { tituloEvento: "", nombreNovia: "", nombreNovio: "", fecha: "", hora: "", ceremoniaNombre: "", ceremoniaDireccion: "", recepcionNombre: "", recepcionDireccion: "", vestimenta: "", mensajePersonalizado: "", rsvpDeadline: "", telefonoContacto: "", whatsappNumero: "", observaciones: "" };

export default function FormularioAsistido({ onBack }: FormularioAsistidoProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateInfo | null>(null);
  const [baby, setBaby] = useState<CamposBaby>(BABY0);
  const [boda, setBoda] = useState<CamposBoda>(BODA0);
  const [cancion, setCancion] = useState<CancionSeleccionada | null>(null);
  const [features, setFeatures] = useState({ muroDeseos: true, rsvp: true, countdown: true, mapa: true, musica: false });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [precios, setPrecios] = useState<Record<string, { cop: number; usd: number }>>({});
  const [tasaCambio, setTasaCambio] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("eventos")
      .select("datos")
      .eq("id", "config-precios")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.datos?.precios) setPrecios(data.datos.precios);
      });

    fetch("https://open.er-api.com/v6/latest/USD")
      .then((r) => r.json())
      .then((data) => { if (data?.rates?.COP) setTasaCambio(data.rates.COP); })
      .catch(() => {});
  }, []);

  function getPrecio(t: TemplateInfo) {
    return precios[t.id] ?? t.precioDefault;
  }

  function precioUsd(cop: number): string {
    if (!tasaCambio) return "...";
    return (cop / tasaCambio).toFixed(2);
  }

  const cat: Cat | null = selectedTemplate ? getCat(selectedTemplate) : null;

  function sb<K extends keyof CamposBaby>(k: K, v: string) { setBaby((p) => ({ ...p, [k]: v })); }
  function sw<K extends keyof CamposBoda>(k: K, v: string) { setBoda((p) => ({ ...p, [k]: v })); }
  function updateFeature(key: keyof typeof features, val: boolean) { setFeatures((p) => ({ ...p, [key]: val })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!selectedTemplate) { setError("Por favor, selecciona el diseño de tu invitación."); window.scrollTo({ top: 0, behavior: "smooth" }); return; }

    const tituloEvento = cat === "Boda" ? boda.tituloEvento : baby.tituloEvento;
    const fecha = cat === "Boda" ? boda.fecha : baby.fecha;
    const telefonoContacto = cat === "Boda" ? boda.telefonoContacto : baby.telefonoContacto;
    const whatsappNumero = cat === "Boda" ? boda.whatsappNumero : baby.whatsappNumero;

    if (!tituloEvento.trim() || !fecha.trim() || !telefonoContacto.trim() || !whatsappNumero.trim()) {
      setError("Completa los campos obligatorios marcados con *."); return;
    }

    const templateId = selectedTemplate.id;
    const nombreRef = cat === "Boda" ? (boda.nombreNovia || boda.nombreNovio) : baby.nombreBebe;
    const eventoId = `contacto-${slugify(nombreRef || tituloEvento)}-${slugify(templateId)}-${Date.now().toString(36)}`;

    const datosFinal: InvitationData = {
      eventoId, templateId, pagado: false, asistido: true,
      tituloEvento,
      nombresPrincipales: cat === "Boda" ? [boda.nombreNovia, boda.nombreNovio].filter(Boolean) : [baby.nombreBebe].filter(Boolean),
      anfitriones: cat === "Baby Shower" ? (baby.anfitriones || undefined) : undefined,
      fecha, hora: cat === "Boda" ? boda.hora : baby.hora,
      lugar: {
        nombre: cat === "Boda" ? boda.recepcionNombre : baby.lugarNombre,
        direccion: cat === "Boda" ? boda.recepcionDireccion : baby.lugarDireccion,
        mapUrl: "",
      },
      vestimenta: (cat === "Boda" ? boda.vestimenta : baby.vestimenta) || undefined,
      mensajePersonalizado: (cat === "Boda" ? boda.mensajePersonalizado : baby.mensajePersonalizado) || undefined,
      whatsappNumero,
      features,
      extra: {
        origen: "formulario_contacto",
        rsvpDeadline: cat === "Boda" ? boda.rsvpDeadline : baby.rsvpDeadline,
        cancionSeleccionada: cancion,
        observaciones: cat === "Boda" ? boda.observaciones : baby.observaciones,
        telefonoContacto,
        ...(cat === "Boda" && { ceremoniaNombre: boda.ceremoniaNombre, ceremoniaDireccion: boda.ceremoniaDireccion }),
      },
    };

    setSubmitting(true);
    const { error: insertError } = await supabase.from("eventos").insert({
      id: eventoId, template_id: templateId, nombre_evento: tituloEvento,
      fecha_evento: fecha, datos: datosFinal, pagado: false, aprobado: false,
    });
    setSubmitting(false);
    if (insertError) { setError(`No se pudo enviar: ${insertError.message}`); return; }
    setCreatedId(eventoId);
    setSubmitted(true);
  }

  // ── Pantalla de éxito ──────────────────────────────────────────────────────
  if (submitted) {
    const titulo = cat === "Boda" ? boda.tituloEvento : baby.tituloEvento;
    const msg = `¡Hola! Acabo de completar el formulario para mi invitación "${titulo}" (Diseño: ${selectedTemplate?.nombre}).\nCódigo de pedido: ${createdId}\nQuedo pendiente para las instrucciones de pago.`;
    const waUrl = `https://wa.me/${WHATSAPP_CONTACTO}?text=${encodeURIComponent(msg)}`;
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center font-sans">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
          {/* Icono check */}
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold text-slate-800">¡Datos Recibidos!</h2>
            <p className="text-slate-500 text-sm leading-relaxed">Hemos registrado tu solicitud. Notifícanos por WhatsApp para coordinar el pago y activar tu invitación.</p>
          </div>

          {/* Resumen */}
          <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100 space-y-1.5">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Resumen</p>
            <p className="text-sm font-semibold text-slate-700">Evento: <span className="font-normal">{titulo}</span></p>
            <p className="text-sm font-semibold text-slate-700">Diseño: <span className="font-normal">{selectedTemplate?.nombre} {selectedTemplate?.emoji}</span></p>
            <p className="text-sm font-semibold text-slate-700">Código: <span className="font-mono text-xs font-normal text-slate-500">{createdId}</span></p>
          </div>

          {/* Acciones */}
          <div className="flex flex-col gap-3 max-w-xs mx-auto pt-1">
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm">
              💬 Notificar por WhatsApp
            </a>
            <a href="/" className="text-slate-400 hover:text-slate-600 font-semibold text-sm py-2 text-center">
              ← Volver al inicio
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── Formulario ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          {onBack && <button onClick={onBack} className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider cursor-pointer mb-2">← Volver al Catálogo</button>}
          <h1 className="text-3xl font-extrabold text-slate-800">Formulario de Pedido</h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">Elige el diseño y completa los datos. Nosotros configuramos todo y te contactamos para el pago.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* PASO 1: Plantilla */}
          <Section num={1} title="Selecciona el diseño de tu invitación *">
            <p className="text-xs text-slate-400 mb-3">El precio y las funciones dependen del diseño elegido.</p>

            {/* Dropdown de selección */}
            <select
              value={selectedTemplate?.id ?? ""}
              onChange={(e) => {
                const t = PLANTILLAS_ASISTIDO.find((p) => p.id === e.target.value) ?? null;
                setSelectedTemplate(t);
              }}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50/30 font-semibold text-slate-700 cursor-pointer"
            >
              <option value="">— Elige un diseño —</option>
              {PLANTILLAS_ASISTIDO.map((t) => {
                const cop = getPrecio(t).cop;
                return (
                  <option key={t.id} value={t.id}>
                    {t.emoji} {t.nombre} — ${cop.toLocaleString("es-CO")} COP · USD ${precioUsd(cop)}
                  </option>
                );
              })}
            </select>

            {/* Preview del template seleccionado */}
            {selectedTemplate && (
              <div className="mt-3 flex gap-4 items-center bg-slate-50 border border-slate-200 rounded-2xl p-3">
                {selectedTemplate.previewImg
                  ? <img src={selectedTemplate.previewImg} alt={selectedTemplate.nombre} className="w-20 h-20 rounded-xl object-cover shrink-0 shadow-sm" />
                  : <div className="w-20 h-20 rounded-xl shrink-0 flex items-center justify-center text-4xl shadow-sm" style={{ background: selectedTemplate.gradiente }}>{selectedTemplate.emoji}</div>
                }
                <div>
                  <p className="font-bold text-sm text-slate-800">{selectedTemplate.emoji} {selectedTemplate.nombre}</p>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{selectedTemplate.descripcion}</p>
                  <p className="text-[13px] font-bold text-violet-600 mt-1.5">
                    🇨🇴 ${getPrecio(selectedTemplate).cop.toLocaleString("es-CO")} COP
                    <span className="text-slate-400 font-normal mx-1">·</span>
                    🇺🇸 USD ${precioUsd(getPrecio(selectedTemplate).cop)}
                  </p>
                </div>
              </div>
            )}
          </Section>

          {/* PASO 2: Campos dinámicos — Baby Shower */}
          {cat === "Baby Shower" && (
            <Section num={2} title="Datos del Baby Shower">
              <div className="space-y-4">
                <IField label="Título del Evento *" placeholder="Ej: Baby Shower de Martina" value={baby.tituloEvento} onChange={(v) => sb("tituloEvento", v)} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <IField label="Nombre del bebé *" placeholder="Ej: Martina" value={baby.nombreBebe} onChange={(v) => sb("nombreBebe", v)} hint="Nombre que aparecerá en la invitación." />
                  <IField label="Anfitriones (Opcional)" placeholder="Ej: Sus papitos Sofía y Alejandro" value={baby.anfitriones} onChange={(v) => sb("anfitriones", v)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <IField label="Fecha *" type="date" value={baby.fecha} onChange={(v) => sb("fecha", v)} />
                  <IField label="Hora" type="time" value={baby.hora} onChange={(v) => sb("hora", v)} />
                </div>
                <IField label="Lugar / Salón (Opcional)" placeholder="Ej: Salón Social del Club" value={baby.lugarNombre} onChange={(v) => sb("lugarNombre", v)} />
                <IField label="Dirección (Opcional)" placeholder="Ej: Av. Las Américas # 24-50" value={baby.lugarDireccion} onChange={(v) => sb("lugarDireccion", v)} />
              </div>
            </Section>
          )}

          {/* PASO 2: Campos dinámicos — Boda */}
          {cat === "Boda" && (
            <Section num={2} title="Datos de la Boda">
              <div className="space-y-4">
                <IField label="Título del Evento *" placeholder="Ej: Matrimonio de Valentina & Santiago" value={boda.tituloEvento} onChange={(v) => sw("tituloEvento", v)} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <IField label="Nombre de la novia *" placeholder="Ej: Valentina" value={boda.nombreNovia} onChange={(v) => sw("nombreNovia", v)} />
                  <IField label="Nombre del novio *" placeholder="Ej: Santiago" value={boda.nombreNovio} onChange={(v) => sw("nombreNovio", v)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <IField label="Fecha *" type="date" value={boda.fecha} onChange={(v) => sw("fecha", v)} />
                  <IField label="Hora" type="time" value={boda.hora} onChange={(v) => sw("hora", v)} />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-1">Ceremonia</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <IField label="Lugar de ceremonia" placeholder="Ej: Iglesia San Ignacio" value={boda.ceremoniaNombre} onChange={(v) => sw("ceremoniaNombre", v)} />
                  <IField label="Dirección" placeholder="Ej: Cra 7 #40-62, Bogotá" value={boda.ceremoniaDireccion} onChange={(v) => sw("ceremoniaDireccion", v)} />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-1">Recepción</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <IField label="Salón / Hacienda" placeholder="Ej: Hacienda El Rosal" value={boda.recepcionNombre} onChange={(v) => sw("recepcionNombre", v)} />
                  <IField label="Dirección" placeholder="Ej: Vía Chía km 3" value={boda.recepcionDireccion} onChange={(v) => sw("recepcionDireccion", v)} />
                </div>
              </div>
            </Section>
          )}

          {/* PASO 3: Personalización (solo si eligió plantilla) */}
          {cat && (
            <>
              <Section num={3} title="Personalización adicional">
                <div className="space-y-4">
                  <IField
                    label="Código de vestimenta (Opcional)"
                    placeholder={cat === "Boda" ? "Ej: Formal / Cóctel" : "Ej: Casual, tonos pasteles"}
                    value={cat === "Boda" ? boda.vestimenta : baby.vestimenta}
                    onChange={(v) => cat === "Boda" ? sw("vestimenta", v) : sb("vestimenta", v)}
                  />
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      {cat === "Boda" ? "Mensaje de los novios (Opcional)" : "Mensaje de bienvenida (Opcional)"}
                    </label>
                    <textarea rows={3}
                      placeholder={cat === "Boda" ? "Ej: Con mucha alegría los invitamos a compartir este día..." : "Ej: Acompáñanos a compartir este momento tan especial..."}
                      value={cat === "Boda" ? boda.mensajePersonalizado : baby.mensajePersonalizado}
                      onChange={(e) => cat === "Boda" ? sw("mensajePersonalizado", e.target.value) : sb("mensajePersonalizado", e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50/30 resize-none"
                    />
                  </div>
                  <IField
                    label="Fecha límite confirmación (Opcional)"
                    placeholder="Ej: 20 de Agosto"
                    value={cat === "Boda" ? boda.rsvpDeadline : baby.rsvpDeadline}
                    onChange={(v) => cat === "Boda" ? sw("rsvpDeadline", v) : sb("rsvpDeadline", v)}
                  />
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Canción de fondo de preferencia (Opcional)</label>
                    <BuscadorCancion value={cancion} onChange={setCancion} />
                    <p className="text-[10px] text-slate-400">Busca y selecciona la canción para el reproductor.</p>
                  </div>
                </div>
              </Section>

              {/* PASO 4: Módulos */}
              <Section num={4} title="Activar módulos adicionales">
                <p className="text-xs text-slate-400 mb-3">Elige qué secciones quieres en tu invitación:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <CkFeat label="Muro de Deseos" checked={features.muroDeseos} onChange={(v) => updateFeature("muroDeseos", v)} />
                  <CkFeat label="Formulario RSVP" checked={features.rsvp} onChange={(v) => updateFeature("rsvp", v)} />
                  <CkFeat label="Cuenta Regresiva" checked={features.countdown} onChange={(v) => updateFeature("countdown", v)} />
                  <CkFeat label="Mapa de Ubicación" checked={features.mapa} onChange={(v) => updateFeature("mapa", v)} />
                  <CkFeat label="Música de Fondo" checked={features.musica} onChange={(v) => updateFeature("musica", v)} />
                </div>
              </Section>

              {/* PASO 5: Contacto */}
              <Section num={5} title="Tus datos de contacto *">
                <p className="text-xs text-slate-400 mb-3">Los usamos para coordinar los detalles y el pago contigo.</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <IField label="Tu WhatsApp / Celular *" type="tel" placeholder="+57 305 750 2790"
                      value={cat === "Boda" ? boda.telefonoContacto : baby.telefonoContacto}
                      onChange={(v) => cat === "Boda" ? sw("telefonoContacto", v) : sb("telefonoContacto", v)} />
                    <div>
                      <IField label="WhatsApp para confirmaciones RSVP *" type="tel" placeholder="573057502790 (sin espacios)"
                        value={cat === "Boda" ? boda.whatsappNumero : baby.whatsappNumero}
                        onChange={(v) => cat === "Boda" ? sw("whatsappNumero", v) : sb("whatsappNumero", v)} />
                      <p className="text-[10px] text-slate-400 mt-1">Número al que llegarán las confirmaciones de asistencia.</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Observaciones / Notas adicionales (Opcional)</label>
                    <textarea rows={3}
                      placeholder="Ej: color de fondo preferido, link de lista de regalos, detalles especiales..."
                      value={cat === "Boda" ? boda.observaciones : baby.observaciones}
                      onChange={(e) => cat === "Boda" ? sw("observaciones", e.target.value) : sb("observaciones", e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50/30 resize-none"
                    />
                  </div>
                </div>
              </Section>
            </>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-2xl font-semibold">⚠️ {error}</div>
          )}

          <button type="submit" disabled={submitting || !selectedTemplate}
            className="w-full bg-[#5A1B5E] hover:bg-[#4a1650] disabled:opacity-40 text-white font-extrabold py-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm">
            {submitting
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Enviando...</span></>
              : <span>Enviar solicitud y registrar pedido →</span>
            }
          </button>
          {!selectedTemplate && <p className="text-center text-xs text-slate-400">Elige un diseño para continuar.</p>}
        </form>
      </div>
    </div>
  );
}

// ── Auxiliares ────────────────────────────────────────────────────────────────
function Section({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
      <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
        <span className="bg-violet-50 text-violet-600 text-xs w-6 h-6 rounded-full inline-flex items-center justify-center font-bold shrink-0">{num}</span>
        <span>{title}</span>
      </h2>
      {children}
    </div>
  );
}

function IField({ label, placeholder, value, onChange, type = "text", hint }: { label: string; placeholder?: string; value: string; onChange: (v: string) => void; type?: string; hint?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{label}</label>
      {hint && <p className="text-[10px] text-slate-400">{hint}</p>}
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50/30" />
    </div>
  );
}

function CkFeat({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 p-3 border border-slate-200 rounded-xl cursor-pointer select-none hover:bg-slate-50">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500/20 border-slate-300" />
      <span className="text-xs font-semibold text-slate-700">{label}</span>
    </label>
  );
}
