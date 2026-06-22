import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Compass, RotateCw, ZoomIn, ZoomOut, MapPin, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Set mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

interface BabyShowerMapProps {
  locationName: string;
  locationAddress: string;
}

const BabyShowerMap: React.FC<BabyShowerMapProps> = ({ locationName, locationAddress }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [zoom, setZoom] = useState(16.5);
  const [bearing, setBearing] = useState(25);
  const rotationRequestRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Define coords for Edificio Jade
    const centerCoords: [number, number] = [-74.0326, 4.69176];

    try {
      // Initialize map
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: centerCoords,
        zoom: 16.5,
        pitch: 65, // tilted view to highlight 3D buildings and orientation
        bearing: 25,
        antialias: true
      });

      mapRef.current = map;

      // Set nice marker
      const markerEl = document.createElement("div");
      markerEl.className = "flex items-center justify-center relative";
      markerEl.innerHTML = `
        <div class="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#4A5D6B] text-[#FFF] text-[10px] font-sans font-bold py-1 px-2.5 rounded-lg whitespace-nowrap shadow-md border border-white/50">
          🦖 Baby Shower Thomas
        </div>
        <div class="h-8 w-8 bg-[#C3A66A] rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse relative z-10">
          <svg style="width:16px;height:16px;color:white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <circle cx="12" cy="11" r="3" fill="white" />
          </svg>
        </div>
        <span class="absolute inline-flex h-12 w-12 rounded-full bg-[#C3A66A] opacity-25 animate-ping"></span>
      `;

      new mapboxgl.Marker(markerEl)
        .setLngLat(centerCoords)
        .addTo(map);

      // Setup 3D buildings extrusion layer on style load
      map.on("style.load", () => {
        const layers = map.getStyle()?.layers;
        const labelLayerId = layers?.find(
          (layer) => layer.type === "symbol" && layer.layout?.["text-field"]
        )?.id;

        // Custom sky layer for beautiful light atmospherics
        map.setFog({
          "range": [0.8, 8],
          "color": "#e0edf5",
          "high-color": "#a4c4dc",
          "space-color": "#0a131b",
          "horizon-blend": 0.15
        });

        // 3D buildings extrusion layer
        map.addLayer(
          {
            id: "3d-buildings",
            source: "composite",
            "source-layer": "building",
            filter: ["==", "extrude", "true"],
            type: "fill-extrusion",
            minzoom: 15,
            paint: {
              "fill-extrusion-color": [
                "interpolate",
                ["linear"],
                ["get", "height"],
                0,
                "#EBEBF1",
                45,
                "#CBE0EE",
                90,
                "#89AFCD"
              ],
              "fill-extrusion-height": [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                0,
                15.05,
                ["get", "height"]
              ],
              "fill-extrusion-base": [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                0,
                15.05,
                ["get", "min_height"]
              ],
              "fill-extrusion-opacity": 0.8
            }
          },
          labelLayerId
        );
      });

      // Track zoom & bearing change updates
      map.on("move", () => {
        setZoom(map.getZoom());
        setBearing(map.getBearing());
      });

      return () => {
        if (rotationRequestRef.current) {
          cancelAnimationFrame(rotationRequestRef.current);
        }
        map.remove();
      };
    } catch (err) {
      console.error("Mapbox GL loading failed:", err);
    }
  }, []);

  // Frame rotation animation loop
  useEffect(() => {
    const rotateMap = () => {
      if (!isRotating || !mapRef.current) return;
      
      const currentBearing = mapRef.current.getBearing();
      // slow, subtle rotation speed
      const newBearing = (currentBearing + 0.08) % 360;
      mapRef.current.setBearing(newBearing);
      
      rotationRequestRef.current = requestAnimationFrame(rotateMap);
    };

    if (isRotating) {
      rotationRequestRef.current = requestAnimationFrame(rotateMap);
    } else {
      if (rotationRequestRef.current) {
        cancelAnimationFrame(rotationRequestRef.current);
      }
    }

    return () => {
      if (rotationRequestRef.current) {
        cancelAnimationFrame(rotationRequestRef.current);
      }
    };
  }, [isRotating]);

  const handleZoomIn = () => {
    if (!mapRef.current) return;
    setIsRotating(false);
    mapRef.current.zoomTo(mapRef.current.getZoom() + 0.5, { duration: 400 });
  };

  const handleZoomOut = () => {
    if (!mapRef.current) return;
    setIsRotating(false);
    mapRef.current.zoomTo(mapRef.current.getZoom() - 0.5, { duration: 400 });
  };

  const toggleRotation = () => {
    setIsRotating((prev) => !prev);
  };

  const resetView = () => {
    if (!mapRef.current) return;
    setIsRotating(false);
    mapRef.current.flyTo({
      center: [-74.0326, 4.69176],
      zoom: 16.5,
      pitch: 65,
      bearing: 25,
      essential: true,
      duration: 1200
    });
  };

  return (
    <div className="w-full relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-50 min-h-[300px] sm:min-h-[380px] select-none text-[#4A5D6B]">
      
      {/* Actual map target container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-[300px] sm:h-[380px] z-0" 
      />

      {/* Elegant floating information card referencing the style from reference image */}
      <div className="absolute top-3 left-3 right-3 sm:right-auto sm:max-w-xs z-10 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-lg pointer-events-auto flex flex-col gap-1.5 transition-all text-left">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 bg-[#25D366]/10 text-[#25D366] rounded-xl flex items-center justify-center shrink-0 border border-[#25D366]/20">
            <Navigation size={16} className="animate-pulse" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-sans font-extrabold text-stone-800 leading-tight">{locationName}</span>
          </div>
        </div>

        <hr className="border-stone-100 my-0.5" />

        <div className="text-left">
          <p className="font-sans text-[11px] font-bold text-stone-500 leading-relaxed">
            📍 {locationAddress}
          </p>
        </div>
      </div>

      {/* Floating map camera custom orbital controllers (elegant glassmorphism) */}
      <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-2 pointer-events-auto">
        <button 
          onClick={toggleRotation}
          title={isRotating ? "Pausar rotación" : "Girar mapa en 3D"}
          className={`h-9 px-3 text-xs font-sans font-bold flex items-center gap-1.5 rounded-xl border backdrop-blur-md shadow-md transition-all cursor-pointer ${
            isRotating 
              ? "bg-[#4A5D6B] text-white border-[#4A5D6B]" 
              : "bg-white/90 hover:bg-slate-50 text-stone-700 border-slate-200"
          }`}
        >
          <RotateCw size={13} className={isRotating ? "animate-spin" : ""} />
          <span>{isRotating ? "Órbita Activa" : "Girar 3D"}</span>
        </button>

        <button 
          onClick={resetView}
          title="Centrar en el salón"
          className="h-9 px-3 text-xs font-sans font-bold flex items-center gap-1.5 bg-white/90 hover:bg-slate-50 text-stone-700 border border-slate-200 rounded-xl backdrop-blur-md shadow-md transition-all cursor-pointer"
        >
          <Compass size={13} />
          <span>Centrar</span>
        </button>
      </div>

      {/* Floating Map Zoom icons */}
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5 pointer-events-auto">
        <button 
          onClick={handleZoomIn}
          title="Acercar"
          className="h-8 w-8 bg-white/95 hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-stone-700 shadow-md transition-all cursor-pointer font-extrabold"
        >
          <ZoomIn size={15} />
        </button>
        <button 
          onClick={handleZoomOut}
          title="Alejar"
          className="h-8 w-8 bg-white/95 hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-stone-700 shadow-md transition-all cursor-pointer font-extrabold"
        >
          <ZoomOut size={15} />
        </button>
      </div>

      {/* Fine-print coordinates badge at bottom right layout */}
      <div className="absolute bottom-1 right-20 z-10 bg-white/30 backdrop-blur-xs py-0.5 px-2 rounded-md border border-white/20 select-none pointer-events-none hidden sm:block">
        <span className="font-mono text-[9px] text-[#4A5D6B] font-semibold">
          {bearing.toFixed(1)}° bearing | {zoom.toFixed(1)} zoom
        </span>
      </div>
    </div>
  );
};

export default BabyShowerMap;
