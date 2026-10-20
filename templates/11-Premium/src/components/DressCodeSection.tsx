import React from 'react';
import { WeddingData } from '../types';

interface DressCodeSectionProps {
  dressCode: WeddingData['dressCode'];
}

export const DressCodeSection: React.FC<DressCodeSectionProps> = ({ dressCode }) => {
  return (
    <section
      style={{
        padding: '54px 20px',
        textAlign: 'center',
        background: 'transparent',
      }}
    >
      <style>{`
        @keyframes dressCodeFloat {
          0%, 100% { transform: translateY(0); filter: drop-shadow(0 4px 12px rgba(120, 95, 65, 0.12)); }
          50% { transform: translateY(-5px); filter: drop-shadow(0 8px 18px rgba(120, 95, 65, 0.2)); }
        }
        @keyframes suitBreathe {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.03) translateY(-3px); }
        }
        @keyframes gownSway {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          33% { transform: rotate(-1.5deg) translateY(-2px); }
          66% { transform: rotate(1.5deg) translateY(-3px); }
        }
        @keyframes sparkleGlint {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      <div
        style={{
          maxWidth: 440,
          margin: '0 auto',
          position: 'relative',
        }}
      >
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
          {dressCode.title}
        </p>

        <h2
          style={{
            fontFamily: 'var(--f-roman)',
            fontSize: 'clamp(26px, 6.5vw, 32px)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--c-text)',
            marginBottom: 28,
          }}
        >
          Vestimenta de Gala
        </h2>

        {/* ── TARJETAS INTERACTIVAS CON ICONOS VECTORIALES SVG PUROS (SIN IMÁGENES RASTER) ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 14,
            marginBottom: 24,
          }}
        >
          {/* Tarjeta Caballeros */}
          <div
            style={{
              background: 'transparent',
              border: '1px solid rgba(160, 130, 74, 0.35)',
              borderRadius: 4,
              padding: '20px 12px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {/* Traje Animado */}
            <div style={{ animation: 'suitBreathe 3.4s ease-in-out infinite', marginBottom: 8 }}>
              <svg width="48" height="52" viewBox="0 0 64 64" fill="none">
                <path
                  d="M18 18 L24 10 L40 10 L46 18 L52 46 L44 48 L42 28 L40 54 L24 54 L22 28 L20 48 L12 46 Z"
                  fill="#FAF5ED"
                />
                <path
                  d="M24 10 L18 18 L12 46 L20 48 L22 28"
                  stroke="#8C6F54"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M40 10 L46 18 L52 46 L44 48 L42 28"
                  stroke="#8C6F54"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 28 L24 54 L40 54 L42 28"
                  stroke="#8C6F54"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M24 10 L28 22 L24 28 L32 44 L40 28 L36 22 L40 10"
                  stroke="#8C6F54"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="#FFFFFF"
                />
                <line x1="17" y1="36" x2="22" y2="36" stroke="#8C6F54" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="42" y1="36" x2="47" y2="36" stroke="#8C6F54" strokeWidth="1.5" strokeLinecap="round" />
                <path
                  d="M29 16 L35 18 L35 14 L29 16 Z M35 16 L41 18 L41 14 L35 16 Z"
                  fill="#8C6F54"
                />
              </svg>
            </div>
            <span
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--c-gold)',
                display: 'block',
              }}
            >
              Caballeros
            </span>
            <span
              style={{
                fontFamily: 'var(--f-body)',
                fontSize: 11.5,
                color: 'var(--c-muted)',
                marginTop: 2,
                lineHeight: 1.3,
              }}
            >
              Traje de noche o esmoquin
            </span>
          </div>

          {/* Tarjeta Damas */}
          <div
            style={{
              background: 'transparent',
              border: '1px solid rgba(160, 130, 74, 0.35)',
              borderRadius: 4,
              padding: '20px 12px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {/* Vestido Animado */}
            <div style={{ animation: 'gownSway 3.8s ease-in-out infinite', marginBottom: 8 }}>
              <svg width="44" height="52" viewBox="0 0 54 66" fill="none">
                <path
                  d="M20 8 Q27 12 34 8 L36 22 L33 24 L34 36 Q35 48 40 60 L14 60 Q19 48 20 36 L21 24 L18 22 Z"
                  fill="#FAF1E4"
                />
                <path
                  d="M20 8 C22 4, 26 4, 27 7 C28 4, 32 4, 34 8 L36 22 L18 22 Z"
                  stroke="#8C6F54"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line x1="18" y1="22" x2="36" y2="22" stroke="#8C6F54" strokeWidth="1.8" />
                <path
                  d="M18 22 C16 32, 16 42, 12 60"
                  stroke="#8C6F54"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M36 22 C38 32, 38 42, 42 60"
                  stroke="#8C6F54"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <line x1="12" y1="60" x2="42" y2="60" stroke="#8C6F54" strokeWidth="1.8" strokeLinecap="round" />
                <path
                  d="M27 34 L27 48 L22 60 M27 48 L32 60"
                  stroke="#8C6F54"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--c-gold)',
                display: 'block',
              }}
            >
              Damas
            </span>
            <span
              style={{
                fontFamily: 'var(--f-body)',
                fontSize: 11.5,
                color: 'var(--c-muted)',
                marginTop: 2,
                lineHeight: 1.3,
              }}
            >
              Vestido largo de gala
            </span>
          </div>
        </div>

        <p
          style={{
            fontFamily: 'var(--f-body)',
            fontSize: 13.5,
            color: 'var(--c-muted)',
            lineHeight: 1.6,
            maxWidth: 340,
            margin: '0 auto 14px',
          }}
        >
          {dressCode.description}
        </p>

        {/* Nota especial */}
        <p
          style={{
            fontFamily: 'var(--f-roman)',
            fontSize: 15,
            fontStyle: 'italic',
            color: '#8A583A',
            marginBottom: 22,
          }}
        >
          {dressCode.note}
        </p>

        {/* Paleta de colores */}
        <div style={{ marginTop: 18, borderTop: '0.5px solid var(--c-gold-subtle)', paddingTop: 18 }}>
          <p
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: 9.5,
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--c-gold)',
              marginBottom: 12,
            }}
          >
            Paleta de Inspiración
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
            }}
          >
            {dressCode.colors.map((c, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: c.hex,
                    border: '1.5px solid rgba(255,255,255,0.85)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    transition: 'transform 0.25s ease',
                  }}
                  title={c.name}
                />
                <span
                  style={{
                    fontFamily: 'var(--f-body)',
                    fontSize: 9,
                    color: 'var(--c-muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {c.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
