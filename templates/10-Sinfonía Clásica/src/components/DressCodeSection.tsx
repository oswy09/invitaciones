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
        background: '#FAF8F5',
      }}
    >
      <div
        style={{
          maxWidth: 440,
          margin: '0 auto',
          background: '#FFFFFF',
          border: '1px solid var(--c-gold-subtle)',
          borderRadius: 4,
          padding: '36px 24px',
          boxShadow: '0 6px 24px rgba(158, 123, 59, 0.08)',
          position: 'relative',
        }}
      >
        {/* Subtle bowtie / gown icon */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: '#FAF8F5',
            border: '1px solid var(--c-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 7l8 5-8 5V7zm16 0l-8 5 8 5V7z"
              stroke="var(--c-gold)"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="2" fill="var(--c-gold)" />
          </svg>
        </div>

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

        <h3
          style={{
            fontFamily: 'var(--f-roman)',
            fontSize: 26,
            fontWeight: 600,
            color: 'var(--c-text)',
            marginBottom: 14,
          }}
        >
          {dressCode.subtitle}
        </h3>

        <p
          style={{
            fontFamily: 'var(--f-body)',
            fontSize: 14,
            color: 'var(--c-muted)',
            lineHeight: 1.65,
            maxWidth: 320,
            margin: '0 auto 16px',
          }}
        >
          {dressCode.description}
        </p>

        {/* Note (e.g. evitar el blanco) */}
        <p
          style={{
            fontFamily: 'var(--f-roman)',
            fontSize: 15,
            fontStyle: 'italic',
            color: '#8A583A',
            marginBottom: 24,
          }}
        >
          {dressCode.note}
        </p>

        {/* Color Palette Swatches */}
        <div style={{ marginTop: 20 }}>
          <p
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: 9.5,
              fontWeight: 600,
              letterSpacing: '0.2em',
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
                  }}
                  title={c.name}
                />
                <span
                  style={{
                    fontFamily: 'var(--f-body)',
                    fontSize: 9.5,
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
