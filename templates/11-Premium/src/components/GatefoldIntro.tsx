import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

interface GatefoldIntroProps {
  children?: React.ReactNode;
  onOpenStart?: () => void;
  onOpenComplete?: () => void;
}

export const GatefoldIntro: React.FC<GatefoldIntroProps> = ({
  children,
  onOpenStart,
  onOpenComplete,
}) => {
  const [hasOpened, setHasOpened] = useState(false);
  const [isOpenFinished, setIsOpenFinished] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const leftShadowRef = useRef<HTMLDivElement>(null);
  const rightShadowRef = useRef<HTMLDivElement>(null);
  const monoRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);

  // 1. Bloquear scroll mientras no haya terminado de abrir
  useEffect(() => {
    if (!isOpenFinished) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpenFinished]);

  // 2. Animación al tocar/clic (una sola vez)
  const handleOpen = () => {
    if (hasOpened) return;
    setHasOpened(true);

    if (onOpenStart) onOpenStart();

    // Comprobar preferencia de reducción de movimiento
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => {
            setIsOpenFinished(true);
            if (onOpenComplete) onOpenComplete();
          },
        });
      }
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpenFinished(true);
        if (onOpenComplete) onOpenComplete();
      },
    });

    // A. El texto de ayuda desaparece al instante
    tl.to(hintRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.25,
      ease: 'power2.out',
    });

    // B. El moño se suelta con suavidad sedosa:
    // Pequeño tirón flotante hacia arriba
    tl.to(
      monoRef.current,
      {
        y: -12,
        scale: 1.025,
        rotation: -1.5,
        duration: 0.35,
        ease: 'sine.out',
      },
      0
    );

    // Descenso suave, elegante y fluido (como seda flotando en el aire)
    tl.to(monoRef.current, {
      y: '115vh',
      rotation: 12,
      opacity: 0,
      duration: 1.4,
      ease: 'power1.inOut',
    });

    // C. Cuando el moño ya va deslizándose (~0.35s después),
    // las dos puertas del sobre se abren hacia afuera en 3D
    tl.to(
      leftDoorRef.current,
      {
        rotateY: -115,
        duration: 1.5,
        ease: 'power2.inOut',
      },
      '-=1.05'
    );

    tl.to(
      rightDoorRef.current,
      {
        rotateY: 115,
        duration: 1.5,
        ease: 'power2.inOut',
      },
      '<'
    );

    // Sombra sutil en el borde interno de cada puerta mientras gira para dar relieve
    tl.to(
      [leftShadowRef.current, rightShadowRef.current],
      {
        opacity: 0.7,
        duration: 0.7,
        ease: 'power1.in',
      },
      '<'
    );

    tl.to(
      [leftShadowRef.current, rightShadowRef.current],
      {
        opacity: 0,
        duration: 0.7,
        ease: 'power1.out',
      },
      '-=0.7'
    );

    // Desvanecer puertas y cortinas al final del giro para revelar limpiamente el contenido
    tl.to(
      [leftDoorRef.current, rightDoorRef.current, leftCurtainRef.current, rightCurtainRef.current],
      {
        opacity: 0,
        duration: 0.35,
        ease: 'power1.out',
      },
      '-=0.25'
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      <style>{`
        @keyframes hintPulse {
          0%, 100% { opacity: 0.9; transform: translate(-50%, 0) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -3px) scale(1.02); }
        }
        @media (min-width: 481px) {
          .gatefold-curtain {
            display: block !important;
          }
        }
      `}</style>

      {/* ── 1. DETRÁS DE TODO: SLOT / CONTENEDOR PARA EL CONTENIDO INTERIOR (OCULTO HASTA TOCAR) ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          minHeight: '100vh',
          opacity: hasOpened ? 1 : 0,
          visibility: hasOpened ? 'visible' : 'hidden',
          transition: 'opacity 0.35s ease-out',
          pointerEvents: isOpenFinished ? 'auto' : 'none',
        }}
      >
        {children}
      </div>

      {/* ── CONTENEDOR DE LA INTRO INTERACTIVA (SOBRE CERRADO INMEDIATO) ── */}
      {!isOpenFinished && (
        <div
          ref={containerRef}
          onClick={handleOpen}
          onTouchEnd={handleOpen}
          role="button"
          tabIndex={0}
          aria-label="Abrir invitación de boda"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 800,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'stretch',
            backgroundColor: 'transparent',
            cursor: hasOpened ? 'default' : 'pointer',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
            pointerEvents: hasOpened ? 'none' : 'auto',
          }}
        >
          {/* Cortina izquierda en pantallas anchas (desktop) para tapar el fondo fuera del contenedor de 480px */}
          <div
            ref={leftCurtainRef}
            className="gatefold-curtain"
            style={{
              flex: 1,
              backgroundColor: '#FAF8F5',
              display: 'none',
              pointerEvents: 'none',
            }}
          />

          {/* ── ESCENARIO 3D DEL SOBRE DOBLE PUERTA (GATEFOLD) QUE TAPA TODO EL FONDO ── */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 480,
              height: '100dvh',
              perspective: '1400px',
              perspectiveOrigin: '50% 50%',
              overflow: 'hidden',
              boxShadow: '0 0 45px rgba(25, 18, 12, 0.2)',
            }}
          >
            {/* ── PUERTA IZQUIERDA (Left Gatefold Door) ── */}
            <div
              ref={leftDoorRef}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: 'calc(50% + 0.5px)',
                overflow: 'hidden',
                transformOrigin: 'left center',
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                zIndex: 5,
                backgroundColor: '#FAF8F5',
                borderRight: '0.5px solid rgba(160, 130, 74, 0.35)',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 'calc(200% - 1px)',
                  height: '100%',
                }}
              >
                <img
                  src="/img/sobre-solo.png"
                  alt="Sobre cerrado"
                  loading="eager"
                  decoding="sync"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center center',
                    display: 'block',
                  }}
                />
              </div>

              {/* Sombra de profundidad en el borde interno mientras gira */}
              <div
                ref={leftShadowRef}
                style={{
                  position: 'absolute',
                  inset: 0,
                  boxShadow: 'inset -25px 0 30px rgba(0, 0, 0, 0.55)',
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              />
            </div>

            {/* ── PUERTA DERECHA (Right Gatefold Door) ── */}
            <div
              ref={rightDoorRef}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '50%',
                width: 'calc(50% + 0.5px)',
                overflow: 'hidden',
                transformOrigin: 'right center',
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                zIndex: 5,
                backgroundColor: '#FAF8F5',
                borderLeft: '0.5px solid rgba(160, 130, 74, 0.35)',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 'calc(200% - 1px)',
                  height: '100%',
                }}
              >
                <img
                  src="/img/sobre-solo.png"
                  alt="Sobre cerrado"
                  loading="eager"
                  decoding="sync"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center center',
                    display: 'block',
                  }}
                />
              </div>

              {/* Sombra de profundidad en el borde interno mientras gira */}
              <div
                ref={rightShadowRef}
                style={{
                  position: 'absolute',
                  inset: 0,
                  boxShadow: 'inset 25px 0 30px rgba(0, 0, 0, 0.55)',
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              />
            </div>

            {/* ── 4. ENCIMA: EL MOÑO (CENTRADOR EXACTO) ── */}
            <div
              ref={monoRef}
              style={{
                position: 'absolute',
                left: 0,
                width: '100%',
                aspectRatio: '1 / 1',
                top: '31%',
                zIndex: 15,
                pointerEvents: 'none',
              }}
            >
              <img
                src="/img/mono-solo.png"
                alt="Moño de seda"
                loading="eager"
                decoding="sync"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 6px 18px rgba(35, 25, 15, 0.28))',
                  display: 'block',
                }}
              />
            </div>

            {/* ── 5. TEXTO "TOCA PARA ABRIR" ENCIMA DEL SOBRE (EN UNA SOLA LÍNEA) ── */}
            <div
              ref={hintRef}
              style={{
                position: 'absolute',
                bottom: '10%',
                left: '50%',
                transform: 'translate(-50%, 0)',
                zIndex: 25,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
                width: 'max-content',
                pointerEvents: 'none',
                animation: 'hintPulse 2.4s ease-in-out infinite',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  flexDirection: 'row',
                  flexWrap: 'nowrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap',
                  width: 'max-content',
                  gap: 10,
                  padding: '11px 26px',
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(252, 248, 240, 0.95) 100%)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1.5px solid rgba(190, 150, 80, 0.65)',
                  borderRadius: 30,
                  boxShadow: '0 4px 22px rgba(168, 125, 50, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                }}
              >
                <span style={{ fontSize: 9, color: 'var(--c-gold, #9E7B3B)', flexShrink: 0 }}>✦</span>
                <span
                  style={{
                    fontFamily: 'var(--f-display, "Cinzel", serif)',
                    fontSize: 11.5,
                    fontWeight: 600,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#24201D',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    display: 'inline-block',
                  }}
                >
                  Toca para abrir
                </span>
                <span style={{ fontSize: 9, color: 'var(--c-gold, #9E7B3B)', flexShrink: 0 }}>✦</span>
              </div>
            </div>
          </div>

          {/* Cortina derecha en pantallas anchas (desktop) */}
          <div
            ref={rightCurtainRef}
            className="gatefold-curtain"
            style={{
              flex: 1,
              backgroundColor: '#FAF8F5',
              display: 'none',
              pointerEvents: 'none',
            }}
          />
        </div>
      )}
    </div>
  );
};
