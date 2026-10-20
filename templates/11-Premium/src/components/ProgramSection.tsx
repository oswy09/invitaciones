import React, { useState, useEffect, useRef } from 'react';
import { WeddingData, ProgramItem } from '../types';

interface ProgramSectionProps {
  program: WeddingData['program'];
}

interface ProgramMomentProps {
  item: ProgramItem;
  index: number;
  isLast: boolean;
}

const renderProgramIcon = (icon: ProgramItem['icon']) => {
  switch (icon) {
    case 'welcome':
      return (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none" style={{ animation: 'iconGentleFloat 3.2s ease-in-out infinite' }}>
          <path d="M8 8h16c0 6.5-3.5 10-8 10S8 14.5 8 8z" stroke="#9E7B3B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="rgba(200, 162, 93, 0.12)" />
          <line x1="16" y1="18" x2="16" y2="26" stroke="#9E7B3B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10.5" y1="26" x2="21.5" y2="26" stroke="#9E7B3B" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M9.5 11.5c2 1 11 1 13 0" stroke="#C8A25D" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="21" y1="5.5" x2="15.5" y2="13.5" stroke="#7A8E5C" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="17" cy="11.5" r="1.5" fill="#7A8E5C" />
          <circle cx="6.5" cy="8" r="1" fill="#C8A25D" />
          <path d="M26 6.5l.8 1.4 1.5.4-1.3 1 .4 1.6-1.4-1-1.4 1 .4-1.6-1.3-1 1.5-.4z" fill="#C8A25D" opacity="0.85" />
        </svg>
      );
    case 'ceremony':
      return (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none" style={{ animation: 'iconGentleFloat 3.2s ease-in-out infinite 0.4s' }}>
          <circle cx="12" cy="18" r="6.8" stroke="#9E7B3B" strokeWidth="1.6" />
          <circle cx="19.5" cy="18" r="6.8" stroke="#C8A25D" strokeWidth="1.6" />
          <path d="M19.5 7.5l2.4 3.7h-4.8z" fill="#FFFFFF" stroke="#9E7B3B" strokeWidth="1.2" strokeLinejoin="round" />
          <line x1="19.5" y1="3" x2="19.5" y2="5" stroke="#C8A25D" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="16" y1="5.5" x2="17.8" y2="6.3" stroke="#C8A25D" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="23" y1="5.5" x2="21.2" y2="6.3" stroke="#C8A25D" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="19.5" cy="5" r="1" fill="#C8A25D" />
        </svg>
      );
    case 'cocktail':
    case 'toast':
      return (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none" style={{ animation: 'iconGentleFloat 3.2s ease-in-out infinite 0.8s' }}>
          <g transform="rotate(-15 11 16)">
            <path d="M7 8h8l-4 7z" stroke="#9E7B3B" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(200, 162, 93, 0.16)" />
            <line x1="11" y1="15" x2="11" y2="24" stroke="#9E7B3B" strokeWidth="1.5" />
            <line x1="7.5" y1="24" x2="14.5" y2="24" stroke="#9E7B3B" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          <g transform="rotate(15 21 16)">
            <path d="M17 8h8l-4 7z" stroke="#9E7B3B" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(200, 162, 93, 0.16)" />
            <line x1="21" y1="15" x2="21" y2="24" stroke="#9E7B3B" strokeWidth="1.5" />
            <line x1="17.5" y1="24" x2="24.5" y2="24" stroke="#9E7B3B" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          <circle cx="16" cy="9.5" r="1.8" fill="#C8A25D" />
          <line x1="16" y1="5.5" x2="16" y2="7.5" stroke="#C8A25D" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="13" cy="6" r="1" fill="#C8A25D" opacity="0.75" />
          <circle cx="19" cy="6" r="1" fill="#C8A25D" opacity="0.75" />
        </svg>
      );
    case 'dinner':
      return (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none" style={{ animation: 'iconGentleFloat 3.2s ease-in-out infinite 1.2s' }}>
          <path d="M6 21h20c-.8-6.5-4.5-11-10-11S6.8 14.5 6 21z" stroke="#9E7B3B" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(200, 162, 93, 0.14)" />
          <line x1="4" y1="23" x2="28" y2="23" stroke="#9E7B3B" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="16" cy="8" r="2" stroke="#9E7B3B" strokeWidth="1.4" fill="#FAF6EF" />
          <path d="M12.5 5.5c-.8-1.5 1-2.5 0-4" stroke="#C8A25D" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M19.5 5.5c.8-1.5-1-2.5 0-4" stroke="#C8A25D" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'party':
      return (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none" style={{ animation: 'iconGentleFloat 3.2s ease-in-out infinite 1.6s' }}>
          <ellipse cx="9.5" cy="22" rx="3" ry="2.2" fill="#9E7B3B" transform="rotate(-15 9.5 22)" />
          <ellipse cx="19.5" cy="18" rx="3" ry="2.2" fill="#9E7B3B" transform="rotate(-15 19.5 18)" />
          <line x1="12" y1="21" x2="12" y2="9" stroke="#9E7B3B" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="22" y1="17" x2="22" y2="6" stroke="#9E7B3B" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M11.5 9.5l11-3.2v2.8l-11 3.2z" fill="#9E7B3B" />
          <path d="M26 11l.8 1.4 1.5.4-1.3 1 .4 1.6-1.4-1-1.4 1 .4-1.6-1.3-1 1.5-.4z" fill="#C8A25D" />
          <circle cx="6.5" cy="12" r="1.2" fill="#C8A25D" />
          <circle cx="16" cy="4.5" r="1" fill="#C8A25D" />
        </svg>
      );
    default:
      return null;
  }
};

const ProgramMoment: React.FC<ProgramMomentProps> = ({ item, index, isLast }) => {
  const [isVisible, setIsVisible] = useState(false);
  const momentRef = useRef<HTMLDivElement>(null);
  const isLeft = index % 2 === 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
    );

    if (momentRef.current) {
      observer.observe(momentRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={momentRef}
      style={{
        width: '100%',
        maxWidth: 320,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(22px)',
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'opacity, transform',
      }}
    >
      {/* 0. Medallón Artístico con Icono Animado */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 246, 238, 0.85) 100%)',
            border: '1px solid rgba(190, 150, 80, 0.45)',
            boxShadow: '0 4px 14px rgba(160, 125, 60, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: isVisible ? 'itineraryIconGlow 3.5s ease-in-out infinite' : 'none',
          }}
        >
          {renderProgramIcon(item.icon)}
        </div>
      </div>

      {/* 1. Hora en etiqueta fina */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '3px 14px',
          borderRadius: 20,
          background: 'transparent',
          border: '0.5px solid rgba(160, 130, 74, 0.45)',
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 8, color: 'var(--c-gold)' }}>✦</span>
        <span
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: '0.22em',
            color: 'var(--c-gold)',
            textTransform: 'uppercase',
          }}
        >
          {item.time} hrs
        </span>
        <span style={{ fontSize: 8, color: 'var(--c-gold)' }}>✦</span>
      </div>

      {/* 2. Título en dos líneas estilo Villa Clásica */}
      <h3
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(23px, 6vw, 27px)',
          fontWeight: 400,
          color: '#4E3E2E',
          lineHeight: 1.25,
          margin: '0 0 4px',
          letterSpacing: '0.01em',
        }}
      >
        <div>{item.title}</div>
        {item.subtitle && <div>{item.subtitle}</div>}
      </h3>

      {/* 3. Descripción sutil */}
      {item.description && (
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 14.5,
            fontStyle: 'italic',
            color: '#7E6B58',
            lineHeight: 1.45,
            margin: '4px 0 0',
          }}
        >
          {item.description}
        </p>
      )}

      {/* 4. Flecha Curva Orgánica con animación de trazo al aparecer */}
      {!isLast && (
        <div
          style={{
            margin: '14px auto 14px',
            display: 'flex',
            justifyContent: 'center',
            animation: isVisible ? 'arrowPulse 3.6s ease-in-out infinite 1.4s' : 'none',
          }}
        >
          {isLeft ? (
            // Flecha curva descendente hacia la izquierda
            <svg
              viewBox="0 0 120 70"
              width="88"
              height="52"
              style={{ overflow: 'visible', filter: 'drop-shadow(0 1px 2px rgba(80, 60, 30, 0.08))' }}
            >
              <path
                d="M 85 6 C 58 8, 36 24, 28 54"
                fill="none"
                stroke="#9C8168"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeDasharray="100"
                strokeDashoffset={isVisible ? 0 : 100}
                style={{
                  transition: 'stroke-dashoffset 0.95s cubic-bezier(0.25, 1, 0.5, 1) 0.3s',
                }}
              />
              <path
                d="M 23 44 L 28 54 L 37 47"
                fill="none"
                stroke="#9C8168"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="35"
                strokeDashoffset={isVisible ? 0 : 35}
                style={{
                  transition: 'stroke-dashoffset 0.5s cubic-bezier(0.25, 1, 0.5, 1) 0.85s',
                }}
              />
            </svg>
          ) : (
            // Flecha curva descendente hacia la derecha
            <svg
              viewBox="0 0 120 70"
              width="88"
              height="52"
              style={{ overflow: 'visible', filter: 'drop-shadow(0 1px 2px rgba(80, 60, 30, 0.08))' }}
            >
              <path
                d="M 35 6 C 62 8, 84 24, 92 54"
                fill="none"
                stroke="#9C8168"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeDasharray="100"
                strokeDashoffset={isVisible ? 0 : 100}
                style={{
                  transition: 'stroke-dashoffset 0.95s cubic-bezier(0.25, 1, 0.5, 1) 0.3s',
                }}
              />
              <path
                d="M 83 47 L 92 54 L 97 44"
                fill="none"
                stroke="#9C8168"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="35"
                strokeDashoffset={isVisible ? 0 : 35}
                style={{
                  transition: 'stroke-dashoffset 0.5s cubic-bezier(0.25, 1, 0.5, 1) 0.85s',
                }}
              />
            </svg>
          )}
        </div>
      )}
    </div>
  );
};

