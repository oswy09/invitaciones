import { useEffect, useRef, useState } from 'react';
import fotoNino from '../assets/foto-nino.jpg';

interface Props {
  nombre:  string;
  evento:  { fecha: string; hora: string; lugar: string; nota: string };
}

const FONT_TITLE = "'Anton', Impact, sans-serif";
const FONT_BODY  = "'Montserrat', system-ui, sans-serif";

const FLAG_COLORS = [
  '#006600','#DA291C','#FEDD00',
  '#006600','#DA291C','#FEDD00',
  '#006600','#DA291C','#FEDD00',
  '#006600','#DA291C','#FEDD00',
];

const CONFETTI_COLORS = ['#DA291C','#FEDD00','#006600','#1d4ed8','#e0e7ff','#f97316','#a855f7','#ec4899'];

function rnd(a: number, b: number) { return a + Math.random() * (b - a); }

function useConfetti(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    type P = { x:number; y:number; w:number; h:number; color:string; angle:number; spin:number; vx:number; vy:number; isBall:boolean };
    const N = 80;
    const particles: P[] = [];
    for (let i = 0; i < N + 2; i++) {
      const isBall = i >= N;
      particles.push({ x:rnd(0,canvas.width), y:rnd(-canvas.height*0.7,-10),
        w:isBall?rnd(14,22):rnd(6,13), h:isBall?0:rnd(4,9),
        color:CONFETTI_COLORS[Math.floor(Math.random()*CONFETTI_COLORS.length)],
        angle:rnd(0,Math.PI*2), spin:rnd(-0.07,0.07), vx:rnd(-1.1,1.1), vy:rnd(1.6,3.4), isBall });
    }
    let raf: number;
    const tick = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for (const p of particles) {
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.angle);
        if (p.isBall) {
          const r = p.w/2;
          ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2);
          ctx.fillStyle='#fff'; ctx.shadowColor='rgba(0,0,0,0.28)'; ctx.shadowBlur=4; ctx.fill();
          ctx.shadowBlur=0; ctx.strokeStyle='#222'; ctx.lineWidth=1; ctx.stroke();
          ctx.beginPath();
          for (let k=0;k<5;k++) { const a=(k/5)*Math.PI*2-Math.PI/2, rk=r*0.42; k===0?ctx.moveTo(Math.cos(a)*rk,Math.sin(a)*rk):ctx.lineTo(Math.cos(a)*rk,Math.sin(a)*rk); }
          ctx.closePath(); ctx.fillStyle='#222'; ctx.fill();
        } else { ctx.fillStyle=p.color; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); }
        ctx.restore();
        p.x+=p.vx; p.y+=p.vy; p.angle+=p.spin; p.vx+=rnd(-0.04,0.04);
        if (p.y>canvas.height+30) { p.y=rnd(-60,-10); p.x=rnd(0,canvas.width); p.vy=rnd(1.6,3.4); }
      }
      raf=requestAnimationFrame(tick);
    };
    tick();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
}

const POSICIONES = [
  'Delantero','Mediocampista','Defensa','Portero','Extremo derecho','Extremo izquierdo','Lateral','Líbero (hincha)',
];

