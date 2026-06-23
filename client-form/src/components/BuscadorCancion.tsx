import { useEffect, useRef, useState } from "react";

export interface CancionSeleccionada {
  titulo: string;
  artista: string;
}

interface ResultadoITunes {
  trackName: string;
  artistName: string;
  artworkUrl60?: string;
}

interface BuscadorCancionProps {
  value: CancionSeleccionada | null;
  onChange: (cancion: CancionSeleccionada | null) => void;
}

/**
 * Busca canciones via la API gratuita de iTunes Search (no requiere API key).
 * Solo guarda título + artista como referencia — el audio real se consigue y
 * vincula manualmente después, porque descargar de fuentes como YouTube viola
 * sus términos de servicio y no escala operativamente.
 */
export default function BuscadorCancion({ value, onChange }: BuscadorCancionProps) {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<ResultadoITunes[]>([]);
  const [buscando, setBuscando] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setResultados([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setBuscando(true);
      try {
        const res = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=6`
        );
        const json = await res.json();
        setResultados(json.results ?? []);
      } catch {
        setResultados([]);
      } finally {
        setBuscando(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  if (value) {
    return (
      <div className="flex items-center justify-between gap-2 border border-emerald-200 bg-emerald-50 rounded-xl px-3 py-2">
        <div className="text-sm">
          <p className="font-bold text-slate-700">{value.titulo}</p>
          <p className="text-slate-500">{value.artista}</p>
        </div>
        <button
          onClick={() => onChange(null)}
          className="text-xs text-slate-500 hover:text-red-500 cursor-pointer shrink-0"
        >
          Cambiar
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        className="input"
        placeholder="Busca una canción o artista..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {buscando && <p className="text-xs text-slate-400 mt-1">Buscando...</p>}
      {resultados.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {resultados.map((r, i) => (
            <button
              key={i}
              onClick={() => {
                onChange({ titulo: r.trackName, artista: r.artistName });
                setQuery("");
                setResultados([]);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-left cursor-pointer"
            >
              {r.artworkUrl60 && (
                <img src={r.artworkUrl60} alt="" className="w-8 h-8 rounded-md shrink-0" />
              )}
              <div className="text-sm overflow-hidden">
                <p className="font-bold text-slate-700 truncate">{r.trackName}</p>
                <p className="text-slate-500 truncate">{r.artistName}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
