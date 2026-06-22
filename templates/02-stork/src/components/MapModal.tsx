import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, X, Compass, Check, Copy } from 'lucide-react';
import mapboxgl from 'mapbox-gl';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const LATITUDE = 4.69248;
const LONGITUDE = -74.03260;
const VENUE_NAME = 'Edificio Jade – Piso 13';
const VENUE_ADDRESS = 'Carrera 14A #109-55, Bogotá';

export const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Set mapbox access token
    mapboxgl.accessToken = ACCESS_TOKEN;

    // Initialize mapbox map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11', // Beautiful, modern pastel light style
      center: [LONGITUDE, LATITUDE], // [lng, lat]
      zoom: 15.5,
      pitch: 45, // Elegant slightly tilted perspective
      bearing: -10,
    });

    mapRef.current = map;

    // Add navigation controls (zoom in/out, rotating compass)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Create custom cute HTML marker element
    const el = document.createElement('div');
    el.className = 'custom-marker flex items-center justify-center';
    el.innerHTML = `
      <div class="relative flex items-center justify-center">
        <!-- Ping ripple -->
        <span class="absolute inline-flex h-12 w-12 rounded-full bg-sky-400 opacity-75 animate-ping"></span>
        <!-- Inner Baby Pin Badge -->
        <div class="relative w-10 h-10 rounded-full bg-white border-2 border-sky-400 shadow-md flex items-center justify-center text-xl cursor-pointer hover:scale-110 transition-transform">
          👶
        </div>
        <!-- Pointer tail -->
        <div class="absolute -bottom-1 w-2.5 h-2.5 bg-sky-400 rotate-45"></div>
      </div>
    `;

    // Add popup with address and event details
    const popupHtml = `
      <div class="p-3 text-center font-fredoka">
        <h4 class="font-black text-sky-950 text-[16px]">🎈 Shower Thomas 🎈</h4>
        <p class="text-[14px] text-sky-600 font-extrabold mt-1">Edificio Jade - Piso 13</p>
        <p class="text-[13px] text-slate-500 font-semibold mt-0.5">${VENUE_ADDRESS}</p>
        <div class="mt-2 text-[12px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full font-bold uppercase inline-block">
          🌅 Terraza Especial
        </div>
      </div>
    `;

    const popup = new mapboxgl.Popup({ offset: 30 })
      .setHTML(popupHtml);

    // Create and add the marker to the map
    new mapboxgl.Marker({ element: el })
      .setLngLat([LONGITUDE, LATITUDE])
      .setPopup(popup)
      .addTo(map);

    // Auto open popup after map loads
    map.on('load', () => {
      popup.addTo(map);
    });

    // Cleanup resources
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${VENUE_NAME}, ${VENUE_ADDRESS}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            id="map-backdrop"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-white rounded-[32px] w-full max-w-xl overflow-hidden shadow-2xl border-4 border-white relative z-10 font-fredoka flex flex-col"
            id="map-modal-box"
          >
            {/* Soft decorative inner border line */}
            <div className="absolute inset-1.5 border border-dashed border-sky-100 rounded-[26px] pointer-events-none z-20" />

            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-sky-100/50 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-[38px] h-[38px] rounded-full bg-sky-400 flex items-center justify-center text-white text-lg">
                  📍
                </div>
                <div className="text-left">
                  <h3 className="font-extrabold text-[#57423f] text-[22px] sm:text-[24px] leading-none">Cómo llegar al evento</h3>
                  <p className="text-[14px] sm:text-[15px] text-sky-500 font-extrabold tracking-wider uppercase mt-1">Ubicación del Baby Shower</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shadow-xs cursor-pointer z-30"
                id="btn-close-map-modal"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Map Area */}
            <div className="relative h-[280px] sm:h-[340px] w-full bg-slate-50">
              <div ref={mapContainerRef} className="absolute inset-0 z-0 h-full w-full" />
              
              {/* Compass Indicator Over Map */}
              <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-sky-100 shadow-xs text-[13px] text-slate-600 font-bold flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-sky-400 animate-spin-slow" />
                <span>Mapbox Live Map</span>
              </div>
            </div>

            {/* Venue info & external app launchers */}
            <div className="p-5 bg-white border-t border-sky-100/50 relative z-10 flex flex-col gap-3.5">
              
              {/* Detailed directions text */}
              <div className="text-left bg-sky-50/50 rounded-2xl p-3 border border-sky-100/40">
                <p className="font-black text-[18px] sm:text-[20px] text-sky-950">{VENUE_NAME}</p>
                <p className="text-[16px] sm:text-[17px] font-bold text-slate-500 mt-0.5">{VENUE_ADDRESS}</p>
                <p className="text-[15px] sm:text-[16px] font-semibold text-slate-400 mt-1 leading-relaxed">
                  🏢 Piso 13 • 🌳 Terraza con área cubierta.
                  <br />
                  🚗 Parqueadero privado disponible en el edificio para invitados.
                </p>
              </div>

              {/* Copy address action instead of external mobile app redirects */}
              <div className="w-full mt-1">
                <button
                  onClick={handleCopy}
                  className={`w-full py-3.5 px-6 rounded-full text-[15px] sm:text-[16px] font-black uppercase tracking-wider shadow-xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border ${
                    copied
                      ? 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200 text-emerald-800'
                      : 'bg-indigo-50 hover:bg-indigo-100/80 border-indigo-150 text-[#57423f]'
                  }`}
                  id="btn-copy-address-modal"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                      <span>¡Dirección Copiada!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500 stroke-[2.5]" />
                      <span>Copiar Dirección</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
