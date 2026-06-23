import { CATALOGO, TemplateInfo } from "../types";

const WHATSAPP_CONTACTO = "573057502790";
const WHATSAPP_MENSAJE = "¡Hola! Tengo una duda sobre las invitaciones digitales antes de hacer mi pedido.";

interface CatalogoProps {
  onSelect: (template: TemplateInfo) => void;
}

export default function Catalogo({ onSelect }: CatalogoProps) {
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
      <p className="text-slate-500 mb-8">Selecciona un diseño para empezar a personalizar tu invitación.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {CATALOGO.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            className="text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-sky-400 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="text-4xl mb-3">{t.emoji}</div>
            <h2 className="text-lg font-bold text-slate-800">{t.nombre}</h2>
            <p className="text-sm text-slate-500 mt-1">{t.descripcion}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
