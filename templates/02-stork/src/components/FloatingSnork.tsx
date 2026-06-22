import React from 'react';
import { motion } from 'motion/react';

export const FloatingSnork: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      
      {/* Sequence 1: Majestic Snork drifting Left to Right across the entire viewport */}
      <motion.div
        className="absolute w-28 sm:w-36 h-auto"
        initial={{ x: "-150px", y: "25vh" }}
        animate={{
          x: ["-150px", "110vw"],
          y: ["25vh", "18vh", "38vh", "14vh", "30vh"],
          rotate: [0, 10, -8, 12, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "loop",
          delay: 6.5
        }}
      >
        <img
          src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1779997127/snok_hxvvcn.png"
          alt="Snork floating"
          className="w-full h-auto object-contain filter drop-shadow-[0_12px_24px_rgba(186,230,253,0.45)]"
          referrerPolicy="no-referrer"
        />
        
        {/* Magic tail star 1 */}
        <motion.span
          animate={{
            scale: [0.6, 1.2, 0.6],
            opacity: [0.2, 1, 0.2],
            x: [-12, -32, -12],
            y: [6, 18, 6],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-4 top-4 text-amber-300 font-bold text-xl drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]"
        >
          ✦
        </motion.span>
        
        {/* Magic tail star 2 */}
        <motion.span
          animate={{
            scale: [0.8, 1.4, 0.8],
            opacity: [0.3, 0.9, 0.3],
            x: [-24, -50, -24],
            y: [-8, -4, -8],
            rotate: [180, 360, 180]
          }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          className="absolute -left-8 top-12 text-sky-300 font-bold text-lg drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]"
        >
          ★
        </motion.span>
        
        {/* Magic tail star 3 */}
        <motion.span
          animate={{
            scale: [0.5, 1.1, 0.5],
            opacity: [0.1, 0.8, 0.1],
            x: [10, 22, 10],
            y: [28, 38, 28]
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute left-2 top-16 text-amber-200 font-bold text-sm drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]"
        >
          ✦
        </motion.span>
      </motion.div>

    </div>
  );
};
