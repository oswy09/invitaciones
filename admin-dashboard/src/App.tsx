import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { api } from "./lib/api";
import { authClient } from "./lib/authClient";
import { Pedido } from "./types";
import ListaPedidos from "./components/ListaPedidos";
import DetallePedido from "./components/DetallePedido";
import GestionPrecios from "./components/GestionPrecios";
import Login from "./components/Login";
import { IconDollar, IconRefresh, IconTrendingUp, IconUser, IconCheckCircle, IconWarning, IconCalendar, IconTag } from "./components/Icons";

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    authClient.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: subscription } = authClient.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  if (session === undefined) return null; // evita parpadeo mientras se resuelve la sesión inicial
  if (session === null) return <Login />;

  return <Dashboard onLogout={() => authClient.auth.signOut()} />;
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const [vista, setVista] = useState<"pedidos" | "precios">("pedidos");
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
      {/* Header */}
      <header className="h-16 px-6 bg-white border-b border-stone-200 flex items-center justify-between shrink-0 z-10">
        <div
          onClick={() => { setVista("pedidos"); setSeleccionadoId(null); }}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white">
            <span className="font-bold text-sm font-inter">I</span>
          </div>
          <h1 className="text-[15px] font-bold text-stone-900 tracking-tight">Invitaciones</h1>
        </div>

        {/* Navegación: segmented control */}
        <div className="flex items-center gap-0.5 bg-stone-100 rounded-full p-1">
          <button
            onClick={() => { setVista("pedidos"); setSeleccionadoId(null); }}
            className={`text-[13px] font-semibold px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              vista === "pedidos"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            Pedidos
          </button>
          <button
            onClick={() => setVista("precios")}
            className={`text-[13px] font-semibold px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              vista === "precios"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            Precios
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              cargarPedidos();
              cargarPrecios();
            }}
            disabled={isRefreshing}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-all cursor-pointer disabled:opacity-50"
            title="Sincronizar datos"
          >
            <IconRefresh className={`w-4 h-4 ${isRefreshing ? "animate-spin text-violet-600" : ""}`} />
          </button>

          <button
            onClick={onLogout}
            className="text-[13px] font-semibold px-3 py-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
          >
            Salir
          </button>
        </div>
      </header>

      {/* Cuerpo Principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar con lista — no aplica en la vista de Precios, que es ajena a un pedido puntual */}
        {vista === "pedidos" && (
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
        )}

        {/* Panel Central */}
        <main className="flex-1 bg-stone-50 overflow-hidden relative">
          {vista === "precios" ? (
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
            <div className="h-full overflow-y-auto p-8 space-y-10 max-w-5xl mx-auto">
              {/* Saludo */}
              <div>
                <h2 className="text-[22px] font-bold text-stone-900 tracking-tight">Resumen general</h2>
                <p className="text-sm text-stone-400 mt-0.5">
                  Estado de tus ventas y confirmaciones de invitados.
                </p>
              </div>

              {/* Grid de Tarjetas Estadísticas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard
                  label="Ingresos COP"
                  valor={`$${copEstimado.toLocaleString("es-CO")}`}
                  nota={`${pedidosPagados} pagados`}
                  icon={<IconDollar className="w-4 h-4" />}
                  color="emerald"
                />
                <StatCard
                  label="Ingresos USD"
                  valor={`$${usdEstimado.toLocaleString("en-US")}`}
                  nota="equivalente"
                  icon={<IconTrendingUp className="w-4 h-4" />}
                  color="sky"
                />
                <StatCard
                  label="Por aprobar"
                  valor={String(pedidosPendientesAprobacion)}
                  nota="pendientes"
                  icon={<IconCheckCircle className="w-4 h-4" />}
                  color="amber"
                />
                <StatCard
                  label="Soporte manual"
                  valor={String(pedidosAsistidos)}
                  nota="vía WhatsApp"
                  icon={<IconWarning className="w-4 h-4" />}
                  color="rose"
                />
              </div>

              {/* Fila Inferior: Desglose y accesos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Tarjeta de Popularidad de Plantillas */}
                <div className="md:col-span-2 bg-white border border-stone-100 rounded-2xl p-6 space-y-5">
                  <h3 className="text-[13px] font-bold text-stone-700 flex items-center gap-2">
                    <IconTag className="w-4 h-4 text-violet-500" />
                    Distribución por plantilla
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
                <div className="bg-stone-50 rounded-2xl p-6 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <h3 className="text-[13px] font-bold text-stone-700 flex items-center gap-2">
                      <IconUser className="w-4 h-4 text-violet-500" />
                      Acciones rápidas
                    </h3>
                    <p className="text-[12.5px] text-stone-500 leading-relaxed font-inter">
                      Selecciona un pedido de la lista para ver los detalles, aprobarlo, marcarlo como pagado o moderar el muro de deseos.
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-stone-200/70 flex items-center justify-between text-[11px] text-stone-400 font-inter font-semibold">
                    <span>{totalPedidos} pedidos en total</span>
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

const STAT_COLORS = {
  emerald: "bg-emerald-50 text-emerald-600",
  sky: "bg-sky-50 text-sky-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
} as const;

function StatCard({
  label,
  valor,
  nota,
  icon,
  color,
}: {
  label: string;
  valor: string;
  nota: string;
  icon: React.ReactNode;
  color: keyof typeof STAT_COLORS;
}) {
  return (
    <div className="bg-stone-50 rounded-2xl p-4 space-y-3">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${STAT_COLORS[color]}`}>{icon}</div>
      <div>
        <p className="text-xl font-bold text-stone-900 font-inter leading-tight">{valor}</p>
        <p className="text-[11px] text-stone-400 font-inter font-medium mt-0.5">{label} · {nota}</p>
      </div>
    </div>
  );
}

