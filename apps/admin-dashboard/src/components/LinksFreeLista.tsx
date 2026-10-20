import { useEffect, useState } from "react";
import { api } from "../lib/api";

function tiempoRelativo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `hace ${d} d`;
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

export default function LinksFreeLista() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiado, setCopiado] = useState<string | null>(null);

  useEffect(() => {
    api.listarLinksFree()
      .then(setLinks)
      .finally(() => setLoading(false));
  }, []);

  function copiar(url: string) {
    navigator.clipboard.writeText(url);
    setCopiado(url);
    setTimeout(() => setCopiado(null), 2000);
  }

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <div className="w-6 h-6 border-2 border-stone-200 border-t-violet-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-stone-900">Links Free Generados</h2>
        <p className="text-sm text-stone-400 mt-0.5">{links.length} links creados en total</p>
      </div>

      {links.length === 0 ? (
        <div className="bg-white border border-stone-100 rounded-2xl p-10 text-center text-stone-400">
          <p className="text-sm font-medium">Aún no se han generado links free.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {links.map((l, i) => (
            <div key={l.id ?? i} className="bg-white border border-stone-100 rounded-xl px-4 py-3 flex items-center gap-3 hover:shadow-sm transition-shadow">
              <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center text-base shrink-0">🎂</div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-stone-800 truncate">
                  {l.params?.saludo || "¡Hola!"} · {l.params?.lugar || "—"}
                </p>
                <p className="text-[11px] text-stone-400 font-mono truncate mt-0.5">{l.url}</p>
              </div>
              <span className="text-[11px] text-stone-400 shrink-0">{tiempoRelativo(l.created_at)}</span>
              <button
                onClick={() => copiar(l.url)}
                className="shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 cursor-pointer transition-all"
              >
                {copiado === l.url ? "✓ Copiado" : "Copiar"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
