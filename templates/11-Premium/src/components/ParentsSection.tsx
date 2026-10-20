import React from 'react';
import { WeddingData } from '../types';

interface ParentsSectionProps {
  data: WeddingData;
}

export const ParentsSection: React.FC<ParentsSectionProps> = ({ data }) => {
  return (
    <section
      style={{
        padding: '54px 24px',
        textAlign: 'center',
        background: 'transparent',
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
            marginBottom: 10,
          }}
        >
          Nuestras Familias
        </p>

        <h2
          style={{
            fontFamily: 'var(--f-roman)',
            fontSize: 'clamp(24px, 6vw, 30px)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--c-text)',
            lineHeight: 1.35,
            marginBottom: 28,
          }}
        >
          {data.parents.blessingText}
        </h2>

        {/* ── Parents Columns (Sin cajas blancas, directamente sobre el papel verjurado) ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
            marginTop: 18,
          }}
        >
          {/* Padres de la Novia */}
          <div>
            <p
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: 10.5,
                fontWeight: 600,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'var(--c-gold)',
                marginBottom: 8,
              }}
            >
              Padres de la Novia
            </p>
            {data.parents.brideParents.map((name, i) => (
              <p
                key={i}
                style={{
                  fontFamily: 'var(--f-roman)',
                  fontSize: 20,
                  fontWeight: 500,
                  color: 'var(--c-text)',
                  lineHeight: 1.45,
                }}
              >
                {name}
              </p>
            ))}
          </div>

          {/* Divisor ornamental sutil */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              opacity: 0.6,
              margin: '4px 0',
            }}
          >
            <div style={{ width: 28, height: 0.7, backgroundColor: 'var(--c-gold)' }} />
            <span style={{ fontSize: 9, color: 'var(--c-gold)' }}>✦</span>
            <div style={{ width: 28, height: 0.7, backgroundColor: 'var(--c-gold)' }} />
          </div>

          {/* Padres del Novio */}
          <div>
            <p
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: 10.5,
                fontWeight: 600,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'var(--c-gold)',
                marginBottom: 8,
              }}
            >
              Padres del Novio
            </p>
            {data.parents.groomParents.map((name, i) => (
              <p
                key={i}
                style={{
                  fontFamily: 'var(--f-roman)',
                  fontSize: 20,
                  fontWeight: 500,
                  color: 'var(--c-text)',
                  lineHeight: 1.45,
                }}
              >
                {name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
