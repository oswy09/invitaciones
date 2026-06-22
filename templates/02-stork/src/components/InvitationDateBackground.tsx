import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Navigation } from 'lucide-react';

interface InvitationDateBackgroundProps {
  onEnterClick?: () => void;
  onHowToGetThereClick?: () => void;
}

// Sparkle/star data to place dynamic floating stars
const FLOAT_STARS = [
  { id: 1, top: '8%', left: '12%', size: 'text-[20px] sm:text-[24px]', delay: 0.2, duration: 4.5, type: '★', color: 'text-amber-300/80' },
  { id: 2, top: '22%', left: '78%', size: 'text-[15px] sm:text-[18px]', delay: 1.5, duration: 5.0, type: '✦', color: 'text-sky-300/90' },
  { id: 3, top: '15%', left: '45%', size: 'text-[12px] sm:text-[14px]', delay: 0.8, duration: 3.5, type: '✦', color: 'text-amber-200/70' },
  { id: 4, top: '78%', left: '8%', size: 'text-[18px] sm:text-[22px]', delay: 2.1, duration: 6.0, type: '★', color: 'text-sky-400/80' },
  { id: 5, top: '85%', left: '85%', size: 'text-[22px] sm:text-[26px]', delay: 0.5, duration: 4.8, type: '✦', color: 'text-amber-300/90' },
  { id: 6, top: '48%', left: '92%', size: 'text-[14px] sm:text-[16px]', delay: 1.1, duration: 3.8, type: '★', color: 'text-sky-300/80' },
  { id: 7, top: '65%', left: '72%', size: 'text-[13px] sm:text-[15px]', delay: 2.8, duration: 4.2, type: '✦', color: 'text-amber-200/80' },
  { id: 8, top: '55%', left: '18%', size: 'text-[16px] sm:text-[19px]', delay: 1.7, duration: 5.5, type: '✦', color: 'text-sky-200/90' },
];

