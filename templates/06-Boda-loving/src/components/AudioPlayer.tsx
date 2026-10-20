import React, { useState, useEffect, useRef } from 'react';

// Audio MP3 de respaldo cuando no hay URL configurada
const FALLBACK_MUSIC_URL =
  'https://res.cloudinary.com/ddqbnr9vo/video/upload/v1779927259/BEAUTIFUL_BOY_JOHN_LENNON_fb85tn.mp3';

/** Extrae el video ID de cualquier formato de URL de YouTube */
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

interface AudioPlayerProps {
  musicUrl?: string;
  title?: string;
  autoPlay?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  musicUrl = '',
  title = 'Nuestra canción',
  autoPlay = false,
}) => {
  const youtubeId = extractYouTubeId(musicUrl);
  const isYoutube = !!youtubeId;

  // ── Modo YouTube ─────────────────────────────────────────────────────────
  const [ytPlaying, setYtPlaying] = useState(false);

  // ── Modo MP3 directo ──────────────────────────────────────────────────────
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mp3Playing, setMp3Playing] = useState(false);

  // Estado visual unificado
  const isPlaying = isYoutube ? ytPlaying : mp3Playing;

  // Autoplay YouTube — monta el iframe inmediatamente tras interacción del usuario
  useEffect(() => {
    if (!isYoutube || !autoPlay) return;
    setYtPlaying(true);
  }, [isYoutube, autoPlay]);

  // Inicializar Audio en modo MP3
  useEffect(() => {
    if (isYoutube) return;

    const url = musicUrl || FALLBACK_MUSIC_URL;
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0.45;
    audioRef.current = audio;

    if (autoPlay) {
      // Llamada directa sin setTimeout — mantiene la cadena de gesture en iOS
      audio.play().then(() => setMp3Playing(true)).catch(() => {});
    }

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [musicUrl, isYoutube, autoPlay]);

  const toggle = () => {
    if (isYoutube) {
      setYtPlaying((p) => !p);
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (mp3Playing) {
      audio.pause();
      setMp3Playing(false);
    } else {
      audio.play().catch(() => {});
      setMp3Playing(true);
    }
  };

  return (
    <>
      {/* iframe invisible para YouTube — mismo patrón que Dino */}
      {isYoutube && ytPlaying && (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=0&rel=0&loop=1&playlist=${youtubeId}&modestbranding=1`}
          allow="autoplay; encrypted-media"
          title="audio"
          style={{
            position: 'fixed',
            bottom: 0,
            right: 0,
            width: 8,
            height: 8,
            opacity: 0,
            pointerEvents: 'none',
            border: 'none',
          }}
        />
      )}

      {/* Card del reproductor */}
      <div
        className="flex items-center gap-3 px-5 py-3 mx-4 my-2 rounded-xl select-none"
        style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid #ddd7cc' }}
      >
        <button
          onClick={toggle}
          aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-transform active:scale-90"
          style={{ background: '#2D382B', color: '#fff' }}
        >
          {isPlaying ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="2" y="1" width="3" height="10" rx="1" />
              <rect x="7" y="1" width="3" height="10" rx="1" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <polygon points="3,1 11,6 3,11" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-[#4A5E47] mb-0.5">
            {isPlaying ? 'Reproduciendo' : 'Música'}
          </p>
          <p
            className="text-lg leading-tight truncate text-[#2D382B]"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            {title}
          </p>
        </div>

        {/* Barras de ecualizador animadas */}
        <div className="flex items-end gap-[2px] h-4 flex-shrink-0">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-[3px] rounded-full"
              style={{
                background: '#2D382B',
                height: isPlaying ? undefined : 4,
                opacity: isPlaying ? 0.65 : 0.25,
                animation: isPlaying
                  ? `apbar${i} ${0.4 + i * 0.1}s ease-in-out infinite alternate`
                  : 'none',
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes apbar1 { from { height: 3px } to { height: 10px } }
        @keyframes apbar2 { from { height: 5px } to { height: 14px } }
        @keyframes apbar3 { from { height: 4px } to { height: 11px } }
        @keyframes apbar4 { from { height: 6px } to { height: 13px } }
      `}</style>
    </>
  );
};

export default AudioPlayer;
