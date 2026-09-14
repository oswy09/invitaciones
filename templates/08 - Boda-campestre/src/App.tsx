import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import portadaImg      from '../images/img-portada-boda-golf.png';
import hojaImg         from '../images/hoja-decoracion-boda.png';
// @ts-ignore
import arbolImg        from '../images/Arbol-boda.jpeg';
import campoImg        from '../images/campo-golf.jpeg';
import dressImg        from '../images/dress-code-removebg-preview.png';
import cierreImg       from '../images/recien-casados.jpeg';
// @ts-ignore
import sobreCerradoImg    from '../images/sobre_cerrado.png';
// @ts-ignore
import sobreAbiertoImg    from '../images/openn-removebg-preview.png';

const params     = new URLSearchParams(window.location.search);
const GUEST_NAME = params.get('guest') || 'Tía Gladys';

// ── SOBRE (fotos — versión cliente) ────────────────────────────
function EnvelopeScene({ onOpen, onStartAudio }: { onOpen: () => void; onStartAudio?: () => void }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'idle' | 'shaking' | 'open'>('idle');
  const [clicked, setClicked] = useState(false);

  const handleOpen = () => {
    if (clicked) return;
    setClicked(true);
    if (onStartAudio) onStartAudio();
    setPhase('shaking');
    setTimeout(() => setPhase('open'), 320);
    setTimeout(() => {
      if (sceneRef.current) {
        gsap.to(sceneRef.current, { opacity: 0, duration: 0.4, ease: 'power2.in', onComplete: onOpen });
      }
    }, 1150);
  };

  return (
    <div ref={sceneRef} onClick={handleOpen} onTouchStart={handleOpen} style={{
      position: 'fixed', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 28, zIndex: 200,
      cursor: clicked ? 'default' : 'pointer',
      WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
    }}>
      <div style={{
        position: 'relative', width: 'min(78vw, 300px)', aspectRatio: '1 / 0.88',
        animation: clicked ? 'none' : 'envelopeFloat 3.8s ease-in-out infinite',
        filter: 'drop-shadow(0 1.2rem 1.4rem rgba(131,119,90,0.26))',
      }}>
        <img src={sobreCerradoImg} alt="Sobre cerrado" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain',
          opacity: phase === 'open' ? 0 : 1,
          transform: phase === 'open' ? 'scale(0.92)' : 'scale(1)',
          filter: phase === 'open' ? 'blur(2px)' : 'blur(0px)',
          transition: 'opacity 0.5s ease, transform 0.55s ease, filter 0.45s ease',
          animation: phase === 'shaking' ? 'sealShake 0.32s ease-in-out' : 'none',
        }}/>
        <img src={sobreAbiertoImg} alt="Sobre abierto" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain',
          opacity: phase === 'open' ? 1 : 0,
          transform: phase === 'open' ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(20px)',
          transition: phase === 'open'
            ? 'opacity 0.55s cubic-bezier(0,0,0.2,1) 0.1s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.08s'
            : 'none',
        }}/>
      </div>
      <div style={{
        textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        opacity: clicked ? 0 : 1, transition: clicked ? 'opacity 0.28s ease' : 'none', pointerEvents: 'none',
      }}>
        <p style={{ fontFamily: 'var(--f-script)', fontSize: 'clamp(34px, 10vw, 46px)', color: '#8C6032', lineHeight: 1.15 }}>{GUEST_NAME}</p>
        <p style={{ fontFamily: 'var(--f-body)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--c-muted)', animation: 'hintPulse 2.2s ease-in-out infinite' }}>Toca para abrir</p>
      </div>
    </div>
  );
}

// ── PORTADA ────────────────────────────────────────────────────
function PortadaSection() {
  return (
    <section style={{
      textAlign: 'center', background: 'var(--c-bg)',
      minHeight: '100dvh',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      padding: '24px 20px 36px',
      boxSizing: 'border-box',
      animation: 'fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both',
    }}>

      {/* Ilustración — más grande sin el Save the Date */}
      <img
        src={portadaImg}
        alt="María y Juan Carlos"
        style={{
          width: '96%', maxWidth: 370,
          maxHeight: 'clamp(230px, 40vh, 330px)',
          objectFit: 'contain',
          margin: '0 auto', display: 'block',
          animation: 'fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.1s both',
        }}
      />

      {/* Bloque debajo de la imagen */}
      <div style={{
        paddingTop: 12, paddingBottom: 8,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.4s both',
      }}>
        <p style={{
          fontFamily: 'var(--f-body)', fontSize: 11, fontWeight: 600,
          letterSpacing: '0.28em', textTransform: 'uppercase',
          color: 'var(--c-text)',
        }}>Matrimonio de</p>
        <p style={{
          fontFamily: 'var(--f-script)',
          fontSize: 'clamp(38px, 11vw, 52px)',
          color: '#A99261', lineHeight: 1.1, margin: '4px 0 2px',
        }}>María &amp; Juanca</p>
        <p style={{
          fontFamily: 'var(--f-body)', fontSize: 14, fontWeight: 500,
          letterSpacing: '0.18em', color: 'var(--c-text)', marginTop: 2,
        }}>19 · 12 · 2026</p>
        <p style={{
          fontFamily: 'var(--f-body)', fontSize: 12.5, fontWeight: 500,
          color: 'var(--c-text)',
        }}>Cali, Colombia</p>
      </div>

    </section>
  );
}

// ── PRELOADER GOLF ─────────────────────────────────────────────
function RamaPreloader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'var(--c-bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 20,
    }}>
      <style>{`
        @keyframes dotFloat1 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-5px)} }
        @keyframes dotFloat2 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-4px)} }
        @keyframes dotFloat3 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }
        @keyframes ramaEntrada {
          0%   { opacity: 0; transform: scale(0.82) rotate(-6deg); }
          40%  { opacity: 1; transform: scale(1.04) rotate(2deg); }
          65%  { transform: scale(0.98) rotate(-1deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes ramaSway {
          0%,100% { transform: scale(1) rotate(0deg); }
          30%     { transform: scale(1.02) rotate(1.8deg); }
          70%     { transform: scale(1.01) rotate(-1.4deg); }
        }
        @keyframes ramaFadeOut {
          0%   { opacity: 1; }
          100% { opacity: 0; transform: scale(1.06); }
        }
        @keyframes ramaProgress {
          from { width: 0% }
          to   { width: 100% }
        }
        @keyframes ramaTextIn {
          0%   { opacity: 0; letter-spacing: 0.45em; }
          100% { opacity: 1; letter-spacing: 0.28em; }
        }
      `}</style>

      <div style={{ position: 'relative', width: 200, height: 150 }}>
        <img
          src={hojaImg}
          alt=""
          aria-hidden="true"
          style={{
            width: 170, opacity: 0.88,
            position: 'absolute', left: 15, top: 10,
            animation: 'ramaEntrada 0.9s cubic-bezier(0.34,1.3,0.64,1) both, ramaSway 2.8s ease-in-out 0.9s infinite',
            transformOrigin: 'center bottom',
          }}
        />
        {/* Destellos flotantes */}
        {[
          { top:  0,  left: 10,  r: 2,   op: 0.30, anim: 'dotFloat1 3.2s ease-in-out infinite' },
          { top: -6,  left: 68,  r: 1.5, op: 0.22, anim: 'dotFloat2 2.8s ease-in-out infinite 0.4s' },
          { top:  2,  left: 128, r: 2.5, op: 0.28, anim: 'dotFloat3 3.5s ease-in-out infinite 0.2s' },
          { top: 34,  left: -2,  r: 1.5, op: 0.20, anim: 'dotFloat1 3.8s ease-in-out infinite 0.6s' },
          { top: 70,  left: -5,  r: 1.5, op: 0.18, anim: 'dotFloat2 3.1s ease-in-out infinite 0.1s' },
          { top: 80,  left: 162, r: 2,   op: 0.25, anim: 'dotFloat3 2.9s ease-in-out infinite 0.5s' },
          { top: 108, left: 50,  r: 1.5, op: 0.20, anim: 'dotFloat1 3.4s ease-in-out infinite 0.3s' },
          { top: 118, left: 110, r: 2,   op: 0.22, anim: 'dotFloat2 3.6s ease-in-out infinite 0.7s' },
        ].map((d, i) => (
          <div key={i} style={{
            position: 'absolute', top: d.top, left: d.left,
            width: d.r * 2, height: d.r * 2, borderRadius: '50%',
            background: '#8FA882', opacity: d.op,
            animation: d.anim,
          }} />
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 100, height: 1, background: '#E8E2D6', overflow: 'hidden' }}>
          <div style={{
            height: '100%', background: '#6B5225',
            animation: 'ramaProgress 2.4s ease-out forwards',
          }}/>
        </div>
        <span style={{
          fontFamily: 'var(--f-body)', fontSize: 9, color: '#2C2416',
          textTransform: 'uppercase',
          animation: 'ramaTextIn 0.8s ease-out 0.3s both',
        }}>Un momento</span>
      </div>
    </div>
  );
}

