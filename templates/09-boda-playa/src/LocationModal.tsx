import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

export interface LocationData {
  title: string;
  placeName: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  emoji: string;
}

interface Props {
  location: LocationData | null;
  onClose: () => void;
}

export function LocationModal({ location, onClose }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (location) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [location]);

  useEffect(() => {
    if (!location || !mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [location.lng, location.lat],
      zoom: 14.5,
      pitch: 45,
      bearing: -10,
      antialias: true,
    });

    mapInstanceRef.current = map;

    const el = document.createElement('div');
    el.innerHTML = `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;">
        <span style="position:absolute;width:44px;height:44px;border-radius:50%;background:rgba(180,140,80,0.35);animation:pingBeach 1.6s ease-out infinite;"></span>
        <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#C8956C,#8B6030);border:2.5px solid #FFF8EE;box-shadow:0 3px 14px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:15px;z-index:1;">
          ${location.emoji}
        </div>
      </div>
      <style>@keyframes pingBeach{0%{transform:scale(0.8);opacity:0.8;}100%{transform:scale(2.4);opacity:0;}}</style>
    `;

    new mapboxgl.Marker({ element: el, anchor: 'center' })
      .setLngLat([location.lng, location.lat])
      .addTo(map);

    return () => { mapInstanceRef.current?.remove(); mapInstanceRef.current = null; };
  }, [location]);

  if (!location) return null;

  const gmapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.placeName}, ${location.city}`)}`;
  const wazeLink = `https://waze.com/ul?q=${encodeURIComponent(`${location.placeName}, ${location.city}`)}&navigate=yes`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${location.placeName}, ${location.address}, ${location.city}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 340);
  };

  return (
    <>
      <style>{`
        @keyframes fadeInOverlay09 {
          from { opacity: 0; } to { opacity: 1; }
        }
      `}</style>
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(20,12,5,0.6)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          animation: 'fadeInOverlay09 0.28s ease-out forwards',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 480,
            background: '#F4EFE5',
            borderRadius: '20px 20px 0 0',
            overflow: 'hidden',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.35)',
            maxHeight: '88dvh',
            display: 'flex', flexDirection: 'column',
            transform: visible ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.38s cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px',
            background: '#EDE5D6',
            borderBottom: '1px solid rgba(139,104,64,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg,#C8956C,#8B6030)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {location.title === 'Ceremonia'
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF8EE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22V10l9-8 9 8v12"/><path d="M9 22V12h6v10"/><path d="M12 2v4"/><circle cx="12" cy="4" r="1.2" fill="#FFF8EE" stroke="none"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF8EE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>}
              </div>
              <div>
                <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8B6840', margin: 0, fontWeight: 600 }}>Ubicación</p>
                <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 14, color: '#2A1A0E', margin: 0, fontWeight: 700, letterSpacing: '0.06em' }}>{location.title}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              style={{ background: 'rgba(139,104,64,0.15)', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', fontSize: 16, color: '#5C3D1E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >×</button>
          </div>

          {/* Mapa */}
          <div style={{ position: 'relative', height: 220, flexShrink: 0 }}>
            <div ref={mapRef} style={{ position: 'absolute', inset: 0 }} />
            <div style={{
              position: 'absolute', top: 10, left: 10, zIndex: 10,
              background: 'rgba(244,239,229,0.93)', border: '1px solid rgba(139,104,64,0.3)',
              backdropFilter: 'blur(4px)', borderRadius: 8,
              padding: '4px 10px',
            }}>
              <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 12, color: '#2A1A0E', margin: 0, fontWeight: 600 }}>{location.placeName}</p>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 15, color: '#2A1A0E', margin: '0 0 2px', fontWeight: 500 }}>{location.address}</p>
              <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontStyle: 'italic', fontSize: 13, color: '#7A5C38', margin: 0 }}>{location.city}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {/* Google Maps — sólido oscuro */}
              <a href={gmapsLink} target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                padding: '12px 8px', borderRadius: 50,
                background: '#2A1A0E', color: '#F4EFE5',
                fontFamily: "'Montserrat',sans-serif", fontSize: 10, letterSpacing: '0.1em',
                textTransform: 'uppercase', textDecoration: 'none', fontWeight: 600,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F4EFE5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                Google Maps
              </a>
              {/* Waze — ghost */}
              <a href={wazeLink} target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                padding: '12px 8px', borderRadius: 50,
                background: 'none', color: '#2A1A0E',
                border: '1.5px solid rgba(42,26,14,0.45)',
                fontFamily: "'Montserrat',sans-serif", fontSize: 10, letterSpacing: '0.1em',
                textTransform: 'uppercase', textDecoration: 'none', fontWeight: 600,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2A1A0E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                Waze
              </a>
            </div>

            <button onClick={handleCopy} style={{
              background: 'none', border: '1.5px solid rgba(139,104,64,0.35)',
              borderRadius: 50, cursor: 'pointer', padding: '11px 20px',
              fontFamily: "'Montserrat',sans-serif", fontSize: 11, letterSpacing: '0.08em',
              color: copied ? '#3D6B2C' : '#5C3D1E', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'color 0.2s',
            }}>
              {copied
                ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3D6B2C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>¡Dirección copiada!</>
                : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5C3D1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copiar dirección</>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
