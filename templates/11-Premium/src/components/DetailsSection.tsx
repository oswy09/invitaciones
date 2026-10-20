import React from 'react';
import { WeddingData } from '../types';

interface DetailsSectionProps {
  data: WeddingData;
}

export const DetailsSection: React.FC<DetailsSectionProps> = ({ data }) => {
  return (
    <section
      style={{
        padding: '54px 20px',
        textAlign: 'center',
        background: 'transparent',
      }}
    >
      <style>{`
        @keyframes bellChime {
          0%, 100% { transform: rotate(0deg) scale(1); }
          20% { transform: rotate(6deg) scale(1.04); }
          40% { transform: rotate(-6deg) scale(1.04); }
          60% { transform: rotate(3deg); }
          80% { transform: rotate(-2deg); }
        }
        @keyframes toastClink {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.08) rotate(-4deg); }
          50% { transform: scale(1.08) rotate(4deg); }
          75% { transform: scale(1.02) rotate(-1deg); }
        }
        @keyframes bubbleRise {
          0% { transform: translateY(0) scale(0.6); opacity: 0; }
          40% { opacity: 0.9; }
          100% { transform: translateY(-12px) scale(1.1); opacity: 0; }
        }
      `}</style>

      <div style={{ maxWidth: 440, margin: '0 auto' }}>
        <p
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: 'var(--c-gold)',
            marginBottom: 8,
          }}
        >
          Ceremonia &amp; Fiesta
        </p>

        <h2
          style={{
            fontFamily: 'var(--f-roman)',
            fontSize: 'clamp(26px, 6.5vw, 32px)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--c-text)',
            marginBottom: 32,
          }}
        >
          Dónde &amp; Cuándo
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* ── CARD 1: CEREMONIA ── */}
          <div
            style={{
              position: 'relative',
              background: '#FFFFFF',
              border: '1px solid var(--c-gold-subtle)',
              borderRadius: 4,
              padding: '32px 24px 28px',
              boxShadow: '0 6px 24px rgba(158, 123, 59, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Church / Chapel Arch Icon Animado */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: '#FAF6EF',
                border: '1px solid rgba(160, 130, 74, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                boxShadow: '0 4px 14px rgba(120, 95, 60, 0.08)',
                animation: 'bellChime 4s ease-in-out infinite',
              }}
            >
              <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
                {/* Cruz superior */}
                <line x1="20" y1="4" x2="20" y2="10" stroke="#8C6F54" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="17" y1="6.5" x2="23" y2="6.5" stroke="#8C6F54" strokeWidth="1.8" strokeLinecap="round" />
                {/* Campanario / Cúpula */}
                <path d="M15 14 L20 10 L25 14 L25 18 L15 18 Z" fill="#F4EDE0" stroke="#8C6F54" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="20" cy="15.5" r="1.5" fill="#C59B4B" />
                {/* Fachada de la capilla */}
                <path d="M12 18 L28 18 L32 36 L8 36 Z" fill="#FAF5EB" stroke="#8C6F54" strokeWidth="1.6" strokeLinejoin="round" />
                {/* Portón de medio punto */}
                <path d="M17 36 L17 26 C17 24 23 24 23 26 L23 36 Z" fill="#EBDDC8" stroke="#8C6F54" strokeWidth="1.5" />
                {/* Escalón */}
                <line x1="6" y1="36" x2="34" y2="36" stroke="#8C6F54" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>

            <span
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: 10,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'var(--c-gold)',
                marginBottom: 6,
              }}
            >
              Ceremonia Religiosa
            </span>

            <h3
              style={{
                fontFamily: 'var(--f-roman)',
                fontSize: 24,
                fontWeight: 600,
                color: 'var(--c-text)',
                marginBottom: 6,
              }}
            >
              {data.ceremony.name}
            </h3>

            <p
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--c-gold)',
                letterSpacing: '0.12em',
                marginBottom: 8,
              }}
            >
              {data.ceremony.time}
            </p>

            <p
              style={{
                fontFamily: 'var(--f-body)',
                fontSize: 13.5,
                color: 'var(--c-muted)',
                lineHeight: 1.6,
                maxWidth: 280,
                marginBottom: 20,
              }}
            >
              {data.ceremony.address} · {data.ceremony.city}
            </p>

            <a
              href={data.ceremony.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '11px 24px',
                background: 'linear-gradient(135deg, #C8A25D 0%, #A87D32 50%, #8C6422 100%)',
                border: '1px solid rgba(255, 235, 180, 0.75)',
                borderRadius: 24,
                fontFamily: 'var(--f-display)',
                fontSize: 10.5,
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                boxShadow: '0 4px 16px rgba(168, 125, 50, 0.35)',
                transition: 'all 0.25s ease',
              }}
            >
              <span>Ver Ubicación</span>
              <span>→</span>
            </a>
          </div>

          {/* ── CARD 2: RECEPCIÓN ── */}
          <div
            style={{
              position: 'relative',
              background: '#FFFFFF',
              border: '1px solid var(--c-gold-subtle)',
              borderRadius: 4,
              padding: '32px 24px 28px',
              boxShadow: '0 6px 24px rgba(158, 123, 59, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Champagne Toast Clink Icon Animado */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: '#FAF6EF',
                border: '1px solid rgba(160, 130, 74, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                boxShadow: '0 4px 14px rgba(120, 95, 60, 0.08)',
                position: 'relative',
              }}
            >
              {/* Burbujitas animadas */}
              <span
                style={{
                  position: 'absolute',
                  top: 7,
                  left: 17,
                  width: 3.5,
                  height: 3.5,
                  borderRadius: '50%',
                  background: 'var(--c-gold)',
                  animation: 'bubbleRise 2.4s ease-out infinite',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 17,
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  background: 'var(--c-gold)',
                  animation: 'bubbleRise 2.4s ease-out infinite 1.2s',
                }}
              />

              <div style={{ animation: 'toastClink 3.2s ease-in-out infinite' }}>
                <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                  {/* Copa Izquierda inclinada */}
                  <g transform="rotate(-12 14 20)">
                    <path d="M10 8 L18 8 L16 18 C15.5 21 12.5 21 12 18 Z" fill="#FBF3E4" stroke="#8C6F54" strokeWidth="1.5" strokeLinejoin="round" />
                    <line x1="14" y1="19.5" x2="14" y2="28" stroke="#8C6F54" strokeWidth="1.5" />
                    <line x1="10" y1="28" x2="18" y2="28" stroke="#8C6F54" strokeWidth="1.5" strokeLinecap="round" />
                  </g>
                  {/* Copa Derecha inclinada */}
                  <g transform="rotate(12 22 20)">
                    <path d="M18 8 L26 8 L24 18 C23.5 21 20.5 21 20 18 Z" fill="#FBF3E4" stroke="#8C6F54" strokeWidth="1.5" strokeLinejoin="round" />
                    <line x1="22" y1="19.5" x2="22" y2="28" stroke="#8C6F54" strokeWidth="1.5" />
                    <line x1="18" y1="28" x2="26" y2="28" stroke="#8C6F54" strokeWidth="1.5" strokeLinecap="round" />
                  </g>
                  {/* Destello de choque */}
                  <circle cx="18" cy="11" r="1.5" fill="#C59B4B" />
                </svg>
              </div>
            </div>

            <span
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: 10,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'var(--c-gold)',
                marginBottom: 6,
              }}
            >
              Recepción &amp; Banquete
            </span>

            <h3
              style={{
                fontFamily: 'var(--f-roman)',
                fontSize: 24,
                fontWeight: 600,
                color: 'var(--c-text)',
                marginBottom: 6,
              }}
            >
              {data.reception.name}
            </h3>

            <p
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--c-gold)',
                letterSpacing: '0.12em',
                marginBottom: 8,
              }}
            >
              {data.reception.time}
            </p>

            <p
              style={{
                fontFamily: 'var(--f-body)',
                fontSize: 13.5,
                color: 'var(--c-muted)',
                lineHeight: 1.6,
                maxWidth: 280,
                marginBottom: 20,
              }}
            >
              {data.reception.address} · {data.reception.city}
            </p>

            <a
              href={data.reception.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '11px 24px',
                background: 'linear-gradient(135deg, #C8A25D 0%, #A87D32 50%, #8C6422 100%)',
                border: '1px solid rgba(255, 235, 180, 0.75)',
                borderRadius: 24,
                fontFamily: 'var(--f-display)',
                fontSize: 10.5,
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                boxShadow: '0 4px 16px rgba(168, 125, 50, 0.35)',
                transition: 'all 0.25s ease',
              }}
            >
              <span>Ver Ubicación</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
