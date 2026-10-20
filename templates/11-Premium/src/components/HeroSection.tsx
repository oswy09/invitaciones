import React from 'react';
import { WeddingData } from '../types';

interface HeroSectionProps {
  data: WeddingData;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 20px 54px',
        textAlign: 'center',
        overflow: 'hidden',
        color: '#FFFFFF',
      }}
    >
      <style>{`
        @keyframes heroKenBurns {
          0% {
            transform: scale(1.02);
          }
          50% {
            transform: scale(1.13);
          }
          100% {
            transform: scale(1.02);
          }
        }
        @keyframes scrollPulse {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(6px); opacity: 1; }
        }
      `}</style>

      {/* ── 1. Imagen de Fondo con Zoom Cinematográfico (Ken Burns) ── */}
      <div
        style={{
          position: 'absolute',
          inset: '-7%',
          backgroundImage: 'url(/img/hero-villa.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          animation: 'heroKenBurns 22s ease-in-out infinite alternate',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      />

      {/* ── 2. Capa / Dark Vignette Overlay ("con esa capa") ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(22, 16, 10, 0.28) 0%, rgba(22, 16, 10, 0.48) 46%, rgba(16, 11, 6, 0.82) 100%)',
          backdropFilter: 'blur(0.4px)',
        }}
      />

      {/* ── 3. Nombres en Tipografía Cursiva Elegante de Boda ── */}
      <div style={{ position: 'relative', zIndex: 2, margin: '20px 0 28px' }}>
        <h1
          style={{
            fontFamily: "'Pinyon Script', 'Great Vibes', cursive",
            fontSize: 'clamp(62px, 17vw, 88px)',
            fontWeight: 400,
            color: '#FFFFFF',
            lineHeight: 1.05,
            margin: 0,
            textShadow: '0 3px 22px rgba(0, 0, 0, 0.8)',
            letterSpacing: '0.01em',
          }}
        >
          {data.couple.bride}
        </h1>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            margin: '4px 0',
          }}
        >
          <div
            style={{
              width: 38,
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(229, 198, 135, 0.8))',
            }}
          />
          <span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 'clamp(28px, 7vw, 36px)',
              fontWeight: 300,
              color: '#E5C687',
              lineHeight: 1,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
            }}
          >
            &amp;
          </span>
          <div
            style={{
              width: 38,
              height: 1,
              background: 'linear-gradient(90deg, rgba(229, 198, 135, 0.8), transparent)',
            }}
          />
        </div>

        <h1
          style={{
            fontFamily: "'Pinyon Script', 'Great Vibes', cursive",
            fontSize: 'clamp(62px, 17vw, 88px)',
            fontWeight: 400,
            color: '#FFFFFF',
            lineHeight: 1.05,
            margin: 0,
            textShadow: '0 3px 22px rgba(0, 0, 0, 0.8)',
            letterSpacing: '0.01em',
          }}
        >
          {data.couple.groom}
        </h1>
      </div>

      {/* ── 4. Frase: "CON TODO NUESTRO AMOR, TE INVITAMOS" ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 260,
          margin: '0 auto 28px',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: '0.28em',
          lineHeight: 1.75,
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.94)',
          textShadow: '0 2px 12px rgba(0, 0, 0, 0.75)',
        }}
      >
        <p style={{ margin: 0 }}>Con todo</p>
        <p style={{ margin: 0 }}>nuestro amor,</p>
        <p style={{ margin: 0 }}>te invitamos</p>
      </div>

      {/* ── 6. Fecha destacada (la dirección se muestra detallada en la sección "Dónde & Cuándo") ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '9px 24px',
          background: 'rgba(25, 18, 12, 0.55)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.35)',
          borderRadius: 30,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          marginBottom: 6,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 11.5,
            fontWeight: 600,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            margin: 0,
          }}
        >
          {data.date.display}
        </p>
      </div>

      {/* ── 7. Indicador sutil de scroll ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          marginTop: 36,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          animation: 'scrollPulse 2.4s ease-in-out infinite',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 9,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.75)',
          }}
        >
          Desliza
        </span>
        <div
          style={{
            width: 1,
            height: 24,
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
          }}
        />
      </div>
    </section>
  );
};
