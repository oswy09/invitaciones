import { useState, useEffect } from 'react';
import { LocationModal, type LocationData } from './LocationModal';
import { PenguinsGracias } from './PenguinsGracias';
import portadaImg from '../images/fondo-letras novios.jpg';
// import palmera from '../images/palmera-relieve.jpg';
import bckCostIntro from '../images/bck-cost-intro.jpg';
import palmerasAtardecer from '../images/palmeras-atardecer.png';
import fondoPalmera from '../images/fondo-planta-palmera.jpg';
import fondoPalmeraPNG from '../images/Fondo-palmera.png';
import hojaIzq from '../images/hoja-palmera.png';
import hojaDer from '../images/hoja-palmera-media.png';
import hojaRelieve from '../images/hoja-palmera-relieve.png';
import bckPaisaje from '../images/bck-paisaje-costa.jpg';
import vestidosBoda from '../images/vestidos-boda-novios.png';

const TYPEWRITER_TEXT = 'Tienes una invitación';


/* ── Pantalla 1: Portada — aislada, sin scroll ── */
function PortadaScreen({ onOpen, hideControls }: { onOpen: () => void; hideControls?: boolean }) {
  const [typed, setTyped] = useState('');
  const [showBtn, setShowBtn] = useState(false);
  const [_hovered, setHovered] = useState(false);

  useEffect(() => {
    let i = 0;
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setTyped(TYPEWRITER_TEXT.slice(0, i));
        if (i >= TYPEWRITER_TEXT.length) {
          clearInterval(interval);
          setTimeout(() => setShowBtn(true), 300);
        }
      }, 45);
      return () => clearInterval(interval);
    }, 800);
    return () => clearTimeout(delay);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', justifyContent: 'center',
      background: '#0D1B2A', zIndex: 10,
    }}>
      <div style={{
        position: 'relative', width: '100%', maxWidth: 430,
        height: '100dvh', overflow: 'hidden', background: '#F2EDE5',
      }}>
        <img src={portadaImg} alt="" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center center',
        }} />

        {/* Hoja izquierda */}
        <img src={hojaIzq} alt="" style={{
          position: 'absolute', left: -18, top: -10, width: 210,
          transformOrigin: 'top left',
          animation: 'windLeft 5s ease-in-out infinite',
          pointerEvents: 'none', zIndex: 2,
        }} />

        {/* Hoja derecha */}
        <img src={hojaDer} alt="" style={{
          position: 'absolute', right: -12, top: '18%', width: 170,
          transformOrigin: 'top right',
          animation: 'windRight 6s ease-in-out infinite',
          pointerEvents: 'none', zIndex: 2,
        }} />

        {!hideControls && (
        <div style={{
          position: 'absolute', bottom: '8vh', left: 0, right: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: 'italic', fontSize: 22, color: '#2A1F14',
            margin: 0, minHeight: '1.4em', letterSpacing: '0.02em',
          }}>
            {typed}
            <span style={{
              display: 'inline-block', width: 2, height: '0.85em',
              background: '#7A5C38', marginLeft: 3, verticalAlign: 'middle',
              opacity: typed.length >= TYPEWRITER_TEXT.length ? 0 : 1,
            }} />
          </p>

          <a
            onClick={e => { e.preventDefault(); onOpen(); }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            href="#"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '11px 28px', borderRadius: 40,
              border: '1.5px solid #7A5C38',
              background: '#7A5C38',
              cursor: 'pointer', textDecoration: 'none',
              opacity: showBtn ? 1 : 0,
              transform: showBtn ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease, background 0.25s ease',
              pointerEvents: showBtn ? 'auto' : 'none',
            }}
          >
            <span style={{
              fontFamily: 'var(--f-body)', fontSize: 11, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: '#F5EFE4',
              fontWeight: 500, transition: 'color 0.25s ease',
            }}>Ver invitación</span>
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M1 5h12M8 1l4 4-4 4" stroke="#F5EFE4" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
        )}
      </div>
    </div>
  );
}

const LOCATIONS: Record<string, LocationData> = {
  ceremonia: {
    title: 'Ceremonia',
    placeName: 'Capilla Privada Los Alcatraces',
    address: 'KM 17 #VIA, Ciénaga',
    city: 'Santa Marta, Magdalena',
    lat: 11.0860413,
    lng: -74.2172351,
    emoji: '⛪',
  },
  recepcion: {
    title: 'Recepción',
    placeName: 'Mamancana Reserva Natural',
    address: 'Km 14 vía a Palomino',
    city: 'Santa Marta, Magdalena',
    lat: 11.2196,
    lng: -74.1350,
    emoji: '🌴',
  },
};

