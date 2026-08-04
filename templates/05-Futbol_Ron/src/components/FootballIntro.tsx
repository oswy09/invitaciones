import React, { useRef, useState, useEffect } from 'react';

const VIDEO_BALL = 'https://res.cloudinary.com/ddqbnr9vo/video/upload/v1785876951/Bal%C3%B3n_de_f%C3%BAtbo_stp8ed.mp4';
const VIDEO_CR7  = 'https://res.cloudinary.com/ddqbnr9vo/video/upload/v1785876967/cr7_sacando_gorro_pastel_ayfb6g.mp4';
const BALL_IMG   = 'https://res.cloudinary.com/ddqbnr9vo/image/upload/v1785887534/balon-cumple_rzkv2p.png';
const NOMBRE     = 'Matias';

type Phase = 'splash' | 'ball' | 'reveal' | 'cr7';

export default function FootballIntro() {
  const [phase, setPhase]             = useState<Phase>('splash');
  const [revealVisible, setRevealVisible] = useState(false);
  const ballRef = useRef<HTMLVideoElement>(null);
  const cr7Ref  = useRef<HTMLVideoElement>(null);

  /* Splash → arranca video con sonido */
  const handleStart = () => {
    setPhase('ball');
    const v = ballRef.current;
    if (!v) return;
    v.muted = false;
    v.play().catch(() => { v.muted = true; v.play().catch(() => {}); });
  };

  /* Video 1 termina → pantalla reveal */
  const showReveal = () => {
    if (phase !== 'ball') return;
    setPhase('reveal');
    setTimeout(() => setRevealVisible(true), 80);
    // Auto-avanza a CR7 después de 3.2 s
    setTimeout(() => {
      setPhase('cr7');
      cr7Ref.current?.play().catch(() => {});
    }, 3500);
  };

  const handleTimeUpdate = () => {
    const v = ballRef.current;
    if (!v || phase !== 'ball') return;
    if (v.duration && v.currentTime >= v.duration - 1.2) showReveal();
  };

  return (
    <>
      <style>{`
        .fb-root {
          position: fixed; inset: 0;
          background: linear-gradient(to bottom, #0d2a5e 0%, #1a5c1a 100%);
          display: flex; align-items: center; justify-content: center;
        }
        .fb-phone {
          position: relative;
          width: 100%; height: 100%;
          overflow: hidden;
          background: #000;
        }
        @media (min-width: 641px) {
          .fb-phone {
            width: 390px;
            height: min(780px, 90vh);
            border-radius: 36px;
            box-shadow:
              0 0 0 2px #1a3a1a,
              0 0 0 4px #0d200d,
              0 32px 80px rgba(0,0,0,0.85),
              inset 0 0 0 1px rgba(255,255,255,0.06);
          }
        }

        /* ── balón flotando suave ── */
        @keyframes jump {
          0%, 100% { transform: translateY(0px) rotate(-4deg); }
          50%       { transform: translateY(-18px) rotate(4deg); }
        }
        @keyframes shadow {
          0%, 100% { transform: scaleX(1);   opacity: 0.35; }
          50%       { transform: scaleX(0.8); opacity: 0.18; }
        }
        @keyframes shimmer {
          0%,100% { text-shadow: 0 0 10px #FFD700, 0 0 28px #FFD700; }
          50%      { text-shadow: 0 0 24px #FFD700, 0 0 56px #ffe84d; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes letterIn {
          from { opacity: 0; transform: translateY(30px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);  filter: blur(0); }
        }
        @keyframes bgFlash {
          0%   { background: linear-gradient(160deg, #0a1f0a 0%, #000 100%); }
          20%  { background: linear-gradient(160deg, #1a3a08 0%, #060e00 100%); }
          100% { background: linear-gradient(160deg, #0a1f0a 0%, #000 100%); }
        }
      `}</style>

      <div className="fb-root">
        <div className="fb-phone">

          {/* ══ FASE 1: SPLASH ══ */}
          {phase === 'splash' && (
            <button
              onClick={handleStart}
              style={{
                position: 'absolute', inset: 0, zIndex: 20,
                border: 'none', cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
                overflow: 'hidden',
                background: 'transparent',
              }}
            >
              {/* ── FONDO: imagen estadio ── */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'url(https://res.cloudinary.com/ddqbnr9vo/image/upload/v1785887622/fondo-grama_wwopta.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }} />

              {/* ── TEXTO centrado ── */}
              <div style={{
                position: 'absolute', top: '22%', left: 0, right: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                pointerEvents: 'none',
              }}>
                <span style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 'clamp(22px, 6vw, 32px)',
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '0.02em',
                  animation: 'shimmer 2.4s ease-in-out infinite',
                  textShadow: '0 2px 12px rgba(0,0,0,0.7), 0 0 24px rgba(255,215,0,0.7)',
                  textAlign: 'center',
                  padding: '0 24px',
                }}>
                  ¡Tienes una invitación!
                </span>
                <span style={{
                  fontSize: 'clamp(11px, 3vw, 14px)',
                  color: 'rgba(255,255,255,0.9)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontFamily: 'sans-serif',
                  textShadow: '0 1px 6px rgba(0,0,0,0.8)',
                }}>
                  toca para abrir
                </span>
              </div>

              {/* ── balón flotando sobre la zona negra inferior ── */}
              <div style={{
                position: 'absolute',
                bottom: '8%',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}>
                <img
                  src={BALL_IMG}
                  alt="balón"
                  style={{
                    width: 110, height: 110,
                    objectFit: 'contain',
                    animation: 'jump 2.8s ease-in-out infinite',
                    filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.6))',
                  }}
                />
                {/* sombra suave bajo el balón */}
                <div style={{
                  width: 70, height: 10,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.5)',
                  filter: 'blur(5px)',
                  marginTop: -4,
                  animation: 'shadow 2.8s ease-in-out infinite',
                }} />
              </div>
            </button>
          )}

          {/* ══ VIDEO 1: BALÓN ══ */}
          <video
            ref={ballRef}
            src={VIDEO_BALL}
            playsInline
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onEnded={showReveal}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              opacity: phase === 'ball' ? 1 : 0,
              transition: 'opacity 0.5s ease',
              pointerEvents: 'none',
            }}
          />

          {/* ══ FASE 3: REVEAL "Es el cumpleaños de…" ══ */}
          {(phase === 'reveal' || phase === 'cr7') && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 15,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(160deg, #0a1f0a 0%, #000 100%)',
              opacity: phase === 'reveal' ? (revealVisible ? 1 : 0) : 0,
              transition: phase === 'cr7' ? 'opacity 0.6s ease' : 'opacity 0.5s ease',
              gap: 12,
              padding: '0 24px',
              textAlign: 'center',
            }}>
              <span style={{
                fontSize: 'clamp(14px, 4vw, 18px)',
                color: 'rgba(255,255,255,0.7)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontFamily: 'sans-serif',
                animation: revealVisible ? 'fadeUp 0.6s ease both' : 'none',
              }}>
                Es el cumpleaños de
              </span>
              <span style={{
                fontFamily: "'Georgia', serif",
                fontSize: 'clamp(42px, 13vw, 72px)',
                fontWeight: 700,
                color: '#FFD700',
                lineHeight: 1.1,
                animation: revealVisible ? 'letterIn 0.8s 0.25s ease both' : 'none',
                textShadow: '0 0 30px rgba(255,215,0,0.5)',
              }}>
                {NOMBRE}
              </span>
              {/* decoración: línea dorada */}
              <div style={{
                width: 60, height: 3,
                background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
                borderRadius: 2,
                animation: revealVisible ? 'zoomIn 0.6s 0.5s ease both' : 'none',
              }} />
            </div>
          )}

          {/* ══ VIDEO 2: CR7 ══ */}
          <video
            ref={cr7Ref}
            src={VIDEO_CR7}
            playsInline
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              opacity: phase === 'cr7' ? 1 : 0,
              transition: 'opacity 0.8s ease',
              pointerEvents: phase === 'cr7' ? 'auto' : 'none',
            }}
          />

        </div>
      </div>
    </>
  );
}
