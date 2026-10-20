import React, { useState } from 'react';
import { WeddingData } from '../types';

interface GiftsSectionProps {
  gifts: WeddingData['gifts'];
}

export const GiftsSection: React.FC<GiftsSectionProps> = ({ gifts }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(gifts.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2600);
  };

  return (
    <section
      style={{
        padding: '54px 20px',
        textAlign: 'center',
        background: 'transparent',
        borderTop: '0.5px solid var(--c-border)',
      }}
    >
      <style>{`
        @keyframes giftFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.04); }
        }
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.25); opacity: 1; }
        }
      `}</style>

      <div
        style={{
          maxWidth: 440,
          margin: '0 auto',
        }}
      >
        {/* Classical Gift Envelope Icon Animado */}
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
            margin: '0 auto 16px',
            boxShadow: '0 4px 14px rgba(120, 95, 60, 0.08)',
            animation: 'giftFloat 3.6s ease-in-out infinite',
            position: 'relative',
          }}
        >
          {/* Corazón flotante */}
          <span
            style={{
              position: 'absolute',
              top: 4,
              right: 10,
              fontSize: 9,
              color: 'var(--c-gold)',
              animation: 'heartPulse 2.4s ease-in-out infinite',
            }}
          >
            ✦
          </span>

          <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
            {/* Sobre con lazo de regalo */}
            <rect x="4" y="10" width="28" height="20" rx="2" fill="#FAF5ED" stroke="#8C6F54" strokeWidth="1.6" />
            <path d="M4 11 L18 21 L32 11" stroke="#8C6F54" strokeWidth="1.6" strokeLinejoin="round" />
            {/* Lazo superior */}
            <path d="M18 10 C15 5 11 6 13 9 C15 11 18 10 18 10 Z" fill="#C59B4B" stroke="#8C6F54" strokeWidth="1.2" />
            <path d="M18 10 C21 5 25 6 23 9 C21 11 18 10 18 10 Z" fill="#C59B4B" stroke="#8C6F54" strokeWidth="1.2" />
            <circle cx="18" cy="10" r="1.5" fill="#8C6F54" />
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
          Mesa de Regalos
        </p>

        <h3
          style={{
            fontFamily: 'var(--f-roman)',
            fontSize: 26,
            fontWeight: 600,
            color: 'var(--c-text)',
            marginBottom: 12,
          }}
        >
          {gifts.title}
        </h3>

        <p
          style={{
            fontFamily: 'var(--f-body)',
            fontSize: 14,
            color: 'var(--c-muted)',
            lineHeight: 1.65,
            maxWidth: 320,
            margin: '0 auto 24px',
          }}
        >
          {gifts.description}
        </p>

        {/* Bank Details Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.45)',
            border: '1px solid rgba(160, 130, 74, 0.35)',
            borderRadius: 4,
            padding: '20px 16px',
            textAlign: 'center',
            marginBottom: 22,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--c-text)',
              marginBottom: 4,
            }}
          >
            {gifts.bankName}
          </p>
          <p
            style={{
              fontFamily: 'var(--f-body)',
              fontSize: 12.5,
              color: 'var(--c-muted)',
              marginBottom: 4,
            }}
          >
            {gifts.accountType}
          </p>
          <p
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--c-gold)',
              letterSpacing: '0.12em',
              margin: '8px 0',
            }}
          >
            {gifts.accountNumber}
          </p>
          <p
            style={{
              fontFamily: 'var(--f-body)',
              fontSize: 12,
              color: 'var(--c-muted)',
            }}
          >
            Titular: <strong style={{ color: 'var(--c-text)' }}>{gifts.accountHolder}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '11px 26px',
            background: copied
              ? 'linear-gradient(135deg, #5B7A45 0%, #445D33 100%)'
              : 'linear-gradient(135deg, #C8A25D 0%, #A87D32 50%, #8C6422 100%)',
            border: copied
              ? '1px solid rgba(180, 220, 160, 0.6)'
              : '1px solid rgba(255, 235, 180, 0.75)',
            color: '#FFFFFF',
            borderRadius: 24,
            fontFamily: 'var(--f-display)',
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            boxShadow: '0 4px 16px rgba(168, 125, 50, 0.35)',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>{copied ? '¡Copiado!' : 'Copiar Cuenta'}</span>
        </button>
      </div>
    </section>
  );
};