export const InvitationDateBackground: React.FC<InvitationDateBackgroundProps> = ({
  onEnterClick,
  onHowToGetThereClick
}) => {
  return (
    <div
      className="w-screen relative left-1/2 -translate-x-1/2 select-none py-20 sm:py-24 my-8 relative overflow-hidden"
      id="date-badge-container"
    >
      {/* Twinkling and Floating Stars Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-2">
        {FLOAT_STARS.map((star) => (
          <motion.div
            key={star.id}
            initial={{ opacity: 0.3, scale: 0.8, y: 0 }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.15, 0.8],
              y: [0, -8, 0],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: star.delay,
            }}
            className={`absolute ${star.size} ${star.color} drop-shadow-[0_2px_4px_rgba(255,255,255,0.7)] font-bold`}
            style={{ top: star.top, left: star.left }}
          >
            {star.type}
          </motion.div>
        ))}

        {/* 
          Whimsical, beautiful floating SVG cloud elements 
          These clouds drift and breathe behind the cards, blending perfectly with the striped background
        */}
        <motion.div
          animate={{
            x: [-15, 20, -15],
            y: [-4, 6, -4],
            scale: [1, 1.03, 1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-6 -left-8 sm:left-[5%] z-1 opacity-[0.88] pointer-events-none filter drop-shadow-[0_10px_20px_rgba(186,230,253,0.18)]"
        >
          <svg width="220" height="135" viewBox="0 0 100 62" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 45a15 15 0 0 1 18-20 22 22 0 0 1 40-4 15 15 0 0 1 10 14c0 8.3-6.7 15-15 15H20c-8.3 0-15-6.7-15-15a15 15 0 0 1 15-10z" fill="white" fillOpacity="0.92" />
          </svg>
        </motion.div>

        <motion.div
          animate={{
            x: [20, -20, 20],
            y: [5, -5, 5],
            scale: [1, 0.97, 1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-8 -right-12 sm:right-[5%] z-1 opacity-80 pointer-events-none filter drop-shadow-[0_10px_20px_rgba(186,230,253,0.15)]"
        >
          <svg width="260" height="160" viewBox="0 0 100 62" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 45a15 15 0 0 1 18-20 22 22 0 0 1 40-4 15 15 0 0 1 10 14c0 8.3-6.7 15-15 15H20c-8.3 0-15-6.7-15-15a15 15 0 0 1 15-10z" fill="white" fillOpacity="0.88" />
          </svg>
        </motion.div>

        {/* Medium auxiliary drifting cloud */}
        <motion.div
          animate={{
            x: [-30, 40, -30],
            y: [8, -8, 8],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-12 right-[18%] z-1 opacity-45 pointer-events-none filter blur-[1px]"
        >
          <svg width="120" height="74" viewBox="0 0 100 62" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 45a15 15 0 0 1 18-20 22 22 0 0 1 40-4 15 15 0 0 1 10 14c0 8.3-6.7 15-15 15H20c-8.3 0-15-6.7-15-15a15 15 0 0 1 15-10z" fill="white" fillOpacity="0.8" />
          </svg>
        </motion.div>
      </div>

      {/* Centered card alignment inside the edge-to-edge strip */}
      <div className="max-w-[620px] mx-auto px-4 relative z-10">
        
        {/* Horizontal Row styled with bouncy high-contrast bubble grids */}
        <motion.div 
          className="flex flex-col gap-4 w-full"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: 0.12,
                duration: 0.6,
                ease: "easeOut"
              }
            }
          }}
        >
          {/* Row of Fecha & Hora (2 columns side by side) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 items-stretch text-center">
            
            {/* Item 1: FECHA */}
            <motion.div 
              whileHover={{ scale: 1.05, y: -3, rotate: -0.5 }}
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 10 },
                visible: { opacity: 1, scale: 1, y: 0 }
              }}
              className="flex flex-col items-center justify-between p-3.5 sm:p-5 rounded-3xl bg-white/90 backdrop-blur-md shadow-md border border-sky-100/60 text-center"
            >
              <div className="flex flex-col items-center">
                {/* Soft Baby Blue Bubble Icon wrapper */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-sky-100/90 border border-sky-200/50 text-sky-600 flex items-center justify-center shadow-xs">
                  <Calendar className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.5]" />
                </div>
                <span className="text-[10px] sm:text-[12px] font-black tracking-wider text-sky-600 font-fredoka uppercase mt-2 sm:mt-2.5 leading-none">
                  FECHA
                </span>
                <span className="text-[16px] sm:text-[19px] font-black text-sky-950 font-fredoka mt-1.5 leading-none">
                  5 de Julio
                </span>
              </div>
              <span className="text-[11px] sm:text-[12px] font-black text-sky-700 font-fredoka mt-3 leading-none uppercase bg-sky-50 px-3 py-1.5 rounded-full">
                Dom, 2026
              </span>
            </motion.div>

            {/* Item 2: HORA */}
            <motion.div 
              whileHover={{ scale: 1.05, y: -3, rotate: 0.5 }}
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 10 },
                visible: { opacity: 1, scale: 1, y: 0 }
              }}
              className="flex flex-col items-center justify-between p-3.5 sm:p-5 rounded-3xl bg-white/90 backdrop-blur-md shadow-md border border-sky-100/60 text-center"
            >
              <div className="flex flex-col items-center">
                {/* Soft Baby Blue Bubble Icon wrapper */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-sky-100/95 border border-sky-200/50 text-sky-600 flex items-center justify-center shadow-xs">
                  <Clock className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.5]" />
                </div>
                <span className="text-[10px] sm:text-[12px] font-black tracking-wider text-sky-600 font-fredoka uppercase mt-2 sm:mt-2.5 leading-none">
                  HORA
                </span>
                <span className="text-[16px] sm:text-[19px] font-black text-sky-950 font-fredoka mt-1.5 leading-none">
                  10:30 AM
                </span>
              </div>
              <span className="text-[11px] sm:text-[12px] font-black text-sky-700 font-fredoka mt-3 leading-none uppercase bg-sky-50 px-3 py-1.5 rounded-full whitespace-nowrap">
                1:30 PM
              </span>
            </motion.div>

          </div>

          {/* Item 3: UBICACIÓN / LUGAR (Full Single Column Card for detailed text) */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -2 }}
            variants={{
              hidden: { opacity: 0, scale: 0.95, y: 10 },
              visible: { opacity: 1, scale: 1, y: 0 }
            }}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 sm:p-6 rounded-3xl bg-white/90 backdrop-blur-md shadow-md border border-sky-100/60 text-center sm:text-left w-full relative overflow-hidden"
          >
            {/* Soft decorative background highlight */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50/30 rounded-bl-full pointer-events-none" />

            {/* Soft Baby Blue Bubble Icon wrapper */}
            <div className="w-11 h-11 rounded-full bg-sky-100/90 border border-sky-200/50 text-sky-600 flex items-center justify-center shadow-sm flex-shrink-0 mx-auto sm:mx-0">
              <MapPin className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>

            <div className="flex flex-col items-center sm:items-start w-full relative z-10">
              <span className="text-[11px] sm:text-[12px] font-black tracking-wider text-sky-600 font-fredoka uppercase leading-none mb-1.5">
                UBICACIÓN / LUGAR
              </span>
              <span className="text-[17px] sm:text-[20px] font-black text-sky-950 font-fredoka leading-snug">
                Carrera 14A #109-55
              </span>
              <span className="text-[14px] sm:text-[16px] font-semibold text-slate-700 font-fredoka mt-1 leading-relaxed">
                Edificio Jade – Piso 13
              </span>
              <span className="text-[13px] sm:text-[15px] font-bold text-sky-700 font-fredoka mt-2 leading-relaxed">
                Terraza con espacio cubierto
              </span>
              
              {/* Features and attributes badges */}
              <div className="mt-3 flex flex-wrap gap-2 items-center justify-center sm:justify-start w-full">
                <span className="text-[11px] sm:text-[12px] font-black text-emerald-700 uppercase bg-emerald-50 border border-emerald-250/30 px-3 py-1 rounded-full font-fredoka flex items-center gap-1 shadow-3xs">
                  Parqueadero disponible
                </span>
                <span className="text-[11px] sm:text-[12px] font-black text-sky-600 uppercase bg-sky-50 border border-sky-100 px-3 py-1 rounded-full font-fredoka shadow-3xs">
                  Bogotá, Colombia
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
        {/* Dynamic Interactive Call-to-Actions (Calendar & Live Maps) */}
        <div className="w-full flex justify-center gap-3 mt-8 relative z-10 font-fredoka px-4">
          
          {/* Button 1: Smart Unified Add to Calendar */}
          <motion.button
            onClick={onEnterClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2.5 rounded-full text-[11px] sm:text-xs font-black tracking-wide uppercase cursor-pointer bg-sky-50/90 hover:bg-sky-100/90 border border-sky-250/50 text-sky-800 shadow-2xs transition-all flex items-center justify-center gap-1.5"
            id="btn-smart-calendar"
          >
            <span className="text-sm">📅</span>
            <span>Agendar Evento</span>
          </motion.button>

          {/* Button 2: Cómo Llegar (Interactive Mapbox Modal) */}
          <motion.button
            onClick={onHowToGetThereClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2.5 rounded-full text-[11px] sm:text-xs font-black tracking-wide uppercase cursor-pointer bg-sky-50/90 hover:bg-sky-100/90 border border-sky-250/50 text-sky-800 shadow-2xs transition-all flex items-center justify-center gap-1.5 relative"
            id="btn-show-interactive-map"
          >
            <span>📍</span>
            <span>Cómo llegar</span>
          </motion.button>
        </div>

      </div>

    </div>
  );
};

