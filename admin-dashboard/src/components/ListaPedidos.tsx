import { Pedido } from "../types";

interface ListaPedidosProps {
  pedidos: Pedido[];
  seleccionadoId: string | null;
  onSelect: (id: string) => void;
}

export default function ListaPedidos({ pedidos, seleccionadoId, onSelect }: ListaPedidosProps) {
  if (pedidos.length === 0) {
    return <p className="text-sm text-slate-400 p-4">No hay pedidos todavía.</p>;
  }

  return (
    <div className="divide-y divide-slate-100">
      {pedidos.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className={`w-full text-left px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${
            seleccionadoId === p.id ? "bg-sky-50" : ""
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="font-bold text-slate-800 text-sm truncate">{p.nombre_evento}</p>
            <span className="text-xs text-slate-400 shrink-0">{p.template_id}</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge ok={p.pagado} labelOk="Pagado" labelNo="Sin pagar" />
            <Badge ok={p.aprobado} labelOk="Aprobado" labelNo="Pendiente" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {new Date(p.created_at).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </button>
      ))}
    </div>
  );
}

function Badge({ ok, labelOk, labelNo }: { ok: boolean; labelOk: string; labelNo: string }) {
  return (
    <span
      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
        ok ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
      }`}
    >
      {ok ? labelOk : labelNo}
    </span>
  );
}
