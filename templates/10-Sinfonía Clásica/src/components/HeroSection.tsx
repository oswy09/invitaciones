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
        padding: '60px 24px 48px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, #FFFFFF 0%, #FAF8F5 65%, #F4EFE6 100%)',
        overflow: 'hidden',
      }}
    >
      {/* ── Subtle Background Damask / Crest Ornament ── */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 380,
          height: 380,
          opacity: 0.05,
          pointerEvents: 'none',
        }}
      >
        <svg viewBox="0 0 200 200" width="100%" height="100%" fill="none" stroke="#231F1C" strokeWidth="0.75">
          <circle cx="100" cy="100" r="90" />
          <circle cx="100" cy="100" r="75" strokeDasharray="3 3" />
          <path d="M100 10 C120 50 150 80 190 100 C150 120 120 150 100 190 C80 150 50 120 10 100 C50 80 80 50 100 10 Z" />
        </svg>
      </div>

      {/* ── Monogram Heraldic Crest ── */}
      <div
        style={{
          position: 'relative',
          width: 86,
          height: 86,
          margin: '0 auto 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Laurel Wreath Circular Border */}
        <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <circle cx="50" cy="50" r="44" fill="none" stroke="var(--c-gold)" strokeWidth="1" opacity="0.6" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="var(--c-gold)" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.8" />
        </svg>
        <span
          style={{
            fontFamily: 'var(--f-script)',
            fontSize: 42,
            color: 'var(--c-gold)',
            lineHeight: 1,
            textShadow: '0 1px 2px rgba(158, 123, 59, 0.15)',
          }}
        >
          {data.couple.monogram}
        </span>
      </div>

      {/* ── Eyebrow Tagline ── */}
      <p
        style={{
          fontFamily: 'var(--f-display)',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.36em',
          textTransform: 'uppercase',
          color: 'var(--c-gold)',
          marginBottom: 14,
        }}
      >
        Nuestra Boda
      </p>

      {/* ── Couple Names in Classical Elegance ── */}
      <h1
        style={{
          fontFamily: 'var(--f-script)',
          fontSize: 'clamp(52px, 14vw, 72px)',
          fontWeight: 400,
          color: 'var(--c-text)',
          lineHeight: 1.08,
          margin: '0 0 4px',
        }}
      >
        {data.couple.bride}
      </h1>

      <span
        style={{
          fontFamily: 'var(--f-roman)',
          fontSize: 'clamp(20px, 5vw, 24px)',
          fontStyle: 'italic',
          color: 'var(--c-gold)',
          display: 'block',
          margin: '6px 0',
        }}
      >
        &amp;
      </span>

      <h1
        style={{
          fontFamily: 'var(--f-script)',
          fontSize: 'clamp(52px, 14vw, 72px)',
          fontWeight: 400,
          color: 'var(--c-text)',
          lineHeight: 1.08,
          margin: '0 0 28px',
        }}
      >
        {data.couple.groom}
      </h1>

      {/* ── Ornamental Divider ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          width: '100%',
          maxWidth: 240,
          margin: '0 auto 28px',
        }}
      >
        <div style={{ flex: 1, height: 0.5, backgroundColor: 'var(--c-border)' }} />
        <span style={{ color: 'var(--c-gold)', fontSize: 10 }}>♦</span>
        <div style={{ flex: 1, height: 0.5, backgroundColor: 'var(--c-border)' }} />
      </div>

      {/* ── Date and Location ── */}
      <p
        style={{
          fontFamily: 'var(--f-display)',
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: 'var(--c-text)',
          marginBottom: 6,
        }}
      >
        {data.date.display}
      </p>

      <p
        style={{
          fontFamily: 'var(--f-roman)',
          fontSize: 16,
          fontStyle: 'italic',
          color: 'var(--c-muted)',
          letterSpacing: '0.04em',
        }}
      >
        {data.ceremony.city}
      </p>

      {/* ── Scroll Indicator ── */}
      <div
        style={{
          marginTop: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          opacity: 0.7,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 9,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--c-muted)',
          }}
        >
          Desliza
        </span>
        <div
          style={{
            width: 1,
            height: 28,
            backgroundColor: 'var(--c-gold)',
            opacity: 0.6,
          }}
        />
      </div>
    </section>
  );
};
