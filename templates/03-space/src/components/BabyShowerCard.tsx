import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { 
  Calendar, 
  MapPin, 
  Gift, 
  Send, 
  Check, 
  Volume2, 
  VolumeX, 
  Heart, 
  Clock, 
  Music, 
  Sparkles,
  Settings,
  Users,
  Copy,
  ChevronRight,
  UserCheck,
  Baby
} from 'lucide-react';
import { InvitationDetails, RSVP, InvitationData, fromInvitationData } from '../types';
import { LullabySynth } from '../utils/audioSynth';
import { loadEvento, getEventoIdFromUrl } from '../lib/loadEvento';
import { supabase } from '../lib/supabase';
import { useRsvp } from '../hooks/useRsvp';
import { usePreviewBridge } from '../hooks/usePreviewBridge';

// @ts-ignore
import watercolorBg from '../assets/images/watercolor_bg_1779837998884.png';
// @ts-ignore
import babyIllustration from '../assets/images/baby_illustration_1779838016763.png';

interface BabyShowerCardProps {
  initialAudioSynth: LullabySynth | null;
}

export default function BabyShowerCard({ initialAudioSynth }: BabyShowerCardProps) {
  // Lullaby audio management
  const [audioSynth, setAudioSynth] = useState<LullabySynth | null>(initialAudioSynth);
  const [isMuted, setIsMuted] = useState(false);
  const [floatingNotes, setFloatingNotes] = useState<{ id: string; char: string; left: number; delay: number }[]>([]);

  // Scroll progress for the adventure rocket track
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress(window.scrollY / docHeight);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pinContainerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const rocketRef = useRef<HTMLImageElement | null>(null);
  const bgRocketRef = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    // Scroll particle creator for the background rocket
    const createScrollParticle = (x: number, y: number, container: HTMLElement) => {
      const particle = document.createElement('div');
      const types = ['🔥', '✨', '⭐', '💫', '💨', '✨'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      particle.innerHTML = type;
      particle.style.position = 'absolute';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.transform = 'translate(-50%, -50%) scale(0.6)';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '5';
      particle.style.fontSize = '14px';
      particle.style.transition = 'all 0.9s cubic-bezier(0.1, 0.8, 0.3, 1)';
      particle.style.opacity = '1';
      
      container.appendChild(particle);
      
      setTimeout(() => {
        const driftX = (Math.random() - 0.5) * 50;
        const driftY = (Math.random() - 0.5) * 50 + 10;
        particle.style.transform = `translate(calc(-50% + ${driftX}px), calc(-50% + ${driftY}px)) scale(0)`;
        particle.style.opacity = '0';
      }, 20);
      
      setTimeout(() => {
        particle.remove();
      }, 1000);
    };

    // 1. Persistent background rocket flying across the whole card container on scroll (Zigzag)
    const bgRocketTween = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        onUpdate: (self) => {
          const rocket = bgRocketRef.current;
          if (!rocket) return;
          const rect = rocket.getBoundingClientRect();
          const parent = rocket.parentElement;
          if (!parent) return;
          const parentRect = parent.getBoundingClientRect();

          const x = rect.left - parentRect.left + rect.width / 2;
          const y = rect.top - parentRect.top + rect.height / 2;

          // Only spawn particle if the scroll speed is not zero
          if (Math.abs(self.getVelocity()) > 10) {
            createScrollParticle(x, y, parent);
          }
        }
      }
    });

    // Zigzag motion descending diagonally back and forth, keeping rotation matched to flight direction!
    bgRocketTween
      .fromTo(bgRocketRef.current, {
        top: "2%",
        left: "12%",
        rotation: 135,
        scale: 0.8
      }, {
        top: "15%",
        left: "78%",
        rotation: 135, // Descends down-right
        scale: 1.3, // Grow
        duration: 1,
        ease: "none"
      })
      .to(bgRocketRef.current, {
        top: "30%",
        left: "12%",
        rotation: 225, // Steers down-left
        scale: 0.7, // Shrink
        duration: 1,
        ease: "none"
      })
      .to(bgRocketRef.current, {
        top: "48%",
        left: "82%",
        rotation: 135, // Steers down-right
        scale: 1.4, // Grow
        duration: 1,
        ease: "none"
      })
      .to(bgRocketRef.current, {
        top: "65%",
        left: "10%",
        rotation: 225, // Steers down-left
        scale: 0.8, // Shrink
        duration: 1,
        ease: "none"
      })
      .to(bgRocketRef.current, {
        top: "82%",
        left: "78%",
        rotation: 135, // Steers down-right
        scale: 1.3, // Grow
        duration: 1,
        ease: "none"
      })
      .to(bgRocketRef.current, {
        top: "95%",
        left: "40%",
        rotation: 180, // Steers straight down to land
        scale: 1.0, // Stable land
        duration: 1,
        ease: "none"
      });

    // 2. Pinned GSAP Scroll Animation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=1200", 
          scrub: 0.8,
          pin: pinContainerRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      tl.to(".rocket-text-1", { opacity: 1, y: 0, duration: 0.5 })
        .to(rocketRef.current, { y: 15, repeat: 4, yoyo: true, duration: 0.08 }, "<")
        .to(".rocket-thruster", { scaleY: 1.5, opacity: 1, duration: 0.2 }, "<")
        
        .to(".rocket-text-1", { opacity: 0, y: -20, duration: 0.4 })
        // Despegue (Paso 02) - Se eleva y empieza a crecer
        .to(rocketRef.current, { 
          y: -180, 
          scale: 1.6, 
          rotation: -10, 
          duration: 1.2,
          ease: "power1.inOut" 
        }, "-=0.2")
        .to(".rocket-thruster", { scaleY: 2.2, duration: 0.8 }, "<")
        .to(".rocket-text-2", { opacity: 1, y: 0, duration: 0.5 }, "-=0.8")
        
        .to(".rocket-text-2", { opacity: 0, y: -20, duration: 0.4 })
        // HIPERVELOCIDAD (Paso 03) - ¡El cohete se agranda enormemente y sale disparado a máxima velocidad!
        .to(rocketRef.current, { 
          x: 40,
          y: -280, 
          rotation: 5, 
          scale: 3.2, // ¡Se ve súper grande!
          filter: "drop-shadow(0 0 45px rgba(249,115,22,0.95)) blur(0.5px)", // Efecto de velocidad/ignición
          duration: 1.4,
          ease: "power3.in" // Aceleración rápida
        }, "-=0.2")
        .to(".rocket-thruster", { 
          scaleY: 4.5, // Fuego de propulsión gigante
          scaleX: 1.8,
          backgroundColor: "#ff5500",
          duration: 0.8 
        }, "<")
        .to(".rocket-planet-jupiter", { scale: 1.4, rotation: 35, opacity: 0.95, duration: 1.3 }, "<")
        .to(".rocket-text-3", { opacity: 1, y: 0, duration: 0.5 }, "-=0.8")
        
        .to(".rocket-text-3", { opacity: 0, y: -20, duration: 0.4 })
        // Órbita (Paso 04) - Desacelera suavemente y entra en órbita a tamaño normal
        .to(rocketRef.current, { 
          x: 0, 
          y: -180, 
          rotation: 0, 
          scale: 1.0, // Retorna a tamaño normal estable
          filter: "drop-shadow(0 10px 20px rgba(56,189,248,0.4))",
          opacity: 1,
          duration: 1.5,
          ease: "power2.out" // Desaceleración
        }, "-=0.2")
        .to(".rocket-thruster", { 
          scaleY: 0.4, // Fuego en ralentí/mantenimiento
          scaleX: 0.9,
          opacity: 0.4,
          duration: 0.8 
        }, "<")
        .to(".rocket-planet-jupiter", { opacity: 0, scale: 0.4, duration: 0.9 }, "<")
        .to(".rocket-text-4", { opacity: 1, y: 0, duration: 0.8 }, "-=0.7");
    }, triggerRef);

    return () => {
      bgRocketTween.kill();
      ctx.revert();
    };
  }, []);

  // Default values for baby shower details
  const [details, setDetails] = useState<InvitationDetails>({
    babyName: "Martín",
    parents: {
      mother: "María Fernanda",
      father: "Andrés"
    },
    date: "Domingo, 5 de julio de 2026",
    time: "10:30 a.m. – 1:30 p.m.",
    timestamp: "2026-07-05T10:30:00",
    locationName: "Centro Comercial Santa Fe",
    locationAddress: "Centro Comercial Santafé, Autopista Norte #185-35, Bogotá - Salón de Eventos",
    locationMapUrl: "https://www.google.com/maps/search/?api=1&query=Centro+Comercial+Santaf%C3%A9+Bogot%C3%A1",
    dressCode: "Baby Shower Brunch",
    giftRegistry: [
      {
        shopName: "🍼 Kit de Lactancia & Alimentos",
        code: "Accesorios, teteros o set de platos",
        url: "#",
        alternativeText: "Sugerencia: Teteros o extractor de leche"
      },
      {
        shopName: "👶 Pañales & Cuidados de Amor",
        code: "Pañales tallas Etapa 1, 2 o 3",
        url: "#",
        alternativeText: "Sugerencia: Pañales suaves y toallitas"
      },
      {
        shopName: "👕 Mantitas & Ropa de Algodón",
        code: "Ropita tejida o de algodón (3-6 o 6-9 meses)",
        url: "#",
        alternativeText: "Sugerencia: Bodys pastel, saquitos o cobijas"
      },
      {
        shopName: "🧸 Juguetes suaves & Estimulación",
        code: "Mordedores, sonajeros o móvil para cuna",
        url: "#",
        alternativeText: "Sugerencia: Juguetes de estimulación temprana"
      }
    ],
    whatsappNumber: "3154384042"
  });

  const eventoId = getEventoIdFromUrl();
  const [pagado, setPagado] = useState(true);

  const handlePreviewUpdate = useCallback((data: InvitationData, previewPagado: boolean) => {
    setDetails(fromInvitationData(data));
    setPagado(previewPagado);
  }, []);

  const isPreview = usePreviewBridge<InvitationData>(handlePreviewUpdate);

  // Carga el evento real desde Supabase (eventos.datos) si existe; si no, se
  // conservan los datos por defecto de arriba para que la plantilla siga
  // funcionando como demo/standalone.
  useEffect(() => {
    if (isPreview) return; // en preview, los datos llegan por postMessage, no por Supabase
    loadEvento().then((result) => {
      if (result.details) setDetails(result.details);
      setPagado(result.pagado);
    });
  }, [isPreview]);

  // RSVPs reales en Supabase (confirmaciones_rsvp), visibles para todos los
  // invitados — antes vivían solo en localStorage del navegador de cada uno.
  const { confirmations, submitRsvp } = useRsvp(supabase, eventoId);
  const rsvps: RSVP[] = confirmations.map((c) => ({
    id: c.id,
    name: c.name,
    companions: c.adults,
    message: c.dietDetail,
    status: c.attending ? 'confirmed' : 'declined',
    createdAt: c.timestamp,
  }));

  // State management
  const [showSettings, setShowSettings] = useState(false);
  const [showRsvpList, setShowRsvpList] = useState(false);
  const [copiedShop, setCopiedShop] = useState<string | null>(null);

  // State for interactive location modal
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);

  const copyAddressToClipboard = () => {
    try {
      navigator.clipboard.writeText(details.locationAddress);
      setAddressCopied(true);
      setTimeout(() => setAddressCopied(false), 2500);
    } catch (err) {
      console.error('Error copying text: ', err);
    }
  };

  // RSVP Form state
  const [formName, setFormName] = useState('');
  const [formCompanions, setFormCompanions] = useState(0);
  const [formMessage, setFormMessage] = useState('');
  const [formStatus, setFormStatus] = useState<'confirmed' | 'declined'>('confirmed');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Today's dynamic calendar state
  const [todayInfo, setTodayInfo] = useState({
    dayNum: '06',
    monthName: 'JUNIO',
    weekday: 'SÁBADO',
    yearNum: '2026',
    daysLeft: 0
  });

  // Sweet and Tender Baby Shower Creative Counters
  const [loveHugs, setLoveHugs] = useState(12840);
  const [momCravingsPercent, setMomCravingsPercent] = useState(94.8);
  const [dreamsLimitless, setDreamsLimitless] = useState(999999);

  // Initialize and continuously animate beautiful creative counters
  useEffect(() => {
    const interval = setInterval(() => {
      // Add sweet little increments of love hugs/blessings
      setLoveHugs(prev => prev + (Math.random() > 0.65 ? 1 : 0));

      // Tiny fluctuations in mommy cravings percentage for fun interaction
      setMomCravingsPercent(prev => {
        const delta = (Math.random() - 0.5) * 0.15;
        return Number(Math.max(90, Math.min(100, prev + delta)).toFixed(1));
      });

      // Dreams are limitless and increase in real-time
      setDreamsLimitless(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // State for space background stars representation
  const [ambientStars, setAmbientStars] = useState<{ id: number; top: number; left: number; size: number; duration: number }[]>([]);

  useEffect(() => {
    const starsArray = Array.from({ length: 40 }).map((_, idx) => ({
      id: idx,
      top: Math.random() * 100,
      left: Math.random() * 95,
      size: Math.random() * 2 + 0.8, // sizes from 0.8px to 2.8px
      duration: Math.random() * 5 + 4 // 4s to 9s
    }));
    setAmbientStars(starsArray);
  }, []);

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const eventDate = new Date(details.timestamp);
      
      const timeDiff = eventDate.getTime() - now.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      
      const months = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
      const weekdays = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
      
      setTodayInfo({
        dayNum: String(now.getDate()).padStart(2, '0'),
        monthName: months[now.getMonth()],
        weekday: weekdays[now.getDay()],
        yearNum: String(now.getFullYear()),
        daysLeft: daysLeft > 0 ? daysLeft : 0
      });
    };

    updateDate();
    const timer = setInterval(updateDate, 3600000); // refresh every hour
    return () => clearInterval(timer);
  }, [details.timestamp]);

  // Real HTML5 Audio Element for John Lennon's Beautiful Boy
  const [songAudio] = useState(() => {
    const audio = new Audio("https://res.cloudinary.com/ddqbnr9vo/video/upload/v1779927259/BEAUTIFUL_BOY_JOHN_LENNON_fb85tn.mp3");
    audio.loop = true;
    return audio;
  });

  // Play/Pause handling when model mute state transitions
  useEffect(() => {
    if (!isMuted) {
      songAudio.play().catch(err => {
        console.log("Audio play deferred until user gesture interaction:", err);
      });
    } else {
      songAudio.pause();
    }
  }, [isMuted, songAudio]);

  // Cleanup on unmount to prevent ghost playing
  useEffect(() => {
    return () => {
      songAudio.pause();
    };
  }, [songAudio]);

  // Spawn notes at a sweet interval when music is playing (or unmuted)
  useEffect(() => {
    if (isMuted) return;

    const spawnNote = () => {
      const chars = ['✨', '⭐', '🚀', '🌙', '🪐', '💫', '🍼', '👶', '🧸', '💖'];
      const randomChar = chars[Math.floor(Math.random() * chars.length)];
      const id = Date.now().toString() + Math.random().toString();
      
      setFloatingNotes(prev => [
        ...prev.slice(-15),
        { id, char: randomChar, left: Math.random() * 80 + 10, delay: 0 }
      ]);
    };

    // Spawn initially and then every 800ms
    spawnNote();
    const interval = setInterval(spawnNote, 800);
    return () => clearInterval(interval);
  }, [isMuted]);

  // Toggle audio (plays beautiful John Lennon track and secures quiet mode of old synth)
  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioSynth) {
        audioSynth.stop(); // shut down old synth notes if initialized
      }
    } else {
      setIsMuted(true);
    }
  };

  // Submit RSVP Form
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setIsSubmitting(true);

    // Persistir en Supabase (confirmaciones_rsvp) — visible para todos los
    // invitados, no solo en el navegador de quien confirma.
    submitRsvp({
      name: formName,
      attending: formStatus === 'confirmed',
      adults: formCompanions,
      dietDetail: formMessage,
    }).catch((err) => console.error('No se pudo guardar el RSVP en Supabase', err));

    setTimeout(() => {
      // Compose beautiful custom message for WhatsApp RSVP
      const babyTag = details.babyName ? `Baby Shower de ${details.babyName}` : "nuestro Baby Shower";
      const assistStatus = formStatus === 'confirmed' ? "¡Confirmo mi asistencia con gusto! 😍" : "Lamentablemente no podré asistir, les mando mis mejores deseos 💖";
      const compText = formStatus === 'confirmed' ? `\n👥 Acompañantes: ${formCompanions}` : '';
      const notesText = formMessage ? `\n📝 Mensaje: "${formMessage}"` : '';
      
      const textMessage = `¡Hola! Te escribo para confirmar sobre el ${babyTag}:
✨ Nombre: ${formName}
✅ Estado: ${assistStatus}${compText}${notesText}`;

      const encodedText = encodeURIComponent(textMessage);
      const cleanPhone = details.whatsappNumber.replace(/[^+\d]/g, '');
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;

      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Open whatsapp after brief delayed celebration
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1000);
    }, 800);
  };

  // Reset RSVP form after submission
  const resetRsvpForm = () => {
    setFormName('');
    setFormCompanions(0);
    setFormMessage('');
    setSubmitSuccess(false);
  };

  const copyToClipboard = (shopName: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedShop(shopName);
    setTimeout(() => setCopiedShop(null), 2000);
  };

  // Compute stats
  const totalConfirmedCount = rsvps
    .filter(r => r.status === 'confirmed')
    .reduce((sum, r) => sum + 1 + r.companions, 0);

  return (
    <div 
      style={{ backgroundImage: `url('https://res.cloudinary.com/ddqbnr9vo/image/upload/v1780105211/gondo-space_ukhmo5.png')` }}
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative overflow-x-hidden py-10 px-4 flex flex-col items-center justify-start select-none font-sans animate-fade-in text-white"
    >
      {/* Marca de agua de preview — desaparece cuando el operador marca el evento como pagado */}
      {!pagado && (
        <div className="fixed inset-0 z-[999] pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="rotate-[-30deg] flex flex-wrap gap-16 opacity-15 select-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={i} className="text-4xl font-black text-white whitespace-nowrap">
                VISTA PREVIA
              </span>
            ))}
          </div>
        </div>
      )}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes orbit-drift {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-12px) translateX(6px); }
        }
        .space-star {
          animation: twinkle var(--duration, 5s) infinite ease-in-out;
        }
        .space-star-container {
          animation: orbit-drift 16s infinite ease-in-out;
        }
      `}</style>

      {/* Ambient background stars layer for immersive concept */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 space-star-container">
        {ambientStars.map(star => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full space-star opacity-85"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: star.size,
              height: star.size,
              boxShadow: star.size > 1.8 ? '0 0 6px 1px rgba(255, 255, 255, 0.4)' : 'none',
              '--duration': `${star.duration}s`
            } as React.CSSProperties}
          />
        ))}
      </div>
      
      {/* Whimsical Kid-friendly cloud and planet highlights as beautiful glowing nebulae */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-amber-500/15 rounded-full blur-[40px] opacity-60 pointer-events-none" />
      <div className="absolute top-1/3 right-12 w-48 h-48 bg-pink-500/15 rounded-full blur-[60px] opacity-75 pointer-events-none" />
      <div className="absolute bottom-1/4 left-5 w-40 h-40 bg-sky-500/15 rounded-full blur-[50px] opacity-60 pointer-events-none" />

      {/* Decoratives can float with backdrop details */}
      
      {/* Background audio floating note animation layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        <AnimatePresence>
          {floatingNotes.map(n => (
            <motion.span
              key={n.id}
              initial={{ opacity: 0, y: '100vh', scale: 0.5 }}
              animate={{ opacity: 0.8, y: '-20vh', scale: [1, 1.25, 0.9] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 9, ease: 'easeOut' }}
              className="absolute text-xl md:text-2xl drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] filter blur-[0.2px] select-none"
              style={{ left: `${n.left}%` }}
            >
              {n.char}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* Music Widget Floating button removed as requested */}

      {/* Elegant Side Settings Drawer */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#120a2e] text-white shadow-2xl z-50 p-6 overflow-y-auto border-l border-cyan-500/30"
          >
            <div className="flex justify-between items-center mb-6 border-b border-cyan-500/20 pb-3">
              <h3 className="font-serif font-semibold text-lg text-cyan-200 flex items-center gap-2">
                <Baby className="w-5 h-5 text-pink-400" /> Datos de Invitación
              </h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-white font-bold p-1 cursor-pointer"
              >
                Cerrar ×
              </button>
            </div>
            
            <p className="text-xs text-slate-300 mb-6 font-medium">
              ¡Modifica los textos de abajo para personalizar tu invitación digital en tiempo real!
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-350 mb-1">Nombre del Bebé</label>
                <input
                  type="text"
                  value={details.babyName}
                  onChange={e => setDetails({ ...details, babyName: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-cyan-500/30 rounded-lg text-sm text-white focus:border-cyan-400 focus:outline-none placeholder-slate-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-355 mb-1">Mamá</label>
                  <input
                    type="text"
                    value={details.parents.mother}
                    onChange={e => setDetails({ 
                      ...details, 
                      parents: { ...details.parents, mother: e.target.value } 
                    })}
                    className="w-full p-2.5 bg-slate-900 border border-cyan-500/30 rounded-lg text-sm text-white focus:border-cyan-400 focus:outline-none placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-355 mb-1">Papá</label>
                  <input
                    type="text"
                    value={details.parents.father}
                    onChange={e => setDetails({ 
                      ...details, 
                      parents: { ...details.parents, father: e.target.value } 
                    })}
                    className="w-full p-2.5 bg-slate-900 border border-cyan-500/30 rounded-lg text-sm text-white focus:border-cyan-400 focus:outline-none placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-350 mb-1">Fecha del Evento</label>
                <input
                  type="text"
                  value={details.date}
                  onChange={e => setDetails({ ...details, date: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-cyan-500/30 rounded-lg text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-350 mb-1">Hora</label>
                <input
                  type="text"
                  value={details.time}
                  onChange={e => setDetails({ ...details, time: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-cyan-500/30 rounded-lg text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-1">Reloj de Cuenta Regresiva (ISO)</label>
                <input
                  type="datetime-local"
                  value={details.timestamp.substring(0, 16)}
                  onChange={e => setDetails({ ...details, timestamp: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-cyan-500/30 rounded-lg text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-350 mb-1">Nombre del Lugar</label>
                <input
                  type="text"
                  value={details.locationName}
                  onChange={e => setDetails({ ...details, locationName: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-cyan-500/30 rounded-lg text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-350 mb-1">Dirección Completa</label>
                <textarea
                  value={details.locationAddress}
                  onChange={e => setDetails({ ...details, locationAddress: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-cyan-500/30 rounded-lg text-sm text-white focus:border-cyan-400 focus:outline-none h-16 pointer-events-auto"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-350 mb-1">Código de Vestimenta</label>
                <input
                  type="text"
                  value={details.dressCode}
                  onChange={e => setDetails({ ...details, dressCode: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-cyan-500/30 rounded-lg text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-350 mb-1">Teléfono WhatsApp de Confirmaciones</label>
                <input
                  type="text"
                  value={details.whatsappNumber}
                  onChange={e => setDetails({ ...details, whatsappNumber: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-cyan-500/30 rounded-lg text-sm text-white focus:border-cyan-400 focus:outline-none font-mono"
                  placeholder="+52..."
                />
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="mt-6 w-full py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold rounded-lg text-xs tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Confirmar Cambios ✔
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant Side RSVP Guest Manager */}
      <AnimatePresence>
        {showRsvpList && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="fixed top-0 left-0 h-full w-full max-w-sm bg-[#120a2e] text-white shadow-2xl z-50 p-6 overflow-y-auto border-r border-cyan-500/30"
          >
            <div className="flex justify-between items-center mb-6 border-b border-cyan-500/20 pb-3">
              <h3 className="font-serif font-semibold text-lg text-cyan-200 flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-400" /> Respuestas ({totalConfirmedCount} pax)
              </h3>
              <button 
                onClick={() => setShowRsvpList(false)}
                className="text-slate-400 hover:text-white font-bold p-1 cursor-pointer"
              >
                Cerrar ×
              </button>
            </div>

            <div className="space-y-3">
              {rsvps.map((r) => (
                <div key={r.id} className="p-3 bg-slate-900 border border-cyan-500/20 rounded-xl text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-white text-sm">{r.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                      r.status === 'confirmed' 
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-rose-950/60 text-rose-455 border border-rose-500/30'
                    }`}>
                      {r.status === 'confirmed' ? `Si asiste (+${r.companions})` : 'No asiste'}
                    </span>
                  </div>
                  {r.message && <p className="text-slate-300 italic mb-1">"{r.message}"</p>}
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(r.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}

              {rsvps.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-slate-400 text-sm">No hay confirmaciones aún. ¡Envía tu confirmación para probar!</p>
                </div>
              )}
            </div>

            <button
              disabled
              title="Las confirmaciones ahora viven en Supabase; se moderan desde el dashboard de administración"
              className="mt-6 w-full py-2.5 bg-rose-950/40 border border-rose-500/30 text-rose-300/40 text-xs font-bold rounded-lg cursor-not-allowed"
            >
              Reiniciar Lista de Invitados
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Celestial Interactive Location Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#060411]/75 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowLocationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-gradient-to-b from-white to-sky-50 rounded-3xl border-2 border-indigo-200 shadow-[0_20px_50px_rgba(49,46,129,0.3)] w-full max-w-sm overflow-hidden relative p-6 text-slate-850"
              onClick={e => e.stopPropagation()}
            >
              {/* Corner Close Button */}
              <button 
                onClick={() => setShowLocationModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-indigo-950 transition-colors w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-lg cursor-pointer border border-slate-200 shadow-sm"
                aria-label="Cerrar modal"
              >
                ×
              </button>

              {/* Decorative Planet & Stars Background element */}
              <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-indigo-100/40 pointer-events-none select-none blur-xs" />
              <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-pink-100/30 pointer-events-none select-none blur-xs" />

              {/* Modal Core Headers */}
              <div className="text-center mb-5 relative z-10">
                <div className="text-4xl mb-2 animate-bounce" style={{ animationDuration: '4s' }}>🚀</div>
                <h3 className="font-sans font-black text-indigo-950 text-xl uppercase tracking-wider leading-tight">
                  Estación de Destino
                </h3>
                <p className="text-[10px] text-[#db2777] font-black uppercase tracking-widest mt-1 bg-pink-50 px-2.5 py-0.5 rounded-full inline-block border border-pink-100">
                  Ubicación de Bienvenida 🪐
                </p>
              </div>

              {/* Interactive Location Name Body */}
              <div className="bg-white/90 border border-indigo-100/80 rounded-2xl p-4 shadow-sm mb-5 text-center relative overflow-hidden z-10">
                <div className="text-2xl mb-1.5 animate-pulse">📍</div>
                <h4 className="font-sans font-black text-slate-900 text-base mb-1.5 leading-snug">
                  {details.locationName}
                </h4>
                <p className="text-xs text-slate-700 font-bold leading-relaxed mb-4 max-w-[280px] mx-auto">
                  {details.locationAddress}
                </p>

                {/* Copier Action Widget with beautiful pink 3D styling */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={copyAddressToClipboard}
                    className="py-2 px-4 rounded-full bg-indigo-50 hover:bg-indigo-100 active:translate-y-[1px] border-2 border-indigo-200 text-[11px] text-indigo-800 font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    {addressCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 font-black" />
                        <span className="text-emerald-700">¡Copiado con Éxito! 🪐</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-indigo-650" />
                        <span>Copiar Dirección</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Interactive Waze vs Google Maps navigation */}
              <div className="mb-6 relative z-10">
                <h5 className="text-[10px] uppercase font-black tracking-widest text-indigo-900/60 mb-3 text-center">
                  Iniciar Navegación Estelar 🧭
                </h5>
                <div className="grid grid-cols-2 gap-3">
                  {/* Google Maps Launch */}
                  <a
                    href={details.locationMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:translate-y-[2px] active:shadow-[0_1px_0px_#1e1b4b] transition-all text-white font-black text-[11px] uppercase tracking-wider flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer border-2 border-indigo-800 shadow-[0_3px_0px_#1e1b4b,0_4px_8px_rgba(0,0,0,0.12)] translate-y-[-1px]"
                  >
                    <span className="text-lg">🗺️</span>
                    <span>Google Maps</span>
                  </a>

                  {/* Waze Launch */}
                  <a
                    href={`https://waze.com/ul?q=${encodeURI("Carrera 14A #109-55 Edificio Jade Bogota")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-3 rounded-2xl bg-[#00d2f3] hover:bg-[#00b9d6] active:translate-y-[2px] active:shadow-[0_1px_0px_#008099] transition-all text-white font-black text-[11px] uppercase tracking-wider flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer border-2 border-[#009bbf] shadow-[0_3px_0px_#008099,0_4px_8px_rgba(0,0,0,0.12)] translate-y-[-1px]"
                  >
                    <span className="text-g">🚗</span>
                    <span>Abrir Waze</span>
                  </a>
                </div>
              </div>

              {/* Close Bottom 3D Button - matches user-check/rsvp toggle style */}
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="w-full py-3 bg-[#ec4899] hover:bg-[#db2777] active:translate-y-[2px] active:shadow-[0_1px_0px_#9d174d] text-white shadow-[0_3px_0px_#9d174d,_0_4px_10px_rgba(0,0,0,0.15)] rounded-full uppercase tracking-widest font-black text-xs cursor-pointer border-2 border-[#5c0632] transition-all"
              >
                Volver al Despegue 🚀
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MASSIVE ADVENTURE CONTAINER CONSTRAINING THE ZIGZAG ROCKET AND CARDS */}
      <div className="w-full max-w-[540px] relative flex flex-col items-center mt-12 mb-10 z-20 mx-auto">
        {/* INNER WRAP - PHYSICAL CARD ENVELOPE */}
        <div className="w-full relative mb-10">

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-full relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md border border-white/10"
        >
        {/* PHYSICAL WATERCOLOR CARD BODY */}
        <div 
          className="relative px-6 py-12 flex flex-col items-center justify-start min-h-[720px] select-none overflow-hidden text-slate-800"
          style={{ 
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.45))`
          }}
        >
          {/* Watercolor background with delicate transparency so deep space and stars are visible */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-45 select-none pointer-events-none mix-blend-multiply animate-pulse"
            style={{ 
              backgroundImage: `url(${watercolorBg})`,
              animationDuration: '12s'
            }}
          />

          {/* Constellation background layer */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-200 via-indigo-900/5 to-transparent pointer-events-none" />

          {/* Glowing Space Border inside */}
          <div className="absolute inset-4 border border-indigo-200/40 rounded-3xl pointer-events-none z-10 shadow-[inset_0_0_20px_rgba(30,58,138,0.03)]" />

          {/* Two floating celestial stars */}
          <motion.div 
            className="absolute top-24 left-6 z-20 text-3xl pointer-events-none select-none"
            animate={{ 
              y: [0, -16, 0],
              x: [0, 8, 0],
              rotate: [0, 15, -15, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ⭐
          </motion.div>

          <motion.div 
            className="absolute top-52 right-8 z-20 text-3xl pointer-events-none select-none"
            animate={{ 
              y: [0, 18, 0],
              x: [0, -10, 0],
              rotate: [0, -20, 20, 0]
            }}
            transition={{
              duration: 6.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🌟
          </motion.div>

          {/* Whimsical Floating Space Character Mascot - Centered at the top of the card */}
          <motion.div
            className="w-24 h-24 md:w-32 md:h-32 z-20 mb-1 select-none pointer-events-none filter drop-shadow-[0_8px_16px_rgba(30,41,59,0.25)]"
            animate={{
              y: [0, -12, 0],
              x: [0, 4, -4, 0],
              rotate: [1, -5, 4, 1]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img 
              src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1780848244/personaje-space_nuuwxl.png" 
              alt="Mascota Espacial" 
              className="w-full h-auto object-contain mx-auto"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Subheader category styling */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 0.95, y: 0 }}
            className="text-sky-800 font-sans tracking-[0.25em] uppercase text-[10px] font-black mb-3 mt-4 z-20 text-center drop-shadow-sm"
          >
            Un dulce milagro está en camino
          </motion.div>

          {/* Main calligraphic script baby banner with custom spacing to prevent any text clipping */}
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-cursive text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-pink-500 to-indigo-700 drop-shadow-[0_2px_4px_rgba(30,58,138,0.22)] font-black py-4 md:py-6 px-4 my-2 md:my-4 select-none z-20 text-center leading-[1.2]"
          >
            {details.babyName}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-sans text-pink-650 font-black text-lg md:text-xl tracking-widest mb-6 z-20 text-center uppercase drop-shadow-xs"
          >
            {details.dressCode}
          </motion.div>

          {/* Cosmic Micro-Constellation Space Graphics to bridge beautifully without overlap */}
          <div className="flex items-center gap-3 my-4 z-20">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
            <div className="w-14 h-[1.5px] bg-gradient-to-r from-transparent to-sky-400/40" />
            <span className="text-pink-500 text-xs animate-pulse">⭐</span>
            <div className="w-14 h-[1.5px] bg-gradient-to-l from-transparent to-sky-400/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
          </div>

          {/* Short introduction paragraph (parents removed) */}
          <p className="text-slate-700 font-sans text-sm tracking-wide text-center leading-relaxed max-w-[360px] mb-8 select-none z-20 font-bold px-2 drop-shadow-xs">
            Acompáñanos a compartir una mañana especial al aire libre, llena de amor, buenos momentos y muchas bendiciones.
          </p>

          {/* Divider floral motif spacing */}
          <div className="w-32 h-[1px] bg-slate-200 mb-8 relative z-20 flex justify-center items-center">
            <Heart className="w-4 h-4 text-pink-500 absolute bg-transparent px-1 fill-pink-500/25" />
          </div>

          {/* ADVENTURE TICKETS SECTION */}
          <div className="w-full flex flex-col gap-4 mb-8 z-20">
            {/* Ticket 1: El Gran Día */}
            <div className="w-full py-2.5 px-4 rounded-2xl bg-white/75 border border-indigo-100 flex items-start gap-4 shadow-[0_2px_8px_rgba(30,41,59,0.02)]">
              <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-200/50 flex items-center justify-center text-lg shrink-0 select-none shadow-xs">
                🪐
              </div>
              <div className="flex-1 text-left">
                <span className="text-[10px] uppercase font-black tracking-widest text-indigo-700 block">Cuándo</span>
                <span className="text-sm font-black text-slate-900 tracking-tight leading-tight block mt-0.5">
                  {details.date}
                </span>
                <span className="text-xs text-pink-650 font-black mt-0.5 block">
                  {details.time}
                </span>
              </div>
            </div>

            {/* Ticket 2: El Lugar */}
            <div className="w-full py-2.5 px-4 rounded-2xl bg-white/75 border border-indigo-100 flex items-start gap-4 shadow-[0_2px_8px_rgba(30,41,59,0.02)]">
              <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-200/50 flex items-center justify-center text-lg shrink-0 select-none shadow-xs">
                🚀
              </div>
              <div className="flex-1 text-left min-w-0">
                <span className="text-[10px] uppercase font-black tracking-widest text-indigo-700 block">Dónde</span>
                <span className="text-sm font-black text-slate-900 leading-tight block mt-0.5 whitespace-normal break-words">
                  {details.locationName}
                </span>
                <span className="text-xs text-slate-655 font-bold leading-relaxed block mt-0.5 whitespace-normal break-words">
                  {details.locationAddress}
                </span>
              </div>
            </div>
          </div>

          {/* BELLO Y TIERNO REGISTRO DEL DULCE VIAJE DEL BEBÉ */}
          <div className="w-full max-w-[440px] bg-gradient-to-b from-sky-50 via-white to-pink-50/70 rounded-3xl p-6 border-2 border-indigo-100/80 shadow-[0_12px_25px_rgba(165,180,252,0.15)] relative mb-8 z-20 hover:scale-[1.01] transition-all duration-300">
            {/* Soft celestial elements background decoration */}
            <div className="absolute top-2 right-2 text-2xl opacity-20 select-none pointer-events-none">☁️</div>
            <div className="absolute bottom-4 left-2 text-2xl opacity-20 select-none pointer-events-none">🍼</div>
            <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-indigo-100/35 pointer-events-none blur-md select-none" />

            {/* Panel Title */}
            <div className="text-center mb-4 relative z-10 border-b border-indigo-100/60 pb-3">
              <span className="text-[10px] font-black uppercase text-pink-600 tracking-widest bg-pink-100/60 px-3 py-1 rounded-full border border-pink-200">
                💫 Preparando el Gran Encuentro
              </span>
              <h4 className="font-sans font-black text-indigo-950 text-base mt-2 tracking-tight">
                El Dulce Viaje de {details.babyName}
              </h4>
            </div>

            {/* Glowing Hugs & Kisses Real-time Accumulator (Main Feature) */}
            <div className="bg-white/95 border border-indigo-50 rounded-2xl p-4 mb-4 text-center relative z-10 shadow-xs">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-white rounded-full text-[8.5px] font-black tracking-widest uppercase px-3 py-0.5 shadow-sm">
                ¡EN TIEMPO REAL! 🌟
              </div>
              
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-1.5 mb-1">
                Besos y buenos deseos enviados al espacio
              </span>
              
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-2xl animate-bounce" style={{ animationDuration: '2.5s' }}>💖</span>
                <span className="text-3xl font-mono font-black text-indigo-900 tracking-tighter">
                  {loveHugs.toLocaleString()}
                </span>
                <span className="bg-gradient-to-r from-pink-500 to-amber-500 text-transparent bg-clip-text text-lg font-black animate-pulse">
                  +
                </span>
              </div>
            </div>

            {/* 2-Columns Side Gauges for Cravings & Sweet Dreams */}
            <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
              {/* Left Column: Mom Cravings or Strawberry Milkshakes Meter */}
              <div className="bg-white/70 border border-indigo-50/55 rounded-xl p-3 flex flex-col justify-between shadow-xs">
                <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wide block leading-tight">
                  Antojitos de Mamá 🍫🍓
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-base font-black text-slate-850">{momCravingsPercent}%</span>
                </div>
                {/* Custom sweet pink loading progression track */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1.5">
                  <div 
                    className="bg-gradient-to-r from-pink-400 to-rose-500 h-full rounded-full transition-all duration-300" 
                    style={{ width: `${momCravingsPercent}%` }}
                  />
                </div>
                <span className="text-[7.5px] font-bold text-pink-650/80 mt-1 block">¡Fresa y chocolate!</span>
              </div>

              {/* Right Column: Limitless family dreams */}
              <div className="bg-white/70 border border-indigo-50/55 rounded-xl p-3 flex flex-col justify-between shadow-xs">
                <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wide block leading-tight">
                  Sueños en Familia ✨
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-base font-mono font-black text-slate-850">
                    {dreamsLimitless.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1.5">
                  <div className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full rounded-full w-full" />
                </div>
                <span className="text-[7.5px] font-bold text-sky-700 mt-1 block">¡Infinitos e imparables!</span>
              </div>
            </div>

            {/* Bottom Cabin Sweet Status Message */}
            <div className="bg-[#FFFDF4] border border-amber-100 rounded-xl p-4 text-left relative z-10">
              <span className="text-[8.5px] font-black uppercase text-amber-700 tracking-widest block mb-1">
                🧁 CUENTA REGRESIVA DE SUEÑOS:
              </span>
              <p className="text-[11px] font-sans font-bold leading-normal text-slate-700">
                ¡Faltan exactamente <span className="text-pink-600 font-mono font-black text-xs">{todayInfo.daysLeft} siestas y noches de dulces sueños</span> para encontrarnos en nuestro Brunch de Bienvenida! El viaje está lleno de amor. 🧸🎀
              </p>
            </div>
          </div>

          {/* OPEN MODAL MAP - STYLED IN 3D TO EXACTLY MATCH THE ATTACHED PINK PILL GUEST BUTTON DESIGN */}
          <button
            type="button"
            onClick={() => setShowLocationModal(true)}
            className="w-11/12 max-w-[420px] py-3.5 px-6 bg-[#ec4899] hover:bg-[#db2777] active:translate-y-[2px] active:shadow-[0_1px_0px_#9d174d] text-white shadow-[0_4px_0px_#9d174d,_0_6px_12px_rgba(0,0,0,0.2)] rounded-full uppercase tracking-widest font-black text-sm md:text-base flex items-center justify-center gap-3 mb-8 z-20 cursor-pointer border-2 border-[#5c0632] transition-all translate-y-[-2px]"
          >
            {/* Map pin icon inside a small matching circle */}
            <div className="w-7 h-7 rounded-full bg-pink-600/30 border border-white/20 flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5 text-white animate-pulse" />
            </div>
            <strong className="tracking-widest font-black text-white">VER UBICACIÓN</strong>
          </button>

          {/* GIFT SUGGESTION (RECONFIGURED AS DYNAMIC LISTA DE REGALOS WITH 4 CHIPS) */}
          <div className="w-full py-4 flex flex-col items-center mb-6 z-20">
            <Gift className="w-5.5 h-5.5 text-pink-650 mb-1.5 animate-bounce" style={{ animationDuration: '3s' }} />
            <h4 className="font-sans font-black text-indigo-950 text-sm uppercase tracking-wider mb-1 text-center">Lista de Regalos</h4>
            <p className="text-[11px] text-slate-700 text-center mb-4 max-w-[340px] font-bold leading-normal">
              Su presencia en este brunch es nuestro mayor regalo. Si desean tener un lindo detalle con {details.babyName}, les compartimos nuestra lista sugerida:
            </p>
            
            <div className="w-full flex flex-col gap-2.5 mt-1">
              {details.giftRegistry.map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between w-full p-3 bg-white/75 border border-indigo-50 rounded-2xl shadow-xs hover:border-indigo-200/50 transition-all"
                >
                  <div className="flex-1 text-left min-w-0 pr-2">
                    <span className="font-sans font-black text-indigo-700 text-[10px] uppercase tracking-wider block">
                      {item.shopName}
                    </span>
                    <span className="text-[11.5px] font-extrabold text-slate-800 mt-0.5 block truncate leading-tight">
                      {item.code}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(item.shopName, item.code)}
                    className="py-1.5 px-3.5 rounded-full bg-indigo-55 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200/40 border border-indigo-200 text-[9.5px] text-indigo-700 font-extrabold uppercase tracking-wider flex items-center gap-1 shrink-0 transition-all cursor-pointer shadow-2xs"
                  >
                    {copiedShop === item.shopName ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-indigo-650 fill-indigo-200/10" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative Space Character Mascot below the gift list */}
          <motion.div
            className="w-20 h-20 md:w-24 md:h-24 z-20 mb-5 select-none pointer-events-none filter drop-shadow-[0_8px_16px_rgba(30,41,59,0.2)]"
            animate={{
              y: [0, -10, 0],
              x: [0, 4, -4, 0],
              rotate: [-2, 6, -4, -2]
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img 
              src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1780848244/personaje-space_nuuwxl.png" 
              alt="Mascota Espacial" 
              className="w-full h-auto object-contain mx-auto"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* SPECIAL SONG ZONE: ADORABLE COSMIC SOUND STATION */}
          <div className="w-full max-w-[440px] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-4 border-2 border-indigo-400/40 shadow-[0_8px_20px_rgba(30,27,75,0.2)] mb-6 z-20 relative overflow-hidden text-white/90">
            {/* Tiny stars or planet details in the background of the player */}
            <div className="absolute top-1 right-2 text-xs opacity-20 select-none pointer-events-none">🪐</div>
            <div className="absolute bottom-1.5 left-2 text-xs opacity-25 select-none pointer-events-none animate-bounce" style={{ animationDuration: '4s' }}>✨</div>

            <div className="flex items-center justify-between mb-2 pb-2 border-b border-indigo-500/20">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isMuted ? 'bg-amber-500 animate-pulse' : 'bg-[#00f2fe] animate-ping'}`} />
                <span className="text-[8px] font-mono font-black uppercase text-indigo-300 tracking-wider">
                  {isMuted ? 'MÚSICA PAUSADA' : 'REPRODUCIENDO SEÑAL ESTELAR 📡'}
                </span>
              </div>
              <span className="text-[8.5px] font-mono font-bold text-slate-400">ESTACIÓN DE AUDIO</span>
            </div>

            <div className="flex items-center gap-3.5 pl-1">
              <button 
                type="button"
                onClick={handleToggleMute}
                className={`w-11 h-11 rounded-full flex items-center justify-center text-white text-sm cursor-pointer border-2 font-black transition-all active:translate-y-[2px] shrink-0 ${
                  isMuted 
                    ? 'bg-[#ec4899] hover:bg-[#db2777] border-[#9d174d] shadow-[0_3px_0px_#9d174d]' 
                    : 'bg-[#06b6d4] hover:bg-[#0891b2] border-[#083344] shadow-[0_3px_0px_#083344] animate-pulse'
                }`}
                title={isMuted ? "Reproducir" : "Pausar"}
              >
                {isMuted ? "▶" : "⏸"}
              </button>

              <div className="flex-1 min-w-0 text-left">
                <span className="text-[8px] font-mono font-black uppercase text-[#ff2e93] block tracking-widest leading-none">CANCION DE CUNA</span>
                <h5 className="text-xs font-sans font-black text-white truncate drop-shadow-sm mt-0.5">“Beautiful Boy”</h5>
                <p className="text-[10px] text-cyan-300 font-bold truncate leading-none mt-1">John Lennon (Tema Oficial)</p>
              </div>

              {/* Glowing Space Equalizer or spectrum waveform */}
              <div className="flex items-end gap-1 h-6 pe-1 shrink-0">
                {isMuted ? (
                  <>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                  </>
                ) : (
                  <>
                    <span className="w-0.5 bg-[#00f2fe] rounded-full animate-bounce h-2" style={{ animationDuration: '0.8s', animationDelay: '0.1s' }} />
                    <span className="w-0.5 bg-[#ff2e93] rounded-full animate-bounce h-5" style={{ animationDuration: '0.6s', animationDelay: '0.3s' }} />
                    <span className="w-0.5 bg-[#ffb800] rounded-full animate-bounce h-3.5" style={{ animationDuration: '0.9s', animationDelay: '0.5s' }} />
                    <span className="w-0.5 bg-[#3bf24e] rounded-full animate-bounce h-1.5" style={{ animationDuration: '0.7s', animationDelay: '0.2s' }} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>

    {/* GSAP ADVANCED PINNED SCENE - ROCKET JOURNEY STATION */}
    <div ref={triggerRef} className="w-full relative z-30 my-8 py-4">
      <div 
        ref={pinContainerRef} 
        className="w-full min-h-[95vh] bg-[#09031c]/95 flex flex-col items-center justify-between relative overflow-hidden text-center select-none py-10 px-4 shadow-[0_0_80px_rgba(20,5,54,0.9)_inset] rounded-[2.5rem] border border-indigo-400/25 max-w-[520px] mx-auto"
      >
        {/* Animated particle cosmic background layer inside pinned scene */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.22)_0%,_transparent_75%)] pointer-events-none" />
        <div className="absolute top-10 right-10 text-xl opacity-35 select-none pointer-events-none animate-spin" style={{ animationDuration: '20s' }}>🪐</div>
        <div className="absolute bottom-1/3 left-6 text-lg opacity-20 select-none pointer-events-none animate-pulse">💫</div>
        <div className="absolute top-1/2 left-3 text-sm opacity-25 select-none pointer-events-none">✨</div>

        <div className="bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-400/30 px-4 py-1.5 rounded-full z-10 text-[9.5px] font-mono tracking-[0.2em] text-cyan-300 uppercase font-black">
          ESTACIÓN DE PROPULSIÓN {details.babyName.toUpperCase()} 🛡️
        </div>

        {/* Floating Jupiter Planet triggered in middle scenes */}
        <div className="rocket-planet-jupiter absolute top-1/4 right-[25%] w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-indigo-800 border-2 border-indigo-300/30 opacity-0 scale-50 pointer-events-none flex items-center justify-center filter blur-[0.2px] z-10 shadow-[0_0_30px_rgba(219,39,119,0.3)]">
          <div className="absolute w-[110px] h-2 bg-white/25 rounded-full rotate-12 blur-[0.5px]" />
          <span className="text-lg">🪐</span>
        </div>

        {/* Dynamic screen indicators */}
        <div className="relative w-full max-w-[340px] h-36 flex items-center justify-center px-2 z-20">
          <div className="rocket-text-1 absolute opacity-0 translate-y-4 flex flex-col items-center gap-1.5">
            <span className="text-pink-400 text-[10px] font-mono font-black uppercase tracking-widest bg-pink-500/10 px-2 py-0.5 rounded-sm border border-pink-400/20">PASO 01</span>
            <h4 className="text-lg md:text-xl font-black text-white px-2">Cargando Combustible de Amor</h4>
            <p className="text-[10px] text-slate-350 max-w-[260px] font-medium leading-relaxed">Próximo despegue interestelar. Haz scroll para iniciar ignición.</p>
          </div>

          <div className="rocket-text-2 absolute opacity-0 translate-y-4 flex flex-col items-center gap-1.5">
            <span className="text-amber-400 text-[10px] font-mono font-black uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded-sm border border-amber-400/25">PASO 02</span>
            <h4 className="text-lg md:text-xl font-black text-yellow-300 px-2 leading-tight">¡DESPEGUE EXITOSO! 🚀</h4>
            <p className="text-[10px] text-slate-300 max-w-[260px] font-medium leading-relaxed">Atravesando atmósfera terrestre hacia las estrellas de los sueños.</p>
          </div>

          <div className="rocket-text-3 absolute opacity-0 translate-y-4 flex flex-col items-center gap-1.5">
            <span className="text-cyan-400 text-[10px] font-mono font-black uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded-sm border border-cyan-400/25">PASO 03</span>
            <h4 className="text-lg md:text-xl font-black text-cyan-200 px-2">Esquivando Cometas de Felpa ☄️</h4>
            <p className="text-[10px] text-slate-300 max-w-[260px] font-medium leading-relaxed">Navegando el cinturón celeste de {details.babyName} a máxima velocidad hiperespacial.</p>
          </div>

          <div className="rocket-text-4 absolute opacity-0 translate-y-4 flex flex-col items-center gap-1.5">
            <span className="text-emerald-400 text-[10px] font-mono font-black uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-sm border border-emerald-400/25">ALCANZADO</span>
            <h4 className="text-lg md:text-xl font-black text-[#56f081] px-2 leading-snug">¡Órbita Baby Shower! 🌌</h4>
            <p className="text-[10px] text-pink-200 font-extrabold max-w-[280px] leading-relaxed">Ubicación y combustible estables. Sigue haciendo scroll para confirmar tu asistencia.</p>
          </div>
        </div>

        {/* Dynamic Flying Rocket interactive target */}
        <div className="relative w-full h-[280px] flex items-end justify-center pointer-events-none mt-4 z-10">
          <div className="absolute -bottom-8 w-64 h-32 rounded-t-full bg-indigo-900/40 border-t-2 border-indigo-400/20 backdrop-blur-md flex flex-col items-center pt-3">
            <span className="text-[9px] font-black text-indigo-300 font-mono tracking-[0.2em] leading-none uppercase">{details.babyName} Launchpad 🌍</span>
            {/* Tiny stars radiating on earth */}
            <span className="text-[10px] text-indigo-300 animate-pulse mt-1">✨✨</span>
          </div>

          {/* Interactive Pinned Space Rocket */}
          <div className="absolute top-[130px] flex flex-col items-center">
            <div className="relative flex flex-col items-center">
              <img
                ref={rocketRef}
                src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1780848244/cohete-space_dixaao.png"
                alt="Cohete Espacial"
                className="w-20 h-20 md:w-24 md:h-24 object-contain filter drop-shadow-[0_10px_20px_rgba(56,189,248,0.4)]"
                referrerPolicy="no-referrer"
              />
              {/* Scalable and animatable GSAP thruster exhaust */}
              <div 
                className="rocket-thruster absolute -bottom-5 w-4 bg-gradient-to-b from-yellow-300 via-orange-500 to-red-650 opacity-0 scale-y-50 rounded-full filter blur-[1px] h-10" 
                style={{ transformOrigin: 'top center' }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* CONFIRMATION CARD SECTION (RSVP OPEN CARD IN HIGH CONTRAST) */}
    <div className="w-full relative mb-10 z-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="w-full relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md border border-white/10"
      >
        <div 
          className="relative px-8 py-12 flex flex-col items-center justify-start select-none overflow-hidden text-slate-800"
          style={{ 
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.45))`
          }}
        >
          {/* Watercolor background */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-45 select-none pointer-events-none mix-blend-multiply"
            style={{ 
              backgroundImage: `url(${watercolorBg})`
            }}
          />
          {/* Constellations overlay */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-200 via-indigo-900/5 to-transparent pointer-events-none" />
          
          {/* Internal glowing space border */}
          <div className="absolute inset-4 border border-indigo-200/40 rounded-3xl pointer-events-none z-10 shadow-[inset_0_0_20px_rgba(30,58,138,0.03)]" />

          {/* CONFIRMATION RSVP COMPLEMENT */}
          <div id="rsvp-section" className="w-full z-20">
            <h4 className="font-sans text-xl md:text-2xl font-black text-center text-indigo-950 uppercase tracking-widest mb-2">Confirmar Asistencia</h4>
            <p className="text-xs md:text-sm text-slate-750 text-center mb-8 px-4 font-bold leading-relaxed">
              Por favor confirmen su asistencia antes del 1 de Julio para esperarlos con mucho amor.
            </p>

            <AnimatePresence mode="wait">
              {!submitSuccess ? (
                <motion.form
                  key="form-view"
                  onSubmit={handleRsvpSubmit}
                  className="space-y-4"
                >
                  {/* Assist / Decline radio buttons with adorable 3D selector styles */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <button
                      type="button"
                      onClick={() => setFormStatus('confirmed')}
                      className={`py-3.5 px-4 text-sm md:text-base font-black rounded-xl transition-all flex justify-center items-center gap-1.5 cursor-pointer uppercase ${
                        formStatus === 'confirmed'
                          ? 'bg-[#22c55e] text-white border-2 border-[#14532d] shadow-[0_4px_0px_#15803d,0_6px_10px_rgba(0,0,0,0.15)] translate-y-[-2px]'
                          : 'bg-white/60 text-slate-800 border-2 border-slate-300 hover:bg-white/80 font-bold shadow-xs'
                      }`}
                    >
                      Sí Asistiré
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormStatus('declined')}
                      className={`py-3.5 px-4 text-sm md:text-base font-black rounded-xl transition-all flex justify-center items-center gap-1.5 cursor-pointer uppercase ${
                        formStatus === 'declined'
                          ? 'bg-[#ef4444] text-white border-2 border-[#7f1d1d] shadow-[0_4px_0px_#b91c1c,0_6px_10px_rgba(0,0,0,0.15)] translate-y-[-2px]'
                          : 'bg-white/60 text-slate-800 border-2 border-slate-300 hover:bg-white/80 font-bold shadow-xs'
                      }`}
                    >
                      No Podré
                    </button>
                  </div>

                  {/* Name field */}
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Escribe tu nombre completo"
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      className="w-full p-4 text-sm md:text-base bg-white border-2 border-slate-250 rounded-xl focus:outline-none focus:border-cyan-500 text-slate-800 font-semibold placeholder-slate-450 shadow-xs"
                    />
                  </div>

                  {/* Companions (only if confirmed) */}
                  {formStatus === 'confirmed' && (
                    <div className="flex items-center justify-between p-4 bg-white/70 border-2 border-slate-250 rounded-xl shadow-xs">
                      <span className="text-sm font-bold text-slate-800">Invitados adicionales (Pax)</span>
                      
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setFormCompanions(Math.max(0, formCompanions - 1))}
                          className="w-9 h-9 bg-slate-100 border-2 border-slate-300 hover:bg-slate-200 rounded-lg flex items-center justify-center font-black text-base text-slate-800 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-mono font-black text-sm text-slate-900">{formCompanions}</span>
                        <button
                          type="button"
                          onClick={() => setFormCompanions(Math.min(5, formCompanions + 1))}
                          className="w-9 h-9 bg-slate-100 border-2 border-slate-300 hover:bg-slate-200 rounded-lg flex items-center justify-center font-black text-base text-slate-800 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Message field */}
                  <div>
                    <textarea
                      placeholder="Dedícale un lindo mensaje al bebé... (Opcional)"
                      value={formMessage}
                      onChange={e => setFormMessage(e.target.value)}
                      className="w-full p-4 text-sm md:text-base bg-white border-2 border-slate-250 rounded-xl h-24 focus:outline-none focus:border-cyan-500 text-slate-800 font-bold placeholder-slate-455 shadow-xs"
                    />
                  </div>

                  {/* WhatsApp confirmation button with solid, high contrast background */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:translate-y-[2px] transition-all rounded-full uppercase tracking-wider text-white font-extrabold text-base md:text-lg flex items-center justify-center gap-3 w-full cursor-pointer disabled:opacity-50 border-2 border-emerald-700 shadow-[0_6px_16px_rgba(16,185,129,0.35)]"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center shadow-md shrink-0 animate-bounce" style={{ animationDuration: '3s' }}>
                      <Send className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-black text-white">
                      {isSubmitting ? 'Procesando...' : 'Confirmar por WhatsApp'}
                    </span>
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 text-center bg-emerald-50 border-2 border-emerald-200 rounded-xl flex flex-col items-center shadow-xs"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2 border border-emerald-200">
                    <Check className="w-5 h-5 font-bold" />
                  </div>
                  <h5 className="font-serif font-bold text-emerald-900 text-sm mb-1">¡Confirmación Registrada!</h5>
                  <p className="text-[10px] text-emerald-850 mb-4 max-w-[280px] font-bold leading-relaxed">
                    Tu confirmación ha sido guardada localmente y se enviará la plantilla formateada a WhatsApp...
                  </p>
                  <button
                    type="button"
                    onClick={resetRsvpForm}
                    className="px-4 py-1.5 bg-white border border-emerald-300 text-emerald-700 font-bold text-[10px] rounded-lg transition-colors cursor-pointer hover:bg-emerald-50"
                  >
                    Responder otra vez
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
      </div>

      {/* Dynamic Background Rocket flying across the outer layout as scrolling occurs */}
      <img
        ref={bgRocketRef}
        src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1780848244/cohete-space_dixaao.png"
        alt="Cohete de fondo"
        className="absolute w-12 h-12 md:w-16 md:h-16 opacity-100 pointer-events-none z-10 filter drop-shadow-lg scale-x-[-1] select-none"
        style={{ top: '2%', left: '12%', transformOrigin: 'center center' }}
        referrerPolicy="no-referrer"
      />
      </div>

      {/* FOOTER SYSTEM LABEL */}
      <span className="text-sm md:text-base font-mono text-sky-400 z-10 font-bold mb-6 text-center"> {details.babyName} Baby Shower • Hecho con Amor 🪐 </span>
    </div>
  );
}