// ── PADRES ─────────────────────────────────────────────────────
function ParentsSection() {
  return (
    <section style={{
      textAlign: 'center',
      background: 'var(--c-bg)',
      padding: '80px 36px 56px',
      animation: 'fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>

      {/* Título — misma fuente y grosor que María & Juanca en portada */}
      <h2 style={{
        fontFamily: 'var(--f-script)',
        fontSize: 'clamp(38px, 10vw, 50px)',
        color: '#A99261',
        lineHeight: 1.25,
        margin: '0 0 32px',
        maxWidth: 320,
        transform: 'rotate(-4deg)',
        fontWeight: 'normal',
        animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both',
      }}>
        Con la bendición de Dios y nuestros padres
      </h2>

      {/* Línea decorativa */}
      <div style={{ width: 40, height: 1, background: 'var(--c-border)', marginBottom: 32 }} />

      {/* Padres novia */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s both',
      }}>
        {['Jorge Diego Jaramillo B.', 'Olga Elena Pérez A.'].map((name, i) => (
          <p key={i} style={{ fontFamily: 'var(--f-body)', fontSize: 15.5, color: 'var(--c-text)', lineHeight: 1.8, margin: 0 }}>{name}</p>
        ))}
      </div>

      {/* Separador entre familias */}
      <div style={{ width: 24, height: 1, background: 'var(--c-border)', margin: '20px 0' }} />

      {/* Padres novio */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s both',
      }}>
        <p style={{ fontFamily: 'var(--f-body)', fontSize: 15.5, color: 'var(--c-text)', lineHeight: 1.8, margin: 0 }}>
          Luis Carlos Varela V. · <span style={{ fontSize: 11, letterSpacing: '0.08em', color: 'var(--c-muted)' }}>Q.E.P.D</span>
        </p>
        <p style={{ fontFamily: 'var(--f-body)', fontSize: 15.5, color: 'var(--c-text)', lineHeight: 1.8, margin: 0 }}>Myriam Bellini A.</p>
      </div>

      {/* Invitación */}
      <p style={{
        fontFamily: 'var(--f-body)', fontSize: 14.5,
        letterSpacing: '0.04em', color: 'var(--c-muted)',
        marginTop: 26, lineHeight: 1.7,
        animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s both',
      }}>
        Los invitamos a celebrar nuestro matrimonio
      </p>

      {/* Hoja flotante con puntos */}
      <style>{`
        @keyframes leafFloat {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%       { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes dotFloat1 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-5px)} }
        @keyframes dotFloat2 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-4px)} }
        @keyframes dotFloat3 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }
      `}</style>
      <div style={{
        position: 'relative', display: 'inline-block',
        marginTop: 36, width: 160, height: 110,
        animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.4s both',
      }}>
        <img src={hojaImg} alt="" aria-hidden="true" style={{
          width: 130, opacity: 0.85,
          position: 'absolute', left: 15, top: 10,
          animation: 'leafFloat 4s ease-in-out infinite',
        }} />
        {/* Puntos decorativos pequeños, animados */}
        {[
          { top:  2,  left: 8,   r: 2,   op: 0.3,  anim: 'dotFloat1 3.2s ease-in-out infinite' },
          { top: -4,  left: 52,  r: 1.5, op: 0.22, anim: 'dotFloat2 2.8s ease-in-out infinite 0.4s' },
          { top:  0,  left: 100, r: 2.5, op: 0.28, anim: 'dotFloat3 3.5s ease-in-out infinite 0.2s' },
          { top: 28,  left: -4,  r: 1.5, op: 0.2,  anim: 'dotFloat1 3.8s ease-in-out infinite 0.6s' },
          { top: 55,  left: -6,  r: 1.5, op: 0.18, anim: 'dotFloat2 3.1s ease-in-out infinite 0.1s' },
          { top: 62,  left: 128, r: 2,   op: 0.25, anim: 'dotFloat3 2.9s ease-in-out infinite 0.5s' },
          { top: 82,  left: 40,  r: 1.5, op: 0.2,  anim: 'dotFloat1 3.4s ease-in-out infinite 0.3s' },
          { top: 88,  left: 90,  r: 2,   op: 0.22, anim: 'dotFloat2 3.6s ease-in-out infinite 0.7s' },
        ].map((d, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: d.top, left: d.left,
            width: d.r * 2, height: d.r * 2,
            borderRadius: '50%',
            background: '#8FA882',
            opacity: d.op,
            animation: d.anim,
          }} />
        ))}
      </div>

    </section>
  );
}

