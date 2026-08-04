import React, { useRef, useState, useEffect } from 'react';

const VIDEO_BALL = 'https://res.cloudinary.com/ddqbnr9vo/video/upload/v1785876951/Bal%C3%B3n_de_f%C3%BAtbo_stp8ed.mp4';
const VIDEO_CR7  = 'https://res.cloudinary.com/ddqbnr9vo/video/upload/v1785876967/cr7_sacando_gorro_pastel_ayfb6g.mp4';
const BALL_IMG   = 'https://static.vecteezy.com/system/resources/thumbnails/012/996/773/small/sport-ball-football-free-png.png';
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

        /* ── balón saltando ── */
        @keyframes jump {
          0%        { transform: translateY(0) rotate(0deg); animation-timing-function: cubic-bezier(0.33,0,0.66,0); }
          45%, 55%  { transform: translateY(-72vh) rotate(300deg); animation-timing-function: cubic-bezier(0.33,1,0.66,1); }
          100%      { transform: translateY(0) rotate(540deg); }
        }
        @keyframes shadow {
          0%, 100% { transform: scaleX(1);   opacity: 0.55; }
          50%       { transform: scaleX(0.2); opacity: 0.07; }
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
                /* fondo partido: cielo arriba, grama abajo */
                background: 'linear-gradient(to bottom, #1a8fe3 0%, #5bc8f5 38%, #5bc8f5 60%, #2d8a2d 60%, #1a5c1a 100%)',
              }}
            >
              {/* ── nubes decorativas ── */}
              <div style={{ position: 'absolute', top: '8%', left: '10%', width: 90, height: 36, background: 'rgba(255,255,255,0.55)', borderRadius: 40, filter: 'blur(6px)' }} />
              <div style={{ position: 'absolute', top: '6%', left: '18%', width: 60, height: 26, background: 'rgba(255,255,255,0.4)', borderRadius: 40, filter: 'blur(5px)' }} />
              <div style={{ position: 'absolute', top: '13%', right: '12%', width: 110, height: 40, background: 'rgba(255,255,255,0.45)', borderRadius: 40, filter: 'blur(7px)' }} />
              <div style={{ position: 'absolute', top: '11%', right: '20%', width: 70, height: 28, background: 'rgba(255,255,255,0.35)', borderRadius: 40, filter: 'blur(5px)' }} />

              {/* ── texto en el cielo ── */}
              <div style={{
                position: 'absolute', top: '20%', left: 0, right: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              }}>
                <span style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 'clamp(22px, 6vw, 32px)',
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '0.02em',
                  animation: 'shimmer 2.4s ease-in-out infinite',
                  textShadow: '0 2px 8px rgba(0,0,0,0.4), 0 0 20px rgba(255,215,0,0.6)',
                  textAlign: 'center',
                  padding: '0 24px',
                }}>
                  ¡Tienes una invitación!
                </span>
                <span style={{
                  fontSize: 'clamp(11px, 3vw, 14px)',
                  color: 'rgba(255,255,255,0.85)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontFamily: 'sans-serif',
                  textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                }}>
                  toca para abrir
                </span>
              </div>

              {/* ── grama: franja ondulada + briznas ── */}
              <svg viewBox="0 0 390 30" preserveAspectRatio="none"
                style={{ position: 'absolute', bottom: '38%', left: 0, width: '100%', height: 30 }}>
                <path d="M0,20 Q20,0 40,15 Q60,30 80,12 Q100,0 120,18 Q140,30 160,10 Q180,0 200,16 Q220,28 240,8 Q260,0 280,14 Q300,28 320,10 Q340,0 360,16 Q380,28 390,14 L390,30 L0,30 Z"
                  fill="#2d8a2d" />
              </svg>
              {/* briznas de grama */}
              {[8,18,30,42,55,67,78,88,100,112,124,136,148,160,172,184,196,208,220,232,244,256,268,280,292,304,316,328,340,352,364,376,388].map((x, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  bottom: '37%',
                  left: `${(x / 390) * 100}%`,
                  width: 3,
                  height: 10 + (i % 3) * 5,
                  background: i % 2 === 0 ? '#3aaa3a' : '#1f7a1f',
                  borderRadius: '2px 2px 0 0',
                  transform: `rotate(${(i % 5 - 2) * 8}deg)`,
                  transformOrigin: 'bottom center',
                }} />
              ))}

              {/* ── balón: arranca desde la grama ── */}
              <div style={{
                position: 'absolute',
                bottom: '38%',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}>
                <div style={{
                  width: 90, height: 90,
                  backgroundImage: `url(${BALL_IMG})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  animation: 'jump 1.4s ease-in-out infinite',
                }} />
                {/* sombra en el suelo */}
                <div style={{
                  width: 65, height: 10,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.35)',
                  filter: 'blur(4px)',
                  marginTop: 3,
                  animation: 'shadow 1.4s ease-in-out infinite',
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
