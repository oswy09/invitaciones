import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

const GOLD = '#C9A84C';
const GOLD_LIGHT = '#E8CC7A';

function MarqueeLight({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="w-4 h-4 rounded-full border-2 border-[#8B6914] flex-shrink-0"
      style={{
        background: 'radial-gradient(circle at 35% 35%, #FFF5C0, #E8CC7A 50%, #C9A84C)',
        boxShadow: '0 0 8px 2px rgba(232,204,122,0.8), 0 0 16px 4px rgba(201,168,76,0.78)',
        animation: `marquee-blink 1.4s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}

function MarqueeRow({ count = 10 }: { count?: number }) {
  return (
    <div className="flex justify-between px-2">
      {Array.from({ length: count }).map((_, i) => (
        <MarqueeLight key={i} delay={i * 0.14} />
      ))}
    </div>
  );
}

function FilmStrip() {
  const holes = Array.from({ length: 14 });
  return (
    <div className="flex gap-0 overflow-hidden" style={{ height: 28 }}>
      <div className="flex items-center gap-3 px-2" style={{ minWidth: '200%', animation: 'film-roll 8s linear infinite' }}>
        {holes.concat(holes).map((_, i) => (
          <React.Fragment key={i}>
            <div className="w-4 h-4 rounded-sm border border-[#333] flex-shrink-0" style={{ background: '#1a1a1a' }} />
            <div className="w-12 h-5 flex-shrink-0" style={{ background: '#111', border: '1px solid #222' }} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ── Cinema transition: curtains + countdown ───────────────────────────────────
type TransitionPhase = 'curtains' | 'countdown' | 'flash' | 'done';

function CinemaTransition({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<TransitionPhase>('curtains');
  const [count, setCount] = useState(3);
  const [showFlash, setShowFlash] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('countdown'), 3400);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== 'countdown') return;
    if (count <= 0) {
      // Flash blanco final
      setShowFlash(true);
      setTimeout(() => {
        if (!doneRef.current) { doneRef.current = true; onDone(); }
      }, 400);
      return;
    }
    const t = setTimeout(() => setCount(c => c - 1), 900);
    return () => clearTimeout(t);
  }, [phase, count, onDone]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black">

      {/* ── Flash blanco final ── */}
      {showFlash && (
        <div className="absolute inset-0 bg-white z-50" style={{ animation: 'fade-in-up 0.4s ease-out reverse both' }} />
      )}

      {/* ── Cortinas rojas ── */}
      {phase === 'curtains' && (
        <>
          {/* Left */}
          <div className="curtain-left absolute inset-y-0 left-0 w-1/2 z-20" style={{
            background: 'linear-gradient(105deg, #7A0010 0%, #B80018 35%, #D4001E 55%, #B80018 75%, #7A0010 100%)',
          }}>
            {/* Velvet folds */}
            {[12,24,37,50,63,76,88].map(p => (
              <div key={p} className="absolute inset-y-0" style={{
                left: `${p}%`, width: 1.5,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.1), rgba(0,0,0,0.3))',
              }} />
            ))}
            {/* Glossy sheen */}
            <div className="absolute inset-y-0 left-0 w-12" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.06), transparent)' }} />
            {/* Top valance */}
            <div className="absolute top-0 left-0 right-0" style={{ height: 56, background: 'linear-gradient(180deg,#5A000D 0%,#8B0014 100%)', borderBottom: '3px solid #3D0009', boxShadow: '0 6px 20px rgba(0,0,0,0.6)' }}>
              <div className="absolute bottom-0 left-0 right-0 flex">
                {Array.from({length:8}).map((_,i)=>(
                  <div key={i} className="flex-1" style={{ height: 18, borderRadius: '0 0 50% 50%', background: '#5A000D', margin: '0 1px' }} />
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="curtain-right absolute inset-y-0 right-0 w-1/2 z-20" style={{
            background: 'linear-gradient(255deg, #7A0010 0%, #B80018 35%, #D4001E 55%, #B80018 75%, #7A0010 100%)',
          }}>
            {[12,24,37,50,63,76,88].map(p => (
              <div key={p} className="absolute inset-y-0" style={{
                left: `${p}%`, width: 1.5,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.1), rgba(0,0,0,0.3))',
              }} />
            ))}
            <div className="absolute inset-y-0 right-0 w-12" style={{ background: 'linear-gradient(to left, rgba(255,255,255,0.06), transparent)' }} />
            <div className="absolute top-0 left-0 right-0" style={{ height: 56, background: 'linear-gradient(180deg,#5A000D 0%,#8B0014 100%)', borderBottom: '3px solid #3D0009', boxShadow: '0 6px 20px rgba(0,0,0,0.6)' }}>
              <div className="absolute bottom-0 left-0 right-0 flex">
                {Array.from({length:8}).map((_,i)=>(
                  <div key={i} className="flex-1" style={{ height: 18, borderRadius: '0 0 50% 50%', background: '#5A000D', margin: '0 1px' }} />
                ))}
              </div>
            </div>
          </div>

          {/* Projector beam */}
          <div className="absolute inset-0 flex justify-center pointer-events-none z-10">
            <div style={{ width: 80, background: 'linear-gradient(to bottom, rgba(255,240,180,0.04), transparent)', filter: 'blur(10px)' }} />
          </div>
        </>
      )}

      {/* ── Countdown clásico ── */}
      {phase === 'countdown' && !showFlash && (
        <div className="absolute inset-0 flex items-center justify-center film-flicker">

          {/* Fondo gris plateado con viñeta */}
          <div className="absolute inset-0" style={{ background: '#B8B8B4' }} />
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at center, rgba(200,200,196,0) 30%, rgba(30,30,30,0.72) 100%)',
          }} />

          {/* Film grain */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E")`,
            opacity: 0.7,
            animation: 'noise 0.1s steps(1) infinite',
            mixBlendMode: 'multiply',
          }} />

          {/* Scan line */}
          <div className="absolute left-0 right-0 h-[2px] pointer-events-none" style={{
            background: 'rgba(255,255,255,0.22)',
            animation: 'scan-line 0.09s linear infinite',
          }} />

          {/* Classic crosshair + circles */}
          <div className="relative flex items-center justify-center z-10" style={{ width: 300, height: 300 }}>
            {/* Outer ring */}
            <div className="absolute rounded-full" style={{ width: 282, height: 282, border: '3px solid rgba(255,255,255,0.9)', boxShadow: '0 0 0 1px rgba(0,0,0,0.15)' }} />
            {/* Inner ring */}
            <div className="absolute rounded-full" style={{ width: 218, height: 218, border: '2.5px solid rgba(255,255,255,0.85)' }} />
            {/* Tick marks on outer ring */}
            {Array.from({length:12}).map((_,i) => (
              <div key={i} className="absolute" style={{
                width: 2, height: i%3===0 ? 14 : 8,
                background: 'rgba(255,255,255,0.8)',
                transformOrigin: '1px 141px',
                transform: `rotate(${i*30}deg) translateY(-134px)`,
                top: '50%', left: '50%', marginLeft: -1, marginTop: -141,
              }} />
            ))}
            {/* Horizontal line */}
            <div className="absolute" style={{ width: 296, height: 2, background: 'rgba(255,255,255,0.88)', boxShadow: '0 0 3px rgba(0,0,0,0.2)' }} />
            {/* Vertical line */}
            <div className="absolute" style={{ width: 2, height: 296, background: 'rgba(255,255,255,0.88)', boxShadow: '0 0 3px rgba(0,0,0,0.2)' }} />
            {/* Center small circle */}
            <div className="absolute rounded-full" style={{ width: 36, height: 36, border: '2.5px solid rgba(255,255,255,0.9)' }} />

            {/* Number */}
            <span
              key={count}
              className="countdown-num relative z-20"
              style={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 900,
                fontSize: 110,
                lineHeight: 1,
                color: '#111',
                letterSpacing: '-0.04em',
                userSelect: 'none',
                textShadow: '2px 2px 0 rgba(255,255,255,0.15)',
              }}
            >
              {count}
            </span>
          </div>

          {/* Film perforations */}
          <div className="absolute top-0 left-0 right-0 flex items-center gap-1 px-2" style={{ height: 28, background: '#111' }}>
            {Array.from({length:20}).map((_,i)=>(
              <div key={i} style={{ flex:1, height:16, background:'#B8B8B4', borderRadius:3, opacity:0.9 }} />
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex items-center gap-1 px-2" style={{ height: 28, background: '#111' }}>
            {Array.from({length:20}).map((_,i)=>(
              <div key={i} style={{ flex:1, height:16, background:'#B8B8B4', borderRadius:3, opacity:0.9 }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Animated popcorn box ─────────────────────────────────────────────────────
function PopcornBox() {
  const kernels = [
    { kx: '-18px', ky: '-22px', color: '#F5D76E', delay: '0s' },
    { kx: '14px',  ky: '-26px', color: '#F2C94C', delay: '0.3s' },
    { kx: '-10px', ky: '-28px', color: '#FDE68A', delay: '0.6s' },
    { kx: '20px',  ky: '-20px', color: '#FBBF24', delay: '0.15s' },
    { kx: '6px',   ky: '-30px', color: '#F5D76E', delay: '0.45s' },
  ];
  return (
    <div className="popcorn-bounce" style={{ position: 'relative', width: 44, height: 52, display: 'inline-block' }}>
      {/* Kernels popping out */}
      {kernels.map((k, i) => (
        <div key={i} style={{
          position: 'absolute', top: 4, left: 14,
          width: 10, height: 10, borderRadius: '50%',
          background: k.color,
          // @ts-ignore
          '--kx': k.kx, '--ky': k.ky,
          animation: `kernel-pop 1.4s ease-out ${k.delay} infinite`,
        }} />
      ))}
      {/* Box */}
      <svg width="44" height="48" viewBox="0 0 44 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative', zIndex: 1 }}>
        {/* Box body */}
        <path d="M6 16 L8 44 L36 44 L38 16 Z" fill="#C9A84C" />
        <path d="M6 16 L8 44 L22 44 L22 16 Z" fill="#E8CC7A" />
        {/* Red stripes */}
        <path d="M10 16 L11.5 44 L14 44 L12.5 16 Z" fill="#B80018" opacity="0.8"/>
        <path d="M18 16 L19 44 L21.5 44 L20.5 16 Z" fill="#B80018" opacity="0.8"/>
        <path d="M26 16 L27.5 44 L30 44 L28.5 16 Z" fill="#B80018" opacity="0.8"/>
        <path d="M33 16 L34.5 44 L36 44 L34.5 16 Z" fill="#B80018" opacity="0.6"/>
        {/* Top rim */}
        <rect x="4" y="13" width="36" height="5" rx="2" fill="#8B6914" />
        {/* Popcorn mound */}
        <ellipse cx="12" cy="14" rx="6" ry="5" fill="#FDE68A" />
        <ellipse cx="22" cy="11" rx="7" ry="6" fill="#F5D76E" />
        <ellipse cx="32" cy="14" rx="6" ry="5" fill="#FBBF24" />
        <ellipse cx="17" cy="10" rx="5" ry="4.5" fill="#FEF3C7" />
        <ellipse cx="27" cy="10" rx="5" ry="4.5" fill="#FDE68A" />
      </svg>
    </div>
  );
}

// ── SCREEN 1: Movie Poster ────────────────────────────────────────────────────
function PosterScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0A] p-4">
      {/* Marquee frame */}
      <div
        className="relative w-full max-w-[420px]"
        style={{
          background: 'linear-gradient(145deg, #2A1F0A, #1A1200)',
          borderRadius: 12,
          padding: '12px 10px',
          boxShadow: '0 0 60px rgba(201,168,76,0.25), 0 0 0 3px #6B5020, 0 0 0 5px #2A1F0A',
        }}
      >
        {/* Film strip top */}
        <div className="mb-1" style={{ background: '#111' }}>
          <FilmStrip />
        </div>

        {/* Poster image */}
        <div className="relative overflow-hidden" style={{ borderRadius: 4 }}>
          <img
            src="/images/poster.jpg"
            alt="Nuestra Boda — Estreno del Amor"
            className="w-full block"
            style={{ display: 'block' }}
          />

          {/* Bottom gradient for button area */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '38%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
            }}
          />

          {/* CTA Button */}
          <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-2">
            <button
              onClick={onEnter}
              className="relative overflow-hidden flex items-center gap-2.5 px-7 py-3 rounded-sm transition-transform active:scale-95"
              style={{
                background: `linear-gradient(135deg, #8B6914, ${GOLD}, #E8CC7A, ${GOLD}, #8B6914)`,
                backgroundSize: '300% 100%',
                animation: 'shimmer-gold 3s ease-in-out infinite',
                fontFamily: '"Montserrat", sans-serif',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.34em',
                color: '#1A1200',
                               border: 'none',
                cursor: 'pointer',
                boxShadow: `0 4px 20px rgba(201,168,76,0.85)`,
              }}
            >
              {/* Cinema projector icon */}
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1A1200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                <circle cx="12" cy="12" r="3"/>
                <path d="M3 7h3l2-3h8l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/>
              </svg>
              Ver Invitación
            </button>
            <p
              style={{
                fontFamily: '"Montserrat", sans-serif',
                fontSize: 9,
                letterSpacing: '0.28em',
                color: 'rgba(232,204,122,0.6)',
                             }}
            >
              Toca para acceder
            </p>
          </div>
        </div>

        {/* Film strip bottom */}
        <div className="mt-1" style={{ background: '#111' }}>
          <FilmStrip />
        </div>

        {/* Bottom marquee */}
        <div className="mt-2">
          <MarqueeRow count={12} />
          <p
            className="text-center mt-2"
            style={{
              fontFamily: '"Montserrat", sans-serif',
              fontSize: 8,
              letterSpacing: '0.22em',
              color: 'rgba(201,168,76,0.88)',
                         }}
          >
            Una producción de nuestra vida · 2026
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Map Modal estilo cine (Mapbox dark style) ─────────────────────────────────
// Hacienda El Cedro — Ak 7 #150-21, Bogotá ≈ lng -74.035, lat 4.748
const MAP_CENTER: [number, number] = [-74.035, 4.748];

function MapboxMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: MAP_CENTER,
      zoom: 15,
      attributionControl: false,
      interactive: true,
    });

    // Gold custom marker
    const el = document.createElement('div');
    el.style.cssText = 'width:20px;height:20px;background:#C9A84C;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 0 12px rgba(201,168,76,0.8)';
    new mapboxgl.Marker(el).setLngLat(MAP_CENTER).addTo(map);

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: 220 }} />;
}

function MapModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 360,
          background: '#0D0D0D',
          border: '2px solid #2A2A2A',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 0 60px rgba(201,168,76,0.15)',
        }}
      >
        {/* Perforaciones top */}
        <div style={{ background: '#000', display: 'flex', alignItems: 'center', gap: 3, padding: '5px 6px' }}>
          {Array.from({length: 20}).map((_,i) => (
            <div key={i} style={{ flex:1, height:13, background:'#111', borderRadius:2, border:'1px solid #222' }} />
          ))}
        </div>

        {/* Header tipo cartelera */}
        <div style={{ background: '#111', padding: '10px 16px 8px', borderBottom: '1px solid #222', textAlign: 'center' }}>
          <p style={{
            fontFamily: '"Montserrat", sans-serif', fontSize: 9, fontWeight: 700,
            letterSpacing: '0.38em', color: GOLD, marginBottom: 3,
          }}>
            📍 Ahora en pantalla
          </p>
          <p style={{ fontFamily: '"Montserrat"', fontSize: 14, fontWeight: 700, color: '#F0E8D0', lineHeight: 1.2 }}>
            Hacienda El Cedro
          </p>
          <p style={{ fontFamily: '"Montserrat"', fontSize: 13, color: 'rgba(232,204,122,0.92)', marginTop: 4 }}>
            Ak 7 #150-21 · Bogotá, Colombia
          </p>
        </div>

        {/* Mapbox map */}
        <div style={{ position: 'relative', width: '100%', height: 220 }}>
          <MapboxMap />
          {/* Viñeta sobre el mapa */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 500, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.4) 100%)',
          }} />
        </div>

        {/* Footer ticket */}
        <div style={{ background: '#111', borderTop: '1px dashed #2A2A2A', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: '"Montserrat"', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(201,168,76,0.88)', marginBottom: 2 }}>Acto II · Recepción · 6:30 PM</p>
            <a
              href="https://maps.google.com/?q=Ak+7+%23150-21+Bogota"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: '"Montserrat", sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: GOLD_LIGHT, textDecoration: 'none' }}
            >
              Abrir en Maps →
            </a>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: `1px solid ${GOLD}55`,
              borderRadius: 2, padding: '6px 12px', cursor: 'pointer',
              fontFamily: '"Montserrat"', fontSize: 8, fontWeight: 700,
              letterSpacing: '0.2em', color: 'rgba(201,168,76,0.95)',
                         }}
          >
            Cerrar
          </button>
        </div>

        {/* Perforaciones bottom */}
        <div style={{ background: '#000', display: 'flex', alignItems: 'center', gap: 3, padding: '5px 6px' }}>
          {Array.from({length: 20}).map((_,i) => (
            <div key={i} style={{ flex:1, height:13, background:'#111', borderRadius:2, border:'1px solid #222' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── RSVP Modal estilo cine ────────────────────────────────────────────────────
const HOLES = Array.from({ length: 16 });
function FilmHoles() {
  return (
    <div style={{ background: '#000', display: 'flex', alignItems: 'center', gap: 3, padding: '5px 8px' }}>
      {HOLES.map((_, i) => (
        <div key={i} style={{ flex: 1, height: 12, background: '#111', borderRadius: 2, border: '1px solid #1E1E1E' }} />
      ))}
    </div>
  );
}

type RsvpStep = 'form' | 'done-yes' | 'done-no';

function RsvpModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<RsvpStep>('form');
  const [name, setName] = useState('');
  const [guests, setGuests] = useState('1');
  const nameErr = step === 'form' && name.trim().length === 0;

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#0A0A0A', border: '1.5px solid #2E2E2E',
    borderRadius: 3, padding: '10px 12px', color: '#F0E8D0',
    fontFamily: '"Montserrat", sans-serif', fontSize: 12,
    boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: '"Montserrat", sans-serif', fontSize: 10, fontWeight: 700,
    letterSpacing: '0.22em', color: 'rgba(201,168,76,0.92)',
    display: 'block', marginBottom: 5,
  };

  const handleYes = () => {
    if (!name.trim()) return;
    setStep('done-yes');
    const txt = encodeURIComponent(`¡Hola! Soy ${name.trim()} y confirmo mi asistencia a la boda de Paola & Nicolás el 25 de Julio 2026. Somos ${guests} persona(s). 🎬✨`);
    window.open(`https://wa.me/573057502790?text=${txt}`, '_blank');
  };
  const handleNo = () => {
    if (!name.trim()) return;
    setStep('done-no');
    const txt = encodeURIComponent(`Hola, soy ${name.trim()}. Lamentablemente no podré asistir a la boda de Paola & Nicolás el 25 de Julio 2026. ¡Muchas felicidades! 🎭💛`);
    window.open(`https://wa.me/573057502790?text=${txt}`, '_blank');
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 360,
          background: '#0D0D0D',
          border: '2px solid #2A2A2A',
          borderRadius: 5,
          overflow: 'hidden',
          boxShadow: '0 0 80px rgba(201,168,76,0.12), 0 20px 60px rgba(0,0,0,0.8)',
        }}
      >
        <FilmHoles />

        {/* Header */}
        <div style={{ background: 'linear-gradient(180deg,#1A1208 0%,#111 100%)', padding: '16px 20px 14px', borderBottom: '1px solid #222', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            {['★','★','★'].map((s,i) => <span key={i} style={{ color: GOLD, fontSize: 10, opacity: 0.7 }}>{s}</span>)}
          </div>
          <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.35em', color: GOLD, marginBottom: 6 }}>
            Confirmación de asistencia
          </p>
          <p style={{ fontFamily: '"Great Vibes", cursive', fontSize: 28, color: '#F0E8D0', lineHeight: 1.1, marginBottom: 4 }}>
            Paola &amp; Nicolás
          </p>
          <p style={{ fontFamily: '"Montserrat"', fontSize: 9, color: 'rgba(232,204,122,0.82)', letterSpacing: '0.12em' }}>
            Sábado · 25 de Julio · 2026 · 5:00 PM
          </p>
        </div>

        {/* Divider ticket */}
        <div style={{ position: 'relative', height: 0, borderTop: '1px dashed #2A2A2A' }}>
          <div style={{ position: 'absolute', left: -12, top: -10, width: 20, height: 20, background: 'black', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', right: -12, top: -10, width: 20, height: 20, background: 'black', borderRadius: '50%' }} />
        </div>

        {step === 'form' && (
          <div style={{ padding: '20px 20px 16px' }}>
            {/* Name */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Tu nombre completo</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej: María García"
                style={{ ...inputStyle, borderColor: nameErr ? '#8A2A2A' : '#2E2E2E' }}
              />
              {nameErr && <p style={{ fontFamily: '"Montserrat"', fontSize: 9, color: '#E06E6E', marginTop: 4 }}>Por favor ingresa tu nombre</p>}
            </div>

            {/* Guests */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>¿Cuántas personas asistirán?</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['1','2','3','4','+5'].map(n => (
                  <button
                    key={n}
                    onClick={() => setGuests(n)}
                    style={{
                      flex: 1, padding: '8px 4px',
                      background: guests === n ? GOLD : '#111',
                      border: `1.5px solid ${guests === n ? GOLD : '#2E2E2E'}`,
                      borderRadius: 3, cursor: 'pointer',
                      fontFamily: '"Montserrat", sans-serif', fontSize: 14, fontWeight: 700,
                      color: guests === n ? '#0D0D0D' : 'rgba(232,204,122,0.82)',
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <p style={{ fontFamily: '"Montserrat"', fontSize: 11, fontWeight: 700, color: 'rgba(240,232,208,0.7)', textAlign: 'center', marginBottom: 12, letterSpacing: '0.1em' }}>
              ¿Nos acompañas?
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleYes}
                style={{
                  flex: 2, padding: '14px 8px',
                  background: 'linear-gradient(135deg, #1C3A1A, #2A5228)',
                  border: '1.5px solid #3A8A3A',
                  borderRadius: 3, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                }}
              >
                <span style={{ fontSize: 22 }}>🎟️</span>
                <p style={{ fontFamily: '"Montserrat"', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: '#7EE07E', textTransform: 'none' }}>Sí, allí estaré</p>
                <p style={{ fontFamily: '"Montserrat"', fontSize: 9, color: 'rgba(126,224,126,0.88)', letterSpacing: '0.08em' }}>Tengo mi entrada</p>
              </button>
              <button
                onClick={handleNo}
                style={{
                  flex: 1, padding: '14px 8px',
                  background: '#111', border: '1.5px solid #2A2A2A',
                  borderRadius: 3, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                }}
              >
                <span style={{ fontSize: 22 }}>🎞️</span>
                <p style={{ fontFamily: '"Montserrat"', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: '#888', textTransform: 'none' }}>No podré</p>
              </button>
            </div>
          </div>
        )}

        {step === 'done-yes' && (
          <div style={{ padding: '28px 20px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: 44, marginBottom: 10 }}>🥂</p>
            <p style={{ fontFamily: '"Montserrat"', fontSize: 16, fontWeight: 700, color: '#7EE07E', marginBottom: 8, letterSpacing: '0.08em' }}>
              ¡{name.trim()}, te esperamos!
            </p>
            <p style={{ fontFamily: '"Montserrat"', fontSize: 10, color: 'rgba(232,204,122,0.55)', lineHeight: 1.6, marginBottom: 6 }}>
              Tu confirmación fue enviada por WhatsApp.<br />
              El <strong style={{ color: '#E8CC7A' }}>25 de Julio</strong> será una noche de película.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 6 }}>
              {['🎬','★','🎬'].map((s,i)=><span key={i} style={{ fontSize: 14, opacity: 0.5 }}>{s}</span>)}
            </div>
          </div>
        )}

        {step === 'done-no' && (
          <div style={{ padding: '28px 20px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: 44, marginBottom: 10 }}>🎭</p>
            <p style={{ fontFamily: '"Montserrat"', fontSize: 14, fontWeight: 700, color: '#E06E6E', marginBottom: 8 }}>
              Lo sentimos, {name.trim()}
            </p>
            <p style={{ fontFamily: '"Montserrat"', fontSize: 10, color: 'rgba(232,204,122,0.85)', lineHeight: 1.6 }}>
              Estarás en nuestros corazones ese día.<br />
              ¡Gracias por hacérnoslo saber!
            </p>
          </div>
        )}

        {/* Footer */}
        <div style={{ borderTop: '1px solid #1A1A1A', padding: '10px 16px', background: '#0A0A0A', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: `1px solid ${GOLD}44`,
              borderRadius: 2, padding: '6px 16px', cursor: 'pointer',
              fontFamily: '"Montserrat"', fontSize: 8, fontWeight: 700,
              letterSpacing: '0.2em', color: 'rgba(201,168,76,0.85)',
                         }}
          >
            Cerrar
          </button>
        </div>

        <FilmHoles />
      </div>
    </div>
  );
}

// ── Muro de mensajes ─────────────────────────────────────────────────────────
interface WallMsg { id: string; name: string; msg: string; ts: number; }

function MessageWall() {
  const KEY = 'boda_cine_wall';
  const load = (): WallMsg[] => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };

  const [msgs, setMsgs] = useState<WallMsg[]>(load);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const send = () => {
    if (!name.trim() || !msg.trim()) return;
    const entry: WallMsg = { id: Date.now().toString(), name: name.trim(), msg: msg.trim(), ts: Date.now() };
    const next = [entry, ...msgs].slice(0, 30);
    setMsgs(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    setSent(true);
    setName(''); setMsg('');
    setTimeout(() => setSent(false), 3000);
  };

  const inputBase: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: '1.5px solid rgba(201,168,76,0.18)',
    borderRadius: 3, color: '#F0E8D0',
    fontFamily: '"Montserrat", sans-serif', fontSize: 12,
    boxSizing: 'border-box',
  };

  return (
    <div style={{ margin: '0 0 0', background: '#0A0A0A', borderTop: '2px solid #1A1A1A' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(180deg,#1A1208 0%,#0A0A0A 100%)', padding: '16px 16px 10px', textAlign: 'center', borderBottom: '1px solid #1A1A1A' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3))' }} />
          <span style={{ fontSize: 16 }}>💌</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(270deg, transparent, rgba(201,168,76,0.3))' }} />
        </div>
        <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.35em', color: GOLD, marginBottom: 2 }}>
          Muro de mensajes
        </p>
        <p style={{ fontFamily: '"Montserrat"', fontSize: 9, color: 'rgba(232,204,122,0.78)', letterSpacing: '0.06em' }}>
          Deja tu mensaje a los novios
        </p>
      </div>

      {/* Form */}
      <div style={{ padding: '16px 16px 12px' }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Tu nombre"
          style={{ ...inputBase, padding: '9px 12px', marginBottom: 8 }}
        />
        <textarea
          value={msg}
          onChange={e => setMsg(e.target.value)}
          placeholder="Escribe tu mensaje para los novios... ✨"
          rows={3}
          style={{ ...inputBase, padding: '9px 12px', resize: 'none', display: 'block', marginBottom: 10, lineHeight: 1.5 }}
        />
        <button
          onClick={send}
          disabled={!name.trim() || !msg.trim()}
          style={{
            width: '100%', padding: '12px',
            background: name.trim() && msg.trim() ? `linear-gradient(135deg, #1A1208, #2A1E0A)` : '#111',
            border: `1.5px solid ${name.trim() && msg.trim() ? GOLD : '#222'}`,
            borderRadius: 3, cursor: name.trim() && msg.trim() ? 'pointer' : 'not-allowed',
            fontFamily: '"Montserrat"', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.22em', color: name.trim() && msg.trim() ? GOLD_LIGHT : '#333',
            transition: 'all 0.2s',
          }}
        >
          {sent ? '✓ Enviado' : '💬 Publicar mensaje'}
        </button>
      </div>

      {/* Messages list */}
      {msgs.length > 0 && (
        <div style={{ padding: '0 16px 20px' }}>
          <div style={{ height: 1, background: 'rgba(201,168,76,0.12)', marginBottom: 14 }} />
          {msgs.map((m, i) => (
            <div
              key={m.id}
              style={{
                marginBottom: 10,
                background: 'linear-gradient(135deg, #111 0%, #0D0A06 100%)',
                border: '1px solid rgba(201,168,76,0.12)',
                borderLeft: `3px solid ${i === 0 ? GOLD : 'rgba(201,168,76,0.25)'}`,
                borderRadius: '0 3px 3px 0',
                padding: '10px 14px',
              }}
            >
              <p style={{ fontFamily: '"Montserrat"', fontSize: 11, color: 'rgba(240,232,208,0.82)', lineHeight: 1.55, marginBottom: 5, fontStyle: 'italic' }}>
                "{m.msg}"
              </p>
              <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(201,168,76,0.85)', textTransform: 'none' }}>
                — {m.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Letter board (CodePen style) ─────────────────────────────────────────────
const BG_VARIANTS = [
  { verticalAlign: 'top' as const,    background: 'linear-gradient(13deg,rgba(225,245,196,0.21),rgba(233,222,222,0.36))' },
  { verticalAlign: 'bottom' as const, background: 'linear-gradient(13deg,rgba(205,233,185,0.22),rgba(221,212,200,0.65))', transform: 'rotate(-1deg)' },
  { verticalAlign: 'middle' as const, background: 'linear-gradient(13deg,rgba(230,252,197,0.59),rgba(236,223,207,0.19))', transform: 'rotate(2deg)' },
  { verticalAlign: 'middle' as const, background: 'linear-gradient(13deg,rgba(189,206,173,0.02),#f8e7d3)', width: '0.5em' },
];

function LetterChar({ char, red, idx }: { char: string; red: boolean; idx: number }) {
  if (char === ' ') return <span style={{ display:'inline-block', width:'0.35em' }}>&nbsp;</span>;
  const v = BG_VARIANTS[idx % 4];
  return (
    <span style={{
      display: 'inline-block',
      textAlign: 'center',
      width: v.width || '0.6em',
      verticalAlign: v.verticalAlign,
      transform: v.transform,
      background: 'transparent',
      color: red ? '#C00000' : '#111111',
      fontWeight: 700,
      borderRight: '1px solid rgba(180,175,165,0.18)',
    }}>{char}</span>
  );
}

function LetterRow({ text, small = false, redFn }: {
  text: string;
  small?: boolean;
  redFn?: (char: string, charIdx: number) => boolean;
}) {
  return (
    <div style={{
      borderTop: '1px solid #C8C4BC',
      borderBottom: '1px solid #C8C4BC',
      overflow: 'hidden',
      marginBottom: 0,
      height: small ? '1.15em' : '1.35em',
      lineHeight: small ? '1.15em' : '1.35em',
      paddingLeft: '0.6em',
      background: '#FAFAF8',
    }}>
      {text.split('').map((ch, i) => (
        <LetterChar key={i} char={ch} red={redFn ? redFn(ch, i) : false} idx={i} />
      ))}
    </div>
  );
}

function LetterBoard({ items }: {
  items: { date: string; title: string; time: string }[];
}) {
  return (
    <div style={{
      fontFamily: '"Montserrat", sans-serif',
      letterSpacing: 1,
      fontSize: '1.05rem',
      background: '#EEECEA',
      border: '2px solid #C0BAB2',
      borderRadius: 3,
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    }}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <LetterRow text={item.date} small />
          <LetterRow text={item.title} />
          <LetterRow text={item.time} redFn={() => true} />
          {i < items.length - 1 && (
            <div style={{ height: 5, background: '#E0DDD8', borderTop: '1px solid #C8C4BC', borderBottom: '1px solid #C8C4BC' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Vertical film strip with sliding B&W photos ──────────────────────────────
const STRIP_PHOTOS = [
  '/images/img-BN-boda1.jpg',
  '/images/img-BN-boda2.jpg',
  '/images/img-BN-boda3.jpg',
  '/images/img-BN-boda4.jpg',
];

function FilmStripVertical() {
  // 8 frames (2 loops of 4) for seamless infinite scroll
  const frames = [...STRIP_PHOTOS, ...STRIP_PHOTOS];
  const PERF_H = 10;
  return (
    <div style={{
      width: 110, flexShrink: 0,
      background: '#0A0A0A', overflow: 'hidden',
      position: 'relative', alignSelf: 'stretch',
      borderLeft: '2px solid #222',
    }}>
      <div style={{ animation: 'film-slide-up 20s linear infinite' }}>
        {frames.map((src, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'stretch', height: 120 }}>
            {/* Left perfs */}
            <div style={{ width: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', background: '#111', flexShrink: 0 }}>
              {[0,1,2,3].map(h => (
                <div key={h} style={{ width: PERF_H, height: PERF_H, borderRadius: 2, background: '#0A0A0A', border: '1px solid #2A2A2A' }} />
              ))}
            </div>
            {/* Real photo */}
            <div style={{ flex: 1, overflow: 'hidden', borderTop: '1px solid #1A1A1A', borderBottom: '1px solid #1A1A1A' }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', filter: 'grayscale(100%) contrast(1.1) brightness(0.92)' }} />
            </div>
            {/* Right perfs */}
            <div style={{ width: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', background: '#111', flexShrink: 0 }}>
              {[0,1,2,3].map(h => (
                <div key={h} style={{ width: PERF_H, height: PERF_H, borderRadius: 2, background: '#0A0A0A', border: '1px solid #2A2A2A' }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Clapperboard diagonal stripe top ─────────────────────────────────────────
function ClapperArm() {
  return (
    <div style={{ position: 'relative', borderRadius: '6px 6px 0 0', overflow: 'hidden', border: '2px solid #1A1A1A', borderBottom: '3px solid #000', boxShadow: '0 4px 16px rgba(0,0,0,0.7)' }}>
      {/* Lower thick black base */}
      <div style={{ height: 14, background: '#111', borderBottom: '2px solid #000', display: 'flex', alignItems: 'center', paddingLeft: 12, gap: 10 }}>
        {/* Rivets */}
        {[0,1].map(i => (
          <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #999, #333)', border: '1px solid #555', flexShrink: 0, marginRight: i === 0 ? 0 : 'auto' }} />
        ))}
        <div style={{ width: 11, height: 11, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #999, #333)', border: '1px solid #555', flexShrink: 0 }} />
      </div>
      {/* Diagonal B&W stripes */}
      <div style={{
        height: 30,
        background: 'repeating-linear-gradient(-45deg, #111 0px, #111 18px, #F0F0F0 18px, #F0F0F0 36px)',
      }} />
    </div>
  );
}

// ── Tocadiscos Player (YouTube embed hidden) ──────────────────────────────────
const YT_VIDEO_ID = '5NjJLFI_oYs';
const YT_START = 15;

const WAVE_HEIGHTS = [4,9,16,24,16,9, 6,14,22,14,6, 5,12,20,12,5, 7,15,7];

function CinemaPlayer({ externalPlaying, onToggle }: { externalPlaying: boolean; onToggle: () => void }) {
  const playing = externalPlaying;
  const toggle = onToggle;

  return (
    <div style={{
      margin: '12px 0',
      background: 'linear-gradient(160deg, #1A1008 0%, #0D0D0D 100%)',
      border: '1px solid #3A3020',
      borderRadius: 8,
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    }}>
      {/* iframe lives at App level for autoplay within gesture window */}

      <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '12px 12px 10px' }}>

        {/* ── Tocadiscos SVG ── */}
        <div style={{ flexShrink: 0, position: 'relative', width: 76, height: 76 }}>
          {/* Plato base */}
          <svg width="76" height="76" viewBox="0 0 90 90" style={{ position: 'absolute', top: 0, left: 0 }}>
            {/* Base del plato */}
            <circle cx="45" cy="45" r="42" fill="#1A1A1A" stroke="#333" strokeWidth="1.5"/>
            {/* Vinilo exterior */}
            <circle cx="45" cy="45" r="38" fill="#111" style={{ animation: playing ? 'film-roll 3s linear infinite' : 'none', transformOrigin: '45px 45px' }}/>
          </svg>
          {/* Vinilo giratorio */}
          <svg width="76" height="76" viewBox="0 0 90 90" style={{ position: 'absolute', top: 0, left: 0, animation: playing ? 'film-roll 3s linear infinite' : 'none' }}>
            {/* Surcos del vinilo */}
            {[34,30,26,22,18,14].map((r,i) => (
              <circle key={i} cx="45" cy="45" r={r} fill="none" stroke="#2A2A2A" strokeWidth="1"/>
            ))}
            {/* Label dorado central */}
            <circle cx="45" cy="45" r="12" fill="#C9A84C"/>
            <circle cx="45" cy="45" r="10" fill="#B8962E"/>
            {/* Texto en el label */}
            <circle cx="45" cy="45" r="2.5" fill="#0D0D0D"/>
            {/* Líneas decorativas label */}
            {[0,45,90,135].map(a => (
              <line key={a} x1="45" y1="35" x2="45" y2="38"
                stroke="#8B6914" strokeWidth="1"
                transform={`rotate(${a} 45 45)`}/>
            ))}
          </svg>
          {/* Brazo tonearm */}
          <svg width="76" height="76" viewBox="0 0 90 90" style={{ position: 'absolute', top: 0, left: 0 }}>
            {/* Pivot del brazo */}
            <circle cx="76" cy="14" r="4" fill="#555" stroke="#777" strokeWidth="1"/>
            {/* Brazo */}
            <line x1="76" y1="14" x2="54" y2="42" stroke="#888" strokeWidth="2.5" strokeLinecap="round"
              style={{ transformOrigin: '76px 14px', transform: playing ? 'rotate(-5deg)' : 'rotate(5deg)', transition: 'transform 0.8s ease' }}/>
            {/* Cabezal */}
            <circle cx="54" cy="42" r="3" fill="#AAA" stroke="#CCC" strokeWidth="1"
              style={{ transformOrigin: '76px 14px', transform: playing ? 'rotate(-5deg)' : 'rotate(5deg)', transition: 'transform 0.8s ease' }}/>
          </svg>
        </div>

        {/* ── Info + botón ── */}
        <div style={{ flex: 1, minWidth: 0, paddingLeft: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: '0.12em', color: '#E8CC7A', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Nuestra canción
            </p>
            <p style={{ fontFamily: '"Montserrat"', fontSize: 9, color: 'rgba(255,255,255,0.65)', marginTop: 2, letterSpacing: '0.04em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Soundtrack de nuestra historia
            </p>
          </div>

          {/* Ondas */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 32 }}>
            {WAVE_HEIGHTS.map((h, i) => (
              <div key={i} style={{
                width: 3, borderRadius: 2,
                height: playing ? h : 3,
                background: playing
                  ? `rgba(201,168,76,${0.4 + (i % 3) * 0.2})`
                  : 'rgba(201,168,76,0.2)',
                transition: `height 0.15s ease ${i * 0.02}s, background 0.3s`,
                animation: playing ? `marquee-blink ${0.6 + (i % 5) * 0.15}s ease-in-out ${i * 0.04}s infinite` : 'none',
                flexShrink: 0,
              }}/>
            ))}
          </div>

          {/* Play/Pause */}
          <button
            onClick={toggle}
            style={{
              alignSelf: 'flex-start',
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '6px 14px', borderRadius: 20,
              background: playing ? 'rgba(201,168,76,0.12)' : GOLD,
              border: `1.5px solid ${GOLD}`,
              cursor: 'pointer',
              opacity: 1,
              transition: 'all 0.2s',
            }}
          >
            {playing ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill={GOLD}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                <span style={{ fontFamily: '"Montserrat"', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: GOLD, textTransform: 'none' }}>Pausa</span>
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#1A1200"><polygon points="5,3 19,12 5,21"/></svg>
                <span style={{ fontFamily: '"Montserrat"', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: '#1A1200', textTransform: 'none' }}>▶ Play</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── SCREEN 2: Invitation ─────────────────────────────────────────────────────
function InvitationScreen({ audioPlaying, onAudioToggle }: { audioPlaying: boolean; onAudioToggle: () => void }) {
  const [showMap, setShowMap] = useState(false);
  const [showRsvp, setShowRsvp] = useState(false);
  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ background: '#080808' }}>
      <div className="w-full max-w-[420px] px-4 py-8">

        {/* Clapperboard arm */}
        <ClapperArm />

        {/* Main clapperboard body */}
        <div style={{ background: '#111', border: '2px solid #2A2A2A', borderTop: 'none', borderRadius: '0 0 4px 4px' }}>

          {/* Inner layout: content left + film strip right */}
          <div style={{ display: 'flex', alignItems: 'stretch' }}>

            {/* ── Left: Invitation content ── */}
            <div style={{ flex: 1, padding: '20px 18px 24px', overflow: 'hidden' }}>

              {/* PRODUCTION header */}
              <p style={{ fontFamily: '"Montserrat"', fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: 'rgba(201,168,76,0.92)', marginBottom: 2 }}>
                Producción
              </p>
              <div style={{ height: 1, background: 'rgba(201,168,76,0.2)', marginBottom: 8 }} />

              {/* THE WEDDING OF */}
              <p style={{ fontFamily: '"Montserrat"', fontSize: 11, letterSpacing: '0.2em', color: 'rgba(245,237,216,0.5)', marginBottom: 2 }}>
                La boda de
              </p>

              {/* ── Neon names ── */}
              <p style={{
                fontFamily: '"Great Vibes", cursive',
                fontSize: 46,
                lineHeight: 1.05,
                color: '#FFF0D0',
                marginBottom: 4,
                animation: 'neon-glow 5s ease-in-out infinite',
              }}>
                Paola &amp; Nicolás
              </p>

              {/* ── Marquee date display (image 3 style) ── */}
              <div style={{
                marginTop: 14,
                background: '#F2EADB',
                border: '2px solid #1A1A1A',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: 'inset 0 0 0 3px #E8DCC8',
              }}>
                {/* Marquee lights top */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', background: '#111' }}>
                  {Array.from({length: 14}).map((_,i) => (
                    <div key={i} className="marquee-light" style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: 'radial-gradient(circle at 35% 35%, #FFF8C0, #E8CC7A)',
                      boxShadow: '0 0 4px rgba(232,204,122,0.9)',
                      animationDelay: `${i * 0.1}s`,
                    }} />
                  ))}
                </div>
                {/* Labels row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1.5px solid #1A1A1A' }}>
                  {['Día', 'Mes', 'Hora'].map((lbl, i) => (
                    <div key={i} style={{
                      textAlign: 'center', padding: '4px 0',
                      borderRight: i < 2 ? '1.5px solid #1A1A1A' : undefined,
                    }}>
                      <p style={{ fontFamily: '"Montserrat"', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', color: '#555', textTransform: 'none' }}>{lbl}</p>
                    </div>
                  ))}
                </div>
                {/* Values row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
                  {[
                    { val: '25', sub: 'Sábado' },
                    { val: 'Julio', sub: '2026' },
                    { val: '5', sub: 'PM' },
                  ].map((item, i) => (
                    <div key={i} style={{
                      textAlign: 'center', padding: '6px 4px 8px',
                      borderRight: i < 2 ? '1.5px solid #1A1A1A' : undefined,
                    }}>
                      <p style={{ fontFamily: '"Montserrat"', fontSize: i === 1 ? 13 : 22, fontWeight: 900, color: '#111', lineHeight: 1 }}>{item.val}</p>
                      <p style={{ fontFamily: '"Montserrat"', fontSize: 10, color: '#666', marginTop: 2, letterSpacing: '0.08em' }}>{item.sub}</p>
                    </div>
                  ))}
                </div>
                {/* Marquee lights bottom */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', background: '#111' }}>
                  {Array.from({length: 14}).map((_,i) => (
                    <div key={i} className="marquee-light" style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: 'radial-gradient(circle at 35% 35%, #FFF8C0, #E8CC7A)',
                      boxShadow: '0 0 4px rgba(232,204,122,0.9)',
                      animationDelay: `${i * 0.1 + 0.7}s`,
                    }} />
                  ))}
                </div>
              </div>

              {/* Separator */}
              <div style={{ height: 1, background: 'rgba(201,168,76,0.18)', margin: '14px 0' }} />

              {/* ── Itinerario estilo letter board ── */}
              <LetterBoard items={[
                { date: '25 / 07 / 2026', title: 'Llegada de invitados', time: '4:30pm' },
                { date: '25 / 07 / 2026', title: 'Ceremonia religiosa',  time: '5:00pm' },
                { date: '25 / 07 / 2026', title: 'Recepción y cóctel',   time: '6:30pm' },
                { date: '25 / 07 / 2026', title: 'Cena y celebración',   time: '8:00pm' },
              ]} />

              {/* Separator */}
              <div style={{ height: 1, background: 'rgba(201,168,76,0.18)', margin: '12px 0' }} />

              {/* Palomitas + frase */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <PopcornBox />
                <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: 11, fontWeight: 600, color: 'rgba(232,204,122,0.85)', lineHeight: 1.45, letterSpacing: '0.04em' }}>
                  "La mejor historia<br />de amor merece el<br />mejor escenario"
                </p>
              </div>

              <div style={{ height: 1, background: 'rgba(201,168,76,0.18)', marginBottom: 12 }} />

              {/* Locaciones */}
              <p style={{ fontFamily: '"Montserrat"', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: GOLD, marginBottom: 8 }}>
                Locaciones del rodaje
              </p>

              <div style={{ marginBottom: 10 }}>
                <p style={{ fontFamily: '"Montserrat"', fontSize: 9, letterSpacing: '0.12em', color: 'rgba(201,168,76,0.78)', marginBottom: 2 }}>Acto II · Recepción</p>
                <p style={{ fontFamily: '"Montserrat"', fontSize: 13, fontWeight: 700, color: '#F0E8D0', lineHeight: 1.3 }}>Hacienda El Cedro</p>
                <p style={{ fontFamily: '"Montserrat"', fontSize: 10, color: 'rgba(232,204,122,0.85)', marginTop: 1 }}>Ak 7 #150-21 · Bogotá · 6:30 PM</p>
              </div>

              {/* Botón ubicación → abre modal */}
              <button onClick={() => setShowMap(true)} style={{ display: 'block', width: '100%', textDecoration: 'none', marginBottom: 12, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                <div style={{ background: '#F2EFEA', border: '2px solid #C0BAB2', borderRadius: 3, overflow: 'hidden', display: 'flex', alignItems: 'stretch' }}>
                  <div style={{ width: 20, background: '#111', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    {[0,1,2,3,4].map(h=>(
                      <div key={h} style={{ width: 8, height: 8, borderRadius: 2, background: '#F2EFEA', border: '1px solid #333' }} />
                    ))}
                  </div>
                  <div style={{ flex: 1, padding: '8px 10px', textAlign: 'left' }}>
                    <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#444', marginBottom: 1 }}>📍 Escenario principal</p>
                    <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: 15, fontWeight: 700, letterSpacing: '0.1em', color: '#111', lineHeight: 1.1 }}>Hacienda El Cedro</p>
                    <p style={{ fontFamily: '"Montserrat"', fontSize: 10, color: '#444', marginTop: 1 }}>Ak 7 #150-21 · Bogotá · Toca para ver</p>
                  </div>
                  <div style={{ width: 30, background: '#1A1A1A', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </button>
              {showMap && <MapModal onClose={() => setShowMap(false)} />}

              <div style={{ height: 1, background: 'rgba(201,168,76,0.18)', marginBottom: 12 }} />

              {/* Vestimenta */}
              <p style={{ fontFamily: '"Montserrat"', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: GOLD, marginBottom: 8 }}>
                Vestimenta
              </p>
              <div style={{ background: '#F2EFEA', border: '2px solid #C0BAB2', borderRadius: 3, padding: '10px 12px', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>👗</span>
                  <div>
                    <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: 16, fontWeight: 700, letterSpacing: '0.1em', color: '#111', lineHeight: 1.1, marginBottom: 4 }}>Formal / Elegante</p>
                    <p style={{ fontFamily: '"Montserrat"', fontSize: 10, color: '#666', lineHeight: 1.5 }}>
                      Damas: vestido largo o coctel<br />
                      Caballeros: traje formal<br />
                      <span style={{ color: '#B00000' }}>No se permite vestimenta blanca</span>
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ height: 1, background: 'rgba(201,168,76,0.18)', marginBottom: 12 }} />
            </div>

            {/* ── Right: Vertical film strip ── */}
            <FilmStripVertical />
          </div>

          {/* ── Reproductor full-width (fuera del contenedor de fotos) ── */}
          <div style={{ padding: '0 12px 12px' }}>
            <CinemaPlayer externalPlaying={audioPlaying} onToggle={onAudioToggle} />
          </div>

          {/* ── RSVP full-width → opens modal ── */}
          <div style={{ padding: '0 12px 16px' }}>
            <button
              onClick={() => setShowRsvp(true)}
              style={{
                display: 'block', width: '100%', padding: '14px 22px',
                border: `1.5px solid ${GOLD}`,
                background: 'linear-gradient(135deg, #1A1208 0%, #0D0D0D 100%)',
                fontFamily: '"Montserrat"', fontSize: 12, fontWeight: 700,
                letterSpacing: '0.22em', color: GOLD_LIGHT,
                borderRadius: 2, cursor: 'pointer',
                boxShadow: `0 0 20px rgba(201,168,76,0.08)`,
                transition: 'all 0.2s',
              }}
            >
              🎟️ Confirmar asistencia
            </button>
          </div>

          {/* ── Muro de mensajes (ancho completo, fuera del contenedor de fotos) ── */}
          <MessageWall />

          {/* Footer bar */}
          <div style={{ borderTop: '1px solid #222', padding: '10px 16px', background: '#0D0D0D' }}>
            <p style={{ fontFamily: '"Montserrat"', fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginBottom: 5 }}>
              Una producción de nuestra vida · El amor · La familia · Un futuro juntos
            </p>
            <p style={{ textAlign: 'center' }}>
              <a
                href="https://celebrarte.com.co/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: '"Montserrat"', fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}
              >
                Diseñado por Celebrarte
              </a>
            </p>
          </div>
        </div>

        {/* Film strip bottom */}
        <div style={{ background: '#111', marginTop: 2 }}><FilmStrip /></div>

        {/* Modals */}
        {showRsvp && <RsvpModal onClose={() => setShowRsvp(false)} />}
      </div>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
type AppState = 'poster' | 'transition' | 'invitation';

declare global { interface Window { YT: any; onYouTubeIframeAPIReady: () => void; } }

export default function App() {
  const [state, setState] = useState<AppState>('poster');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const ytPlayer = useRef<any>(null);
  const playerReady = useRef(false);

  // Load YouTube IFrame API on mount and create hidden player
  useEffect(() => {
    const initPlayer = () => {
      const div = document.createElement('div');
      div.style.cssText = 'position:fixed;bottom:0;right:0;width:1px;height:1px;opacity:0;pointer-events:none;';
      document.body.appendChild(div);
      ytPlayer.current = new window.YT.Player(div, {
        videoId: YT_VIDEO_ID,
        playerVars: { autoplay: 0, start: YT_START, controls: 0, rel: 0, loop: 1, playlist: YT_VIDEO_ID, modestbranding: 1, enablejsapi: 1 },
        events: {
          onReady: (e: any) => {
            playerReady.current = true;
            // Try muted autoplay — works on Android/desktop, blocked on iOS
            try { e.target.mute(); e.target.playVideo(); } catch {}
          },
          onStateChange: (e: any) => {
            // Once playing, unmute
            if (e.data === 1 && ytPlayer.current) {
              try { ytPlayer.current.unMute(); ytPlayer.current.setVolume(100); } catch {}
              setAudioPlaying(true);
            }
            if (e.data === 2) setAudioPlaying(false);
          },
        },
      });
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  }, []);

  const handleEnter = () => {
    setState('transition');
    // Try to start playback — works if player is already ready
    if (playerReady.current) {
      try { ytPlayer.current.playVideo(); } catch {}
    }
  };

  const toggleAudio = () => {
    if (!playerReady.current) return;
    if (audioPlaying) {
      try { ytPlayer.current.pauseVideo(); } catch {}
      setAudioPlaying(false);
    } else {
      // This is a direct user gesture → iOS allows playVideo() here
      try { ytPlayer.current.unMute(); ytPlayer.current.setVolume(100); ytPlayer.current.playVideo(); } catch {}
      setAudioPlaying(true);
    }
  };

  return (
    <div className="relative">

      {state === 'poster' && <PosterScreen onEnter={handleEnter} />}
      {state === 'transition' && (
        <>
          <InvitationScreen audioPlaying={audioPlaying} onAudioToggle={toggleAudio} />
          <CinemaTransition onDone={() => setState('invitation')} />
        </>
      )}
      {state === 'invitation' && <InvitationScreen audioPlaying={audioPlaying} onAudioToggle={toggleAudio} />}
    </div>
  );
}