/* ── Contenido: pantallas 2 y 3 con scroll-snap ── */
function Invitacion({ onLocation }: { onLocation: (loc: LocationData) => void }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', background: '#0D1B2A',
    }}>
      <div style={{
        width: '100%', maxWidth: 430,
        height: '100dvh',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
        WebkitOverflowScrolling: 'touch',
      }}>

        {/* ── Pantalla 2: Nombres ── */}
        <section style={{
          position: 'relative', width: '100%', height: '100dvh',
          scrollSnapAlign: 'start', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {/* Fondo bck-cost-intro */}
          <img src={bckCostIntro} alt="" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center center',
          }} />
          {/* Overlay mínimo solo para legibilidad */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(243,242,237,0.15)' }} />
          {/* Palmeras atardecer — solo izquierda */}
          <img src={palmerasAtardecer} alt="" style={{
            position: 'absolute', top: -10, left: -20, width: 210,
            opacity: 0.95, pointerEvents: 'none',
            transformOrigin: 'top left',
            animation: 'windLeft 6s ease-in-out infinite',
          }} />

          {/* Arrow scroll hint */}
          <div style={{
            position: 'absolute', bottom: 28, left: 0, right: 0,
            display: 'flex', justifyContent: 'center', zIndex: 3, pointerEvents: 'none',
          }}>
            <svg width="22" height="32" viewBox="0 0 22 32" fill="none"
              style={{ animation: 'arrowBounce 1.8s ease-in-out infinite', opacity: 0.55 }}>
              <path d="M11 1 L11 25" stroke="#8B7355" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M4 18 L11 26 L18 18" stroke="#8B7355" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div style={{
            position: 'relative', zIndex: 2, textAlign: 'center',
            padding: '0 40px', display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <svg width="100" height="12" viewBox="0 0 100 12" style={{ marginBottom: 28 }}>
              <line x1="0" y1="6" x2="42" y2="6" stroke="#8B6E4E" strokeWidth="0.8" opacity="0.6"/>
              <circle cx="50" cy="6" r="3" fill="none" stroke="#8B6E4E" strokeWidth="0.8" opacity="0.8"/>
              <line x1="58" y1="6" x2="100" y2="6" stroke="#8B6E4E" strokeWidth="0.8" opacity="0.6"/>
            </svg>
            {['Isabella Caicedo', 'Torres'].map(t => (
              <p key={t} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontSize: 30, lineHeight: 1.15, color: '#1A2B38', margin: 0 }}>{t}</p>
            ))}
            <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 52, color: '#8B6E4E', lineHeight: 1, margin: '10px 0' }}>&</p>
            {['Andrés Felipe Cañon', 'Arango'].map(t => (
              <p key={t} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontSize: 30, lineHeight: 1.15, color: '#1A2B38', margin: 0 }}>{t}</p>
            ))}
            <div style={{ width: 40, height: 1, background: '#8B6E4E', opacity: 0.5, margin: '28px 0' }} />
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#0D1E2C', margin: '0 0 6px', fontVariantNumeric: 'tabular-nums' }}>Sábado · 30 de Mayo 2027</p>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 14, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#2A3D4E', margin: 0, fontWeight: 600 }}>Santa Marta</p>
            <svg width="100" height="12" viewBox="0 0 100 12" style={{ marginTop: 28 }}>
              <line x1="0" y1="6" x2="42" y2="6" stroke="#8B6E4E" strokeWidth="0.8" opacity="0.6"/>
              <circle cx="50" cy="6" r="3" fill="none" stroke="#8B6E4E" strokeWidth="0.8" opacity="0.8"/>
              <line x1="58" y1="6" x2="100" y2="6" stroke="#8B6E4E" strokeWidth="0.8" opacity="0.6"/>
            </svg>
          </div>
        </section>

        {/* ── Pantalla 3: Bendición ── */}
        <section style={{
          position: 'relative', width: '100%', height: '100dvh',
          scrollSnapAlign: 'start', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <div style={{ position: 'absolute', inset: 0, background: '#F3F2ED' }} />
          <img src={fondoPalmeraPNG} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontStyle: 'italic', fontSize: 16, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#5C3D1E', margin: '0 0 26px' }}>Con la bendición de Dios</p>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400, fontStyle: 'italic', fontSize: 30, lineHeight: 1.45, color: '#0D1E2C', margin: 0 }}>
              Los invitamos a celebrar<br />nuestro matrimonio
            </p>
            <svg width="180" height="24" viewBox="0 0 180 24" style={{ margin: '30px 0' }}>
              <line x1="0" y1="12" x2="72" y2="12" stroke="#5C3D1E" strokeWidth="0.9" opacity="0.7"/>
              <path d="M84,12 Q87,6 90,12 Q93,18 96,12" fill="none" stroke="#5C3D1E" strokeWidth="1" opacity="0.9"/>
              <line x1="108" y1="12" x2="180" y2="12" stroke="#5C3D1E" strokeWidth="0.9" opacity="0.7"/>
              <circle cx="76" cy="12" r="2" fill="#5C3D1E" opacity="0.7"/>
              <circle cx="104" cy="12" r="2" fill="#5C3D1E" opacity="0.7"/>
            </svg>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2A3D4E', margin: 0, fontWeight: 600 }}>Isabella &amp; Andrés</p>
          </div>
        </section>

        {/* ── Pantalla 4: Nuestro Día ── */}
        <section style={{
          position: 'relative', width: '100%', height: '100dvh',
          scrollSnapAlign: 'start', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {/* Fondo paisaje costa */}
          <img src={bckPaisaje} alt="" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
          }}/>

          {/* Destellos de agua animados */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
            {/* Rayo 1 — ancho, suave */}
            <div style={{
              position: 'absolute',
              bottom: '18%', left: 0,
              width: '55%', height: '6%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,248,220,0.22) 40%, rgba(255,252,235,0.32) 55%, rgba(255,248,220,0.18) 70%, transparent 100%)',
              filter: 'blur(3px)',
              animation: 'waterShimmer1 7s ease-in-out infinite',
            }}/>
            {/* Rayo 2 — más delgado, distinto timing */}
            <div style={{
              position: 'absolute',
              bottom: '22%', left: 0,
              width: '40%', height: '3%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,252,230,0.18) 35%, rgba(255,255,245,0.28) 55%, rgba(255,252,230,0.14) 72%, transparent 100%)',
              filter: 'blur(2px)',
              animation: 'waterShimmer2 9s ease-in-out infinite 2.4s',
            }}/>
            {/* Rayo 3 — fino, rápido */}
            <div style={{
              position: 'absolute',
              bottom: '20%', left: 0,
              width: '30%', height: '2%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,240,0.15) 40%, rgba(255,255,250,0.25) 55%, transparent 100%)',
              filter: 'blur(1.5px)',
              animation: 'waterShimmer3 11s ease-in-out infinite 5s',
            }}/>
          </div>

          {/* Aves volando cerca de las montañas */}
          <div style={{ position: 'absolute', bottom: '26%', left: '8%', zIndex: 3, pointerEvents: 'none', animation: 'birdFly1 12s ease-in-out infinite' }}>
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
              <path d="M0 4 Q3.5 0 7 4 Q10.5 0 14 4" stroke="rgba(20,12,5,0.92)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          <div style={{ position: 'absolute', bottom: '24%', left: '14%', zIndex: 3, pointerEvents: 'none', animation: 'birdFly2 12s ease-in-out infinite 1.8s' }}>
            <svg width="11" height="6" viewBox="0 0 14 8" fill="none">
              <path d="M0 4 Q3.5 0 7 4 Q10.5 0 14 4" stroke="rgba(20,12,5,0.85)" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
            </svg>
          </div>

          {/* Hoja superior derecha */}
          <div style={{
            position: 'absolute', top: -10, right: -130, width: 260,
            pointerEvents: 'none', zIndex: 2,
            transformOrigin: 'top right',
            animation: 'windRight 16s ease-in-out infinite',
          }}>
            <img src={hojaIzq} alt="" style={{ width: '100%', opacity: 0.92, display: 'block', transform: 'scaleX(-1)' }}/>
          </div>
          {/* Hoja inferior izquierda */}
          <div style={{
            position: 'absolute', bottom: '16%', left: -160, width: 190,
            pointerEvents: 'none', zIndex: 2,
            transformOrigin: 'bottom left',
            animation: 'windLeft 18s ease-in-out infinite',
          }}>
            <img src={hojaDer} alt="" style={{ width: '100%', opacity: 0.90, display: 'block', transform: 'scaleX(-1)' }}/>
          </div>

          {/* Contenido */}
          <div style={{
            position: 'relative', zIndex: 3, width: '100%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', padding: '0 44px',
            marginTop: '-55px',
          }}>
            {/* Título */}
            <p style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 24, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#2A1A0E', margin: '0 0 6px', fontWeight: 700,
              whiteSpace: 'nowrap',
            }}>Nuestro Día</p>
            {/* Línea separadora */}
            <div style={{ width: 70, height: 1, background: '#8B6840', opacity: 0.6, marginBottom: 18 }}/>

            {/* Evento 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 0 }}>
              {/* Icono iglesia con hojas botánicas */}
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" style={{ marginBottom: 6 }}>
                <path d="M20 3 L20 8" stroke="#7A5C2E" strokeWidth="1.4" strokeLinecap="round"/>
                <path d="M17 5.5 L23 5.5" stroke="#7A5C2E" strokeWidth="1.4" strokeLinecap="round"/>
                <rect x="8" y="18" width="24" height="18" rx="0.5" stroke="#7A5C2E" strokeWidth="1.2" fill="none"/>
                <path d="M12 18 L12 12 Q20 7 28 12 L28 18" stroke="#7A5C2E" strokeWidth="1.2" fill="none"/>
                <rect x="15" y="26" width="10" height="10" rx="0.5" stroke="#7A5C2E" strokeWidth="1" fill="none"/>
              </svg>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, letterSpacing: '0.04em', color: '#2A1A0E', margin: '0 0 1px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontFeatureSettings: '"tnum"' }}>3:00 PM</p>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#2A1A0E', margin: '0 0 3px', fontWeight: 600 }}>Ceremonia</p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: 14, color: '#4A2E10', margin: 0, fontWeight: 500 }}>Capilla Privada Los Alcatraces</p>
            </div>

            {/* Línea conector */}
            <div style={{ width: 1, height: 14, background: 'rgba(107,80,56,0.35)', margin: '8px 0' }}/>

            {/* Evento 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Copa cocktail con rama olivo */}
              <svg width="36" height="36" viewBox="0 0 40 44" fill="none" style={{ marginBottom: 6 }}>
                <path d="M10 8 L30 8 L22 22 L22 32 L18 32 L18 22 Z" stroke="#7A5C2E" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
                <path d="M13 38 L27 38" stroke="#7A5C2E" strokeWidth="1.3" strokeLinecap="round"/>
                <circle cx="27" cy="13" r="2.5" stroke="#7A5C2E" strokeWidth="1" fill="none"/>
              </svg>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, letterSpacing: '0.04em', color: '#2A1A0E', margin: '0 0 1px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontFeatureSettings: '"tnum"' }}>5:00 PM</p>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#2A1A0E', margin: '0 0 3px', fontWeight: 600 }}>Cóctel</p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: 14, color: '#4A2E10', margin: 0, fontWeight: 500 }}>Mamancana Reserva Natural</p>
            </div>

            {/* Línea conector */}
            <div style={{ width: 1, height: 14, background: 'rgba(107,80,56,0.35)', margin: '8px 0' }}/>

            {/* Evento 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Cubiertos con hojas */}
              <svg width="36" height="36" viewBox="0 0 40 44" fill="none" style={{ marginBottom: 6 }}>
                <path d="M16 6 L16 38" stroke="#7A5C2E" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M13 6 L13 18 Q16 21 19 18 L19 6" stroke="#7A5C2E" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
                <path d="M26 6 L26 38" stroke="#7A5C2E" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M24 6 Q28 10 26 18" stroke="#7A5C2E" strokeWidth="1" fill="none" strokeLinecap="round"/>
              </svg>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, letterSpacing: '0.04em', color: '#2A1A0E', margin: '0 0 1px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontFeatureSettings: '"tnum"' }}>7:00 PM</p>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#2A1A0E', margin: '0 0 3px', fontWeight: 600 }}>Cena &amp; Celebración</p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: 14, color: '#4A2E10', margin: 0, fontWeight: 500 }}>Mamancana Reserva Natural</p>
            </div>

            {/* Ornamento final */}
            <svg width="44" height="14" viewBox="0 0 50 18" style={{ margin: '10px 0 6px', opacity: 0.55 }}>
              <path d="M6 9 Q12 3 18 9 Q24 15 30 9 Q36 3 42 9" fill="none" stroke="#7A5C2E" strokeWidth="1.1" strokeLinecap="round"/>
            </svg>

            {/* Santa Marta */}
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase',
              color: '#1A0E05', margin: 0, fontWeight: 600,
              background: 'rgba(255,255,255,0.90)',
              padding: '4px 14px', borderRadius: 20,
            }}>Santa Marta, Colombia</p>
          </div>
        </section>

        {/* ── Pantalla 5: Información Útil ── */}
        <section style={{
          position: 'relative', width: '100%', height: '100dvh',
          scrollSnapAlign: 'start', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {/* Fondo */}
          <img src={fondoPalmera} alt="" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          }}/>
          {/* Overlay suave para legibilidad */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(250,245,237,0.45)' }}/>
          {/* Hoja relieve esquina inferior derecha */}
          <img src={hojaRelieve} alt="" style={{
            position: 'absolute', bottom: -20, right: -20, width: 200,
            opacity: 0.40, pointerEvents: 'none', zIndex: 1,
            transformOrigin: 'bottom right', animation: 'windRight 14s ease-in-out infinite',
          }}/>
          {/* Hoja relieve esquina superior izquierda */}
          <img src={hojaRelieve} alt="" style={{
            position: 'absolute', top: -20, left: -20, width: 170,
            opacity: 0.30, pointerEvents: 'none', zIndex: 1,
            transform: 'rotate(180deg)', transformOrigin: 'top left',
            animation: 'windLeft 16s ease-in-out infinite',
          }}/>

          <div style={{
            position: 'relative', zIndex: 2, width: '100%', maxWidth: 400,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '0 28px', gap: 20,
          }}>

            {/* Título principal */}
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 24, letterSpacing: '0.16em', textTransform: 'uppercase',
                color: '#1A0E05', margin: '0 0 8px', fontWeight: 700,
              }}>Información Útil</p>
              <div style={{ width: 50, height: 1.5, background: '#8B6840', opacity: 0.6, margin: '0 auto' }}/>
            </div>

            {/* Tarjetas ubicaciones */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { key: 'ceremonia', label: 'Ceremonia', lugar: 'Capilla Privada Los Alcatraces', ciudad: 'Santa Marta, Colombia',
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF8EE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22V10l9-8 9 8v12"/><path d="M9 22V12h6v10"/><path d="M12 2v3"/><circle cx="12" cy="3.5" r="1" fill="#FFF8EE" stroke="none"/></svg> },
                { key: 'recepcion', label: 'Recepción', lugar: 'Mamancana Reserva Natural', ciudad: 'Santa Marta, Colombia',
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF8EE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg> },
              ].map((item) => (
                <div key={item.key} style={{
                  background: 'rgba(255,252,247,0.88)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(139,104,64,0.25)', borderRadius: 14,
                  padding: '14px 18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg,#C8956C,#8B6030)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{item.icon}</div>
                    <div>
                      <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B6840', margin: '0 0 2px', fontWeight: 700 }}>{item.label}</p>
                      <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 15, color: '#1A0E05', margin: '0 0 1px', fontWeight: 600, lineHeight: 1.2 }}>{item.lugar}</p>
                      <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontStyle: 'italic', fontSize: 12, color: '#7A5C38', margin: 0 }}>{item.ciudad}</p>
                    </div>
                  </div>
                  <button onClick={() => onLocation(LOCATIONS[item.key])} style={{
                    background: '#2A1A0E', border: 'none', borderRadius: 50, cursor: 'pointer',
                    padding: '7px 14px', flexShrink: 0,
                    fontFamily: "'Montserrat',sans-serif", fontSize: 9, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: '#F4EFE5', fontWeight: 600,
                  }}>Ver mapa</button>
                </div>
              ))}
            </div>

            {/* Traslados */}
            <div style={{
              width: '100%', background: 'rgba(255,252,247,0.80)', backdropFilter: 'blur(6px)',
              border: '1px solid rgba(139,104,64,0.2)', borderRadius: 14,
              padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg,#C8956C,#8B6030)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF8EE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="22" height="13" rx="2"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/><line x1="1" y1="11" x2="23" y2="11"/></svg>
              </div>
              <div>
                <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B6840', margin: '0 0 3px', fontWeight: 700 }}>Traslados</p>
                <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 14, color: '#2A1A0E', margin: 0, lineHeight: 1.5 }}>Transporte disponible desde la capilla hasta Mamancana.</p>
              </div>
            </div>

            {/* RSVP */}
            <div style={{ width: '100%', textAlign: 'center' }}>
              <p style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase',
                color: '#2A1A0E', margin: '0 0 12px', fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
              }}>Confirma tu asistencia antes del 12 de diciembre de 2026</p>
              <a href="https://wa.me/573006994495?text=Hola%2C%20confirmo%20mi%20asistencia%20a%20la%20boda%20de%20Isabella%20%26%20Andr%C3%A9s%20%F0%9F%90%A7" target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-block', width: '100%',
                fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontSize: 14, letterSpacing: '0.25em', textTransform: 'uppercase',
                color: '#F4EFE5', textDecoration: 'none', fontWeight: 700,
                background: '#2A1A0E',
                padding: '14px 28px', borderRadius: 50, boxSizing: 'border-box',
                boxShadow: '0 4px 16px rgba(42,26,14,0.25)',
              }}>Confirmar Asistencia</a>
            </div>

          </div>
        </section>

        {/* ── Pantalla Dress Code ── */}
        <section style={{
          position: 'relative', width: '100%', height: '100dvh',
          scrollSnapAlign: 'start', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <div style={{ position: 'absolute', inset: 0, background: '#F3F2ED' }} />
          <img src={fondoPalmeraPNG} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45, pointerEvents: 'none' }} />
          {/* Hoja inferior derecha */}
          <img src={hojaDer} alt="" style={{ position: 'absolute', top: -10, right: -20, width: 220, opacity: 0.55, pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 32px' }}>
            {/* Palmera icono */}
            <svg width="40" height="60" viewBox="0 0 40 60" style={{ marginBottom: 12, opacity: 0.75 }}>
              <line x1="20" y1="58" x2="20" y2="22" stroke="#5C4A2A" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M20,22 Q8,14 2,6 Q10,8 16,18" fill="#6B7F3A" opacity="0.9"/>
              <path d="M20,22 Q32,14 38,6 Q30,8 24,18" fill="#6B7F3A" opacity="0.9"/>
              <path d="M20,22 Q10,10 6,2 Q14,6 18,18" fill="#7A9040" opacity="0.8"/>
              <path d="M20,22 Q30,10 34,2 Q26,6 22,18" fill="#7A9040" opacity="0.8"/>
              <path d="M20,22 Q14,12 12,4 Q18,10 20,20" fill="#8A9F48" opacity="0.7"/>
              <path d="M20,22 Q26,12 28,4 Q22,10 20,20" fill="#8A9F48" opacity="0.7"/>
            </svg>

            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 26, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#1A2B1A', margin: '0 0 10px' }}>Dress Code</p>
            <div style={{ width: 40, height: 1, background: '#8B7355', opacity: 0.6, margin: '0 0 28px' }} />

            {/* Ilustración vestidos */}
            <img src={vestidosBoda} alt="Dress code" style={{ width: 220, maxWidth: '80vw', marginBottom: 18, objectFit: 'contain' }} />

            {/* Labels Mujeres / Hombres */}
            <div style={{ display: 'flex', gap: 40, marginBottom: 20 }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: 18, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3A4A2A', margin: '0 0 3px' }}>Mujeres</p>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontStyle: 'italic', fontSize: 20, color: '#5C4A2A', margin: 0 }}>Vestido largo</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: 18, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3A4A2A', margin: '0 0 3px' }}>Hombres</p>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontStyle: 'italic', fontSize: 20, color: '#5C4A2A', margin: 0 }}>Traje azul sin corbata</p>
              </div>
            </div>

            <div style={{ width: 40, height: 1, background: '#8B7355', opacity: 0.6, margin: '0 0 12px' }} />
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 13, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#3A4A2A', margin: 0 }}>Elegancia Tropical</p>
          </div>
        </section>

        {/* ── Pantalla Lluvia de Sobres ── */}
        <section style={{
          position: 'relative', width: '100%', height: '100dvh',
          scrollSnapAlign: 'start', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          background: '#F7F4EF',
        }}>
          <style>{`
            @keyframes floatEnvelope {
              0%   { transform: translateY(0px) rotate(-4deg); }
              50%  { transform: translateY(-14px) rotate(4deg); }
              100% { transform: translateY(0px) rotate(-4deg); }
            }
            @keyframes sparkle {
              0%, 100% { opacity: 0; transform: scale(0.5); }
              50%       { opacity: 1; transform: scale(1.1); }
            }
          `}</style>

          {/* Fondo textura suave */}
          <img src={fondoPalmeraPNG} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 36px', gap: 0 }}>

            {/* Sobre animado */}
            <div style={{ position: 'relative', marginBottom: 32, animation: 'floatEnvelope 4s ease-in-out infinite' }}>
              {/* Destellos */}
              {[[-28, -18], [30, -10], [-20, 26], [28, 22]].map(([x, y], i) => (
                <div key={i} style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#C8956C',
                  transform: `translate(${x}px, ${y}px)`,
                  animation: `sparkle ${1.4 + i * 0.3}s ease-in-out infinite`,
                  animationDelay: `${i * 0.35}s`,
                }} />
              ))}
              <svg width="110" height="82" viewBox="0 0 110 82" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Cuerpo sobre */}
                <rect x="2" y="2" width="106" height="78" rx="7" fill="#F4EFE5" stroke="#C8A87A" strokeWidth="2"/>
                {/* Solapa abierta */}
                <path d="M2 2 L55 46 L108 2" stroke="#C8A87A" strokeWidth="2" fill="none"/>
                <path d="M2 2 Q55 50 108 2 L108 9 Q55 54 2 9 Z" fill="#EAE0CC" stroke="#C8A87A" strokeWidth="1.5"/>
                {/* Triángulo inferior */}
                <path d="M2 80 L55 44 L108 80" fill="#EDE5D6" stroke="#C8A87A" strokeWidth="1.5"/>
                {/* Detalle corazón */}
                <path d="M55 36 C55 36 48 29 48 24.5 C48 21.4 50.7 19 54 20.5 C54.7 20.8 55.3 20.8 56 20.5 C59.3 19 62 21.4 62 24.5 C62 29 55 36 55 36Z" fill="#C8956C" opacity="0.85"/>
              </svg>
            </div>

            {/* Texto */}
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: 'italic', fontSize: 17, color: '#7A5C38',
              lineHeight: 1.7, margin: '0 0 18px', maxWidth: 310,
            }}>
              Tu compañía es el mejor regalo.
            </p>

            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 15, color: '#5C4030',
              lineHeight: 1.65, margin: '0 0 24px', maxWidth: 300,
            }}>
              Para quienes deseen tener un detalle con nosotros, hemos dispuesto una
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
              <div style={{ width: 40, height: 1, background: '#C8A87A', opacity: 0.7 }} />
              <p style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700, fontSize: 22, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: '#2A1A0E', margin: 0,
              }}>Lluvia de Sobres</p>
              <div style={{ width: 40, height: 1, background: '#C8A87A', opacity: 0.7 }} />
            </div>
          </div>
        </section>

        {/* ── Pantalla Pingüinos / Gracias ── */}
        <PenguinsGracias />

        </div>
    </div>
  );
}

