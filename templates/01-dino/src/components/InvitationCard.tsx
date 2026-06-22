import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Calendar,
  Gift,
  Clock,
  Users,
  User,
  Check,
  Compass,
  Heart,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Music,
  Copy,
  CheckCheck,
  CalendarPlus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BabyShowerDetails, Guest } from "../types";
import { supabase } from "../lib/supabase";
import { useMuroDeseos } from "../hooks/useMuroDeseos";
import { useRsvp } from "../hooks/useRsvp";
import { useCountdown } from "../hooks/useCountdown";
import confetti from "canvas-confetti";
import BabyWordSoup from "./BabyWordSoup";
import ScrollReveal from "./ScrollReveal";
import BabyShowerMap from "./BabyShowerMap";

// Dynamic background audio path with beautiful boy song
const BACKGROUND_MUSIC_URL = "https://res.cloudinary.com/ddqbnr9vo/video/upload/v1779927259/BEAUTIFUL_BOY_JOHN_LENNON_fb85tn.mp3";

const BabyHangingClothes = () => {
  return (
    <div className="w-full max-w-xs sm:max-w-sm mx-auto h-28 relative select-none overflow-visible mb-6">
      <svg viewBox="0 0 320 100" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="ropeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#DFE7EF" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#DFE7EF" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="onesieBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A4C4DC" />
            <stop offset="100%" stopColor="#6C90B9" />
          </linearGradient>
          <linearGradient id="pantBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#89AFCD" />
            <stop offset="100%" stopColor="#4A5D6B" />
          </linearGradient>
          <linearGradient id="socksBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#CBE0EE" />
            <stop offset="100%" stopColor="#89AFCD" />
          </linearGradient>
        </defs>

        {/* Clothesline cable */}
        <path
          d="M 10,20 Q 160,35 310,20"
          fill="none"
          stroke="url(#ropeGrad)"
          strokeWidth="1.5"
          className="stroke-stone-300"
        />

        {/* ================= LEFT SOCKS ================= */}
        <motion.g
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "65px", originY: "21px" }}
        >
          {/* Peg 1 */}
          <rect x="63" y="18" width="3.5" height="9" rx="0.5" fill="#EADCC2" stroke="#D5C5A3" strokeWidth="0.5" />
          {/* Sock 1 */}
          <path
            d="M 65,26 L 65,37 C 65,41 61,44 56,44 C 52,44 50,41 50,37 L 50,26 Z"
            fill="url(#socksBlue)"
            stroke="#6C90B9"
            strokeWidth="0.75"
          />
          <path d="M 50,34 C 52,36 54,37 56,37" stroke="#FFF" strokeWidth="1" fill="none" opacity="0.6" />
          
          {/* Peg 2 */}
          <rect x="79" y="19" width="3.5" height="9" rx="0.5" fill="#EADCC2" stroke="#D5C5A3" strokeWidth="0.5" />
          {/* Sock 2 */}
          <path
            d="M 81,27 L 81,38 C 81,42 77,45 72,45 C 68,45 66,42 66,38 L 66,27 Z"
            fill="url(#socksBlue)"
            stroke="#6C90B9"
            strokeWidth="0.75"
          />
          <path d="M 66,35 C 68,37 70,38 72,38" stroke="#FFF" strokeWidth="1" fill="none" opacity="0.6" />
        </motion.g>

        {/* ================= ONESIE / BODYSUIT ================= */}
        <motion.g
          animate={{ rotate: [2.5, -2.5, 2.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "160px", originY: "24px" }}
        >
          {/* Clothespins */}
          <rect x="141" y="21" width="4" height="10" rx="0.5" fill="#EADCC2" stroke="#D5C5A3" strokeWidth="0.5" />
          <rect x="175" y="21" width="4" height="10" rx="0.5" fill="#EADCC2" stroke="#D5C5A3" strokeWidth="0.5" />

          {/* Bodysuit Body */}
          <path
            d="M 136,28 
               C 136,28 141,25 160,25 
               C 179,25 184,28 184,28 
               L 190,36 
               C 188,38 184,36 181,35 
               L 181,63 
               C 181,71 174,74 168,75 
               L 169,82 
               C 169,84 167,85 165,85 
               L 155,85 
               C 153,85 151,84 151,82
               L 152,75 
               C 146,74 139,71 139,63 
               L 139,35 
               C 136,36 132,38 130,36 
               Z"
            fill="url(#onesieBlue)"
            stroke="#4A5D6B"
            strokeWidth="1"
          />

          {/* Little shoulder ruffles styled like wings in reference image */}
          <path
            d="M 139,32 C 133,33 129,38 132,44 C 134,48 138,47 139,43"
            fill="#89AFCD"
            stroke="#4A5D6B"
            strokeWidth="0.75"
          />
          <path
            d="M 181,32 C 187,33 191,38 188,44 C 186,48 182,47 181,43"
            fill="#89AFCD"
            stroke="#4A5D6B"
            strokeWidth="0.75"
          />

          {/* Rounded chest pocket */}
          <path
            d="M 152,43 L 168,43 L 168,54 C 168,58 164,60 160,60 C 156,60 152,58 152,54 Z"
            fill="#CBE0EE"
            stroke="#6C90B9"
            strokeWidth="0.75"
          />
          {/* Heart indicator printed on bodysuit chest pocket */}
          <path d="M160,46.5 C160,46.5 158.5,43.5 156.5,44.5 C154.5,45.5 155.5,48.5 160,51.5 C164.5,48.5 165.5,45.5 163.5,44.5 C161.5,43.5 160,46.5 160,46.5 Z" fill="#6C90B9" />

          {/* Collar pip */}
          <path d="M 148,25 A 12,12 0 0 0 172,25" fill="none" stroke="#FFF" strokeWidth="1" opacity="0.6" />
          
          {/* Golden/White snaps */}
          <circle cx="156" cy="80" r="1.2" fill="#FFF" />
          <circle cx="164" cy="80" r="1.2" fill="#FFF" />
        </motion.g>

        {/* ================= BABY PANTS ================= */}
        <motion.g
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "245px", originY: "25px" }}
        >
          {/* Clothes pegs */}
          <rect x="225" y="21" width="4" height="10" rx="0.5" fill="#EADCC2" stroke="#D5C5A3" strokeWidth="0.5" />
          <rect x="261" y="21" width="4" height="10" rx="0.5" fill="#EADCC2" stroke="#D5C5A3" strokeWidth="0.5" />

          {/* Beautiful baby track pants / trousers */}
          <path
            d="M 223,28 
               C 223,28 243,25 263,28 
               L 264,34 
               C 263,36 261,68 260,71 
               C 259.5,73.5 256.5,74.5 253,74.5 
               L 247,74.5 
               C 245.5,74.5 244.5,73 244,70 
               L 243,50 
               L 242,70 
               C 241.5,73 240.5,74.5 239,74.5 
               L 233,74.5 
               C 229.5,74.5 226.5,73.5 226,71 
               C 225,68 223,36 222,34 
               Z"
            fill="url(#pantBlue)"
            stroke="#4A5D6B"
            strokeWidth="1"
          />

          {/* Ribbed elastic waistband */}
          <rect x="223" y="27" width="40" height="5" rx="1.2" fill="#89AFCD" stroke="#4A5D6B" strokeWidth="0.75" />
          
          {/* Decorative baby pockets on the pants sides */}
          <path d="M 225,36 Q 230,36 232,41" stroke="#4A5D6B" strokeWidth="0.75" fill="none" />
          <path d="M 261,36 Q 256,36 254,41" stroke="#4A5D6B" strokeWidth="0.75" fill="none" />

          {/* Cute patch pockets on the knees */}
          <rect x="228" y="47" width="8" height="8" rx="2" fill="#CBE0EE" stroke="#6C90B9" strokeWidth="0.5" opacity="0.8" />
          <rect x="250" y="47" width="8" height="8" rx="2" fill="#CBE0EE" stroke="#6C90B9" strokeWidth="0.5" opacity="0.8" />

          {/* Cute drawstring details at center waistband */}
          <path d="M 241,32 Q 239,39 236,41 M 245,32 Q 247,40 249,43" stroke="#FFF" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.9" />
          
          {/* Folded cuffs at the bottom of the pant legs */}
          <rect x="228.5" y="71.5" width="10" height="3" rx="1" fill="#CBE0EE" stroke="#4A5D6B" strokeWidth="0.5" />
          <rect x="247.5" y="71.5" width="10" height="3" rx="1" fill="#CBE0EE" stroke="#4A5D6B" strokeWidth="0.5" />
        </motion.g>
      </svg>
    </div>
  );
};

