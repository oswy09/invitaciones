import { useEffect, useState } from "react";
import { CATALOGO, TemplateInfo, WHATSAPP_CONTACTO } from "../types";
import { supabase } from "../lib/supabase";

const WHATSAPP_MENSAJE = "¡Hola! Tengo una duda sobre las invitaciones digitales antes de hacer mi pedido.";

interface CatalogoProps {
  onSelect: (template: TemplateInfo) => void;
}

export default function Catalogo({ onSelect }: CatalogoProps) {
  const [isColombia, setIsColombia] = useState(true);
  const [precios, setPrecios] = useState<Record<string, { cop: number; usd: number }>>({
    "01-dino": { cop: 70000, usd: 20 },
    "02-stork": { cop: 60000, usd: 18 },
    "03-space": { cop: 70000, usd: 20 },
  });

  useEffect(() => {
    // 1. Geolocalizar por IP
    async function geolocalizar() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const json = await res.json();
        setIsColombia(json.country_code === "CO");
      } catch {
        try {
          const res = await fetch("https://ip-api.com/json");
          const json = await res.json();
          setIsColombia(json.countryCode === "CO");
        } catch {
          setIsColombia(true); // Fallback: Colombia
        }
      }
    }
    geolocalizar();

    // 2. Cargar precios desde Supabase
    async function cargarPrecios() {
      try {
        const { data } = await supabase
          .from("eventos")
          .select("datos")
          .eq("id", "config-precios")
          .maybeSingle();

        if (data && data.datos && data.datos.precios) {
          setPrecios(data.datos.precios);
        }
      } catch (err) {
        console.error("Error al cargar precios:", err);
      }
    }
    cargarPrecios();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-3xl font-bold text-slate-800">Elige tu plantilla</h1>
        <a
          href={`https://wa.me/${WHATSAPP_CONTACTO}?text=${encodeURIComponent(WHATSAPP_MENSAJE)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-sm font-bold text-emerald-600 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 rounded-full px-4 py-2 transition-colors"
        >
          💬 ¿Tienes dudas? Escríbenos
        </a>
      </div>
      <p className="text-slate-500 mb-8">Selecciona un diseño para empezar a ver e ingresar tus datos.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {CATALOGO.map((t) => (
          <div
            key={t.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="text-4xl mb-3">{t.emoji}</div>
              <h2 className="text-lg font-bold text-slate-800">{t.nombre}</h2>
              <p className="text-sm text-slate-500 mt-1 mb-4">{t.descripcion}</p>

              {/* Sección de Precio */}
              <div className="mb-5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Precio</span>
                <span className="text-base font-extrabold text-slate-800">
                  {isColombia 
                    ? `$${(precios[t.id]?.cop ?? 0).toLocaleString("es-CO")} COP`
                    : `$${precios[t.id]?.usd ?? 0} USD`
                  }
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onSelect(t)}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm py-2.5 px-3 rounded-xl cursor-pointer transition-colors text-center"
              >
                Ver plantilla ➔
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Opción de diseño 100% personalizado */}
      <div className="mt-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl font-bold flex items-center justify-center md:justify-start gap-2">
            <span>✨</span> ¿Buscas un diseño 100% personalizado?
          </h3>
          <p className="text-white/90 text-sm max-w-xl leading-relaxed">
            Si tienes una idea específica, colores especiales o una temática única que no ves en nuestro catálogo, creamos tu invitación digital desde cero según tus gustos.
          </p>
        </div>
        <a
          href={`https://wa.me/${WHATSAPP_CONTACTO}?text=${encodeURIComponent(
            "¡Hola! Me gustaría cotizar un diseño 100% personalizado para mi invitación digital."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white hover:bg-slate-50 text-violet-700 font-bold px-6 py-3 rounded-2xl shadow-md transition-all cursor-pointer whitespace-nowrap text-sm text-center w-full md:w-auto"
        >
          💬 Solicitar Diseño a Medida
        </a>
      </div>
    </div>
  );
}
