import { useState } from "react";
import { Pedido } from "../types";
import { IconSearch } from "./Icons";

interface ListaPedidosProps {
  pedidos: Pedido[];
  seleccionadoId: string | null;
  onSelect: (id: string) => void;
}

type FiltroEstado = "todos" | "pagados" | "sin_pagar" | "pendientes_aprobacion" | "asistidos" | "contacto";

export default function ListaPedidos({ pedidos, seleccionadoId, onSelect }: ListaPedidosProps) {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<FiltroEstado>("todos");

  // Filtrar pedidos
  const pedidosFiltrados = pedidos.filter((p) => {
    // Filtro por texto (Nombre del evento, ID o Nombre del cliente en whatsapp/anfitriones)
    const coincideBusqueda =
      p.nombre_evento.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.datos.anfitriones && p.datos.anfitriones.toLowerCase().includes(busqueda.toLowerCase())) ||
      p.template_id.toLowerCase().includes(busqueda.toLowerCase());

    if (!coincideBusqueda) return false;

    // Filtro por estado
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
      {/* Buscador */}
      <div className="p-4 border-b border-stone-100 space-y-3">
        <div className="relative">
          <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por evento o cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-inter placeholder:text-stone-400"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold font-inter cursor-pointer"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Filtros rápidos horizontal */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <FilterChip active={filtro === "todos"} label="Todos" onClick={() => setFiltro("todos")} count={pedidos.length} />
          <FilterChip
            active={filtro === "pagados"}
            label="Pagados"
            onClick={() => setFiltro("pagados")}
            count={pedidos.filter((p) => p.pagado).length}
          />
          <FilterChip
            active={filtro === "sin_pagar"}
            label="Impagos"
            onClick={() => setFiltro("sin_pagar")}
            count={pedidos.filter((p) => !p.pagado).length}
          />
          <FilterChip
            active={filtro === "pendientes_aprobacion"}
            label="Por Aprobar"
            onClick={() => setFiltro("pendientes_aprobacion")}
            count={pedidos.filter((p) => !p.aprobado).length}
          />
          <FilterChip
            active={filtro === "asistidos"}
            label="Asistidos"
            onClick={() => setFiltro("asistidos")}
            count={pedidos.filter((p) => p.datos.asistido).length}
          />
          <FilterChip
            active={filtro === "contacto"}
            label="Desde WA"
            onClick={() => setFiltro("contacto")}
            count={pedidos.filter((p) => p.datos.extra?.origen === "formulario_contacto").length}
          />
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
        {pedidosFiltrados.length === 0 ? (
          <div className="p-8 text-center text-stone-400 space-y-1">
            <p className="text-sm font-medium">No se encontraron pedidos</p>
            <p className="text-xs">Prueba cambiando tu búsqueda o filtros.</p>
          </div>
        ) : (
          pedidosFiltrados.map((p) => {
            const isSelected = seleccionadoId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelect(p.id)}
                className={`w-full text-left p-4 hover:bg-stone-50/50 cursor-pointer transition-all flex flex-col gap-2 relative ${
                  isSelected ? "bg-violet-50/60 hover:bg-violet-50/60 border-l-4 border-violet-600 pl-3" : "border-l-4 border-transparent"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-semibold text-stone-900 text-[14px] leading-tight truncate">{p.nombre_evento}</p>
                    <p className="text-[11px] font-medium text-stone-400 font-inter truncate uppercase">
                      ID: {p.id.slice(0, 8)}...
                    </p>
                  </div>
                  <TemplateBadge templateId={p.template_id} />
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  <StatusBadge type="paid" active={p.pagado} />
                  <StatusBadge type="approved" active={p.aprobado} />
                  {p.datos.asistido && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100 font-inter">
                      Asistido
                    </span>
                  )}
                  {p.datos.extra?.origen === "formulario_contacto" && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 font-inter">
                      Desde WhatsApp
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-1 text-[11px] text-stone-400 font-inter">
                  <span>{p.datos.anfitriones || "Sin anfitrión"}</span>
                  <span>
                    {new Date(p.created_at).toLocaleDateString("es-CO", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

// Subcomponente FilterChip
function FilterChip({ active, label, count, onClick }: { active: boolean; label: string; count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg font-inter shrink-0 cursor-pointer transition-all flex items-center gap-1.5 border ${
        active
          ? "bg-violet-600 text-white border-violet-600 shadow-sm"
          : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
      }`}
    >
      <span>{label}</span>
      <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold ${active ? "bg-violet-700 text-violet-100" : "bg-stone-200/70 text-stone-500"}`}>
        {count}
      </span>
    </button>
  );
}

// Subcomponente TemplateBadge
function TemplateBadge({ templateId }: { templateId: string }) {
  let label = templateId;
  let bg = "bg-stone-100 text-stone-600 border-stone-200";

  if (templateId === "01-dino") {
    label = "🦖 Dino";
    bg = "bg-emerald-50 text-emerald-700 border-emerald-100";
  } else if (templateId === "02-stork") {
    label = "🦢 Cigüeña";
    bg = "bg-sky-50 text-sky-700 border-sky-100";
  } else if (templateId === "03-space") {
    label = "🚀 Espacio";
    bg = "bg-indigo-50 text-indigo-700 border-indigo-100";
  }

  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${bg}`}>
      {label}
    </span>
  );
}

// Subcomponente StatusBadge
function StatusBadge({ type, active }: { type: "paid" | "approved"; active: boolean }) {
  if (type === "paid") {
    return active ? (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 font-inter">
        Pagado
      </span>
    ) : (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 font-inter">
        Sin pagar
      </span>
    );
  } else {
    return active ? (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 font-inter">
        Aprobado
      </span>
    ) : (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100 font-inter">
        Pendiente
      </span>
    );
  }
}