const WhatsAppIcon = ({ size = 18 }: { size?: number }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill="currentColor" 
    className="inline-block transition-transform duration-300 drop-shadow-xs"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

interface InvitationCardProps {
  details: BabyShowerDetails;
  onClose: () => void;
  isOpened: boolean;
  pagado?: boolean;
}

export default function InvitationCard({ details, onClose, isOpened, pagado = true }: InvitationCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioObj] = useState(() => {
    const audio = new Audio(BACKGROUND_MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.45;
    return audio;
  });

  const [musicalNotes, setMusicalNotes] = useState<{ id: number; char: string; left: number; delay: number; duration: number; size: number }[]>([]);

  useEffect(() => {
    if (isPlaying) {
      const chars = ["♫", "♪", "♩", "♬", "🎵", "🎶"];
      const newNotes = Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        char: chars[i % chars.length],
        left: 5 + Math.random() * 90, // distributed layout
        delay: Math.random() * 5,
        duration: 8.5 + Math.random() * 8.5, // much slower & gentler
        size: 14 + Math.random() * 16
      }));
      setMusicalNotes(newNotes);
    } else {
      setMusicalNotes([]);
    }
  }, [isPlaying]);

  const [rsvpList, setRsvpList] = useState<Guest[]>([]);
  const { wishes: wishesList, loading: dbLoading, addWish } = useMuroDeseos(supabase, details.eventoId);
  const { submitRsvp } = useRsvp(supabase, details.eventoId);

  const [formName, setFormName] = useState("");
  const [formAttending, setFormAttending] = useState<boolean | null>(null);
  const [formAdults, setFormAdults] = useState(1);
  const [formChildren, setFormChildren] = useState(0);
  const [formDiet, setFormDiet] = useState("");
  const [formDietOther, setFormDietOther] = useState("");

  useEffect(() => {
    if (formAdults > 5) {
      setFormAdults(5);
    }
  }, [formAdults]);

  // States specifically for the Wishes Wall
  const [wishName, setWishName] = useState("");
  const [wishMessage, setWishMessage] = useState("");
  const [wishAvatar, setWishAvatar] = useState("🦖");
  const [showWishSuccess, setShowWishSuccess] = useState(false);

  const [showRsvpSuccess, setShowRsvpSuccess] = useState(false);
  const [myRsvp, setMyRsvp] = useState<Guest | null>(null);
  const [isLooping, setIsLooping] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${details.locationName}, ${details.locationAddress}`);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2500);
  };

  const getWazeUrl = () =>
    `https://waze.com/ul?q=${encodeURIComponent(details.locationName + ", " + details.locationAddress)}&navigate=yes`;

  const getGoogleMapsUrl = () =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details.locationName + ", " + details.locationAddress)}`;

  const downloadICS = () => {
    const dateStr = details.date.replace(/-/g, "");
    const startTime = details.time.replace(":", "") + "00";
    const endHour = String(parseInt(details.time.split(":")[0]) + 4).padStart(2, "0");
    const endTime = endHour + details.time.split(":")[1] + "00";
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Baby Shower Thomas//ES",
      "BEGIN:VEVENT",
      `DTSTART:${dateStr}T${startTime}`,
      `DTEND:${dateStr}T${endTime}`,
      "SUMMARY:Baby Shower Brunch de Thomas 👶",
      `LOCATION:${details.locationName}\\, ${details.locationAddress}`,
      "DESCRIPTION:¡Acompáñanos a celebrar la futura llegada de Thomas!",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "baby-shower-thomas.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  const triggerLoop = () => {
    if (isLooping) return;
    setIsLooping(true);
    setTimeout(() => setIsLooping(false), 1200);
  };

  // Countdown timer (hook compartido de core/features/countdown)
  const timeLeft = useCountdown(`${details.date}T${details.time}:00`);

  // Audio play/pause toggler
  const togglePlay = () => {
    if (isPlaying) {
      audioObj.pause();
    } else {
      audioObj.play().catch(e => console.log("Audio play deferred due to policy", e));
    }
    setIsPlaying(!isPlaying);
  };

  // Play audio automatically after a brief delay when invitation is opened
  useEffect(() => {
    if (isOpened && !isPlaying) {
      const playTimer = setTimeout(() => {
        audioObj.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          console.log("Audio autoplay prevented by browser. User must click play button.");
        });
      }, 1000);
      return () => clearTimeout(playTimer);
    }
  }, [isOpened]);

  // Stop music if closed
  useEffect(() => {
    return () => {
      audioObj.pause();
    };
  }, []);

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formAttending === null) return;

    const newGuest: Guest = {
      id: Math.random().toString(36).substring(2, 9),
      name: formName.trim(),
      attending: formAttending,
      adults: formAttending ? formAdults : 0,
      children: 0,
      timestamp: new Date().toISOString()
    };

    setRsvpList(prev => [newGuest, ...prev]);
    setMyRsvp(newGuest);
    setShowRsvpSuccess(true);

    // Persistir en Supabase (confirmaciones_rsvp) — fuente de verdad real, no solo WhatsApp
    submitRsvp({
      name: formName.trim(),
      attending: formAttending,
      adults: formAttending ? formAdults : 0,
      dietRestriction: formDiet,
      dietDetail: formDietOther,
    }).catch((err) => console.error("No se pudo guardar el RSVP en Supabase", err));

    // Format WhatsApp confirmation text with beautiful details
    const dietLine = formDiet
      ? `\n*Restricción alimentaria:* ${formDiet}${formDiet === "Alergias" && formDietOther ? ` - ${formDietOther}` : ""}`
      : "";
    const msg = formAttending
      ? `¡Hola! Confirmo mi asistencia al Baby Shower Brunch de Thomas 👶🍼.\n\n*Nombre:* ${formName.trim()}\n*Respuesta:* Sí, asistiré 🦖\n*Personas que asistirán:* ${formAdults}${dietLine}`
      : `¡Hola! Con mucha pena confirmo que no podré asistir al Baby Shower Brunch de Thomas 👶.\n\n*Nombre:* ${formName.trim()}\n*Respuesta:* No podré asistir 🤍${dietLine}`;

    const whatsappPhone = "573154384042";
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappPhone}&text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, "_blank");

    // Reset Form
    setFormName("");
    setFormAttending(null);
    setFormAdults(1);
    setFormChildren(0);
    setFormDiet("");
    setFormDietOther("");
  };

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishName.trim() || !wishMessage.trim()) return;

    const name = wishName.trim();
    const message = wishMessage.trim();
    const avatar = wishAvatar;

    setShowWishSuccess(true);
    setWishName("");
    setWishMessage("");
    setWishAvatar("🦖");
    setTimeout(() => setShowWishSuccess(false), 4500);

    // Confeti 🎉
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.7 },
      colors: ["#C3A66A", "#89AFCD", "#4A5D6B", "#fff", "#f9c74f"],
    });
    setTimeout(() => confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.75 }, colors: ["#C3A66A", "#CBE0EE"] }), 200);
    setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.75 }, colors: ["#4A5D6B", "#f9c74f"] }), 400);

    // useMuroDeseos ya hace el optimistic update + insert + reemplazo de id real
    addWish({ name, message, avatar }).catch((err) => console.error("No se pudo guardar el mensaje en Supabase", err));
  };

  // Google Calendar URL Generator
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`Baby Shower Brunch de Thomas 👶☁️`);
    const dateStr = details.date.replace(/-/g, "");
    const startTime = details.time.replace(":", "") + "00";
    // assuming 4 hours duration
    const endTime = (parseInt(startTime.substring(0, 2)) + 4).toString() + startTime.substring(2);
    const dates = `${dateStr}T${startTime}/${dateStr}T${endTime}`;
    const location = encodeURIComponent(`${details.locationName}, ${details.locationAddress}`);
    const detailsText = encodeURIComponent(`¡Acompáñanos a celebrar la futura llegada de Thomas! Favor de confirmar antes de: ${details.rsvpDeadline}. Código de Vestimenta: ${details.dressCode}`);
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${detailsText}&location=${location}&sf=true&output=xml`;
  };

  return (
    <div id="invitation-card" className="w-full max-w-2xl mx-auto min-h-screen flex flex-col relative z-50 bg-transparent">

      {/* Marca de agua de preview — desaparece cuando el operador marca el evento como pagado */}
      {!pagado && (
        <div className="fixed inset-0 z-[999] pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="rotate-[-30deg] flex flex-wrap gap-16 opacity-15 select-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={i} className="text-4xl font-black text-[#4A5D6B] whitespace-nowrap">
                VISTA PREVIA
              </span>
            ))}
          </div>
        </div>
      )}


      {/* Ambient Descending Musical Notes (Drifts gently downward from the top across the full screen when playing) */}
      {typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-50">
          {isPlaying && musicalNotes.map(note => (
            <motion.span
              key={note.id}
              initial={{ y: "-10%", opacity: 0, scale: 0.5 }}
              animate={{ 
                y: "110%", 
                x: [0, (note.id % 2 === 0 ? 35 : -35), (note.id % 2 === 0 ? -35 : 35), 0],
                opacity: [0, 0.7, 0.7, 0],
                scale: [0.6, 1.0, 0.7],
                rotate: [0, (note.id % 2 === 0 ? 90 : -90)]
              }}
              transition={{ 
                duration: note.duration, 
                repeat: Infinity, 
                delay: note.delay,
                ease: "easeInOut"
              }}
              className="absolute text-[#C3A66A]/50 font-medium select-none"
              style={{ 
                left: `${note.left}%`,
                fontSize: `${note.size}px`,
              }}
            >
              {note.char}
            </motion.span>
          ))}
        </div>,
        document.body
      )}

      {/* Fixed Top Bar Bundle (Header & Musical Player) */}
      <div className="fixed top-0 left-0 right-0 max-w-2xl mx-auto z-45 flex flex-col bg-[#F9F8F4] border-b border-stone-200/30 shadow-xs">
        {/* Header Floating Action Controls */}
        <div className="bg-white/45 backdrop-blur-md px-6 py-3.5 border-b border-white/20 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            <span className="font-serif-lux text-[11px] tracking-[0.2em] font-semibold text-stone-600">Te invitamos a bordo</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Minimize / Close Invitation button */}
            <button 
              id="btn-close-invitation"
              onClick={onClose} 
              className="p-2 rounded-full hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-all border border-stone-200 flex items-center justify-center cursor-pointer"
              title="Cerrar invitación"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Compact, Highly-Interactive Music Player Strip */}
        <div className="bg-gradient-to-r from-[#FFFDF7] via-[#FCFAF2] to-[#F5EFE0] text-[#4A5D6B] py-2.5 px-5 flex items-center justify-between border-b border-[#C3A66A]/20 shadow-xs relative overflow-visible shrink-0 animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5 pointer-events-none"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="relative">
              {/* Spinning & Dancing Golden Record (Turntable) - Scaled Up and Animated */}
              <motion.div 
                animate={isPlaying 
                  ? { 
                      rotate: 360, 
                      y: [0, -3, 3, 0],
                      x: [0, 2, -1, 0],
                      scale: [1, 1.05, 0.98, 1]
                    } 
                  : { rotate: 0 }
                }
                transition={isPlaying 
                  ? { 
                      rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                      y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
                      x: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
                      scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                    } 
                  : {}
                }
                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-stone-900 via-stone-850 to-stone-950 flex items-center justify-center border-2 border-[#C3A66A] shadow-md shrink-0 relative"
              >
                {/* Grooves */}
                <div className="absolute inset-[3px] rounded-full border border-stone-800/60"></div>
                <div className="absolute inset-[6px] rounded-full border border-stone-700/40"></div>
                {/* Gold rim accent */}
                <div className="absolute inset-[9px] rounded-full border border-[#C3A66A]/30"></div>
                {/* Center block */}
                <div className="w-4.5 h-4.5 rounded-full bg-gradient-to-br from-[#FFFDF7] to-amber-100 flex items-center justify-center shadow-xs">
                  <span className="text-[6px] text-amber-800 font-bold select-none font-serif-lux">M</span>
                </div>
              </motion.div>

              {/* Drifting and cascading magical notes directly emitting out of the turntable downwards over the card */}
              <AnimatePresence>
                {isPlaying && (
                  <div className="absolute top-8 left-1.5 w-16 h-16 pointer-events-none overflow-visible">
                    {[
                      { char: "🎵", delay: 0, x: -35, y: 150 },
                      { char: "🎶", delay: 0.6, x: -55, y: 240 },
                      { char: "♫", delay: 1.2, x: 35, y: 190 },
                      { char: "♪", delay: 1.8, x: -20, y: 280 },
                      { char: "🎵", delay: 2.4, x: 50, y: 220 },
                      { char: "🎶", delay: 3.0, x: 15, y: 310 }
                    ].map((note, index) => (
                      <motion.span
                        key={index}
                        initial={{ y: 5, x: 10, opacity: 0, scale: 0.3 }}
                        animate={{ 
                          y: [5, note.y], 
                          x: [10, note.x * 0.4, note.x], 
                          opacity: [0, 0.95, 0.95, 0], 
                          scale: [0.4, 1.25, 0.75],
                          rotate: [0, (index % 2 === 0 ? 120 : -120)]
                        }}
                        transition={{ 
                          duration: 4.5, 
                          repeat: Infinity, 
                          delay: note.delay,
                          ease: "linear"
                        }}
                        className="absolute text-amber-700/85 font-bold select-none text-xs"
                      >
                        {note.char}
                      </motion.span>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="text-left space-y-0.5">
              <div className="flex flex-wrap items-center gap-1.5 leading-none">
                <h4 className="font-serif-lux text-base md:text-lg font-bold text-[#4A5D6B]">Beautiful Boy</h4>
                <span className="text-stone-400 text-[10px]">•</span>
                <p className="font-serif-lux text-sm italic text-[#4A5D6B]/85 font-medium">John Lennon</p>
                
                {/* Dynamic Tiny Waves */}
                {isPlaying && (
                  <div className="flex items-end gap-[1.5px] h-3 ml-1.5 shrink-0">
                    <motion.span animate={{ height: [3, 10, 3] }} transition={{ duration: 0.5, repeat: Infinity }} className="w-[1.5px] bg-[#C3A66A]"></motion.span>
                    <motion.span animate={{ height: [8, 3, 8] }} transition={{ duration: 0.45, repeat: Infinity, delay: 0.08 }} className="w-[1.5px] bg-[#C3A66A]"></motion.span>
                    <motion.span animate={{ height: [4, 9, 4] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} className="w-[1.5px] bg-[#C3A66A]"></motion.span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Space-effective Audio Switcher */}
          <button
            onClick={togglePlay}
            className={`py-1.5 px-4 rounded-xl border text-xs md:text-sm font-serif-lux font-bold tracking-[0.08em] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isPlaying 
                ? "bg-[#4A5D6B] text-stone-50 border-[#4a5d6b] hover:bg-[#394a56]" 
                : "bg-white text-[#4A5D6B] border-stone-200/60 hover:bg-stone-50"
            }`}
          >
            {isPlaying ? (
              <>
                <VolumeX size={11} /> Pausar
              </>
            ) : (
              <>
                <Volume2 size={13} className="animate-pulse text-[#35596F] fill-[#6F91A8]" /> Activar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content (Natural scroll) - Padded at the top to clear the fixed top bar */}
      <div className="flex-1 px-5 pt-[125px] pb-24 md:px-12 space-y-12 select-text relative z-10">
        
        {/* Intro Section - The Beautiful Watercolor Cover */}
        <ScrollReveal>
          <div className="text-center relative flex flex-col items-center">

          <p className="font-serif-lux text-xl md:text-2xl italic text-[#2F4554] font-semibold tracking-wide mb-2 mt-6">
            Un pequeño príncipe está por aterrizar...
          </p>

          {/* Main Illustration Area with interactive dinosaur pilot */}
          <div className="my-8 relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center select-none group">
            {/* Soft decorative cloud/light backplate */}
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-200/50 via-blue-100/30 to-amber-100/30 rounded-full blur-3xl opacity-85 animate-pulse"></div>
            
            {/* Twinkly/glittery stars positioned dynamically around the dino pilot */}
            <motion.div 
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.7, 1.1, 0.7], y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-4 left-6 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] z-20"
            >
              <Sparkles size={20} className="fill-amber-300 stroke-[1.5]" />
            </motion.div>

            <motion.div 
              animate={{ opacity: [0.2, 1, 0.2], scale: [1.1, 0.7, 1.1], rotate: [0, 45, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-6 right-8 text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)] z-20"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" className="fill-amber-350"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z"/></svg>
            </motion.div>

            <motion.div 
              animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.6, 1, 0.6], rotate: [0, -90, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 left-4 text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.5)] z-20"
            >
              <Sparkles size={16} className="fill-sky-200 stroke-[1.5]" />
            </motion.div>

            {/* Drifting Clouds behind and around pilot - Made significantly larger and fluffier */}
            <motion.div 
              animate={{ 
                x: [-18, 18, -18],
                y: [0, -8, 0],
                rotate: [0, 1.5, 0]
              }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-4 -left-12 scale-125 md:scale-135 opacity-80 z-0 select-none pointer-events-none filter drop-shadow-md"
            >
              <svg width="120" height="80" viewBox="0 0 100 60" fill="#f0f4f8">
                <path d="M20 40 a10 10 0 0 1 10 -10 a15 15 0 0 1 28 -5 a12 12 0 0 1 22 2 a10 10 0 0 1 10 13 a10 10 0 0 1 -10 10 l-50 0 a10 10 0 0 1 -10 -10 z" />
              </svg>
            </motion.div>

            <motion.div 
              animate={{ 
                x: [15, -15, 15],
                y: [-7, 7, -7],
                rotate: [0, -1.5, 0]
              }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-4 -right-10 scale-125 md:scale-135 opacity-75 z-0 select-none pointer-events-none filter drop-shadow-md"
            >
              <svg width="130" height="85" viewBox="0 0 100 60" fill="#EBF2F6">
                <path d="M20 40 a10 10 0 0 1 10 -10 a15 15 0 0 1 28 -5 a12 12 0 0 1 22 2 a10 10 0 0 1 10 13 a10 10 0 0 1 -10 10 l-50 0 a10 10 0 0 1 -10 -10 z" />
              </svg>
            </motion.div>

            {/* Dinosaur Pilot Main Image - Clickable for interactive stunt! */}
            <div className="relative w-full h-full p-2 z-10 flex items-center justify-center">
              <motion.img 
                id="illustration-dino"
                src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1779926340/dino-piloteando_ezlwyn.png" 
                alt="Cute baby dinosaur pilot in biplane" 
                className="w-full h-full object-contain select-none filter drop-shadow-[5px_15px_12px_rgba(74,93,107,0.25)] hover:drop-shadow-[5px_20px_15px_rgba(74,93,107,0.35)] transition-shadow duration-300 cursor-pointer"
                referrerPolicy="no-referrer"
                animate={isLooping 
                  ? { 
                      rotate: [0, 360], 
                      scale: [1, 1.25, 0.75, 1],
                      y: [0, -32, 16, 0] 
                    } 
                  : { 
                      y: [0, -11, 0], 
                      rotate: [-1.5, 2.5, -1.5] 
                    }
                }
                transition={isLooping
                  ? { duration: 1.2, ease: "easeInOut" }
                  : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
                }
                onClick={triggerLoop}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.96 }}
                title="¡Haz clic para hacerme dar un giro!"
              />
            </div>
          </div>

          <div className="space-y-2 relative z-10 flex flex-col items-center -mt-2">
            <h2 className="font-serif-lux text-[2.05rem] md:text-5xl font-bold text-stone-800 tracking-wide">
              Baby Shower Brunch
            </h2>
            <div className="text-[#C3A66A] text-[10px] tracking-widest animate-pulse my-1">
              ✦
            </div>
            <div className="flex items-center justify-center space-x-4 w-full max-w-xs md:max-w-sm">
              <span className="h-[1px] bg-[#C3A66A]/40 flex-1"></span>
              <h1 className="font-script text-6xl md:text-7xl text-[#9B7A46] font-medium leading-none -mt-2 mb-2 drop-shadow-[0_2px_4px_rgba(74,93,107,0.18)]">
                Thomas
              </h1>
              <span className="h-[1px] bg-[#C3A66A]/40 flex-1"></span>
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-4">
            <p className="font-serif-lux text-2xl md:text-3xl italic text-stone-750 leading-relaxed font-medium px-4">
              "Acompáñanos a compartir una mañana especial al aire libre, llena de amor, buenos momentos y muchas bendiciones."
            </p>
            <div className="flex justify-center items-center space-x-3 text-stone-400">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-300"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C3A66A]/60 rotate-45 transform scale-75">✦</span>
              <span className="w-1.5 h-1.5 rounded-full bg-stone-300"></span>
            </div>
          </div>
        </div>
      </ScrollReveal>

        {/* Interactive Alphabet Sopa de Letras, Date/Hour & Countdown Row */}
        <ScrollReveal delay={0.1}>
          <div className="space-y-6">
            <BabyWordSoup rsvpDeadline={details.rsvpDeadline} dressCode={details.dressCode} />
          </div>
        </ScrollReveal>

        {/* Location Section - location text first, clean without container, followed by the full-width Centered Dinosaur ABC image below it */}
        <ScrollReveal delay={0.15}>
          <div id="section-location" className="w-full max-w-xl mx-auto flex flex-col items-center text-center py-6 space-y-6">
            
            {/* Location information */}
            <div className="flex flex-col items-center space-y-4 px-4 sm:px-8 w-full">
              <div className="space-y-2 text-center">
                <span className="text-xs md:text-sm font-extrabold tracking-[0.12em] text-[#8F6E3D] block leading-none">
                  Lugar
                </span>
                <h3 className="font-serif-lux text-4xl text-stone-900 font-extrabold tracking-wide">
                  {details.locationName}
                </h3>
                <p className="font-serif-lux text-xl md:text-2xl text-[#2F4554] font-semibold leading-relaxed max-w-sm mx-auto">
                  {details.locationAddress}
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 bg-[#D1E1EC]/70 text-[#2F4554] text-xs md:text-sm font-bold font-serif-lux px-3 py-1.5 rounded-full border border-[#A5BFD2]/50">
                    🚗 Parqueadero disponible
                  </span>
                </div>
              </div>

              {/* Toggle button */}
              <div className="pt-1">
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="inline-flex items-center justify-center gap-2 bg-[#4A5D6B] hover:bg-stone-900 text-stone-50 transition-all py-3 px-6 rounded-xl font-serif-lux text-sm md:text-base font-bold tracking-wider shadow-md hover:scale-102 active:scale-98 cursor-pointer"
                >
                  <Compass size={14} className={showMap ? "animate-spin" : ""} />
                  {showMap ? "Ocultar mapa" : "Cómo llegar"}
                </button>
              </div>

              {/* Collapsible section with navigation + map + calendar */}
              <AnimatePresence initial={false}>
                {showMap && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: -10 }}
                    animate={{ height: "auto", opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="w-full overflow-hidden"
                  >
                    <div className="w-full pt-3 space-y-3 pointer-events-auto">

                      {/* Header + copy + navigation buttons */}
                      <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl p-4 space-y-3 shadow-sm">
                        <h4 className="font-serif-lux text-xl md:text-2xl font-bold text-stone-800 text-center tracking-wide">
                          Cómo llegar al evento
                        </h4>

                        {/* Address row + copy button */}
                        <div className="flex items-center gap-2 bg-stone-50/90 border border-stone-200/70 rounded-xl px-3.5 py-2.5">
                          <p className="font-sans text-sm text-stone-600 leading-snug flex-1 text-left">
                            📍 {details.locationAddress}
                          </p>
                          <button
                            onClick={handleCopyAddress}
                            className="shrink-0 flex items-center gap-1.5 text-xs font-bold font-sans text-[#4A5D6B] hover:text-stone-900 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer whitespace-nowrap"
                          >
                            {addressCopied
                              ? <><CheckCheck size={12} className="text-green-500" /> Copiado</>
                              : <><Copy size={12} /> Copiar</>
                            }
                          </button>
                        </div>

                        {/* Waze + Google Maps */}
                        <div className="grid grid-cols-2 gap-2.5">
                          <a
                            href={getWazeUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-[#E8F8FF] hover:bg-[#d0f0fc] border border-[#33CCFF]/40 text-[#0088BB] font-sans font-bold text-sm py-3 px-3 rounded-xl transition-all shadow-xs cursor-pointer"
                          >
                            <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
                              <ellipse cx="20" cy="22" rx="15" ry="13" fill="#33CCFF"/>
                              <circle cx="15" cy="24" r="3" fill="white"/>
                              <circle cx="25" cy="24" r="3" fill="white"/>
                              <path d="M14 30 Q20 35 26 30" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                              <path d="M20 9 L23 3 L17 3 Z" fill="#33CCFF"/>
                            </svg>
                            Abrir en Waze
                          </a>
                          <a
                            href={getGoogleMapsUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-[#EEF3FF] hover:bg-[#dde7ff] border border-[#4285F4]/30 text-[#4285F4] font-sans font-bold text-sm py-3 px-3 rounded-xl transition-all shadow-xs cursor-pointer"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                            Google Maps
                          </a>
                        </div>
                      </div>

                      {/* The actual 3D map */}
                      <BabyShowerMap
                        locationName={details.locationName}
                        locationAddress={details.locationAddress}
                      />

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Agendar el evento — siempre visible */}
              <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl p-4 space-y-3 shadow-sm w-full">
                <h4 className="font-serif-lux text-xl md:text-2xl font-bold text-stone-800 text-center tracking-wide flex items-center justify-center gap-2">
                  <CalendarPlus size={20} className="text-[#8F6E3D]" /> Agendar el evento
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={getGoogleCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-sans font-bold text-sm py-3 px-3 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="17" rx="2" fill="#fff" stroke="#DADCE0" strokeWidth="1.5"/>
                      <rect x="3" y="4" width="18" height="5" rx="2" fill="#4285F4"/>
                      <rect x="7" y="2" width="2" height="4" rx="1" fill="#EA4335"/>
                      <rect x="15" y="2" width="2" height="4" rx="1" fill="#EA4335"/>
                      <rect x="7" y="12" width="2.5" height="2.5" rx="0.5" fill="#34A853"/>
                      <rect x="11" y="12" width="2.5" height="2.5" rx="0.5" fill="#FBBC04"/>
                      <rect x="15" y="12" width="2.5" height="2.5" rx="0.5" fill="#EA4335"/>
                      <rect x="7" y="16" width="2.5" height="2.5" rx="0.5" fill="#4285F4"/>
                      <rect x="11" y="16" width="2.5" height="2.5" rx="0.5" fill="#34A853"/>
                    </svg>
                    Google Calendar
                  </a>
                  <button
                    onClick={downloadICS}
                    className="flex items-center justify-center gap-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-sans font-bold text-sm py-3 px-3 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" className="text-stone-600">
                      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                      <path d="M7 11h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zM7 15h2v2H7zm4 0h2v2h-2z"/>
                    </svg>
                    Calendario iOS
                  </button>
                </div>
              </div>

            </div>

            {/* Centered Dinosaur ABC image - under the location text, full width / larger */}
            <div className="relative left-1/2 w-screen -translate-x-1/2 flex items-center justify-center select-none filter z-0 mt-4 sm:left-0 sm:w-full sm:translate-x-0 sm:px-2">
              <motion.img
                src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1779937816/dino_abc_rjktok.png"
                alt="Bebé Dinosaurio ABC"
                referrerPolicy="no-referrer"
                className="block w-screen h-auto max-w-none object-cover sm:w-full sm:max-w-md sm:object-contain"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

          </div>
        </ScrollReveal>

        {/* Gift Suggestions */}
        <ScrollReveal delay={0.15}>
          <div className="bg-white/40 backdrop-blur-md border border-white/50 p-8 rounded-2xl w-full flex flex-col items-center text-center gap-6 shadow-xs relative">
            
            {/* Hanging Clothesline Illustration in gorgeous shades of blue */}
            <BabyHangingClothes />

            <div className="space-y-3 max-w-md">
              <h3 className="font-serif-lux text-3xl md:text-4xl text-stone-850 font-bold tracking-wide">Sugerencia de regalo</h3>
              <p className="font-serif-lux text-xl md:text-2xl text-[#2F4554] leading-relaxed font-semibold">
                ¡Tu cariño es nuestro mejor regalo! Si quieres complementarlo con un detalle, te sugerimos ropa para el bebé en la talla que desees.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.18}>
          <div className="text-center px-4">
            <p className="font-serif-lux text-3xl md:text-4xl text-[#2F4554] leading-relaxed font-semibold">
              ¡Te esperamos con los brazos abiertos!
            </p>
          </div>
        </ScrollReveal>

        {/* RSVP FORM SECTION WITH FULL OUTER BACKGROUND AND NO DOUBLE CONTAINERS */}
        <ScrollReveal delay={0.2}>
          <div 
            className="rounded-3xl overflow-hidden p-8 sm:p-10 relative bg-cover bg-center border border-[#C3A66A]/35 shadow-lg"
            style={{ 
              backgroundImage: "url('https://res.cloudinary.com/ddqbnr9vo/image/upload/v1779984060/ChatGPT_Image_24_may_2026_20_42_01_ho8tdh.png')" 
            }}
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[0.5px] pointer-events-none"></div>
            <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-sky-50/30 opacity-65 blur-xl"></div>
              
              <div className="text-center relative space-y-2 mb-6">
                <div className="w-fit mx-auto mb-1">
                  <img
                    src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1779929259/cascarron_u5s2x0.png"
                    alt="Sello de confirmación"
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.2)]"
                  />
                </div>
                <h3 className="font-serif-lux text-3xl md:text-4xl text-stone-850 font-bold tracking-wide">Confirmación de asistencia</h3>
                <p className="text-[#2F4554] text-xl md:text-2xl max-w-sm mx-auto font-serif-lux font-semibold">
                  Por favor ayúdanos a planear mejor confirmando antes del <strong className="text-stone-705">{details.rsvpDeadline}</strong>.
                </p>
              </div>

              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                {/* Input Name */}
                <div className="space-y-1">
                  <label htmlFor="rsvp-input-name" className="font-sans text-sm md:text-base font-semibold text-stone-600 block">
                    Tu nombre:
                  </label>
                  <div className="relative">
                    <input 
                      id="rsvp-input-name"
                      type="text" 
                      value={formName} 
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Escribe tu nombre completo" 
                      required
                      className="w-full text-stone-850 text-base md:text-lg outline-none p-3.5 pl-10 rounded-xl transition-all font-serif-lux border border-stone-200/50 focus:border-[#4A5D6B]/40 focus:bg-white bg-stone-50/10"
                    />
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  </div>
                </div>

                {/* Attendance Choice Buttons */}
                <div className="space-y-1">
                  <label className="font-sans text-sm md:text-base font-semibold text-stone-600 block">
                    ¿Asistirá al festejo?:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      id="rsvp-btn-yes"
                      type="button"
                      onClick={() => setFormAttending(true)}
                      className={`py-3 px-4 rounded-xl text-base md:text-lg font-semibold font-serif-lux tracking-wide flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                        formAttending === true 
                          ? "bg-[#4A5D6B] text-stone-50 border-sky-700 shadow-sm ring-2 ring-sky-105" 
                          : "bg-white/40 backdrop-blur-xs text-stone-600 hover:bg-white/60 border-stone-200/30"
                      }`}
                    >
                      <Check size={14} /> Asistiré
                    </button>
                    <button
                      id="rsvp-btn-no"
                      type="button"
                      onClick={() => setFormAttending(false)}
                      className={`py-3 px-4 rounded-xl text-base md:text-lg font-semibold font-serif-lux tracking-wide flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                        formAttending === false 
                          ? "bg-[#E9EEF4] text-[#4E6271] border-[#C3D0DA] shadow-sm ring-2 ring-[#D6E0E8]" 
                          : "bg-white/40 backdrop-blur-xs text-stone-600 hover:bg-white/60 border-stone-200/30"
                      }`}
                    >
                      No podré
                    </button>
                  </div>
                </div>

                {/* Conditional Guests Range Slider Section */}
                <AnimatePresence>
                  {formAttending === true && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-2 pt-2 overflow-hidden"
                    >
                      <div className="space-y-2.5 p-4 bg-sky-50/45 rounded-xl border border-sky-100/40">
                        <div className="flex justify-between items-center text-sm md:text-base font-serif-lux font-semibold text-stone-700">
                          <span>Personas que asistirán:</span>
                          <span className="bg-[#4A5D6B] text-white px-2.5 py-1 rounded-md font-sans font-bold">
                            {formAdults}
                          </span>
                        </div>
                        
                        <input 
                          id="rsvp-range-guests"
                          type="range" 
                          min="1" 
                          max="5" 
                          value={formAdults} 
                          onChange={(e) => setFormAdults(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#4A5D6B] mx-auto block focus:outline-none"
                        />
                        
                        <div className="flex justify-between text-[9px] text-stone-400 font-bold font-sans px-1">
                          <span>1</span>
                          <span>2</span>
                          <span>3</span>
                          <span>4</span>
                          <span>5</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Dietary Preferences */}
                <div className="space-y-2">
                  <label className="font-sans text-sm md:text-base font-semibold text-stone-600 block">
                    ¿Tienes alguna preferencia o restricción alimentaria?
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "Ninguna", label: "Ninguna", desc: "¡Como de todo!" },
                      { value: "Vegetariano / Vegano", label: "Vegetariano / Vegano", desc: "" },
                      { value: "Sin gluten", label: "Sin gluten", desc: "Celiaco" },
                      { value: "Alergias", label: "Alergias", desc: "Maní, mariscos, etc." },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all font-serif-lux ${
                          formDiet === opt.value
                            ? "bg-sky-50/60 border-[#4A5D6B]/40 ring-1 ring-[#4A5D6B]/20"
                            : "bg-white/40 border-stone-200/40 hover:bg-white/60"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                          formDiet === opt.value ? "bg-[#4A5D6B] border-[#4A5D6B]" : "border-stone-300 bg-white"
                        }`}>
                          {formDiet === opt.value && <Check size={11} className="text-white" strokeWidth={3} />}
                        </div>
                        <span className="text-base text-stone-700 font-semibold leading-snug">
                          {opt.label}
                          {opt.desc && <span className="text-stone-400 font-normal ml-1">({opt.desc})</span>}
                        </span>
                        <input
                          type="radio"
                          name="diet"
                          value={opt.value}
                          checked={formDiet === opt.value}
                          onChange={(e) => { setFormDiet(e.target.value); setFormDietOther(""); }}
                          className="sr-only"
                        />
                      </label>
                    ))}
                    {/* Text input for Alergias/Otra */}
                    {formDiet === "Alergias" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <input
                          type="text"
                          value={formDietOther}
                          onChange={(e) => setFormDietOther(e.target.value)}
                          placeholder="Especifica tu alergia o restricción..."
                          className="w-full text-stone-800 text-base outline-none p-3 rounded-xl border border-stone-200/50 focus:border-[#4A5D6B]/40 bg-white/60 font-serif-lux mt-1"
                        />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* WhatsApp Styled Submit Button */}
                <button
                  id="rsvp-btn-submit"
                  type="submit"
                  disabled={formAttending === null || !formName.trim()}
                  className="w-full py-4 px-6 rounded-xl bg-[#128C7E] hover:bg-[#0e776c] active:bg-[#0b6a61] text-white disabled:bg-stone-200 disabled:text-stone-400 font-serif-lux text-base md:text-lg font-bold tracking-[0.08em] transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer text-center"
                >
                  <WhatsAppIcon size={18} /> Enviar
                </button>
              </form>

              {/* Success Dialog Popup inside RSVP card */}
              <AnimatePresence>
                {showRsvpSuccess && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#fbf9f4]/98 flex flex-col items-center justify-center p-6 text-center z-10"
                  >
                    <div className="w-16 h-16 bg-sky-50 text-sky-700 rounded-full flex items-center justify-center mb-4 border border-sky-100 animate-bounce">
                      <Check size={32} />
                    </div>
                    <h4 className="font-serif-lux text-xl text-stone-800 font-semibold">¡Confirmación Enviada Exitosamente!</h4>
                    <p className="text-stone-500 text-base md:text-lg mt-2 max-w-sm leading-relaxed font-serif-lux">
                      Muchas gracias, <strong className="text-stone-700">{myRsvp?.name}</strong>. Hemos registrado tu respuesta a la expedición y Thomas estará feliz de contar con tu presencia.
                    </p>
                    {myRsvp?.attending && (
                      <div className="bg-sky-50/50 p-3.5 rounded-xl border border-sky-100/50 text-sm md:text-base font-serif-lux text-sky-800 font-semibold mt-4">
                        Asistentes confirmados: {myRsvp.adults} Personas
                      </div>
                    )}
                    
                    <button
                      id="rsvp-btn-ok"
                      onClick={() => setShowRsvpSuccess(false)}
                      className="mt-6 font-serif-lux text-sm md:text-base font-semibold text-stone-500 hover:text-stone-900 border border-stone-200 rounded-lg py-2 px-5 hover:bg-stone-50 transition-colors"
                    >
                      Registrar otra respuesta / Volver
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
        </ScrollReveal>

        {/* DEDICATED MURO DE DESEOS SECTION (Entirely independent and separate from the RSVP above) */}
        <ScrollReveal delay={0.2}>
          <div className="border border-[#C3A66A]/35 bg-gradient-to-br from-white/65 via-white/50 to-[#C3A66A]/5 backdrop-blur-md rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-md space-y-6">
          <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-[#C3A66A]/10 opacity-60 blur-xl"></div>
          
          <div className="text-center relative space-y-1">
            <h3 className="font-serif-lux text-3xl md:text-4xl text-stone-900 font-bold tracking-wide flex items-center justify-center gap-1.5">
              🧸 El muro de deseos de Thomas
            </h3>
            <p className="text-[#2F4554] text-xl md:text-2xl max-w-sm mx-auto font-serif-lux leading-relaxed font-semibold">
              Escribe unas tiernas palabras en el muro. ¡Elige tu estampa de animalito para sellar tu mensaje!
            </p>
          </div>

          <form onSubmit={handleWishSubmit} className="space-y-4">
            
            {/* Input Name */}
            <div className="space-y-1">
              <label className="font-serif-lux text-sm md:text-base tracking-wider font-bold text-stone-600 block">
                Tu nombre o firma
              </label>
              <div className="relative">
                <input 
                  id="wish-input-name"
                  type="text" 
                  value={wishName} 
                  onChange={(e) => setWishName(e.target.value)}
                  placeholder="Ej. Tíos Beltrán / Madrina Elena / Firma familiar" 
                  required
                  className="w-full text-stone-850 text-base md:text-lg outline-none p-3 pl-10 rounded-xl transition-all font-serif-lux bg-white/50 border border-stone-200/40 focus:border-[#C3A66A]/35 focus:bg-white"
                />
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              </div>
            </div>

            {/* Custom Animal Avatar Selection */}
            <div className="space-y-2">
              <label className="font-serif-lux text-sm md:text-base tracking-wider font-bold text-stone-600 block">
                Elige tu estampa de animalito para sellar tu deseo: 🧸✨
              </label>
              <div id="wish-stamp-grid" className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-1.5">
                {[
                  { emoji: "🦖", label: "Dino" },
                  { emoji: "🦕", label: "Dino 2" },
                  { emoji: "🐘", label: "Elefante" },
                  { emoji: "🦁", label: "Leoncito" },
                ].map((item) => (
                  <button
                    key={item.emoji}
                    type="button"
                    onClick={() => {
                      setWishAvatar(item.emoji);
                      triggerLoop();
                    }}
                    className={`p-1.5 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                      wishAvatar === item.emoji
                        ? "bg-[#C3A66A]/20 border-[#C3A66A] scale-105 shadow-xs ring-1 ring-[#C3A66A]/45"
                        : "bg-white/60 hover:bg-stone-50 border-stone-200/50"
                    }`}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-xs md:text-sm font-bold font-serif-lux text-stone-600 tracking-tight leading-none">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Area */}
            <div className="space-y-1">
              <label className="font-serif-lux text-sm md:text-base tracking-wider font-bold text-stone-600 block">
                Escribe tu hermoso mensaje de felicitación
              </label>
              <textarea 
                id="wish-input-message"
                value={wishMessage} 
                onChange={(e) => setWishMessage(e.target.value)}
                placeholder="¡Escribe tus hermosas oraciones, consejos amorosos y deseos sinceros aquí! ❤️" 
                rows={3}
                required
                className="w-full text-stone-850 text-base md:text-lg outline-none p-3.5 rounded-xl transition-all resize-none font-serif-lux bg-white/50 border border-stone-200/40 focus:border-[#C3A66A]/35 focus:bg-white"
              ></textarea>
            </div>

            {/* Custom Wish Success Indicator inside form container */}
            <AnimatePresence>
              {showWishSuccess && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-center font-serif-lux text-sm md:text-base font-semibold"
                >
                  Tu mensaje se escribió con éxito.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Signature Button */}
            <button
              id="wish-btn-submit"
              type="submit"
              disabled={!wishName.trim() || !wishMessage.trim()}
              className="w-full py-3 px-6 rounded-xl bg-[#4A5D6B] hover:bg-stone-900 text-stone-50 disabled:bg-stone-200 disabled:text-stone-400 font-serif-lux text-base md:text-lg font-semibold tracking-[0.08em] transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Firmar muro
            </button>
          </form>

          {/* Core Wishes Feed List view */}
          <div className="space-y-3 pt-4 border-t border-stone-200/40">
            <span className="text-base md:text-lg font-bold tracking-[0.08em] text-[#8F6E3D] block leading-none mb-2">
              Mensajes de amor y bendiciones {dbLoading ? "..." : `(${wishesList.length})`}
            </span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {wishesList.map((wish) => (
                <motion.div 
                  key={wish.id} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/60 p-3.5 rounded-xl border border-white text-left flex items-start gap-3 shadow-3xs"
                >
                  {/* Sello stamp circle */}
                  <div className="w-10 h-10 rounded-full bg-[#FFFDF9] border border-[#C3A66A]/25 flex items-center justify-center text-xl shrink-0 shadow-3xs">
                    {wish.avatar}
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-serif-lux font-bold text-base md:text-lg text-stone-900 truncate">{wish.name}</span>
                      <span className="text-[10px] text-stone-500 font-serif-lux shrink-0">
                        {new Date(wish.timestamp).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    <p className="text-stone-700 italic text-base md:text-lg font-serif-lux font-normal pl-2 border-l-2 border-[#C3A66A]/35 py-0.5 leading-relaxed break-words">
                      "{wish.message}"
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </ScrollReveal>

      </div>

      <div className="pb-4 text-center px-6">
        <p className="font-serif-lux text-stone-600 text-xl md:text-2xl leading-relaxed font-medium tracking-wide italic">
          Con todo el amor,
        </p>
        <p className="font-serif-lux text-4xl md:text-5xl font-bold tracking-wide mt-1" style={{ color: "#C3A66A", textShadow: "0 2px 8px rgba(195,166,106,0.25)" }}>
          Mummy & Daddy
        </p>
        <span className="text-2xl">💙</span>
      </div>

      {/* Elegant bottom bar */}
      <div className="sticky bottom-0 left-0 right-0 bg-sky-100/95 text-stone-900 py-3.5 text-center text-sm md:text-base font-serif-lux tracking-wide border-t border-sky-300/70 shrink-0 z-40 flex items-center justify-center gap-1.5">
        <Heart size={10} className="fill-red-500 text-red-500 animate-pulse" />
        Creado con Amor por{" "}
        <a
          href="https://wa.me/573057502790"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-[#4A5D6B] hover:text-[#128C7E] underline underline-offset-2 transition-colors cursor-pointer"
        >
          Oswal
        </a>
      </div>

    </div>
  );
}
