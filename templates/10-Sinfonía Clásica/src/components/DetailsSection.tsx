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
            {/* Church / Chapel Arch Icon */}
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
                marginBottom: 16,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2v4M10 4h4M4 22V11l8-5 8 5v11H4zm4-4h8v4H8v-4zm2-6h4v3h-4v-3z"
                  stroke="var(--c-gold)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
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
                padding: '10px 22px',
                background: 'transparent',
                border: '1px solid var(--c-gold)',
                borderRadius: 24,
                fontFamily: 'var(--f-display)',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--c-gold)',
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
            {/* Classical Villa / Reception Toast Icon */}
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
                marginBottom: 16,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M8 22h8M12 15v7M8 4l4-2 4 2v6a4 4 0 0 1-8 0V4z"
                  stroke="var(--c-gold)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
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
                padding: '10px 22px',
                background: 'transparent',
                border: '1px solid var(--c-gold)',
                borderRadius: 24,
                fontFamily: 'var(--f-display)',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--c-gold)',
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
