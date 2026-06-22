import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface StorkAnimationProps {
  onComplete?: () => void;
  text?: string;
  durationSeconds?: number;
}

export const StorkAnimation: React.FC<StorkAnimationProps> = ({
  onComplete,
  text = "¡Hola! Tenemos una hermosa invitación para ti...",
  durationSeconds = 5,
}) => {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = React.useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const startTime = Date.now();
    const intervalTime = 50; // ms
    const totalDuration = durationSeconds * 1000;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(timer);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [durationSeconds]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-300 via-sky-100 to-sky-50 flex flex-col items-center justify-between p-6 overflow-hidden z-50">
      
      {/* Decorative floating cartoon clouds in the sky styling */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute text-sky-200/40 opacity-70"
          initial={{ x: -200, y: '10%' }}
          animate={{ x: '110vw' }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        >
          <svg width="180" height="100" viewBox="0 0 180 100" fill="currentColor">
            <path d="M50 80c-15 0-25-10-25-25s10-25 25-25c5 0 9 1 13 3 5-15 20-25 37-25s32 10 37 25c4-2 8-3 13-3 15 0 25 10 25 25s-10 25-25 25H50z" />
          </svg>
        </motion.div>
        
        <motion.div
          className="absolute text-sky-200/50 opacity-60"
          initial={{ x: '105vw', y: '25%' }}
          animate={{ x: -250 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        >
          <svg width="240" height="120" viewBox="0 0 180 100" fill="currentColor">
            <path d="M50 80c-15 0-25-10-25-25s10-25 25-25c5 0 9 1 13 3 5-15 20-25 37-25s32 10 37 25c4-2 8-3 13-3 15 0 25 10 25 25s-10 25-25 25H50z" />
          </svg>
        </motion.div>
        
        <motion.div
          className="absolute text-sky-200/30 opacity-80"
          initial={{ x: -150, y: '50%' }}
          animate={{ x: '110vw' }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        >
          <svg width="120" height="70" viewBox="0 0 180 100" fill="currentColor">
            <path d="M50 80c-15 0-25-10-25-25s10-25 25-25c5 0 9 1 13 3 5-15 20-25 37-25s32 10 37 25c4-2 8-3 13-3 15 0 25 10 25 25s-10 25-25 25H50z" />
          </svg>
        </motion.div>
      </div>

      <div className="h-6 w-full" /> {/* Spacer replacement for the removed skip button */}

      {/* Main Stork Area */}
      <div className="my-auto flex flex-col items-center justify-center w-full max-w-xl relative z-10">
        
        {/* Animated bird container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="w-full max-w-[420px] mx-auto"
        >
          <div className="relative w-full aspect-[563.82/500] max-w-[563.82px] mx-auto select-none overflow-visible">
            
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 563.82 500"
              className="w-full h-full relative z-10 select-none touch-none bg-transparent"
              style={{ transform: 'scaleX(-1)' }}
            >
              <defs>
                <style dangerouslySetInnerHTML={{ __html: `
                  .cls-stork-sky {
                    fill: #bae6fd; /* Sky blue light replace */
                  }

                  .cls-stork-blue-hills {
                    fill: #38bdf8;
                    opacity: 0.15;
                    mix-blend-mode: multiply;
                  }

                  .cls-stork-dark-accent {
                    fill: #1d4ed8; /* Darker blue replace for #b93e62 bundle outlines */
                  }

                  .cls-stork-shadow-mult {
                    opacity: .25;
                    mix-blend-mode: multiply;
                    fill: #cbd5e1;
                  }

                  .cls-stork-eye {
                    fill: #1e3a8a;
                  }

                  .cls-stork-light {
                    fill: #f0f9ff;
                  }

                  .cls-stork-blue-bundle {
                    fill: #60a5fa; /* Blue baby wrap replace for pink */
                  }

                  .cls-stork-white {
                    fill: #ffffff;
                  }

                  .cls-stork-bundle-stripes {
                    fill: #93c5fd;
                  }

                  .cls-stork-beak {
                    fill: #f97316; /* Sweet orange beak and feet */
                  }

                  .cls-stork-accent-light-blue {
                    fill: #38bdf8;
                    opacity: .4;
                  }

                  .cls-stork-gray-body {
                    fill: #f8fafc;
                  }

                  .cls-stork-cream-details {
                    fill: #f1f5f9;
                    opacity: .7;
                  }

                  .cls-stork-transp-shadow {
                    opacity: 0.12;
                    mix-blend-mode: multiply;
                    fill: #1e293b;
                  }

                  .cls-stork-soft-pink-cheeks {
                    fill: #fca5a5;
                    opacity: .6;
                  }
                ` }} />
                
                <pattern id="stork_pattern_bg" x="0" y="0" width="180" height="101.98" patternTransform="translate(-3501.26 -3567.33) scale(.56)" patternUnits="userSpaceOnUse" viewBox="0 0 180 101.98">
                  <g>
                    <rect fill="none" x="0" y="0" width="180" height="101.98"/>
                    <path className="cls-stork-white" opacity="0.18" d="M180.01,109.01c2.68-.44,11.26-10.49,7.17-13.5-3.56-2.63-7.21,5.26-7.21,5.26,0,0-3.23-7.06-7.23-4.34-4.07,2.76,5.44,12.88,7.27,12.58Z"/>
                    <path className="cls-stork-white" opacity="0.18" d="M0,109.01c2.68-.44,11.26-10.49,7.17-13.5C3.62,92.87-.03,100.76-.03,100.76c0,0-3.23-7.06-7.23-4.34-4.07,2.76,5.44,12.88,7.27,12.58Z"/>
                    <path className="cls-stork-white" opacity="0.18" d="M180.01,7.02c2.68-.44,11.26-10.49,7.17-13.5-3.56-2.63-7.21,5.26-7.21,5.26,0,0-3.23-7.06-7.23-4.34-4.07,2.76,5.44,12.88,7.27,12.58Z"/>
                    <path className="cls-stork-white" opacity="0.18" d="M90.01,58.01c2.68-.44,11.26-10.49,7.17-13.5-3.56-2.63-7.21,5.26-7.21,5.26,0,0-3.23-7.06-7.23-4.34-4.07,2.76,5.44,12.88,7.27,12.58Z"/>
                    <path className="cls-stork-white" opacity="0.18" d="M0,7.02c2.68-.44,11.26-10.49,7.17-13.5C3.62-9.11-.03-1.22-.03-1.22-.03-1.22-3.26-8.27-7.26-5.56-11.33-2.8-1.82,7.32,0,7.02Z"/>
                  </g>
                </pattern>
                
                <clipPath id="stork_clippath">
                  <rect fill="none" x="41.61" width="500" height="500"/>
                </clipPath>
              </defs>
              
              <g clipPath="url(#stork_clippath)">
                
                {/* STORK SYSTEM COMPONENTS */}
                <g id="OBJECTS">
                  
                  <motion.g
                    style={{ originX: '280px', originY: '280px' }}
                    animate={{
                      y: [0, -12, 0],
                      x: [0, 3, -3, 0],
                      rotate: [0, -0.8, 0.8, 0]
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {/* Big soft glow spotlight back of stork */}
                    <circle fill="#bae6fd" opacity="0.3" cx="324.08" cy="305.67" r="105.46" />

                    {/* BABY SACK / WRAPPED BUNDLE GROUP: sways beneath the beak in blue theme */}
                    <motion.g
                      id="BABY_BUNDLE"
                      style={{ originX: '155px', originY: '225px' }}
                      animate={{
                        rotate: [-5, 5, -5]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {/* Wrap elements recolored in blue/gold */}
                      <path className="cls-stork-dark-accent" d="M141.28,240.49l-8.04-1.83s-18.89,37.9-25.47,66.05c-6.58,28.15,7.94,50.11,26.6,49.03,18.67-1.08,27.56-14.42,28.24-33.56.67-19.14-20.53-66.21-21.33-79.69ZM141.98,285.5c-1.75,9.42-12.01,7.54-13.73-.22-1.72-7.76,7.59-44.88,7.59-44.88l1.14-.05s6.76,35.74,5.01,45.16Z"/>
                      <path className="cls-stork-blue-bundle" d="M141.28,240.49l-8.04-1.83s-18.89,37.9-25.47,66.05c-6.58,28.15,7.94,50.11,26.6,49.03,18.67-1.08,27.56-14.42,28.24-33.56.67-19.14-20.53-66.21-21.33-79.69ZM141.98,285.5c-1.75,9.42-12.01,7.54-13.73-.22-1.72-7.76,7.59-44.88,7.59-44.88l1.14-.05s6.76,35.74,5.01,45.16Z"/>
                      <path className="cls-stork-shadow-mult" d="M141.28,240.49l-8.04-1.83s-3.12,6.25-7.26,15.56c1.95,1.56,3.8,3.28,5.54,5.1,2.08-10.01,4.31-18.93,4.31-18.93l1.14-.05s3.54,18.71,4.83,32.62c12.23,20.36,14.73,44.8,5.53,67.5-1.72,4.26-3.8,8.35-6.19,12.25,14.06-3.62,20.88-15.87,21.47-32.53.68-19.14-20.53-66.21-21.33-79.69Z"/>
                      <path fill="#fef08a" d="M133.93,328.59c3.39-.66,13.88-13.71,8.58-17.38-4.61-3.2-8.94,6.94-8.94,6.94,0,0-4.36-8.82-9.32-5.23-5.06,3.65,7.37,16.12,9.68,15.68Z"/>
                      <path className="cls-stork-dark-accent" d="M135.46,232s-11.61-3.27-10.27-15.47c0,0,11.93.66,10.27,15.47Z"/>
                      <path className="cls-stork-dark-accent" d="M154.47,216.31s-12.03.04-12.23,13.85c0,0,9.64,1.08,12.23-13.85Z"/>
                      <path fill="#60a5fa" d="M135.46,232s-11.61-3.27-10.27-15.47c0,0,11.93.66,10.27,15.47Z"/>
                      <path className="cls-stork-transp-shadow" opacity="0.4" d="M135.46,232s-11.61-3.27-10.27-15.47c0,0,6.62,8.67,10.27,15.47Z"/>
                      <path fill="#60a5fa" d="M154.47,216.31s-12.03.04-12.23,13.85c0,0,9.64,1.08,12.23-13.85Z"/>
                      <path className="cls-stork-transp-shadow" opacity="0.4" d="M154.47,216.31s-7.9,8.24-12.23,13.85c0,0,9.64,1.08,12.23-13.85Z"/>
                    </motion.g>

                    {/* STORK BODY */}
                    <g id="STORK_BODY">
                      <path className="cls-stork-beak" d="M165.29,224.99s-60.85,8.85-62.8,10.6c-1.95,1.75,66.72,10.36,67.48,9.57.76-.79-4.68-20.17-4.68-20.17Z"/>
                      <path className="cls-stork-transp-shadow" opacity="0.2" d="M167.99,235.08s-63.55-1.24-65.5.51c-1.95,1.75,66.72,10.36,67.48,9.57.76-.79-1.98-10.08-1.98-10.08Z"/>
                      
                      {/* Dangling orange legs */}
                      <motion.g
                        id="STORK_LEGS"
                        style={{ originX: '390px', originY: '310px' }}
                        animate={{
                          rotate: [-2, 3, -2]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <path className="cls-stork-beak" d="M386.33,316.76c.7,2.36,27.47,34.55,27.61,35.48.14.93-1.26,5.29,1.31,6.73,2.57,1.44,4.95-1.05,4.95-1.05,0,0,38.47,17.04,40.98,18.23,2.5,1.19,3.68,11.04,5.43,11.53,1.76.49-2.35-8.06-1.96-8.97.39-.92,6.84,4.95,7.72,4.69s-5.88-5.48-6.33-5.81c-.44-.32,8.09-2.35,8.3-2.9.21-.55-8.65.84-9.76.73s-42.28-19.82-42.67-20c-.39-.18.26-2.65-1.71-3.69-1.3-.69-4.16-1.43-4.16-1.43,0,0-27.26-35.31-27.36-35.31s-2.36,1.79-2.36,1.79Z"/>
                        <circle fill="#f97316" cx="396" cy="336" r="3" opacity="0.3" />
                        <path className="cls-stork-beak" d="M398.66,307.16c.8,2.15,27.7,30.32,27.89,31.18.19.86-.83,4.99,1.64,6.16,2.47,1.17,4.53-1.29,4.53-1.29,0,0,36.8,13.37,39.2,14.31s4.11,10.01,5.77,10.36c1.66.35-2.7-7.33-2.39-8.21.3-.88,6.66,4.16,7.46,3.86.8-.3-5.81-4.72-6.24-4.99-.43-.27,7.36-2.7,7.52-3.22.16-.52-7.98,1.33-9.01,1.3-1.03-.03-40.51-15.7-40.88-15.85-.37-.15.07-2.47-1.82-3.32-1.25-.56-3.95-1.07-3.95-1.07,0,0-27.56-31.04-27.65-31.03-.09,0-2.07,1.81-2.07,1.81Z"/>
                      </motion.g>

                      {/* Stork main white body */}
                      <path className="cls-stork-gray-body" d="M281.42,289.13c-2.17,4.4-7.31,8.12-23.81,7.37s-34.88-23.3-36.19-46.15c-1.31-22.85-.31-35.51-19.56-37.93s-38.19,3.58-38.85,22.33c-.65,18.75,19.42,22.25,36.94,10.91,0,0,6.89,31.75,22.02,50.92,15.13,19.17,43.97,23.37,59.93,8.77,0,0,13.64,22.9,54.3,22.9,40.66,0,79.79-14.13,87.85-57.19,0,0,20.62,16.11,25.97,15.03,5.34-1.09-9.92-13.74-9.92-13.74,0,0,11.99,6.84,14.25,6.12,2.26-.72-9.83-9.59-9.83-9.59,0,0,13.37,6.38,16.73,2.88,3.36-3.5-14.99-17.8-29.56-21.4-14.58-3.6-124.21-14.09-150.27,38.78Z"/>
                      
                      {/* Highlights & details */}
                      <path className="cls-stork-cream-details" d="M431.69,250.35c-1.32-.33-3.44-.71-6.2-1.1-14.21,19.75-35.03,34.44-57.13,44.15-26.04,11.44-54.87,17.23-83.33,15.91,5.99,6.55,21.27,18.94,51.18,18.94,40.66,0,79.79-14.13,87.85-57.19,0,0,20.62,16.11,25.97,15.03,5.34-1.09-9.92-13.74-9.92-13.74,0,0,11.99,6.84,14.25,6.12,2.26-.72-9.83-9.59-9.83-9.59,0,0,13.37,6.38,16.73,2.88,3.36-3.5-14.99-17.8-29.56-21.4Z"/>
                      <path fill="#f1f5f9" d="M309.78,291.34c-1.99,6.33,52.14,13.36,65.48,17.15,13.35,3.79,20.6,1.64,22.1-3.44,1.41-4.78-9.88-9.52-9.88-9.52,0,0,6.96-3.56,11.19-8.78,6.69-8.25-13.45-12.07-13.95-11.89,0,0,15.74-1.14,14.9-8.19-.94-7.89-19.25-6.14-19.25-6.14,0,0,32-17.67,27.25-25.58-4.75-7.92-87.41,23.19-97.83,56.39Z"/>
                      <circle className="cls-stork-soft-pink-cheeks" cx="196" cy="235" r="9" />

                      {/* Winking eye */}
                      <motion.path 
                        className="cls-stork-eye" 
                        d="M194.93,228.63c-.55,0-1-.45-1-1,0-2.37-1.93-4.3-4.3-4.3s-4.3,1.93-4.3,4.3c0,.55-.45,1-1,1s-1-.45-1-1c0-3.48,2.83-6.3,6.3-6.3s6.3,2.83,6.3,6.3c0,.55-.45,1-1,1Z"
                        animate={{
                          scaleY: [1, 1, 0.2, 1, 1],
                        }}
                        style={{ transformOrigin: '189.63px 227.63px' }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          repeatDelay: 2
                        }}
                      />
                    </g>

                    {/* STORK WING: animated flapping */}
                    <motion.g
                      id="STORK_WING"
                      style={{ originX: '334px', originY: '226px' }}
                      animate={{
                        rotate: [-20, 22, -20],
                        scaleY: [1, 0.75, 1],
                      }}
                      transition={{
                        duration: 0.65,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <path fill="#f8fafc" stroke="#bae6fd" strokeWidth="2" d="M332.94,226c-6.83.21-25.33,26.62-21.33,45.06,0,0,18.75-.53,34.75-9.17,16-8.64,26.5-22.89,22.25-27.64s-15.14,2-15.14,2c0,0,5.89-10.65,1.14-12.82s-15.87,13.85-15.87,13.85c0,0,2.28-11.53-5.8-11.28Z" />
                      <path className="cls-stork-shadow-mult" d="M353.47,236.25s.02-.04.06-.11c-12.94,7.6-26.79,13.89-41.02,19.34-1.44,5.33-1.95,10.73-.9,15.59,0,0,18.75-.53,34.75-9.17,16-8.64,26.5-22.89,22.25-27.64s-15.14,2-15.14,2Z" />
                    </motion.g>

                  </motion.g>
                  
                </g>
                
              </g>
            </svg>
          </div>
        </motion.div>

        {/* Text underneath */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-sky-700 font-medium text-lg text-center mt-8 tracking-wide font-fredoka px-4"
        >
          {text}
        </motion.p>
        
        {/* Playful subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.65 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-sky-600 text-sm mt-1 text-center font-quicksand"
        >
          Preparando los detalles mágicos...
        </motion.p>

        {/* Loading related indicator */}
        <div className="w-full max-w-xs mt-6 flex flex-col items-center">
          
          {/* Baby pacifier/bottle indicator filling up */}
          <div className="relative w-full h-3 bg-sky-200/50 rounded-full overflow-hidden shadow-inner border border-sky-200/40">
            <motion.div
              style={{ width: `${progress}%` }}
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full"
            />
          </div>
          
          <div className="flex justify-between w-full mt-2 text-[10px] text-sky-500 font-semibold font-quicksand px-1">
            <span>VOLANDO</span>
            <span className="flex items-center gap-0.5">
              <span>🍼</span>
              <span>{Math.round(progress)}%</span>
            </span>
            <span>LLEGADA</span>
          </div>
        </div>

      </div>

      {/* Footer footer */}
      <div className="text-center pb-2 text-sky-400 text-xs font-quicksand pointer-events-none select-none relative z-10">
        © {new Date().getFullYear()} • Baby Shower virtual
      </div>
    </div>
  );
};
