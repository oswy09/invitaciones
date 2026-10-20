import React, { useState, useEffect, useRef } from 'react';

interface MusicPlayerProps {
  autoPlayTrigger?: boolean;
  visible?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  autoPlayTrigger,
  visible = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/amber_glow.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (autoPlayTrigger && audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.warn('Autoplay blocked by browser policy:', err);
      });
    }
  }, [autoPlayTrigger]);

  const togglePlayback = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.warn);
    }
  };

  const notes = [
    { sym: '♩', x: -8, anim: 'floatUp1', d: '0s', sz: 18 },
    { sym: '♫', x: 14, anim: 'floatUp2', d: '0.8s', sz: 17 },
    { sym: '♪', x: -16, anim: 'floatUp3', d: '1.6s', sz: 16 },
    { sym: '♬', x: 8, anim: 'floatUp1', d: '2.4s', sz: 19 },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        zIndex: 900,
        display: visible ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none',
        pointerEvents: visible ? 'none' : 'none',
        animation: visible ? 'musicPlayerFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both' : 'none',
      }}
    >
      <style>{`
        @keyframes musicPlayerFadeIn {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes floatUp1 {
          0% { opacity: 0; transform: translateY(0) scale(0.6) rotate(-8deg); }
          25% { opacity: 0.9; }
          100% { opacity: 0; transform: translateY(-160px) scale(1.1) rotate(12deg); }
        }
        @keyframes floatUp2 {
          0% { opacity: 0; transform: translateY(0) scale(0.6) rotate(10deg); }
          25% { opacity: 0.9; }
          100% { opacity: 0; transform: translateY(-170px) scale(1.15) rotate(-14deg); }
        }
        @keyframes floatUp3 {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          25% { opacity: 0.9; }
          100% { opacity: 0; transform: translateY(-180px) scale(1.2) rotate(8deg); }
        }
        @keyframes vinylSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 4px 16px rgba(158, 123, 59, 0.25); }
          50% { box-shadow: 0 6px 24px rgba(158, 123, 59, 0.5); }
        }
      `}</style>

      {/* Floating Notes */}
      {isPlaying &&
        notes.map((n, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              bottom: '100%',
              left: `calc(50% + ${n.x}px)`,
              fontSize: n.sz,
              color: 'var(--c-gold)',
              lineHeight: 1,
              pointerEvents: 'none',
              animation: `${n.anim} 3.2s ease-out ${n.d} infinite`,
            }}
          >
            {n.sym}
          </span>
        ))}

      {/* Player button */}
      <button
        type="button"
        onClick={togglePlayback}
        onTouchEnd={togglePlayback}
        aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
        style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '7px 15px 7px 10px',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(252, 248, 240, 0.92) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(190, 150, 80, 0.65)',
          borderRadius: 28,
          boxShadow: '0 4px 18px rgba(168, 125, 50, 0.22)',
          animation: !isPlaying ? 'pulseGlow 2.5s ease-in-out infinite' : 'none',
          cursor: 'pointer',
          outline: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {/* Classical Gold Seal / Treble Clef Icon */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FAF7F0, #EFE7D8)',
            border: '1px solid var(--c-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: isPlaying ? 'vinylSpin 8s linear infinite' : 'none',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"
              fill="var(--c-gold)"
            />
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: 9.5,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--c-text)',
              lineHeight: 1,
            }}
          >
            {isPlaying ? 'Pausar' : 'Música'}
          </span>
          <span
            style={{
              fontFamily: 'var(--f-roman)',
              fontSize: 10,
              fontStyle: 'italic',
              color: 'var(--c-gold)',
              lineHeight: 1.2,
            }}
          >
            Amber Glow
          </span>
        </div>
      </button>
    </div>
  );
};
