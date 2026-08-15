import React, { useRef, useState } from 'react';

interface Props {
  nombre:  string;
  evento:  { fecha: string; hora: string; lugar: string; nota: string };
}

const STATS = [
  { key: 'RIT', val: 95 }, { key: 'TIR', val: 92 }, { key: 'PAS', val: 88 },
  { key: 'REG', val: 97 }, { key: 'DEF', val: 55 }, { key: 'FIS', val: 84 },
];

// Banderines: alternando colores Portugal (verde, rojo, verde, rojo…)
const FLAG_COLORS = ['#006600','#DA291C','#006600','#DA291C','#006600','#DA291C','#006600','#DA291C','#006600','#DA291C','#006600','#DA291C'];

export default function FifaCard({ nombre, evento }: Props) {
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');

        .fc-root {
          position: absolute; inset: 0; z-index: 25; overflow-y: auto;
          background: linear-gradient(160deg, #0a1a0a 0%, #0d200d 100%);
          display: flex; flex-direction: column; align-items: center;
          padding: 0 16px 28px;
          animation: fcIn 0.6s ease both;
        }
        @keyframes fcIn {
          from { opacity:0; transform:translateY(30px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* ═══ BANDERINES ═══ */
        .fc-banner-row {
          width: 100%; position: relative; height: 56px; flex-shrink: 0;
          margin-bottom: 4px;
        }
        .fc-rope {
          position: absolute; top: 14px; left: -8px; right: -8px;
          height: 2px; background: rgba(180,140,60,0.7);
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

        /* ═══ GLOBO BALÓN ═══ */
        .fc-balloon {
          position: absolute; right: 18px; top: 56px; z-index: 5;
          display: flex; flex-direction: column; align-items: center;
          animation: balloonFloat 4s ease-in-out infinite;
        }
        .fc-balloon-ball {
          font-size: 44px; line-height: 1;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.4));
        }
        .fc-balloon-string {
          width: 1.5px; height: 52px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.5), transparent);
          margin-top: 2px;
        }
        @keyframes balloonFloat {
          0%,100% { transform: translateY(0) rotate(3deg); }
          50%      { transform: translateY(-14px) rotate(-3deg); }
        }

        /* ═══ CARTA FIFA ═══ */
        .fc-card {
          position: relative; cursor: pointer;
          width: min(268px, 75vw);
          aspect-ratio: 0.72; border-radius: 16px; overflow: hidden;
          background: linear-gradient(155deg,
            #b8860b 0%, #f5d060 18%, #c8960a 35%,
            #f0c840 52%, #b07808 68%, #e8c030 82%, #906005 100%);
          box-shadow:
            0 0 0 2px #f0d060,
            0 0 0 4px rgba(180,130,10,0.5),
            0 0 28px rgba(240,200,40,0.5),
            0 0 70px rgba(240,200,40,0.15),
            inset 0 0 30px rgba(0,0,0,0.2);
          flex-shrink: 0;
          margin-bottom: 16px;
        }
        .fc-card::before {
          content: ''; position: absolute; inset: 0; z-index: 0;
          background: repeating-linear-gradient(
            -55deg, transparent, transparent 3px,
            rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 6px);
        }
        .fc-card::after {
          content: ''; position: absolute; top:0; left:0; right:0; height:40%;
          background: linear-gradient(to bottom, rgba(255,255,255,0.16), transparent);
          z-index: 0; border-radius: 16px 16px 0 0;
        }
        .fc-inner { position:relative; z-index:1; height:100%; display:flex; flex-direction:column; }

        .fc-top { padding:8px 10px 0; display:flex; justify-content:space-between; align-items:flex-start; }
        .fc-rating { font-family:'Anton','Impact',sans-serif; font-size:clamp(30px,9vw,46px); color:#1a0a00; line-height:1; }
        .fc-pos    { font-family:'Anton','Impact',sans-serif; font-size:clamp(11px,3.5vw,16px); color:#1a0a00; }
        .fc-flag-emoji { font-size:clamp(16px,4.5vw,22px); }
        .fc-edition { font-size:8px; font-weight:800; letter-spacing:0.14em; color:rgba(26,10,0,0.6); text-transform:uppercase; }

        .fc-photo-wrap { flex:1; display:flex; align-items:flex-end; justify-content:center; overflow:hidden; padding:0 10px; }
        .fc-photo { width:100%; height:100%; object-fit:cover; object-position:center top; border-radius:4px 4px 0 0; }
        .fc-placeholder {
          width:82%; height:88%; display:flex; flex-direction:column;
          align-items:center; justify-content:center; gap:6px;
          border:2px dashed rgba(26,10,0,0.3); border-radius:8px; background:rgba(0,0,0,0.1);
        }
        .fc-placeholder span:first-child { font-size:30px; opacity:0.45; }
        .fc-placeholder span:last-child  { font-size:10px; font-weight:700; letter-spacing:0.1em; color:rgba(26,10,0,0.55); text-transform:uppercase; text-align:center; line-height:1.3; }

        .fc-name { font-family:'Anton','Impact',sans-serif; font-size:clamp(15px,5vw,22px); color:#1a0a00; letter-spacing:0.06em; text-transform:uppercase; text-align:center; padding:3px 6px 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

        .fc-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; padding:5px 8px 8px; background:linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.28)); border-top:1px solid rgba(26,10,0,0.18); margin-top:3px; }
        .fc-stat  { display:flex; flex-direction:column; align-items:center; gap:1px; }
        .fc-stat-val { font-family:'Anton','Impact',sans-serif; font-size:clamp(13px,3.8vw,18px); color:#1a0a00; line-height:1; }
        .fc-stat-key { font-size:7px; font-weight:800; letter-spacing:0.1em; color:rgba(26,10,0,0.6); text-transform:uppercase; }

        /* ═══ BOTÓN FOTO ═══ */
        .fc-upload-btn {
          padding:9px 22px; border-radius:999px;
          border:1.5px solid #f0d060; background:rgba(240,208,60,0.1);
          color:#f0d060; font-family:'Anton','Impact',sans-serif;
          font-size:13px; letter-spacing:0.1em; text-transform:uppercase;
          cursor:pointer; margin-bottom:18px;
        }

        /* ═══ DATOS DEL EVENTO ═══ */
        .fc-event-card {
          width:100%; max-width:320px;
          background:rgba(255,255,255,0.05);
          border:1.5px solid rgba(255,255,80,0.2);
          border-radius:18px; padding:16px 18px;
          display:flex; flex-direction:column; gap:12px;
          margin-bottom:16px;
        }
        .fc-event-title {
          font-family:'Anton','Impact',sans-serif;
          font-size:clamp(11px,3vw,13px); letter-spacing:0.2em;
          color:rgba(255,255,80,0.75); text-transform:uppercase;
          text-align:center; margin-bottom:2px;
        }
        .fc-event-row { display:flex; align-items:flex-start; gap:12px; }
        .fc-event-icon { font-size:18px; line-height:1; margin-top:2px; flex-shrink:0; }
        .fc-event-label { font-size:9px; font-weight:800; letter-spacing:0.18em; color:rgba(255,255,80,0.65); text-transform:uppercase; margin:0 0 2px; font-family:sans-serif; }
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

        {/* ── Globo balón (flotando arriba-derecha) ── */}
        <div style={{ position:'relative', width:'100%', maxWidth:320, height:0 }}>
          <div className="fc-balloon">
            <div className="fc-balloon-ball">⚽</div>
            <div className="fc-balloon-string" />
          </div>
        </div>

        {/* ── Label ── */}
        <p style={{
          fontFamily:"'Anton','Impact',sans-serif", fontSize:'clamp(11px,3vw,13px)',
          color:'rgba(255,255,80,0.7)', letterSpacing:'0.2em',
          textTransform:'uppercase', marginBottom:10, textAlign:'center',
        }}>⭐ Tu carta de jugador ⭐</p>

        {/* ── Carta FIFA ── */}
        <div className="fc-card" onClick={() => fileRef.current?.click()}>
          <div className="fc-inner">
            <div className="fc-top">
              <div>
                <div className="fc-rating">99</div>
                <div className="fc-pos">DEL</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div className="fc-flag-emoji">🇨🇴</div>
                <div className="fc-edition">Birthday Ed.</div>
              </div>
            </div>

            <div className="fc-photo-wrap">
              {photo
                ? <img src={photo} alt="jugador" className="fc-photo" />
                : <div className="fc-placeholder">
                    <span>📸</span>
                    <span>Toca para<br/>subir tu foto</span>
                  </div>
              }
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

        {/* ── Botón foto ── */}
        <button className="fc-upload-btn" onClick={() => fileRef.current?.click()}>
          📷 {photo ? 'Cambiar foto' : 'Subir foto'}
        </button>
        <input ref={fileRef} type="file" accept="image/*"
          style={{ display:'none' }} onChange={handleFile} />

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
