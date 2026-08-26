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
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@400;500;600;700;800&display=swap');

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

        /* ═══ GLOBO BALÓN ═══ */
        .fc-balloon {
          position: absolute;
          right: -10px;
          top: 40px;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          filter: drop-shadow(0 8px 20px rgba(0,0,0,0.55));
        }
        .fc-balloon-float {
          display: flex;
          flex-direction: column;
          align-items: center;
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
        @keyframes balloonRise {
          from { transform: translateY(80vh) rotate(15deg); opacity: 0; }
          to   { transform: translateY(0) rotate(0deg); opacity: 1; }
        }
        @keyframes balloonFloat {
          0%   { transform: translateY(0) rotate(3deg); }
          100% { transform: translateY(-16px) rotate(-3deg); }
        }

        /* ═══ CARTA PANINI ═══ */
        .fc-card {
          position: relative;
          width: min(276px, 78vw);
          aspect-ratio: 0.58; border-radius: 20px; overflow: hidden;
          background: linear-gradient(135deg, #a5f3fc 0%, #0284c7 60%, #0369a1 100%);
          border: 6px solid #d1d5db; /* Silver metallic border */
          box-shadow:
            0 12px 36px rgba(0,0,0,0.5),
            inset 0 0 16px rgba(255,255,255,0.3);
          flex-shrink: 0;
          margin-bottom: 20px;
          box-sizing: border-box;
        }
        /* Rayas metálicas de fondo */
        .fc-card::before {
          content: ''; position: absolute; inset: 0; z-index: 0;
          background:
            repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(255,255,255,0.06) 5px, rgba(255,255,255,0.06) 10px),
            radial-gradient(circle at 60% 30%, rgba(255,255,255,0.2) 0%, transparent 60%);
          opacity: 0.85;
        }

        /* Barra izquierda con nombre de país */
        .fc-left-bar {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 44px;
          background: linear-gradient(to bottom, #0c2340, #1d4ed8);
          border-right: 1.5px solid rgba(255,255,255,0.25);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 10px;
          z-index: 3;
          box-shadow: 2px 0 8px rgba(0,0,0,0.3);
        }
        .fc-vertical-text {
          font-family: 'Anton', sans-serif;
          font-size: 21px;
          color: white;
          text-transform: uppercase;
          writing-mode: vertical-lr;
          transform: rotate(180deg);
          letter-spacing: 0.18em;
          margin-top: 14px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        /* Escudo de la bandera */
        .fc-flag-shield {
          position: absolute;
          right: 12px;
          top: 12px;
          width: 38px;
          height: 42px;
          background: rgba(255,255,255,0.18);
          border: 2px solid rgba(255,255,255,0.95);
          border-radius: 4px 4px 18px 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          z-index: 3;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        /* Número gigante en el fondo */
        .fc-bg-number {
          position: absolute;
          right: -10px;
          top: -24px;
          font-family: 'Anton', sans-serif;
          font-size: 160px;
          line-height: 0.9;
          font-weight: 900;
          color: transparent;
          -webkit-text-stroke: 2px rgba(255,255,255,0.28);
          z-index: 1;
          pointer-events: none;
        }

        /* Foto del jugador */
        .fc-player-photo-wrap {
          position: absolute;
          left: 44px; right: 0; top: 12px; bottom: 84px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          z-index: 2;
          overflow: hidden;
        }
        .fc-player-photo {
          height: 104%;
          width: auto;
          object-fit: contain;
          object-position: bottom center;
          filter: drop-shadow(0 6px 12px rgba(0,0,0,0.3));
        }

        /* Panel inferior de información */
        .fc-bottom-panel {
          position: absolute;
          left: 44px; right: 0; bottom: 0;
          padding: 8px 10px 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          z-index: 3;
          background: linear-gradient(to top, rgba(0,10,35,0.9) 0%, rgba(0,10,35,0.4) 80%, transparent 100%);
        }
        .fc-info-row {
          display: flex;
          gap: 6px;
          align-items: stretch;
        }
        .fc-info-card {
          flex: 1;
          background: rgba(255, 255, 255, 0.95);
          border: 1.5px solid #0b3c5d;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .fc-info-header {
          background: #0c2340;
          color: #60a5fa;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 2px 6px;
          font-family: sans-serif;
        }
        .fc-player-name {
          font-family: 'Anton', sans-serif;
          font-size: 17px;
          color: #0c2340;
          text-transform: uppercase;
          padding: 2px 6px 0;
          line-height: 1.15;
          letter-spacing: 0.02em;
        }
        .fc-player-details {
          border-top: 1.2px solid rgba(12, 35, 64, 0.15);
          padding: 2px 6px 4px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
        }
        .fc-detail-item {
          display: flex;
          flex-direction: column;
        }
        .fc-detail-label {
          font-size: 4.5px;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          line-weight: 1;
          font-family: sans-serif;
        }
        .fc-detail-val {
          font-family: 'Anton', sans-serif;
          font-size: 9px;
          color: #0c2340;
          line-height: 1.2;
          margin-top: 1px;
        }
        .fc-number-badge {
          width: 32px;
          background: #0c2340;
          border: 1.5px solid rgba(255,255,255,0.85);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Anton', sans-serif;
          font-size: 19px;
          color: white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        .fc-panini-logo {
          background: #f59e0b; /* yellow */
          border: 1.5px solid #dc2626; /* red */
          color: #dc2626;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-align: center;
          padding: 2.5px 10px;
          border-radius: 3px;
          width: max-content;
          margin: 0 auto;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
          font-family: 'Anton', sans-serif;
        }

        /* ═══ DATOS DEL EVENTO ═══ */
        .fc-event-card {
          width:100%; max-width:320px;
          background:rgba(255,255,255,0.05);
          border:1.5px solid rgba(100,180,255,0.2);
          border-radius:18px; padding:16px 18px;
          display:flex; flex-direction:column; gap:12px;
          margin-bottom:16px;
          font-family: 'Montserrat', sans-serif;
        }
        .fc-event-title {
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: clamp(12px, 3.2vw, 14px); letter-spacing: 0.16em;
          color: #f59e0b; text-transform: uppercase;
          text-align: center; margin-bottom: 2px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.4);
        }
        .fc-event-row { display:flex; align-items:flex-start; gap:12px; font-family: 'Montserrat', sans-serif; }
        .fc-event-icon { font-size:18px; line-height:1; margin-top:2px; flex-shrink:0; }
        .fc-event-label { font-size:9px; font-weight:800; letter-spacing:0.12em; color:rgba(150,210,255,0.65); text-transform:uppercase; margin:0 0 2px; font-family: 'Montserrat', sans-serif; }
        .fc-event-val   { font-size:clamp(13px,3.5vw,15px); color:#fff; font-weight:600; margin:0; font-family: 'Montserrat', sans-serif; }
        .fc-event-nota  { font-size:clamp(12px,3vw,13px); color:rgba(255,255,255,0.65); text-align:center; font-family: 'Montserrat', sans-serif; font-style:italic; }

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

        {/* ── Label ── */}
        <p style={{
          fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(11px,3vw,12px)',
          fontWeight: 800, color: '#f59e0b', letterSpacing: '0.16em',
          textTransform: 'uppercase', marginBottom: 12, textAlign: 'center',
          textShadow: '0 1px 2px rgba(0,0,0,0.4)',
        }}>⭐ Tu cromo de jugador ⭐</p>

        {/* Contenedor relativo que agrupa la carta y el globo flotando encima */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* ── Carta Panini ── */}
          <div className="fc-card">
            {/* Fondo número gigante */}
            <div className="fc-bg-number">7</div>

            {/* Barra izquierda con nombre de país */}
            <div className="fc-left-bar">
              <span style={{ fontSize: 18, marginBottom: 2 }}>🏆</span>
              <span style={{ fontSize: 6, fontWeight: 900, color: '#60a5fa', letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.1, marginBottom: 6 }}>World<br/>Cup</span>
              <span className="fc-vertical-text">COLOMBIA</span>
            </div>

            {/* Escudo de la bandera */}
            <div className="fc-flag-shield">🇨🇴</div>

            {/* Foto del jugador */}
            <div className="fc-player-photo-wrap">
              <img src={IMG_JUGADOR} alt="jugador" className="fc-player-photo" />
            </div>

            {/* Panel inferior de información */}
            <div className="fc-bottom-panel">
              <div className="fc-info-row">
                {/* Tarjeta de info principal */}
                <div className="fc-info-card">
                  <div className="fc-info-header">DELANTERO / FORWARD</div>
                  <div className="fc-player-name">{nombre}</div>
                  <div className="fc-player-details">
                    <div className="fc-detail-item">
                      <span className="fc-detail-label">NACIMIENTO</span>
                      <span className="fc-detail-val">2019</span>
                    </div>
                    <div className="fc-detail-item">
                      <span className="fc-detail-label">ESTATURA</span>
                      <span className="fc-detail-val">1.25 M</span>
                    </div>
                    <div className="fc-detail-item">
                      <span className="fc-detail-label">CLUB</span>
                      <span className="fc-detail-val">MATI FC</span>
                    </div>
                  </div>
                </div>

                {/* Número del jugador */}
                <div className="fc-number-badge">7</div>
              </div>

              {/* Logo de Panini personalizado */}
              <div className="fc-panini-logo">CELEBRARTE</div>
            </div>
          </div>

          {/* ── Globo balón flotando encima con entrada desde abajo ── */}
          <div className="fc-balloon" style={{ animation: 'balloonRise 2.2s cubic-bezier(0.19, 1, 0.22, 1) both' }}>
            <div className="fc-balloon-float" style={{ animation: 'balloonFloat 4s ease-in-out infinite alternate' }}>
              <div className="fc-balloon-ball" />
              <div className="fc-balloon-string" />
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
