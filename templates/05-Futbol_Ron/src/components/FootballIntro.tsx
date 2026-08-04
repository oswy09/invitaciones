import React, { useRef, useState, useEffect } from 'react';

const VIDEO_BALL = 'https://res.cloudinary.com/ddqbnr9vo/video/upload/v1785876951/Bal%C3%B3n_de_f%C3%BAtbo_stp8ed.mp4';
const VIDEO_CR7  = 'https://res.cloudinary.com/ddqbnr9vo/video/upload/v1785876967/cr7_sacando_gorro_pastel_ayfb6g.mp4';

type Phase = 'ball' | 'cta' | 'cr7';

export default function FootballIntro() {
  const [phase, setPhase]         = useState<Phase>('ball');
  const [ctaVisible, setCtaVisible] = useState(false);
  const ballRef = useRef<HTMLVideoElement>(null);
  const cr7Ref  = useRef<HTMLVideoElement>(null);

  const showCta = () => {
    if (phase === 'ball') {
      setPhase('cta');
      setTimeout(() => setCtaVisible(true), 50);
    }
  };

  const handleBallTimeUpdate = () => {
    const v = ballRef.current;
    if (!v || phase !== 'ball') return;
    if (v.duration && v.currentTime >= v.duration - 1.5) showCta();
  };

  const handleOpen = () => {
    setPhase('cr7');
    setTimeout(() => cr7Ref.current?.play().catch(() => {}), 50);
  };

  useEffect(() => {
    ballRef.current?.play().catch(() => {});
  }, []);

  return (
    <>
      <style>{`
        /* fondo desktop */
        .fb-root {
          position: fixed; inset: 0;
          background: radial-gradient(ellipse at 50% 40%, #0d2b0d 0%, #020c02 100%);
          display: flex; align-items: center; justify-content: center;
        }
        /* contenedor: full-screen en móvil, celular en desktop */
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
              0 32px 80px rgba(0,0,0,0.8),
              inset 0 0 0 1px rgba(255,255,255,0.06);
          }
        }
        @keyframes dashDraw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%,100% { text-shadow: 0 0 10px #FFD700, 0 0 28px #FFD700; }
          50%      { text-shadow: 0 0 24px #FFD700, 0 0 56px #ffe84d; }
        }
        @keyframes btnGlow {
          0%,100% { box-shadow: 0 0 14px rgba(255,215,0,0.5); }
          50%      { box-shadow: 0 0 28px rgba(255,215,0,0.9), 0 0 8px #FFD700; }
        }
      `}</style>

      <div className="fb-root">
        <div className="fb-phone">

          {/* ── VIDEO 1: BALÓN ── */}
          <video
            ref={ballRef}
            src={VIDEO_BALL}
            playsInline
            onTimeUpdate={handleBallTimeUpdate}
            onEnded={showCta}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              opacity: phase === 'cr7' ? 0 : 1,
              transition: 'opacity 0.6s ease',
              pointerEvents: 'none',
            }}
          />

          {/* ── CTA overlay — sin fondo oscuro ── */}
          {phase === 'cta' && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 10,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'flex-end',
              paddingBottom: '14%',
              opacity: ctaVisible ? 1 : 0,
              transition: 'opacity 0.7s ease',
            }}>
              {/* Texto + flecha apuntando al botón */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                animation: 'fadeUp 0.7s ease both',
              }}>
                <span style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 'clamp(20px, 5.5vw, 30px)',
                  fontWeight: 700, color: '#fff',
                  letterSpacing: '0.02em',
                  animation: 'shimmer 2.5s ease-in-out infinite',
                  textShadow: '0 0 10px #FFD700, 0 0 28px #FFD700',
                }}>
                  ¡Tienes una invitación!
                </span>

                {/* flecha curva apuntando hacia abajo */}
                <svg viewBox="0 0 60 50" style={{
                  width: 'clamp(50px, 12vw, 74px)', height: 'auto',
                  filter: 'drop-shadow(0 0 5px #FFD700)',
                  marginBottom: -4,
                }}>
                  <path d="M 8 4 Q 52 8 40 40"
                    fill="none" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round"
                    style={{ animation: 'dashDraw 0.7s 0.3s ease forwards', strokeDasharray: 70, strokeDashoffset: 70 }}
                  />
                  <polyline points="31,37 40,46 47,33"
                    fill="none" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                {/* Botón principal */}
                <button
                  onClick={handleOpen}
                  style={{
                    padding: '12px 32px',
                    borderRadius: 999,
                    border: '2px solid #FFD700',
                    background: 'rgba(0,0,0,0.55)',
                    color: '#FFD700',
                    fontFamily: "'Georgia', serif",
                    fontSize: 'clamp(15px, 4vw, 20px)',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    animation: 'btnGlow 2s ease-in-out infinite',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  Ver invitación →
                </button>
              </div>
            </div>
          )}

          {/* ── VIDEO 2: CR7 ── */}
          <video
            ref={cr7Ref}
            src={VIDEO_CR7}
            playsInline
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              opacity: phase === 'cr7' ? 1 : 0,
              transition: 'opacity 0.6s ease',
              pointerEvents: phase === 'cr7' ? 'auto' : 'none',
            }}
          />

        </div>
      </div>
    </>
  );
}
