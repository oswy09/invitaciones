import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { LocationDetail } from '../types';
import { Copy, Check, X, Navigation } from 'lucide-react';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

interface LocationModalProps {
  location: LocationDetail | null;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ location, onClose }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!location || !mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [location.lng, location.lat],
      zoom: 15.5,
      pitch: 50,
      bearing: -15,
      antialias: true,
    });

    mapRef.current = map;

    // Custom marker
    const el = document.createElement('div');
    el.innerHTML = `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;">
        <span style="position:absolute;width:48px;height:48px;border-radius:50%;background:#8aaa8650;animation:mapPing 1.5s ease-out infinite;"></span>
        <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#3e5a3c,#5a7a58);border:2.5px solid white;box-shadow:0 3px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;z-index:1;">
          💒
        </div>
      </div>
      <style>@keyframes mapPing{0%{transform:scale(0.8);opacity:0.8;}100%{transform:scale(2.2);opacity:0;}}</style>
    `;

    new mapboxgl.Marker({ element: el, anchor: 'center' })
      .setLngLat([location.lng, location.lat])
      .addTo(map);

    // 3D buildings on load
    map.on('style.load', () => {
      map.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': ['interpolate', ['linear'], ['get', 'height'], 0, '#E8EDE5', 50, '#C8D5C4', 100, '#A0B89C'],
          'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'height']],
          'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'min_height']],
          'fill-extrusion-opacity': 0.75,
        },
      });
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [location]);

  if (!location) return null;

  const gmapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.placeName}, ${location.address}`)}`;
  const wazeLink = `https://waze.com/ul?q=${encodeURIComponent(`${location.placeName}, ${location.address}`)}&navigate=yes`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${location.placeName}, ${location.address}, ${location.cityState}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: '#FBF8F2', border: '1px solid #DCE5DA', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ background: '#F2EFE6', borderBottom: '1px solid #E4EAE1' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#3e5a3c', color: 'white' }}>
              <Navigation size={16} />
            </div>
            <div>
              <span className="block font-cinzel text-[10px] tracking-[0.24em] text-[#3D4E3A] uppercase font-semibold">{location.time}</span>
              <span className="block font-cinzel text-[12px] tracking-[0.12em] text-[#2D382B] font-semibold">{location.title}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/15 text-[#3D4E3A] transition" aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        {/* Map */}
        <div className="relative w-full" style={{ height: 240 }}>
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
          {/* Name overlay */}
          <div className="absolute top-2 left-2 right-2 z-10 pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(251,248,242,0.92)', border: '1px solid rgba(200,210,195,0.8)', backdropFilter: 'blur(4px)' }}>
              <span className="font-garamond text-sm font-semibold text-[#2D382B]">{location.placeName}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p className="font-garamond text-sm text-[#3D4E3A] leading-relaxed">
            {location.address}<br />
            <span className="text-[#4A5E47]">{location.cityState}</span>
          </p>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <a href={gmapsLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-[11px] font-montserrat uppercase tracking-wider font-semibold transition-all"
              style={{ background: '#2D382B', color: '#FBF8F2' }}>
              🗺️ Google Maps
            </a>
            <a href={wazeLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-[11px] font-montserrat uppercase tracking-wider font-semibold transition-all"
              style={{ background: '#354334', color: '#FBF8F2' }}>
              🚗 Waze
            </a>
          </div>

          <button onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-montserrat transition-all"
            style={{ color: copied ? '#3a7c3a' : '#5B6B58' }}>
            {copied ? <><Check size={13} /> ¡Dirección copiada!</> : <><Copy size={13} /> Copiar dirección</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
