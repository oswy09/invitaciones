import { useEffect, useRef } from 'react';

interface Props {
  nombre:  string;
  evento:  { fecha: string; hora: string; lugar: string; nota: string };
}

const STATS = [
  { key: 'RIT', val: 95 }, { key: 'TIR', val: 92 }, { key: 'PAS', val: 88 },
  { key: 'REG', val: 97 }, { key: 'DEF', val: 55 }, { key: 'FIS', val: 84 },
];

const FLAG_COLORS = ['#006600','#DA291C','#006600','#DA291C','#006600','#DA291C','#006600','#DA291C','#006600','#DA291C','#006600','#DA291C'];

// Imagen de niño con uniforme de fútbol (Cloudinary)
const IMG_JUGADOR = 'https://res.cloudinary.com/ddqbnr9vo/image/upload/v1785889536/edit-this-cartoon-soccer-player-image-add-a-colorf_cdbven.webp';

// Sonido de estadio (barras) — loop
const AUDIO_ESTADIO = 'https://res.cloudinary.com/ddqbnr9vo/video/upload/v1785876951/Bal%C3%B3n_de_f%C3%BAtbo_stp8ed.mp4';

export default function FifaCard({ nombre, evento }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.18;
    audio.play().catch(() => {});
    return () => { audio.pause(); };
  }, []);

  return (
    <>
      <audio ref={audioRef} src={AUDIO_ESTADIO} loop preload="auto" style={{ display:'none' }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');

        .fc-root {
          position: absolute; inset: 0; z-index: 25; overflow-y: auto;
          background: radial-gradient(ellipse at 50% 30%, #1a4a1a 0%, #0d2e0d 40%, #071507 100%);
          display: flex; flex-direction: column; align-items: center;
          padding: 0 16px 28px;
          animation: fcIn 0.6s ease both;
        }
        @keyframes fcIn {
          from { opacity:0; transform:translateY(30px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* Líneas de campo de fútbol al fondo */
        .fc-root::before {
          content: '';
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(to bottom, transparent 48%, rgba(255,255,255,0.04) 49%, rgba(255,255,255,0.04) 51%, transparent 52%),
            radial-gradient(ellipse 60% 30% at 50% 50%, transparent 58%, rgba(255,255,255,0.04) 59%, rgba(255,255,255,0.04) 61%, transparent 62%);
        }
        .fc-root > * { position: relative; z-index: 1; }

        /* ═══ BANDERINES ═══ */
        .fc-banner-row {
          width: 100%; position: relative; height: 56px; flex-shrink: 0;
          margin-bottom: 4px;
        }
        .fc-rope {
          position: absolute; top: 14px; left: -8px; right: -8px;
          height: 2px; background: rgba(255,255,255,0.35);
          border-radius: 1px;
        }
        .fc-flags {
          position: absolute; top: 10px; left: 0; right: 0;
          display: flex; justify-content: space-around; align-items: flex-start;
        }
        .fc-flag {
          width: 0; height: 0;
          border-left: 11px solid transparent;
          border-right: 11px solid transparent;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
          animation: flagSway 3s ease-in-out infinite;
        }
        .fc-flag:nth-child(even)  { animation-delay: -1.5s; }
        .fc-flag:nth-child(3n)    { animation-delay: -0.8s; }
        @keyframes flagSway {
          0%,100% { transform: rotate(-6deg); }
          50%      { transform: rotate(6deg); }
        }

        /* ═══ GLOBO BALÓN MEJORADO ═══ */
        .fc-balloon {
          position: absolute; right: 12px; top: 52px; z-index: 5;
          display: flex; flex-direction: column; align-items: center;
          animation: balloonFloat 4.5s ease-in-out infinite;
          filter: drop-shadow(0 6px 16px rgba(0,0,0,0.5));
        }
        .fc-balloon-ball {
          width: 54px; height: 54px;
          background: radial-gradient(circle at 35% 32%, #fff 0%, #e8e8e8 18%, #222 60%, #111 100%);
          border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.15), 0 6px 18px rgba(0,0,0,0.6);
          position: relative; overflow: hidden;
        }
        .fc-balloon-ball::before {
          content: '';
          position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 54 54' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M27 8 L22 18 L32 18 Z' fill='rgba(0,0,0,0.7)'/%3E%3Cpath d='M16 20 L8 28 L17 34 L22 22 Z' fill='rgba(0,0,0,0.7)'/%3E%3Cpath d='M38 20 L46 28 L37 34 L32 22 Z' fill='rgba(0,0,0,0.7)'/%3E%3Cpath d='M18 38 L27 46 L36 38 L32 28 L22 28 Z' fill='rgba(0,0,0,0.7)'/%3E%3C/svg%3E") center/cover no-repeat;
        }
        .fc-balloon-ball::after {
          content: '';
          position: absolute; top: 8px; left: 12px; width: 16px; height: 10px;
          background: rgba(255,255,255,0.28); border-radius: 50%; transform: rotate(-30deg);
        }
        .fc-balloon-string {
          width: 2px; height: 60px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.55), transparent);
          margin-top: 3px; border-radius: 1px;
        }
        @keyframes balloonFloat {
          0%,100% { transform: translateY(0) rotate(4deg); }
          50%      { transform: translateY(-18px) rotate(-4deg); }
        }

        /* ═══ CARTA MUNDIAL — azul oscuro / plata ═══ */
        .fc-card {
          position: relative;
          width: min(268px, 75vw);
          aspect-ratio: 0.72; border-radius: 16px; overflow: hidden;
          background: linear-gradient(155deg,
            #0a1628 0%, #1a2e50 15%,
            #0d1e40 32%, #1c3060 50%,
            #0a1628 65%, #162848 82%, #0a1628 100%);
          box-shadow:
            0 0 0 2px rgba(180,210,255,0.4),
            0 0 0 4px rgba(80,140,220,0.2),
            0 0 32px rgba(80,140,220,0.35),
            0 0 80px rgba(80,140,220,0.1),
            inset 0 0 40px rgba(0,0,0,0.3);
          flex-shrink: 0;
          margin-bottom: 16px;
        }
        .fc-card::before {
          content: ''; position: absolute; inset: 0; z-index: 0;
          background:
            repeating-linear-gradient(-55deg, transparent, transparent 3px, rgba(255,255,255,0.03) 3px, rgba(255,255,255,0.03) 6px),
            radial-gradient(ellipse at 50% 0%, rgba(100,160,255,0.12) 0%, transparent 70%);
        }
        .fc-card::after {
          content: ''; position: absolute; top:0; left:0; right:0; height:40%;
          background: linear-gradient(to bottom, rgba(150,200,255,0.12), transparent);
          z-index: 0; border-radius: 16px 16px 0 0;
        }
        .fc-inner { position:relative; z-index:1; height:100%; display:flex; flex-direction:column; }

        .fc-top { padding:8px 10px 0; display:flex; justify-content:space-between; align-items:flex-start; }
        .fc-rating { font-family:'Anton','Impact',sans-serif; font-size:clamp(30px,9vw,46px); color:#e8f0ff; line-height:1; text-shadow: 0 0 12px rgba(100,180,255,0.5); }
        .fc-pos    { font-family:'Anton','Impact',sans-serif; font-size:clamp(11px,3.5vw,16px); color:rgba(180,210,255,0.85); }
        .fc-flag-emoji { font-size:clamp(16px,4.5vw,22px); }
        .fc-edition { font-size:8px; font-weight:800; letter-spacing:0.14em; color:rgba(150,200,255,0.55); text-transform:uppercase; }

        .fc-photo-wrap { flex:1; display:flex; align-items:flex-end; justify-content:center; overflow:hidden; padding:0 6px; }
        .fc-photo { width:100%; height:100%; object-fit:cover; object-position:center top; }

        .fc-name { font-family:'Anton','Impact',sans-serif; font-size:clamp(15px,5vw,22px); color:#e8f0ff; letter-spacing:0.06em; text-transform:uppercase; text-align:center; padding:3px 6px 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-shadow:0 0 8px rgba(100,180,255,0.4); }

        .fc-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; padding:5px 8px 8px; background:linear-gradient(to bottom, rgba(0,10,30,0.4), rgba(0,10,30,0.6)); border-top:1px solid rgba(100,160,255,0.2); margin-top:3px; }
        .fc-stat  { display:flex; flex-direction:column; align-items:center; gap:1px; }
        .fc-stat-val { font-family:'Anton','Impact',sans-serif; font-size:clamp(13px,3.8vw,18px); color:#c8e0ff; line-height:1; }
        .fc-stat-key { font-size:7px; font-weight:800; letter-spacing:0.1em; color:rgba(150,200,255,0.6); text-transform:uppercase; }

        /* ═══ DATOS DEL EVENTO ═══ */
        .fc-event-card {
          width:100%; max-width:320px;
          background:rgba(255,255,255,0.05);
          border:1.5px solid rgba(100,180,255,0.2);
          border-radius:18px; padding:16px 18px;
          display:flex; flex-direction:column; gap:12px;
          margin-bottom:16px;
        }
        .fc-event-title {
          font-family:'Anton','Impact',sans-serif;
          font-size:clamp(11px,3vw,13px); letter-spacing:0.2em;
          color:rgba(150,210,255,0.8); text-transform:uppercase;
          text-align:center; margin-bottom:2px;
        }
        .fc-event-row { display:flex; align-items:flex-start; gap:12px; }
        .fc-event-icon { font-size:18px; line-height:1; margin-top:2px; flex-shrink:0; }
        .fc-event-label { font-size:9px; font-weight:800; letter-spacing:0.18em; color:rgba(150,210,255,0.65); text-transform:uppercase; margin:0 0 2px; font-family:sans-serif; }
        .fc-event-val   { font-size:clamp(13px,3.5vw,15px); color:#fff; font-weight:600; margin:0; font-family:sans-serif; }
        .fc-event-nota  { font-size:clamp(12px,3vw,13px); color:rgba(255,255,255,0.6); text-align:center; font-family:sans-serif; font-style:italic; }

        /* WhatsApp */
        .fc-wa {
          padding:12px 28px; border-radius:999px; border:none;
          background:linear-gradient(135deg,#25D366,#128C7E);
          color:#fff; font-family:'Anton','Impact',sans-serif;
          font-size:14px; letter-spacing:0.08em; text-transform:uppercase;
          cursor:pointer; text-decoration:none; display:inline-block;
          box-shadow:0 4px 20px rgba(37,211,102,0.35);
          animation:waPulse 2s ease-in-out infinite;
        }
        @keyframes waPulse {
          0%,100% { box-shadow:0 4px 20px rgba(37,211,102,0.35); }
          50%      { box-shadow:0 4px 30px rgba(37,211,102,0.65); }
        }
      `}</style>

      <div className="fc-root">

        {/* ── Banderines ── */}
        <div className="fc-banner-row">
          <div className="fc-rope" />
          <div className="fc-flags">
            {FLAG_COLORS.map((color, i) => (
              <div key={i} className="fc-flag"
                style={{ borderTop: `22px solid ${color}` }} />
            ))}
          </div>
        </div>

        {/* ── Globo balón ── */}
        <div style={{ position:'relative', width:'100%', maxWidth:320, height:0 }}>
          <div className="fc-balloon">
            <div className="fc-balloon-ball" />
            <div className="fc-balloon-string" />
          </div>
        </div>

        {/* ── Label ── */}
        <p style={{
          fontFamily:"'Anton','Impact',sans-serif", fontSize:'clamp(11px,3vw,13px)',
          color:'rgba(150,210,255,0.8)', letterSpacing:'0.2em',
          textTransform:'uppercase', marginBottom:10, textAlign:'center',
        }}>⭐ Tu carta de jugador ⭐</p>

        {/* ── Carta Mundial ── */}
        <div className="fc-card">
          <div className="fc-inner">
            <div className="fc-top">
              <div>
                <div className="fc-rating">7</div>
                <div className="fc-pos">DEL</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div className="fc-flag-emoji">🇨🇴</div>
                <div className="fc-edition">World Cup Ed.</div>
              </div>
            </div>

            <div className="fc-photo-wrap">
              <img src={IMG_JUGADOR} alt="jugador" className="fc-photo" />
            </div>

            <div className="fc-name">{nombre}</div>

            <div className="fc-stats">
              {STATS.map(s => (
                <div key={s.key} className="fc-stat">
                  <span className="fc-stat-val">{s.val}</span>
                  <span className="fc-stat-key">{s.key}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Datos del evento ── */}
        <div className="fc-event-card">
          <p className="fc-event-title">📋 Datos del evento</p>
          {[
            { icon:'📅', label:'Fecha',  val: evento.fecha },
            { icon:'🕓', label:'Hora',   val: evento.hora  },
            { icon:'📍', label:'Lugar',  val: evento.lugar },
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

        {/* ── WhatsApp ── */}
        <a href="https://wa.me/573057502790" target="_blank" rel="noopener noreferrer" className="fc-wa">
          Confirmar asistencia ✔
        </a>

      </div>
    </>
  );
}
