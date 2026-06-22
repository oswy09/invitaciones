import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gift, 
  Heart, 
  Users
} from 'lucide-react';
import { StorkAnimation } from './components/StorkAnimation';
import { AnimatedBaby } from './components/AnimatedBaby';
import { MusicSynth } from './components/MusicSynth';
import { BuntingBanner } from './components/BuntingBanner';
import { InvitationDateBackground } from './components/InvitationDateBackground';
import { FloatingSnork } from './components/FloatingSnork';
import { MapModal } from './components/MapModal';
import { HourglassCountdown } from './components/HourglassCountdown';
import { BottomClouds } from './components/BottomClouds';
import { DEFAULT_STORK_DETAILS, StorkDetails, InvitationData, fromInvitationData } from './types';
import { loadEvento, getEventoIdFromUrl } from './lib/loadEvento';
import { supabase } from './lib/supabase';
import { useMuroDeseos } from './hooks/useMuroDeseos';
import { useRsvp } from './hooks/useRsvp';
import { usePreviewBridge } from './hooks/usePreviewBridge';

export default function App() {
  const [screen, setScreen] = useState<'intro' | 'invitation'>('intro');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const eventoId = getEventoIdFromUrl();
  const [details, setDetails] = useState<StorkDetails>(DEFAULT_STORK_DETAILS);
  const [pagado, setPagado] = useState(true);
  const [aprobado, setAprobado] = useState(true);

  const handlePreviewUpdate = useCallback((data: InvitationData, previewPagado: boolean) => {
    setDetails(fromInvitationData(data));
    setPagado(previewPagado);
    setAprobado(true);
    setScreen('invitation'); // en preview se omite la animación de intro
  }, []);

  const isPreview = usePreviewBridge<InvitationData>(handlePreviewUpdate);

  // Carga el evento real desde Supabase (eventos.datos) si existe; si no, se
  // conservan los datos por defecto de Thomas para que la plantilla siga
  // funcionando como demo/standalone.
  useEffect(() => {
    if (isPreview) return; // en preview, los datos llegan por postMessage, no por Supabase
    loadEvento().then((result) => {
      if (result.details) setDetails(result.details);
      setPagado(result.pagado);
      setAprobado(result.aprobado);
    });
  }, [isPreview]);

  // RSVP Form States
  const [rsvpName, setRsvpName] = useState('');
  const [attending, setAttending] = useState(true);
  const [companions, setCompanions] = useState(0);

  // Signature Form States for Libro de Firmas y Recuerdos
  const [signatureName, setSignatureName] = useState('');
  const [signatureMessage, setSignatureMessage] = useState('');

  // Libro de Firmas: antes vivía en localStorage ('baby_shower_rsvps_thomas'),
  // visible solo en el navegador de quien firmaba. Ahora usa muro_deseos en
  // Supabase, visible para todos los invitados en tiempo real.
  const { wishes, addWish } = useMuroDeseos(supabase, eventoId);

  // RSVP de asistencia: antes solo se formateaba en un mensaje de WhatsApp y
  // nunca se guardaba en ningún lado. Ahora también persiste en
  // confirmaciones_rsvp como fuente de verdad real.
  const { submitRsvp } = useRsvp(supabase, eventoId);

  const handleAddToCalendar = () => {
    const target = new Date(details.timestamp);
    const dateStr = target.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(target.getTime() + 3 * 60 * 60 * 1000);
    const endStr = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    // Detect iOS, iPadOS or macOS to choose native .ics download; otherwise default to Google Calendar link
    const isAppleDevice = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) ||
                          (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isAppleDevice) {
      // Generate ICS file for smooth native Apple Calendar popup
      const icsContent =
        "BEGIN:VCALENDAR\n" +
        "VERSION:2.0\n" +
        "BEGIN:VEVENT\n" +
        `SUMMARY:Shower ${details.babyName} 👶✨\n` +
        "DESCRIPTION:¡Acompáñanos a compartir una mañana especial al aire libre, llena de amor, buenos momentos y bendiciones!\n" +
        `LOCATION:${details.locationAddress}\n` +
        `DTSTART:${dateStr}\n` +
        `DTEND:${endStr}\n` +
        "END:VEVENT\n" +
        "END:VCALENDAR";

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', `shower_${details.babyName.toLowerCase()}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Redirect to Google Calendar template
      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Shower+${encodeURIComponent(details.babyName)}+👶✨&dates=${dateStr}/${endStr}&details=¡Acompáñanos+a+compartir+una+mañana+especial+al+aire+libre,+llena+de+amor,+buenos+momentos+y+bendiciones!&location=${encodeURIComponent(details.locationAddress)}`;
      window.open(googleCalUrl, '_blank');
    }
  };

  const handleSignatureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signatureName.trim() || !signatureMessage.trim()) return;

    const name = signatureName.trim();
    const message = signatureMessage.trim();
    setSignatureName('');
    setSignatureMessage('');

    addWish({ name, message, avatar: '🦢' }).catch((err) => console.error('No se pudo guardar el mensaje en Supabase', err));

    // Show temporary fun effect
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  // Nota: `aprobado` ya no oculta la invitación — el cliente debe ver su
  // preview con marca de agua (controlada por `pagado`) apenas la crea,
  // antes de que el operador la apruebe. `aprobado` se usa en el dashboard
  // de admin para decidir si el pedido ya está listo para entregarse.

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-sky-200 selection:text-sky-900">

      {/* Marca de agua de preview — desaparece cuando el operador marca el evento como pagado */}
      {!pagado && (
        <div className="fixed inset-0 z-[999] pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="rotate-[-30deg] flex flex-wrap gap-16 opacity-15 select-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={i} className="text-4xl font-black text-slate-700 whitespace-nowrap">
                VISTA PREVIA
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Screen Toggle 1: Intro Stork Animation for 7 seconds */}
      <AnimatePresence mode="wait">
        {screen === 'intro' && (
          <StorkAnimation 
            onComplete={() => setScreen('invitation')} 
            text="¡Hola! Tenemos un mensaje muy especial para ti..."
            durationSeconds={7}
          />
        )}
      </AnimatePresence>

      {/* Screen Toggle 2: The actual premium Digital Invitation Card */}
      {screen === 'invitation' && (
        <div className="min-h-screen vertical-stripes-soft flex flex-col items-center justify-start pt-8 pb-32 px-4 sm:px-6 relative">
          
          {/* Animated Snork drifting smoothly across the screen with trailing stars */}
          <FloatingSnork />

          {/* Mapbox Live Interactive Map Modal */}
          <MapModal
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            babyName={details.babyName}
            venueName={details.locationName}
            venueAddress={details.locationAddress}
          />

          {/* Ambient Music Box Synthesizer Button */}
          <MusicSynth />

          {/* Floating interactive particles */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [1, 1, 0], scale: [1, 1.3, 1] }}
                transition={{ duration: 3 }}
                className="bg-white/90 shadow-2xl px-8 py-5 rounded-3xl border-4 border-yellow-300 text-center"
              >
                <span className="text-4xl">🍼✨🎉</span>
                <p className="text-sky-700 font-bold font-fredoka mt-2 text-lg">¡Muchas gracias por confirmar!</p>
                <p className="text-sky-500 text-xs font-quicksand font-semibold mt-1">Te esperamos con ansias</p>
              </motion.div>
            </div>
          )}

          {/* Core Invitation Plate - Translucent & Transparent to let stripes show */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full max-w-[720px] relative mb-10 transition-all px-3"
          >
            {/* Interactive Bunting Banner with letters spelling B-A-B-Y */}
            <BuntingBanner babyName={details.babyName} />

            {/* Central Piece: GORGEOUS INTERACTIVE ANIMATED BABY LOGO */}
            <div className="mt-4 mb-0">
              <AnimatedBaby className="w-full max-w-[325px] mx-auto animate-pulse-slow" />
            </div>

            {/* Warm, charming invitation intro text directly below the baby icon */}
            <div className="max-w-[500px] mx-auto text-center px-4 mb-4 mt-1">
              <p className="text-slate-800 font-semibold font-cormorant text-[22px] sm:text-[26px] italic leading-relaxed select-none">
                Acompáñanos a compartir una mañana especial al aire libre, llena de amor, buenos momentos y muchas bendiciones.
              </p>
            </div>

            {/* Custom Designed Vector Background with Date and Time directly on it (No background) */}
            <div className="my-6">
              <InvitationDateBackground 
                onEnterClick={handleAddToCalendar}
                onHowToGetThereClick={() => setIsMapOpen(true)}
              />
            </div>

          </motion.div>

          {/* Side-by-side Layout Panels for: 
              1. GIFT REGISTRY (Mesa de regalos)
              2. rsvp form & interactive guest ledger */}
          <div className="w-full max-w-[580px] space-y-6">
            
            {/* GIFT REGISTRY PANEL (Mesa de regalos - No container background) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="relative w-full overflow-hidden flex flex-col items-center py-4 text-center"
            >
              <div className="flex flex-col items-center gap-2 mb-4">
                <div className="p-2.5 bg-sky-100/65 text-sky-600 rounded-full">
                  <Gift className="w-5.5 h-5.5 flex-shrink-0 animate-bounce" />
                </div>
                <h3 className="text-[24px] sm:text-[28px] font-black text-slate-800 font-fredoka tracking-wide leading-tight">¿Qué le puedes regalar a {details.babyName}?</h3>
              </div>
              
              <p className="text-[20px] sm:text-[22px] text-slate-800 font-cormorant italic font-semibold leading-relaxed mb-4 text-center max-w-[500px]">
                ¡Tu cariño es nuestro mejor regalo! Ropa para bebé en cualquier talla.
              </p>

              {/* Beautiful Animated Clothes Stork Image requested */}
              <div className="flex flex-col items-center justify-center mt-2 mb-2">
                <motion.img 
                  src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1780090232/ropa-cigue%C3%B1a_fq7mkh.png"
                  alt={`Ropa para bebé ${details.babyName}`}
                  referrerPolicy="no-referrer"
                  className="w-full max-w-[260px] sm:max-w-[280px] object-contain drop-shadow-[0_12px_20px_rgba(14,165,233,0.12)]"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 1.5, -1.5, 0] 
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
                
                {/* Beautiful soft drop shadow beneath the floating artwork */}
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-40 h-2 bg-sky-200/40 rounded-full filter blur-xs mt-4"
                />
              </div>

              <p className="text-[24px] sm:text-[26px] text-slate-800 font-cormorant italic font-semibold leading-relaxed mt-3 text-center max-w-[500px]">
                ¡Te esperamos con los brazos abiertos!
              </p>

            </motion.div>

            {/* RSVP FORM PANEL */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="bg-white/18 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/30 relative"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-sky-100/70 text-sky-600 rounded-xl">
                  <Heart className="w-5 h-5 text-sky-500 fill-sky-200" />
                </div>
                <h3 className="text-[24px] sm:text-[28px] font-black text-slate-800 font-fredoka tracking-wide leading-tight">Confirmar Asistencia</h3>
              </div>

              <div className="space-y-4">
                
                {/* Guest Name input */}
                <div>
                  <label className="block text-[17px] sm:text-[18px] font-bold text-slate-600 mb-1 font-cormorant">Tu Nombre / Familia</label>
                  <input
                    type="text"
                    required
                    maxLength={40}
                    placeholder="Ejemplo: Familia Jaimes Ruiz"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    className="w-full bg-white/50 border border-white/35 rounded-2xl px-4 py-3.5 text-[17px] sm:text-[18px] font-cormorant focus:ring-2 focus:ring-sky-300 focus:outline-hidden text-slate-800 font-bold"
                    id="input-rsvp-name"
                  />
                </div>

                {/* Attending toggle */}
                <div>
                  <label className="block text-[17px] sm:text-[18px] font-bold text-slate-600 mb-2 font-cormorant">¿Podrás acompañarnos?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAttending(true)}
                      className={`py-3.5 rounded-2xl text-[16px] sm:text-[17px] font-bold font-cormorant flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        attending 
                          ? 'bg-sky-500 text-white border-sky-400 shadow-md' 
                          : 'bg-white/40 text-slate-600 border-white/35 hover:bg-white/60'
                      }`}
                      id="btn-attending-yes"
                    >
                      <span>🍼 ¡Sí, claro!</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttending(false)}
                      className={`py-3.5 rounded-2xl text-[16px] sm:text-[17px] font-bold font-cormorant flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        !attending 
                          ? 'bg-slate-700 text-white border-slate-600 shadow-md' 
                          : 'bg-white/40 text-slate-600 border-white/35 hover:bg-white/60'
                      }`}
                      id="btn-attending-no"
                    >
                      <span>No podré</span>
                    </button>
                  </div>
                </div>

                {/* Companions field (conditional on attending = true) */}
                {attending && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label className="block text-[17px] sm:text-[18px] font-bold text-slate-600 mb-1 font-cormorant">Acompañantes adicionales</label>
                    <div className="flex gap-2">
                      {[0, 1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setCompanions(num)}
                          className={`flex-1 py-2.5 sm:py-3 rounded-xl text-[15px] sm:text-[16px] font-bold font-cormorant border transition-all cursor-pointer ${
                            companions === num 
                              ? 'bg-sky-100 text-sky-700 border-sky-300' 
                              : 'bg-white/40 text-slate-500 border-white/35'
                          }`}
                          id={`btn-companion-num-${num}`}
                        >
                          {num === 0 ? "Solo yo" : `+${num}`}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* WhatsApp Direct Action */}
                <div className="pt-2">
                  <a
                    href={rsvpName.trim() ? `https://wa.me/${details.whatsappNumber}?text=${encodeURIComponent(
                      `¡Hola! Confirmo mi asistencia al Baby Shower de ${details.babyName}.\n` +
                      `• Nombre/Familia: ${rsvpName.trim()}\n` +
                      `• ¿Asistirá?: ${attending ? 'Sí, ¡claro!' : 'No podré'}${attending && companions > 0 ? `\n• Acompañantes adicionales: +${companions}` : ''}`
                    )}` : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!rsvpName.trim()) {
                        e.preventDefault();
                        return;
                      }
                      // Supabase es la fuente de verdad para el conteo de invitados;
                      // WhatsApp sigue siendo el aviso directo al organizador.
                      submitRsvp({
                        name: rsvpName.trim(),
                        attending,
                        adults: attending ? companions + 1 : 0,
                      }).catch((err) => console.error('No se pudo guardar el RSVP en Supabase', err));
                      setShowConfetti(true);
                      setTimeout(() => setShowConfetti(false), 4000);
                    }}
                    className={`w-full py-3.5 text-white font-extrabold text-[15px] sm:text-[16px] font-cormorant rounded-2xl shadow-md tracking-wider uppercase transition-all duration-205 flex items-center justify-center gap-2 border-2 ${
                      rsvpName.trim() 
                        ? 'bg-emerald-500 hover:bg-emerald-600 border-white/45 hover:scale-[1.01] cursor-pointer' 
                        : 'bg-emerald-400/40 text-white/50 border-white/20 cursor-not-allowed'
                    }`}
                    id="btn-rsvp-whatsapp"
                  >
                    <span>Confirmar por WhatsApp</span>
                  </a>
                  {!rsvpName.trim() && (
                    <p className="text-[14px] sm:text-[15px] text-slate-400 font-cormorant italic text-center mt-1.5">
                      Ingresa tu nombre arriba para activar la confirmación por WhatsApp
                    </p>
                  )}
                </div>

              </div>
            </motion.div>

            {/* LIVE BOARD: LIBRO DE FIRMAS Y RECUERDOS */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="bg-white/18 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/30 relative"
            >
              <div className="flex items-center justify-between border-b border-dashed border-sky-100/30 pb-3.5 mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-sky-100/70 text-sky-500 rounded-xl">
                    <Users className="w-5 h-5 text-sky-500" />
                  </div>
                  <h3 className="text-[24px] sm:text-[28px] font-black text-slate-800 font-fredoka tracking-wide leading-tight">Libro de Firmas y Recuerdos</h3>
                </div>
              </div>

              {/* Direct message interaction in the guest book */}
              <form onSubmit={handleSignatureSubmit} className="bg-white/45 border border-white/30 rounded-2xl p-4 mb-5 space-y-3">
                <p className="text-[18px] sm:text-[20px] text-slate-600 font-cormorant italic font-medium leading-snug mb-1">
                  ¡Déjale un mensaje, dedicatoria o bendición a {details.babyName} y sus papás!
                </p>
                <div>
                  <input
                    type="text"
                    required
                    maxLength={35}
                    placeholder="Tu Nombre (Ej: Tía Sonia o Familia Rojas)"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    className="w-full bg-white/70 border border-white/40 rounded-xl px-3 py-2.5 text-[16px] sm:text-[17px] font-cormorant focus:ring-1 focus:ring-sky-300 focus:outline-hidden text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <textarea
                    rows={2}
                    required
                    maxLength={140}
                    placeholder="Escribe tus hermosos deseos o palabras de cariño..."
                    value={signatureMessage}
                    onChange={(e) => setSignatureMessage(e.target.value)}
                    className="w-full bg-white/70 border border-white/40 rounded-xl px-3 py-2.5 text-[16px] sm:text-[17px] font-cormorant focus:ring-1 focus:ring-sky-300 focus:outline-hidden text-slate-805"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-[15px] sm:text-[16px] font-cormorant rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-white/30"
                >
                  <span>Firmar Libro</span>
                </button>
              </form>

              {wishes.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-[17px] sm:text-[18px] text-slate-500 font-bold font-cormorant italic">Nadie ha firmado el libro aún. ¡Sé el primero!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {wishes.map((wish) => (
                    <div
                      key={wish.id}
                      className="p-3 rounded-2xl border bg-white/35 border-white/20 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <p className="font-bold text-slate-800 font-cormorant text-[20px] sm:text-[22px] leading-tight">
                          {wish.name}
                        </p>
                        <span className="text-[12px] sm:text-[13px] text-slate-450 font-cormorant italic">
                          {wish.timestamp ? new Date(wish.timestamp).toLocaleDateString('es-ES', {month: 'short', day: 'numeric'}) : ''}
                        </span>
                      </div>
                      {wish.message && (
                        <p className="text-[18px] sm:text-[20px] text-slate-650 font-cormorant bg-white/60 p-2.5 rounded-xl border border-white/20 font-medium italic mt-1.5 leading-relaxed">
                          " {wish.message} "
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Countdown moved below gift registry and guestbook section */}
            <div className="mb-2 px-1">
              <HourglassCountdown targetDateStr={details.timestamp} />
            </div>

          </div>

          {/* Elegant Footer */}
          <footer className="mt-14 text-center py-6 select-all flex flex-col items-center justify-center relative z-25">
            <p className="font-bold text-[19px] text-slate-700 font-cormorant italic leading-relaxed text-center whitespace-pre-line">
              Elaborado con amor para el Baby Shower de {details.babyName}
            </p>
          </footer>

          {/* Several floating white and blue clouds decoration behind the footer content */}
          <BottomClouds />

        </div>
      )}

    </div>
  );
}
