import React, { useRef, useState } from 'react';
import FifaCard from './FifaCard';

const VIDEO_BALL   = 'https://res.cloudinary.com/ddqbnr9vo/video/upload/v1785876951/Bal%C3%B3n_de_f%C3%BAtbo_stp8ed.mp4';
const IMG_PLAYER   = 'https://res.cloudinary.com/ddqbnr9vo/image/upload/v1785889536/edit-this-cartoon-soccer-player-image-add-a-colorf_cdbven.webp';
const BALL_IMG     = 'https://res.cloudinary.com/ddqbnr9vo/image/upload/v1785887534/balon-cumple_rzkv2p.png';

// ── Datos del evento (se parametrizarán luego) ──
const _demoFecha = (() => {
  const d = new Date(); d.setDate(d.getDate() + 20);
  const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  return `${dias[d.getDay()]} ${d.getDate()} de ${meses[d.getMonth()]}, ${d.getFullYear()}`;
})();

const EVENTO = {
  nombre:  'Matias',
  fecha:   _demoFecha,
  hora:    '4:00 PM',
  lugar:   'Cancha El Pibe, Calle 45 #12-30',
  ciudad:  'Bogotá',
  nota:    '¡Trae tus botines y muchas ganas de celebrar!',
};

type Phase = 'splash' | 'ball' | 'player' | 'card';

