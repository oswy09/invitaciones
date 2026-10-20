import React from 'react';

export const FloralWelcome: React.FC = () => {
  // Esferas luminosas doradas ("bolitas flotantes")
  const particles = [
    { x: -75, y: 15, size: 7, dur: 4.2, delay: 0 },
    { x: 65, y: -20, size: 10, dur: 4.8, delay: 0.6 },
    { x: -40, y: -50, size: 8, dur: 5.2, delay: 1.2 },
    { x: 50, y: 40, size: 6, dur: 3.8, delay: 1.8 },
    { x: -90, y: -10, size: 9, dur: 4.5, delay: 2.4 },
    { x: 80, y: 10, size: 11, dur: 5.6, delay: 0.9 },
    { x: 0, y: -65, size: 7, dur: 4.0, delay: 3.1 },
    { x: -30, y: 55, size: 8, dur: 4.6, delay: 1.5 },
  ];

  return (
    <div
      style={{
        position: 'relative',
        padding: '48px 20px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'visible',
      }}
    >
      <style>{`
        @keyframes bouquetFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            filter: drop-shadow(0 8px 18px rgba(120, 95, 60, 0.12));
          }
          50% {
            transform: translateY(-8px) rotate(1.2deg);
            filter: drop-shadow(0 14px 26px rgba(120, 95, 60, 0.18));
          }
        }
        @keyframes orbGlow {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(0.85);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-24px) translateX(6px) scale(1.2);
            opacity: 0.9;
          }
        }
      `}</style>

      {/* Bolitas doradas flotantes */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      >
        {particles.map((p, idx) => (
          <span
            key={idx}
            style={{
              position: 'absolute',
              top: `calc(50% + ${p.y}px)`,
              left: `calc(50% + ${p.x}px)`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(225, 185, 110, 0.95) 0%, rgba(180, 140, 70, 0.45) 60%, transparent 100%)',
              boxShadow: '0 0 10px rgba(225, 185, 110, 0.7)',
              animation: `orbGlow ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Ramo de Boda Artístico con Movimiento y Animación */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          animation: 'bouquetFloat 4.6s ease-in-out infinite',
          maxWidth: 220,
          width: '56%',
          margin: '0 auto',
        }}
      >
        <img
          src="/img/ramo-boda.png"
          alt="Ramo nupcial"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
      </div>

      {/* Delicado adorno de bienvenida */}
      <div
        style={{
          marginTop: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          opacity: 0.75,
        }}
      >
        <div style={{ width: 36, height: 0.8, backgroundColor: 'var(--c-gold)' }} />
        <span style={{ fontSize: 9, color: 'var(--c-gold)' }}>✦</span>
        <div style={{ width: 36, height: 0.8, backgroundColor: 'var(--c-gold)' }} />
      </div>
    </div>
  );
};
