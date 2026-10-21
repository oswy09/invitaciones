import { useEffect, useRef, useState } from 'react';
import bckPaisaje from '../images/bck-paisaje-costa.jpg';
import hojaIzq from '../images/hoja-palmera.png';
import pinguiImg from '../images/pingui.png';
import pinguiFemImg from '../images/pingui-fem.png';

const pinguiSrc = pinguiImg;
const pinguiFemSrc = pinguiFemImg;

const CSS = `
  @keyframes slideFromLeft {
    0%   { opacity: 0; transform: translateX(-70px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideFromRight {
    0%   { opacity: 0; transform: translateX(70px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  @keyframes penguinBob {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    30%       { transform: translateY(-5px) rotate(-2deg); }
    70%       { transform: translateY(-3px) rotate(2deg); }
  }
  @keyframes penguinBobMirror {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    30%       { transform: translateY(-3px) rotate(2deg); }
    70%       { transform: translateY(-5px) rotate(-2deg); }
  }
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    14%       { transform: scale(1.35); }
    28%       { transform: scale(1); }
    42%       { transform: scale(1.2); }
    70%       { transform: scale(1); }
  }
  @keyframes floatHeart {
    0%, 100% { transform: translateY(0px) scale(1); }
    50%       { transform: translateY(-6px) scale(1.05); }
  }
`;

export function PenguinsGracias() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const PENGUIN_SIZE = 130;

  return (
    <section ref={ref} style={{
      position: 'relative', width: '100%', height: '100dvh',
      scrollSnapAlign: 'start', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-start', flexShrink: 0,
      background: '#F5EFE4',
    }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Solo palma izquierda */}
      <img src={hojaIzq} alt="" style={{
        position: 'absolute', top: -10, left: -10, width: 160,
        opacity: 0.7, pointerEvents: 'none', transform: 'rotate(10deg)',
      }} />

      {/* Playa fondo */}
      <img src={bckPaisaje} alt="" style={{
        position: 'absolute', bottom: 0, left: 0, width: '100%', height: '45%',
        objectFit: 'cover', objectPosition: 'center bottom', pointerEvents: 'none',
      }} />

      {/* Contenido */}
      <div style={{
        position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column',
        alignItems: 'center', paddingTop: '9vh', gap: 0,
      }}>
        {/* GRACIAS — bold prominente */}
        <p style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 800, fontSize: 11, letterSpacing: '0.35em',
          textTransform: 'uppercase', color: '#7A5C38',
          textAlign: 'center', margin: '0 0 2px',
        }}>Gracias</p>
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 400, fontSize: 13, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: '#4A3728',
          textAlign: 'center', margin: 0, lineHeight: 1.7,
        }}>por ser parte<br />de esta historia</p>

        <div style={{ width: 1, height: 22, background: '#B8956A', opacity: 0.5, margin: '12px 0' }} />

        {/* Pingüinos + corazón */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 0 }}>

          {/* Corazón animado latiendo */}
          <div style={{
            position: 'absolute', top: -28, left: '50%',
            transform: 'translateX(-50%)',
            animation: `heartbeat 1.4s ease-in-out infinite, floatHeart 2.5s ease-in-out infinite`,
            fontSize: 22, color: '#E8899A', lineHeight: 1, display: 'flex',
            zIndex: 3,
          }}>♥</div>

          {/* Pingüina femenina — primero, entra desde la izquierda */}
          <img
            src={pinguiFemSrc}
            alt="Pingüina"
            style={{
              width: PENGUIN_SIZE, height: PENGUIN_SIZE, objectFit: 'contain',
              marginRight: -18,
              animation: visible
                ? 'slideFromLeft 1.6s cubic-bezier(0.16,1,0.3,1) both, penguinBob 2.4s ease-in-out 1.8s infinite'
                : 'none',
              opacity: visible ? 1 : 0,
            }}
          />

          {/* Pingüino masculino — segundo, entra desde la derecha */}
          <img
            src={pinguiSrc}
            alt="Pingüino"
            style={{
              width: PENGUIN_SIZE, height: PENGUIN_SIZE, objectFit: 'contain',
              animation: visible
                ? 'slideFromRight 1.6s cubic-bezier(0.16,1,0.3,1) 0.25s both, penguinBobMirror 2.4s ease-in-out 2s infinite'
                : 'none',
              opacity: visible ? 1 : 0,
            }}
          />
        </div>

        {/* Nombres */}
        <p style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 700, fontSize: 21, letterSpacing: '0.14em',
          color: '#1A2B1A', margin: '12px 0 4px', textTransform: 'uppercase',
        }}>Isabella &amp; Andrés</p>

        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 700, fontSize: 16, letterSpacing: '0.04em',
          color: '#5C4A2A', margin: 0, fontVariantNumeric: 'tabular-nums',
        }}>30 · 05 · 2027</p>

        <p style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#B8956A', margin: '5px 0', opacity: 0.7 }}>〜</p>

        <div style={{
          background: 'rgba(255,255,255,0.88)',
          borderRadius: 30, padding: '6px 20px',
          border: '1px solid rgba(184,149,106,0.25)',
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 600, fontSize: 12, letterSpacing: '0.3em',
            textTransform: 'uppercase', color: '#5C4A2A', margin: 0,
          }}>Santa Marta, Colombia</p>
        </div>
      </div>
    </section>
  );
}
