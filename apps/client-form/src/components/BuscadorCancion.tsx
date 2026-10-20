import { useEffect, useRef, useState } from "react";
import { searchYouTubeSongs, type YouTubeSearchResult } from "../utils/youtube";

export interface CancionSeleccionada {
  titulo: string;
  artista: string;
  youtubeId?: string;
  thumbnailUrl?: string;
}

interface BuscadorCancionProps {
  value: CancionSeleccionada | null;
  onChange: (cancion: CancionSeleccionada | null) => void;
  onPlay?: (youtubeId: string | null) => void;
}

const BRAND = "#5A1B5E";

export default function BuscadorCancion({ value, onChange, onPlay }: BuscadorCancionProps) {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<YouTubeSearchResult[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    searchYouTubeSongs("").then((items) => {
      setResultados(items);
      setCargandoInicial(false);
    });
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setBuscando(false);
      searchYouTubeSongs("").then(setResultados);
      return;
    }
    setBuscando(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const items = await searchYouTubeSongs(query);
        setResultados(items);
      } catch {
        setResultados([]);
      } finally {
        setBuscando(false);
      }
    }, 420);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  function togglePlay(id: string) {
    const next = playingId === id ? null : id;
    setPlayingId(next);
    onPlay?.(next);
  }

  function seleccionar(r: YouTubeSearchResult) {
    onChange({ titulo: r.title, artista: r.artist, youtubeId: r.id, thumbnailUrl: r.thumbnailUrl });
    setPlayingId(r.id);
    onPlay?.(r.id);
    setQuery("");
  }

  // ── Canción seleccionada ───────────────────────────────────────────────────
  if (value) {
    const ytId = value.youtubeId;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "linear-gradient(135deg,#fdf5ff,#f5eef8)",
          border: `1.5px solid #d8b8e8`, borderRadius: 14, padding: "10px 12px",
        }}>
          {/* Icono musical */}
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${BRAND},#7A2E8A)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.1-1.34 2-3 2s-3-.9-3-2 1.34-2 3-2 3 .9 3 2zm12-3c0 1.1-1.34 2-3 2s-3-.9-3-2 1.34-2 3-2 3 .9 3 2z" />
            </svg>
          </div>

          <div style={{ flex: 1, overflow: "hidden" }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {value.titulo}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#7a5c8a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {value.artista}
            </p>
          </div>

          {/* Botones: reproducir + quitar */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            {ytId && (
              <button type="button" onClick={() => togglePlay(ytId)}
                style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: playingId === ytId ? "#ef4444" : BRAND, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {playingId === ytId ? (
                  <svg width="12" height="12" fill="white" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                ) : (
                  <svg width="12" height="12" fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
            )}
            <button type="button" onClick={() => { onChange(null); setPlayingId(null); onPlay?.(null); }}
              style={{ fontSize: 10, fontWeight: 700, color: "#ef4444", background: "none", border: "1px solid #fca5a5", borderRadius: 8, padding: "4px 8px", cursor: "pointer" }}>
              Quitar
            </button>
          </div>
        </div>

        {/* Mini player — audio only, sin video */}
        {ytId && playingId === ytId && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f5eeff", border: "1px solid #e0ccf5", borderRadius: 10, padding: "8px 12px" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: BRAND, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, animation: "spin 3s linear infinite" }}>
              <svg width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M9 19V6l12-3v13M9 19c0 1.1-1.34 2-3 2s-3-.9-3-2 1.34-2 3-2 3 .9 3 2zm12-3c0 1.1-1.34 2-3 2s-3-.9-3-2 1.34-2 3-2 3 .9 3 2z"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: BRAND }}>{value.titulo}</p>
              <p style={{ margin: "1px 0 0", fontSize: 10, color: "#9b7ab0" }}>{value.artista}</p>
            </div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            {/* iframe invisible — solo audio */}
            <iframe
              key={ytId}
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&controls=0&rel=0&showinfo=0&modestbranding=1`}
              allow="autoplay; encrypted-media"
              style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
            />
          </div>
        )}
      </div>
    );
  }

  // ── Buscador ───────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Input */}
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text" value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca canción, artista o pega un link de YouTube..."
          style={{ width: "100%", boxSizing: "border-box", paddingLeft: 32, paddingRight: query ? 32 : 12, paddingTop: 9, paddingBottom: 9, fontSize: 13, fontWeight: 500, color: "#334155", background: "#faf8ff", border: "1.5px solid #e8dcef", borderRadius: 10, outline: "none" }}
        />
        {query && (
          <button type="button" onClick={() => setQuery("")}
            style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 2 }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Etiqueta */}
      <p style={{ margin: 0, fontSize: 10, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
        {buscando ? "Buscando…" : query ? `Resultados para "${query}"` : "Populares"}
      </p>

      {/* Mini player activo — audio only, sin video */}
      {playingId && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f5eeff", border: "1px solid #e0ccf5", borderRadius: 10, padding: "8px 12px" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: BRAND, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, animation: "spin 3s linear infinite" }}>
            <svg width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M9 19V6l12-3v13M9 19c0 1.1-1.34 2-3 2s-3-.9-3-2 1.34-2 3-2 3 .9 3 2zm12-3c0 1.1-1.34 2-3 2s-3-.9-3-2 1.34-2 3-2 3 .9 3 2z"/></svg>
          </div>
          <span style={{ fontSize: 12, color: BRAND, fontWeight: 700, flex: 1 }}>Reproduciendo…</span>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          {/* iframe invisible — solo audio */}
          <iframe
            key={playingId}
            src={`https://www.youtube.com/embed/${playingId}?autoplay=1&controls=0&rel=0&showinfo=0&modestbranding=1`}
            allow="autoplay; encrypted-media"
            style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
          />
        </div>
      )}

      {/* Lista */}
      {cargandoInicial ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "16px 0" }}>
          <svg style={{ animation: "spin 1s linear infinite" }} width="18" height="18" fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke={BRAND} strokeWidth="4" />
            <path style={{ opacity: 0.75 }} fill={BRAND} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 1, maxHeight: 220, overflowY: "auto", borderRadius: 10, border: "1px solid #f1f0f5", background: "#fff" }}>
          {resultados.length === 0 && (
            <p style={{ margin: 0, padding: "14px 12px", fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
              Sin resultados
            </p>
          )}
          {resultados.map((r) => (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderBottom: "1px solid #f8f5ff" }}>
              {/* Botón de reproducir */}
              <button
                type="button"
                onClick={() => togglePlay(r.id)}
                style={{ width: 28, height: 28, borderRadius: "50%", border: "none", flexShrink: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: playingId === r.id ? "#ef4444" : "#f0e8f8", transition: "background 0.15s" }}
              >
                {playingId === r.id ? (
                  <svg width="10" height="10" fill="#fff" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                ) : (
                  <svg width="10" height="10" fill={BRAND} viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>

              {/* Info */}
              <div style={{ flex: 1, overflow: "hidden" }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {r.title}
                </p>
                <p style={{ margin: "1px 0 0", fontSize: 10, color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {r.artist}{r.duration && <span style={{ marginLeft: 5, color: "#94a3b8" }}>{r.duration}</span>}
                </p>
              </div>

              {/* Seleccionar */}
              <button
                type="button"
                onClick={() => seleccionar(r)}
                style={{ fontSize: 10, fontWeight: 800, color: BRAND, background: "#f0e8f8", border: "none", borderRadius: 8, padding: "4px 9px", cursor: "pointer", flexShrink: 0 }}
              >
                Elegir
              </button>
            </div>
          ))}
        </div>
      )}

      <p style={{ margin: 0, fontSize: 10, color: "#cbd5e1", textAlign: "center" }}>
        ▶ Escucha antes de elegir • Resultados vía YouTube
      </p>
    </div>
  );
}
