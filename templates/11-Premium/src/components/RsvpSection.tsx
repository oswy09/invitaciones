import React from 'react';
import { WeddingData } from '../types';

interface RsvpSectionProps {
  rsvp: WeddingData['rsvp'];
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({ rsvp }) => {
  const whatsappUrl = `https://wa.me/${rsvp.phone}?text=${encodeURIComponent(rsvp.message)}`;

  return (
    <section
      style={{
        padding: '54px 20px',
        textAlign: 'center',
        background: 'transparent',
      }}
    >
      <style>{`
        @keyframes rsvpSealFloat {
          0%, 100% { transform: scale(1) translateY(0); filter: drop-shadow(0 4px 12px rgba(120, 95, 60, 0.1)); }
          50% { transform: scale(1.05) translateY(-3px); filter: drop-shadow(0 8px 18px rgba(120, 95, 60, 0.18)); }
        }
        @keyframes rsvpStarGlow {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      <div
        style={{
          maxWidth: 440,
          margin: '0 auto',
        }}
      >
        {/* Sello de Lacre RSVP Animado */}
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FAF6EE 0%, #EFE5D4 100%)',
            border: '1.2px solid rgba(160, 130, 74, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            animation: 'rsvpSealFloat 3.4s ease-in-out infinite',
            position: 'relative',
          }}
        >
          {/* Micro destello */}
          <span
            style={{
              position: 'absolute',
              top: 3,
              right: 6,
              fontSize: 8,
              color: 'var(--c-gold)',
              animation: 'rsvpStarGlow 2.5s ease-in-out infinite',
            }}
          >
            ✦
          </span>

          <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
            {/* Corona de laurel fina */}
            <circle cx="18" cy="18" r="14" stroke="#8C6F54" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
            {/* Checkmark elegante */}
            <path
              d="M11 18 L16 23 L25 13"
              stroke="#8C6F54"
              strokeWidth="2.2"
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
          R.S.V.P.
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
          Confirma tu Asistencia
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
          Será un inmenso honor contar con tu presencia en este día tan significativo para nosotros.
        </p>

        <p
          style={{
            fontFamily: 'var(--f-roman)',
            fontSize: 15,
            fontStyle: 'italic',
            color: 'var(--c-text)',
            marginBottom: 28,
          }}
        >
          Por favor confirmar antes del <strong style={{ color: 'var(--c-gold)', fontStyle: 'normal' }}>{rsvp.deadline}</strong>.
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            width: '100%',
            maxWidth: 290,
            padding: '13px 20px',
            background: 'linear-gradient(135deg, #CFA758 0%, #B3862A 50%, #8E651B 100%)',
            border: '1px solid rgba(255, 235, 180, 0.85)',
            color: '#FFFFFF',
            borderRadius: 30,
            fontFamily: 'var(--f-display)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            boxShadow: '0 6px 20px rgba(168, 125, 50, 0.42)',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            transition: 'all 0.25s ease',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.311.045-.698.059-1.146-.086-.339-.109-.769-.267-1.354-.52-2.507-1.084-4.145-3.666-4.27-3.832-.125-.166-1.02-1.356-1.02-2.585 0-1.229.645-1.833.873-2.084.229-.25.499-.313.665-.313.167 0 .333.001.479.008.154.007.361-.058.564.43.208.499.708 1.727.771 1.852.062.125.104.271.021.437-.083.166-.125.27-.249.416-.125.146-.263.326-.376.438-.125.124-.255.259-.11.508.146.25.648 1.07 1.39 1.732.955.852 1.761 1.116 2.01 1.241.25.125.395.104.541-.062.146-.167.624-.728.79-1.019.167-.291.333-.25.562-.166.229.083 1.458.687 1.708.812.25.125.416.187.479.291.062.105.062.604-.082 1.009z" />
          </svg>
          <span>Confirmar por WhatsApp</span>
        </a>
      </div>
    </section>
  );
};
