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
        background: '#FAF8F5',
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

        {/* ── Parents Columns ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 28,
            marginTop: 18,
          }}
        >
          {/* Padres de la Novia */}
          <div
            style={{
              padding: '20px 16px',
              background: 'rgba(255, 255, 255, 0.7)',
              border: '1px solid var(--c-gold-subtle)',
              borderRadius: 3,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--c-gold)',
                marginBottom: 12,
              }}
            >
              Padres de la Novia
            </p>
            {data.parents.brideParents.map((name, i) => (
              <p
                key={i}
                style={{
                  fontFamily: 'var(--f-roman)',
                  fontSize: 18,
                  fontWeight: 500,
                  color: 'var(--c-text)',
                  lineHeight: 1.45,
                }}
              >
                {name}
              </p>
            ))}
          </div>

          {/* Padres del Novio */}
          <div
            style={{
              padding: '20px 16px',
              background: 'rgba(255, 255, 255, 0.7)',
              border: '1px solid var(--c-gold-subtle)',
              borderRadius: 3,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--c-gold)',
                marginBottom: 12,
              }}
            >
              Padres del Novio
            </p>
            {data.parents.groomParents.map((name, i) => (
              <p
                key={i}
                style={{
                  fontFamily: 'var(--f-roman)',
                  fontSize: 18,
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
