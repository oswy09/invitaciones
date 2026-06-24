import { useState } from "react";
import { InvitationData, CATALOGO, TemplateInfo, WHATSAPP_CONTACTO } from "../types";
import { supabase } from "../lib/supabase";
import BuscadorCancion, { CancionSeleccionada } from "./BuscadorCancion";

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

export default function FormularioAsistido({ onBack }: FormularioAsistidoProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateInfo | null>(null);

  // Campos del Formulario
  const [tituloEvento, setTituloEvento] = useState("");
  const [nombrePrincipal, setNombrePrincipal] = useState("");
  const [anfitriones, setAnfitriones] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  
  const [lugarNombre, setLugarNombre] = useState("");
  const [lugarDireccion, setLugarDireccion] = useState("");
  
  const [vestimenta, setVestimenta] = useState("");
  const [whatsappNumero, setWhatsappNumero] = useState("");
  const [rsvpDeadline, setRsvpDeadline] = useState("");
  const [mensajePersonalizado, setMensajePersonalizado] = useState("");
  const [cancion, setCancion] = useState<CancionSeleccionada | null>(null);
  
  const [features, setFeatures] = useState({
    muroDeseos: true,
    rsvp: true,
    countdown: true,
    mapa: true,
    musica: false,
  });

  const [observaciones, setObservaciones] = useState("");
  const [telefonoContacto, setTelefonoContacto] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function updateFeature(key: keyof typeof features, val: boolean) {
    setFeatures((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!selectedTemplate) {
      setError("Por favor, selecciona el tema o diseño de tu invitación.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!tituloEvento.trim() || !nombrePrincipal.trim() || !fecha.trim() || !telefonoContacto.trim() || !whatsappNumero.trim()) {
      setError("Completa los campos requeridos marcados con asterisco (*). Ambos números de contacto son obligatorios.");
      return;
    }

    const templateId = selectedTemplate.id;
    const eventoId = `contacto-${slugify(nombrePrincipal)}-${slugify(templateId)}-${Date.now().toString(36)}`;

    // Datos estructurados en InvitationData
    const datosFinal: InvitationData = {
      eventoId,
      templateId,
      pagado: false,
      tituloEvento: tituloEvento,
      nombresPrincipales: [nombrePrincipal],
      anfitriones: anfitriones,
      fecha: fecha,
      hora: hora,
      lugar: {
        nombre: lugarNombre,
        direccion: lugarDireccion,
        mapUrl: "", // Se asigna en admin
      },
      vestimenta: vestimenta,
      mensajePersonalizado: mensajePersonalizado,
      whatsappNumero: whatsappNumero,
      features: features,
      extra: {
        origen: "formulario_contacto",
        rsvpDeadline: rsvpDeadline,
        cancionSeleccionada: cancion,
        observaciones: observaciones,
        telefonoContacto: telefonoContacto,
      }
    };

    setSubmitting(true);
    const { error: insertError } = await supabase.from("eventos").insert({
      id: eventoId,
      template_id: templateId,
      nombre_evento: tituloEvento,
      fecha_evento: fecha,
      datos: datosFinal,
      pagado: false,
      aprobado: false,
    });
    setSubmitting(false);

    if (insertError) {
      setError(`No se pudo enviar la solicitud: ${insertError.message}`);
      return;
    }

    setCreatedId(eventoId);
    setSubmitted(true);
  }

  if (submitted) {
    const mensajeWhatsapp =
      `¡Hola! Acabo de completar el formulario para mi invitación "${tituloEvento}" (Tema: ${selectedTemplate?.nombre}).\n` +
      `Código de pedido: ${createdId}\n` +
      `Quedo pendiente para las instrucciones de pago.`;
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_CONTACTO}?text=${encodeURIComponent(mensajeWhatsapp)}`;

    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center font-sans">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-6xl animate-bounce">🎉</div>
          <h2 className="text-2xl font-bold text-slate-800">¡Datos Recibidos Exitosamente!</h2>
          <p className="text-slate-500 leading-relaxed text-sm">
            Hemos registrado toda la información para tu invitación digital. Ahora, por favor haz clic en el botón de abajo para reportar tu envío por WhatsApp y coordinar el pago de activación.
          </p>
          
          <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100 space-y-2">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Resumen del registro</p>
            <p className="text-sm font-semibold text-slate-700">Evento: <span className="font-normal">{tituloEvento}</span></p>
            <p className="text-sm font-semibold text-slate-700">Diseño seleccionado: <span className="font-normal">{selectedTemplate?.nombre} {selectedTemplate?.emoji}</span></p>
            <p className="text-sm font-semibold text-slate-700">Código de Pedido: <span className="font-mono text-xs font-normal text-slate-500">{createdId}</span></p>
          </div>

          <div className="flex flex-col gap-3 max-w-xs mx-auto pt-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              💬 Notificar Envío por WhatsApp
            </a>
            {onBack && (
              <button
                onClick={onBack}
                className="text-slate-500 hover:text-slate-700 font-semibold px-6 py-3 cursor-pointer text-sm"
              >
                ← Volver al inicio
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-755">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Encabezado */}
        <div className="text-center space-y-2">
          {onBack && (
            <button
              onClick={onBack}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider cursor-pointer mb-2"
            >
              ← Volver al Catálogo
            </button>
          )}
          <h1 className="text-3xl font-extrabold text-slate-800">Formulario de Registro</h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            Completa la información que deseas incluir en tu invitación. Nosotros nos encargaremos de configurar todo en base a tus respuestas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECCIÓN 1: Selección de Tema */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="bg-violet-50 text-violet-600 text-xs w-6 h-6 rounded-full inline-flex items-center justify-center font-bold">1</span>
              <span>Selecciona la plantilla de tu invitación *</span>
            </h2>
            <p className="text-xs text-slate-400">Escoge el diseño base que te gustaría usar para el evento:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {CATALOGO.map((t) => {
                const isSelected = selectedTemplate?.id === t.id;
                const imagePath = `/${t.id.replace("01-", "dino_").replace("02-", "stork_").replace("03-", "space_")}_mockup.png`;
                
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTemplate(t)}
                    className={`bg-white border rounded-2xl overflow-hidden cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-violet-600 ring-2 ring-violet-500/20 shadow-md"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-xs"
                    }`}
                  >
                    <div className="relative aspect-video sm:aspect-square bg-slate-100 overflow-hidden">
                      <img
                        src={imagePath}
                        alt={`Mockup de ${t.nombre}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="p-3 text-center">
                      <p className="font-bold text-xs text-slate-800">{t.nombre} {t.emoji}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECCIÓN 2: Información Básica */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="bg-violet-50 text-violet-600 text-xs w-6 h-6 rounded-full inline-flex items-center justify-center font-bold">2</span>
              <span>Información Básica del Evento</span>
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Título del Evento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Baby Shower de Martina"
                  value={tituloEvento}
                  onChange={(e) => setTituloEvento(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Nombre Principal *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Martina"
                    value={nombrePrincipal}
                    onChange={(e) => setNombrePrincipal(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50/30"
                  />
                  <p className="text-[10px] text-slate-400">El nombre del bebé o festejado principal.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Anfitriones (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Sus papitos Sofía y Alejandro"
                    value={anfitriones}
                    onChange={(e) => setAnfitriones(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Hora (Opcional)
                  </label>
                  <input
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50/30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: Lugar y Dirección */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="bg-violet-50 text-violet-600 text-xs w-6 h-6 rounded-full inline-flex items-center justify-center font-bold">3</span>
              <span>Lugar y Ubicación</span>
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Nombre del Lugar / Salón (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Salón Social Club Campestre o Casa de los abuelos"
                  value={lugarNombre}
                  onChange={(e) => setLugarNombre(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Dirección Física (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Av. Las Américas # 24-50, Apto 402"
                  value={lugarDireccion}
                  onChange={(e) => setLugarDireccion(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50/30"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 4: Detalles Adicionales */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="bg-violet-50 text-violet-600 text-xs w-6 h-6 rounded-full inline-flex items-center justify-center font-bold">4</span>
              <span>Detalles de la Invitación</span>
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Código de Vestimenta (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Casual de blanco / Semiformal"
                    value={vestimenta}
                    onChange={(e) => setVestimenta(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Fecha límite RSVP (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 14 de Julio"
                    value={rsvpDeadline}
                    onChange={(e) => setRsvpDeadline(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50/30"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Mensaje de Bienvenida / Párrafo Intro (Opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Ej: Acompáñanos a compartir una mañana especial al aire libre llena de amor..."
                  value={mensajePersonalizado}
                  onChange={(e) => setMensajePersonalizado(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50/30 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Canción de Fondo de Preferencia (Opcional)
                </label>
                <BuscadorCancion value={cancion} onChange={setCancion} />
                <p className="text-[10px] text-slate-400">Busca la canción para vincular al reproductor de música.</p>
              </div>
            </div>
          </div>

          {/* SECCIÓN 5: Características/Módulos */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="bg-violet-50 text-violet-600 text-xs w-6 h-6 rounded-full inline-flex items-center justify-center font-bold">5</span>
              <span>Activar Módulos Adicionales</span>
            </h2>
            <p className="text-xs text-slate-400">Elige qué secciones especiales quieres que se muestren en tu tarjeta:</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2.5 p-3 border border-slate-200 rounded-xl cursor-pointer select-none hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={features.muroDeseos}
                  onChange={(e) => updateFeature("muroDeseos", e.target.checked)}
                  className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500/20 border-slate-300"
                />
                <span className="text-xs font-semibold text-slate-700">Muro de Deseos</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 border border-slate-200 rounded-xl cursor-pointer select-none hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={features.rsvp}
                  onChange={(e) => updateFeature("rsvp", e.target.checked)}
                  className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500/20 border-slate-300"
                />
                <span className="text-xs font-semibold text-slate-700">Formulario RSVP</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 border border-slate-200 rounded-xl cursor-pointer select-none hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={features.countdown}
                  onChange={(e) => updateFeature("countdown", e.target.checked)}
                  className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500/20 border-slate-300"
                />
                <span className="text-xs font-semibold text-slate-700">Cuenta Regresiva</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 border border-slate-200 rounded-xl cursor-pointer select-none hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={features.mapa}
                  onChange={(e) => updateFeature("mapa", e.target.checked)}
                  className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500/20 border-slate-300"
                />
                <span className="text-xs font-semibold text-slate-700">Mapa de Ubicación</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 border border-slate-200 rounded-xl cursor-pointer select-none hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={features.musica}
                  onChange={(e) => updateFeature("musica", e.target.checked)}
                  className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500/20 border-slate-300"
                />
                <span className="text-xs font-semibold text-slate-700">Reproducción Música</span>
              </label>
            </div>
          </div>

          {/* SECCIÓN 6: Datos de Contacto y Seguimiento */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="bg-violet-50 text-violet-600 text-xs w-6 h-6 rounded-full inline-flex items-center justify-center font-bold">6</span>
              <span>Datos de Contacto (Para Coordinación) *</span>
            </h2>
            <p className="text-xs text-slate-400">Usaremos esta información de contacto para escribirte y coordinar los detalles.</p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Tu número de Celular / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej: +57 305 750 2790"
                    value={telefonoContacto}
                    onChange={(e) => setTelefonoContacto(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    WhatsApp para Confirmaciones RSVP *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej: 573000000000 (Sin símbolos ni espacios)"
                    value={whatsappNumero}
                    onChange={(e) => setWhatsappNumero(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50/30"
                  />
                  <p className="text-[10px] text-slate-400">El número al que llegarán las confirmaciones por WhatsApp.</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Observaciones adicionales / Notas internas (Opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalles adicionales para administración (ej: color de fondo preferido, enlaces a listas de regalos particulares, etc.)."
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50/30 resize-none"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-2xl font-semibold">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-violet-600 hover:bg-violet-750 disabled:opacity-50 text-white font-extrabold py-4 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Registrando Datos...</span>
              </>
            ) : (
              <span>Enviar Información y Registrar Pedido ➔</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
