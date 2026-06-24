import React, { useState } from "react";
import { Pedido, InvitationData } from "../types";
import { api } from "../lib/api";
import { IconWarning, IconCheckCircle } from "./Icons";

interface EditorPedidoProps {
  pedido: Pedido;
  onClose: () => void;
  onSaved: () => void;
}

type TabType = "general" | "fecha_lugar" | "features" | "textos" | "json";

export default function EditorPedido({ pedido, onClose, onSaved }: EditorPedidoProps) {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [nombreEvento, setNombreEvento] = useState(pedido.nombre_evento);
  const [templateId, setTemplateId] = useState(pedido.template_id);
  const [subTab, setSubTab] = useState<"intro" | "lugar" | "regalos" | "rsvp" | "muro">("intro");
  const activeSubTab = (templateId === "03-space" && subTab === "muro") ? "intro" : subTab;
  
  // Clonar el objeto datos para no mutar el original directamente
  const [datos, setDatos] = useState<InvitationData>(() => JSON.parse(JSON.stringify(pedido.datos)));
  
  // Estado para el editor JSON
  const [jsonText, setJsonText] = useState(() => JSON.stringify(pedido.datos, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sincronizar cambios visuales a JSON
  const actualizarDatos = (nuevosDatos: Partial<InvitationData>) => {
    setDatos((prev) => {
      const actualizados = { ...prev, ...nuevosDatos };
      setJsonText(JSON.stringify(actualizados, null, 2));
      return actualizados;
    });
  };

  // Sincronizar cambios de sub-objetos
  const actualizarSubDatos = (key: keyof InvitationData, subKey: string, valor: any) => {
    setDatos((prev) => {
      const subObjeto = (prev[key] as any) || {};
      const actualizados = {
        ...prev,
        [key]: {
          ...subObjeto,
          [subKey]: valor,
        },
      };
      setJsonText(JSON.stringify(actualizados, null, 2));
      return actualizados;
    });
  };

  // Manejar edición de JSON manual
  const handleJsonChange = (val: string) => {
    setJsonText(val);
    try {
      const parsed = JSON.parse(val);
      setDatos(parsed);
      setJsonError(null);
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : "JSON Inválido");
    }
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (jsonError) {
      setError("Corrige los errores en el editor JSON antes de guardar.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await api.actualizarPedido(pedido.id, {
        nombre_evento: nombreEvento,
        template_id: templateId,
        datos: datos,
      });
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
      <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-2xl h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in font-sans text-stone-850">
        
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900">Editar Datos de la Invitación</h2>
            <p className="text-[10px] text-stone-400 font-inter uppercase tracking-wider font-semibold">ID: {pedido.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 text-sm font-semibold cursor-pointer font-inter"
          >
            Cerrar
          </button>
        </div>

        {/* Barra de Pestañas */}
        <div className="flex border-b border-stone-200 px-4 bg-stone-50/20 shrink-0 font-inter text-[11px] font-bold">
          <TabButton active={activeTab === "general"} label="General" onClick={() => setActiveTab("general")} />
          <TabButton active={activeTab === "fecha_lugar"} label="Lugar & Fecha" onClick={() => setActiveTab("fecha_lugar")} />
          <TabButton active={activeTab === "features"} label="Módulos & Extras" onClick={() => setActiveTab("features")} />
          <TabButton active={activeTab === "textos"} label="Textos Fijos" onClick={() => setActiveTab("textos")} />
          <TabButton active={activeTab === "json"} label="JSON Avanzado" onClick={() => {
            // Sincronizar el texto JSON por si hubo cambios visuales
            setJsonText(JSON.stringify(datos, null, 2));
            setActiveTab("json");
          }} />
        </div>

        {/* Contenido (Scrollable) */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-xl font-medium flex items-center gap-2 font-inter">
              <IconWarning className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === "general" && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-inter">Información Básica</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-inter">Nombre del Evento</label>
                  <input
                    type="text"
                    required
                    value={nombreEvento}
                    onChange={(e) => setNombreEvento(e.target.value)}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-inter">ID Plantilla (Template)</label>
                  <select
                    value={templateId}
                    onChange={(e) => setTemplateId(e.target.value)}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50"
                  >
                    <option value="01-dino">01-dino (Dinosaurio)</option>
                    <option value="02-stork">02-stork (Cigüeña)</option>
                    <option value="03-space">03-space (Espacio)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-inter">WhatsApp del Cliente</label>
                  <input
                    type="text"
                    value={datos.whatsappNumero || ""}
                    onChange={(e) => actualizarDatos({ whatsappNumero: e.target.value })}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                    placeholder="Ej. +573154384042"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-inter">Anfitriones / Padres</label>
                  <input
                    type="text"
                    value={datos.anfitriones || ""}
                    onChange={(e) => actualizarDatos({ anfitriones: e.target.value })}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                    placeholder="Ej. Sofía y Alejandro"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "fecha_lugar" && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-inter">Coordinación de Fecha y Hora</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-inter">Texto de Fecha Descriptivo</label>
                <input
                  type="text"
                  value={datos.fechaTexto || ""}
                  onChange={(e) => actualizarDatos({ fechaTexto: e.target.value })}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                  placeholder="Ej. Sábado, 28 de Junio a las 3:00 PM"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-inter">Fecha (ISO)</label>
                  <input
                    type="date"
                    value={datos.fecha || ""}
                    onChange={(e) => actualizarDatos({ fecha: e.target.value })}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-inter">Hora (24h)</label>
                  <input
                    type="time"
                    value={datos.hora || ""}
                    onChange={(e) => actualizarDatos({ hora: e.target.value })}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50"
                  />
                </div>
              </div>

              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-inter pt-4">Lugar del Evento</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-inter">Nombre de Ubicación / Salón</label>
                <input
                  type="text"
                  value={datos.lugar?.nombre || ""}
                  onChange={(e) => actualizarSubDatos("lugar", "nombre", e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-inter">Dirección Física</label>
                <input
                  type="text"
                  value={datos.lugar?.direccion || ""}
                  onChange={(e) => actualizarSubDatos("lugar", "direccion", e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-inter">URL Enlace de Google Maps / Waze</label>
                <input
                  type="text"
                  value={datos.lugar?.mapUrl || ""}
                  onChange={(e) => actualizarSubDatos("lugar", "mapUrl", e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>
          )}

          {activeTab === "features" && (
            <div className="space-y-5">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-inter">Módulos Activos</h3>
              
              <div className="grid grid-cols-2 gap-3 font-inter">
                <FeatureCheckbox
                  label="Muro de deseos"
                  checked={!!datos.features?.muroDeseos}
                  onChange={(val) => actualizarSubDatos("features", "muroDeseos", val)}
                />
                <FeatureCheckbox
                  label="Confirmaciones RSVP"
                  checked={!!datos.features?.rsvp}
                  onChange={(val) => actualizarSubDatos("features", "rsvp", val)}
                />
                <FeatureCheckbox
                  label="Cuenta Regresiva"
                  checked={!!datos.features?.countdown}
                  onChange={(val) => actualizarSubDatos("features", "countdown", val)}
                />
                <FeatureCheckbox
                  label="Mapa Integrado"
                  checked={!!datos.features?.mapa}
                  onChange={(val) => actualizarSubDatos("features", "mapa", val)}
                />
                <FeatureCheckbox
                  label="Reproductor Música"
                  checked={!!datos.features?.musica}
                  onChange={(val) => actualizarSubDatos("features", "musica", val)}
                />
                <FeatureCheckbox
                  label="Acompañamiento Asistido"
                  checked={!!datos.asistido}
                  onChange={(val) => actualizarDatos({ asistido: val })}
                />
              </div>

              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-inter pt-4">Textos y Extras</h3>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-inter">Código de Vestimenta</label>
                <input
                  type="text"
                  value={datos.vestimenta || ""}
                  onChange={(e) => actualizarDatos({ vestimenta: e.target.value })}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50"
                  placeholder="Ej. Casual o semiformal"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-inter">Mensaje de Bienvenida</label>
                <textarea
                  value={datos.mensajePersonalizado || ""}
                  onChange={(e) => actualizarDatos({ mensajePersonalizado: e.target.value })}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs h-20 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-inter">Observaciones de Administración / Notas</label>
                <textarea
                  value={(datos.extra?.observaciones as string) || ""}
                  onChange={(e) => actualizarSubDatos("extra", "observaciones", e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs h-16 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50"
                  placeholder="Notas internas que solo ve administración"
                />
              </div>
            </div>
          )}

          {activeTab === "textos" && (
            <div className="space-y-4 font-inter text-xs">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-inter">Textos y Etiquetas de la Plantilla</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Modifica los textos predeterminados de la invitación para personalizarlos según el cliente.
              </p>

              {/* Sub-pestañas para organizar el editor */}
              <div className="flex flex-wrap gap-1 bg-stone-100 p-1 rounded-xl shrink-0">
                <MiniTabButton active={activeSubTab === "intro"} label="Intro & Banners" onClick={() => setSubTab("intro")} />
                <MiniTabButton active={activeSubTab === "lugar"} label="Lugar & Mapas" onClick={() => setSubTab("lugar")} />
                <MiniTabButton active={activeSubTab === "regalos"} label="Regalos & Reloj" onClick={() => setSubTab("regalos")} />
                <MiniTabButton active={activeSubTab === "rsvp"} label="RSVP" onClick={() => setSubTab("rsvp")} />
                {templateId !== "03-space" && (
                  <MiniTabButton active={activeSubTab === "muro"} label="Libro / Muro" onClick={() => setSubTab("muro")} />
                )}
              </div>

              {activeSubTab === "intro" && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Texto sobre cerrado</label>
                      <input
                        type="text"
                        value={(datos.extra?.txtSobre as string) || ""}
                        onChange={(e) => actualizarSubDatos("extra", "txtSobre", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                        placeholder="Defecto: Dale clic al sobre para abrir"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Texto Cabecera (Bunting Banner)</label>
                      <input
                        type="text"
                        value={(datos.extra?.txtBordo as string) || ""}
                        onChange={(e) => actualizarSubDatos("extra", "txtBordo", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                        placeholder="Defecto: Te invitamos a bordo / SHOWER"
                      />
                    </div>
                  </div>

                  {(templateId === "02-stork" || templateId === "03-space") && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Texto animación intro (Stork/Space)</label>
                        <input
                          type="text"
                          value={(datos.extra?.txtIntroAnimacion as string) || ""}
                          onChange={(e) => actualizarSubDatos("extra", "txtIntroAnimacion", e.target.value)}
                          className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                          placeholder="Defecto: ¡Hola! Tenemos un mensaje..."
                        />
                      </div>

                      {templateId !== "03-space" && (
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Texto de Introducción / Subtítulo</label>
                          <input
                            type="text"
                            value={(datos.extra?.txtIntro as string) || ""}
                            onChange={(e) => actualizarSubDatos("extra", "txtIntro", e.target.value)}
                            className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                            placeholder="Defecto: Un pequeño príncipe está por aterrizar..."
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {templateId === "01-dino" && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Texto de Introducción / Subtítulo</label>
                      <input
                        type="text"
                        value={(datos.extra?.txtIntro as string) || ""}
                        onChange={(e) => actualizarSubDatos("extra", "txtIntro", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                        placeholder="Defecto: Un pequeño príncipe está por aterrizar..."
                      />
                    </div>
                  )}

                  {templateId === "02-stork" && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Texto Bunting secundario (Stork)</label>
                      <input
                        type="text"
                        value={(datos.extra?.txtBuntingShower as string) || ""}
                        onChange={(e) => actualizarSubDatos("extra", "txtBuntingShower", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                        placeholder="Defecto: SHOWER"
                      />
                    </div>
                  )}

                  {templateId === "03-space" && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Hint Despegue Cohete (Space)</label>
                          <input
                            type="text"
                            value={(datos.extra?.txtIntroHint as string) || ""}
                            onChange={(e) => actualizarSubDatos("extra", "txtIntroHint", e.target.value)}
                            className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                            placeholder="Defecto: ¡Preparando despegue automático..."
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Tooltip Cohete (Space)</label>
                          <input
                            type="text"
                            value={(datos.extra?.txtIntroTooltip as string) || ""}
                            onChange={(e) => actualizarSubDatos("extra", "txtIntroTooltip", e.target.value)}
                            className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                            placeholder="Defecto: [Nombre] ya se acerca a nosotros"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Destino Cohete (Space)</label>
                          <input
                            type="text"
                            value={(datos.extra?.txtIntroDestino as string) || ""}
                            onChange={(e) => actualizarSubDatos("extra", "txtIntroDestino", e.target.value)}
                            className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                            placeholder="Defecto: ¡Destino: Baby Shower de [Nombre]!"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Título Aterrizaje (Space)</label>
                          <input
                            type="text"
                            value={(datos.extra?.txtIntroAterrizaje as string) || ""}
                            onChange={(e) => actualizarSubDatos("extra", "txtIntroAterrizaje", e.target.value)}
                            className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                            placeholder="Defecto: ¡Aterrizaje Exitoso!"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Subtítulo Aterrizaje (Space)</label>
                        <input
                          type="text"
                          value={(datos.extra?.txtIntroAterrizajeSub as string) || ""}
                          onChange={(e) => actualizarSubDatos("extra", "txtIntroAterrizajeSub", e.target.value)}
                          className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                          placeholder="Defecto: ¡El cohete ha traído de forma..."
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeSubTab === "lugar" && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Etiqueta de Fecha</label>
                      <input
                        type="text"
                        value={(datos.extra?.txtFechaLabel as string) || ""}
                        onChange={(e) => actualizarSubDatos("extra", "txtFechaLabel", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                        placeholder="Defecto: FECHA / Cuándo"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Etiqueta de Hora</label>
                      <input
                        type="text"
                        value={(datos.extra?.txtHoraLabel as string) || ""}
                        onChange={(e) => actualizarSubDatos("extra", "txtHoraLabel", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                        placeholder="Defecto: HORA"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Etiqueta de Lugar</label>
                      <input
                        type="text"
                        value={(datos.extra?.txtLugarLabel as string) || ""}
                        onChange={(e) => actualizarSubDatos("extra", "txtLugarLabel", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                        placeholder="Defecto: UBICACIÓN / Dónde"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Etiqueta de Parqueadero</label>
                      <input
                        type="text"
                        value={(datos.extra?.txtParqueadero as string) || ""}
                        onChange={(e) => actualizarSubDatos("extra", "txtParqueadero", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                        placeholder="Defecto: Parqueadero disponible"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Botón Agendar Calendario</label>
                      <input
                        type="text"
                        value={(datos.extra?.txtAgendar as string) || ""}
                        onChange={(e) => actualizarSubDatos("extra", "txtAgendar", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                        placeholder="Defecto: Agendar el evento"
                      />
                    </div>
                  </div>

                  {templateId !== "03-space" && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Botón Cómo Llegar / Ver Ubicación</label>
                      <input
                        type="text"
                        value={(datos.extra?.txtComoLlegar as string) || ""}
                        onChange={(e) => actualizarSubDatos("extra", "txtComoLlegar", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                        placeholder="Defecto: Cómo llegar / VER UBICACIÓN"
                      />
                    </div>
                  )}

                  {templateId === "03-space" && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Título de Navegación (Space)</label>
                          <input
                            type="text"
                            value={(datos.extra?.txtNavegacionEstelar as string) || ""}
                            onChange={(e) => actualizarSubDatos("extra", "txtNavegacionEstelar", e.target.value)}
                            className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                            placeholder="Defecto: Iniciar Navegación Estelar 🧭"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Botón Google Maps (Space)</label>
                          <input
                            type="text"
                            value={(datos.extra?.txtGoogleMaps as string) || ""}
                            onChange={(e) => actualizarSubDatos("extra", "txtGoogleMaps", e.target.value)}
                            className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                            placeholder="Defecto: Google Maps"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Botón Waze (Space)</label>
                          <input
                            type="text"
                            value={(datos.extra?.txtWaze as string) || ""}
                            onChange={(e) => actualizarSubDatos("extra", "txtWaze", e.target.value)}
                            className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                            placeholder="Defecto: Abrir Waze"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Botón Copiar Dirección (Space)</label>
                          <input
                            type="text"
                            value={(datos.extra?.txtCopiarDireccion as string) || ""}
                            onChange={(e) => actualizarSubDatos("extra", "txtCopiarDireccion", e.target.value)}
                            className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                            placeholder="Defecto: Copiar Dirección"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Msg Éxito Copiado (Space)</label>
                          <input
                            type="text"
                            value={(datos.extra?.txtCopiadoExito as string) || ""}
                            onChange={(e) => actualizarSubDatos("extra", "txtCopiadoExito", e.target.value)}
                            className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                            placeholder="Defecto: ¡Copiado con Éxito! 🪐"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Botón Volver al Despegue (Space)</label>
                          <input
                            type="text"
                            value={(datos.extra?.txtVolverDespegue as string) || ""}
                            onChange={(e) => actualizarSubDatos("extra", "txtVolverDespegue", e.target.value)}
                            className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                            placeholder="Defecto: Volver al Despegue 🚀"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeSubTab === "regalos" && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Título de Regalos</label>
                      <input
                        type="text"
                        value={(datos.extra?.txtSugerenciaRegalo as string) || ""}
                        onChange={(e) => actualizarSubDatos("extra", "txtSugerenciaRegalo", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                        placeholder="Defecto: Sugerencia de regalo / Lista de Regalos"
                      />
                    </div>

                    {templateId !== "03-space" && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Texto Espera (Dino/Stork)</label>
                        <input
                          type="text"
                          value={(datos.extra?.txtEspera as string) || ""}
                          onChange={(e) => actualizarSubDatos("extra", "txtEspera", e.target.value)}
                          className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                          placeholder="Defecto: ¡Te esperamos con los brazos abiertos!"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Mensaje / Nota Regalos</label>
                    <textarea
                      value={(datos.extra?.txtNotaRegalo as string) || ""}
                      onChange={(e) => actualizarSubDatos("extra", "txtNotaRegalo", e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs h-16 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                      placeholder="Defecto: ¡Tu cariño es nuestro mejor regalo!..."
                    />
                  </div>

                  {templateId === "03-space" && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Etiqueta Cuenta Regresiva (Space)</label>
                          <input
                            type="text"
                            value={(datos.extra?.txtCountdownLabel as string) || ""}
                            onChange={(e) => actualizarSubDatos("extra", "txtCountdownLabel", e.target.value)}
                            className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                            placeholder="Defecto: 🧁 CUENTA REGRESIVA DE SUEÑOS:"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Preparando Encuentro (Space)</label>
                          <input
                            type="text"
                            value={(datos.extra?.txtPrepEncuentro as string) || ""}
                            onChange={(e) => actualizarSubDatos("extra", "txtPrepEncuentro", e.target.value)}
                            className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                            placeholder="Defecto: 💫 Preparando el Gran Encuentro"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">El Dulce Viaje (Space)</label>
                          <input
                            type="text"
                            value={(datos.extra?.txtDulceViaje as string) || ""}
                            onChange={(e) => actualizarSubDatos("extra", "txtDulceViaje", e.target.value)}
                            className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                            placeholder="Defecto: El Dulce Viaje de [Nombre]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Besos al Espacio (Space)</label>
                          <input
                            type="text"
                            value={(datos.extra?.txtBesosEspacio as string) || ""}
                            onChange={(e) => actualizarSubDatos("extra", "txtBesosEspacio", e.target.value)}
                            className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                            placeholder="Defecto: Besos y buenos deseos..."
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Plantilla Cuenta Regresiva (Space)</label>
                        <textarea
                          value={(datos.extra?.txtCountdownTemplate as string) || ""}
                          onChange={(e) => actualizarSubDatos("extra", "txtCountdownTemplate", e.target.value)}
                          className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs h-16 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                          placeholder="Defecto: ¡Faltan exactamente {daysLeft} siestas y noches de dulces sueños..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Texto Pie de Página (Space)</label>
                        <input
                          type="text"
                          value={(datos.extra?.txtFooter as string) || ""}
                          onChange={(e) => actualizarSubDatos("extra", "txtFooter", e.target.value)}
                          className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                          placeholder="Defecto: [Nombre] Baby Shower • Hecho con Amor 🪐"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeSubTab === "rsvp" && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Título de RSVP</label>
                      <input
                        type="text"
                        value={(datos.extra?.txtRsvpTitulo as string) || ""}
                        onChange={(e) => actualizarSubDatos("extra", "txtRsvpTitulo", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                        placeholder="Defecto: Confirmación de asistencia"
                      />
                    </div>

                    {templateId !== "03-space" && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Pregunta de Asistencia (Dino/Stork)</label>
                        <input
                          type="text"
                          value={(datos.extra?.txtRsvpPregunta as string) || ""}
                          onChange={(e) => actualizarSubDatos("extra", "txtRsvpPregunta", e.target.value)}
                          className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                          placeholder="Defecto: ¿Podrás acompañarnos?"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Subtítulo de RSVP (Ayúdanos a planear antes del...)</label>
                    <input
                      type="text"
                      value={(datos.extra?.txtRsvpSub as string) || ""}
                      onChange={(e) => actualizarSubDatos("extra", "txtRsvpSub", e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                      placeholder="Defecto: Por favor ayúdanos a planear mejor confirmando antes..."
                    />
                  </div>

                  {templateId !== "03-space" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Etiqueta de Nombre</label>
                        <input
                          type="text"
                          value={(datos.extra?.txtRsvpNombreLabel as string) || ""}
                          onChange={(e) => actualizarSubDatos("extra", "txtRsvpNombreLabel", e.target.value)}
                          className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                          placeholder="Defecto: Tu Nombre / Familia"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Opción Solo Yo</label>
                        <input
                          type="text"
                          value={(datos.extra?.txtRsvpSoloYo as string) || ""}
                          onChange={(e) => actualizarSubDatos("extra", "txtRsvpSoloYo", e.target.value)}
                          className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                          placeholder="Defecto: Solo yo"
                        />
                      </div>
                    </div>
                  )}

                  {templateId === "03-space" && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Placeholder Nombre (Space)</label>
                      <input
                        type="text"
                        value={(datos.extra?.txtRsvpNombrePlaceholder as string) || ""}
                        onChange={(e) => actualizarSubDatos("extra", "txtRsvpNombrePlaceholder", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                        placeholder="Defecto: Escribe tu nombre completo"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Opción Sí Asistiré</label>
                      <input
                        type="text"
                        value={(datos.extra?.txtRsvpSi as string) || ""}
                        onChange={(e) => actualizarSubDatos("extra", "txtRsvpSi", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                        placeholder="Defecto: Sí Asistiré / 🍼 ¡Sí, claro!"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Opción No Podré</label>
                      <input
                        type="text"
                        value={(datos.extra?.txtRsvpNo as string) || ""}
                        onChange={(e) => actualizarSubDatos("extra", "txtRsvpNo", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                        placeholder="Defecto: No Podré / No podré"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Etiqueta de Acompañantes</label>
                    <input
                      type="text"
                      value={(datos.extra?.txtRsvpAcompanantes as string) || ""}
                      onChange={(e) => actualizarSubDatos("extra", "txtRsvpAcompanantes", e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                      placeholder="Defecto: Acompañantes adicionales / Invitados adicionales"
                    />
                  </div>

                  {templateId === "03-space" && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Placeholder Mensaje Opcional (Space)</label>
                      <input
                        type="text"
                        value={(datos.extra?.txtRsvpMensajePlaceholder as string) || ""}
                        onChange={(e) => actualizarSubDatos("extra", "txtRsvpMensajePlaceholder", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                        placeholder="Defecto: Dedícale un lindo mensaje..."
                      />
                    </div>
                  )}

                  {templateId === "01-dino" && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Texto Dietas / Alergias (Dino)</label>
                      <input
                        type="text"
                        value={(datos.extra?.txtDietas as string) || ""}
                        onChange={(e) => actualizarSubDatos("extra", "txtDietas", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                        placeholder="Defecto: ¿Tienes alguna preferencia..."
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Botón Enviar RSVP</label>
                      <input
                        type="text"
                        value={(datos.extra?.txtRsvpBoton as string) || ""}
                        onChange={(e) => actualizarSubDatos("extra", "txtRsvpBoton", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                        placeholder="Defecto: Confirmar por WhatsApp"
                      />
                    </div>

                    {templateId === "02-stork" && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Msg Nota/Bajo botón (Stork)</label>
                        <input
                          type="text"
                          value={(datos.extra?.txtRsvpNota as string) || ""}
                          onChange={(e) => actualizarSubDatos("extra", "txtRsvpNota", e.target.value)}
                          className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                          placeholder="Defecto: Ingresa tu nombre arriba para..."
                        />
                      </div>
                    )}
                  </div>

                  {templateId === "03-space" && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Título de Éxito al Confirmar (Space)</label>
                          <input
                            type="text"
                            value={(datos.extra?.txtRsvpExitoTitulo as string) || ""}
                            onChange={(e) => actualizarSubDatos("extra", "txtRsvpExitoTitulo", e.target.value)}
                            className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                            placeholder="Defecto: ¡Confirmación Registrada!"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Botón Responder otra vez (Space)</label>
                          <input
                            type="text"
                            value={(datos.extra?.txtRsvpResponderOtraVez as string) || ""}
                            onChange={(e) => actualizarSubDatos("extra", "txtRsvpResponderOtraVez", e.target.value)}
                            className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                            placeholder="Defecto: Responder otra vez"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Descripción Éxito al Confirmar (Space)</label>
                        <input
                          type="text"
                          value={(datos.extra?.txtRsvpExitoSub as string) || ""}
                          onChange={(e) => actualizarSubDatos("extra", "txtRsvpExitoSub", e.target.value)}
                          className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                          placeholder="Defecto: Tu confirmación ha sido guardada..."
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeSubTab === "muro" && templateId !== "03-space" && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Título de Muro</label>
                      <input
                        type="text"
                        value={(datos.extra?.txtMuroTitulo as string) || ""}
                        onChange={(e) => actualizarSubDatos("extra", "txtMuroTitulo", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                        placeholder="Defecto: Libro de Firmas / Muro de deseos"
                      />
                    </div>

                    {templateId === "02-stork" && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Placeholder Nombre Autor (Stork)</label>
                        <input
                          type="text"
                          value={(datos.extra?.txtMuroNombrePlaceholder as string) || ""}
                          onChange={(e) => actualizarSubDatos("extra", "txtMuroNombrePlaceholder", e.target.value)}
                          className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                          placeholder="Defecto: Tu Nombre (Ej: Tía Sonia o Familia Rojas)"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Instrucciones Muro</label>
                    <input
                      type="text"
                      value={(datos.extra?.txtMuroInstrucciones as string) || ""}
                      onChange={(e) => actualizarSubDatos("extra", "txtMuroInstrucciones", e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                      placeholder="Defecto: Escribe unas tiernas palabras en el muro..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Placeholder Mensaje</label>
                      <input
                        type="text"
                        value={(datos.extra?.txtMuroPlaceholder as string) || ""}
                        onChange={(e) => actualizarSubDatos("extra", "txtMuroPlaceholder", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                        placeholder="Defecto: Escribe tu hermoso mensaje de felicitación"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Botón Firmar Muro</label>
                      <input
                        type="text"
                        value={(datos.extra?.txtMuroBoton as string) || ""}
                        onChange={(e) => actualizarSubDatos("extra", "txtMuroBoton", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                        placeholder="Defecto: Firmar Libro / Firmar Muro"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Cierre Muro (Con todo el amor...)</label>
                      <input
                        type="text"
                        value={(datos.extra?.txtMuroCierre as string) || ""}
                        onChange={(e) => actualizarSubDatos("extra", "txtMuroCierre", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                        placeholder="Defecto: Con todo el amor,"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Firmas Cierre (Mummy & Daddy)</label>
                      <input
                        type="text"
                        value={(datos.extra?.txtMuroFirmas as string) || ""}
                        onChange={(e) => actualizarSubDatos("extra", "txtMuroFirmas", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                        placeholder="Defecto: Mummy & Daddy"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Mensaje Muro Vacío</label>
                    <input
                      type="text"
                      value={(datos.extra?.txtMuroVacio as string) || ""}
                      onChange={(e) => actualizarSubDatos("extra", "txtMuroVacio", e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/50 placeholder:text-stone-300"
                      placeholder="Defecto: Nadie ha firmado el libro aún. ¡Sé el primero!"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "json" && (
            <div className="space-y-4 h-full flex flex-col">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-inter">Modificación Directa de Metadatos JSON</h3>
                <span className="text-[9px] font-bold bg-violet-50 border border-violet-200 text-violet-600 px-2 py-0.5 rounded font-inter uppercase">
                  Avanzado
                </span>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed font-inter">
                Úsalo para cambiar cualquier parámetro arbitrario de la plantilla. Por ejemplo, puedes añadir una clave de URL de imagen como <code>{"\"imageUrl\": \"https://link-de-imagen.png\""}</code> o re-estructurar datos.
              </p>

              <div className="flex-1 flex flex-col min-h-64 relative font-mono text-[11px]">
                <textarea
                  value={jsonText}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  className={`w-full h-80 border rounded-2xl p-4 focus:outline-none font-mono font-medium focus:ring-2 bg-stone-900 text-stone-100 placeholder:text-stone-600 transition-all ${
                    jsonError ? "focus:ring-rose-500/20 border-rose-500" : "focus:ring-violet-500/20 border-stone-300"
                  }`}
                  style={{ tabSize: 2 }}
                />
              </div>

              {jsonError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 text-[10px] p-3 rounded-xl font-bold font-inter leading-relaxed whitespace-pre-wrap">
                  ⚠️ Error de Sintaxis JSON: {jsonError}
                </div>
              )}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50/50 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-stone-200 bg-white text-stone-600 text-xs font-bold rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !!jsonError}
            className="px-5 py-2 bg-violet-600 hover:bg-violet-750 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-violet-600/10 flex items-center gap-2 cursor-pointer"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <span>Guardar Cambios</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

// Subcomponente de Pestaña (Tab Button)
function TabButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-3.5 border-b-2 transition-all cursor-pointer ${
        active
          ? "border-violet-600 text-violet-600"
          : "border-transparent text-stone-400 hover:text-stone-700"
      }`}
    >
      {label}
    </button>
  );
}

// Subcomponente de Pestaña Mini
function MiniTabButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer shrink-0 ${
        active
          ? "bg-violet-600 text-white shadow-md shadow-violet-600/10"
          : "bg-stone-100 text-stone-500 hover:text-stone-850 hover:bg-stone-200"
      }`}
    >
      {label}
    </button>
  );
}

// Subcomponente de Checkbox para Features
function FeatureCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 p-3 border border-stone-200/80 hover:bg-stone-50 rounded-xl cursor-pointer select-none transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500/20 border-stone-300 transition-all cursor-pointer"
      />
      <span className="text-xs font-semibold text-stone-750">{label}</span>
    </label>
  );
}