/* ── Audio ── */
const MUSIC_SRC = 'https://res.cloudinary.com/ddqbnr9vo/video/upload/v1793132888/Elvis_Presley_Can_t_Help_Falling_In_Love_pigcq2.mp3';
const MUSIC_LABEL = "Can't Help Falling In Love";
const MUSIC_START_SECOND = 0;

let globalAudio: HTMLAudioElement | null = null;
if (typeof window !== 'undefined') {
  const pre = new Audio(MUSIC_SRC);
  pre.preload = 'auto'; pre.load(); pre.loop = true; pre.volume = 0.7;
  globalAudio = pre;
}
let setGlobalPlaying: ((p: boolean) => void) | null = null;
let audioStartInitialized = false;
let userManuallyPaused = false;

function applyStartTime(audio: HTMLAudioElement) {
  if (!audioStartInitialized) {
    try { if (audio.currentTime < 1) audio.currentTime = MUSIC_START_SECOND; audioStartInitialized = true; } catch {}
  }
}

function getAudio(): HTMLAudioElement {
  if (!globalAudio) {
    globalAudio = new Audio(MUSIC_SRC);
    globalAudio.loop = true; globalAudio.volume = 0.7; globalAudio.preload = 'auto';
    globalAudio.addEventListener('loadedmetadata', () => { if (!audioStartInitialized && globalAudio) applyStartTime(globalAudio); });
    globalAudio.addEventListener('canplay', () => { if (!audioStartInitialized && globalAudio) applyStartTime(globalAudio); });
    globalAudio.addEventListener('play',  () => { if (setGlobalPlaying) setGlobalPlaying(true); });
    globalAudio.addEventListener('pause', () => { if (setGlobalPlaying) setGlobalPlaying(false); });
    globalAudio.addEventListener('ended', () => { if (setGlobalPlaying) setGlobalPlaying(false); });
  }
  return globalAudio;
}

