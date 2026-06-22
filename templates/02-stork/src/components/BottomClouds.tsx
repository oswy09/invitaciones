import React from 'react';
import { motion } from 'motion/react';

interface CloudConfig {
  id: number;
  width: number;
  height: number;
  top: string; // vertical alignment in the bottom area
  opacity: number;
  blurClass: string;
  duration: number; // For parallax effect
  delay: number;
  colorFrom: string;
  colorTo: string;
}

export const BottomClouds: React.FC = () => {
  // Configured layers representing background depth:
  // Far back layer: slow, blurry, lower opacity
  // Mid layer: moderate speed, slight blur
  // Foreground layer: faster, crisp, fully visible
  const clouds: CloudConfig[] = [
    // --- Layer 1: Background (Far back & slow & blurry) ---
    {
      id: 1,
      width: 320,
      height: 160,
      top: 'top-[10px]',
      opacity: 0.35,
      blurClass: 'blur-md',
      duration: 52,
      delay: -10, // negative delays ensure they start pre-staggered across the screen on load
      colorFrom: 'from-sky-100/40',
      colorTo: 'to-white/20',
    },
    {
      id: 2,
      width: 280,
      height: 140,
      top: 'top-[30px]',
      opacity: 0.4,
      blurClass: 'blur-md',
      duration: 45,
      delay: -25,
      colorFrom: 'from-sky-50/50',
      colorTo: 'to-white/10',
    },

    // --- Layer 2: Midground (Soft, slightly defined) ---
    {
      id: 3,
      width: 340,
      height: 170,
      top: 'top-[50px]',
      opacity: 0.65,
      blurClass: 'blur-xs',
      duration: 34,
      delay: -8,
      colorFrom: 'from-white/80',
      colorTo: 'to-sky-100/50',
    },
    {
      id: 4,
      width: 250,
      height: 125,
      top: 'top-[75px]',
      opacity: 0.7,
      blurClass: 'blur-xs',
      duration: 38,
      delay: -20,
      colorFrom: 'from-pink-50/50',
      colorTo: 'to-sky-100/40',
    },

    // --- Layer 3: Foreground (Crisp, defined, faster) ---
    {
      id: 5,
      width: 360,
      height: 180,
      top: 'top-[90px]',
      opacity: 0.9,
      blurClass: 'blur-none',
      duration: 22,
      delay: -3,
      colorFrom: 'from-white/95',
      colorTo: 'to-sky-50/60',
    },
    {
      id: 6,
      width: 300,
      height: 150,
      top: 'top-[110px]',
      opacity: 0.85,
      blurClass: 'blur-none',
      duration: 26,
      delay: -15,
      colorFrom: 'from-white/90',
      colorTo: 'to-pink-50/30',
    },
  ];

  return (
    <div className="absolute inset-x-0 bottom-0 h-64 overflow-hidden pointer-events-none select-none z-10">
      {/* Absolute gradient blend base */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-sky-100/20 via-white/15 to-transparent backdrop-blur-[1px]" />

      {clouds.map((cloud) => {
        // Calculate dynamic dimensions & offsets so they seamlessly enter and leave screen
        const startX = -cloud.width - 100;

        return (
          <motion.div
            key={cloud.id}
            initial={{ x: startX }}
            animate={{ x: '100vw' }}
            transition={{
              duration: cloud.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: cloud.delay,
            }}
            style={{
              width: cloud.width,
              height: cloud.height,
              opacity: cloud.opacity,
            }}
            className={`absolute ${cloud.top} ${cloud.blurClass} pointer-events-none`}
          >
            {/* Fluffy SVG illustration with custom soft gradients */}
            <svg
              viewBox="0 0 100 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-[0_10px_25px_rgba(186,230,253,0.35)]"
            >
              <defs>
                <linearGradient id={`cloud-gradient-${cloud.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className={`text-sky-300 ${cloud.colorFrom}`} stopColor="currentColor" />
                  <stop offset="100%" className={`text-white ${cloud.colorTo}`} stopColor="currentColor" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              
              {/* Fluffy modern organic cloud shape */}
              <path
                d="M15 35
                   C 10 35,  5 30,  5 24
                   C  5 18, 11 14, 17 15
                   C 20  8, 30  5, 40  8
                   C 48  1, 62  1, 70  8
                   C 78  8, 85 14, 85 22
                   C 92 22, 95 27, 95 33
                   C 95 39, 90 44, 83 44
                   L 17 44
                   Z"
                fill={`url(#cloud-gradient-${cloud.id})`}
              />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
};
