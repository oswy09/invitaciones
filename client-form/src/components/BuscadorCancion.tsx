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

export default function BuscadorCancion({ value, onChange }: BuscadorCancionProps) {
  const [tipoSeleccion, setTipoSeleccion] = useState<'buscar' | 'link'>('buscar');
  const [query, setQuery] = useState("");
  const [linkInput, setLinkInput] = useState("");
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

  // Si ya hay una canción seleccionada, mostrar una tarjeta premium con animación de música
  if (value) {
    const isLink = value.artista === "Link externo" || value.titulo.startsWith("http");
    return (
      <div className="flex items-center justify-between gap-4 border border-violet-100 bg-gradient-to-r from-violet-50/50 to-fuchsia-50/30 rounded-2xl p-4 shadow-sm transition-all duration-300">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Icono de disco giratorio o nota */}
          <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-violet-600/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-indigo-500 rounded-full animate-pulse"></div>
            <svg className="w-5 h-5 relative z-10 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          
          <div className="text-sm overflow-hidden">
            <p className="font-bold text-slate-800 truncate leading-tight">{isLink ? "Enlace de música" : value.titulo}</p>
            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{value.artista === "Link externo" ? value.titulo : value.artista}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 hover:border-rose-200 transition-all cursor-pointer shrink-0"
        >
          Quitar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Selector de Pestañas con mejor estilo */}
      <div className="flex bg-slate-100/80 border border-slate-200/40 p-1 rounded-xl gap-1">
        <button
          type="button"
          onClick={() => setTipoSeleccion('buscar')}
          className={`flex-1 text-xs py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            tipoSeleccion === 'buscar'
              ? 'bg-white text-violet-700 shadow-sm border border-slate-200/50'
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Buscar Canción</span>
        </button>
        
        <button
          type="button"
          onClick={() => setTipoSeleccion('link')}
          className={`flex-1 text-xs py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            tipoSeleccion === 'link'
              ? 'bg-white text-violet-700 shadow-sm border border-slate-200/50'
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span>Pegar Enlace</span>
        </button>
      </div>

      {tipoSeleccion === 'buscar' ? (
        <div className="relative">
          <div className="relative flex items-center">
            <input
              type="text"
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium placeholder:text-slate-400 text-slate-700"
              placeholder="Escribe el nombre de la canción o del artista..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {/* Icono de búsqueda fijo a la izquierda */}
            <div className="absolute left-3.5 pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {/* Spinner de cargando o botón limpiar a la derecha */}
            <div className="absolute right-3.5 flex items-center">
              {buscando ? (
                <svg className="animate-spin h-4 w-4 text-violet-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : null}
            </div>
          </div>

          {resultados.length > 0 && (
            <div className="absolute z-30 mt-2 w-full bg-white border border-slate-200/80 rounded-2xl shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-100 py-1 transition-all">
              {resultados.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onChange({ titulo: r.trackName, artista: r.artistName });
                    setQuery("");
                    setResultados([]);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-violet-50/50 text-left cursor-pointer transition-colors group"
                >
                  {r.artworkUrl60 ? (
                    <img
                      src={r.artworkUrl60}
                      alt=""
                      className="w-10 h-10 rounded-lg shrink-0 object-cover shadow-sm group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                  )}
                  <div className="text-sm overflow-hidden flex-1">
                    <p className="font-bold text-slate-700 group-hover:text-violet-900 truncate leading-snug">{r.trackName}</p>
                    <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{r.artistName}</p>
                  </div>
                  
                  {/* Flechita / Check discreto al pasar el cursor */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-1">
                    <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="url"
            className="flex-1 px-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium placeholder:text-slate-400 text-slate-700"
            placeholder="Pegar enlace de YouTube o Spotify..."
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
          />
          <button
            type="button"
            onClick={() => {
              if (linkInput.trim()) {
                onChange({ titulo: linkInput.trim(), artista: "Link externo" });
                setLinkInput("");
              }
            }}
            className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-5 rounded-xl cursor-pointer transition-colors shadow-sm active:scale-95"
          >
            Agregar
          </button>
        </div>
      )}
    </div>
  );
}
