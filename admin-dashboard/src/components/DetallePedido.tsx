import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Pedido, WishRow, RsvpRow, DEV_PORT_POR_TEMPLATE } from "../types";
import {
  IconWhatsApp,
  IconLink,
  IconUser,
  IconCalendar,
  IconMapPin,
  IconMusic,
  IconHeart,
  IconEye,
  IconEyeOff,
  IconWarning,
  IconCheckCircle,
  IconInfo
} from "./Icons";
import EditorPedido from "./EditorPedido";

interface DetallePedidoProps {
  pedido: Pedido;
  onUpdated: () => void;
  onDeleted?: () => void;
}

export default function DetallePedido({ pedido, onUpdated, onDeleted }: DetallePedidoProps) {
  const [wishes, setWishes] = useState<WishRow[]>([]);
  const [rsvps, setRsvps] = useState<RsvpRow[]>([]);
  const [working, setWorking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    api.listarWishes(pedido.id).then(setWishes).catch(() => setWishes([]));
    api.listarRsvps(pedido.id).then(setRsvps).catch(() => setRsvps([]));
  }, [pedido.id]);

  async function eliminarPedido() {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el pedido "${pedido.nombre_evento}"? Esta acción no se puede deshacer y borrará también las confirmaciones de asistencia y libro de deseos asociados.`)) {
      return;
    }
    setWorking(true);
    try {
      await api.eliminarPedido(pedido.id);
      if (onDeleted) {
        onDeleted();
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al eliminar el pedido");
    } finally {
      setWorking(false);
    }
  }

  async function togglePagado() {
    setWorking(true);
    try {
      await api.actualizarPedido(pedido.id, { pagado: !pedido.pagado });
      onUpdated();
    } catch (e) {
      console.error(e);
    } finally {
      setWorking(false);
    }
  }

  async function toggleAprobado() {
    setWorking(true);
    try {
      await api.actualizarPedido(pedido.id, { aprobado: !pedido.aprobado });
      onUpdated();
    } catch (e) {
      console.error(e);
    } finally {
      setWorking(false);
    }
  }

  async function toggleOcultoWish(wish: WishRow) {
    try {
      await api.actualizarWish(wish.id, !wish.oculto);
      setWishes((prev) => prev.map((w) => (w.id === wish.id ? { ...w, oculto: !w.oculto } : w)));
    } catch (e) {
      console.error(e);
    }
  }

  function copiarId() {
    navigator.clipboard.writeText(pedido.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const datos = pedido.datos;
  const devPort = DEV_PORT_POR_TEMPLATE[pedido.template_id];
  const invitacionUrl = devPort ? `http://localhost:${devPort}/?evento=${pedido.id}` : null;
  const cancion = datos.extra?.cancionSeleccionada as { titulo: string; artista: string } | undefined;
  const origen = datos.extra?.origen as string | undefined;
  const telefonoContacto = datos.extra?.telefonoContacto as string | undefined;

  // Estadísticas RSVP
  const adultosAsistentes = rsvps
    .filter((r) => r.asiste)
    .reduce((sum, r) => sum + (r.num_adultos || 1), 0);
  const rsvpsNoAsisten = rsvps.filter((r) => !r.asiste).length;

  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full max-w-5xl mx-auto">
      {/* Cabecera del Pedido */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-stone-900">{pedido.nombre_evento}</h2>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              pedido.template_id === "01-dino"
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : pedido.template_id === "02-stork"
                ? "bg-sky-50 text-sky-700 border-sky-100"
                : "bg-indigo-50 text-indigo-700 border-indigo-100"
            }`}>
              {pedido.template_id}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-stone-400 font-inter">
            <span>ID: <code className="bg-stone-100 px-1 py-0.5 rounded text-[11px] font-medium">{pedido.id}</code></span>
            <button
              onClick={copiarId}
              className="hover:text-violet-600 text-[10px] font-bold uppercase transition-colors cursor-pointer"
            >
              {copied ? "¡Copiado!" : "Copiar"}
            </button>
            <span>•</span>
            <span>Creado el {new Date(pedido.created_at).toLocaleDateString("es-CO", { dateStyle: "medium" })}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 transition-all shadow-sm cursor-pointer"
          >
            <span>Editar Datos</span>
          </button>
          
          <button
            onClick={eliminarPedido}
            disabled={working}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl px-4 py-2.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <span>Borrar Pedido</span>
          </button>
          
          {invitacionUrl && (
            <a
              href={invitacionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl px-4 py-2.5 transition-all shadow-sm cursor-pointer"
            >
              <span>Ver Invitación Activa</span>
              <IconLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Alerta de Acompañamiento Asistido */}
      {datos.asistido && (
        <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200/70 rounded-2xl p-5 text-rose-900 space-y-3">
          <div className="flex items-center gap-2">
            <IconWarning className="w-5 h-5 text-rose-500 shrink-0" />
            <span className="font-bold text-sm">Pedido con Acompañamiento Asistido</span>
          </div>
          <p className="text-xs leading-relaxed text-rose-700/90 font-inter">
            El cliente ha solicitado ayuda manual para completar la información en su invitación. Ponte en contacto con él para validar los datos e ingresarlos por sistema.
          </p>
          {datos.whatsappNumero && (
            <a
              href={`https://wa.me/${datos.whatsappNumero.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-md shadow-rose-600/10"
            >
              <IconWhatsApp className="w-3.5 h-3.5" />
              <span>Chatear con el Cliente</span>
            </a>
          )}
        </div>
      )}

      {/* Alerta de Pedido desde WhatsApp (Sin Vista Previa) */}
      {origen === "formulario_contacto" && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/70 rounded-2xl p-5 text-amber-900 space-y-3">
          <div className="flex items-center gap-2">
            <IconInfo className="w-5 h-5 text-amber-600 shrink-0" />
            <span className="font-bold text-sm">Pedido Registrado desde WhatsApp</span>
          </div>
          <p className="text-xs leading-relaxed text-amber-800/90 font-inter">
            Este pedido fue completado a través del formulario independiente para clientes que contactan vía WhatsApp. No se generó una previsualización interactiva automática durante el llenado.
          </p>
          {telefonoContacto && (
            <a
              href={`https://wa.me/${telefonoContacto.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-md shadow-amber-600/10"
            >
              <IconWhatsApp className="w-3.5 h-3.5" />
              <span>Chatear con Contacto ({telefonoContacto})</span>
            </a>
          )}
        </div>
      )}

      {/* Grid de Estado y Configuración (Toggles) */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-inter">Configuración del Pedido</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Toggle Aprobado */}
          <div className="flex items-center justify-between p-4 bg-stone-50 border border-stone-200/60 rounded-xl">
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-stone-800">Aprobación del Pedido</p>
              <p className="text-[11px] text-stone-400 font-inter">Autoriza la publicación online de la tarjeta</p>
            </div>
            <button
              onClick={toggleAprobado}
              disabled={working}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                pedido.aprobado ? "bg-violet-600" : "bg-stone-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  pedido.aprobado ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Toggle Pagado */}
          <div className="flex items-center justify-between p-4 bg-stone-50 border border-stone-200/60 rounded-xl">
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-stone-800">Estado del Pago</p>
              <p className="text-[11px] text-stone-400 font-inter">Remueve la marca de agua de demo en el cliente</p>
            </div>
            <button
              onClick={togglePagado}
              disabled={working}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                pedido.pagado ? "bg-emerald-500" : "bg-stone-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  pedido.pagado ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Contacto de Seguimiento */}
      {!!datos.extra?.telefonoContacto && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-inter">Contacto de Seguimiento</h3>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-violet-50/40 rounded-xl border border-violet-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center font-inter font-bold">
                C
              </div>
              <div>
                <p className="text-xs text-stone-400 font-inter">Teléfono registrado para la coordinación</p>
                <p className="text-sm font-bold text-stone-800 font-inter">{String(datos.extra.telefonoContacto)}</p>
              </div>
            </div>
            <a
              href={`https://wa.me/${String(datos.extra.telefonoContacto).replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white font-inter px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow shadow-emerald-500/10 cursor-pointer"
            >
              <IconWhatsApp className="w-4.5 h-4.5" />
              <span>Chatear por WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* Datos del Evento en Tarjeta Estilizada */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-inter">Información del Evento</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DatoCard icon={<IconUser className="text-violet-600" />} label="Anfitriones / Padres" valor={datos.anfitriones} />
          
          <DatoCard
            icon={<IconCalendar className="text-violet-600" />}
            label="Fecha y Hora"
            valor={datos.fechaTexto || [datos.fecha, datos.hora].filter(Boolean).join(" ") || undefined}
          />
          
          <DatoCard icon={<IconMapPin className="text-violet-600" />} label="Lugar del Evento" valor={datos.lugar?.nombre} subValor={datos.lugar?.direccion} />
          
          <DatoCard icon={<IconUser className="text-violet-600" />} label="Código de Vestimenta" valor={datos.vestimenta} />
          
          <DatoCard icon={<IconMusic className="text-violet-600" />} label="Canción Solicitada" valor={cancion ? `${cancion.titulo} — ${cancion.artista}` : undefined} />
          
          {datos.whatsappNumero && (
            <DatoCard
              icon={<IconWhatsApp className="text-violet-600" />}
              label="WhatsApp del Cliente"
              valor={datos.whatsappNumero}
              link={`https://wa.me/${datos.whatsappNumero.replace(/[^0-9]/g, "")}`}
              linkLabel="Enviar mensaje"
            />
          )}

          <div className="md:col-span-2 space-y-4">
            <DatoCard icon={<IconInfo className="text-violet-600" />} label="Mensaje de bienvenida" valor={datos.mensajePersonalizado} />
            <DatoCard icon={<IconInfo className="text-violet-600" />} label="Observaciones / Notas" valor={datos.extra?.observaciones as string | undefined} />
          </div>
        </div>
      </div>

      {/* Confirmaciones RSVP */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-inter">Confirmaciones RSVP ({rsvps.length})</h3>
          <div className="flex gap-2 text-[10px] font-bold font-inter">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md">
              Asistentes: {adultosAsistentes}
            </span>
            {rsvpsNoAsisten > 0 && (
              <span className="bg-stone-50 text-stone-500 border border-stone-200 px-2 py-0.5 rounded-md">
                No asisten: {rsvpsNoAsisten}
              </span>
            )}
          </div>
        </div>

        {rsvps.length === 0 ? (
          <p className="text-xs text-stone-400 py-2 font-inter">No se han registrado confirmaciones de asistencia aún.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
            {rsvps.map((r) => (
              <div key={r.id} className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-stone-800">{r.nombre_invitado}</p>
                  <span className={`text-[9px] font-bold font-inter px-1.5 py-0.2 rounded-md ${
                    r.asiste
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-rose-50 text-rose-700 border border-rose-100"
                  }`}>
                    {r.asiste ? `Asiste (${r.num_adultos || 1})` : "No asiste"}
                  </span>
                </div>
                {r.restricciones_alimentarias && (
                  <div className="text-[10px] text-stone-500 font-inter bg-amber-50/70 border border-amber-100 rounded-lg p-1.5 leading-snug">
                    <span className="font-bold text-amber-800">Restricción:</span> {r.restricciones_alimentarias} {r.restriccion_detalle}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Muro de Deseos */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-inter">Muro de Deseos ({wishes.length})</h3>

        {wishes.length === 0 ? (
          <p className="text-xs text-stone-400 py-2 font-inter">El muro de deseos no tiene dedicatorias aún.</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {wishes.map((w) => (
              <div
                key={w.id}
                className={`p-4 bg-stone-50 border rounded-xl flex items-start justify-between gap-4 transition-all duration-200 ${
                  w.oculto ? "opacity-60 border-stone-200 bg-stone-100/50" : "border-stone-200"
                }`}
              >
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-violet-100 text-stone-700 flex items-center justify-center text-base shrink-0 select-none shadow-sm">
                    {w.avatar || "🍼"}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-stone-800">{w.nombre_invitado}</p>
                    <p className="text-xs text-stone-600 leading-relaxed font-inter">{w.mensaje}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleOcultoWish(w)}
                  className={`flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer font-inter shrink-0 ${
                    w.oculto
                      ? "bg-white text-stone-600 border-stone-300 hover:bg-stone-50"
                      : "bg-white text-rose-600 border-rose-200 hover:bg-rose-50"
                  }`}
                  title={w.oculto ? "Mostrar en la tarjeta" : "Ocultar de la tarjeta"}
                >
                  {w.oculto ? <IconEye className="w-3.5 h-3.5" /> : <IconEyeOff className="w-3.5 h-3.5" />}
                  <span>{w.oculto ? "Mostrar" : "Ocultar"}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {isEditing && (
        <EditorPedido
          pedido={pedido}
          onClose={() => setIsEditing(false)}
          onSaved={onUpdated}
        />
      )}
    </div>
  );
}

// Subcomponente DatoCard para GRID
interface DatoCardProps {
  icon: React.ReactNode;
  label: string;
  valor?: string;
  subValor?: string;
  link?: string;
  linkLabel?: string;
}
function DatoCard({ icon, label, valor, subValor, link, linkLabel }: DatoCardProps) {
  if (!valor) return null;
  return (
    <div className="p-4 bg-stone-50 border border-stone-200/70 rounded-xl flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-white border border-stone-250 flex items-center justify-center shrink-0 shadow-sm">
        {icon}
      </div>
      <div className="space-y-0.5 min-w-0 flex-1">
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-inter">{label}</p>
        <p className="text-sm font-semibold text-stone-850 truncate">{valor}</p>
        {subValor && <p className="text-xs text-stone-500 font-inter">{subValor}</p>}
        {link && linkLabel && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[11px] font-bold text-violet-600 hover:underline font-inter mt-1 cursor-pointer"
          >
            {linkLabel} →
          </a>
        )}
      </div>
    </div>
  );
}

