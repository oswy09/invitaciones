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
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
        .fb-root {
          position: fixed; inset: 0;
          background: linear-gradient(135deg, #0f4a0f 0%, #1a6b1a 40%, #0d400d 100%);
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

        /* ── balón: izquierda ↔ derecha ── */
        @keyframes jump {
          0%, 100% { transform: translateX(-22px) rotate(-6deg); }
          50%       { transform: translateX(22px)  rotate(6deg); }
        }
        @keyframes shadow {
          0%, 100% { transform: translateX(-18px) scaleX(0.85); opacity: 0.4; }
          50%       { transform: translateX(18px)  scaleX(1.1);  opacity: 0.25; }
        }
        @keyframes arrowDraw {
          to { stroke-dashoffset: 0; }
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

              {/* ── TEXTO estilo fútbol ── */}
              <div style={{
                position: 'absolute', top: '18%', left: 0, right: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                pointerEvents: 'none',
              }}>
                <span style={{
                  fontFamily: "'Anton', 'Impact', sans-serif",
                  fontSize: 'clamp(28px, 8vw, 42px)',
                  fontWeight: 900,
                  color: '#FFD700',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  lineHeight: 1.1,
                  animation: 'shimmer 2.4s ease-in-out infinite',
                  textShadow: '0 3px 0 rgba(0,0,0,0.5), 0 0 30px rgba(255,215,0,0.6)',
                  textAlign: 'center',
                  padding: '0 20px',
                }}>
                  ¡Tienes una
                </span>
                <span style={{
                  fontFamily: "'Anton', 'Impact', sans-serif",
                  fontSize: 'clamp(34px, 10vw, 52px)',
                  fontWeight: 900,
                  color: '#fff',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                  textShadow: '0 3px 0 rgba(0,0,0,0.6), 0 0 20px rgba(255,255,255,0.2)',
                  textAlign: 'center',
                }}>
                  INVITACIÓN!
                </span>

                {/* flecha curva SVG apuntando al balón (abajo-centro) */}
                <svg viewBox="0 0 100 120" style={{
                  width: 'clamp(50px, 14vw, 80px)', height: 'auto',
                  marginTop: 6,
                  filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.7))',
                }}>
                  <path
                    d="M 20 8 C 80 8, 90 60, 50 100"
                    fill="none" stroke="#FFD700" strokeWidth="3.5"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: 180,
                      strokeDashoffset: 180,
                      animation: 'arrowDraw 0.9s 0.4s ease forwards',
                    }}
                  />
                  <polyline
                    points="38,92 50,108 62,92"
                    fill="none" stroke="#FFD700" strokeWidth="3.5"
                    strokeLinecap="round" strokeLinejoin="round"
                    style={{
                      strokeDasharray: 40,
                      strokeDashoffset: 40,
                      animation: 'arrowDraw 0.4s 1.2s ease forwards',
                    }}
                  />
                </svg>

                <span style={{
                  fontSize: 'clamp(10px, 2.5vw, 13px)',
                  color: 'rgba(255,255,255,0.75)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontFamily: 'sans-serif',
                  marginTop: 2,
                }}>
                  toca para abrir
                </span>
              </div>

              {/* ── BALÓN flotando izquierda↔derecha ── */}
              <div style={{
                position: 'absolute',
                bottom: '7%',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}>
                <img
                  src={BALL_IMG}
                  alt="balón"
                  style={{
                    width: 160, height: 160,
                    objectFit: 'contain',
                    animation: 'jump 3s ease-in-out infinite',
                    filter: 'drop-shadow(0 14px 22px rgba(0,0,0,0.65))',
                  }}
                />
                <div style={{
                  width: 90, height: 10,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.45)',
                  filter: 'blur(6px)',
                  marginTop: -6,
                  animation: 'shadow 3s ease-in-out infinite',
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
