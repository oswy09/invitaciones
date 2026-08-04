import React, { useRef, useState, useEffect } from 'react';

const VIDEO_BALL = 'https://res.cloudinary.com/ddqbnr9vo/video/upload/v1785876951/Bal%C3%B3n_de_f%C3%BAtbo_stp8ed.mp4';
const VIDEO_CR7  = 'https://res.cloudinary.com/ddqbnr9vo/video/upload/v1785876967/cr7_sacando_gorro_pastel_ayfb6g.mp4';

type Phase = 'ball' | 'cta' | 'cr7';

export default function FootballIntro() {
  const [phase, setPhase]       = useState<Phase>('ball');
  const [ctaVisible, setCtaVisible] = useState(false);
  const ballRef = useRef<HTMLVideoElement>(null);
  const cr7Ref  = useRef<HTMLVideoElement>(null);

  /* Mostrar CTA cuando el video de la pelota termina */
  const handleBallEnded = () => {
    setPhase('cta');
    setTimeout(() => setCtaVisible(true), 50);
  };

  /* También mostrar CTA en los últimos 1.5 s (por si onEnded tarda) */
  const handleBallTimeUpdate = () => {
    const v = ballRef.current;
    if (!v || phase !== 'ball') return;
    if (v.duration && v.currentTime >= v.duration - 1.5) {
      handleBallEnded();
    }
  };

  /* Clic en el balón → video CR7 */
  const handleBallClick = () => {
    setPhase('cr7');
    setTimeout(() => cr7Ref.current?.play(), 50);
  };

  /* Autoplay del primer video */
  useEffect(() => {
    ballRef.current?.play().catch(() => {});
  }, []);

  return (
    <div style={styles.root}>

      {/* ── VIDEO 1: BALÓN ── */}
      <video
        ref={ballRef}
        src={VIDEO_BALL}
        playsInline
        muted
        onTimeUpdate={handleBallTimeUpdate}
        onEnded={handleBallEnded}
        style={{
          ...styles.fullVideo,
          opacity: phase === 'cr7' ? 0 : 1,
          transition: 'opacity 0.6s ease',
          pointerEvents: 'none',
        }}
      />

      {/* ── CTA overlay ── */}
      {phase === 'cta' && (
        <div style={{
          ...styles.ctaOverlay,
          opacity: ctaVisible ? 1 : 0,
          transition: 'opacity 0.7s ease',
        }}>
          {/* Texto superior */}
          <div style={styles.ctaText}>
            <span style={styles.ctaLine1}>¡Tienes una invitación!</span>
            <span style={styles.ctaLine2}>Dale clic al balón</span>
          </div>

          {/* Flecha curva SVG */}
          <svg viewBox="0 0 80 70" style={styles.arrow} aria-hidden="true">
            <path
              d="M 10 5 Q 70 10 55 55"
              fill="none" stroke="#FFD700" strokeWidth="3"
              strokeLinecap="round"
              style={{ animation: 'dashDraw 0.8s ease forwards', strokeDasharray: 90, strokeDashoffset: 90 }}
            />
            {/* punta de flecha */}
            <polyline points="44,52 55,62 62,48" fill="none" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          {/* Balón clicable */}
          <button onClick={handleBallClick} style={styles.ballBtn} aria-label="Abrir invitación">
            ⚽
          </button>
        </div>
      )}

      {/* ── VIDEO 2: CR7 ── */}
      <video
        ref={cr7Ref}
        src={VIDEO_CR7}
        playsInline
        style={{
          ...styles.fullVideo,
          opacity: phase === 'cr7' ? 1 : 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: phase === 'cr7' ? 'auto' : 'none',
        }}
      />

      <style>{`
        @keyframes dashDraw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes ballPulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.12); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { text-shadow: 0 0 8px #FFD700, 0 0 24px #FFD700; }
          50%  { text-shadow: 0 0 20px #FFD700, 0 0 48px #fff200; }
          100% { text-shadow: 0 0 8px #FFD700, 0 0 24px #FFD700; }
        }
      `}</style>
    </div>
  );
}

/* ── estilos ── */
const styles: Record<string, React.CSSProperties> = {
  root: {
    position: 'fixed',
    inset: 0,
    background: '#0a1a0a',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullVideo: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  ctaOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.7) 100%)',
    gap: 0,
  },
  ctaText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    animation: 'fadeUp 0.7s ease both',
  },
  ctaLine1: {
    fontFamily: "'Georgia', serif",
    fontSize: 'clamp(22px, 6vw, 36px)',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '0.02em',
    animation: 'shimmer 2.5s ease-in-out infinite',
    textShadow: '0 0 8px #FFD700, 0 0 24px #FFD700',
  },
  ctaLine2: {
    fontFamily: "'Georgia', serif",
    fontSize: 'clamp(14px, 3.5vw, 20px)',
    color: '#FFD700',
    fontWeight: 600,
    letterSpacing: '0.06em',
  },
  arrow: {
    width: 'clamp(64px, 16vw, 100px)',
    height: 'auto',
    marginTop: 4,
    marginBottom: -8,
    filter: 'drop-shadow(0 0 6px #FFD700)',
  },
  ballBtn: {
    fontSize: 'clamp(64px, 18vw, 110px)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    lineHeight: 1,
    animation: 'ballPulse 1.4s ease-in-out infinite',
    filter: 'drop-shadow(0 8px 24px rgba(255,215,0,0.5))',
    WebkitTapHighlightColor: 'transparent',
    marginTop: 8,
  },
};
