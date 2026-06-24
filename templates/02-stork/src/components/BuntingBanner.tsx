import React from 'react';
import { motion } from 'motion/react';

interface BuntingBannerProps {
  babyName?: string;
  isPreview?: boolean;
  getEditableProps?: (field: string, baseClass?: string) => any;
  extra?: Record<string, any>;
}

export const BuntingBanner: React.FC<BuntingBannerProps> = ({ 
  babyName = 'THOMAS',
  isPreview = false,
  getEditableProps,
  extra
}) => {
  // 4 flags with different shades of blue and delay offsets for waving animation
  const flags = [
    { letter: 'B', color: '#1e40af', delay: 0.0, rotation: -2, hoverColor: '#2563eb' }, // deep blue
    { letter: 'A', color: '#0284c7', delay: 0.2, rotation: 1.5, hoverColor: '#38bdf8' },  // sky blue
    { letter: 'B', color: '#0d9488', delay: 0.4, rotation: -1.5, hoverColor: '#0ea5e9' }, // cyan-teal
    { letter: 'Y', color: '#4f46e5', delay: 0.6, rotation: 2, hoverColor: '#6366f1' },  // indigo/blue
  ];

  return (
    <div className="w-full max-w-[500px] mx-auto py-6 select-none relative overflow-visible flex flex-col items-center">
      {/* Curved Hanging Line */}
      <svg
        viewBox="0 0 500 100"
        className="w-full overflow-visible pointer-events-none absolute top-4 left-0 right-0 h-[80px]"
      >
        <path
          d="M 10,25 Q 250,75 490,25"
          fill="none"
          stroke="#475569"
          strokeWidth="3.5"
          strokeDasharray="1 1"
          strokeLinecap="round"
          className="opacity-60"
        />
        {/* Cute hanging knots on the ends */}
        <circle cx="10" cy="25" r="5" fill="#475569" className="opacity-80" />
        <circle cx="490" cy="25" r="5" fill="#475569" className="opacity-80" />
      </svg>

      {/* Floating pennant flags list */}
      <div className="flex justify-between w-full px-4 relative z-10 pt-2 pb-4">
        {flags.map((flag, idx) => {
          // Calculate the hanging Y position based on the rope curve (quad bezier)
          // Q 250,75 has max center dip.
          // Let's interpolate roughly: x goes 0 to 1. Center dip is at 0.5.
          // Let's position them absolute or relative with dynamic margins.
          // Using standard flex layout with staggered translation offsets makes it robust and fully responsive!
          const travelOffsets = [4, 15, 15, 4]; // dips in the center
          const yOffset = travelOffsets[idx];

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -40, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                y: yOffset, 
                scale: 1,
                rotate: [flag.rotation - 1.5, flag.rotation + 1.5, flag.rotation - 1.5]
              }}
              whileHover={{ 
                scale: 1.1, 
                rotate: flag.rotation * 1.5,
                y: yOffset - 5,
                transition: { duration: 0.2 } 
              }}
              transition={{
                rotate: {
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2.2 + idx * 0.3,
                  ease: "easeInOut",
                },
                default: {
                  duration: 0.8,
                  delay: idx * 0.15,
                  type: "spring",
                  stiffness: 100
                }
              }}
              className="relative w-[21%] aspect-[75/105] cursor-pointer drop-shadow-md"
            >
              {/* Flag Shape drawn via SVG */}
              <svg
                viewBox="0 0 100 135"
                className="w-full h-full filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]"
              >
                <defs>
                  {/* Grid pattern overlay */}
                  <pattern
                    id={`grid-${idx}`}
                    width="12"
                    height="12"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 12 0 L 0 0 0 12"
                      fill="none"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeOpacity="0.12"
                    />
                  </pattern>
                </defs>

                {/* Base Flag */}
                <path
                  d="M 5,0 L 95,0 L 95,115 L 50,95 L 5,115 Z"
                  fill={flag.color}
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />

                {/* Pattern Overlay */}
                <path
                  d="M 5,0 L 95,0 L 95,115 L 50,95 L 5,115 Z"
                  fill={`url(#grid-${idx})`}
                />

                {/* Little stitching dots at top border */}
                <line
                  x1="8"
                  y1="8"
                  x2="92"
                  y2="8"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  strokeOpacity="0.6"
                />

                {/* Hanging string loops at the corners */}
                <circle cx="15" cy="0" r="3" fill="#ffffff" />
                <circle cx="85" cy="0" r="3" fill="#ffffff" />
              </svg>

              {/* Bold Animated Letter inside the flag */}
              <div className="absolute inset-0 flex items-center justify-center pb-5 select-none pointer-events-none">
                <motion.span
                  animate={{ 
                    scale: [1, 1.05, 1],
                    y: [0, -2, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: idx * 0.2,
                    ease: "easeInOut"
                  }}
                  className="text-white font-extrabold text-2xl sm:text-3xl md:text-4xl font-fredoka tracking-tight text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                >
                  {flag.letter}
                </motion.span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Elegant Styled 'SHOWER' & 'THOMAS' Word Beneath the flags */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="text-center mt-3 relative z-10 w-full"
      >
        <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-[0.25em] text-sky-800 font-fredoka drop-shadow-[0_1.5px_1.5px_rgba(255,255,255,0.8)] select-none block">
          {String(extra?.txtBuntingShower || "SHOWER")}
        </span>
        <span 
          {...(getEditableProps ? getEditableProps("nombresPrincipales", "text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-[0.05em] text-sky-600 font-fredoka mt-1 select-none block drop-shadow-[0_1.5px_1.5px_rgba(255,255,255,0.8)]") : {})}
        >
          {babyName.toUpperCase()}
        </span>
      </motion.div>
    </div>
  );
};
