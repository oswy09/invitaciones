import React, { useState, useRef } from 'react';
import gsap from 'gsap';

interface EnvelopeIntroProps {
  onOpen: () => void;
  onStartAudio: () => void;
  guestName?: string;
  monogram?: string;
  weddingDate?: string;
}

export const EnvelopeIntro: React.FC<EnvelopeIntroProps> = ({
  onOpen,
  onStartAudio,
  guestName = 'Familia & Amigos',
  monogram = 'L & M',
  weddingDate = '19 · 06 · 2027',
}) => {
  const [opened, setOpened] = useState(false);
  const [flapZIndex, setFlapZIndex] = useState(6);
  const containerRef = useRef<HTMLDivElement>(null);
  const fioccoRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const ribbonBandRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    onStartAudio();

    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out overlay softly and reveal the main invitation
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.65,
            ease: 'power2.inOut',
            onComplete: onOpen,
          });
        }
      },
    });

    // 1. Fiocco unties with scale, slight rotation and soft fade
    tl.to(fioccoRef.current, {
      scale: 1.18,
      opacity: 0,
      y: -14,
      duration: 0.5,
      ease: 'back.in(1.4)',
    });

    // 2. Ribbon band fades
    tl.to(
      ribbonBandRef.current,
      {
        opacity: 0,
        scaleY: 0.6,
        duration: 0.35,
        ease: 'power2.out',
      },
      '-=0.25'
    );

    // 3. Top flap opens upwards in 3D
    tl.to(
      flapRef.current,
      {
        rotateX: -180,
        duration: 0.75,
        ease: 'power2.inOut',
        onUpdate: function () {
          // Adjust zIndex halfway through flap rotation so it folds behind
          if (this.progress() > 0.45 && flapZIndex === 6) {
            setFlapZIndex(1);
          }
        },
      },
      '-=0.2'
    );

    // 4. Card rises from within the envelope
    tl.to(
      cardRef.current,
      {
        y: '-58%',
        duration: 0.95,
        ease: 'power3.out',
      },
      '-=0.45'
    );

    // 5. Brief pause to admire the card before transition
    tl.to({}, { duration: 0.6 });
  };

  const ENV_W = 340;
  const ENV_H = 224;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#F5F0E8',
        backgroundImage: `
          radial-gradient(#E8DCBE 0.75px, transparent 0.75px),
          radial-gradient(#E8DCBE 0.75px, #F5F0E8 0.75px)
        `,
        backgroundSize: '30px 30px',
        backgroundPosition: '0 0, 15px 15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        overflow: 'hidden',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <style>{`
        @keyframes subtleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
        @keyframes bowGlow {
          0%, 100% { filter: drop-shadow(0 4px 14px rgba(160, 130, 74, 0.28)); }
          50% { filter: drop-shadow(0 6px 20px rgba(160, 130, 74, 0.48)); }
        }
        @keyframes pulseHint {
          0%, 100% { opacity: 0.85; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-2px); }
        }
      `}</style>

      {/* ── Top Invitation Banner ── */}
      <div
        style={{
          marginBottom: 26,
          textAlign: 'center',
          opacity: opened ? 0 : 1,
          transition: 'opacity 0.35s ease',
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 10,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: 'var(--c-gold)',
            marginBottom: 6,
          }}
        >
          Partecipazione di Nozze
        </p>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 22px',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--c-border)',
            borderRadius: 30,
            boxShadow: '0 4px 18px rgba(158, 123, 59, 0.08)',
          }}
        >
          <span style={{ color: 'var(--c-gold)', fontSize: 13 }}>✦</span>
          <p
            style={{
              fontFamily: 'var(--f-roman)',
              fontSize: 16,
              fontStyle: 'italic',
              color: 'var(--c-text)',
              letterSpacing: '0.04em',
            }}
          >
            Para: <strong style={{ fontWeight: 600, fontStyle: 'normal' }}>{guestName}</strong>
          </p>
          <span style={{ color: 'var(--c-gold)', fontSize: 13 }}>✦</span>
        </div>
      </div>

      {/* ── Interactive Envelope Container ── */}
      <div
        onClick={handleOpen}
        onTouchEnd={handleOpen}
        role="button"
        tabIndex={0}
        aria-label="Abrir invitación de boda"
        style={{
          position: 'relative',
          width: ENV_W,
          height: ENV_H,
          cursor: opened ? 'default' : 'pointer',
          animation: opened ? 'none' : 'subtleFloat 4s ease-in-out infinite',
          perspective: '1200px',
        }}
      >
        {/* Sombra realista bajo el sobre */}
        <div
          style={{
            position: 'absolute',
            bottom: -16,
            left: 20,
            right: 20,
            height: 24,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(80, 60, 30, 0.24) 0%, transparent 72%)',
            pointerEvents: 'none',
          }}
        />

        {/* ══════════ 1. FONDO INTERIOR DEL SOBRE ══════════ */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            backgroundColor: '#EBE2D3',
            borderRadius: 4,
            border: '1px solid #D5C7B0',
            boxShadow: 'inset 0 4px 18px rgba(90, 70, 40, 0.12)',
            overflow: 'hidden',
          }}
        >
          {/* Forro interior con monograma sutil de fondo */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.15,
              fontFamily: 'var(--f-script)',
              fontSize: 88,
              color: 'var(--c-gold)',
            }}
          >
            {monogram}
          </div>
        </div>

        {/* ══════════ 2. CARTA INTERIOR ══════════ */}
        <div
          ref={cardRef}
          style={{
            position: 'absolute',
            left: '6%',
            right: '6%',
            top: '4%',
            height: '92%',
            zIndex: 3,
            backgroundColor: '#FCFAF6',
            borderRadius: 3,
            border: '1px solid #DFD2BC',
            boxShadow: '0 8px 30px rgba(70, 50, 20, 0.16)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 20px',
            transform: 'translateY(0%)',
            transformOrigin: 'center center',
          }}
        >
          {/* Marco calado interior con esquinas clásicas */}
          <div
            style={{
              position: 'absolute',
              inset: 6,
              border: '1px solid rgba(160, 130, 74, 0.45)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 9,
              border: '0.5px solid rgba(160, 130, 74, 0.25)',
              pointerEvents: 'none',
            }}
          />

          {/* Sello / Ornamento superior */}
          <svg width="42" height="18" viewBox="0 0 80 34" fill="none" style={{ opacity: 0.85, marginBottom: 4 }}>
            <path
              d="M40 0 C25 14 8 16 0 17 C8 18 25 20 40 34 C55 20 72 18 80 17 C72 16 55 14 40 0 Z"
              fill="none"
              stroke="#A0824A"
              strokeWidth="1.2"
            />
            <circle cx="40" cy="17" r="3" fill="#A0824A" />
          </svg>

          {/* Monograma en carta */}
          <p
            style={{
              fontFamily: 'var(--f-script)',
              fontSize: 38,
              color: '#8B6A2F',
              lineHeight: 1,
              margin: '2px 0 6px',
              textShadow: '0 1px 1px rgba(255,255,255,0.8)',
            }}
          >
            {monogram}
          </p>

          <p
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: 9,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--c-muted)',
              marginBottom: 4,
            }}
          >
            Salva la Data
          </p>

          <div style={{ width: 28, height: 1, backgroundColor: 'var(--c-gold)', opacity: 0.6, margin: '2px 0' }} />

          <p
            style={{
              fontFamily: 'var(--f-roman)',
              fontSize: 13,
              letterSpacing: '0.18em',
              color: 'var(--c-text)',
              marginTop: 4,
              fontWeight: 500,
            }}
          >
            {weddingDate}
          </p>
        </div>

        {/* ══════════ 3. SOLAPAS LATERALES Y BASE (BUSTA RICAMATA) ══════════ */}
        {/* Solapa izquierda */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '50%',
            zIndex: 4,
            clipPath: 'polygon(0 0, 0 100%, 100% 50%)',
            background: 'linear-gradient(135deg, #FAF7F0 0%, #EDE4D2 100%)',
            boxShadow: 'inset 1px 0 3px rgba(255,255,255,0.6)',
          }}
        />

        {/* Solapa derecha */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '50%',
            zIndex: 4,
            clipPath: 'polygon(100% 0, 100% 100%, 0 50%)',
            background: 'linear-gradient(225deg, #FAF7F0 0%, #EDE4D2 100%)',
            boxShadow: 'inset -1px 0 3px rgba(255,255,255,0.6)',
          }}
        />

        {/* Solapa inferior (bolsillo frontal) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '62%',
            zIndex: 5,
            clipPath: 'polygon(0 100%, 100% 100%, 50% 0)',
            background: 'linear-gradient(180deg, #F8F3E8 0%, #E7DEC9 100%)',
            filter: 'drop-shadow(0 -3px 8px rgba(100, 80, 45, 0.12))',
          }}
        >
          {/* Bordado clásico / Ricamo filigrana en relieve (SVG vector) */}
          <svg
            viewBox="0 0 340 140"
            width="100%"
            height="100%"
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.55,
              pointerEvents: 'none',
            }}
          >
            {/* Cenefa bordada a lo largo del borde triangular */}
            <path
              d="M20 135 L170 12 L320 135"
              fill="none"
              stroke="#A0824A"
              strokeWidth="0.8"
              strokeDasharray="3 3"
            />
            <path
              d="M32 135 L170 24 L308 135"
              fill="none"
              stroke="#A0824A"
              strokeWidth="0.6"
            />
            {/* Arabescos florales en el vértice inferior */}
            <g transform="translate(170, 32) scale(0.65)" stroke="#A0824A" fill="none" strokeWidth="1.2">
              <path d="M0 0 C-15 15 -35 15 -40 30 C-45 45 -25 55 0 70 C25 55 45 45 40 30 C35 15 15 15 0 0 Z" opacity="0.7"/>
              <circle cx="0" cy="35" r="4" fill="#A0824A" />
              <path d="M-20 40 C-10 48 0 52 0 52 C0 52 10 48 20 40" />
            </g>
          </svg>
        </div>

        {/* ══════════ 4. SOLAPA SUPERIOR TRIANGULAR 3D ══════════ */}
        <div
          ref={flapRef}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '66%',
            zIndex: flapZIndex,
            transformOrigin: 'top center',
            transformStyle: 'preserve-3d',
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            background: 'linear-gradient(180deg, #F9F5EC 0%, #ECE0CB 100%)',
            filter: 'drop-shadow(0 4px 10px rgba(80, 60, 30, 0.16))',
          }}
        >
          {/* Detalle bordado solapa superior */}
          <svg
            viewBox="0 0 340 148"
            width="100%"
            height="100%"
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.65,
              pointerEvents: 'none',
            }}
          >
            <path
              d="M15 5 L170 140 L325 5"
              fill="none"
              stroke="#A0824A"
              strokeWidth="0.8"
              strokeDasharray="4 3"
            />
            <path
              d="M28 5 L170 128 L312 5"
              fill="none"
              stroke="#A0824A"
              strokeWidth="0.5"
            />
            {/* Florón bordado vértice solapa */}
            <circle cx="170" cy="115" r="3.5" fill="#A0824A" />
            <path
              d="M160 100 Q170 108 180 100"
              fill="none"
              stroke="#A0824A"
              strokeWidth="0.8"
            />
          </svg>
        </div>

        {/* ══════════ 5. BANDA HORIZONTAL DE CINTA DE SEDA ══════════ */}
        <div
          ref={ribbonBandRef}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '49%',
            transform: 'translateY(-50%)',
            height: 38,
            zIndex: 7,
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F1E8 45%, #EFE9DC 100%)',
            borderTop: '0.8px solid rgba(255, 255, 255, 0.9)',
            borderBottom: '0.8px solid rgba(160, 130, 74, 0.35)',
            boxShadow: '0 3px 12px rgba(80, 60, 30, 0.18)',
            pointerEvents: 'none',
          }}
        >
          {/* Líneas sutiles de costura en los bordes de la cinta */}
          <div
            style={{
              position: 'absolute',
              top: 3,
              left: 0,
              right: 0,
              borderTop: '0.5px dashed rgba(160, 130, 74, 0.4)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 3,
              left: 0,
              right: 0,
              borderTop: '0.5px dashed rgba(160, 130, 74, 0.4)',
            }}
          />
        </div>

        {/* ══════════ 6. EL LAZO DE SEDA BLANCA («FIOCCO BIANCO») ══════════ */}
        <div
          ref={fioccoRef}
          style={{
            position: 'absolute',
            top: '49%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 8,
            width: 140,
            height: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'bowGlow 3s ease-in-out infinite alternate',
            cursor: 'pointer',
          }}
        >
          {/* Lazo vectorial tridimensional (SVG de alta fidelidad) */}
          <svg
            viewBox="0 0 180 140"
            width="140"
            height="110"
            style={{ overflow: 'visible', filter: 'drop-shadow(0 6px 14px rgba(70, 50, 20, 0.25))' }}
          >
            <defs>
              {/* Degradado seda blanca perlada con volumen */}
              <linearGradient id="silkWhite" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#FBF8F2" />
                <stop offset="70%" stopColor="#EDE5D4" />
                <stop offset="100%" stopColor="#E2D6C0" />
              </linearGradient>

              {/* Degradado sombras de pliegue */}
              <linearGradient id="silkShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D5C5AC" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
              </linearGradient>

              {/* Degradado para el nudo central */}
              <radialGradient id="knotGlow" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#F6F0E4" />
                <stop offset="100%" stopColor="#D8C7AD" />
              </radialGradient>
            </defs>

            {/* ── Colas de la cinta que caen (Tails) ── */}
            {/* Cola izquierda */}
            <path
              d="M80 70 C72 90 62 110 44 135 L62 135 C76 112 84 92 88 74 Z"
              fill="url(#silkWhite)"
              stroke="#D5C5AC"
              strokeWidth="0.6"
            />
            {/* Cola derecha */}
            <path
              d="M100 70 C108 90 118 110 136 135 L118 135 C104 112 96 92 92 74 Z"
              fill="url(#silkWhite)"
              stroke="#D5C5AC"
              strokeWidth="0.6"
            />

            {/* ── Bucle Izquierdo (Left Loop) ── */}
            <path
              d="M90 68 C70 42 28 35 14 55 C2 72 26 94 88 74 Z"
              fill="url(#silkWhite)"
              stroke="#D5C5AC"
              strokeWidth="0.8"
            />
            {/* Sombra pliegue bucle izquierdo */}
            <path
              d="M88 68 C64 52 38 48 26 60 C42 66 68 70 88 74 Z"
              fill="url(#silkShadow)"
              opacity="0.6"
            />

            {/* ── Bucle Derecho (Right Loop) ── */}
            <path
              d="M90 68 C110 42 152 35 166 55 C178 72 154 94 92 74 Z"
              fill="url(#silkWhite)"
              stroke="#D5C5AC"
              strokeWidth="0.8"
            />
            {/* Sombra pliegue bucle derecho */}
            <path
              d="M92 68 C116 52 142 48 154 60 C138 66 112 70 92 74 Z"
              fill="url(#silkShadow)"
              opacity="0.6"
            />

            {/* ── Nudo Central del Lazo (Knot) ── */}
            <ellipse
              cx="90"
              cy="70"
              rx="13"
              ry="16"
              fill="url(#knotGlow)"
              stroke="#C9B89D"
              strokeWidth="0.8"
            />
            {/* Líneas de torsión de seda en el nudo */}
            <path
              d="M86 58 Q90 70 86 82"
              fill="none"
              stroke="#BFA988"
              strokeWidth="0.8"
              opacity="0.7"
            />
            <path
              d="M94 58 Q90 70 94 82"
              fill="none"
              stroke="#BFA988"
              strokeWidth="0.8"
              opacity="0.7"
            />
          </svg>
        </div>
      </div>

      {/* ── Bottom Call to Action Hint ── */}
      <div
        style={{
          marginTop: 26,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          opacity: opened ? 0 : 1,
          transition: 'opacity 0.35s ease',
          animation: 'pulseHint 2.4s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 11,
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: 'var(--c-text)',
            fontWeight: 600,
          }}
        >
          Toca el lazo para abrir
        </p>
        <span style={{ fontSize: 13, color: 'var(--c-gold)' }}>↓</span>
      </div>
    </div>
  );
};
