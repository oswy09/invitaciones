import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface HourglassCountdownProps {
  targetDateStr?: string;
}

export const HourglassCountdown: React.FC<HourglassCountdownProps> = ({ 
  targetDateStr = '2026-07-05T10:30:00' 
}) => {
  const targetDate = new Date(targetDateStr);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - Date.now();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isClient) return null;

  return (
    <div className="flex flex-col items-center justify-center py-4 bg-sky-50/40 rounded-3xl border border-sky-100/50 p-5 mt-4 relative overflow-hidden font-cormorant">
      {/* Decorative dashed inner border */}
      <div className="absolute inset-1 border border-dashed border-sky-200/40 rounded-[20px] pointer-events-none" />

      {/* Title */}
      <div className="text-center mb-4 z-10">
        <span className="text-[24px] sm:text-[28px] text-slate-800 font-black font-fredoka tracking-wide leading-tight">
          ¿Cuánto falta para celebrar?
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 z-10 w-full">
        
        {/* Whimsical Animated Running Hourglass Widget */}
        <div className="relative w-20 h-28 flex items-center justify-center flex-shrink-0 select-none">
          {/* Glass body SVG outline */}
          <svg width="68" height="96" viewBox="0 0 68 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute z-10 filter drop-shadow-[0_4px_8px_rgba(56,189,248,0.15)]">
            {/* Upper Frame */}
            <path d="M4 6H64C66.2091 6 68 4.20914 68 2C68 -0.209139 66.2091 -2 64 -2H4C1.79086 -2 0 -0.209139 0 2C0 4.20914 1.79086 6 4 6Z" fill="#bae6fd" />
            {/* Lower Base */}
            <path d="M4 96H64C66.2091 96 68 94.2091 68 92C68 89.7909 66.2091 88 64 88H4C1.79086 88 0 89.7909 0 92C0 94.2091 1.79086 96 4 96Z" fill="#bae6fd" />
            
            {/* Glass Curvature Outline */}
            <path d="M4 8C4 28 26 40 26 48C26 56 4 68 4 88" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M64 8C64 28 42 40 42 48C42 56 64 68 64 88" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Gentle highlight glow overlay on the glass */}
            <path d="M12 12C12 24 24 32 30 36" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />
          </svg>

          {/* Running sand grains: dripping stream */}
          <div className="absolute top-[41px] left-1/2 -translate-x-1/2 w-1.5 h-18 overflow-hidden z-2 pointer-events-none">
            <motion.div
              animate={{
                y: [0, 40]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-1 h-32 flex flex-col items-center gap-1.5"
            >
              {/* Little sand segments */}
              <div className="w-1 h-2 bg-amber-400 rounded-full" />
              <div className="w-1.5 h-2 bg-amber-300 rounded-full opacity-80" />
              <div className="w-1 h-2 bg-amber-400 rounded-full" />
              <div className="w-1.5 h-2 bg-amber-300 rounded-full opacity-90" />
              <div className="w-1 h-2 bg-amber-400 rounded-full" />
              <div className="w-1.5 h-2 bg-amber-300 rounded-full" />
            </motion.div>
          </div>

          {/* Top Sand level shrinking */}
          <div className="absolute top-[8px] left-[6px] right-[6px] h-10 overflow-hidden z-0">
            <motion.svg
              width="56"
              height="40"
              viewBox="0 0 56 40"
              fill="none"
              className="origin-bottom"
              animate={{
                scaleY: [1, 0.98, 1],
                scaleX: [1, 0.99, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Soft warm yellow/gold sand pile */}
              <path d="M2 2C12 28 20 38 28 38C36 38 44 28 54 2C40 2 16 2 2 2Z" fill="#fbbf24" opacity="0.9" />
              {/* Highlight on top sand */}
              <path d="M10 5C20 5 36 5 46 5" stroke="#fef3c7" strokeWidth="2" strokeLinecap="round" />
            </motion.svg>
          </div>

          {/* Bottom Sand level rising and breathing */}
          <div className="absolute bottom-[8px] left-[6px] right-[6px] h-10 overflow-hidden z-1 flex items-end">
            <motion.svg
              width="56"
              height="30"
              viewBox="0 0 56 30"
              fill="none"
              className="origin-bottom w-full"
              animate={{
                scaleY: [1, 1.03, 1],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Heap shape fitting bottom bulb */}
              <path d="M2 30C2 30 14 18 28 14C42 18 54 30 54 30H2Z" fill="#f59e0b" />
              {/* Flowing impact ripple at connection point */}
              <motion.circle
                cx="28"
                cy="14"
                r="3"
                fill="#fef3c7"
                animate={{
                  scale: [1, 2.5, 1],
                  opacity: [0.9, 0.2, 0.9]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            </motion.svg>
          </div>

          {/* Small dust speckles floating around the glass to make it magical */}
          <motion.div
            animate={{
              y: [-2, 2, -2],
              opacity: [0.4, 0.9, 0.4]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -right-1 top-10 text-[8px] text-amber-400"
          >
            ✦
          </motion.div>
          <motion.div
            animate={{
              y: [2, -2, 2],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            className="absolute -left-2 bottom-12 text-[7px] text-amber-300"
          >
            ✦
          </motion.div>
        </div>

        {/* Countdown Ticker Columns */}
        <div className="flex-1">
          <div className="grid grid-cols-4 gap-2 text-slate-800 tracking-wide">
            
            {/* Days Column */}
            <div className="bg-white/80 backdrop-blur-xs border border-sky-100/60 px-2 py-3.5 rounded-2xl text-center shadow-xs flex flex-col justify-center min-w-[55px] sm:min-w-[65px]">
              <span className="text-xl sm:text-2xl font-black text-sky-600 leading-none font-fredoka">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[12px] font-bold text-slate-700 italic mt-1 font-cormorant">
                Días
              </span>
            </div>

            {/* Hours Column */}
            <div className="bg-white/80 backdrop-blur-xs border border-sky-100/60 px-2 py-3.5 rounded-2xl text-center shadow-xs flex flex-col justify-center min-w-[55px] sm:min-w-[65px]">
              <span className="text-xl sm:text-2xl font-black text-sky-600 leading-none font-fredoka">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[12px] font-bold text-slate-700 italic mt-1 font-cormorant">
                Hrs
              </span>
            </div>

            {/* Minutes Column */}
            <div className="bg-white/80 backdrop-blur-xs border border-sky-100/60 px-2 py-3.5 rounded-2xl text-center shadow-xs flex flex-col justify-center min-w-[55px] sm:min-w-[65px]">
              <span className="text-xl sm:text-2xl font-black text-sky-600 leading-none font-fredoka">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[12px] font-bold text-slate-700 italic mt-1 font-cormorant">
                Mins
              </span>
            </div>

            {/* Seconds Column */}
            <div className="bg-white/80 backdrop-blur-xs border border-sky-100/60 px-2 py-3.5 rounded-2xl text-center shadow-xs flex flex-col justify-center min-w-[55px] sm:min-w-[65px]">
              <motion.span 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-xl sm:text-2xl font-black text-sky-500 leading-none block font-fredoka"
              >
                {String(timeLeft.seconds).padStart(2, '0')}
              </motion.span>
              <span className="text-[12px] font-bold text-slate-700 italic mt-1 font-cormorant">
                Segs
              </span>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
};
