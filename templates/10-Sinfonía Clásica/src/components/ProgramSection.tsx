import React from 'react';
import { WeddingData } from '../types';

interface ProgramSectionProps {
  program: WeddingData['program'];
}

export const ProgramSection: React.FC<ProgramSectionProps> = ({ program }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'welcome':
        return (
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-14v5l3 3" />
        );
      case 'ceremony':
        return (
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        );
      case 'cocktail':
      case 'toast':
        return (
          <path d="M8 22h8M12 15v7M5 3l7 8 7-8H5z" />
        );
      case 'dinner':
        return (
          <path d="M18 2v20M6 2v6a3 3 0 0 0 6 0V2M9 11v11" />
        );
      case 'party':
        return (
          <path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        );
      default:
        return <circle cx="12" cy="12" r="4" />;
    }
  };

  return (
    <section
      style={{
        padding: '54px 20px',
        textAlign: 'center',
        background: '#FAF8F5',
        borderTop: '0.5px solid var(--c-border)',
      }}
    >
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
          El Itinerario
        </p>

        <h2
          style={{
            fontFamily: 'var(--f-roman)',
            fontSize: 'clamp(26px, 6.5vw, 32px)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--c-text)',
            marginBottom: 36,
          }}
        >
          Momentos Especiales
        </h2>

        {/* ── Timeline ── */}
        <div style={{ position: 'relative', padding: '0 10px' }}>
          {/* Central Vertical Line */}
          <div
            style={{
              position: 'absolute',
              top: 20,
              bottom: 20,
              left: 36,
              width: 1,
              backgroundColor: 'var(--c-gold-subtle)',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {program.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 18,
                  textAlign: 'left',
                  position: 'relative',
                }}
              >
                {/* Timeline Icon Node */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: '1.5px solid var(--c-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(158, 123, 59, 0.12)',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--c-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {getIcon(item.icon)}
                  </svg>
                </div>

                {/* Content Box */}
                <div
                  style={{
                    flex: 1,
                    background: '#FFFFFF',
                    border: '1px solid var(--c-gold-subtle)',
                    borderRadius: 3,
                    padding: '14px 18px',
                    boxShadow: '0 2px 12px rgba(158, 123, 59, 0.05)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--f-display)',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      color: 'var(--c-gold)',
                      display: 'block',
                      marginBottom: 2,
                    }}
                  >
                    {item.time}
                  </span>
                  <h4
                    style={{
                      fontFamily: 'var(--f-roman)',
                      fontSize: 18,
                      fontWeight: 600,
                      color: 'var(--c-text)',
                      marginBottom: 4,
                    }}
                  >
                    {item.title}
                  </h4>
                  <p
                    style={{
                      fontFamily: 'var(--f-body)',
                      fontSize: 13,
                      color: 'var(--c-muted)',
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
