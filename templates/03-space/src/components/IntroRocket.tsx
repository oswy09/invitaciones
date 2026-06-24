import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Info, Navigation, ArrowRight } from 'lucide-react';
import { LullabySynth } from '../utils/audioSynth';

interface IntroRocketProps {
  onIntroComplete: (audioSynthInstance: LullabySynth | null) => void;
  babyName?: string;
  extra?: Record<string, any>;
}

export default function IntroRocket({ onIntroComplete, babyName = "Martín", extra }: IntroRocketProps) {
  const mainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const starCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rocketRef = useRef<HTMLDivElement | null>(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [isAutomated, setIsAutomated] = useState(false);
  const [touchHint, setTouchHint] = useState(() => extra?.txtIntroHint || '¡Preparando despegue automático de amor... 🚀!');
  const [distanceToTarget, setDistanceToTarget] = useState(1); // 1 = start, 0 = end
  const [countdownText, setCountdownText] = useState('3');
  const [isCounting, setIsCounting] = useState(true);
  const [hasLanded, setHasLanded] = useState(false);

  const onComplete = () => {
    onIntroComplete(null);
  };

  // Particle colors (childhood sweet pastel shades)
  const colors = [
    "#A2D2FF", // Soft pastel boy blue
    "#BDE0FE", // Pastel baby sky
    "#FFC6FF", // Tender lilac pink
    "#FFF5C3", // Starry warm cream
    "#CAFFBF", // Cozy pastel mint green
    "#FFADAD"  // Delicate blushing peach
  ];
  const gravity = 0.04;
  const particlesDensity = 12;

  // Autopilot position refs
  const cursorPosRef = useRef({ x: 0, y: 0 });
  const movingRef = useRef(false);

  const onCompleteRef = useRef(onIntroComplete);
  onCompleteRef.current = onIntroComplete;

  const isAutomatedRef = useRef(isAutomated);
  isAutomatedRef.current = isAutomated;

  useEffect(() => {
    if (extra?.txtIntroHint) {
      setTouchHint(extra.txtIntroHint);
    }
  }, [extra]);

  useEffect(() => {
    const mainCanvas = mainCanvasRef.current;
    const starCanvas = starCanvasRef.current;
    if (!mainCanvas || !starCanvas) return;

    const ctx = mainCanvas.getContext('2d');
    const ctx2 = starCanvas.getContext('2d');
    if (!ctx || !ctx2) return;

    let width = (mainCanvas.width = window.innerWidth);
    let height = (mainCanvas.height = window.innerHeight);
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;

    // Initially position the rocket at the top right (Moon)
    const initialX = width - 175;
    const initialY = 175;
    cursorPosRef.current = { x: initialX, y: initialY };

    let showers: any[] = [];
    let stars: any[] = [];
    let animationFrameId: number;

    const random = (min: number, max?: number) => {
      if (max === undefined) {
        max = min;
        min = 0;
      }
      return Math.random() * (max - min) + min;
    };

    // Particle representation (Tumbling high-fidelity baby shower confetti!)
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      width: number;
      height: number;
      color: string;
      life: number;
      maxLife: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      shape: 'rect' | 'circle' | 'triangle' | 'star';
      wobble: number;
      wobbleSpeed: number;

      constructor(x: number, y: number, vx: number, vy: number, size: number, color: string, life: number) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.width = size * random(1.6, 2.8);
        this.height = size * random(0.8, 1.4);
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.opacity = 1;
        this.rotation = random(0, Math.PI * 2);
        this.rotationSpeed = random(-0.2, 0.2);
        
        const shapes: ('rect' | 'circle' | 'triangle' | 'star')[] = ['rect', 'circle', 'triangle', 'star'];
        this.shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        this.wobble = random(0, Math.PI * 2);
        this.wobbleSpeed = random(0.1, 0.25);
      }

      update() {
        this.life -= 0.12;
        this.opacity = Math.max(0, this.life / this.maxLife);
        
        this.vy += gravity * 0.4; // delicate floating drift
        
        // Wobble physics
        this.wobble += this.wobbleSpeed;
        this.x += this.vx + Math.sin(this.wobble) * 0.5;
        this.y += this.vy;
        
        this.rotation += this.rotationSpeed;
        this.draw();
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Emulate 3D tumbling flipping over the X axis
        const scaleX = Math.cos(this.wobble);
        ctx.scale(scaleX, 1);
        
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.fillStyle = this.color;

        ctx.beginPath();
        if (this.shape === 'rect') {
          ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        } else if (this.shape === 'circle') {
          ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (this.shape === 'triangle') {
          ctx.moveTo(0, -this.height / 2);
          ctx.lineTo(this.width / 2, this.height / 2);
          ctx.lineTo(-this.width / 2, this.height / 2);
          ctx.closePath();
          ctx.fill();
        } else if (this.shape === 'star') {
          const spikes = 5;
          const outerRadius = this.width / 2;
          const innerRadius = this.width / 4;
          let rot = Math.PI / 2 * 3;
          let px = 0;
          let py = 0;
          const step = Math.PI / spikes;

          ctx.moveTo(0, -outerRadius);
          for (let i = 0; i < spikes; i++) {
            px = Math.cos(rot) * outerRadius;
            py = Math.sin(rot) * outerRadius;
            ctx.lineTo(px, py);
            rot += step;

            px = Math.cos(rot) * innerRadius;
            py = Math.sin(rot) * innerRadius;
            ctx.lineTo(px, py);
            rot += step;
          }
          ctx.lineTo(0, -outerRadius);
          ctx.closePath();
          ctx.fill();
        }
        
        ctx.restore();
      }

      remove() {
        return this.life <= 0;
      }
    }

    class Shower {
      particles: Particle[] = [];

      constructor(x: number, y: number, pushX: number, pushY: number) {
        // Only spawn if rocket is moving or automated
        if (movingRef.current || isAutomatedRef.current) {
          for (let i = 1; i <= particlesDensity; i++) {
            // Propulsion speed back away from the rocket tail
            const pushSpeed = random(2.5, 6.5);
            // Perpendicular spray pattern to create a gorgeous widening exhaust plume
            const perpX = -pushY;
            const perpY = pushX;
            const spray = random(-2.0, 2.0);

            const vx = pushX * pushSpeed + perpX * spray;
            const vy = pushY * pushSpeed + perpY * spray;

            const size = random(3.5, 6.8);
            const life = random(6, 12);
            const color = colors[Math.floor(Math.random() * colors.length)];
            const p = new Particle(x, y, vx, vy, size, color, life);
            this.particles.push(p);
          }
        }
      }

      explode() {
        for (let i = 0; i < this.particles.length; i++) {
          this.particles[i].update();
          if (this.particles[i].remove()) {
            this.particles.splice(i, 1);
            i--;
          }
        }
      }
    }

    class Star {
      x: number;
      y: number;
      size: number;
      opacity: number;
      addOpacity: number;

      constructor(x: number, y: number, size: number, opacity: number) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.opacity = opacity;
        this.addOpacity = random(0.002, 0.006);
      }

      update() {
        if (this.opacity < 0.1) {
          this.addOpacity = -this.addOpacity;
        }
        if (this.opacity > 0.8) {
          this.addOpacity = -this.addOpacity;
        }
        this.opacity -= this.addOpacity;
        this.draw();
      }

      draw() {
        if (!ctx2) return;
        ctx2.beginPath();
        ctx2.globalAlpha = this.opacity;
        ctx2.fillStyle = "#ffffff";
        ctx2.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx2.fill();
        ctx2.closePath();
      }
    }

    const createStars = () => {
      stars = [];
      const density = Math.min(120, Math.floor((width * height) / 11000));
      for (let i = 1; i <= density; i++) {
        const x = random(0, width);
        const y = random(0, height);
        const size = random(0.4, 1.6);
        const opacity = random(0.1, 0.8);
        const s = new Star(x, y, size, opacity);
        stars.push(s);
      }
    };

    createStars();

    let lastAnimX = width - 175;
    let lastAnimY = 175;

    // Constant loop
    const animate = () => {
      if (!ctx || !ctx2) return;

      ctx.clearRect(0, 0, width, height);

      const cx = cursorPosRef.current.x;
      const cy = cursorPosRef.current.y;

      let dx = cx - lastAnimX;
      let dy = cy - lastAnimY;
      let dist = Math.hypot(dx, dy);

      // Fallback angle when rocket is still loading/countdown
      if (dist < 0.1) {
        // Oriented from top-right to bottom-center (roughly -0.7x, 0.7y direction)
        dx = -0.7;
        dy = 0.7;
        dist = 1;
      }

      // Normalize movement direction vector
      const ndx = dx / dist;
      const ndy = dy / dist;

      // Rocket size is about 60px, so let's set the tail emitter offset exactly at the back of the rocket
      const tailX = cx - ndx * 24;
      const tailY = cy - ndy * 24;

      // Create confetti spray backwards (-ndx, -ndy)
      const n = new Shower(tailX, tailY, -ndx, -ndy);
      showers.push(n);

      for (let i = 0; i < showers.length; i++) {
        showers[i].explode();
        if (showers[i].particles.length === 0) {
          showers.splice(i, 1);
          i--;
        }
      }

      ctx2.clearRect(0, 0, width, height);
      for (let i = 0; i < stars.length; i++) {
        stars[i].update();
      }

      // Constellation track guide line
      ctx2.beginPath();
      ctx2.globalAlpha = 0.22;
      ctx2.strokeStyle = "#8dbcc4";
      ctx2.lineWidth = 1.5;
      ctx2.setLineDash([4, 6]);
      ctx2.moveTo(width - 175, 175);
      ctx2.quadraticCurveTo(width * 0.35, height * 0.25, width / 2, height - 150);
      ctx2.stroke();
      ctx2.closePath();
      ctx2.setLineDash([]);

      lastAnimX = cx;
      lastAnimY = cy;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    let lastX = width - 175;
    let lastY = 175;
    let angle = 135; // oriented towards bottom-center (Earth)

    const updateRocketRotation = (x: number, y: number) => {
      const cursorEl = document.getElementById("cursor");
      const tooltipEl = document.getElementById("cursor-tooltip");
      if (!cursorEl) return;

      const dx = x - lastX;
      const dy = y - lastY;

      if (Math.abs(dx) > 0.4 || Math.abs(dy) > 0.4) {
        angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      }

      // We translate the absolute position minus 30px so that the rocket rotates center-mass!
      const rotateStr = movingRef.current || isAutomatedRef.current ? `rotate(${angle}deg)` : '';
      cursorEl.style.transform = `translate3d(${x - 30}px, ${y - 30}px, 0px) ${rotateStr}`;

      if (tooltipEl) {
        // Keeps the tooltip centered below the rocket (width 240px -> offset by -120px, y-offset +45px)
        tooltipEl.style.transform = `translate3d(${x - 120}px, ${y + 45}px, 0px)`;
      }

      lastX = x;
      lastY = y;
    };

    const updateInterval = setInterval(() => {
      updateRocketRotation(cursorPosRef.current.x, cursorPosRef.current.y);

      // Distance calculation (Moon at top right to Earth at bottom center)
      const startX = width - 175;
      const startY = 175;
      const endX = width / 2;
      const endY = height - 150;

      const totalDist = Math.hypot(endX - startX, endY - startY);
      const currentDist = Math.hypot(endX - cursorPosRef.current.x, endY - cursorPosRef.current.y);
      const progress = Math.max(0, Math.min(1, currentDist / totalDist));
      setDistanceToTarget(progress);

      if (currentDist < 45) {
        clearInterval(updateInterval);
        setHasLanded(true);
        setDistanceToTarget(0);
        setTimeout(() => {
          onCompleteRef.current(null);
        }, 4500);
      }
    }, 16);

    const handleResize = () => {
      width = mainCanvas.width = window.innerWidth;
      height = mainCanvas.height = window.innerHeight;
      starCanvas.width = window.innerWidth;
      starCanvas.height = window.innerHeight;
      createStars();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(updateInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Automated flying path (Luna -> Tierra)
  const handleLaunchAutopilot = () => {
    setIsAutomated(true);
    setHasStarted(true);
    movingRef.current = true;

    // Remove cursor shadow style instantly on takeoff
    const rocketDiv = document.querySelector(".rocket");
    if (rocketDiv) {
      rocketDiv.classList.remove("shadow");
    }

    const startX = window.innerWidth - 175;
    const startY = 175;
    const endX = window.innerWidth / 2;
    const endY = window.innerHeight - 150;

    const duration = 9500; // Majestically slow, 9.5 seconds of super elegant and smooth flight trajectory
    const startTime = performance.now();

    const animateLaunch = (time: number) => {
      const elapsed = time - startTime;
      const t = Math.min(elapsed / duration, 1);

      // Beautiful custom bezier ease
      const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      // Curve pulls slightly towards the left/middle for organic planetary entry arc down
      const controlX = window.innerWidth * 0.35;
      const controlY = window.innerHeight * 0.25;

      const x = (1 - easeT) * (1 - easeT) * startX + 2 * (1 - easeT) * easeT * controlX + easeT * easeT * endX;
      const y = (1 - easeT) * (1 - easeT) * startY + 2 * (1 - easeT) * easeT * controlY + easeT * easeT * endY;

      cursorPosRef.current = { x, y };

      if (t < 1) {
        requestAnimationFrame(animateLaunch);
      } else {
        setIsAutomated(false);
      }
    };

    requestAnimationFrame(animateLaunch);
  };

  // Launch countdown instantly or with 1.2s buffer
  useEffect(() => {
    let countdown = 3;
    setCountdownText("3");
    setIsCounting(true);

    const interval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        setCountdownText(countdown.toString());
        setTouchHint(`🎈 Despegará solo en ${countdown} segundos...`);
      } else {
        setCountdownText("✨");
        setIsCounting(false);
        setTouchHint(`✨ ¡Despegue exitoso! ${babyName} viaja hacia su hermoso Baby Shower...`);
        handleLaunchAutopilot();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-gradient-to-b from-[#131e3b] via-[#1b2a4e] to-[#0d1627] text-white">
      {/* Dynamic SASS to CSS tag inject for exact class definitions provided by user */}
      <style>{`
        #main-canvas, #star-canvas {
          z-index: 1;
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
        }
        #main-canvas {
          z-index: 3;
        }
        #cursor {
          z-index: 9999;
          position: absolute;
          will-change: transform;
          pointer-events: none;
          top: 0;
          left: 0;
          width: 60px;
          height: 60px;
        }
        #cursor .rocket {
          will-change: transform;
          width: 100%;
          height: 100%;
          pointer-events: none;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transform-origin: 50% 50%;
        }
        .shadow:after {
          content: '';
          background-color: rgba(0, 0, 0, 0.25);
          width: 80%;
          height: 12px;
          position: absolute;
          bottom: -25px;
          left: 10%;
          border-radius: 100%;
          filter: blur(2px);
          transition: all 0.5s ease;
        }
        @keyframes floating-rocket {
          0% { transform: translate(-50%, -50%); }
          50% { transform: translate(-50%, -55%); }
          100% { transform: translate(-50%, -50%); }
        }
        .floating {
          animation: floating-rocket 1.6s infinite ease-in-out;
        }
        .planets {
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          position: absolute;
          pointer-events: none;
          z-index: 2;
        }
        .planet {
          position: absolute;
          border-radius: 50%;
        }
        /* Planet 1: Large Central Starting Moon at bottom (Reversed!) */
        .planets .planet:first-child {
          background-color: #FFF2CC;
          width: 600px;
          height: 500px;
          bottom: -350px;
          margin-left: auto;
          margin-right: auto;
          left: 0;
          right: 0;
          box-shadow: inset -50px -30px 0 rgba(0, 0, 0, 0.05);
          border: 4px solid #FFEFA6;
        }
        .planets .planet:first-child .crater {
          position: absolute;
          border-radius: 100%;
          background: rgba(0, 0, 0, 0.05);
          box-shadow: inset 5px 5px 0 rgba(0, 0, 0, 0.06);
        }
        .planets .planet:first-child .crater:first-child {
          width: 100px;
          height: 100px;
          top: 90px;
          left: 90px;
        }
        .planets .planet:first-child .crater:nth-child(2) {
          width: 170px;
          height: 150px;
          top: 40px;
          right: 120px;
        }
        /* Planet 2: Small Landing Earth Destination (Top Right - Reversed!) */
        .planets .planet:nth-child(2) {
          background-color: #A2D2FF;
          width: 150px;
          height: 150px;
          top: 100px;
          right: 100px;
          box-shadow: inset -20px -20px 0 rgba(0, 0, 0, 0.1);
          border: 3px solid #BDE0FE;
        }
        .planets .planet:nth-child(2) .planet-background {
          background-color: #ffffff;
          opacity: 0.15;
          width: 100%;
          height: 100%;
          border-radius: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
        .planets .planet:nth-child(2) .crater {
          position: absolute;
          border-radius: 50% 70% 60% 80% / 50% 60% 70% 80%;
          background: #CAFFBF;
          box-shadow: inset 3px 3px 0 rgba(255, 255, 255, 0.2);
        }
        .planets .planet:nth-child(2) .crater:first-child {
          width: 60px;
          height: 40px;
          top: 25px;
          left: 25px;
        }
        .planets .planet:nth-child(2) .crater:nth-child(2) {
          width: 75px;
          height: 55px;
          top: 65px;
          left: 55px;
        }
      `}</style>

      {/* Exact Canvas Structure */}
      <canvas ref={mainCanvasRef} id="main-canvas" />
      <canvas ref={starCanvasRef} id="star-canvas" />

      {/* Exact Planets Architecture */}
      <div className="planets">
        <div className="planet">
          <div className="crater"></div>
          <div className="crater"></div>
        </div>
        <div className="planet">
          <div className="planet-background">
            <div className="crater"></div>
            <div className="crater"></div>
          </div>
        </div>
      </div>

      {/* Exact Cursor + Rocket Structure & Vector SVG with baby boy color customization */}
      <div 
        ref={rocketRef}
        id="cursor"
      >
        <div className="rocket floating shadow">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 178.62 203.18" className="w-full h-full">
            {/* Wing details: custom styled soft indigo baby blue */}
            <path 
              d="M1015.59,714.44l171.81-.62a3.4,3.4,0,0,0,2.9-5.16l-86.46-143.28a3.4,3.4,0,0,0-5.84,0l-85.35,143.9A3.4,3.4,0,0,0,1015.59,714.44Z" 
              transform="translate(-1012.17 -531.96)" 
              fill="#A2D2FF"
            />
            {/* Back panel: pure white */}
            <path 
              d="M1101.5,563.8V714.13l-85.91.31a3.4,3.4,0,0,1-2.93-5.14L1098,565.4A3.34,3.34,0,0,1,1101.5,563.8Z" 
              transform="translate(-1012.17 -531.96)" 
              fill="#fff"
            />
            {/* Outer hull egg shell ellipse */}
            <ellipse cx="89.15" cy="101.59" rx="48.79" ry="101.59" fill="#fff" />
            {/* Hull right shadow panel */}
            <path 
              d="M1101.5,532c26.95,0,48.79,45.48,48.79,101.59s-21.84,101.59-48.79,101.59V532Z" 
              transform="translate(-1012.17 -531.96)" 
              fill="#E1F2FB"
            />
            {/* Nose-cone/stripe accents */}
            <path 
              d="M1101.5,532c28.48,0.6,48.61,45.48,48.61,101.59s-17,77.64-19.2,81.07c0,0,2.78-44.72.74-85.46C1127.54,547.08,1101.5,532,1101.5,532Z" 
              transform="translate(-1012.17 -531.96)" 
              fill="#BDE0FE"
            />
            {/* Window circle */}
            <circle 
              cx="1101.5" 
              cy="592.37" 
              r="18.83" 
              transform="translate(-1108.42 420.42) rotate(-45)" 
              fill="#223a5e" 
              stroke="#fff" 
              strokeMiterlimit="10" 
              strokeWidth="5"
            />
            {/* Window shine */}
            <path 
              d="M1106.71,582.26c-2.14.16-4.34,5-3.94,10.41s3.27,9.34,5.41,9.18,4.37-4.92,4-10.33S1108.85,582.1,1106.71,582.26Z" 
              transform="translate(-1012.17 -531.96)" 
              fill="#fff"
            />
          </svg>
        </div>
      </div>

      {/* Floating horizontal tooltip following rocket without rotation! */}
      <div 
        id="cursor-tooltip"
        className={`absolute w-[240px] z-[10000] pointer-events-none select-none transition-opacity duration-300 ${
          hasLanded ? 'opacity-0 scale-0 pointer-events-none' : ''
        }`}
        style={{ top: 0, left: 0 }}
      >
        <div className="bg-[#FFF9E6]/95 text-[#281154] text-[11px] font-sans font-bold tracking-wide px-3.5 py-2.5 rounded-2xl shadow-xl border border-white/60 text-center relative flex items-center justify-center gap-1.5 animate-bounce">
          <span>👶</span>
          <span>{String(extra?.txtIntroTooltip || `${babyName} ya se acerca a nosotros`)}</span>
          <span>✨</span>
          {/* Custom Petit speech bubble arrow pointing upwards */}
          <div className="absolute bottom-[99%] left-1/2 -translate-x-1/2 border-4 border-transparent border-b-[#FFF9E6]/95" />
        </div>
      </div>

      {/* Bottom Large Moon Text Label indicator */}
      <div className="absolute bottom-4 left-0 right-0 z-30 flex flex-col items-center justify-center gap-2 pointer-events-none">
        
        {/* Floating live countdown when preparing takeoff */}
        <AnimatePresence>
          {isCounting && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="w-16 h-16 rounded-full bg-[#8dbcc4]/30 backdrop-blur-md flex items-center justify-center border-2 border-white text-white font-serif font-black text-2xl shadow-xl mb-2"
            >
              {countdownText}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Manual bypass trigger link */}
      <div className="absolute top-[3%] right-[3%] z-40">
        <button 
          onClick={onComplete}
          className="bg-white/10 hover:bg-white/25 active:scale-95 transition text-[11px] font-sans font-bold px-3.5 py-2 rounded-full border border-white/20 flex items-center gap-1.5 cursor-pointer"
        >
          <span>Saltar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tender overlay banner on stars destination */}
      <div className="absolute bottom-[115px] left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center w-full max-w-[90vw] sm:max-w-md md:max-w-lg px-2 flex justify-center">
        <h2 className="w-full font-serif font-bold text-sm sm:text-lg text-[#2A4660] drop-shadow-xs bg-[#D4EAF1]/90 backdrop-blur-xs py-2 px-4 sm:px-6 rounded-full border border-[#BDE0FE] shadow-sm">
          {String(extra?.txtIntroDestino || `✨ ¡Destino: Baby Shower de ${babyName}! ✨`)}
        </h2>
      </div>

      {/* Launch smoke landing transition splash screen */}
      <AnimatePresence>
        {hasLanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#FEFAF5] z-[10005] pointer-events-none flex flex-col items-center justify-center text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-8 max-w-sm flex flex-col items-center"
            >
              {/* Floating mascot inside rotating loading orbits */}
              <div className="relative w-36 h-36 mb-6 flex items-center justify-center select-none pointer-events-none">
                {/* Concentric spinning space orbits */}
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#A2D2FF]/30 border-t-[#A2D2FF] animate-spin" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-2 rounded-full border-2 border-dashed border-[#BDE0FE]/20 border-b-[#BDE0FE] animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
                
                {/* Floating mascot character image */}
                <motion.img 
                  src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1780848244/personaje-space_nuuwxl.png" 
                  alt="Mascota Espacial flotando" 
                  className="w-24 h-24 object-contain z-10"
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, 4, -4, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>

              <h2 className="text-3xl font-serif font-black text-[#4A443C] mb-2 tracking-tight italic">
                {String(extra?.txtIntroAterrizaje || "¡Aterrizaje Exitoso!")}
              </h2>
              <p className="text-xs font-sans text-[#7C7569] leading-relaxed">
                {String(extra?.txtIntroAterrizajeSub || "¡El cohete ha traído de forma segura al regalo más hermoso del universo! Entrando a la tarjeta de acuarela...")}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
