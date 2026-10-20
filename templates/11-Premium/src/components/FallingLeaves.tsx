import React, { useEffect, useState } from 'react';

interface FallingLeavesProps {
  active?: boolean;
}

export const FallingLeaves: React.FC<FallingLeavesProps> = ({ active = true }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (!active) return;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [active]);

  if (!active) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes tumble1 {
          0% {
            top: -60px;
            left: 12%;
            transform: rotate(0deg) rotateY(0deg) scale(0.9);
            opacity: 0;
          }
          8% {
            opacity: 0.85;
          }
          50% {
            left: 28%;
            transform: rotate(180deg) rotateY(180deg) scale(1);
          }
          90% {
            opacity: 0.85;
          }
          100% {
            top: 105vh;
            left: 8%;
            transform: rotate(380deg) rotateY(360deg) scale(0.85);
            opacity: 0;
          }
        }

        @keyframes tumble2 {
          0% {
            top: -60px;
            left: 82%;
            transform: rotate(45deg) rotateY(0deg) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          50% {
            left: 68%;
            transform: rotate(220deg) rotateY(200deg) scale(0.95);
          }
          90% {
            opacity: 0.8;
          }
          100% {
            top: 105vh;
            left: 88%;
            transform: rotate(410deg) rotateY(360deg) scale(0.75);
            opacity: 0;
          }
        }
      `}</style>

      {/* Hoja 1: Caída orgánica hacia el cuadrante izquierdo */}
      <div
        style={{
          position: 'absolute',
          animation: 'tumble1 13s cubic-bezier(0.37, 0, 0.63, 1) infinite',
          transform: `translateY(${scrollY * 0.08}px)`,
          filter: 'drop-shadow(0 4px 10px rgba(60, 75, 45, 0.16))',
          willChange: 'transform, top, left, opacity',
        }}
      >
        <svg width="22" height="38" viewBox="0 0 24 42" fill="none">
          <path
            d="M12 2 C18 10, 22 22, 17 35 C14 40, 12 41, 12 41 C12 41, 10 40, 7 35 C2 22, 6 10, 12 2 Z"
            fill="url(#leafGrad1)"
            opacity="0.88"
          />
          <path
            d="M12 2 C14 12, 15 22, 12 41"
            stroke="#4A583A"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <path d="M12 14 Q16 12 18 15" stroke="#4A583A" strokeWidth="0.5" strokeLinecap="round" opacity="0.65" />
          <path d="M12 22 Q17 20 18 24" stroke="#4A583A" strokeWidth="0.5" strokeLinecap="round" opacity="0.65" />
          <path d="M12 17 Q8 15 6 18" stroke="#4A583A" strokeWidth="0.5" strokeLinecap="round" opacity="0.65" />
          <path d="M12 26 Q7 25 6 29" stroke="#4A583A" strokeWidth="0.5" strokeLinecap="round" opacity="0.65" />
          <defs>
            <linearGradient id="leafGrad1" x1="12" y1="2" x2="12" y2="41" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#9FB08E" />
              <stop offset="55%" stopColor="#7D906C" />
              <stop offset="100%" stopColor="#556545" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Hoja 2: Caída con desfase hacia el cuadrante derecho */}
      <div
        style={{
          position: 'absolute',
          animation: 'tumble2 15.5s cubic-bezier(0.37, 0, 0.63, 1) infinite 6.5s',
          transform: `translateY(${scrollY * 0.06}px)`,
          filter: 'drop-shadow(0 4px 10px rgba(60, 75, 45, 0.16))',
          willChange: 'transform, top, left, opacity',
        }}
      >
        <svg width="19" height="34" viewBox="0 0 24 42" fill="none">
          <path
            d="M12 2 C18 10, 22 22, 17 35 C14 40, 12 41, 12 41 C12 41, 10 40, 7 35 C2 22, 6 10, 12 2 Z"
            fill="url(#leafGrad2)"
            opacity="0.85"
          />
          <path
            d="M12 2 C14 12, 15 22, 12 41"
            stroke="#4A583A"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          <path d="M12 14 Q16 12 18 15" stroke="#4A583A" strokeWidth="0.5" strokeLinecap="round" opacity="0.65" />
          <path d="M12 22 Q17 20 18 24" stroke="#4A583A" strokeWidth="0.5" strokeLinecap="round" opacity="0.65" />
          <path d="M12 17 Q8 15 6 18" stroke="#4A583A" strokeWidth="0.5" strokeLinecap="round" opacity="0.65" />
          <defs>
            <linearGradient id="leafGrad2" x1="12" y1="2" x2="12" y2="41" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#A8B896" />
              <stop offset="50%" stopColor="#829470" />
              <stop offset="100%" stopColor="#5A6B48" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