/* ── Modal confirmar asistencia ── */
function RsvpModal({ onClose }: { onClose: () => void }) {
  const [guests, setGuests]   = useState(1);
  const [posicion, setPosicion] = useState('');
  const WA = 'https://wa.me/573057502790';

  const sendYes = () => {
    const pos = posicion ? `, quiero jugar de ${posicion}` : '';
    const msg = encodeURIComponent(`¡Hola! Confirmo mi asistencia al cumpleaños de Matías 🎉 Iremos ${guests} persona${guests > 1 ? 's' : ''}${pos}. ¡Nos vemos en la cancha!`);
    window.open(`${WA}?text=${msg}`, '_blank');
    onClose();
  };
  const sendNo = () => {
    const msg = encodeURIComponent(`Hola, lamentablemente no podré asistir al cumpleaños de Matías 😢 ¡Que lo disfruten mucho!`);
    window.open(`${WA}?text=${msg}`, '_blank');
    onClose();
  };

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:50,
      background:'rgba(0,0,0,0.55)', backdropFilter:'blur(3px)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:'0 20px',
    }} onClick={onClose}>
      <div style={{
        background:'#fff', borderRadius:20, padding:'26px 22px',
        width:'100%', maxWidth:320,
        boxShadow:'0 24px 60px rgba(0,0,0,0.22)',
        animation:'modalIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both',
      }} onClick={e => e.stopPropagation()}>
        <style>{`
          @keyframes modalIn { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
          .fc-select {
            width:100%; padding:11px 14px;
            border:1.5px solid #e5e7eb; border-radius:10px;
            font-family:${FONT_BODY}; font-size:13px; color:#111827;
            background:#f9fafb; cursor:pointer;
            appearance:none; -webkit-appearance:none;
            background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
            background-repeat:no-repeat; background-position:right 12px center;
            padding-right:36px;
          }
          .fc-select:focus { outline:none; border-color:#0c2340; }
        `}</style>

        <p style={{ fontFamily:FONT_TITLE, fontSize:22, color:'#0c2340', textAlign:'center', marginBottom:4 }}>
          ¿Vas al partido?
        </p>
        <p style={{ fontFamily:FONT_BODY, fontSize:12, color:'#6b7280', textAlign:'center', marginBottom:20 }}>
          Cuéntanos cuántos van a venir
        </p>

        {/* Personas */}
        <p style={{ fontFamily:FONT_BODY, fontSize:10, fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase', color:'#9ca3af', marginBottom:8 }}>
          Número de personas
        </p>
        <div style={{ display:'flex', gap:8, marginBottom:18, flexWrap:'wrap' }}>
          {[1,2,3,4,5,6].map(n => (
            <button key={n} onClick={() => setGuests(n)} style={{
              width:44, height:44, borderRadius:10, border:'2px solid',
              borderColor: guests===n ? '#0c2340' : '#e5e7eb',
              background: guests===n ? '#0c2340' : '#f9fafb',
              color: guests===n ? '#fff' : '#374151',
              fontFamily:FONT_TITLE, fontSize:18,
              cursor:'pointer', transition:'all 0.15s',
            }}>{n}</button>
          ))}
        </div>

        {/* Posición */}
        <p style={{ fontFamily:FONT_BODY, fontSize:10, fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase', color:'#9ca3af', marginBottom:8 }}>
          ¿Qué posición deseas jugar?
        </p>
        <select className="fc-select" value={posicion} onChange={e => setPosicion(e.target.value)} style={{ marginBottom:20 }}>
          <option value="">Selecciona una posición…</option>
          {POSICIONES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        {/* Botones */}
        <button onClick={sendYes} style={{
          width:'100%', padding:'13px 0', borderRadius:10, border:'none',
          background:'#0c2340', color:'#fff',
          fontFamily:FONT_BODY, fontSize:13, fontWeight:700,
          cursor:'pointer', marginBottom:10,
        }}>
          ⚽ Sí, allí estaré
        </button>
        <button onClick={sendNo} style={{
          width:'100%', padding:'13px 0', borderRadius:10,
          border:'1.5px solid #e5e7eb', background:'transparent',
          color:'#6b7280', fontFamily:FONT_BODY, fontSize:13, fontWeight:600,
          cursor:'pointer',
        }}>
          No podré ir
        </button>
        <button onClick={onClose} style={{
          display:'block', margin:'12px auto 0', background:'none', border:'none',
          color:'#9ca3af', fontFamily:FONT_BODY, fontSize:11, cursor:'pointer',
        }}>Cerrar</button>
      </div>
    </div>
  );
}

export default function FifaCard({ nombre, evento }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showRsvp, setShowRsvp] = useState(false);
  useConfetti(canvasRef as React.RefObject<HTMLCanvasElement | null>);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@400;600;700;800&display=swap');

        .fc-canvas {
          position:absolute; inset:0;
          pointer-events:none; z-index:26;
          width:100%; height:100%;
        }
        .fc-root {
          position:absolute; inset:0; z-index:25;
          background:#ffffff;
          display:flex; flex-direction:column; align-items:center;
          overflow-y:auto; padding:0 20px 36px;
          animation:fcIn 0.55s ease both;
        }
        @keyframes fcIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        .fc-banner-row { width:100%; position:relative; height:48px; flex-shrink:0; margin-bottom:6px; }
        .fc-rope { position:absolute; top:12px; left:-8px; right:-8px; height:1.5px; background:rgba(0,0,0,0.12); }
        .fc-flags { position:absolute; top:8px; left:0; right:0; display:flex; justify-content:space-around; }
        .fc-flag { width:0; height:0; border-left:9px solid transparent; border-right:9px solid transparent; filter:drop-shadow(0 1px 2px rgba(0,0,0,0.18)); animation:flagSway 3s ease-in-out infinite; }
        .fc-flag:nth-child(even) { animation-delay:-1.5s; }
        .fc-flag:nth-child(3n)   { animation-delay:-0.8s; }
        @keyframes flagSway { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)} }

        .fc-card { position:relative; width:min(300px,86vw); aspect-ratio:0.60; border-radius:16px; overflow:hidden; background:linear-gradient(150deg,#bfdbfe 0%,#1d4ed8 50%,#1e3a8a 100%); border:4px solid #cbd5e1; box-shadow:0 10px 30px rgba(0,0,0,0.16),inset 0 0 10px rgba(255,255,255,0.18); flex-shrink:0; margin-bottom:20px; }
        .fc-card::before { content:''; position:absolute; inset:0; z-index:0; background:repeating-linear-gradient(-45deg,transparent,transparent 5px,rgba(255,255,255,0.04) 5px,rgba(255,255,255,0.04) 10px); }

        .fc-left-bar { position:absolute; left:0; top:0; bottom:0; width:38px; background:linear-gradient(to bottom,#0c2340,#1e40af); border-right:1px solid rgba(255,255,255,0.18); display:flex; flex-direction:column; align-items:center; padding-top:10px; z-index:3; }
        .fc-vertical-text { font-family:${FONT_TITLE}; font-size:13px; color:#fff; writing-mode:vertical-lr; transform:rotate(180deg); letter-spacing:0.1em; margin-top:8px; text-align:center; line-height:1.1; }

        .fc-flag-shield { position:absolute; right:10px; top:10px; width:32px; height:36px; background:rgba(255,255,255,0.14); border:1.5px solid rgba(255,255,255,0.85); border-radius:3px 3px 14px 14px; display:flex; align-items:center; justify-content:center; font-size:16px; z-index:3; }
        .fc-bg-number { position:absolute; right:-6px; top:-18px; font-family:${FONT_TITLE}; font-size:140px; line-height:0.9; color:transparent; -webkit-text-stroke:2px rgba(255,255,255,0.18); z-index:1; pointer-events:none; }

        .fc-player-photo-wrap { position:absolute; left:38px; right:0; top:8px; bottom:136px; display:flex; align-items:flex-end; justify-content:center; z-index:2; overflow:hidden; }
        .fc-player-photo { height:110%; width:auto; object-fit:contain; object-position:bottom center; filter:drop-shadow(0 4px 8px rgba(0,0,0,0.22)); }

        .fc-bottom-panel { position:absolute; left:38px; right:0; bottom:0; padding:12px 10px 14px; z-index:3; background:linear-gradient(to top,rgba(0,6,26,0.98) 0%,rgba(0,6,26,0.7) 70%,transparent 100%); display:flex; flex-direction:column; gap:8px; }
        .fc-bottom-row { display:flex; gap:5px; align-items:stretch; }
        .fc-info-block { flex:1; background:rgba(255,255,255,0.97); border:1.5px solid #1e3a8a; border-radius:10px; overflow:hidden; }
        .fc-pos-label { background:#0c2340; color:#93c5fd; font-family:${FONT_BODY}; font-size:8px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; padding:3px 8px; }
        .fc-player-name { font-family:${FONT_TITLE}; font-size:26px; color:#0c2340; text-transform:uppercase; padding:4px 8px 2px; line-height:1.05; }
        .fc-player-stats { border-top:1.5px solid rgba(12,35,64,0.1); padding:5px 8px 7px; display:grid; grid-template-columns:repeat(3,1fr); gap:4px; }
        .fc-stat { display:flex; flex-direction:column; gap:1px; }
        .fc-stat-lbl { font-family:${FONT_BODY}; font-size:7px; font-weight:800; color:#6b7280; text-transform:uppercase; letter-spacing:0.06em; }
        .fc-stat-val { font-family:${FONT_TITLE}; font-size:14px; color:#0c2340; line-height:1.2; }
        .fc-num-circle { width:46px; height:46px; flex-shrink:0; background:#0c2340; border:2.5px solid rgba(255,255,255,0.85); border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:${FONT_TITLE}; font-size:26px; color:#fff; align-self:center; box-shadow:0 2px 8px rgba(0,0,0,0.3); }

        /* Datos evento */
        .fc-event-box { width:100%; max-width:290px; background:#f9fafb; border:1.5px solid #e5e7eb; border-radius:14px; padding:16px 18px; display:flex; flex-direction:column; gap:11px; margin-bottom:12px; }
        .fc-section-title { font-family:${FONT_BODY}; font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#111827; text-align:center; margin-bottom:-2px; }
        .fc-event-row { display:flex; align-items:flex-start; gap:10px; }
        .fc-event-icon { font-size:15px; line-height:1; margin-top:3px; flex-shrink:0; }
        .fc-event-label { font-family:${FONT_BODY}; font-size:9px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#9ca3af; margin:0 0 2px; }
        .fc-event-val { font-family:${FONT_BODY}; font-size:13px; font-weight:600; color:#111827; margin:0; }
        .fc-event-nota { font-family:${FONT_BODY}; font-size:11px; color:#6b7280; text-align:center; font-style:italic; }

        /* Uniforme banner */
        .fc-uniform-banner {
          width:100%; max-width:290px;
          border-radius:16px;
          display:flex; flex-direction:column;
          margin-bottom:8px;
          border:1.5px solid #e5e7eb;
          background:#f9fafb;
        }
        .fc-uniform-title {
          font-family:${FONT_BODY};
          font-size:11px; font-weight:800;
          letter-spacing:0.1em; text-transform:uppercase;
          color:#111827; text-align:center;
          padding:12px 16px 8px;
        }
        .fc-uniform-row {
          display:flex; padding:0 16px 16px; gap:12px;
        }
        .fc-jersey-card {
          flex:1; border-radius:12px;
          display:flex; flex-direction:column; align-items:center;
          padding:14px 8px 12px; gap:8px;
        }
        .fc-jersey-label {
          font-family:${FONT_BODY};
          font-size:11px; font-weight:700;
          text-transform:uppercase; letter-spacing:0.06em;
          color:#fff;
          text-shadow:0 1px 3px rgba(0,0,0,0.25);
        }

        /* Botón confirmar */
        .fc-wa-btn {
          padding:14px 32px; border-radius:10px; border:none;
          background:#111827; color:#fff;
          font-family:${FONT_BODY}; font-size:13px; font-weight:700;
          letter-spacing:0.04em; cursor:pointer;
          display:inline-block; transition:opacity 0.18s;
          margin-bottom:4px;
        }
        .fc-wa-btn:hover { opacity:0.82; }
      `}</style>

      <canvas ref={canvasRef} className="fc-canvas" />

      <div className="fc-root">

        {/* Banderines */}
        <div className="fc-banner-row">
          <div className="fc-rope" />
          <div className="fc-flags">
            {FLAG_COLORS.map((color, i) => (
              <div key={i} className="fc-flag" style={{ borderTop:`18px solid ${color}` }} />
            ))}
          </div>
        </div>

        <p style={{ fontFamily:FONT_BODY, fontSize:12, fontWeight:800, color:'#374151', letterSpacing:'0.06em', marginBottom:10, textAlign:'center' }}>
          ⭐ Te esperamos ⭐
        </p>

        {/* Carta Panini */}
        <div className="fc-card">
          <div className="fc-bg-number">7</div>
          <div className="fc-left-bar">
            <span style={{ fontSize:14, marginBottom:4 }}>🏆</span>
            <span className="fc-vertical-text">Medio campista</span>
          </div>
          <div className="fc-flag-shield">🇨🇴</div>
          <div className="fc-player-photo-wrap">
            <img src={fotoNino} alt="jugador" className="fc-player-photo" />
          </div>
          <div className="fc-bottom-panel">
            <div className="fc-bottom-row">
              <div className="fc-info-block">
                <div className="fc-pos-label">Delantero / Forward</div>
                <div className="fc-player-name">{nombre}</div>
                <div className="fc-player-stats">
                  {[
                    { l:'Nacimiento', v:'2019' },
                    { l:'Estatura',   v:'1.25 m' },
                    { l:'Club',       v:'Mati FC' },
                  ].map(s => (
                    <div key={s.l} className="fc-stat">
                      <span className="fc-stat-lbl">{s.l}</span>
                      <span className="fc-stat-val">{s.v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="fc-num-circle">7</div>
            </div>
          </div>
        </div>

        {/* Datos del partido */}
        <div className="fc-event-box">
          <p className="fc-section-title">Datos del partido</p>
          {[
            { icon:'📅', label:'Fecha', val:evento.fecha },
            { icon:'🕓', label:'Hora',  val:evento.hora  },
            { icon:'📍', label:'Lugar', val:evento.lugar },
          ].map(r => (
            <div key={r.label} className="fc-event-row">
              <span className="fc-event-icon">{r.icon}</span>
              <div>
                <p className="fc-event-label">{r.label}</p>
                <p className="fc-event-val">{r.val}</p>
              </div>
            </div>
          ))}
          <p className="fc-event-nota">{evento.nota}</p>
        </div>

        {/* Uniformes */}
        <div className="fc-uniform-banner">
          <p className="fc-uniform-title">Trae tu uniforme</p>
          <div className="fc-uniform-row">
            {/* Jersey Rojo */}
            <div className="fc-jersey-card" style={{ background:'linear-gradient(135deg,#ef4444 0%,#DA291C 100%)', boxShadow:'0 4px 16px rgba(218,41,28,0.35)' }}>
              <svg viewBox="0 0 80 88" width="72" height="79" xmlns="http://www.w3.org/2000/svg">
                {/* sombra exterior */}
                <defs>
                  <filter id="jshadow-r" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="rgba(0,0,0,0.3)" />
                  </filter>
                </defs>
                <g filter="url(#jshadow-r)">
                  {/* cuerpo */}
                  <path d="M22 14 L10 28 L18 32 L16 78 L64 78 L62 32 L70 28 L58 14 C54 18 46 21 40 21 C34 21 26 18 22 14Z" fill="#DA291C" />
                  {/* hombros más claros */}
                  <path d="M22 14 L10 28 L18 32 L20 26 L28 16 C26 15 24 14.5 22 14Z" fill="rgba(255,255,255,0.18)" />
                  <path d="M58 14 L70 28 L62 32 L60 26 L52 16 C54 15 56 14.5 58 14Z" fill="rgba(255,255,255,0.18)" />
                  {/* cuello en V */}
                  <path d="M34 21 L40 32 L46 21" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
                  {/* número */}
                  <text x="40" y="58" textAnchor="middle" fontFamily="Anton,Impact,sans-serif" fontSize="22" fill="white" opacity="0.9">7</text>
                  {/* costuras laterales */}
                  <path d="M16 78 L16 32" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
                  <path d="M64 78 L64 32" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
                  {/* franja horizontal pecho */}
                  <rect x="16" y="36" width="48" height="4" fill="rgba(255,255,255,0.15)" rx="1" />
                </g>
              </svg>
              <span className="fc-jersey-label">Equipo Rojo</span>
            </div>

            {/* Jersey Azul */}
            <div className="fc-jersey-card" style={{ background:'linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%)', boxShadow:'0 4px 16px rgba(29,78,216,0.35)' }}>
              <svg viewBox="0 0 80 88" width="72" height="79" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="jshadow-b" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="rgba(0,0,0,0.3)" />
                  </filter>
                </defs>
                <g filter="url(#jshadow-b)">
                  <path d="M22 14 L10 28 L18 32 L16 78 L64 78 L62 32 L70 28 L58 14 C54 18 46 21 40 21 C34 21 26 18 22 14Z" fill="#1d4ed8" />
                  <path d="M22 14 L10 28 L18 32 L20 26 L28 16 C26 15 24 14.5 22 14Z" fill="rgba(255,255,255,0.18)" />
                  <path d="M58 14 L70 28 L62 32 L60 26 L52 16 C54 15 56 14.5 58 14Z" fill="rgba(255,255,255,0.18)" />
                  <path d="M34 21 L40 32 L46 21" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
                  <text x="40" y="58" textAnchor="middle" fontFamily="Anton,Impact,sans-serif" fontSize="22" fill="white" opacity="0.9">7</text>
                  <path d="M16 78 L16 32" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
                  <path d="M64 78 L64 32" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
                  {/* franja diagonal azul claro */}
                  <path d="M16 40 L64 55" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="5" />
                </g>
              </svg>
              <span className="fc-jersey-label">Equipo Azul</span>
            </div>
          </div>
        </div>
        <p style={{ fontFamily:FONT_BODY, fontSize:11, color:'#6b7280', textAlign:'center', marginBottom:20, fontStyle:'italic' }}>
          Llevar uniforme de color rojo o azul
        </p>

        {/* Botón */}
        <button className="fc-wa-btn" onClick={() => setShowRsvp(true)}>
          Confirmar asistencia
        </button>

      </div>

      {showRsvp && <RsvpModal onClose={() => setShowRsvp(false)} />}
    </>
  );
}
