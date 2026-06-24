import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { IconDollar, IconRefresh, IconCheckCircle, IconWarning } from "./Icons";

export default function GestionPrecios() {
  const [precios, setPrecios] = useState<Record<string, { cop: number; usd: number }>>({
    "01-dino": { cop: 70000, usd: 20 },
    "02-stork": { cop: 60000, usd: 18 },
    "03-space": { cop: 70000, usd: 20 },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.obtenerPrecios()
      .then((data) => {
        setPrecios(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("No se pudieron cargar los precios: " + err.message);
        setLoading(false);
      });
  }, []);

  function handlePriceChange(templateId: string, currency: "cop" | "usd", value: string) {
    const numericValue = parseInt(value.replace(/[^0-9]/g, "")) || 0;
    setPrecios((prev) => ({
      ...prev,
      [templateId]: {
        ...prev[templateId],
        [currency]: numericValue,
      },
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      await api.guardarPrecios(precios);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar los precios");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center space-y-3 h-full">
        <div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-violet-600 animate-spin" />
        <p className="text-xs text-stone-400 font-inter">Cargando precios...</p>
      </div>
    );
  }

  const templates = [
    { id: "01-dino", nombre: "🦖 Dino", desc: "Baby shower de dinosaurios", bg: "bg-emerald-50/50 border-emerald-100" },
    { id: "02-stork", nombre: "🦢 Cigüeña", desc: "Baby shower de cigüeña", bg: "bg-sky-50/50 border-sky-100" },
    { id: "03-space", nombre: "🚀 Espacio", desc: "Baby shower espacial", bg: "bg-indigo-50/50 border-indigo-100" },
  ];

  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full max-w-2xl mx-auto">
      {/* Cabecera */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <IconDollar className="text-violet-600 w-5 h-5" />
          Ajustes de Precios de Venta
        </h2>
        <p className="text-xs text-stone-500 leading-relaxed font-inter">
          Edita el valor en COP o USD para cada invitación. El sistema determina el país del usuario mediante su dirección IP para mostrar la tarifa y divisa correspondiente.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-4">
          {templates.map((t) => {
            const priceInfo = precios[t.id] ?? { cop: 0, usd: 0 };
            return (
              <div key={t.id} className={`bg-white border rounded-2xl p-5 shadow-sm space-y-4 transition-all hover:shadow-md border-stone-200`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-stone-800 text-sm">{t.nombre}</h3>
                    <p className="text-xs text-stone-400 font-inter mt-0.5">{t.desc}</p>
                  </div>
                  <span className="text-[10px] font-bold font-inter bg-stone-100 border border-stone-200 text-stone-500 px-2 py-0.5 rounded-md uppercase">
                    ID: {t.id}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 font-inter">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Precio COP ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-stone-400 font-medium">$</span>
                      <input
                        type="text"
                        value={priceInfo.cop.toLocaleString("es-CO")}
                        onChange={(e) => handlePriceChange(t.id, "cop", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/30 transition-all font-semibold text-stone-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Precio USD ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-stone-400 font-medium">$</span>
                      <input
                        type="text"
                        value={priceInfo.usd.toLocaleString("en-US")}
                        onChange={(e) => handlePriceChange(t.id, "usd", e.target.value)}
                        className="w-full border border-stone-200 rounded-xl pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-stone-50/30 transition-all font-semibold text-stone-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-xl font-medium flex items-center gap-2 font-inter">
            <IconWarning className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-250 text-emerald-700 text-xs p-4 rounded-xl font-medium flex items-center gap-2 font-inter animate-pulse">
            <IconCheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>¡Tarifas guardadas correctamente en la base de datos!</span>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-violet-600 hover:bg-violet-750 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow shadow-violet-600/10 flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Guardando precios...</span>
            </>
          ) : (
            <span>Guardar Configuración</span>
          )}
        </button>
      </form>
    </div>
  );
}

