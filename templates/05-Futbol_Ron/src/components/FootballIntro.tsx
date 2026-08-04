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
                background: 'transparent',
              }}
            >
              {/* ── CIELO multicapa ── */}
              <div style={{
                position: 'absolute', inset: 0, bottom: '35%',
                background: 'linear-gradient(to bottom, #0a2a6e 0%, #1050b8 18%, #2272d8 36%, #3b9ae0 54%, #70c0f0 72%, #b8dff8 88%, #ddf0ff 100%)',
              }} />

              {/* brillo difuso del sol arriba-derecha */}
              <div style={{
                position: 'absolute', top: '-10%', right: '-8%',
                width: '55%', height: '55%',
                background: 'radial-gradient(circle, rgba(255,240,180,0.45) 0%, rgba(255,200,60,0.15) 40%, transparent 70%)',
                borderRadius: '50%',
              }} />

              {/* ── NUBES volumétricas ── */}
              {/* nube 1 izquierda */}
              <div style={{ position:'absolute', top:'7%', left:'-5%' }}>
                <div style={{ position:'relative', width:130, height:50 }}>
                  <div style={{ position:'absolute', bottom:0, left:10, width:110, height:30, background:'rgba(255,255,255,0.9)', borderRadius:30, filter:'blur(3px)' }} />
                  <div style={{ position:'absolute', bottom:10, left:20, width:80, height:38, background:'rgba(255,255,255,0.85)', borderRadius:50, filter:'blur(2px)' }} />
                  <div style={{ position:'absolute', bottom:16, left:45, width:55, height:42, background:'rgba(255,255,255,0.8)', borderRadius:50, filter:'blur(2px)' }} />
                  <div style={{ position:'absolute', bottom:8, left:0, width:50, height:28, background:'rgba(240,248,255,0.75)', borderRadius:40, filter:'blur(4px)' }} />
                </div>
              </div>
              {/* nube 2 derecha */}
              <div style={{ position:'absolute', top:'14%', right:'-3%' }}>
                <div style={{ position:'relative', width:150, height:56 }}>
                  <div style={{ position:'absolute', bottom:0, left:10, width:130, height:32, background:'rgba(255,255,255,0.88)', borderRadius:30, filter:'blur(3px)' }} />
                  <div style={{ position:'absolute', bottom:12, left:30, width:85, height:44, background:'rgba(255,255,255,0.82)', borderRadius:50, filter:'blur(2px)' }} />
                  <div style={{ position:'absolute', bottom:20, left:60, width:60, height:46, background:'rgba(255,255,255,0.78)', borderRadius:50, filter:'blur(2px)' }} />
                  <div style={{ position:'absolute', bottom:14, right:0, width:55, height:30, background:'rgba(220,238,255,0.7)', borderRadius:40, filter:'blur(4px)' }} />
                </div>
              </div>
              {/* nube 3 pequeña centro */}
              <div style={{ position:'absolute', top:'4%', left:'38%' }}>
                <div style={{ position:'relative', width:80, height:34 }}>
                  <div style={{ position:'absolute', bottom:0, left:5, width:70, height:20, background:'rgba(255,255,255,0.82)', borderRadius:24, filter:'blur(3px)' }} />
                  <div style={{ position:'absolute', bottom:6, left:15, width:48, height:28, background:'rgba(255,255,255,0.78)', borderRadius:40, filter:'blur(2px)' }} />
                </div>
              </div>
              {/* neblina de horizonte */}
              <div style={{
                position:'absolute', bottom:'34%', left:0, right:0, height:'12%',
                background:'linear-gradient(to bottom, transparent, rgba(185,225,255,0.5))',
              }} />

              {/* ── TEXTO en el cielo ── */}
              <div style={{
                position: 'absolute', top: '26%', left: 0, right: 0,
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
                  textShadow: '0 2px 12px rgba(0,50,120,0.5), 0 0 24px rgba(255,215,0,0.7)',
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
                  textShadow: '0 1px 6px rgba(0,40,100,0.6)',
                }}>
                  toca para abrir
                </span>
              </div>

              {/* ── CÉSPED: base + franjas tipo estadio ── */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '36%',
                background: 'linear-gradient(to bottom, #3aaa3a 0%, #2d8a2d 30%, #236e23 60%, #1a5218 100%)',
              }}>
                {/* franjas oscuras de estadio */}
                {[0,1,2,3,4,5,6,7].map(i => (
                  <div key={i} style={{
                    position: 'absolute', top: 0, bottom: 0,
                    left: `${i * 12.5}%`, width: '6.25%',
                    background: 'rgba(0,0,0,0.08)',
                  }} />
                ))}
                {/* brillo superior de la grama */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '25%',
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.12), transparent)',
                }} />
              </div>

              {/* ── BORDE ondulado cielo↔grama ── */}
              <svg viewBox="0 0 390 44" preserveAspectRatio="none"
                style={{ position:'absolute', bottom:'34%', left:0, width:'100%', height:44, display:'block' }}>
                <defs>
                  <linearGradient id="grassEdge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4cbe4c" />
                    <stop offset="100%" stopColor="#2d8a2d" />
                  </linearGradient>
                </defs>
                <path d="M0,28 C30,10 60,36 90,18 C120,2 150,32 180,14 C210,0 240,30 270,12 C300,0 330,28 360,14 C375,8 385,20 390,16 L390,44 L0,44 Z"
                  fill="url(#grassEdge)" />
              </svg>

              {/* ── BRIZNAS de grama — 3 capas ── */}
              {[
                // capa trasera (pequeña, más oscura)
                ...[5,22,38,55,70,86,102,118,134,150,166,182,198,214,230,246,262,278,294,310,326,342,358,374,388].map((x,i) => ({
                  x, bot:'35.5%', h:8+(i%3)*3, w:2,
                  color: i%2===0 ? '#1f7a1f' : '#196019', rot:(i%5-2)*7,
                })),
                // capa media
                ...[12,30,48,65,82,100,116,133,149,165,181,200,217,234,250,267,283,300,318,335,352,370,385].map((x,i) => ({
                  x, bot:'35.8%', h:12+(i%4)*4, w:3,
                  color: i%2===0 ? '#2ea82e' : '#238823', rot:(i%5-2)*10,
                })),
                // capa frontal (grande, verde vivo)
                ...[0,20,40,60,80,100,120,140,160,180,200,220,240,260,280,300,320,340,360,380].map((x,i) => ({
                  x, bot:'36%', h:16+(i%4)*5, w:3,
                  color: i%3===0 ? '#3dc43d' : i%3===1 ? '#2ea02e' : '#239823', rot:(i%7-3)*9,
                })),
              ].map((b, i) => (
                <div key={i} style={{
                  position:'absolute', bottom:b.bot,
                  left:`${(b.x/390)*100}%`,
                  width:b.w, height:b.h,
                  background:b.color,
                  borderRadius:'2px 2px 0 0',
                  transform:`rotate(${b.rot}deg)`,
                  transformOrigin:'bottom center',
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