// ── ITINERARIO ─────────────────────────────────────────────────
function ItinerarioSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);

  const items = [
    { time: '4:00 pm', label: 'Ceremonia Religiosa', sub: '', icon: 'church'    },
    { time: '5:30 pm', label: 'Cóctel',              sub: '',               icon: 'cocktail'  },
    { time: '7:00 pm', label: 'Cena & Celebración',  sub: '',               icon: 'celebrate' },
  ];

  // getTotalLength() dinámico
  useEffect(() => {
    if (!sectionRef.current) return;
    const strokes = sectionRef.current.querySelectorAll<SVGGeometryElement>('.it-dyn');
    strokes.forEach((el) => {
      try {
        const len = el.getTotalLength();
        el.style.strokeDasharray  = String(len);
        el.style.strokeDashoffset = String(len);
      } catch {
        el.style.strokeDasharray  = '200';
        el.style.strokeDashoffset = '200';
      }
    });
  }, []);

  // IntersectionObserver: activa animación al hacer scroll
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('it-visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.05, rootMargin: '0px 0px 40px 0px' });
    sectionRef.current?.querySelectorAll('.it-observe, .it-seg-obs').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);


  const svgIcon = (icon: string) => {
    const props = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: '#9f844d', strokeWidth: '1.8', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
    if (icon === 'church') return (
      <svg {...props}>
        <path className="it-dyn" d="M12 2v5"/><path className="it-dyn" d="M9.5 4.5h5"/>
        <path className="it-dyn" d="M5 22V10Q5 7 12 7Q19 7 19 10V22"/>
        <path className="it-dyn" d="M5 22h14"/><path className="it-dyn" d="M10 22v-6Q10 14 12 14Q14 14 14 16v6"/>
        <path className="it-dyn" d="M5 13h14"/>
      </svg>
    );
    if (icon === 'cocktail') return (
      <svg {...props}>
        <path className="it-dyn" d="M4 3h16L12 13Z"/><path className="it-dyn" d="M12 13v7"/>
        <path className="it-dyn" d="M8 20h8"/><path className="it-dyn" d="M15 6q1-1 2 0"/>
      </svg>
    );
    if (icon === 'dinner') return (
      <svg {...props}>
        {/* Tenedor */}
        <path className="it-dyn" d="M5 3v4a3 3 0 0 0 6 0V3" />
        <path className="it-dyn" d="M8 3v4" />
        <path className="it-dyn" d="M8 10v11" />
        {/* Cuchillo */}
        <path className="it-dyn" d="M16 21v-9c0-3.5 1.5-6 4-9v9a2 2 0 0 1-2 2v7" />
        <path className="it-dyn" d="M16 21h2" />
      </svg>
    );
    // Celebración: Bola de discoteca festiva con destellos radiantes
    return (
      <svg {...props}>
        {/* Cordón de suspensión y anclaje */}
        <path className="it-dyn" d="M12 2v3" />
        <path className="it-dyn" d="M10.5 5h3" />
        {/* Esfera de espejos */}
        <circle className="it-dyn" cx="12" cy="13" r="7.5" />
        {/* Cuadrícula horizontal de reflejos */}
        <path className="it-dyn" d="M4.6 13h14.8" />
        <path className="it-dyn" d="M6.5 9.5h11" />
        <path className="it-dyn" d="M6.5 16.5h11" />
        {/* Cuadrícula vertical de reflejos */}
        <path className="it-dyn" d="M12 5.5v15" />
        <path className="it-dyn" d="M8.5 7.5c-1.5 2-1.5 5 0 7.5s1 2.5 0 3.5" />
        <path className="it-dyn" d="M15.5 7.5c1.5 2 1.5 5 0 7.5s-1 2.5 0 3.5" />
        {/* Destellos de luz fiesta */}
        <path className="it-dyn" d="M20 3.5l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5Z" />
        <path className="it-dyn" d="M3.5 17l.4 1 1 .4-1 .4-.4 1-.4-1-1-.4 1-.4Z" />
      </svg>
    );
  };

  return (
    <section ref={sectionRef} style={{
      textAlign: 'center', background: 'var(--c-bg)',
      padding: '28px 28px 20px', position: 'relative',
      flex: 1, minHeight: '100dvh', boxSizing: 'border-box',
      animation: 'fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center',
    }}>

      <style>{`
        @keyframes itDraw    { to { stroke-dashoffset: 0; } }
        @keyframes flagWave  { 0%,100%{transform:skewY(-2deg)}50%{transform:skewY(3deg)} }
        @keyframes itSegGrow { from{height:0} to{height:100%} }

        .it-observe           { opacity:0; transform:translateX(20px); transition: opacity .7s ease, transform .7s cubic-bezier(.22,1,.36,1); }
        .it-observe.it-visible{ opacity:1; transform:none; }
        .it-seg-obs           { overflow:hidden; }
        .it-seg-obs .it-seg-line { height:0; transition: height .5s ease; }
        .it-seg-obs.it-visible .it-seg-line { height:100%; }

        .it-dyn { transition: none; }
        .it-visible .it-dyn  { animation: itDraw 1.4s ease-out .1s both; }
      `}</style>

      <h2 style={{
        fontFamily: 'var(--f-script)',
        fontSize: 'clamp(34px, 9vw, 44px)',
        color: '#A99261', lineHeight: 1.1,
        margin: '0 0 10px', fontWeight: 'normal',
      }}>Lugar</h2>

      {/* Datos del lugar */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        marginBottom: 14,
        animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s both',
      }}>
        <p style={{ fontFamily: 'var(--f-body)', fontSize: 14, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--c-text)', margin: 0, textAlign: 'center' }}>
          Club Campestre de Cali, Cancha de Polo
        </p>
        <p style={{ fontFamily: 'var(--f-body)', fontSize: 12, color: 'var(--c-muted)', letterSpacing: '0.04em', margin: 0 }}>
          Calle 5 con Carrera 100
        </p>
      </div>

      {/* Foto del lugar */}
      <img
        src={campoImg}
        alt="Club Campestre de Cali"
        style={{
          width: '92%', maxWidth: 300,
          aspectRatio: '4 / 3',
          objectFit: 'cover',
          borderRadius: 12,
          marginBottom: 16,
          boxShadow: '0 4px 18px rgba(100,75,30,0.14)',
          border: '1px solid var(--c-cream-dark)',
          animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s both',
        }}
      />

      {/* Título Itinerario */}
      <h2 style={{
        fontFamily: 'var(--f-script)',
        fontSize: 'clamp(34px, 9vw, 44px)',
        color: '#A99261', lineHeight: 1.1,
        margin: '0 0 18px', fontWeight: 'normal',
        animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s both',
      }}>Itinerario</h2>

      {/* Timeline */}
      <div style={{ width: '100%', maxWidth: 320 }}>
        {items.map((item, i) => (
          <div key={i}>
            <div className="it-observe" style={{ display: 'flex', alignItems: 'center', transitionDelay: `${i * 0.15}s` }}>
              <div style={{ minWidth: 68, textAlign: 'left', fontFamily: 'var(--f-body)', fontSize: 13, fontWeight: 600, letterSpacing: '0.03em', color: 'var(--c-gold)' }}>{item.time}</div>
              <div style={{ width: 50, height: 50, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--c-surface)', borderRadius: '50%', border: '1px solid var(--c-border)' }}>
                {svgIcon(item.icon)}
              </div>
              <div style={{ paddingLeft: 14, textAlign: 'left', flex: 1 }}>
                <p style={{ fontFamily: 'var(--f-body)', fontSize: 14, fontWeight: 600, color: 'var(--c-text)', margin: 0 }}>{item.label}</p>
                {item.sub && <p style={{ fontFamily: 'var(--f-body)', fontSize: 13, fontStyle: 'italic', color: 'var(--c-muted)', margin: '2px 0 0' }}>{item.sub}</p>}
              </div>
            </div>
            {i < items.length - 1 && (
              <div className="it-seg-obs" style={{ display: 'flex', height: 34 }}>
                <div style={{ minWidth: 68 }} />
                <div style={{ width: 50, display: 'flex', justifyContent: 'center' }}>
                  <div className="it-seg-line" style={{ width: 1, background: 'repeating-linear-gradient(to bottom,#C2B594 0,#C2B594 4px,transparent 4px,transparent 9px)' }}/>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

    </section>
  );
}

// ── DRESS CODE ─────────────────────────────────────────────────
function DressCodeSection() {
  return (
    <section style={{
      textAlign: 'center', background: 'var(--c-bg)',
      padding: '80px 32px 56px',
      animation: 'fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>

      <h2 style={{
        fontFamily: 'var(--f-script)',
        fontSize: 'clamp(38px, 10vw, 50px)',
        color: '#A99261', lineHeight: 1.1,
        margin: '0 0 8px', fontWeight: 'normal',
        animation: 'fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s both',
      }}>Dress Code</h2>

      <div style={{ width: 40, height: 1, background: 'var(--c-border)', margin: '0 auto 32px' }} />

      {/* Imagen */}
      <img
        src={dressImg}
        alt="Dress code referencia"
        style={{
          width: '72%', maxWidth: 240,
          objectFit: 'contain', maxHeight: 260,
          animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s both',
        }}
      />

      {/* Texto */}
      <div style={{
        marginTop: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        animation: 'fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.35s both',
      }}>
        <p style={{
          fontFamily: 'var(--f-body)', fontSize: 11, fontWeight: 600,
          letterSpacing: '0.28em', textTransform: 'uppercase',
          color: 'var(--c-text)',
        }}>Código de vestimenta</p>
        <p style={{
          fontFamily: 'var(--f-body)', fontSize: 15.5, fontStyle: 'italic',
          color: 'var(--c-muted)', lineHeight: 1.9, maxWidth: 280, textAlign: 'center',
        }}>
          Mujeres: Vestido largo<br/>
          <span style={{ fontSize: 13.5 }}>(zapatos cómodos para caminar sobre el pasto)</span><br/>
          Hombres: guayabera y pantalón beige
        </p>
      </div>

    </section>
  );
}

// ── REGALOS ────────────────────────────────────────────────────
function RegalosSection() {
  return (
    <section style={{
      textAlign: 'center', background: 'var(--c-bg)',
      padding: '32px 32px 20px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      animation: 'fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both',
    }}>
      <style>{`
        @keyframes sobreFlota {
          0%,100% { transform: translateY(0px) rotate(-2deg); }
          50%      { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes sobreFlota2 {
          0%,100% { transform: translateY(0px) rotate(3deg); }
          50%      { transform: translateY(-8px) rotate(-1deg); }
        }
        @keyframes sobreFlota3 {
          0%,100% { transform: translateY(0px) rotate(-1deg); }
          50%      { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes confettiDrift {
          0%   { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          100% { transform: translateY(-40px) rotate(30deg); opacity: 0; }
        }
      `}</style>

      <h2 style={{
        fontFamily: 'var(--f-script)',
        fontSize: 'clamp(38px, 10vw, 50px)',
        color: '#A99261', lineHeight: 1.1,
        margin: '0 0 8px', fontWeight: 'normal',
      }}>Nuestros regalos</h2>

      <div style={{ width: 40, height: 1, background: 'var(--c-border)', margin: '0 auto 32px' }} />

      <p style={{
        fontFamily: 'var(--f-body)', fontSize: 16.5, fontStyle: 'italic',
        color: 'var(--c-text)', lineHeight: 1.8,
        maxWidth: 290, marginBottom: 20,
      }}>
        Tu compañía es el mejor regalo.
      </p>
      <p style={{
        fontFamily: 'var(--f-body)', fontSize: 15,
        color: 'var(--c-muted)', lineHeight: 1.8,
        maxWidth: 290, textAlign: 'center',
      }}>
        Para quienes deseen tener un detalle con nosotros, hemos dispuesto una
      </p>
      <p style={{
        fontFamily: 'var(--f-body)', fontSize: 11, fontWeight: 600,
        letterSpacing: '0.28em', textTransform: 'uppercase',
        color: 'var(--c-gold)', marginTop: 8, marginBottom: 24,
      }}>
        lluvia de sobres
      </p>

      {/* Animación de sobres flotando — ahora debajo de "lluvia de sobres" */}
      <div style={{ position: 'relative', width: 180, height: 110, marginTop: 4 }}>
        {/* Sobre izquierdo */}
        <svg width="58" height="42" viewBox="0 0 58 42" fill="none"
          style={{ position: 'absolute', left: 4, top: 30, animation: 'sobreFlota 3.8s ease-in-out infinite 0.2s', opacity: 0.7 }}>
          <rect x="1" y="1" width="56" height="40" rx="3" fill="var(--c-surface)" stroke="#C2B594" strokeWidth="1.2"/>
          <path d="M1 4 L29 22 L57 4" stroke="#C2B594" strokeWidth="1.2" fill="none"/>
        </svg>
        {/* Sobre central (más grande, al frente) */}
        <svg width="72" height="52" viewBox="0 0 72 52" fill="none"
          style={{ position: 'absolute', left: '50%', top: 10, transform: 'translateX(-50%)', animation: 'sobreFlota2 4.2s ease-in-out infinite', zIndex: 2 }}>
          <rect x="1" y="1" width="70" height="50" rx="3" fill="var(--c-surface)" stroke="#9f844d" strokeWidth="1.4"/>
          <path d="M1 5 L36 28 L71 5" stroke="#9f844d" strokeWidth="1.4" fill="none"/>
          {/* Sellito corazón */}
          <path d="M36 36 C36 36 30 30 30 26 C30 23 33 22 36 25 C39 22 42 23 42 26 C42 30 36 36 36 36Z" fill="#9f844d" opacity="0.4"/>
        </svg>
        {/* Sobre derecho */}
        <svg width="58" height="42" viewBox="0 0 58 42" fill="none"
          style={{ position: 'absolute', right: 4, top: 34, animation: 'sobreFlota3 3.5s ease-in-out infinite 0.5s', opacity: 0.7 }}>
          <rect x="1" y="1" width="56" height="40" rx="3" fill="var(--c-surface)" stroke="#C2B594" strokeWidth="1.2"/>
          <path d="M1 4 L29 22 L57 4" stroke="#C2B594" strokeWidth="1.2" fill="none"/>
        </svg>
        {/* Puntitos decorativos subiendo */}
        {[
          { left: 30, top: 8,  delay: '0s',    size: 5 },
          { left: 90, top: 4,  delay: '0.6s',  size: 4 },
          { left: 60, top: 0,  delay: '1.2s',  size: 3 },
          { left: 140, top: 10, delay: '0.3s', size: 4 },
        ].map((d, i) => (
          <div key={i} style={{
            position: 'absolute', left: d.left, top: d.top,
            width: d.size, height: d.size, borderRadius: '50%',
            background: '#9f844d', opacity: 0.3,
            animation: `confettiDrift 2.4s ease-out ${d.delay} infinite`,
          }}/>
        ))}
      </div>

      {/* Datos bancarios */}
      <div style={{
        marginTop: 24, padding: '16px 24px',
        background: 'var(--c-surface)', borderRadius: 10,
        border: '1px solid var(--c-border)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        maxWidth: 270,
      }}>
        <p style={{ fontFamily: 'var(--f-body)', fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--c-muted)', margin: 0 }}>Ahorros NU</p>
        <p style={{ fontFamily: 'var(--f-body)', fontSize: 18, fontWeight: 700, color: 'var(--c-gold)', letterSpacing: '0.06em', margin: '2px 0' }}># 92855767</p>
        <div style={{ width: 30, height: 1, background: 'var(--c-border)', margin: '4px 0' }} />
        <p style={{ fontFamily: 'var(--f-body)', fontSize: 13, fontWeight: 600, color: 'var(--c-text)', margin: 0 }}>Juan Carlos Varela</p>
        <p style={{ fontFamily: 'var(--f-body)', fontSize: 12, color: 'var(--c-muted)', margin: 0 }}>CC: 1127228005</p>
      </div>
    </section>
  );
}

// ── RSVP ───────────────────────────────────────────────────────
function RsvpSection() {
  const [open, setOpen] = useState(false);
  const [asiste, setAsiste] = useState<'si' | 'no' | null>(null);
  const [sent, setSent] = useState(false);

  const WHATSAPP_NUMBER = '573158953019';

  const handleEnviar = () => {
    let msg = '';
    if (asiste === 'si') {
      msg = `Hola! Confirmo mi asistencia a la boda de María & Juanca 🌿\n\n✅ *Sí asistiré*\n👤 ${GUEST_NAME}`;
    } else {
      msg = `Hola! Gracias por la invitación a la boda de María & Juanca 🌿\n\n❌ Lamentablemente no podré asistir.\n\n— ${GUEST_NAME}`;
    }
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => { setAsiste(null); setSent(false); }, 300);
  };

  const btnBase: React.CSSProperties = {
    fontFamily: 'var(--f-body)', fontSize: 13, fontWeight: 600,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    padding: '12px 20px', borderRadius: 30, cursor: 'pointer',
    transition: 'all 0.18s ease', border: '1.5px solid transparent',
  };

  return (
    <>
      <section style={{
        textAlign: 'center', background: 'var(--c-bg)',
        padding: '20px 32px 32px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        animation: 'fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both',
      }}>
        <h2 style={{
          fontFamily: 'var(--f-script)',
          fontSize: 'clamp(38px, 10vw, 50px)',
          color: '#A99261', lineHeight: 1.1,
          margin: '0 0 8px', fontWeight: 'normal',
        }}>RSVP</h2>

        <div style={{ width: 40, height: 1, background: 'var(--c-border)', margin: '0 auto 24px' }} />

        <p style={{
          fontFamily: 'var(--f-body)', fontSize: 13, fontWeight: 600,
          letterSpacing: '0.16em', color: 'var(--c-muted)',
          marginBottom: 28, textTransform: 'uppercase',
        }}>
          Fecha límite: <span style={{ color: 'var(--c-gold)' }}>02.10.26</span>
        </p>

        <button
          onClick={() => setOpen(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            padding: '14px clamp(16px, 5vw, 30px)',
            background: 'var(--c-surface)',
            border: '1px solid var(--c-border)',
            borderRadius: 40,
            fontFamily: 'var(--f-body)',
            color: 'var(--c-text)',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
            boxSizing: 'border-box',
            boxShadow: '0 2px 10px rgba(100,75,30,0.08)',
            cursor: 'pointer',
          }}
        >
          <span style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 'clamp(11px, 3.3vw, 13px)',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.23-1.63A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52z" fill="#8FA882" opacity="0.8"/>
              <path d="M17.47 14.83c-.25-.13-1.47-.73-1.7-.81-.23-.08-.4-.13-.56.13-.17.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.07s.89 2.4 1.02 2.57c.13.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.23-.16-.48-.29z" fill="var(--c-bg)"/>
            </svg>
            Confirmar asistencia
          </span>
        </button>
      </section>

      {/* ── Modal RSVP ── */}
      {open && (
        <div
          onClick={handleClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 9000,
            background: 'rgba(44,36,22,0.55)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            animation: 'fadeUp 0.22s ease both',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 460,
              background: 'var(--c-bg)',
              borderRadius: '24px 24px 0 0',
              padding: '32px 28px 40px',
              boxShadow: '0 -8px 40px rgba(44,36,22,0.18)',
            }}
          >
            {/* Handle */}
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--c-border)', margin: '0 auto 24px' }} />

            {!sent ? (
              <>
                <p style={{
                  fontFamily: 'var(--f-body)', fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.24em', textTransform: 'uppercase',
                  color: 'var(--c-muted)', textAlign: 'center', marginBottom: 28,
                }}>¿Confirmas tu asistencia?</p>

                {/* Sí / No */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                  {(['si', 'no'] as const).map(op => (
                    <button
                      key={op}
                      onClick={() => setAsiste(op)}
                      style={{
                        ...btnBase,
                        flex: 1,
                        background: asiste === op ? (op === 'si' ? '#A99261' : '#8C6032') : 'var(--c-surface)',
                        color: asiste === op ? '#FAF7F0' : 'var(--c-muted)',
                        borderColor: asiste === op ? 'transparent' : 'var(--c-border)',
                      }}
                    >
                      {op === 'si' ? '✓ Sí asistiré' : '✗ No podré ir'}
                    </button>
                  ))}
                </div>

                {/* Enviar */}
                {asiste !== null && (
                  <button
                    onClick={handleEnviar}
                    style={{
                      width: '100%', padding: '15px',
                      background: '#4A6644', color: '#FAF7F0',
                      borderRadius: 40, border: 'none', cursor: 'pointer',
                      fontFamily: 'var(--f-body)', fontSize: 13, fontWeight: 600,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.23-1.63A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52z" fill="#FAF7F0" opacity="0.9"/>
                      <path d="M17.47 14.83c-.25-.13-1.47-.73-1.7-.81-.23-.08-.4-.13-.56.13-.17.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.07s.89 2.4 1.02 2.57c.13.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.23-.16-.48-.29z" fill="#4A6644"/>
                    </svg>
                    Enviar por WhatsApp
                  </button>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <p style={{
                  fontFamily: 'var(--f-script)', fontSize: 'clamp(28px, 8vw, 38px)',
                  color: '#A99261', marginBottom: 12, lineHeight: 1.1,
                }}>¡Gracias!</p>
                <p style={{
                  fontFamily: 'var(--f-body)', fontSize: 13, color: 'var(--c-muted)',
                  letterSpacing: '0.06em', marginBottom: 28, lineHeight: 1.6,
                }}>
                  {asiste === 'si'
                    ? 'Tu confirmación fue enviada. ¡Los esperamos con mucho amor!'
                    : 'Recibimos tu mensaje. ¡Te queremos igual!'}
                </p>
                <button
                  onClick={handleClose}
                  style={{
                    ...btnBase,
                    background: 'var(--c-surface)',
                    color: 'var(--c-muted)',
                    borderColor: 'var(--c-border)',
                    padding: '12px 32px',
                  }}
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ── CIERRE ─────────────────────────────────────────────────────
function CierreSection() {
  return (
    <section style={{
      textAlign: 'center', background: 'var(--c-bg)',
      padding: '12px 32px 20px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      animation: 'fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both',
    }}>
      {/* Imagen recién casados */}
      <img
        src={cierreImg}
        alt="María y Juanca"
        style={{
          width: '72%', maxWidth: 240,
          borderRadius: 4,
          objectFit: 'cover',
          marginBottom: 24,
          opacity: 0.95,
        }}
      />

      {/* Nombres grandes */}
      <p style={{
        fontFamily: 'var(--f-script)',
        fontSize: 'clamp(44px, 12vw, 60px)',
        color: '#A99261', lineHeight: 1.05,
        margin: '0 0 14px', fontWeight: 'normal',
      }}>María &amp; Juanca</p>

      {/* Corazón */}
      <svg width="22" height="20" viewBox="0 0 24 22" fill="none" style={{ marginBottom: 16 }}>
        <path d="M12 20 C12 20 2 13 2 6.5 C2 3.4 4.4 1 7.5 1 C9.5 1 11.2 2.1 12 3.7 C12.8 2.1 14.5 1 16.5 1 C19.6 1 22 3.4 22 6.5 C22 13 12 20 12 20Z"
          fill="#9f844d" opacity="0.5"/>
      </svg>

      {/* Divisor */}
      <div style={{ width: 40, height: 1, background: 'var(--c-border)', marginBottom: 16 }} />

      {/* Fecha */}
      <p style={{
        fontFamily: 'var(--f-body)', fontSize: 16, fontWeight: 500,
        letterSpacing: '0.2em', color: 'var(--c-text)',
        marginBottom: 4,
      }}>19 · 12 · 2026</p>
      <p style={{
        fontFamily: 'var(--f-body)', fontSize: 11, fontWeight: 600,
        letterSpacing: '0.28em', textTransform: 'uppercase',
        color: 'var(--c-muted)',
      }}>Cali, Colombia</p>

      {/* Hoja decorativa */}
      <img src={hojaImg} alt="" aria-hidden="true" style={{
        width: 70, opacity: 0.5, marginTop: 16,
        animation: 'leafFloat 4s ease-in-out infinite',
      }} />
    </section>
  );
}

const MUSIC_SRC = '/wedding-song.mp3';
const MUSIC_START_SECOND = 0;

let globalAudio: HTMLAudioElement | null = null;
let setGlobalPlaying: ((p: boolean) => void) | null = null;
let audioStartInitialized = false;

function applyStartTime(audio: HTMLAudioElement) {
  if (!audioStartInitialized) {
    try {
      if (audio.currentTime < 1) {
        audio.currentTime = MUSIC_START_SECOND;
      }
      audioStartInitialized = true;
    } catch {
      // Browser may delay until metadata is ready
    }
  }
}

function getAudio(): HTMLAudioElement {
  if (!globalAudio) {
    globalAudio = new Audio(MUSIC_SRC);
    globalAudio.loop = true;
    globalAudio.volume = 0.7;
    globalAudio.preload = 'auto';

    globalAudio.addEventListener('loadedmetadata', () => {
      if (!audioStartInitialized && globalAudio) {
        try {
          if (globalAudio.currentTime < 1) {
            globalAudio.currentTime = MUSIC_START_SECOND;
          }
          audioStartInitialized = true;
        } catch {}
      }
    });

    globalAudio.addEventListener('canplay', () => {
      if (!audioStartInitialized && globalAudio) {
        try {
          if (globalAudio.currentTime < 1) {
            globalAudio.currentTime = MUSIC_START_SECOND;
          }
          audioStartInitialized = true;
        } catch {}
      }
    });

    globalAudio.addEventListener('play', () => {
      if (setGlobalPlaying) setGlobalPlaying(true);
    });
    globalAudio.addEventListener('pause', () => {
      if (setGlobalPlaying) setGlobalPlaying(false);
    });
    globalAudio.addEventListener('ended', () => {
      if (setGlobalPlaying) setGlobalPlaying(false);
    });
  }
  return globalAudio;
}

let userManuallyPaused = false;

// @ts-ignore
function startAudioPlayback() {
  if (userManuallyPaused) return;
  try {
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (AC) {
      const ctx = new AC();
      ctx.resume();
    }
  } catch {}

  const audio = getAudio();
  applyStartTime(audio);
  const promise = audio.play();
  if (promise !== undefined) {
    promise
      .then(() => {
        if (!audioStartInitialized || audio.currentTime < 1) {
          try {
            audio.currentTime = MUSIC_START_SECOND;
            audioStartInitialized = true;
          } catch {}
        }
        if (setGlobalPlaying) setGlobalPlaying(true);
      })
      .catch((err) => {
        console.warn('Autoplay prevented by browser, waiting for user gesture:', err);
      });
  }
}

// @ts-ignore
function toggleAudioPlayback(currentlyPlaying: boolean) {
  const audio = getAudio();
  if (currentlyPlaying) {
    userManuallyPaused = true;
    audio.pause();
    if (setGlobalPlaying) setGlobalPlaying(false);
  } else {
    userManuallyPaused = false;
    applyStartTime(audio);
    audio.play().then(() => {
      if (setGlobalPlaying) setGlobalPlaying(true);
    }).catch((err) => console.warn('Play error:', err));
  }
}

// @ts-ignore
function FixedMusicPlayer({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {

  const floats = [
    { sym:'♪', x: -4, anim:'noteRise',  d:'0s',    sz:21 },
    { sym:'♡', x: 24, anim:'noteRise2', d:'0.65s', sz:18 },
    { sym:'♫', x:-20, anim:'noteRise3', d:'1.2s',  sz:19 },
    { sym:'♡', x: 12, anim:'noteRise',  d:'1.8s',  sz:16 },
    { sym:'♪', x: -10,anim:'noteRise2', d:'2.4s',  sz:20 },
    { sym:'♡', x: 28, anim:'noteRise3', d:'3.0s',  sz:15 },
    { sym:'♫', x:  2, anim:'noteRise',  d:'3.5s',  sz:17 },
  ];

  const wooferAnim = playing ? 'wooferPulse 0.5s ease-in-out infinite alternate' : 'none';

  return (
    <>
      <style>{`
        @keyframes noteRise {
          0%   { opacity:0; transform:translateY(0) scale(0.6) rotate(-10deg); }
          20%  { opacity:1; }
          100% { opacity:0; transform:translateY(-340px) scale(1.2) rotate(15deg); }
        }
        @keyframes noteRise2 {
          0%   { opacity:0; transform:translateY(0) scale(0.6) rotate(8deg); }
          20%  { opacity:1; }
          100% { opacity:0; transform:translateY(-300px) scale(1.1) rotate(-20deg); }
        }
        @keyframes noteRise3 {
          0%   { opacity:0; transform:translateY(0) scale(0.5); }
          25%  { opacity:1; }
          100% { opacity:0; transform:translateY(-360px) scale(1.3) rotate(10deg); }
        }
        @keyframes wooferPulse {
          from { r: 11; }
          to   { r: 12.5; }
        }
        @keyframes ledBlink {
          0%,100% { opacity:1; }
          50%     { opacity:0.3; }
        }
        @keyframes speakerPulse {
          0%,100% { transform: scale(1); filter: drop-shadow(0 3px 8px rgba(159,132,77,0.25)); }
          50%     { transform: scale(1.06); filter: drop-shadow(0 4px 14px rgba(159,132,77,0.5)); }
        }
      `}</style>


      {/* Contenedor fijo izquierda */}
      <div style={{
        position: 'fixed',
        bottom: 14,
        left: 'max(6px, calc(50vw - 234px))',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pointerEvents: 'none',
        userSelect: 'none',
        overflow: 'visible',
      }}>
        {/* Notas y corazones — absolute sobre el contenedor fixed */}
        {playing && floats.map((n, i) => (
          <span key={i} style={{
            position: 'absolute',
            bottom: '100%',
            left: `calc(50% + ${n.x}px)`,
            fontSize: n.sz,
            color: '#9f844d',
            pointerEvents: 'none',
            lineHeight: 1,
            animation: `${n.anim} 3.2s ease-out ${n.d} infinite`,
          }}>{n.sym}</span>
        ))}

        {/* Bafle botón interactivo — con pointerEvents: auto para móvil */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
          }}
          aria-label={playing ? 'Pausar música' : 'Reproducir música'}
          style={{
            pointerEvents: 'auto',
            cursor: 'pointer',
            position: 'relative',
            background: 'none',
            border: 'none',
            padding: 0,
            outline: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
        >
          <div style={{ position: 'relative' }}>
            <svg
              width="58" height="70"
              viewBox="0 0 58 70"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: 'block', animation: !playing ? 'speakerPulse 2s ease-in-out infinite' : 'none' }}
            >
              {/* Cuerpo caja — solo stroke */}
              <rect x="3" y="2" width="52" height="66" rx="6"
                fill="rgba(250,246,238,0.92)" stroke="#9f844d" strokeWidth="1.5"/>
              {/* División tweeter / woofer */}
              <line x1="3" y1="20" x2="55" y2="20" stroke="#c8b97a" strokeWidth="0.8" strokeDasharray="3 3"/>

              {/* Tweeter — círculo pequeño arriba */}
              <circle cx="29" cy="12" r="5.5" fill="none" stroke="#9f844d" strokeWidth="1.2"/>
              <circle cx="29" cy="12" r="2.5" fill="none" stroke="#c8b97a" strokeWidth="1"/>
              <circle cx="29" cy="12" r="0.9" fill="#9f844d"/>

              {/* Woofer — círculo grande */}
              <circle cx="29" cy="42" r="17" fill="none" stroke="#9f844d" strokeWidth="1.4"/>
              <circle cx="29" cy="42" r="12.5" fill="none" stroke="#c8b97a" strokeWidth="1"/>
              <circle cx="29" cy="42" r="8" fill="none" stroke="#9f844d" strokeWidth="0.9"/>
              {/* Cono — pulsa cuando suena */}
              <circle cx="29" cy="42" r="4.5"
                fill="rgba(159,132,77,0.15)" stroke="#9f844d" strokeWidth="1.2"
                style={{ animation: wooferAnim }}/>
              <circle cx="29" cy="42" r="1.5" fill="#9f844d"/>

              {/* Barra inferior controles */}
              <rect x="3" y="62" width="52" height="6" rx="0 0 6 6"
                fill="rgba(200,185,122,0.18)" stroke="none"/>
              <line x1="3" y1="62" x2="55" y2="62" stroke="#c8b97a" strokeWidth="0.8"/>

              {/* LED */}
              <circle cx="48" cy="65" r="2"
                fill={playing ? '#9f844d' : '#d6c99a'}
                style={playing ? { animation:'ledBlink 1s ease-in-out infinite' } : {}}/>

              {/* Icono play/pause centrado en barra */}
              {playing
                ? <><rect x="25" y="63.5" width="2.5" height="3" rx="0.5" fill="#9f844d"/><rect x="30" y="63.5" width="2.5" height="3" rx="0.5" fill="#9f844d"/></>
                : <path d="M26 63.5 L26 66.5 L32 65 Z" fill="#9f844d"/>
              }
            </svg>

            {/* Icono flotante destacado cuando está pausado */}
            {!playing && (
              <div style={{
                position: 'absolute', top: '56%', left: '50%', transform: 'translate(-50%, -50%)',
                width: 22, height: 22, borderRadius: '50%',
                background: 'rgba(107, 82, 37, 0.92)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#FAF7F0" style={{ marginLeft: 1 }}>
                  <path d="M5 3l16 9-16 9V3z" />
                </svg>
              </div>
            )}
          </div>

          {/* Pastilla indicadora Pausar / Play */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '3px 8px',
            background: 'rgba(250,247,240,0.96)',
            border: '1px solid #9f844d',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(100,75,30,0.18)',
            color: '#6B5225',
            fontFamily: 'var(--f-body)',
            fontSize: 9.5,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            {playing ? (
              <>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="#6B5225">
                  <rect x="5" y="3" width="4" height="18" rx="1" />
                  <rect x="15" y="3" width="4" height="18" rx="1" />
                </svg>
                <span>Pausar</span>
              </>
            ) : (
              <>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="#6B5225">
                  <path d="M5 3l16 9-16 9V3z" />
                </svg>
                <span>Play</span>
              </>
            )}
          </div>
        </button>
      </div>
    </>
  );
}

// ── GOLF PROGRESS BAR (horizontal fijo al fondo) ───────────────
const CONFETTI_COLORS = ['#9f844d','#C2B594','#8FA882','#D4C4A0','#B8A878'];
// @ts-ignore
function GolfProgressBar({ pct }: { pct: number }) {
  const scored = pct >= 97;
  const [burst, setBurst] = useState(false);
  const [particles, setParticles] = useState<{id:number;x:number;y:number;color:string;angle:number;speed:number}[]>([]);

  useEffect(() => {
    if (scored && !burst) {
      setBurst(true);
      setParticles(Array.from({length: 18}, (_, i) => ({
        id: i,
        x: 0, y: 0,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        angle: (i / 18) * 360,
        speed: 28 + Math.random() * 24,
      })));
      setTimeout(() => setParticles([]), 1800);
    }
    if (!scored) { setBurst(false); }
  }, [scored, burst]);

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 480,
      height: 72, zIndex: 100,
      display: 'flex', alignItems: 'flex-end',
      padding: '0 16px 10px 16px',
      background: 'linear-gradient(to top, var(--c-bg) 60%, transparent)',
      pointerEvents: 'none',
      boxSizing: 'border-box',
      overflow: 'visible',
    }}>
      <style>{`
        @keyframes flagWaveH    { 0%,100%{transform:skewX(-3deg)} 50%{transform:skewX(4deg)} }
        @keyframes flagWaveFast { 0%,100%{transform:skewX(-8deg) scaleX(1.1)} 50%{transform:skewX(10deg) scaleX(0.9)} }
        @keyframes ballDrop     { 0%{transform:translateY(-50%) scale(1)} 60%{transform:translateY(6px) scale(0.7)} 100%{transform:translateY(6px) scale(0)} }
        @keyframes holePulse    { 0%,100%{transform:translateX(-50%) scale(1)} 50%{transform:translateX(-50%) scale(1.6)} }
        @keyframes confettiFly  { 0%{opacity:1;transform:translate(0,0) rotate(0deg) scale(1)} 100%{opacity:0;transform:var(--cf-end) rotate(540deg) scale(0.3)} }
        @keyframes scoreLabel   { 0%{opacity:0;transform:translateY(4px)} 30%{opacity:1;transform:translateY(-16px)} 80%{opacity:1;transform:translateY(-20px)} 100%{opacity:0;transform:translateY(-28px)} }
      `}</style>

      {/* Línea de pista */}
      <div style={{
        flex: 1, height: 1, position: 'relative',
        background: 'repeating-linear-gradient(to right,#D9D2C0 0,#D9D2C0 4px,transparent 4px,transparent 9px)',
        marginRight: 6,
      }}>
        {/* Pelota */}
        {!scored && (
          <div style={{
            position: 'absolute',
            left: `calc(${pct}% - 7px)`,
            top: '50%', transform: 'translateY(-50%)',
            width: 14, height: 14, borderRadius: '50%',
            background: 'var(--c-bg)',
            border: '1.5px solid #C2B594',
            boxShadow: '0 1px 6px rgba(0,0,0,0.12)',
            transition: 'left 0.25s ease',
          }}/>
        )}
        {/* Pelota cayendo al hoyo */}
        {scored && (
          <div style={{
            position: 'absolute',
            right: -7, top: '50%',
            width: 14, height: 14, borderRadius: '50%',
            background: 'var(--c-bg)',
            border: '1.5px solid #C2B594',
            animation: 'ballDrop 0.7s cubic-bezier(0.4,0,1,1) 0.1s both',
          }}/>
        )}
      </div>

      {/* Banderín */}
      <div style={{ position: 'relative', width: 22, height: 68, flexShrink: 0, marginBottom: 4 }}>
        {/* Confeti burst — centrado respecto al viewport */}
        {particles.map(p => (
          <div key={p.id} style={{
            position: 'fixed', bottom: 72, right: 16,
            width: p.id % 3 === 0 ? 5 : 4, height: p.id % 3 === 0 ? 5 : 4,
            borderRadius: p.id % 2 === 0 ? '50%' : 1,
            background: p.color,
            ['--cf-end' as string]: `translate(${Math.cos(p.angle * Math.PI/180) * p.speed}px, ${Math.sin(p.angle * Math.PI/180) * p.speed - 30}px)`,
            animation: `confettiFly 1.6s cubic-bezier(0.2,0.8,0.4,1) ${p.id * 0.03}s both`,
          }}/>
        ))}

        {/* "¡Nos casamos!" — sale hacia el centro de la pantalla */}
        {scored && (
          <div style={{
            position: 'fixed', bottom: 78,
            left: '50%', transform: 'translateX(-50%)',
            fontFamily: 'var(--f-body)', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: '#9f844d', whiteSpace: 'nowrap',
            pointerEvents: 'none',
            animation: 'scoreLabel 2.2s ease-out 0.15s both',
          }}>¡Nos casamos! 🎉</div>
        )}

        {/* Palo */}
        <div style={{ position: 'absolute', left: 0, bottom: 0, width: 1.5, height: 68, background: scored ? '#9f844d' : '#C2B594', borderRadius: 1, transition: 'background 0.4s' }}/>
        {/* Hoyo — siempre visible, pulsa al hacer gol */}
        <div style={{
          position: 'absolute', bottom: -3, left: '50%',
          width: 14, height: 5,
          borderRadius: '50%', background: '#C2B594', opacity: scored ? 0.7 : 0.35,
          transform: 'translateX(-50%)',
          transition: 'opacity 0.4s',
          animation: scored ? 'holePulse 1s ease-in-out 0.7s 2' : 'none',
        }}/>
        {/* Banderita triangular */}
        <div style={{
          position: 'absolute', left: 2, top: 0,
          width: 0, height: 0,
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderLeft: '18px solid #9f844d',
          opacity: scored ? 1 : 0.85,
          transformOrigin: 'left center',
          animation: scored ? 'flagWaveFast 0.4s ease-in-out infinite' : 'flagWaveH 1.6s ease-in-out infinite',
        }}/>
      </div>
    </div>
  );
}

// ── FLECHA SCROLL ──────────────────────────────────────────────
function ScrollArrow({ mainRef, totalPages }: { mainRef: React.RefObject<HTMLElement | null>; totalPages: number }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => {
      const pageH = el.clientHeight;
      const page = Math.round(el.scrollTop / pageH);
      setCurrentPage(page);
      setVisible(page < totalPages - 1);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [mainRef, totalPages]);

  // @ts-ignore
  void currentPage;

  if (!visible) return null;

  return (
    <div
      onClick={() => {
        const el = mainRef.current;
        if (!el) return;
        el.scrollBy({ top: el.clientHeight, behavior: 'smooth' });
      }}
      style={{
        position: 'fixed', bottom: 22, left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, pointerEvents: 'auto', cursor: 'pointer',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
        padding: '8px 16px',
      }}
    >
      <style>{`
        @keyframes arrowBounce {
          0%, 100% { transform: translateY(0px); opacity: 0.5; }
          50%       { transform: translateY(6px); opacity: 1; }
        }
      `}</style>
      <svg
        width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="#9f844d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        style={{ animation: 'arrowBounce 1.8s ease-in-out infinite' }}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

// ── APP ────────────────────────────────────────────────────────
export default function App() {
  const initS = params.get('s');
  const skipOverlay = initS === 'portada' || initS === 'parents' || initS === 'itinerario' || initS === 'dresscode';
  const [overlay,   setOverlay]   = useState<'envelope' | 'loading' | null>(
    skipOverlay ? null : initS === 'loading' ? 'loading' : 'envelope'
  );
  // @ts-ignore
  const [scrollPct, setScrollPct] = useState(0);
  const mainRef = useRef<HTMLElement>(null);
  // @ts-ignore
  const [musicPlaying, setMusicPlaying] = useState(false);

  useEffect(() => {
    setGlobalPlaying = (p: boolean) => setMusicPlaying(p);
    const removeTouchListeners = () => {
      window.removeEventListener('touchstart', onFirstTouch);
      window.removeEventListener('pointerdown', onFirstTouch);
      window.removeEventListener('click', onFirstTouch);
    };
    const onFirstTouch = () => { removeTouchListeners(); if (!userManuallyPaused) startAudioPlayback(); };
    window.addEventListener('touchstart', onFirstTouch, { passive: true });
    window.addEventListener('pointerdown', onFirstTouch, { passive: true });
    window.addEventListener('click', onFirstTouch);
    return () => { setGlobalPlaying = null; removeTouchListeners(); };
  }, []);

  const handleEnvelopeOpen = () => {
    setOverlay('loading');
  };

  const handleStartAudio = () => { startAudioPlayback(); };

  return (
    <>
      {overlay === 'envelope' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <EnvelopeScene onOpen={handleEnvelopeOpen} onStartAudio={handleStartAudio} />
        </div>
      )}
      {overlay === 'loading' && <RamaPreloader onDone={() => setOverlay(null)} />}
      {overlay === null && (
        <main ref={mainRef} style={{
          maxWidth: 480, margin: '0 auto', background: 'var(--c-bg)',
          height: '100dvh', overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch',
        }}>
          {/* Página 1 — Portada */}
          <div style={{ minHeight: '100dvh', scrollSnapAlign: 'start' }}>
            <PortadaSection />
          </div>
          {/* Página 2 — Padres */}
          <div style={{ minHeight: '100dvh', scrollSnapAlign: 'start' }}>
            <ParentsSection />
          </div>
          {/* Página 3 — Lugar + Itinerario */}
          <div style={{ minHeight: '100dvh', scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column' }}>
            <ItinerarioSection />
          </div>
          {/* Página 4 — Dress Code */}
          <div style={{ minHeight: '100dvh', scrollSnapAlign: 'start' }}>
            <DressCodeSection />
          </div>
          {/* Página 5 — Regalos */}
          <div style={{ minHeight: '100dvh', scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <RegalosSection />
          </div>
          {/* Página 6 — RSVP + Cierre */}
          <div style={{ minHeight: '100dvh', scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column' }}>
            <RsvpSection />
            <CierreSection />
          </div>
        </main>
      )}
      {/* Música desactivada */}
      {/* {overlay === null && <FixedMusicPlayer playing={musicPlaying} onToggle={toggleMusic} />} */}
      {/* Barra golf desactivada */}
      {/* {overlay === null && <GolfProgressBar pct={scrollPct} />} */}
      {overlay === null && <ScrollArrow mainRef={mainRef} totalPages={6} />}
    </>
  );
}