export default function FootballIntro() {
  const [phase, setPhase]       = useState<Phase>('splash');
  const [titleIn, setTitleIn]   = useState(false);
  const ballRef = useRef<HTMLVideoElement>(null);

  const handleStart = () => {
    setPhase('ball');
    const v = ballRef.current;
    if (!v) return;
    v.muted = false;
    v.play().catch(() => { v.muted = true; v.play().catch(() => {}); });
  };

  const goToPlayer = () => {
    if (phase !== 'ball') return;
    setPhase('player');
    setTimeout(() => setTitleIn(true), 600);
    // imagen animada: avanza a card FIFA después de 5.5 s
    setTimeout(() => setPhase('card'), 5500);
  };

  const handleBallTimeUpdate = () => {
    const v = ballRef.current;
    if (!v || phase !== 'ball') return;
    if (v.duration && v.currentTime >= v.duration - 1) goToPlayer();
  };


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');

        .fb-root {
          position: fixed; inset: 0;
          background: #889C80;
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
              0 0 0 2px #6a7d62,
              0 0 0 5px #889C80,
              0 32px 80px rgba(0,0,0,0.5),
              inset 0 0 0 1px rgba(255,255,255,0.08);
          }
        }

        @keyframes ballSwing {
          0%, 100% { transform: translateX(-22px) rotate(-6deg); }
          50%       { transform: translateX(22px)  rotate(6deg); }
        }
        @keyframes shadowSwing {
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
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes titlePop {
          0%   { opacity: 0; transform: scale(0.7) translateY(-10px); }
          60%  { transform: scale(1.06) translateY(0); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,220,0,0.5); }
          50%      { box-shadow: 0 0 0 10px rgba(255,220,0,0); }
        }
        @keyframes detailsIn {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="fb-root">
        <div className="fb-phone">

          {/* ══ SPLASH ══ */}
          {phase === 'splash' && (
            <button onClick={handleStart} style={{
              position: 'absolute', inset: 0, zIndex: 20,
              border: 'none', cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent', overflow: 'hidden',
            }}>
              {/* fondo imagen */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'url(https://res.cloudinary.com/ddqbnr9vo/image/upload/v1785887622/fondo-grama_wwopta.png)',
                backgroundSize: 'cover', backgroundPosition: 'center',
              }} />

              {/* texto + flecha cerca al balón */}
              <div style={{
                position: 'absolute', bottom: '30%', left: 0, right: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                pointerEvents: 'none',
              }}>
                <span style={{
                  fontFamily: "'Anton', 'Impact', sans-serif",
                  fontSize: 'clamp(26px, 7.5vw, 40px)',
                  fontWeight: 900, color: '#FFFF55',
                  letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.1,
                  animation: 'shimmer 2.4s ease-in-out infinite',
                  textShadow: '0 3px 0 rgba(0,0,0,0.55)',
                  textAlign: 'center', padding: '0 20px',
                }}>¡Tienes una</span>
                <span style={{
                  fontFamily: "'Anton', 'Impact', sans-serif",
                  fontSize: 'clamp(32px, 9.5vw, 50px)',
                  fontWeight: 900, color: '#fff',
                  letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1,
                  textShadow: '0 3px 0 rgba(0,0,0,0.6)', textAlign: 'center',
                }}>INVITACIÓN!</span>

                <svg viewBox="0 0 80 70" style={{
                  width: 'clamp(44px, 11vw, 64px)', height: 'auto', marginTop: 4,
                  filter: 'drop-shadow(0 0 5px rgba(255,255,80,0.6))',
                }}>
                  <defs>
                    <marker id="tip" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 Z" fill="#FFFF55" />
                    </marker>
                  </defs>
                  <path d="M 15 6 C 65 6, 72 40, 40 60"
                    fill="none" stroke="#FFFF55" strokeWidth="3" strokeLinecap="round"
                    markerEnd="url(#tip)"
                    style={{ strokeDasharray: 160, strokeDashoffset: 160, animation: 'arrowDraw 0.9s 0.3s ease forwards' }}
                  />
                </svg>

                <span style={{
                  fontSize: 'clamp(10px, 2.5vw, 12px)', color: 'rgba(255,255,255,0.65)',
                  letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'sans-serif', marginTop: 2,
                }}>toca para abrir</span>
              </div>

              {/* balón */}
              <div style={{
                position: 'absolute', bottom: '7%', left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}>
                <img src={BALL_IMG} alt="balón" style={{
                  width: 160, height: 160, objectFit: 'contain',
                  animation: 'ballSwing 3s ease-in-out infinite',
                  filter: 'drop-shadow(0 14px 22px rgba(0,0,0,0.65))',
                }} />
                <div style={{
                  width: 90, height: 10, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.45)', filter: 'blur(6px)', marginTop: -6,
                  animation: 'shadowSwing 3s ease-in-out infinite',
                }} />
              </div>
            </button>
          )}

          {/* ══ VIDEO 1: BALÓN ══ */}
          <video ref={ballRef} src={VIDEO_BALL} playsInline preload="auto"
            onTimeUpdate={handleBallTimeUpdate} onEnded={goToPlayer}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
              opacity: phase === 'ball' ? 1 : 0, transition: 'opacity 0.5s ease', pointerEvents: 'none',
            }}
          />

          {/* ══ IMAGEN JUGADOR (webp animado) ══ */}
          {phase === 'player' && (
            <img
              src={IMG_PLAYER}
              alt="jugador"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%', objectFit: 'cover',
                objectPosition: 'center',
                animation: 'detailsIn 0.6s ease both',
              }}
            />
          )}

          {/* Título al fondo del video — no tapa la cara */}
          {phase === 'player' && titleIn && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
              padding: '32px 16px 24px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 60%, transparent 100%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              animation: 'titlePop 0.6s ease both',
            }}>
              <span style={{
                fontFamily: "'Anton', 'Impact', sans-serif",
                fontSize: 'clamp(28px, 8vw, 44px)',
                fontWeight: 900, color: '#FFFF55',
                textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.05,
                textShadow: '0 3px 0 rgba(0,0,0,0.7), 0 0 30px rgba(255,255,60,0.5)',
                textAlign: 'center',
                animation: 'shimmer 2.5s ease-in-out infinite',
              }}>¡Te invito a</span>
              <span style={{
                fontFamily: "'Anton', 'Impact', sans-serif",
                fontSize: 'clamp(34px, 10vw, 54px)',
                fontWeight: 900, color: '#fff',
                textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1,
                textShadow: '0 3px 0 rgba(0,0,0,0.8)',
                textAlign: 'center',
              }}>MI CUMPLE!</span>
            </div>
          )}

          {/* ══ CARD FIFA + DATOS DEL EVENTO ══ */}
          {phase === 'card' && (
            <FifaCard
              nombre={EVENTO.nombre}
              evento={{ fecha: EVENTO.fecha, hora: EVENTO.hora, lugar: EVENTO.lugar, nota: EVENTO.nota }}
            />
          )}

        </div>
      </div>
    </>
  );
}
