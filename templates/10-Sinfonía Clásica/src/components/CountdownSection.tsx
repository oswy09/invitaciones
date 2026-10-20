import React, { useState, useEffect } from 'react';

interface CountdownSectionProps {
  targetDate: string;
}

export const CountdownSection: React.FC<CountdownSectionProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(targetDate).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: 'Días', val: timeLeft.days },
    { label: 'Horas', val: timeLeft.hours },
    { label: 'Minutos', val: timeLeft.minutes },
    { label: 'Segundos', val: timeLeft.seconds },
  ];

  return (
    <section
      style={{
        padding: '54px 20px',
        textAlign: 'center',
        background: '#FAF8F5',
        borderTop: '0.5px solid var(--c-border)',
        borderBottom: '0.5px solid var(--c-border)',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--f-display)',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'var(--c-gold)',
          marginBottom: 8,
        }}
      >
        La Cuenta Regresiva
      </p>

      <h2
        style={{
          fontFamily: 'var(--f-roman)',
          fontSize: 'clamp(26px, 6.5vw, 34px)',
          fontWeight: 400,
          fontStyle: 'italic',
          color: 'var(--c-text)',
          marginBottom: 32,
        }}
      >
        Para siempre comienza en...
      </h2>

      {/* ── 4 Classical Countdown Boxes ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10,
          maxWidth: 380,
          margin: '0 auto',
        }}
      >
        {units.map((u, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              background: '#FFFFFF',
              border: '1px solid var(--c-gold-subtle)',
              borderRadius: 3,
              padding: '16px 4px 12px',
              boxShadow: '0 4px 16px rgba(158, 123, 59, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Corner Filigree accents */}
            <div
              style={{
                position: 'absolute',
                top: 3,
                left: 3,
                width: 5,
                height: 5,
                borderTop: '1px solid var(--c-gold)',
                borderLeft: '1px solid var(--c-gold)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 3,
                right: 3,
                width: 5,
                height: 5,
                borderTop: '1px solid var(--c-gold)',
                borderRight: '1px solid var(--c-gold)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 3,
                left: 3,
                width: 5,
                height: 5,
                borderBottom: '1px solid var(--c-gold)',
                borderLeft: '1px solid var(--c-gold)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 3,
                right: 3,
                width: 5,
                height: 5,
                borderBottom: '1px solid var(--c-gold)',
                borderRight: '1px solid var(--c-gold)',
              }}
            />

            <span
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: 'clamp(24px, 6vw, 32px)',
                fontWeight: 600,
                color: 'var(--c-text)',
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {String(u.val).padStart(2, '0')}
            </span>

            <span
              style={{
                fontFamily: 'var(--f-body)',
                fontSize: 9.5,
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--c-muted)',
              }}
            >
              {u.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
