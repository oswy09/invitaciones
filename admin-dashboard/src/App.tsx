import { useEffect, useState } from "react";
import { api } from "./lib/api";
import { Pedido } from "./types";
import ListaPedidos from "./components/ListaPedidos";
import DetallePedido from "./components/DetallePedido";

export default function App() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function cargarPedidos() {
    try {
      setPedidos(await api.listarPedidos());
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message} — ¿Está corriendo el servidor admin (npm run server)?`
          : "Error desconocido"
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    cargarPedidos();
  }, []);

  const seleccionado = pedidos.find((p) => p.id === seleccionadoId) ?? null;

  return (
    <div className="h-screen flex flex-col">
      <header className="px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-800">📋 Pedidos de invitaciones</h1>
        <button
          onClick={cargarPedidos}
          className="text-sm text-slate-500 hover:text-slate-700 cursor-pointer"
        >
          ⟳ Actualizar
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-[340px] border-r border-slate-200 bg-white overflow-y-auto shrink-0">
          {loading ? (
            <p className="text-sm text-slate-400 p-4">Cargando...</p>
          ) : error ? (
            <p className="text-sm text-red-500 p-4">{error}</p>
          ) : (
            <ListaPedidos pedidos={pedidos} seleccionadoId={seleccionadoId} onSelect={setSeleccionadoId} />
          )}
        </aside>

        <main className="flex-1 bg-slate-50 overflow-hidden">
          {seleccionado ? (
            <DetallePedido pedido={seleccionado} onUpdated={cargarPedidos} />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              Selecciona un pedido de la lista para ver el detalle.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
