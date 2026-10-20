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
        background: '#FAF8F5',
        borderTop: '0.5px solid var(--c-border)',
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
        }}
      >
        {/* Classical Gift Envelope Icon */}
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
              d="M3 8l9 6 9-6M3 8v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2"
              stroke="var(--c-gold)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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
            background: '#FAF8F5',
            border: '1px solid var(--c-border)',
            borderRadius: 3,
            padding: '18px 16px',
            textAlign: 'center',
            marginBottom: 20,
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
            background: copied ? '#607350' : 'var(--c-gold)',
            color: '#FFFFFF',
            borderRadius: 24,
            fontFamily: 'var(--f-display)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            boxShadow: '0 3px 12px rgba(158, 123, 59, 0.25)',
            transition: 'background-color 0.25s ease',
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
