import { useState, useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';

export function EnvelopeIntro({ onDone, children }: { onDone: () => void; children?: ReactNode }) {
  const [hasOpened, setHasOpened] = useState(false);
  const [isOpenFinished, setIsOpenFinished] = useState(false);

  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const leftShadowRef = useRef<HTMLDivElement>(null);
  const rightShadowRef = useRef<HTMLDivElement>(null);
  const monoRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);

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

  const handleOpen = () => {
    if (hasOpened) return;
    setHasOpened(true);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsOpenFinished(true);
      onDone();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpenFinished(true);
        onDone();
      },
    });

    tl.to(hintRef.current, { opacity: 0, scale: 0.9, duration: 0.25, ease: 'power2.out' });

    tl.to(monoRef.current, { y: -12, scale: 1.025, rotation: -1.5, duration: 0.35, ease: 'sine.out' }, 0);
    tl.to(monoRef.current, { y: '115vh', rotation: 12, opacity: 0, duration: 1.4, ease: 'power1.inOut' });

    tl.to(leftDoorRef.current, { rotateY: -115, duration: 1.5, ease: 'power2.inOut' }, '-=1.05');
    tl.to(rightDoorRef.current, { rotateY: 115, duration: 1.5, ease: 'power2.inOut' }, '<');

    tl.to([leftShadowRef.current, rightShadowRef.current], { opacity: 0.7, duration: 0.7, ease: 'power1.in' }, '<');
    tl.to([leftShadowRef.current, rightShadowRef.current], { opacity: 0, duration: 0.7, ease: 'power1.out' }, '-=0.7');

    tl.to(
      [leftDoorRef.current, rightDoorRef.current, leftCurtainRef.current, rightCurtainRef.current],
      { opacity: 0, duration: 0.35, ease: 'power1.out' },
      '-=0.25'
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Contenido detrás de las puertas — visible desde el inicio */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', minHeight: '100vh',
        opacity: hasOpened ? 1 : 0,
        transition: 'opacity 0.4s ease-out',
        pointerEvents: isOpenFinished ? 'auto' : 'none',
      }}>
        {children}
      </div>

      <style>{`
        @keyframes hintPulse {
          0%, 100% { opacity: 0.9; transform: translate(-50%, 0) scale(1); }
          50%       { opacity: 1;   transform: translate(-50%, -3px) scale(1.02); }
        }
        @media (min-width: 481px) { .gatefold-curtain { display: block !important; } }
      `}</style>

      {!isOpenFinished && (
        <div
          onClick={handleOpen}
          onTouchEnd={handleOpen}
          role="button" tabIndex={0}
          aria-label="Abrir invitación"
          style={{
            position: 'fixed', inset: 0, zIndex: 800,
            display: 'flex', justifyContent: 'center', alignItems: 'stretch',
            cursor: hasOpened ? 'default' : 'pointer',
            userSelect: 'none', WebkitTapHighlightColor: 'transparent',
            pointerEvents: hasOpened ? 'none' : 'auto',
          }}
        >
          {/* Cortina izquierda desktop */}
          <div ref={leftCurtainRef} className="gatefold-curtain" style={{ flex: 1, backgroundColor: '#F2EDE5', display: 'none', pointerEvents: 'none' }}/>

          {/* Escenario 3D */}
          <div style={{
            position: 'relative', width: '100%', maxWidth: 480,
            height: '100dvh', perspective: '1400px', perspectiveOrigin: '50% 50%',
            overflow: 'hidden', boxShadow: '0 0 45px rgba(25,18,12,0.2)',
          }}>
            {/* Puerta izquierda */}
            <div ref={leftDoorRef} style={{
              position: 'absolute', top: 0, bottom: 0, left: 0,
              width: 'calc(50% + 0.5px)', overflow: 'hidden',
              transformOrigin: 'left center', transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden', zIndex: 5,
              backgroundColor: '#F2EDE5',
              borderRight: '0.5px solid rgba(139,110,78,0.3)',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 'calc(200% - 1px)', height: '100%' }}>
                <img src="/img/sobre-solo.png" alt="" loading="eager" decoding="sync"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}/>
              </div>
              <div ref={leftShadowRef} style={{ position: 'absolute', inset: 0, boxShadow: 'inset -25px 0 30px rgba(0,0,0,0.5)', opacity: 0, pointerEvents: 'none' }}/>
            </div>

            {/* Puerta derecha */}
            <div ref={rightDoorRef} style={{
              position: 'absolute', top: 0, bottom: 0, left: '50%',
              width: 'calc(50% + 0.5px)', overflow: 'hidden',
              transformOrigin: 'right center', transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden', zIndex: 5,
              backgroundColor: '#F2EDE5',
              borderLeft: '0.5px solid rgba(139,110,78,0.3)',
            }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 'calc(200% - 1px)', height: '100%' }}>
                <img src="/img/sobre-solo.png" alt="" loading="eager" decoding="sync"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}/>
              </div>
              <div ref={rightShadowRef} style={{ position: 'absolute', inset: 0, boxShadow: 'inset 25px 0 30px rgba(0,0,0,0.5)', opacity: 0, pointerEvents: 'none' }}/>
            </div>

            {/* Moño */}
            <div ref={monoRef} style={{
              position: 'absolute', left: 0, width: '100%',
              aspectRatio: '1 / 1', top: '31%', zIndex: 15, pointerEvents: 'none',
            }}>
              <img src="/img/mono-solo.png" alt="Moño" loading="eager" decoding="sync"
                style={{ width: '100%', height: '100%', objectFit: 'contain',
                  filter: 'drop-shadow(0 6px 18px rgba(35,25,15,0.28))', display: 'block' }}/>
            </div>

            {/* Hint */}
            <div ref={hintRef} style={{
              position: 'absolute', bottom: '10%', left: '50%',
              transform: 'translate(-50%, 0)', zIndex: 25,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              whiteSpace: 'nowrap', width: 'max-content', pointerEvents: 'none',
              animation: 'hintPulse 2.4s ease-in-out infinite',
            }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '11px 26px',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(252,248,240,0.94) 100%)',
                backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(139,110,78,0.55)',
                borderRadius: 30,
                boxShadow: '0 4px 20px rgba(139,110,78,0.22), inset 0 1px 0 rgba(255,255,255,0.9)',
              }}>
                <span style={{ fontSize: 9, color: '#8B7355' }}>✦</span>
                <span style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 12, fontWeight: 600, letterSpacing: '0.22em',
                  textTransform: 'uppercase', color: '#2A1F14', whiteSpace: 'nowrap',
                }}>Toca para abrir</span>
                <span style={{ fontSize: 9, color: '#8B7355' }}>✦</span>
              </div>
            </div>
          </div>

          {/* Cortina derecha desktop */}
          <div ref={rightCurtainRef} className="gatefold-curtain" style={{ flex: 1, backgroundColor: '#F2EDE5', display: 'none', pointerEvents: 'none' }}/>
        </div>
      )}
    </div>
  );
}
