import React, { useRef, useState } from 'react';

const VIDEO_BALL = 'https://res.cloudinary.com/ddqbnr9vo/video/upload/v1785876951/Bal%C3%B3n_de_f%C3%BAtbo_stp8ed.mp4';
const VIDEO_CR7  = 'https://res.cloudinary.com/ddqbnr9vo/video/upload/v1785876967/cr7_sacando_gorro_pastel_ayfb6g.mp4';
const BALL_IMG   = 'https://res.cloudinary.com/ddqbnr9vo/image/upload/v1785887534/balon-cumple_rzkv2p.png';
const NOMBRE     = 'Matias';

type Phase = 'splash' | 'ball' | 'cr7';

export default function FootballIntro() {
  const [phase, setPhase] = useState<Phase>('splash');
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

  /* Video 1 termina → directo a CR7 */
  const showReveal = () => {
    if (phase !== 'ball') return;
    setPhase('cr7');
    cr7Ref.current?.play().catch(() => {});
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
          0%,100% { text-shadow: 0 0 10px #FFFF66, 0 0 28px #FFFF44; }
          50%      { text-shadow: 0 0 24px #FFFF88, 0 0 56px #FFFF55; }
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

              {/* ── TEXTO + FLECHA cerca al balón ── */}
              <div style={{
                position: 'absolute', bottom: '30%', left: 0, right: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                pointerEvents: 'none',
              }}>
                <span style={{
                  fontFamily: "'Anton', 'Impact', sans-serif",
                  fontSize: 'clamp(26px, 7.5vw, 40px)',
                  fontWeight: 900,
                  color: '#FFFF55',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  lineHeight: 1.1,
                  animation: 'shimmer 2.4s ease-in-out infinite',
                  textShadow: '0 3px 0 rgba(0,0,0,0.55)',
                  textAlign: 'center',
                  padding: '0 20px',
                }}>
                  ¡Tienes una
                </span>
                <span style={{
                  fontFamily: "'Anton', 'Impact', sans-serif",
                  fontSize: 'clamp(32px, 9.5vw, 50px)',
                  fontWeight: 900,
                  color: '#fff',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                  textShadow: '0 3px 0 rgba(0,0,0,0.6)',
                  textAlign: 'center',
                }}>
                  INVITACIÓN!
                </span>

                {/* flecha curva con punta real */}
                <svg viewBox="0 0 80 70" style={{
                  width: 'clamp(44px, 11vw, 64px)', height: 'auto',
                  marginTop: 4,
                  filter: 'drop-shadow(0 0 5px rgba(255,255,80,0.6))',
                }}>
                  <defs>
                    <marker id="arrowTip" markerWidth="6" markerHeight="6"
                      refX="3" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 Z" fill="#FFFF55" />
                    </marker>
                  </defs>
                  <path
                    d="M 15 6 C 65 6, 72 40, 40 60"
                    fill="none" stroke="#FFFF55" strokeWidth="3"
                    strokeLinecap="round"
                    markerEnd="url(#arrowTip)"
                    style={{
                      strokeDasharray: 160,
                      strokeDashoffset: 160,
                      animation: 'arrowDraw 0.9s 0.3s ease forwards',
                    }}
                  />
                </svg>

                <span style={{
                  fontSize: 'clamp(10px, 2.5vw, 12px)',
                  color: 'rgba(255,255,255,0.65)',
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
