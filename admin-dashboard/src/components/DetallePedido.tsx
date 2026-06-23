import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Pedido, WishRow, RsvpRow, DEV_PORT_POR_TEMPLATE } from "../types";

interface DetallePedidoProps {
  pedido: Pedido;
  onUpdated: () => void;
}

export default function DetallePedido({ pedido, onUpdated }: DetallePedidoProps) {
  const [wishes, setWishes] = useState<WishRow[]>([]);
  const [rsvps, setRsvps] = useState<RsvpRow[]>([]);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    api.listarWishes(pedido.id).then(setWishes).catch(() => setWishes([]));
    api.listarRsvps(pedido.id).then(setRsvps).catch(() => setRsvps([]));
  }, [pedido.id]);

  async function togglePagado() {
    setWorking(true);
    await api.actualizarPedido(pedido.id, { pagado: !pedido.pagado });
    setWorking(false);
    onUpdated();
  }

  async function toggleAprobado() {
    setWorking(true);
    await api.actualizarPedido(pedido.id, { aprobado: !pedido.aprobado });
    setWorking(false);
    onUpdated();
  }

  async function toggleOcultoWish(wish: WishRow) {
    await api.actualizarWish(wish.id, !wish.oculto);
    setWishes((prev) => prev.map((w) => (w.id === wish.id ? { ...w, oculto: !w.oculto } : w)));
  }

  const datos = pedido.datos;
  const devPort = DEV_PORT_POR_TEMPLATE[pedido.template_id];
  const invitacionUrl = devPort ? `http://localhost:${devPort}/?evento=${pedido.id}` : null;
  const cancion = datos.extra?.cancionSeleccionada as { titulo: string; artista: string } | undefined;

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{pedido.nombre_evento}</h2>
          <p className="text-sm text-slate-400">{pedido.template_id} · {pedido.id}</p>
        </div>
        {invitacionUrl && (
          <a
            href={invitacionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-sm font-bold text-sky-600 border border-sky-200 bg-sky-50 hover:bg-sky-100 rounded-full px-4 py-2"
          >
            Ver invitación →
          </a>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={togglePagado}
          disabled={working}
          className={`flex-1 font-bold py-2.5 rounded-xl cursor-pointer disabled:opacity-50 ${
            pedido.pagado ? "bg-slate-100 text-slate-600" : "bg-emerald-500 hover:bg-emerald-600 text-white"
          }`}
        >
          {pedido.pagado ? "✓ Pagado — quitar marca" : "Marcar como pagado (quita marca de agua)"}
        </button>
        <button
          onClick={toggleAprobado}
          disabled={working}
          className={`flex-1 font-bold py-2.5 rounded-xl cursor-pointer disabled:opacity-50 ${
            pedido.aprobado ? "bg-slate-100 text-slate-600" : "bg-sky-500 hover:bg-sky-600 text-white"
          }`}
        >
          {pedido.aprobado ? "✓ Aprobado — desaprobar" : "Aprobar pedido"}
        </button>
      </div>

      <Seccion titulo="Datos del evento">
        <Dato label="Anfitriones" valor={datos.anfitriones} />
        <Dato label="Fecha" valor={datos.fechaTexto || `${datos.fecha} ${datos.hora}`} />
        <Dato label="Lugar" valor={datos.lugar.nombre} />
        <Dato label="Dirección" valor={datos.lugar.direccion} />
        <Dato label="Vestimenta" valor={datos.vestimenta} />
        <Dato label="WhatsApp del cliente" valor={datos.whatsappNumero} />
        <Dato label="Observaciones" valor={datos.mensajePersonalizado} />
        <Dato label="Canción pedida" valor={cancion ? `${cancion.titulo} — ${cancion.artista}` : undefined} />
      </Seccion>

      <Seccion titulo={`Confirmaciones RSVP (${rsvps.length})`}>
        {rsvps.length === 0 && <p className="text-sm text-slate-400">Sin confirmaciones aún.</p>}
        {rsvps.map((r) => (
          <div key={r.id} className="text-sm border border-slate-100 rounded-lg p-2">
            <p className="font-bold text-slate-700">
              {r.nombre_invitado} — {r.asiste ? `Asiste (${r.num_adultos})` : "No asiste"}
            </p>
            {r.restricciones_alimentarias && (
              <p className="text-slate-500">{r.restricciones_alimentarias} {r.restriccion_detalle}</p>
            )}
          </div>
        ))}
      </Seccion>

      <Seccion titulo={`Muro de deseos (${wishes.length})`}>
        {wishes.length === 0 && <p className="text-sm text-slate-400">Sin mensajes aún.</p>}
        {wishes.map((w) => (
          <div
            key={w.id}
            className={`text-sm border rounded-lg p-2 flex items-start justify-between gap-2 ${
              w.oculto ? "border-slate-100 bg-slate-50 opacity-60" : "border-slate-100"
            }`}
          >
            <div>
              <p className="font-bold text-slate-700">{w.avatar} {w.nombre_invitado}</p>
              <p className="text-slate-500">{w.mensaje}</p>
            </div>
            <button
              onClick={() => toggleOcultoWish(w)}
              className="shrink-0 text-xs text-slate-500 hover:text-red-500 cursor-pointer"
            >
              {w.oculto ? "Mostrar" : "Ocultar"}
            </button>
          </div>
        ))}
      </Seccion>
    </div>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">{titulo}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Dato({ label, valor }: { label: string; valor?: string }) {
  if (!valor) return null;
  return (
    <p className="text-sm">
      <span className="text-slate-400">{label}: </span>
      <span className="text-slate-700 font-medium">{valor}</span>
    </p>
  );
}
