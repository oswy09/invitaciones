import { useEffect, useState } from "react";
import { api } from "./lib/api";
import { Pedido } from "./types";
import ListaPedidos from "./components/ListaPedidos";
import DetallePedido from "./components/DetallePedido";
import GestionPrecios from "./components/GestionPrecios";
import { IconDollar, IconRefresh, IconTrendingUp, IconUser, IconCheckCircle, IconWarning, IconCalendar, IconTag } from "./components/Icons";

export default function App() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [precios, setPrecios] = useState<Record<string, { cop: number; usd: number }>>({});

  async function cargarPedidos() {
    setIsRefreshing(true);
    try {
      setPedidos(await api.listarPedidos());
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message} — ¿Está corriendo el servidor admin (npm run server)?`
          : "Error desconocido"
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  async function cargarPrecios() {
    try {
      const data = await api.obtenerPrecios();
      setPrecios(data);
    } catch {
      // Ignorar fallo y usar fallbacks
    }
  }

  useEffect(() => {
    cargarPedidos();
    cargarPrecios();
  }, []);

  const seleccionado = pedidos.find((p) => p.id === seleccionadoId) ?? null;

  // Cálculos estadísticos
  const totalPedidos = pedidos.length;
  const pedidosPagados = pedidos.filter((p) => p.pagado).length;
  const pedidosPendientesAprobacion = pedidos.filter((p) => !p.aprobado).length;
  const pedidosAsistidos = pedidos.filter((p) => p.datos.asistido).length;

  const copEstimado = pedidos
    .filter((p) => p.pagado)
    .reduce((acc, p) => acc + (precios[p.template_id]?.cop || (p.template_id === "02-stork" ? 60000 : 70000)), 0);

  const usdEstimado = pedidos
    .filter((p) => p.pagado)
    .reduce((acc, p) => acc + (precios[p.template_id]?.usd || (p.template_id === "02-stork" ? 18 : 20)), 0);

  // Contadores por plantilla
  const countDino = pedidos.filter((p) => p.template_id === "01-dino").length;
  const countStork = pedidos.filter((p) => p.template_id === "02-stork").length;
  const countSpace = pedidos.filter((p) => p.template_id === "03-space").length;

  return (
    <div className="h-screen flex flex-col bg-stone-50 select-none overflow-hidden font-sans">
      {/* Header Premium */}
      <header className="h-16 px-6 bg-white border-b border-stone-200 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div 
          onClick={() => setSeleccionadoId(null)}
          className="flex items-center gap-3 cursor-pointer select-none hover:opacity-90 active:scale-98 transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-md shadow-violet-600/20">
            <span className="font-bold text-lg font-inter">I</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-stone-900 tracking-tight leading-none">Invitaciones Admin</h1>
            <p className="text-[10px] text-stone-400 font-inter mt-0.5 font-medium uppercase tracking-wider">Dashboard de Control</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Volver a Inicio */}
          <button
            onClick={() => setSeleccionadoId(null)}
            className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl border transition-all cursor-pointer ${
              seleccionadoId === null
                ? "bg-stone-950 text-white border-stone-950 shadow-md shadow-stone-950/10"
                : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Inicio</span>
          </button>

          {/* Ajustar Precios */}
          <button
            onClick={() => setSeleccionadoId(seleccionadoId === "__precios__" ? null : "__precios__")}
            className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl border transition-all cursor-pointer ${
              seleccionadoId === "__precios__"
                ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-600/10"
                : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
            }`}
          >
            <IconDollar className="w-4 h-4" />
            <span>Ajustar Precios</span>
          </button>

          {/* Actualizar */}
          <button
            onClick={() => {
              cargarPedidos();
              cargarPrecios();
            }}
            disabled={isRefreshing}
            className="p-2 text-stone-500 hover:text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            title="Sincronizar Datos"
          >
            <IconRefresh className={`w-4 h-4 ${isRefreshing ? "animate-spin text-violet-600" : ""}`} />
          </button>
        </div>
      </header>

      {/* Cuerpo Principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar con lista */}
        <aside className="w-[360px] border-r border-stone-200 bg-white flex flex-col shrink-0 overflow-hidden">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-violet-600 animate-spin" />
              <p className="text-xs text-stone-400 font-inter">Cargando base de datos...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center space-y-3">
              <IconWarning className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-sm font-semibold text-stone-800">Error de Conexión</p>
              <p className="text-xs text-stone-500 leading-relaxed font-inter">{error}</p>
              <button
                onClick={cargarPedidos}
                className="text-xs bg-stone-900 text-white font-bold px-4 py-2 rounded-xl hover:bg-stone-800 transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <ListaPedidos pedidos={pedidos} seleccionadoId={seleccionadoId} onSelect={setSeleccionadoId} />
          )}
        </aside>

        {/* Panel Central */}
        <main className="flex-1 bg-stone-50 overflow-hidden relative">
          {seleccionadoId === "__precios__" ? (
            <div className="h-full overflow-y-auto">
              <GestionPrecios />
            </div>
          ) : seleccionado ? (
            <DetallePedido
              pedido={seleccionado}
              onUpdated={cargarPedidos}
              onDeleted={() => {
                setSeleccionadoId(null);
                cargarPedidos();
              }}
            />
          ) : (
            /* Vista por defecto: Stats Dashboard */
            <div className="h-full overflow-y-auto p-8 space-y-8 max-w-5xl mx-auto">
              {/* Saludo */}
              <div>
                <h2 className="text-2xl font-bold text-stone-900">Bienvenido al Panel Administrativo</h2>
                <p className="text-sm text-stone-500 mt-1">
                  Aquí tienes una visión general del estado de tus ventas y del flujo de confirmaciones de invitados.
                </p>
              </div>

              {/* Grid de Tarjetas Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {/* Ingresos COP */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 font-inter">Ingresos COP (Est.)</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <IconDollar className="w-4.5 h-4.5" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-stone-900 font-inter">
                      ${copEstimado.toLocaleString("es-CO")}
                    </h3>
                    <p className="text-[10px] text-stone-400 font-inter font-medium">De {pedidosPagados} pedidos pagados</p>
                  </div>
                </div>

                {/* Ingresos USD */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 font-inter">Ingresos USD (Est.)</span>
                    <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                      <IconTrendingUp className="w-4.5 h-4.5" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-stone-900 font-inter">
                      ${usdEstimado.toLocaleString("en-US")} USD
                    </h3>
                    <p className="text-[10px] text-stone-400 font-inter font-medium">Equivalente en moneda extranjera</p>
                  </div>
                </div>

                {/* Por Aprobar */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 font-inter">Por Aprobar</span>
                    <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                      <IconCheckCircle className="w-4.5 h-4.5" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-stone-900 font-inter">
                      {pedidosPendientesAprobacion}
                    </h3>
                    <p className="text-[10px] text-stone-400 font-inter font-medium">Pendientes de verificar datos</p>
                  </div>
                </div>

                {/* Soporte Asistido */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 font-inter">Soporte Manual</span>
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <IconWarning className="w-4.5 h-4.5" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-stone-900 font-inter">
                      {pedidosAsistidos}
                    </h3>
                    <p className="text-[10px] text-rose-500 font-inter font-medium">Requiere contacto WhatsApp</p>
                  </div>
                </div>
              </div>

              {/* Fila Inferior: Desglose y accesos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tarjeta de Popularidad de Plantillas */}
                <div className="md:col-span-2 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-5">
                  <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wide flex items-center gap-2">
                    <IconTag className="w-4 h-4 text-violet-600" />
                    Distribución de Ventas por Plantilla
                  </h3>

                  <div className="space-y-4 font-inter">
                    <TemplateProgress
                      name="🦖 Baby Dino"
                      count={countDino}
                      total={totalPedidos}
                      colorClass="bg-emerald-500"
                    />
                    <TemplateProgress
                      name="🦢 Cigüeña Dulce"
                      count={countStork}
                      total={totalPedidos}
                      colorClass="bg-sky-500"
                    />
                    <TemplateProgress
                      name="🚀 Aventura Espacial"
                      count={countSpace}
                      total={totalPedidos}
                      colorClass="bg-indigo-500"
                    />
                  </div>
                </div>

                {/* Tarjeta de Atajos Rápidos */}
                <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wide flex items-center gap-2">
                      <IconUser className="w-4 h-4 text-violet-600" />
                      Acciones Rápidas
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed font-inter">
                      Selecciona un pedido de la lista lateral para ver todos los detalles del evento, aprobar la invitación, habilitar el pago y moderar los mensajes recibidos del muro de deseos.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-xs text-stone-400 font-inter font-medium">
                    <span>Total Pedidos: {totalPedidos}</span>
                    <span>Modo Admin Activo</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Helper para barra de progreso de plantillas
function TemplateProgress({ name, count, total, colorClass }: { name: string; count: number; total: number; colorClass: string }) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-semibold text-stone-700">
        <span>{name}</span>
        <span className="text-stone-500 font-medium">
          {count} {count === 1 ? "pedido" : "pedidos"} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

