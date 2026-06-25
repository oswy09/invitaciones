import { useState } from "react";
import { Pedido } from "../types";
import { IconSearch } from "./Icons";

interface ListaPedidosProps {
  pedidos: Pedido[];
  seleccionadoId: string | null;
  onSelect: (id: string) => void;
}

type FiltroEstado = "todos" | "pagados" | "sin_pagar" | "pendientes_aprobacion" | "asistidos" | "contacto";

const TEMPLATE_INFO: Record<string, { emoji: string; nombre: string; color: string }> = {
  "01-dino": { emoji: "🦖", nombre: "Dino", color: "bg-emerald-50 text-emerald-700" },
  "02-stork": { emoji: "🦢", nombre: "Cigüeña", color: "bg-sky-50 text-sky-700" },
  "03-space": { emoji: "🚀", nombre: "Espacio", color: "bg-indigo-50 text-indigo-700" },
};

function tiempoRelativo(fechaISO: string): string {
  const diffMs = Date.now() - new Date(fechaISO).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const horas = Math.floor(min / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  if (dias < 7) return `hace ${dias} d`;
  return new Date(fechaISO).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

export default function ListaPedidos({ pedidos, seleccionadoId, onSelect }: ListaPedidosProps) {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<FiltroEstado>("todos");

  const pedidosFiltrados = pedidos.filter((p) => {
    const coincideBusqueda =
      p.nombre_evento.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.datos.anfitriones && p.datos.anfitriones.toLowerCase().includes(busqueda.toLowerCase())) ||
      p.template_id.toLowerCase().includes(busqueda.toLowerCase());

    if (!coincideBusqueda) return false;

    switch (filtro) {
      case "pagados":
        return p.pagado;
      case "sin_pagar":
        return !p.pagado;
      case "pendientes_aprobacion":
        return !p.aprobado;
      case "asistidos":
        return !!p.datos.asistido;
      case "contacto":
        return p.datos.extra?.origen === "formulario_contacto";
      case "todos":
      default:
        return true;
    }
  });

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 pb-3 space-y-3">
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar pedido o cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-[13px] bg-stone-100/80 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/15 focus:bg-white focus:border-stone-200 transition-all font-inter placeholder:text-stone-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
          <FilterChip active={filtro === "todos"} label="Todos" onClick={() => setFiltro("todos")} count={pedidos.length} />
          <FilterChip
            active={filtro === "pendientes_aprobacion"}
            label="Por aprobar"
            onClick={() => setFiltro("pendientes_aprobacion")}
            count={pedidos.filter((p) => !p.aprobado).length}
          />
          <FilterChip
            active={filtro === "sin_pagar"}
            label="Sin pagar"
            onClick={() => setFiltro("sin_pagar")}
            count={pedidos.filter((p) => !p.pagado).length}
          />
          <FilterChip
            active={filtro === "pagados"}
            label="Pagados"
            onClick={() => setFiltro("pagados")}
            count={pedidos.filter((p) => p.pagado).length}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
        {pedidosFiltrados.length === 0 ? (
          <div className="p-8 text-center text-stone-400 space-y-1">
            <p className="text-sm font-medium">No se encontraron pedidos</p>
            <p className="text-xs">Prueba cambiando tu búsqueda o filtros.</p>
          </div>
        ) : (
          pedidosFiltrados.map((p) => {
            const isSelected = seleccionadoId === p.id;
            const tpl = TEMPLATE_INFO[p.template_id] ?? { emoji: "✨", nombre: p.template_id, color: "bg-stone-100 text-stone-600" };
            return (
              <button
                key={p.id}
                onClick={() => onSelect(p.id)}
                className={`w-full text-left p-3 rounded-xl cursor-pointer transition-all flex items-start gap-3 ${
                  isSelected ? "bg-violet-50" : "hover:bg-stone-50"
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0 ${tpl.color}`}>
                  {tpl.emoji}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-[13px] font-semibold leading-tight truncate ${isSelected ? "text-violet-900" : "text-stone-900"}`}>
                      {p.nombre_evento}
                    </p>
                    <span className="text-[11px] text-stone-400 font-inter shrink-0">{tiempoRelativo(p.created_at)}</span>
                  </div>

                  <p className="text-[11px] text-stone-400 font-inter truncate">
                    {tpl.nombre}
                    {p.datos.anfitriones ? ` · ${p.datos.anfitriones}` : ""}
                  </p>

                  <div className="flex items-center gap-2.5 pt-0.5">
                    <EstadoPunto ok={p.aprobado} labelOk="Aprobado" labelNo="Por aprobar" />
                    <EstadoPunto ok={p.pagado} labelOk="Pagado" labelNo="Sin pagar" colorOk="emerald" />
                    {p.datos.asistido && (
                      <span className="text-[10px] font-bold text-rose-500 font-inter">· Asistido</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function FilterChip({ active, label, count, onClick }: { active: boolean; label: string; count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 text-[11.5px] font-semibold rounded-full font-inter shrink-0 cursor-pointer transition-all flex items-center gap-1.5 ${
        active ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-500 hover:bg-stone-200"
      }`}
    >
      <span>{label}</span>
      {count > 0 && <span className={active ? "text-stone-300" : "text-stone-400"}>{count}</span>}
    </button>
  );
}

function EstadoPunto({
  ok,
  labelOk,
  labelNo,
  colorOk = "violet",
}: {
  ok: boolean;
  labelOk: string;
  labelNo: string;
  colorOk?: "violet" | "emerald";
}) {
  const dotColor = ok ? (colorOk === "emerald" ? "bg-emerald-500" : "bg-violet-500") : "bg-amber-400";
  const textColor = ok ? "text-stone-600" : "text-amber-600";
  return (
    <span className={`inline-flex items-center gap-1 text-[10.5px] font-semibold font-inter ${textColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {ok ? labelOk : labelNo}
    </span>
  );
}
