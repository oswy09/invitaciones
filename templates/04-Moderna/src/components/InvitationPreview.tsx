import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Clock, Calendar, Gift, Copy, Check, Music, Volume2, VolumeX,
  Sparkles, Heart, Users, MessageSquare, GlassWater, ChevronDown, Landmark,
  ExternalLink
} from 'lucide-react';
import { InvitationData, ColorTheme, RSVPResponse, GuestbookSignature } from '../types';
import FloralCorners from './FloralCorners';
import CoupleIllustration from './CoupleIllustration';

const strokeDrawVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: 'spring', duration: 2.2, bounce: 0, delay: 0.1 },
      opacity: { duration: 0.4, delay: 0.1 }
    }
  }
};

interface InvitationPreviewProps {
  data: InvitationData;
  theme: ColorTheme;
  fontHeading: string;
  fontBody: string;
  fontSerif: string;
  isInsidePhoneFrame?: boolean;
  guestName?: string;
}

export default function InvitationPreview({
  data,
  theme,
  fontHeading,
  fontBody,
  fontSerif,
  isInsidePhoneFrame = false,
  guestName = ''
}: InvitationPreviewProps) {
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // RSVP Form state
  const [rsvpName, setRsvpName] = useState('');
  const [isAttending, setIsAttending] = useState<boolean | null>(null);
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [dietary, setDietary] = useState('');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Guestbook state
  const [guestbookName, setGuestbookName] = useState('');
  const [guestbookMessage, setGuestbookMessage] = useState('');
  const [guestbookList, setGuestbookList] = useState<GuestbookSignature[]>([]);
  const [messageSubmitted, setMessageSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Map state
  const [activeMap, setActiveMap] = useState<{ title: string; address: string } | null>(null);

  // UI state
  const [copiedText, setCopiedText] = useState<'clabe' | 'account' | null>(null);

  // Prefill name from Envelope
  useEffect(() => {
    if (guestName) {
      setRsvpName(guestName);
      setGuestbookName(guestName);
    }
  }, [guestName]);

  // Setup audio on source changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(data.musicUrl);
    audio.loop = true;
    audioRef.current = audio;
    
    // Automatically play if possible
    if (isPlaying) {
      audio.play().catch(err => {
        console.log('Audio autoplay prevented, waiting for click:', err);
        setIsPlaying(false);
      });
    }

    return () => {
      audio.pause();
    };
  }, [data.musicUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      setIsPlaying(true);
    }
  };

  // Start playing automatically once preview loads (after envelope is opened)
  useEffect(() => {
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => {
        // Safe check for browser blocker
        setIsPlaying(false);
      });
    }
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  // Countdown calculation
  useEffect(() => {
    const targetDate = new Date(`${data.ceremonyDate}T${data.ceremonyTime.includes('AM') ? data.ceremonyTime.replace(' AM', '') : data.ceremonyTime.replace(' PM', '')}:00`);
    
    const calculateTime = () => {
      const difference = +targetDate - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [data.ceremonyDate, data.ceremonyTime]);

  // Load RSVP and Guestbook items
  const reloadGuestbook = () => {
    try {
      const stored = localStorage.getItem('wedding_guestbook_signatures');
      if (stored) {
        const parsed = JSON.parse(stored) as GuestbookSignature[];
        // Filter by current wedding ID
        setGuestbookList(parsed);
      } else {
        // Initial mock well wishes for richness
        const initialSigs: GuestbookSignature[] = [
          {
            id: 'mock_1',
            guestName: 'Tía María & Tío Carlos',
            message: '¡Muchas felicidades chicos! Que Dios guíe su nuevo camino juntos, los queremos mucho y estamos ansiosos por compartir este día con ustedes.',
            createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
          },
          {
            id: 'mock_2',
            guestName: 'Sofía Romero',
            message: 'La pareja más hermosa. Que su vida de casados esté repleta de risas, paciencia y un amor inquebrantable. ¡Que viva el amor!',
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
          }
        ];
        localStorage.setItem('wedding_guestbook_signatures', JSON.stringify(initialSigs));
        setGuestbookList(initialSigs);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    reloadGuestbook();
    // Listening for localStorage updates across components
    window.addEventListener('storage', reloadGuestbook);
    return () => window.removeEventListener('storage', reloadGuestbook);
  }, []);

  // Form Submission
  const handleRSVPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName || isAttending === null) return;

    const newRSVP: RSVPResponse = {
      id: `rsvp_${Date.now()}`,
      guestName: rsvpName,
      isAttending,
      adultCount: isAttending ? adultCount : 0,
      childCount: isAttending ? childCount : 0,
      dietaryRestrictions: dietary,
      message: rsvpMessage,
      submittedAt: new Date().toISOString()
    };

    try {
      const stored = localStorage.getItem('wedding_rsvp_responses') || '[]';
      const parsed = JSON.parse(stored) as RSVPResponse[];
      parsed.push(newRSVP);
      localStorage.setItem('wedding_rsvp_responses', JSON.stringify(parsed));
      
      // Dispatch storage event to notify parent (editor panel)
      window.dispatchEvent(new Event('storage'));
      
      setRsvpSubmitted(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestbookName || !guestbookMessage) return;

    const newSignature: GuestbookSignature = {
      id: `sig_${Date.now()}`,
      guestName: guestbookName,
      message: guestbookMessage,
      createdAt: new Date().toISOString()
    };

    try {
      const stored = localStorage.getItem('wedding_guestbook_signatures') || '[]';
      const parsed = JSON.parse(stored) as GuestbookSignature[];
      parsed.unshift(newSignature);
      localStorage.setItem('wedding_guestbook_signatures', JSON.stringify(parsed));
      
      // Notify components
      window.dispatchEvent(new Event('storage'));
      setGuestbookList(parsed);
      
      setGuestbookName('');
      setGuestbookMessage('');
      setMessageSubmitted(true);
      setTimeout(() => setMessageSubmitted(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const copyToClipboard = (text: string, type: 'clabe' | 'account') => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Date parsing for visual banner
  const parseDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length !== 3) return { day: '10', month: 'DICIEMBRE', year: '2026', weekday: 'DOMINGO' };
      const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      
      const weekdayName = date.toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase();
      const monthName = date.toLocaleDateString('es-ES', { month: 'long' }).toUpperCase();
      const dayNum = parts[2];
      const yearNum = parts[0];

      return {
        weekday: weekdayName,
        day: dayNum,
        month: monthName,
        year: yearNum
      };
    } catch (e) {
      return { day: '10', month: 'DICIEMBRE', year: '2026', weekday: 'DOMINGO' };
    }
  };

  const weddingDateInfo = parseDate(data.ceremonyDate);
  const displayPhrase = (data.phrase || '').trim().toLowerCase() === 'please join us as we celebrate our marriage'
    ? 'Acompáñanos a celebrar nuestro matrimonio'
    : data.phrase;

  return (
    <div
      className={`relative w-full h-full overflow-y-auto overflow-x-hidden marble-overlay text-stone-800 ${fontBody}`}
      style={{
        backgroundColor: theme.secondary,
        backgroundAttachment: 'local',
      }}
    >
      {/* Floating Sparkles in Background */}
      <div className="absolute inset-0 pointer-events-none opacity-80 overflow-hidden">
        {[...Array(18)].map((_, i) => (
          <div
            key={`bg-sparkle-${i}`}
            className="gold-dust absolute"
            style={{
              width: `${Math.random() * 5 + 3}px`,
              height: `${Math.random() * 5 + 3}px`,
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${Math.random() * 5 + 6}s`,
              boxShadow: '0 0 8px rgba(140, 102, 45, 0.7), 0 0 16px rgba(92, 64, 21, 0.4)',
              background: 'radial-gradient(circle, #b8860b 0%, #a0783a 65%, #5c4015 100%)',
            }}
          />
        ))}
      </div>

      {/* Floating Music Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={togglePlay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer border border-stone-200/40"
          style={{
            background: `radial-gradient(circle, ${theme.primary} 0%, ${theme.buttonHover} 100%)`,
            color: '#ffffff'
          }}
        >
          {/* Audio wave pulse */}
          {isPlaying && (
            <span className="absolute inset-0 rounded-full border border-[#c4a47c] animate-ping opacity-60" />
          )}
          {isPlaying ? <Volume2 size={20} className="text-[#ffffff]" /> : <VolumeX size={20} className="text-[#ffffff]/60" />}
        </motion.button>
      </div>

      {/* ==================== 1. COVER SECTION ==================== */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center pt-4 px-4 pb-0 md:pt-8 md:px-8 md:pb-0 overflow-hidden">
        {/* Flower Borders Corner framing */}
        <FloralCorners style={theme.floralStyle} accentColor={theme.accent} />

        {/* Elegant Centered Main Card */}
        <div 
          className={theme.id === 'natural_tones' 
            ? "bg-white w-full max-w-[440px] md:max-w-xl rounded-lg border border-stone-200/40 shadow-2xl py-10 px-6 md:py-14 md:px-12 relative flex flex-col items-center justify-center h-auto my-6 z-20"
            : "w-full max-w-lg flex flex-col items-center justify-center py-6 z-20"
          }
        >
          {theme.id === 'natural_tones' && (
            <>
              {/* Corner Ornaments relative to Card */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 pointer-events-none opacity-40" style={{ borderColor: theme.accent }} />
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 pointer-events-none opacity-40" style={{ borderColor: theme.accent }} />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 pointer-events-none opacity-40" style={{ borderColor: theme.accent }} />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 pointer-events-none opacity-40" style={{ borderColor: theme.accent }} />
            </>
          )}

          {/* Elegant top tiny banner */}
          <div className="z-20 flex flex-col items-center">
            <motion.p
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-[10px] md:text-xs tracking-[0.3em] font-semibold uppercase`}
              style={{ color: theme.textLight }}
            >
              {displayPhrase}
            </motion.p>
            
            <div className="mx-auto my-4 w-16 h-[1px]" style={{ backgroundColor: theme.accent + '40' }} />
          </div>

          {/* BRIDE & GROOM CALLIGRAPHIC NAMES */}
          <div className="my-2 z-20">
            <motion.h1
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className={`text-4xl md:text-5xl lg:text-6xl leading-tight px-4 filter drop-shadow-sm ${fontHeading}`}
              style={{ color: theme.textDark }}
            >
              {data.brideName}
              {theme.id === 'natural_tones' ? (
                <span className="block text-2xl md:text-3xl my-2 font-georgia italic font-light" style={{ color: theme.accent }}>&</span>
              ) : (
                <span className="block text-2xl md:text-3xl my-2 font-serif font-light text-stone-500 italic">and</span>
              )}
              {data.groomName}
            </motion.h1>
          </div>

          {theme.id !== 'natural_tones' && (
            <div className="mx-auto my-4" style={{ width: '60px', height: '1px', backgroundColor: theme.accent }} />
          )}

          {/* BEAUTIFUL EDITORIAL PORTRAIT COVER IMAGE OF THE COUPLE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.2 }}
            className="my-6 relative w-56 md:w-64 aspect-[4/5] rounded-[32px] overflow-hidden shadow-xl z-20 border-2 p-1 bg-white"
            style={{ borderColor: theme.accent + '35' }}
          >
            <div className="relative w-full h-full rounded-[26px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800"
                alt="Nuestros Momentos - Pareja de novios"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Color-grade and soft ambient gradient matching the active theme color */}
              <div 
                className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-75 mix-blend-multiply pointer-events-none"
                style={{ 
                  background: `linear-gradient(to top, ${theme.primary} 0%, ${theme.primary}40 40%, transparent 80%)` 
                }}
              />
              <div 
                className="absolute inset-0 opacity-15 mix-blend-color pointer-events-none"
                style={{ backgroundColor: theme.primary }}
              />
              {/* Subtle elegant inner double frame */}
              <div className="absolute inset-2 border border-white/40 rounded-[20px] pointer-events-none z-10" />
              <div className="absolute inset-2.5 border border-white/25 rounded-[18px] pointer-events-none z-10" />
            </div>
          </motion.div>

          {/* DATE & DETAILS FOOTER */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="w-full max-w-sm z-20 mt-2 flex flex-col items-center"
          >
            {/* Highly Eye-Catching Custom Date Line with Monogram Circular Seal */}
            <div className="w-full max-w-xs flex flex-col items-center justify-center my-5 relative">
              <div className="w-full h-[1px] opacity-25" style={{ backgroundColor: theme.accent }} />
              
              <div className="flex items-center justify-between w-full py-2 px-1 z-10 gap-2">
                {/* Left side: Weekday */}
                <div className="flex-1 text-right">
                  <span className="text-[10px] md:text-xs tracking-[0.2em] font-bold block uppercase opacity-85" style={{ color: theme.textLight }}>
                    {weddingDateInfo.weekday}
                  </span>
                </div>

                {/* Center circle seal: Day */}
                <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
                  <div className="absolute inset-0 rounded-full border border-dashed opacity-35 animate-[spin_60s_linear_infinite]" style={{ borderColor: theme.accent }} />
                  <div className="absolute inset-1 rounded-full border border-double bg-white shadow-sm flex items-center justify-center" style={{ borderColor: theme.accent + '80', borderWidth: '3px' }}>
                    <span className="text-2xl md:text-3xl font-extrabold tracking-tight font-wedding-heading" style={{ color: theme.primary }}>
                      {weddingDateInfo.day}
                    </span>
                  </div>
                </div>

                {/* Right side: Month & Year */}
                <div className="flex-1 text-left">
                  <span className="text-[10px] md:text-xs tracking-[0.15em] font-bold block uppercase" style={{ color: theme.textDark }}>
                    {weddingDateInfo.month}
                  </span>
                  <span className="text-[9px] md:text-[10px] tracking-[0.2em] font-semibold block uppercase opacity-60 mt-0.5" style={{ color: theme.textLight }}>
                    {weddingDateInfo.year}
                  </span>
                </div>
              </div>

              <div className="w-full h-[1px] opacity-25" style={{ backgroundColor: theme.accent }} />
            </div>

            <div className="text-center max-w-[320px] leading-relaxed">
              <p className="text-[10px] md:text-xs tracking-wider font-bold mt-2 uppercase text-stone-700">
                CEREMONIA Y RECEPCIÓN
              </p>
              <p className="text-xs text-stone-500 mt-1">
                {data.ceremonyTime.toLowerCase()}
              </p>
              <p className="text-xs italic mt-1 font-serif text-stone-500">
                {data.ceremonyAddress}
              </p>
            </div>

            {theme.id === 'natural_tones' ? (
              <div 
                onClick={() => {
                  const rsvpSection = document.getElementById('rsvp-section');
                  if (rsvpSection) {
                    rsvpSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-[10px] uppercase tracking-[0.15em] py-3 px-8 rounded-full font-helvetica font-bold mt-6 text-white transition-opacity shadow-sm hover:opacity-90 select-none cursor-pointer"
                style={{ backgroundColor: theme.primary }}
              >
                Confirmar Asistencia
              </div>
            ) : (
              <p className={`text-lg md:text-xl mt-5 font-light tracking-wide ${fontHeading}`} style={{ color: theme.primary }}>
                Recepción a continuación
              </p>
            )}

            {/* Pulse Scroll Arrow */}
            <div className="mt-6 animate-bounce text-stone-400">
              <ChevronDown size={20} />
            </div>
          </motion.div>
        </div>

        {/* Foreground Floating Sparkles on Cover */}
        <div className="absolute inset-0 pointer-events-none opacity-85 overflow-hidden z-25">
          {[...Array(12)].map((_, i) => (
            <div
              key={`fg-sparkle-${i}`}
              className="gold-dust absolute"
              style={{
                width: `${Math.random() * 5 + 4}px`,
                height: `${Math.random() * 5 + 4}px`,
                left: `${Math.random() * 100}%`,
                bottom: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 5 + 7}s`,
                boxShadow: '0 0 8px rgba(140, 102, 45, 0.7), 0 0 16px rgba(92, 64, 21, 0.4)',
                background: 'radial-gradient(circle, #b8860b 0%, #a0783a 65%, #5c4015 100%)',
              }}
            />
          ))}
        </div>

        {/* Decorative Large Flower Divider glued to the bottom edge of the cover section */}
        <div className="w-full flex justify-center overflow-hidden relative z-30 mt-auto">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
            className="w-full max-w-lg md:max-w-2xl px-6 h-36 md:h-48 flex items-center justify-center overflow-hidden"
          >
            <img
              src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1782264289/flower-boda_fxdod7.svg"
              alt="Ornamental Flower Big"
              className="w-full h-full object-contain mix-blend-multiply filter contrast-[1.02] brightness-[0.99] translate-y-[20%]"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* ==================== 2. COUNTDOWN SECTION ==================== */}
      {data.showCountdown && (
        <section className="relative px-6 py-16 bg-white/40 border-t border-b border-stone-200/40 text-center flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-stone-100/10 pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <p className="text-[10px] tracking-[0.25em] font-wedding-sans uppercase text-stone-500 mb-6">
              FALTAN SOLO...
            </p>
            
            <div className="flex gap-4 md:gap-6 justify-center">
              {[
                { label: 'DÍAS', value: timeLeft.days },
                { label: 'HORAS', value: timeLeft.hours },
                { label: 'MINUTOS', value: timeLeft.minutes },
                { label: 'SEGUNDOS', value: timeLeft.seconds }
              ].map((unit, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full flex flex-col items-center justify-center bg-white border border-[#c4a47c]/20 shadow-sm"
                    style={{ color: theme.primary }}
                  >
                    <span className="text-xl md:text-2xl font-bold font-wedding-sans leading-none">{unit.value}</span>
                    <span className="text-[9px] tracking-wider text-stone-400 mt-1 uppercase">{unit.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <Heart size={16} className="text-red-500/60 fill-current mt-8 animate-pulse pulse-custom" />
          </motion.div>
        </section>
      )}

      {/* ==================== 3. WELCOME & FAMILY SECTION ==================== */}
      {data.showWelcome && (
        <section className="relative px-6 py-20 text-center max-w-xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center w-full"
          >
            <p className="text-[11px] tracking-[0.2em] font-wedding-sans font-bold text-stone-400 mb-6 uppercase">
              NUESTRA UNIÓN
            </p>

            <p className="text-sm md:text-base leading-relaxed text-stone-600 font-serif italic max-w-md px-4">
              "{data.welcomeText}"
            </p>

            <div className="w-12 h-[1px] bg-[#c4a47c]/30 my-8" />

            {/* Tradicionales Nombres de Padres */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 text-center mt-4">
              <div>
                <p className="text-[10px] tracking-widest text-stone-400 uppercase font-wedding-sans font-semibold mb-2">
                  PADRES DE LA NOVIA
                </p>
                <p className="text-sm font-wedding-heading font-medium" style={{ color: theme.textDark }}>
                  {data.brideParents || 'Nombres de los padres'}
                </p>
              </div>
              
              <div>
                <p className="text-[10px] tracking-widest text-stone-400 uppercase font-wedding-sans font-semibold mb-2">
                  PADRES DEL NOVIO
                </p>
                <p className="text-sm font-wedding-heading font-medium" style={{ color: theme.textDark }}>
                  {data.groomParents || 'Nombres de los padres'}
                </p>
              </div>
            </div>

            {data.godparents && (
              <div className="mt-8 text-center">
                <p className="text-[10px] tracking-widest text-stone-400 uppercase font-wedding-sans font-semibold mb-2">
                  NUESTROS PADRINOS DE HONOR
                </p>
                <p className="text-sm font-wedding-heading font-medium italic" style={{ color: theme.textDark }}>
                  {data.godparents}
                </p>
              </div>
            )}
          </motion.div>
        </section>
      )}

      {/* ==================== 4. CEREMONY & RECEPTION SECTION ==================== */}
      <section className="relative px-4 py-16 bg-white/30 border-t border-stone-200/30">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
          
          {/* Ceremony Card */}
          {data.showCeremony && (
            <motion.div
              whileHover={{ y: -4 }}
              className="relative p-8 rounded-2xl bg-white border border-stone-150 shadow-sm flex flex-col items-center text-center overflow-hidden"
            >
              {/* Soft decorative visual background badge */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-stone-50 rounded-full -mr-8 -mt-8 opacity-50 pointer-events-none" />

              <div className="p-3 rounded-full mb-4 flex items-center justify-center bg-stone-50 border border-stone-100 shadow-inner" style={{ color: theme.primary }}>
                <motion.svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="w-9 h-9"
                >
                  {/* Calendar board */}
                  <motion.rect
                    x="3"
                    y="4"
                    width="18"
                    height="16"
                    rx="2"
                    ry="2"
                    variants={strokeDrawVariants}
                  />
                  {/* Left hanger */}
                  <motion.path
                    d="M8 2v4"
                    variants={strokeDrawVariants}
                  />
                  {/* Right hanger */}
                  <motion.path
                    d="M16 2v4"
                    variants={strokeDrawVariants}
                  />
                  {/* Line under header */}
                  <motion.path
                    d="M3 10h18"
                    variants={strokeDrawVariants}
                  />
                  {/* Central double rings inside calendar */}
                  <motion.path
                    d="M9.5 15.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                    variants={strokeDrawVariants}
                  />
                  <motion.path
                    d="M12.5 15.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                    variants={strokeDrawVariants}
                  />
                </motion.svg>
              </div>

              <h3 className={`text-xl font-bold font-wedding-heading tracking-wide mb-2`} style={{ color: theme.textDark }}>
                CEREMONIA RELIGIOSA
              </h3>

              <div className="w-10 h-[1.5px] bg-[#c4a47c]/40 my-3" />

              <p className="text-sm font-semibold mb-1" style={{ color: theme.primary }}>
                {data.ceremonyName}
              </p>
              
              <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                <Clock size={13} />
                <span>{data.ceremonyTime}</span>
              </div>
              
              <p className="text-xs text-stone-500 mb-6 font-serif italic">
                {data.ceremonyAddress}
              </p>

              <div className="mt-auto flex flex-col sm:flex-row gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setActiveMap({ title: data.ceremonyName, address: data.ceremonyAddress })}
                  className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold py-2.5 px-4 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-600 transition cursor-pointer"
                >
                  <MapPin size={14} />
                  Ver Mapa
                </button>
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda+de+${data.brideName}+y+${data.groomName}&dates=${data.ceremonyDate.replace(/-/g, '')}T150000Z/${data.ceremonyDate.replace(/-/g, '')}T180000Z&details=Acompáñanos+en+nuestro+gran+día.&location=${encodeURIComponent(data.ceremonyAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold py-2.5 px-4 rounded-full text-white hover:opacity-95 transition"
                  style={{ backgroundColor: theme.primary }}
                >
                  Agendar
                </a>
              </div>
            </motion.div>
          )}

          {/* Reception Card */}
          {data.showReception && (
            <motion.div
              whileHover={{ y: -4 }}
              className="relative p-8 rounded-2xl bg-white border border-stone-150 shadow-sm flex flex-col items-center text-center overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-stone-50 rounded-full -mr-8 -mt-8 opacity-50 pointer-events-none" />

              <div className="p-3 rounded-full mb-4 flex items-center justify-center bg-stone-50 border border-stone-100 shadow-inner" style={{ color: theme.primary }}>
                <motion.svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="w-9 h-9"
                >
                  {/* Left champagne glass clinking */}
                  <motion.path
                    d="M8 12c0 2.2-1.3 4-2.8 4S2.4 14.2 2.4 12V5h5.6v7z"
                    variants={strokeDrawVariants}
                  />
                  <motion.path
                    d="M5.2 16v5M3 21h4.4"
                    variants={strokeDrawVariants}
                  />
                  
                  {/* Right champagne glass clinking (mirrored and slightly tilted) */}
                  <motion.path
                    d="M16 12c0 2.2 1.3 4 2.8 4s2.8-1.8 2.8-4V5h-5.6v7z"
                    variants={strokeDrawVariants}
                  />
                  <motion.path
                    d="M18.8 16v5M16.6 21h4.4"
                    variants={strokeDrawVariants}
                  />

                  {/* Bubbles or clinking sparkle lines in center */}
                  <motion.path
                    d="M12 3v3M9.5 4.5l1.5 1.5M14.5 4.5L13 6"
                    variants={strokeDrawVariants}
                  />
                </motion.svg>
              </div>

              <h3 className={`text-xl font-bold font-wedding-heading tracking-wide mb-2`} style={{ color: theme.textDark }}>
                RECEPCIÓN DE BODAS
              </h3>

              <div className="w-10 h-[1.5px] bg-[#c4a47c]/40 my-3" />

              <p className="text-sm font-semibold mb-1" style={{ color: theme.primary }}>
                {data.receptionName}
              </p>
              
              <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                <Clock size={13} />
                <span>{data.receptionTime}</span>
              </div>
              
              <p className="text-xs text-stone-500 mb-6 font-serif italic">
                {data.receptionAddress}
              </p>

              <div className="mt-auto flex flex-col sm:flex-row gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setActiveMap({ title: data.receptionName, address: data.receptionAddress })}
                  className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold py-2.5 px-4 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-600 transition cursor-pointer"
                >
                  <MapPin size={14} />
                  Ver Mapa
                </button>
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Recepción:+Boda+de+${data.brideName}+y+${data.groomName}&dates=${data.receptionDate.replace(/-/g, '')}T200000Z/${data.receptionDate.replace(/-/g, '')}T230000Z&details=Recepción+y+banquete.&location=${encodeURIComponent(data.receptionAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold py-2.5 px-4 rounded-full text-white hover:opacity-95 transition"
                  style={{ backgroundColor: theme.primary }}
                >
                  Agendar
                </a>
              </div>
            </motion.div>
          )}

        </div>
      </section>

      {/* ==================== 5. DRESS CODE SECTION ==================== */}
      {data.showDressCode && (
        <section className="relative px-6 py-16 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <p className="text-[10px] tracking-[0.25em] font-wedding-sans font-bold text-stone-400 mb-3 uppercase">
              CÓDIGO DE VESTIMENTA
            </p>
            
            <h3 className={`text-2xl font-wedding-heading mb-4`} style={{ color: theme.textDark }}>
              {data.dressCodeType === 'formal' && 'Formal de Gala'}
              {data.dressCodeType === 'formal_guayabera' && 'Formal Guayabera'}
              {data.dressCodeType === 'cocktail' && 'Cocktail'}
              {data.dressCodeType === 'casual' && 'Semicasual / Casual'}
            </h3>

            <div className="w-16 h-[1px] bg-[#c4a47c]/30 mb-6" />

            {/* Attire visuals representation */}
            <div className="flex gap-10 items-center justify-center mb-6">
              {/* Suit SVG Icon */}
              <div className="flex flex-col items-center gap-2 text-stone-500">
                <svg className="w-12 h-12 text-stone-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.3l6 3.7v3L12 14.7 6 11V8l6-3.7z M12 11.2l-4-2.5V15l4 2.5V11.2zm4-2.5l-4 2.5V17.5l4-2.5V8.7z" opacity="0.1" />
                  {/* Custom drawn tuxedo */}
                  <path d="M6 4h12l-2 8h-8z" opacity="0.1" />
                  <path d="M6 4l4 10h4l4-10H6zm6 2l1.5-2H14l-2 3-2-3h.5L12 6z" stroke="currentColor" strokeWidth="1" fill="none" />
                  <path d="M7 6v12h10V6L12 12 7 6z" stroke="currentColor" strokeWidth="1" fill="none" />
                </svg>
                <span className="text-[10px] tracking-widest uppercase">Caballeros</span>
              </div>

              {/* Dress SVG Icon */}
              <div className="flex flex-col items-center gap-2 text-stone-500">
                <svg className="w-12 h-12 text-stone-700" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                  <path d="M8 4l2 6-3 10h10l-3-10 2-6H8z" />
                  <path d="M12 4v6 M10 14h4" />
                  <circle cx="12" cy="17" r="1" fill="currentColor" />
                  <circle cx="12" cy="15" r="1" fill="currentColor" />
                </svg>
                <span className="text-[10px] tracking-widest uppercase">Damas</span>
              </div>
            </div>

            <p className="text-xs text-stone-600 font-serif italic max-w-sm leading-relaxed">
              {data.dressCodeText}
            </p>
          </motion.div>
        </section>
      )}

      {/* ==================== 6. GIFT TABLE SECTION ==================== */}
      {data.showGiftTable && (
        <section className="relative px-6 py-20 bg-white/40 border-t border-b border-stone-200/40 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center w-full max-w-lg"
          >
            <div className="p-3.5 rounded-full mb-4 mx-auto" style={{ backgroundColor: theme.secondary, color: theme.primary }}>
              <Gift size={24} />
            </div>

            <h3 className="text-2xl font-wedding-heading tracking-wide mb-3" style={{ color: theme.textDark }}>
              MESA DE REGALOS
            </h3>

            <p className="text-xs text-stone-600 font-serif italic max-w-md leading-relaxed mb-8 px-4 mx-auto">
              {data.giftTableText}
            </p>
          </motion.div>

          <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-6 px-2">
            
            {/* Gift Registries (Amazon / Liverpool) */}
            {(data.giftRegistryAmazon || data.giftRegistryLiverpool) && (
              <div className="p-6 bg-white border border-stone-150 rounded-2xl flex flex-col items-center justify-center">
                <p className="text-[10px] tracking-widest text-stone-400 font-wedding-sans uppercase mb-4">
                  TIENDAS Y MESAS
                </p>

                {data.giftRegistryAmazon && (
                  <div className="flex items-center justify-between w-full border-b border-stone-100 py-3 text-xs">
                    <span className="font-semibold text-stone-700">Amazon Wishlist</span>
                    <button
                      onClick={() => copyToClipboard(data.giftRegistryAmazon, 'account')}
                      className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100/50 rounded-full text-[10px] font-bold uppercase transition"
                    >
                      {copiedText === 'account' ? <Check size={11} /> : <Copy size={11} />}
                      Código: {data.giftRegistryAmazon}
                    </button>
                  </div>
                )}

                {data.giftRegistryLiverpool && (
                  <div className="flex items-center justify-between w-full py-3 text-xs">
                    <span className="font-semibold text-stone-700">Liverpool</span>
                    <button
                      onClick={() => copyToClipboard(data.giftRegistryLiverpool, 'account')}
                      className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100/50 rounded-full text-[10px] font-bold uppercase transition"
                    >
                      Código: {data.giftRegistryLiverpool}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Bank Transfers */}
            {(data.bankAccountNumber || data.clabe) && (
              <div className="p-6 bg-white border border-stone-150 rounded-2xl text-left">
                <div className="text-center mb-3">
                  <Landmark className="mx-auto text-stone-400" size={20} />
                  <p className="text-[10px] tracking-widest text-stone-400 font-wedding-sans uppercase mt-1">
                    TRANSFERENCIA BANCARIA
                  </p>
                </div>

                <div className="space-y-2.5 text-xs text-stone-600">
                  <div className="flex justify-between border-b border-stone-50 pb-1.5">
                    <span>Banco:</span>
                    <strong className="text-stone-800">{data.bankName || 'Bancomer'}</strong>
                  </div>
                  <div className="flex justify-between border-b border-stone-50 pb-1.5">
                    <span>Titular:</span>
                    <strong className="text-stone-800 text-right truncate max-w-[150px]">{data.bankAccountOwner || 'Nombres'}</strong>
                  </div>
                  
                  {data.bankAccountNumber && (
                    <div className="flex items-center justify-between border-b border-stone-50 pb-1.5">
                      <span>Cuenta:</span>
                      <button
                        onClick={() => copyToClipboard(data.bankAccountNumber, 'account')}
                        className="flex items-center gap-1 font-mono text-stone-800 hover:text-[#c4a47c] transition font-bold"
                        title="Copiar Cuenta"
                      >
                        {data.bankAccountNumber}
                        {copiedText === 'account' ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
                      </button>
                    </div>
                  )}

                  {data.clabe && (
                    <div className="flex items-center justify-between pb-1.5">
                      <span>CLABE:</span>
                      <button
                        onClick={() => copyToClipboard(data.clabe, 'clabe')}
                        className="flex items-center gap-1 font-mono text-stone-800 hover:text-[#c4a47c] transition font-bold"
                        title="Copiar CLABE"
                      >
                        {data.clabe}
                        {copiedText === 'clabe' ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </section>
      )}

      {/* ==================== 7. PHOTO GALLERY ==================== */}
      {data.showGallery && (
        <section className="relative px-6 py-20 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center w-full"
          >
            <p className="text-[10px] tracking-[0.3em] font-wedding-sans font-bold text-stone-400 mb-2 uppercase">
              NUESTROS MOMENTOS
            </p>
            <h2 className={`text-2xl md:text-3xl font-light mb-10 tracking-wide ${fontHeading}`} style={{ color: theme.textDark }}>
              Nuestra Historia en Fotografías
            </h2>

            <div className="max-w-2xl w-full grid grid-cols-2 sm:grid-cols-3 gap-6 px-2">
              {[
                { 
                  src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800', 
                  span: 'col-span-2 sm:col-span-2 aspect-[4/3] sm:aspect-video', 
                  caption: 'Donde comenzó nuestro siempre...', 
                  rotate: '-rotate-1 hover:rotate-0'
                },
                { 
                  src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800', 
                  span: 'col-span-1 aspect-[3/4] sm:aspect-auto sm:h-auto', 
                  caption: 'Risas y complicidad', 
                  rotate: 'rotate-2 hover:rotate-0'
                },
                { 
                  src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800', 
                  span: 'col-span-1 aspect-[3/4] sm:aspect-auto sm:h-auto', 
                  caption: 'Tus ojos, mi hogar', 
                  rotate: '-rotate-2 hover:rotate-0'
                },
                { 
                  src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800', 
                  span: 'col-span-2 sm:col-span-2 aspect-[4/3] sm:aspect-video', 
                  caption: 'Promesas de amor sincero', 
                  rotate: 'rotate-1 hover:rotate-0'
                }
              ].map((img, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03, zIndex: 30 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedImage(img.src)}
                  className={`relative bg-white p-3 pb-6 md:p-4 md:pb-8 rounded-md shadow-lg border border-stone-150/40 cursor-pointer transition-all duration-300 flex flex-col items-center ${img.span} ${img.rotate}`}
                >
                  {/* Image holder */}
                  <div className="w-full h-full overflow-hidden bg-stone-50 rounded-xs relative">
                    <img
                      src={img.src}
                      alt={img.caption}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {/* Subtle hover overlay matching the theme's tone */}
                    <div className="absolute inset-0 bg-stone-900/10 hover:bg-stone-900/0 transition duration-300" />
                  </div>

                  {/* Polaroid Caption */}
                  <p className="mt-3 font-serif italic text-stone-500 text-[11px] md:text-xs text-center font-light leading-none">
                    {img.caption}
                  </p>

                  {/* Corner tape/sticker look for fine-art detail */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-12 h-4 bg-stone-100/60 backdrop-blur-[1px] border border-stone-200/20 rotate-1 pointer-events-none opacity-40 shadow-[0_1px_2px_rgba(0,0,0,0.02)]" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* ==================== 8. RSVP FORM SECTION ==================== */}
      {data.showRSVP && (
        <section className="relative px-4 py-16 bg-white/45 border-t border-stone-200/40 text-center flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md border border-stone-150 text-left"
          >
            <div className="text-center mb-6">
              <span className="text-[10px] tracking-[0.25em] text-stone-400 font-wedding-sans uppercase">CONFIRMACIÓN</span>
              <h3 className="text-2xl font-wedding-heading mt-1" style={{ color: theme.textDark }}>
                ¿Nos acompañarás?
              </h3>
              <p className="text-xs text-stone-500 font-serif italic mt-1">
                Por favor, confirma tu asistencia antes del 30 de Noviembre
              </p>
              <div className="w-12 h-[1px] bg-[#c4a47c]/30 mx-auto my-3" />
            </div>

            <AnimatePresence mode="wait">
              {!rsvpSubmitted ? (
                <motion.form
                  key="rsvp-form"
                  onSubmit={handleRSVPSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Escribe tu nombre"
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      className="w-full text-xs text-stone-800 bg-stone-50 border border-stone-200 focus:border-[#c4a47c] focus:ring-1 focus:ring-[#c4a47c] px-3 py-2.5 rounded-lg outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 uppercase mb-2">
                      ¿Asistirás al gran día?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setIsAttending(true)}
                        className={`py-2.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition ${
                          isAttending === true
                            ? 'border-green-600 bg-green-50 text-green-800'
                            : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        Sí, con gusto
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAttending(false)}
                        className={`py-2.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition ${
                          isAttending === false
                            ? 'border-red-600 bg-red-50 text-red-800'
                            : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        No podré ir
                      </button>
                    </div>
                  </div>

                  {isAttending === true && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 pt-1"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1.5 tracking-wider">
                            Adultos (pases)
                          </label>
                          <div className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-xl p-1 h-11">
                            <button
                              type="button"
                              onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-stone-200/80 shadow-sm text-stone-700 hover:bg-stone-50 active:scale-95 transition text-lg font-semibold select-none"
                            >
                              −
                            </button>
                            <span className="text-sm font-bold text-stone-800 w-6 text-center">
                              {adultCount}
                            </span>
                            <button
                              type="button"
                              onClick={() => setAdultCount(Math.min(10, adultCount + 1))}
                              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-stone-200/80 shadow-sm text-stone-700 hover:bg-stone-50 active:scale-95 transition text-lg font-semibold select-none"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1.5 tracking-wider">
                            Niños (pases)
                          </label>
                          <div className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-xl p-1 h-11">
                            <button
                              type="button"
                              onClick={() => setChildCount(Math.max(0, childCount - 1))}
                              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-stone-200/80 shadow-sm text-stone-700 hover:bg-stone-50 active:scale-95 transition text-lg font-semibold select-none"
                            >
                              −
                            </button>
                            <span className="text-sm font-bold text-stone-800 w-6 text-center">
                              {childCount}
                            </span>
                            <button
                              type="button"
                              onClick={() => setChildCount(Math.min(10, childCount + 1))}
                              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-stone-200/80 shadow-sm text-stone-700 hover:bg-stone-50 active:scale-95 transition text-lg font-semibold select-none"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                          Alergias o Restricciones Alimenticias
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Vegetariano, alergia a mariscos..."
                          value={dietary}
                          onChange={(e) => setDietary(e.target.value)}
                          className="w-full text-xs text-stone-800 bg-stone-50 border border-stone-200 px-3 py-2 rounded-lg outline-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {isAttending !== null && (
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                        Mensaje o Bendición para los Novios
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Escríbeles un dulce mensaje..."
                        value={rsvpMessage}
                        onChange={(e) => setRsvpMessage(e.target.value)}
                        className="w-full text-xs text-stone-800 bg-stone-50 border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg outline-none"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:opacity-95 shadow transition cursor-pointer"
                    style={{ backgroundColor: theme.primary }}
                  >
                    Enviar Confirmación
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="rsvp-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-4"
                >
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full border border-green-200 flex items-center justify-center mx-auto shadow-inner">
                    <Check size={24} />
                  </div>
                  <h4 className="text-lg font-wedding-heading font-semibold text-stone-800">
                    ¡Confirmación Enviada!
                  </h4>
                  <p className="text-xs text-stone-500 font-serif italic max-w-xs mx-auto leading-relaxed">
                    Hemos recibido tus datos correctamente. Muchas gracias por confirmar tu cariño y asistencia en este gran evento.
                  </p>
                  <button
                    onClick={() => setRsvpSubmitted(false)}
                    className="text-[10px] text-stone-400 font-bold uppercase hover:text-stone-600 underline transition"
                  >
                    Modificar Respuestas
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>
      )}

      {/* ==================== 9. GUESTBOOK / WELL WISHES SECTION ==================== */}
      {data.showGuestbook && (
        <section className="relative px-4 py-16 text-center max-w-xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center w-full"
          >
            <div className="p-3 rounded-full mb-4 mx-auto" style={{ backgroundColor: theme.secondary, color: theme.accent }}>
              <MessageSquare size={22} />
            </div>

            <h3 className="text-2xl font-wedding-heading mb-2" style={{ color: theme.textDark }}>
              Libro de Firmas Digital
            </h3>
            <p className="text-xs text-stone-500 font-serif italic mb-8 max-w-sm mx-auto">
              Déjanos tus felicitaciones y buenos deseos en este muro de recuerdos
            </p>

            {/* Form to leave message */}
            <form onSubmit={handleGuestbookSubmit} className="w-full bg-white border border-stone-150 p-6 rounded-2xl text-left space-y-3 shadow-sm mb-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Tu Nombre"
                  value={guestbookName}
                  onChange={(e) => setGuestbookName(e.target.value)}
                  className="sm:col-span-1 text-xs text-stone-800 bg-stone-50 border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="Escribe tu bendición o deseo..."
                  value={guestbookMessage}
                  onChange={(e) => setGuestbookMessage(e.target.value)}
                  className="sm:col-span-2 text-xs text-stone-800 bg-stone-50 border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg outline-none"
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-2.5 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:opacity-95 transition cursor-pointer"
                style={{ backgroundColor: theme.primary }}
              >
                Firmar Libro
              </button>
              
              {messageSubmitted && (
                <p className="text-center text-[10px] font-semibold text-green-600 animate-pulse">
                  ¡Gracias por firmar nuestro libro de firmas!
                </p>
              )}
            </form>

            {/* Scrolling well wishes wall */}
            <div className="w-full max-h-80 overflow-y-auto space-y-3 px-2 text-left">
              {guestbookList.length === 0 ? (
                <p className="text-center text-xs text-stone-400 italic">Sé el primero en firmar el libro...</p>
              ) : (
                guestbookList.map((sig) => (
                  <div key={sig.id} className="p-4 bg-white border border-stone-100 rounded-xl shadow-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <strong className="text-xs font-semibold text-stone-700 font-wedding-heading">
                        {sig.guestName}
                      </strong>
                      <span className="text-[9px] text-stone-400">
                        {new Date(sig.createdAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 font-serif italic leading-relaxed">
                      "{sig.message}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </section>
      )}

      {/* ==================== 10. LUXURY FOOTER ==================== */}
      <footer className="relative bg-white/20 px-6 py-12 text-center border-t border-stone-200/20">
        <p className={`text-4xl text-stone-700 ${fontHeading}`}>
          {data.brideName} & {data.groomName}
        </p>
        <p className="text-[10px] tracking-[0.25em] font-wedding-sans text-stone-400 uppercase mt-3">
          ¡GRACIAS POR ACOMPAÑARNOS EN NUESTRO DÍA!
        </p>
        <div className="w-8 h-[1px] bg-[#c4a47c]/30 mx-auto my-4" />
        <Heart className="mx-auto text-red-500/40 fill-current pulse-custom" size={12} />
      </footer>

      {/* ==================== PHOTO LIGHTBOX DIALOG ==================== */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-stone-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/10 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Displayed Image */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[85vh] rounded-lg overflow-hidden border border-white/10 shadow-2xl bg-stone-900"
            >
              <img
                src={selectedImage}
                alt="Nuestros momentos alta resolución"
                className="max-w-full max-h-[80vh] object-contain mx-auto"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ==================== MAP LIGHTBOX DIALOG ==================== */}
      <AnimatePresence>
        {activeMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveMap(null)}
            className="fixed inset-0 bg-stone-950/85 backdrop-blur-md z-[60] flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-2xl border border-stone-200/60 shadow-2xl overflow-hidden flex flex-col cursor-default"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="font-wedding-heading font-bold text-stone-800 text-base md:text-lg">
                    {activeMap.title}
                  </h4>
                  <p className="text-[11px] md:text-xs text-stone-400 font-serif italic">
                    {activeMap.address}
                  </p>
                </div>
                <button
                  onClick={() => setActiveMap(null)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Map Iframe */}
              <div className="w-full aspect-[4/3] md:aspect-video bg-stone-100 relative">
                <iframe
                  title="Google Map Embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(activeMap.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Footer with external button as backup */}
              <div className="px-6 py-4 border-t border-stone-100 flex justify-end gap-3 bg-stone-50">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeMap.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold py-2 px-4 rounded-full bg-stone-800 hover:bg-stone-900 text-white transition"
                >
                  <span>Abrir en Google Maps</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