export const ProgramSection: React.FC<ProgramSectionProps> = ({ program }) => {
  return (
    <section
      style={{
        padding: '60px 20px 70px',
        textAlign: 'center',
        background: 'transparent',
        borderTop: '0.5px solid var(--c-border)',
      }}
    >
      <style>{`
        @keyframes arrowPulse {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(3.5px);
          }
        }
        @keyframes iconGentleFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2.5px);
          }
        }
        @keyframes itineraryIconGlow {
          0%, 100% {
            box-shadow: 0 4px 14px rgba(160, 125, 60, 0.12);
            border-color: rgba(190, 150, 80, 0.45);
          }
          50% {
            box-shadow: 0 6px 18px rgba(160, 125, 60, 0.25);
            border-color: rgba(190, 150, 80, 0.75);
          }
        }
      `}</style>

      <div style={{ maxWidth: 420, margin: '0 auto' }}>
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
            fontSize: 'clamp(28px, 7vw, 36px)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--c-text)',
            marginBottom: 44,
          }}
        >
          Momentos Especiales
        </h2>

        {/* ── Itinerario Artístico con Scroll Reveal y Flechas Animadas ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {program.map((item, index) => (
            <ProgramMoment
              key={index}
              item={item}
              index={index}
              isLast={index === program.length - 1}
            />
          ))}

          {/* Adorno final al terminar el itinerario */}
          <div
            style={{
              marginTop: 26,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              opacity: 0.7,
            }}
          >
            <div style={{ width: 34, height: 0.8, backgroundColor: 'var(--c-gold)' }} />
            <span style={{ color: 'var(--c-gold)', fontSize: 13 }}>✦</span>
            <div style={{ width: 34, height: 0.8, backgroundColor: 'var(--c-gold)' }} />
          </div>
        </div>
      </div>
    </section>
  );
};
