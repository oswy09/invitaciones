import { useEffect, useState } from "react";
import { CATALOGO, TemplateInfo, WHATSAPP_CONTACTO } from "../types";
import { supabase } from "../lib/supabase";

const WHATSAPP_MENSAJE = "¡Hola! Tengo una duda sobre las invitaciones digitales antes de hacer mi pedido.";

interface CatalogoProps {
  onSelect: (template: TemplateInfo) => void;
  onBack?: () => void;
}

export default function Catalogo({ onSelect, onBack }: CatalogoProps) {
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
    <div className="min-h-screen" style={{ backgroundColor: "#F8F5F0", fontFamily: "'Poppins', sans-serif", color: "#2B2B2B" }}>

      {/* NAV */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        {onBack ? (
          <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold cursor-pointer transition-opacity hover:opacity-70" style={{ color: "#5A1B5E" }}>
            <span>←</span>
            <img src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1783378436/logo-celebrarte_bxkmva.png" alt="Celebrarte" className="h-7 w-auto" />
          </button>
        ) : (
          <img src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1783378436/logo-celebrarte_bxkmva.png" alt="Celebrarte" className="h-8 w-auto" />
        )}
        <a
          href={`https://wa.me/${WHATSAPP_CONTACTO}?text=${encodeURIComponent(WHATSAPP_MENSAJE)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold px-4 py-2 rounded-full border-2 transition-all"
          style={{ borderColor: "#5A1B5E", color: "#5A1B5E" }}
        >
          💬 ¿Tienes dudas?
        </a>
      </nav>

      {/* HEADER */}
      <div className="text-center px-6 pt-10 pb-12 max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#C49B3A" }}>Nuestras plantillas</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "#5A1B5E" }}>
          Elige tu diseño
        </h1>
        <p className="text-sm leading-relaxed" style={{ opacity: 0.7 }}>
          Selecciona una plantilla, personalízala con tus datos y compártela al instante por WhatsApp.
        </p>
      </div>

      {/* GRID DE PLANTILLAS */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {CATALOGO.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl p-6 flex flex-col justify-between transition-all"
              style={{ backgroundColor: "white", border: "1.5px solid #E8B4BC" }}
            >
              <div>
                <div className="text-5xl mb-4">{t.emoji}</div>
                <h2 className="text-base font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: "#5A1B5E" }}>
                  {t.nombre}
                </h2>
                <p className="text-xs leading-relaxed mb-4" style={{ opacity: 0.65 }}>{t.descripcion}</p>
                <div className="rounded-xl px-3 py-2 mb-5" style={{ backgroundColor: "#F8F5F0" }}>
                  <span className="text-[10px] font-bold uppercase tracking-wider block mb-0.5" style={{ color: "#C49B3A" }}>Precio</span>
                  <span className="text-base font-bold" style={{ color: "#3A1140" }}>
                    {isColombia
                      ? `$${(precios[t.id]?.cop ?? 0).toLocaleString("es-CO")} COP`
                      : `$${precios[t.id]?.usd ?? 0} USD`}
                  </span>
                </div>
              </div>
              {t.baseUrl ? (
                <button
                  onClick={() => onSelect(t)}
                  className="w-full font-bold text-sm py-2.5 rounded-xl cursor-pointer transition-all text-center"
                  style={{ backgroundColor: "#5A1B5E", color: "#F8F5F0" }}
                >
                  Ver plantilla →
                </button>
              ) : (
                <button
                  disabled
                  className="w-full font-bold text-sm py-2.5 rounded-xl cursor-not-allowed text-center"
                  style={{ backgroundColor: "#F8F5F0", color: "#C49B3A", border: "1px solid #C49B3A" }}
                >
                  Próximamente
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Diseño personalizado */}
        <div className="mt-12 rounded-3xl p-7 sm:p-9 flex flex-col md:flex-row items-center justify-between gap-6" style={{ backgroundColor: "#3A1140" }}>
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#F8F5F0" }}>
              ¿Tienes una idea única en mente?
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#E8B4BC" }}>
              Creamos tu invitación digital desde cero con colores, temática y detalles completamente a tu gusto.
            </p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_CONTACTO}?text=${encodeURIComponent("¡Hola! Me gustaría cotizar un diseño 100% personalizado para mi invitación digital.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold px-6 py-3 rounded-2xl transition-all cursor-pointer whitespace-nowrap text-sm text-center w-full md:w-auto"
            style={{ backgroundColor: "#C49B3A", color: "#F8F5F0" }}
          >
            Solicitar diseño a medida →
          </a>
        </div>
      </div>
    </div>
  );
}
