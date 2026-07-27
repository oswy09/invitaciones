import { useState } from "react";
import { CATALOGO_ADMIN, FORM_CONTACTO_URL, CATALOGO_URL } from "../lib/catalogo";

function CopyButton({ text }: { text: string }) {
  const [copiado, setCopiado] = useState(false);
  function copiar() {
    navigator.clipboard.writeText(text);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }
  return (
    <button
      onClick={copiar}
      className="shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 cursor-pointer transition-all"
    >
      {copiado ? "✓ Copiado" : "Copiar"}
    </button>
  );
}

interface LinkRowProps {
  emoji: string;
  label: string;
  sublabel?: string;
  url: string;
  badge?: string;
  badgeColor?: string;
}

function LinkRow({ emoji, label, sublabel, url, badge, badgeColor = "bg-stone-100 text-stone-500" }: LinkRowProps) {
  return (
    <div className="bg-white border border-stone-100 rounded-xl px-4 py-3 flex items-center gap-3 hover:shadow-sm transition-shadow">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0 bg-stone-50">{emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[13px] font-semibold text-stone-800">{label}</p>
          {badge && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${badgeColor}`}>{badge}</span>}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-violet-600 font-mono truncate block hover:underline mt-0.5"
        >
          {url}
        </a>
        {sublabel && <p className="text-[11px] text-stone-400 mt-0.5">{sublabel}</p>}
      </div>
      <CopyButton text={url} />
    </div>
  );
}

export default function LinksDemo() {
  const pagadas = CATALOGO_ADMIN.filter((t) => !t.esFree);
  const gratuitas = CATALOGO_ADMIN.filter((t) => t.esFree);

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      {/* Cabecera */}
      <div>
        <h2 className="text-xl font-bold text-stone-900">Links de Demos y Formularios</h2>
        <p className="text-sm text-stone-400 mt-0.5">
          Copia cualquier enlace para compartirlo cuando alguien te contacte por WhatsApp.
        </p>
      </div>

      {/* Formularios */}
      <section className="space-y-3">
        <h3 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Formularios</h3>
        <LinkRow
          emoji="📋"
          label="Formulario de pedido asistido"
          sublabel="Envíalo cuando el cliente quiere que lo ayudes a diligenciar los datos."
          url={FORM_CONTACTO_URL}
          badge="CONTACTO"
          badgeColor="bg-violet-50 text-violet-600"
        />
        <LinkRow
          emoji="🖼️"
          label="Catálogo de plantillas"
          sublabel="Página pública con todos los diseños disponibles."
          url={CATALOGO_URL}
          badge="PÚBLICO"
          badgeColor="bg-emerald-50 text-emerald-600"
        />
      </section>

      {/* Demos pagadas */}
      <section className="space-y-3">
        <h3 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Demos — Plantillas de pago</h3>
        {pagadas.map((t) => (
          <LinkRow
            key={t.id}
            emoji={t.emoji}
            label={t.nombre}
            sublabel={t.descripcion}
            url={t.baseUrl}
            badge={`$${t.precioDefault.cop.toLocaleString("es-CO")} COP`}
            badgeColor="bg-stone-100 text-stone-500"
          />
        ))}
      </section>

      {/* Demos gratuitas */}
      <section className="space-y-3">
        <h3 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Demos — Plantillas gratuitas</h3>
        {gratuitas.map((t) => (
          <LinkRow
            key={t.id}
            emoji={t.emoji}
            label={t.nombre}
            sublabel={t.descripcion}
            url={t.baseUrl}
            badge="GRATIS"
            badgeColor="bg-emerald-50 text-emerald-700"
          />
        ))}
      </section>
    </div>
  );
}
