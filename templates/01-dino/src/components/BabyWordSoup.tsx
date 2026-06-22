import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, UtensilsCrossed } from "lucide-react";

export default function BabyWordSoup() {
  // Target date: July 5, 2026 at 10:30
  const targetDate = new Date("2026-07-05T10:30:00");

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isStirring, setIsStirring] = useState(false);
  const [initialStir, setInitialStir] = useState(false);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const [stirCount, setStirCount] = useState(0);
  const [stirOffset, setStirOffset] = useState<number[]>([]);

  // Live countdown update
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Run intro animation only when the soup section first enters viewport.
  useEffect(() => {
    if (!hasEnteredViewport) return;

    setInitialStir(true);
    const timer = setTimeout(() => {
      setInitialStir(false);
    }, 3800);

    return () => clearTimeout(timer);
  }, [hasEnteredViewport]);

  // Compute the letters representing "FALTAN X DIAS" dynamically as 3 horizontal rows!
  const row1 = "FALTAN";
  const row2 = `${timeLeft.days}`;
  const row3 = "DIAS";

  const rows = [row1, row2, row3];
  const letters: {
    id: number;
    char: string;
    isSpace: boolean;
    defaultX: number;
    defaultY: number;
    defaultRotate: number;
    scale: number;
  }[] = [];

  let letterIndex = 0;
  rows.forEach((word, rowIndex) => {
    const chars = word.split("");
    const totalChars = chars.length;
    // vertical coordinate as percentage: e.g. 28%, 48%, 68%
    const y = 28 + rowIndex * 22;

    chars.forEach((char, charIdx) => {
      // spacing between letters
      const spacing = rowIndex === 1 ? 14 : 9.5; // wider spacing to ensure no overlapping
      const startX = 50 - ((totalChars - 1) * spacing) / 2;
      const x = startX + charIdx * spacing;

      // Rotate slightly so they look like floating noodles but remain extremely readable
      const defaultRotate = (charIdx % 2 === 0 ? 3 : -3) + (rowIndex % 2 === 0 ? 1 : -1);

      letters.push({
        id: letterIndex++,
        char,
        isSpace: false,
        defaultX: parseFloat(x.toFixed(1)),
        defaultY: parseFloat(y.toFixed(1)),
        defaultRotate,
        scale: rowIndex === 1 ? 1.5 : 1.15, // Make the days number nice and prominent!
      });
    });
  });

  // Keep random stir positions
  useEffect(() => {
    // Pre-initialize randomized offsets for each letter
    setStirOffset(Array.from({ length: 40 }).map(() => Math.random() * 20 - 10));
  }, []);

  // Stir the soup and mix positions!
  const stirSoup = () => {
    if (isStirring) return;
    setIsStirring(true);
    setStirCount(prev => prev + 1);

    // regenerate random offsets
    setStirOffset(Array.from({ length: 40 }).map(() => Math.random() * 30 - 15));

    setTimeout(() => {
      setIsStirring(false);
    }, 1200);
  };

  return (
    <motion.div
      className="w-full flex flex-col space-y-6"
      viewport={{ once: true, amount: 0.35 }}
      onViewportEnter={() => setHasEnteredViewport(true)}
    >
      <div className="flex flex-col items-center justify-center gap-8 w-full max-w-lg mx-auto">
        
        {/* Minimalist ribbon & badge layout matching the 2nd image */}
        <div id="retro-date-ribbon-container" className="w-full flex flex-col items-center justify-center py-4">
          
          <div className="relative w-full flex items-center justify-center py-6 select-none">
            
            {/* Horizontal Ribbon Band */}
            <div className="w-full bg-[#4A5D6B] text-white py-5 shadow-sm border-y-[3px] border-dashed border-[#C3A66A]/45 grid grid-cols-[1fr_auto_1fr] px-4 md:px-8 items-center relative gap-2">
              
              {/* Left text on ribbon */}
              <div className="font-sans text-lg md:text-xl font-extrabold tracking-[0.04em] text-[#F4F8FB] text-center pr-2 border-r border-white/10 flex items-center justify-center gap-2 min-w-0">
                <span>10:30 AM</span>
              </div>
              
              {/* Placeholder spacer for the large circle badge overlaying in the center */}
              <div className="w-28 md:w-32"></div>
              
              {/* Right text on ribbon */}
              <div className="font-sans text-lg md:text-xl font-extrabold tracking-[0.06em] text-[#F4F8FB] text-center pl-2 border-l border-white/10 min-w-0">
                2026
              </div>
            </div>
            
            {/* Huge Circular Badge overlaying on top of the ribbon */}
            <div className="absolute z-20 w-30 h-30 md:w-34 md:h-34 rounded-full bg-[#C3A66A] text-stone-900 border-2 border-white shadow-lg flex flex-col items-center justify-center text-center px-2 py-2.5">
              
              {/* Dashed outer circular trace inside circle */}
              <div className="absolute inset-1.5 border border-dashed border-white/60 rounded-full pointer-events-none"></div>
              
              {/* Circle contents */}
              <span className="font-sans text-[12px] md:text-[14px] font-extrabold tracking-[0.05em] text-white leading-none">
                Domingo
              </span>
              <span className="font-sans text-5xl md:text-6xl font-black py-0.5 leading-none tracking-tight text-white">
                05
              </span>
              <span className="font-sans text-[12px] md:text-[14px] font-extrabold tracking-[0.05em] text-stone-50 leading-none">
                Julio
              </span>
            </div>
            
          </div>

          {/* Elegant simple welcoming message underneath the ribbon */}
        </div>

        {/* Interactive Alphabet Soup Ceramic Plate / Bowl - placed underneath the ribbon */}
        <div id="soup-interactive-card" className="w-full flex flex-col items-center justify-center p-4 text-center">

          {/* Steaming Soap Container */}
          <div className="relative w-72 h-72 md:w-80 md:h-80 flex flex-col items-center justify-center select-none">
            
            {/* Ambient rising steam effects */}
            <div className="absolute top-2 left-0 right-0 h-10 flex justify-center space-x-6 pointer-events-none z-20">
              {hasEnteredViewport && [0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [-4, -30, -50],
                    x: [0, (i % 2 === 0 ? 8 : -8), 0],
                    opacity: [0, 0.45, 0],
                    scale: [0.75, 1.25, 0.8],
                  }}
                  transition={{
                    duration: 2.8 + i * 0.4,
                    repeat: Infinity,
                    delay: i * 0.7,
                    ease: "easeInOut",
                  }}
                  className="w-1 bg-[#C3A66A]/20 blur-[3px] rounded-full"
                  style={{ height: "18px" }}
                />
              ))}
            </div>

            {/* Ceramic Outer Plate Shadow / Ring shadow */}
            <div className="absolute inset-0 rounded-full bg-stone-900/[0.04] blur-md scale-102 -z-20"></div>

            {/* Outside Plate Ceramic Rim */}
            <div 
              onClick={stirSoup}
              className="absolute inset-2 rounded-full bg-gradient-to-br from-[#FFFDF9] via-[#F5EFE1] to-[#EAE2D2] border-4 border-[#C3A66A]/20 flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-101 active:scale-99 transition-all duration-300 z-10"
            >
              
              {/* Inner Bowl Concentric Gold Circle Ring */}
              <div className="absolute inset-8 rounded-full border border-dashed border-[#C3A66A]/30 flex items-center justify-center">
                
                {/* Real Soup Broth Content Inner circle */}
                <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-[#F1DCB0] via-[#FAD38E] to-[#FCDFA7] shadow-inner overflow-hidden flex items-center justify-center border-2 border-[#C3A66A]/15">
                  
                  {/* Subtle broth texture lines */}
                  <div className="absolute inset-0 bg-radial-gradient from-transparent via-stone-800/[0.01] to-stone-900/[0.04] pointer-events-none"></div>

                  <AnimatePresence>
                    {/* Floating Pasta Letter Shapes Spelling out FALTAN X DIAS */}
                     {letters.map((letter, idx) => {
                      const activeMoving = hasEnteredViewport && (isStirring || initialStir);
                      const shouldFloat = hasEnteredViewport;
                      const offsetValueX = activeMoving ? (stirOffset[idx % 30] || 0) : 0;
                      const offsetValueY = activeMoving ? (stirOffset[(idx + 5) % 30] || 0) : 0;
                      const rotValue = activeMoving ? (letter.defaultRotate + (stirOffset[idx % 30] || 0) * 8) : letter.defaultRotate;

                      return (
                        <div
                          key={letter.id}
                          style={{
                            position: "absolute",
                            left: activeMoving 
                              ? `${letter.defaultX + offsetValueX}%` 
                              : `${letter.defaultX}%`,
                            top: activeMoving 
                              ? `${letter.defaultY + offsetValueY}%` 
                              : `${letter.defaultY}%`,
                            transform: "translate(-50%, -50%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "36px",
                            height: "36px",
                            zIndex: 20
                          }}
                          className="transition-all duration-1000 ease-out"
                        >
                          <motion.span
                            animate={activeMoving ? {
                              rotate: [rotValue, rotValue + (idx % 2 === 0 ? 35 : -35), rotValue],
                              scale: [letter.scale * 0.95, letter.scale * 1.25, letter.scale],
                            } : shouldFloat ? {
                              rotate: [letter.defaultRotate - 2, letter.defaultRotate + 2, letter.defaultRotate - 2],
                              scale: letter.scale,
                              y: [-1.2, 1.2, -1.2],
                              x: [-0.6, 0.6, -0.6]
                            } : {
                              rotate: letter.defaultRotate,
                              scale: letter.scale,
                              y: 0,
                              x: 0
                            }}
                            transition={activeMoving ? {
                              duration: isStirring ? 0.9 : 1.3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            } : shouldFloat ? {
                              duration: 3.5 + (idx % 3) * 0.7,
                              repeat: Infinity,
                              ease: "easeInOut",
                            } : {
                              duration: 0.2,
                            }}
                            className={`font-serif-lux font-extrabold select-none drop-shadow-[0_2.5px_1px_rgba(230,165,65,0.45)] text-center tracking-none ${
                              letter.isSpace
                                ? "text-amber-600/30 text-xs"
                                : "text-[#4A5D6B] text-xl md:text-3xl font-extrabold"
                            }`}
                          >
                            {letter.char}
                          </motion.span>
                        </div>
                      );
                    })}
                  </AnimatePresence>

                  {/* Ocean Soup broth ripple ring animation when stirring */}
                  <AnimatePresence>
                    {isStirring && (
                      <motion.div
                        initial={{ scale: 0.1, opacity: 0.8 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.1, ease: "easeOut" }}
                        className="absolute inset-2 border-2 border-[#C3A66A]/30 rounded-full pointer-events-none"
                      />
                    )}
                  </AnimatePresence>
                  
                </div>
              </div>
            </div>

            {/* Spoon handle overlay offset exactly, themed as a baby spoon with pastel colors and star emblem */}
            <motion.div
              animate={isStirring ? {
                rotate: [20, -15, 45, 20],
                x: [0, 10, -15, 0],
                y: [0, -10, 8, 0],
              } : {
                rotate: 20,
              }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              onClick={stirSoup}
              className="absolute -right-8 top-1/4 w-32 h-64 pointer-events-auto cursor-pointer z-35 origin-center"
              style={{ transform: "rotate(20deg)" }}
            >
              {/* Cute pastel blue and white baby silicone star spoon vector */}
              <div className="w-full h-full relative">
                <svg viewBox="0 0 100 240" className="w-full h-full drop-shadow-md">
                  <defs>
                    <linearGradient id="bowlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFDF9" />
                      <stop offset="30%" stopColor="#EADCC2" />
                      <stop offset="100%" stopColor="#D5C5A3" />
                    </linearGradient>
                    <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#A4C4DC" />
                      <stop offset="50%" stopColor="#CBE0EE" />
                      <stop offset="100%" stopColor="#415563" />
                    </linearGradient>
                  </defs>

                  {/* Friendly safe baby spoon bowl */}
                  <rect x="33" y="10" width="34" height="46" rx="17" fill="url(#bowlGrad)" filter="drop-shadow(0px 2.5px 2px rgba(0,0,0,0.12))" stroke="#C3A66A" strokeWidth="1.5" />
                  
                  {/* Outer soft glow/translucent child-safe baby spoon rim */}
                  <rect x="31" y="8" width="38" height="50" rx="19" fill="none" stroke="#FFF" strokeWidth="2.5" opacity="0.6"/>

                  {/* Handle neck connection */}
                  <path d="M46,55 C46,70 47,85 47,95 L53,95 C53,85 54,70 54,55 Z" fill="#D5C5A3" />
                  
                  {/* Thick Chubby, Ergonomic baby spoon handle (Soft pastel blue silicone handle) */}
                  <path d="M47,90 C41,105 34,135 34,175 C34,215 41,230 50,230 C59,230 66,215 66,175 C66,135 59,105 53,90 Z" fill="url(#handleGrad)" stroke="#EAF1F5" strokeWidth="1.5"/>

                  {/* Inner friendly baby emblem star in the center of the grip */}
                  <circle cx="50" cy="180" r="13" fill="#FFF" opacity="0.3" />
                  <path d="M50,173 L52,177.5 L57,178.5 L53.5,182 L54.5,187 L50,184.5 L45.5,187 L46.5,182 L43,178.5 L48,177.5 Z" fill="#FFF" opacity="0.95" />

                  {/* Ridges for non-slip baby grip */}
                  <rect x="44" y="118" width="12" height="3" rx="1.5" fill="#FFF" opacity="0.4" />
                  <rect x="43" y="128" width="14" height="3" rx="1.5" fill="#FFF" opacity="0.4" />
                  <rect x="44" y="138" width="12" height="3" rx="1.5" fill="#FFF" opacity="0.4" />
                </svg>
              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </motion.div>
  );
}
