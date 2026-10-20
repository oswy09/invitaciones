import React from 'react';
import { WeddingData } from '../types';

interface FooterSectionProps {
  couple: WeddingData['couple'];
  dateDisplay: string;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ couple, dateDisplay }) => {
  return (
    <footer
      style={{
        padding: '64px 20px 84px',
        textAlign: 'center',
        background: '#FAF8F5',
        borderTop: '0.5px solid var(--c-border)',
      }}
    >
      <div style={{ maxWidth: 380, margin: '0 auto' }}>
        <p
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 10,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: 'var(--c-gold)',
            marginBottom: 16,
          }}
        >
          Con Amor
        </p>

        <h3
          style={{
            fontFamily: 'var(--f-script)',
            fontSize: 'clamp(46px, 11vw, 58px)',
            fontWeight: 400,
            color: 'var(--c-text)',
            lineHeight: 1.15,
            margin: '0 0 10px',
          }}
        >
          {couple.bride} &amp; {couple.groom}
        </h3>

        <p
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 12,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--c-gold)',
            marginBottom: 20,
          }}
        >
          {dateDisplay}
        </p>

        <p
          style={{
            fontFamily: 'var(--f-roman)',
            fontSize: 16,
            fontStyle: 'italic',
            color: 'var(--c-muted)',
            lineHeight: 1.6,
          }}
        >
          Gracias por acompañarnos a celebrar el comienzo de nuestra nueva vida juntos.
        </p>

        {/* Flourish */}
        <div style={{ marginTop: 24, opacity: 0.6 }}>
          <svg width="48" height="18" viewBox="0 0 80 30" fill="none" style={{ margin: '0 auto' }}>
            <path
              d="M10 15 Q40 0 70 15 Q40 30 10 15 Z"
              stroke="var(--c-gold)"
              strokeWidth="0.8"
            />
            <circle cx="40" cy="15" r="2.5" fill="var(--c-gold)" />
          </svg>
        </div>
      </div>
    </footer>
  );
};
