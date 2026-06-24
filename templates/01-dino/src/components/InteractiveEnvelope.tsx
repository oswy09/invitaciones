import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";
import { DEFAULT_SHOWER_DETAILS, BabyShowerDetails, InvitationData, fromInvitationData } from "../types";
import { loadEvento } from "../lib/loadEvento";
import { usePreviewBridge } from "../hooks/usePreviewBridge";
import InvitationCard from "./InvitationCard";

export default function InteractiveEnvelope() {
  // States: 'closed' | 'opening-flap' | 'sliding-card' | 'opened'
  const [envelopeState, setEnvelopeState] = useState<'closed' | 'opening-flap' | 'sliding-card' | 'opened'>('closed');
  const [hintBlink, setHintBlink] = useState(true);
  const [hasPlayedInboxTone, setHasPlayedInboxTone] = useState(false);

  const [details, setDetails] = useState<BabyShowerDetails>(DEFAULT_SHOWER_DETAILS);
  const [pagado, setPagado] = useState(true);
  const [aprobado, setAprobado] = useState(true);
  const [loadingEvento, setLoadingEvento] = useState(true);

  const handlePreviewUpdate = useCallback((data: InvitationData, previewPagado: boolean) => {
    setDetails(fromInvitationData(data));
    setPagado(previewPagado);
    setAprobado(true);
    setLoadingEvento(false);
    // El sobre se abre normal con la interacción del usuario, igual que en producción.
  }, []);

  const isPreview = usePreviewBridge<InvitationData>(handlePreviewUpdate);

  useEffect(() => {
    if (isPreview) return; // en preview, los datos llegan por postMessage, no por Supabase
    loadEvento().then((result) => {
      setDetails(result.details);
      setPagado(result.pagado);
      setAprobado(result.aprobado);
      setLoadingEvento(false);
    });
  }, [isPreview]);

  const playInboxTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0.0001, now);
      gain1.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1175, now + 0.13);
      gain2.gain.setValueAtTime(0.0001, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.09, now + 0.14);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.18);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.32);

      setTimeout(() => {
        void ctx.close();
      }, 500);
    } catch {
      // Intentionally silent: some devices block sound until user interaction.
    }
  };

  // Turn off initial hint blinking after open
  useEffect(() => {
    if (envelopeState !== 'closed') {
      setHintBlink(false);
    }
  }, [envelopeState]);

  const handleOpenEnvelope = () => {
    if (envelopeState !== 'closed') return;

    if (!hasPlayedInboxTone) {
      playInboxTone();
      setHasPlayedInboxTone(true);
    }
    
    // Step 1: Play unfold animation
    setEnvelopeState('opening-flap');
    
    // Step 2: Slide the card up (approx 600ms later)
    setTimeout(() => {
      setEnvelopeState('sliding-card');
      
      // Step 3: Transition to full interactive InvitationCard (approx 900ms later)
      setTimeout(() => {
        setEnvelopeState('opened');
      }, 950);
    }, 600);
  };

  const handleCloseEnvelope = () => {
    // Reverse timeline
    setEnvelopeState('sliding-card');
    
    setTimeout(() => {
      setEnvelopeState('opening-flap');
      
      setTimeout(() => {
        setEnvelopeState('closed');
      }, 550);
    }, 750);
  };

  if (loadingEvento) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="font-serif-lux text-lg text-[#4A5D6B]">Cargando invitación...</p>
      </div>
    );
  }

  // Nota: `aprobado` ya no oculta la invitación — el cliente debe ver su
  // preview con marca de agua (controlada por `pagado`) apenas la crea,
  // antes de que el operador la apruebe. `aprobado` se usa en el dashboard
  // de admin para decidir si el pedido ya está listo para entregarse.

  return (
    <div className={`relative w-full min-h-screen bg-transparent flex flex-col items-center ${
      envelopeState === 'opened' ? 'py-0 px-0 sm:py-10 sm:px-4 overflow-y-auto' : 'py-10 px-4 justify-center overflow-hidden'
    }`}>
      
      {/* Background Watercolor Wash & Star splatters blended into the Nordic gradient */}
      <div 
        className="fixed inset-0 z-0 select-none pointer-events-none"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/ddqbnr9vo/image/upload/v1780096317/watercolor_blue_bg_1779752340230_tctst4.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />

      {/* Floating Whimsical Clouds with extremely subtle drifting animations */}
      <motion.svg 
        animate={{
          x: [-8, 8, -8],
          y: [-4, 4, -4],
          scale: [0.98, 1.02, 0.98]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-12 left-[8%] w-36 h-auto text-white/50 pointer-events-none z-0" 
        viewBox="0 0 24 24"
      >
        <path fill="currentColor" d="M17.5,19c-3.037,0-5.5-2.463-5.5-5.5c0-0.032,0.002-0.063,0.003-0.095C11.378,13.197,10.702,13,10,13c-2.209,0-4,1.791-4,4c0,2.209,1.791,4,4,4h7.5c1.933,0,3.5-1.567,3.5-3.5S19.433,14,17.5,14c-0.27,0-0.53,0.033-0.78,0.091C16.85,12.35,15.3,11,13.5,11c-0.34,0-0.66,0.05-0.97,0.14C11.66,9.33,9.98,8,8,8c-2.76,0-5,2.24-5,5c0,0.18,0.01,0.35,0.03,0.53C1.27,14.41,0,16.06,0,18c0,2.21,1.79,4,4,4h13.5c2.48,0,4.5-2.02,4.5-4.5S19.98,13,17.5,13" />
      </motion.svg>
      <motion.svg 
        animate={{
          x: [10, -10, 10],
          y: [3, -5, 3],
          scale: [1.02, 0.97, 1.02]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-24 right-[10%] w-44 h-auto text-white/40 pointer-events-none z-0" 
        viewBox="0 0 24 24"
      >
        <path fill="currentColor" d="M17.5,19c-3.037,0-5.5-2.463-5.5-5.5c0-0.032,0.002-0.063,0.003-0.095C11.378,13.197,10.702,13,10,13c-2.209,0-4,1.791-4,4c0,2.209,1.791,4,4,4h7.5c1.933,0,3.5-1.567,3.5-3.5S19.433,14,17.5,14c-0.27,0-0.53,0.033-0.78,0.091C16.85,12.35,15.3,11,13.5,11c-0.34,0-0.66,0.05-0.97,0.14C11.66,9.33,9.98,8,8,8c-2.76,0-5,2.24-5,5c0,0.18,0.01,0.35,0.03,0.53C1.27,14.41,0,16.06,0,18c0,2.21,1.79,4,4,4h13.5c2.48,0,4.5-2.02,4.5-4.5S19.98,13,17.5,13" />
      </motion.svg>

      {/* Floating Sparkles Glitter */}
      <div className="absolute inset-0 z-1 pointer-events-none opacity-40">
        {[15, 35, 55, 75, 85, 25, 45, 65].map((left, idx) => (
          <div 
            key={idx}
            className="absolute bg-[#A5BFD2] rounded-full animate-pulse z-0"
            style={{
              top: `${Math.sin(idx) * 35 + 45}%`,
              left: `${left}%`,
              width: idx % 2 === 0 ? "5px" : "3px",
              height: idx % 2 === 0 ? "5px" : "3px",
              animationDuration: `${2.2 + (idx % 3)}s`,
              animationDelay: `${idx * 0.3}s`
            }}
          />
        ))}
      </div>

      {/* Bottom overlay soft lighting */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#EBF1F5]/80 via-white/30 to-transparent pointer-events-none z-1"></div>

       {/* Interactive Envelope Area - Expanded for a much larger presence or full screen layout once opened */}
      <div className={envelopeState === 'opened' ? "relative z-20 w-full max-w-2xl mx-auto" : "relative z-20 w-full max-w-3xl flex justify-center items-center py-4 min-h-[440px] md:min-h-[540px]"}>
        <AnimatePresence mode="wait">
          {envelopeState !== 'opened' ? (
            <motion.div 
              key="envelope"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -25 }}
              transition={{ type: "spring", stiffness: 100, damping: 21 }}
              className="relative w-full max-w-2xl aspect-[100/70] group cursor-pointer"
              onClick={handleOpenEnvelope}
            >
              
              {/* Envelope content structure utilizing adapted high UX Dribbble SVG coordinates */}
              <div className="relative w-full h-full transition-transform duration-500 group-hover:-translate-y-2.5">
                
                {/* Embedded adapted Dribbble style SVG */}
                <svg 
                  version="1.1" 
                  id="dribbble-envelope-adapted" 
                  viewBox="0 0 1124 788" 
                  className="w-full h-full select-none overflow-visible filter drop-shadow-[0_15px_30px_rgba(74,93,107,0.18)]"
                >
                  {/* Bottom support shadow */}
                  <ellipse className="opacity-20 fill-black" cx="548.8" cy="698" rx="301" ry="17"/>
                  
                  {/* Back flap cover (inside lining + background flap) */}
                  <motion.polygon 
                    id="envelop-top" 
                    className="fill-[#A5BFD2] stroke-white/20"
                    points={envelopeState === 'closed' 
                      ? "798.6,388.1 548.9,548.8 299.3,388.1 299.2,388.1 299.2,697.8 798.9,697.8 798.9,388.1"
                      : "798.6,388.1 548.9,227.4 299.3,388.1 299.2,388.1 299.2,697.8 798.9,697.8 798.9,388.1"
                    }
                    transition={{ type: "spring", stiffness: 100, damping: 14 }}
                  />

                  {/* Inside Starry pattern lining under card */}
                  <g opacity={envelopeState === 'closed' ? 0 : 0.15}>
                    <path d="M400,340 L724,340 L548,227 Z" fill="#C3A66A" />
                  </g>

                  {/* Sliding Invitation Card tucked inside (Extracted slightly more / Más salido!) */}
                  <motion.g 
                    id="invitation"
                    animate={{ 
                      y: (envelopeState === 'sliding-card' || envelopeState === 'opened') ? -245 : -80, 
                      scale: (envelopeState === 'sliding-card' || envelopeState === 'opened') ? 1.03 : 0.985 
                    }}
                    transition={{ type: "spring", stiffness: 80, damping: 16 }}
                  >
                    {/* Bone white luxury invitation page background */}
                    <rect x="337.8" y="340" className="fill-[#F9F8F4] filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.06)]" width="430.6" height="354" rx="14"/>
                    
                    {/* Gold decorative border on card */}
                    <rect x="348.8" y="351" className="fill-none stroke-[#C3A66A]/30 stroke-[1.5]" width="408.6" height="332" rx="10"/>

                    {/* Classic card design mockup lines, adapted beautifully */}
                    <g opacity="0.85">
                      <circle cx="553" cy="385" r="15" fill="#C3A66A" className="opacity-20 animate-pulse" />
                      <path className="fill-[#C3A66A]" d="M553,375 L555.5,381.5 L562,381.5 L556.8,385.5 L558.8,391.5 L553,387.8 L547.2,391.5 L549.2,385.5 L544,381.5 L550.5,381.5 Z" />
                      
                      {/* Placeholder premium content lines */}
                      <rect x="420" y="420" className="fill-[#4A5D6B]/25" width="266" height="11" rx="3.5"/>
                      <rect x="445" y="442" className="fill-[#4A5D6B]/15" width="216" height="8" rx="2.5"/>
                      
                      <rect x="385" y="580" className="fill-[#4A5D6B]/10" width="336" height="7" rx="2"/>
                      <rect x="385" y="600" className="fill-[#4A5D6B]/10" width="336" height="7" rx="2"/>
                      <rect x="385" y="620" className="fill-[#4A5D6B]/10" width="336" height="7" rx="2"/>
                      
                      {/* Golden decorative accent badge */}
                      <rect x="473" y="642" className="fill-[#C3A66A]/85" width="160" height="24" rx="6"/>
                      <text x="553" y="658" className="fill-white font-serif-lux text-[10px] font-semibold text-center select-none tracking-[0.08em]" textAnchor="middle">Pasaporte</text>
                    </g>
                  </motion.g>

                  {/* Front pockets of the envelope overlapping */}
                  <g id="envelop-bottom" className="pointer-events-none select-none">
                    {/* Left overlay flap (st3 background matching serenity shadow) */}
                    <polygon className="fill-[#B0C9D9] opacity-95 stroke-white/10" points="798.9,388.1 798.9,697.8 299.2,697.8 			"/>
                    {/* Right overlay flap (st7 background main serenity blue) */}
                    <polygon className="fill-[#92A8B9] opacity-95 stroke-white/10" points="299.2,388.1 299.2,697.8 798.9,697.8 			"/>
                  </g>

                  {/* Beautiful Dinosaur Egg Shell Stamp (cascarron_u5s2x0.png) right in the MIDDLE of the envelope flaps' intersection */}
                  <g id="notice" className="select-none">
                    {/* Shine Lines adapted key values */}
                    <line className="stroke-[#C3A66A] stroke-[5px] stroke-linecap-round animate-pulse" x1="548" y1="410" x2="548" y2="390"/>
                    <line className="stroke-[#C3A66A] stroke-[5px] stroke-linecap-round opacity-80" x1="430" y1="500" x2="410" y2="500"/>
                    <line className="stroke-[#C3A66A] stroke-[5px] stroke-linecap-round opacity-80 animate-pulse" x1="660" y1="500" x2="680" y2="500"/>

                    {/* Dinosaur Egg Shell Stamp centered exactly in the middle of the envelope flaps */}
                    <motion.image 
                      href="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1779929259/cascarron_u5s2x0.png"
                      x="464"
                      y="420"
                      width="170"
                      height="170"
                      referrerPolicy="no-referrer"
                      className="pointer-events-none select-none filter drop-shadow-[0_12px_22px_rgba(0,0,0,0.22)]"
                      animate={{ 
                        scale: envelopeState === 'closed' ? [1, 1.04, 0.99, 1] : 0,
                        rotate: envelopeState === 'closed' ? [-1.5, 2, -1, 0] : 0
                      }}
                      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </g>
                </svg>

                {/* Animated Glowing Tooltip overlay above the envelope and sliding card - upgraded design with high float and downward arrow */}
                {envelopeState === 'closed' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, x: "-50%" }}
                    animate={{ 
                      opacity: 1, 
                      y: [4, -4, 4],
                      x: "-50%"
                    }}
                    transition={{ 
                      y: {
                        duration: 3.2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      },
                      default: { type: "spring", delay: 0.25 }
                    }}
                    className="absolute left-[50%] -top-11 md:-top-16 z-50 transform pointer-events-none"
                  >
                    <div className="relative bg-[#5E7E96]/95 text-[#F7FAFC] border-2 border-[#E6EEF5]/55 py-2.5 px-4 rounded-xl shadow-xl flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-200 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D9E8F3]"></span>
                      </span>
                      <p className="font-serif-lux text-xl md:text-2xl font-bold tracking-[0.05em] whitespace-nowrap text-[#F7FAFC]">
                        Tienes una invitación...
                      </p>
                      
                      {/* Speech bubble arrow indicator looking DOWNWARDS */}
                      <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#5E7E96] rotate-45 border-r border-b border-[#E6EEF5]/45"></div>
                    </div>
                  </motion.div>
                )}

                {/* Red notification badge with "1" on the upper right of the envelope */}
                {envelopeState === 'closed' && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ 
                      scale: {
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                    className="absolute right-[24%] md:right-[26%] top-[45%] z-45 pointer-events-none"
                  >
                    <span className="relative flex h-6 w-6">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 text-white text-[11px] font-bold font-sans items-center justify-center shadow-lg border border-white/40">
                        1
                      </span>
                    </span>
                  </motion.div>
                )}

                {/* Animated click helper text below the envelope */}
                {envelopeState === 'closed' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.85 }}
                    className="absolute -bottom-8 md:-bottom-12 left-0 right-0 text-center pointer-events-none z-30"
                  >
                    <p className="font-serif-lux text-lg md:text-xl font-extrabold text-[#1E3340] tracking-[0.06em] select-none inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-white/60 border border-white/50 shadow-[0_2px_10px_rgba(36,59,74,0.2)] animate-pulse">
                      {String(details.extra?.txtSobre || "Dale clic al sobre para abrir")}
                    </p>
                  </motion.div>
                )}
                
              </div>
            </motion.div>
          ) : (
            /* Immersive full-screen focused layout with zero outer bounds */
            <motion.div 
              key="card-opened"
              initial={{ opacity: 0, scale: 0.98, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 30 }}
              transition={{ type: "spring", stiffness: 95, damping: 22 }}
              className="w-full max-w-2xl mx-auto z-50 text-stone-850"
            >
              <InvitationCard
                details={details}
                onClose={handleCloseEnvelope}
                isOpened={envelopeState === 'opened'}
                pagado={pagado}
                isPreview={isPreview}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