function startAudioPlayback() {
  if (userManuallyPaused) return;
  try { const AC = (window as any).AudioContext || (window as any).webkitAudioContext; if (AC) new AC().resume(); } catch {}
  const audio = getAudio();
  applyStartTime(audio);
  audio.play().then(() => { if (setGlobalPlaying) setGlobalPlaying(true); }).catch(() => {});
}

function toggleAudioPlayback(currentlyPlaying: boolean) {
  const audio = getAudio();
  if (currentlyPlaying) {
    userManuallyPaused = true; audio.pause(); if (setGlobalPlaying) setGlobalPlaying(false);
  } else {
    userManuallyPaused = false; applyStartTime(audio);
    audio.play().then(() => { if (setGlobalPlaying) setGlobalPlaying(true); }).catch(() => {});
  }
}

function FixedMusicPlayer({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  const floats = [
    { sym:'♩', off:-8,  anim:'floatUp109', d:'0s'   },
    { sym:'♫', off: 14, anim:'floatUp209', d:'0.8s' },
    { sym:'♪', off:-16, anim:'floatUp309', d:'1.6s' },
    { sym:'♬', off:  8, anim:'floatUp109', d:'2.4s' },
  ];
  return (
    <>
      <style>{`
        @keyframes musicPlayerFadeIn09 {
          from { opacity:0; transform:translateY(14px) scale(0.96); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes floatUp109 { 0%{opacity:0;transform:translateY(0) scale(0.6) rotate(-8deg);} 25%{opacity:0.9;} 100%{opacity:0;transform:translateY(-160px) scale(1.1) rotate(12deg);} }
        @keyframes floatUp209 { 0%{opacity:0;transform:translateY(0) scale(0.6) rotate(10deg);} 25%{opacity:0.9;} 100%{opacity:0;transform:translateY(-170px) scale(1.15) rotate(-14deg);} }
        @keyframes floatUp309 { 0%{opacity:0;transform:translateY(0) scale(0.5);} 25%{opacity:0.9;} 100%{opacity:0;transform:translateY(-180px) scale(1.2) rotate(8deg);} }
        @keyframes vinylSpin09 { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
      `}</style>
      <div style={{
        position:'fixed', bottom:20, left:20, zIndex:900,
        display:'flex', flexDirection:'column', alignItems:'center',
        userSelect:'none', pointerEvents:'none',
        animation:'musicPlayerFadeIn09 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s both',
      }}>
        {/* Notas flotantes — solo cuando suena */}
        {playing && floats.map((n, i) => (
          <span key={i} style={{ position:'absolute', bottom:'100%', left:`calc(50% + ${n.off}px)`, fontSize:17, color:'#9e7b3b', lineHeight:1, pointerEvents:'none', animation:`${n.anim} 3.2s ease-out ${n.d} infinite` }}>{n.sym}</span>
        ))}

        {/* Píldora */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          onTouchEnd={(e) => e.stopPropagation()}
          aria-label={playing ? 'Pausar música' : 'Reproducir música'}
          style={{
            pointerEvents:'auto', cursor:'pointer', outline:'none',
            display:'flex', alignItems:'center', gap:7,
            padding:'7px 15px 7px 10px',
            background:'linear-gradient(rgba(255,255,255,0.96),rgba(252,248,240,0.92))',
            backdropFilter:'blur(10px)',
            border:'1px solid rgba(190,150,80,0.65)',
            borderRadius:28,
            boxShadow:'0 4px 18px rgba(168,125,50,0.22)',
            WebkitTapHighlightColor:'transparent',
          }}
        >
          {/* Disco giratorio */}
          <div style={{
            width:28, height:28, borderRadius:'50%',
            background:'linear-gradient(135deg,#FAF7F0,#EFE7D8)',
            border:'1px solid #9e7b3b',
            display:'flex', alignItems:'center', justifyContent:'center',
            animation: playing ? 'vinylSpin09 8s linear infinite' : 'none',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" fill="#9e7b3b"/>
            </svg>
          </div>

          {/* Texto */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start' }}>
            <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:9.5, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'#1A2B38', lineHeight:1 }}>
              {playing ? 'Pausar' : 'Play'}
            </span>
            <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:10, fontStyle:'italic', color:'#9e7b3b', lineHeight:1.2 }}>
              {MUSIC_LABEL}
            </span>
          </div>
        </button>
      </div>
    </>
  );
}

/* ── App principal ── */
export default function App() {
  // const [envelopeDone] = useState(true);
  const [abierta, setAbierta] = useState(false);
  const [locationModal, setLocationModal] = useState<LocationData | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);

  useEffect(() => {
    setGlobalPlaying = (p: boolean) => setMusicPlaying(p);
    const removeTouchListeners = () => {
      window.removeEventListener('touchstart', onFirstTouch);
      window.removeEventListener('pointerdown', onFirstTouch);
      window.removeEventListener('click', onFirstTouch);
    };
    const onFirstTouch = () => { removeTouchListeners(); if (!userManuallyPaused) startAudioPlayback(); };
    window.addEventListener('touchstart', onFirstTouch, { passive: true });
    window.addEventListener('pointerdown', onFirstTouch, { passive: true });
    window.addEventListener('click', onFirstTouch);
    return () => { setGlobalPlaying = null; removeTouchListeners(); };
  }, []);

  return (
    <>
      <style>{`
        @keyframes floatPlant {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50%       { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes windLeft {
          0%, 100% { transform: rotate(0deg) translateX(0px); }
          35%       { transform: rotate(2deg) translateX(3px); }
          65%       { transform: rotate(-1.5deg) translateX(-2px); }
        }
        @keyframes arrowBounce {
          0%, 100% { transform: translateY(0); opacity: 0.55; }
          50%       { transform: translateY(6px); opacity: 0.85; }
        }
        @keyframes windRight {
          0%, 100% { transform: rotate(0deg) translateX(0px); }
          35%       { transform: rotate(-2deg) translateX(-3px); }
          65%       { transform: rotate(1.5deg) translateX(2px); }
        }
        @keyframes birdFly1 {
          0%   { transform: translateX(-30px) translateY(0px); opacity: 0; }
          5%   { opacity: 0.7; }
          45%  { transform: translateX(160px) translateY(-14px); opacity: 0.7; }
          55%  { transform: translateX(200px) translateY(-10px); opacity: 0.5; }
          100% { transform: translateX(400px) translateY(-20px); opacity: 0; }
        }
        @keyframes birdFly2 {
          0%   { transform: translateX(-30px) translateY(0px); opacity: 0; }
          5%   { opacity: 0.6; }
          45%  { transform: translateX(140px) translateY(-8px); opacity: 0.6; }
          55%  { transform: translateX(180px) translateY(-4px); opacity: 0.4; }
          100% { transform: translateX(380px) translateY(-16px); opacity: 0; }
        }
        @keyframes wingFlap {
          0%, 100% { d: path("M0 3 Q3 0 6 3 Q9 0 12 3"); }
          50%       { d: path("M0 3 Q3 5 6 3 Q9 5 12 3"); }
        }
        @keyframes waterShimmer1 {
          0%   { transform: translateX(-60%) skewX(-8deg); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 0.7; }
          100% { transform: translateX(110%) skewX(-8deg); opacity: 0; }
        }
        @keyframes waterShimmer2 {
          0%   { transform: translateX(-80%) skewX(-12deg); opacity: 0; }
          18%  { opacity: 0.8; }
          82%  { opacity: 0.5; }
          100% { transform: translateX(120%) skewX(-12deg); opacity: 0; }
        }
        @keyframes waterShimmer3 {
          0%   { transform: translateX(-50%) skewX(-6deg); opacity: 0; }
          12%  { opacity: 0.6; }
          88%  { opacity: 0.4; }
          100% { transform: translateX(130%) skewX(-6deg); opacity: 0; }
        }
      `}</style>

      {!abierta && (
        <PortadaScreen onOpen={() => setAbierta(true)} hideControls={false} />
      )}
      {abierta && <Invitacion onLocation={setLocationModal} />}
      <LocationModal location={locationModal} onClose={() => setLocationModal(null)} />
      {abierta && <FixedMusicPlayer playing={musicPlaying} onToggle={() => toggleAudioPlayback(musicPlaying)} />}
    </>
  );
}
