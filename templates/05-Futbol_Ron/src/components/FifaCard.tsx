import React, { useRef, useState } from 'react';

interface Props {
  nombre: string;
  onContinuar: () => void;
}

const STATS = [
  { key: 'RIT', val: 95 },
  { key: 'TIR', val: 92 },
  { key: 'PAS', val: 88 },
  { key: 'REG', val: 97 },
  { key: 'DEF', val: 55 },
  { key: 'FIS', val: 84 },
];

export default function FifaCard({ nombre, onContinuar }: Props) {
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');

        .fc-root {
          position: absolute; inset: 0; z-index: 25;
          background: linear-gradient(160deg, #0a1a0a 0%, #0d200d 100%);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 20px 16px; overflow-y: auto;
          animation: fcSlideIn 0.6s ease both;
        }
        @keyframes fcSlideIn {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── La carta ── */
        .fc-card {
          position: relative;
          width: min(300px, 80vw);
          aspect-ratio: 0.72;
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;

          /* fondo dorado tipo FIFA gold */
          background:
            linear-gradient(155deg,
              #b8860b 0%,
              #f5d060 18%,
              #c8960a 35%,
              #f0c840 52%,
              #b07808 68%,
              #e8c030 82%,
              #906005 100%
            );

          /* borde metálico con glow */
          box-shadow:
            0 0 0 2px #f0d060,
            0 0 0 4px rgba(180,130,10,0.6),
            0 0 24px rgba(240,200,40,0.5),
            0 0 60px rgba(240,200,40,0.2),
            inset 0 0 30px rgba(0,0,0,0.25);
        }

        /* textura diagonal sutil */
        .fc-card::before {
          content: '';
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            -55deg,
            transparent,
            transparent 3px,
            rgba(255,255,255,0.04) 3px,
            rgba(255,255,255,0.04) 6px
          );
          z-index: 0;
        }

        /* brillo superior */
        .fc-card::after {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 45%;
          background: linear-gradient(to bottom, rgba(255,255,255,0.18), transparent);
          z-index: 0; border-radius: 18px 18px 0 0;
        }

        .fc-inner { position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; }

        /* franja superior con rating y posición */
        .fc-top {
          padding: 10px 12px 0;
          display: flex; justify-content: space-between; align-items: flex-start;
        }
        .fc-rating {
          font-family: 'Anton','Impact',sans-serif;
          font-size: clamp(36px,10vw,52px);
          color: #1a0a00; line-height: 1;
          text-shadow: 0 1px 0 rgba(255,255,255,0.3);
        }
        .fc-pos {
          font-family: 'Anton','Impact',sans-serif;
          font-size: clamp(13px,4vw,18px);
          color: #1a0a00; line-height: 1.2;
          text-align: center;
        }
        .fc-flag { font-size: clamp(18px,5vw,26px); }
        .fc-edition {
          font-family: 'Anton','Impact',sans-serif;
          font-size: 9px; letter-spacing: 0.15em;
          color: rgba(26,10,0,0.7); text-transform: uppercase;
          text-align: right; margin-top: 2px;
        }

        /* foto */
        .fc-photo-wrap {
          flex: 1; display: flex; align-items: flex-end; justify-content: center;
          overflow: hidden; position: relative;
          padding: 0 12px;
        }
        .fc-photo {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center top;
          border-radius: 4px 4px 0 0;
        }
        .fc-photo-placeholder {
          width: 85%; height: 90%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 8px;
          border: 2px dashed rgba(26,10,0,0.35);
          border-radius: 8px; background: rgba(0,0,0,0.12);
        }
        .fc-upload-icon { font-size: 36px; opacity: 0.5; }
        .fc-upload-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
          color: rgba(26,10,0,0.6); text-transform: uppercase;
          text-align: center; line-height: 1.3;
        }

        /* nombre */
        .fc-name {
          font-family: 'Anton','Impact',sans-serif;
          font-size: clamp(18px,5.5vw,26px);
          color: #1a0a00; letter-spacing: 0.06em; text-transform: uppercase;
          text-align: center; padding: 4px 8px 0;
          text-shadow: 0 1px 0 rgba(255,255,255,0.25);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        /* stats */
        .fc-stats {
          display: grid; grid-template-columns: repeat(3,1fr);
          gap: 1px; padding: 6px 10px 10px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.3));
          border-top: 1px solid rgba(26,10,0,0.2);
          margin-top: 4px;
        }
        .fc-stat {
          display: flex; flex-direction: column; align-items: center; gap: 1px;
        }
        .fc-stat-val {
          font-family: 'Anton','Impact',sans-serif;
          font-size: clamp(14px,4.2vw,20px);
          color: #1a0a00; line-height: 1;
        }
        .fc-stat-key {
          font-size: 8px; font-weight: 800; letter-spacing: 0.1em;
          color: rgba(26,10,0,0.65); text-transform: uppercase;
        }

        /* botón subir foto debajo de la carta */
        .fc-upload-btn {
          margin-top: 16px;
          padding: 10px 28px; border-radius: 999px;
          border: 2px solid #f0d060;
          background: rgba(240,208,60,0.12);
          color: #f0d060;
          font-family: 'Anton','Impact',sans-serif;
          font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer; transition: background 0.2s;
        }
        .fc-upload-btn:hover { background: rgba(240,208,60,0.25); }

        /* botón continuar */
        .fc-continuar {
          margin-top: 14px;
          padding: 12px 32px; border-radius: 999px;
          border: none;
          background: linear-gradient(135deg, #25D366, #128C7E);
          color: #fff;
          font-family: 'Anton','Impact',sans-serif;
          font-size: 15px; letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(37,211,102,0.35);
        }
      `}</style>

      <div className="fc-root">
        <p style={{
          fontFamily: "'Anton','Impact',sans-serif",
          fontSize: 'clamp(11px,3vw,13px)',
          color: 'rgba(255,255,80,0.7)', letterSpacing: '0.2em',
          textTransform: 'uppercase', marginBottom: 12, textAlign: 'center',
        }}>⭐ Tu carta de jugador ⭐</p>

        {/* ── CARTA FIFA ── */}
        <div className="fc-card" onClick={() => fileRef.current?.click()}>
          <div className="fc-inner">

            {/* top: rating | posición + bandera + edición */}
            <div className="fc-top">
              <div>
                <div className="fc-rating">99</div>
                <div className="fc-pos">DEL</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="fc-flag">🇨🇴</div>
                <div className="fc-edition">Birthday Ed.</div>
              </div>
            </div>

            {/* foto */}
            <div className="fc-photo-wrap">
              {photo ? (
                <img src={photo} alt="jugador" className="fc-photo" />
              ) : (
                <div className="fc-photo-placeholder">
                  <span className="fc-upload-icon">📸</span>
                  <span className="fc-upload-label">Toca para<br/>subir tu foto</span>
                </div>
              )}
            </div>

            {/* nombre */}
            <div className="fc-name">{nombre}</div>

            {/* stats */}
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

        {/* botones */}
        <button className="fc-upload-btn" onClick={() => fileRef.current?.click()}>
          📷 {photo ? 'Cambiar foto' : 'Subir foto'}
        </button>
        <button className="fc-continuar" onClick={onContinuar}>
          Ver datos del evento →
        </button>

        <input
          ref={fileRef} type="file" accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFile}
        />
      </div>
    </>
  );
}
