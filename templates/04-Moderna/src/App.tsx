import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RefreshCw, Share2, Heart, Info,
  Check, Copy,
} from 'lucide-react';
import { InvitationData } from './types';
import { THEMES, FONTS, DEFAULT_INVITATION } from './constants';
import Envelope from './components/Envelope';
import InvitationPreview from './components/InvitationPreview';
import { loadEvento } from './lib/loadEvento';
import { usePreviewBridge } from './hooks/usePreviewBridge';

export default function App() {
  const [data, setData] = useState<InvitationData>(DEFAULT_INVITATION);
  const [pagado, setPagado] = useState(true);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [guestName, setGuestName] = useState('');

  const isPreviewMode = new URLSearchParams(window.location.search).get("preview") === "1";

  // Load from Supabase on mount (skipped in preview mode)
  useEffect(() => {
    // Fallback: always hide loader after 4s even if something fails
    const fallback = setTimeout(() => setIsLoading(false), 4000);
    if (isPreviewMode) { clearTimeout(fallback); setIsLoading(false); return; }
    loadEvento().then((result) => {
      setData(result.data);
      setPagado(result.pagado);
      clearTimeout(fallback);
      setTimeout(() => setIsLoading(false), 2500);
    }).catch(() => {
      clearTimeout(fallback);
      setIsLoading(false);
    });
    return () => clearTimeout(fallback);
  }, []);

  // Preview bridge: receives live data from client-form iframe parent
  const handlePreviewUpdate = useCallback((newData: InvitationData, newPagado: boolean) => {
    setData(newData);
    setPagado(newPagado);
    setIsLoading(false);
  }, []);
  const isPreview = usePreviewBridge<InvitationData>(handlePreviewUpdate);

  const currentTheme = THEMES.find(t => t.id === data.selectedThemeId) || THEMES[0];
  const currentFont = FONTS.find(f => f.id === data.selectedFontId) || FONTS[0];

  const shareMessageText = `¡Hola! Con mucha alegría te compartimos nuestra invitación digital de bodas para acompañarnos en nuestro gran día: *${data.brideName} & ${data.groomName}* 💍✨\n\n📅 Fecha: ${data.ceremonyDate}\n🗺️ Lugar: ${data.ceremonyName}\n\nToca el siguiente enlace para abrir tu sobre y ver todos los detalles, mesa de regalos y confirmar tu asistencia:\n${window.location.href}`;

  const copyShareText = () => {
    navigator.clipboard.writeText(shareMessageText);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <div className="relative w-screen h-screen bg-[#fbf9f4] text-stone-800 flex flex-col overflow-hidden font-sans antialiased">
      
      {/* ==================== WEDDING LOADING SCREEN ==================== */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="wedding-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="fixed inset-0 z-[100] bg-[#fbf9f4] flex flex-col items-center justify-center select-none"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,251,247,1)_0%,rgba(244,240,230,1)_100%)]" />
            
            {/* Elegant marble texture overlay */}
            <div className="absolute inset-0 marble-overlay opacity-85 pointer-events-none" />
            
            {/* Elegant Floating gold dust elements */}
            <div className="absolute inset-0 pointer-events-none opacity-85 overflow-hidden">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="gold-dust absolute"
                  style={{
                    width: `${Math.random() * 4 + 4}px`,
                    height: `${Math.random() * 4 + 4}px`,
                    left: `${5 + i * 6}%`,
                    bottom: `${5 + Math.random() * 85}%`,
                    animationDelay: `${i * 0.4}s`,
                    animationDuration: `${Math.random() * 4 + 5}s`,
                    boxShadow: '0 0 8px rgba(140, 102, 45, 0.7), 0 0 16px rgba(92, 64, 21, 0.4)',
                    background: 'radial-gradient(circle, #b8860b 0%, #a0783a 65%, #5c4015 100%)',
                  }}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative flex flex-col items-center justify-center text-center"
            >
              {/* Interlocking Rings and Heart Animation */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Ring Left */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                  className="absolute w-16 h-16 border-[3px] border-[#c4a47c] rounded-full shadow-[0_0_15px_rgba(196,164,124,0.4)]"
                  style={{ left: '15%' }}
                />
                {/* Ring Right */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                  className="absolute w-16 h-16 border-[3px] border-[#c4a47c]/80 rounded-full shadow-[0_0_15px_rgba(196,164,124,0.3)]"
                  style={{ right: '15%' }}
                />
                {/* Center Heart with pulse ripple */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                  className="absolute z-10 text-red-500 fill-current drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                >
                  <Heart size={24} />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN APPLICATION CONTENT VIEWPORT - ENTIRELY DESIGNED AS PRISTINE GUEST EXPERIENCE */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        <AnimatePresence mode="wait">
          
          <motion.div
            key="guest-experience-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-white"
          >
            {/* Extremely Subtle Replay Button in the top right corner so guests or the couple can replay the envelope animation */}
            {isEnvelopeOpened && (
              <div className="absolute top-4 right-4 z-50 select-none">
                <button
                  onClick={() => setIsEnvelopeOpened(false)}
                  className="flex items-center gap-1.5 bg-black/40 hover:bg-black/60 text-white/80 hover:text-white px-3 py-1.5 rounded-full text-[10px] font-medium tracking-wider shadow backdrop-blur-sm transition cursor-pointer uppercase"
                  title="Abrir sobre de nuevo / Replay"
                >
                  <RefreshCw size={10} />
                  <span>Reiniciar Sobre</span>
                </button>
              </div>
            )}

            {/* Envelope Entrance Transition overlay */}
            <AnimatePresence mode="wait">
              {!isEnvelopeOpened ? (
                <Envelope
                  key="closed-envelope"
                  data={data}
                  theme={currentTheme}
                  fontHeading={currentFont.headingClass}
                  onOpen={(name) => {
                    setGuestName(name);
                    setIsEnvelopeOpened(true);
                  }}
                />
              ) : (
                <motion.div
                  key="opened-invitation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="w-full h-full"
                >
                  <InvitationPreview
                    data={data}
                    theme={currentTheme}
                    fontHeading={currentFont.headingClass}
                    fontBody={currentFont.bodyClass}
                    fontSerif={currentFont.serifClass}
                    isInsidePhoneFrame={false}
                    guestName={guestName}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </AnimatePresence>
      </div>

      {/* ==================== SHARE POPUP MODAL ==================== */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-stone-800">
                <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
                  <Share2 className="text-[#c4a47c]" size={18} />
                  Compartir tu Invitación Digital
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">Copia y envía este mensaje a tus invitados para que abran su invitación digital.</p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-2">Mensaje Sugerido para WhatsApp</label>
                  <textarea
                    readOnly
                    rows={6}
                    value={shareMessageText}
                    className="w-full p-3 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-300 font-mono resize-none focus:outline-none"
                  />
                </div>

                <div className="p-4 bg-stone-950/50 border border-stone-800/50 rounded-xl flex items-start gap-2.5 text-xs text-stone-400 leading-relaxed">
                  <Info size={16} className="text-[#c4a47c] shrink-0 mt-0.5" />
                  <p>
                    ¡Esta invitación ya es completamente funcional! Guarda los datos locales para RSVPs y firmas. Al enviarla a tus invitados, ellos verán exactamente el sobre animado en su teléfono móvil.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-stone-950 border-t border-stone-800 flex justify-end gap-3">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg transition"
                >
                  Cerrar
                </button>
                <button
                  onClick={copyShareText}
                  className="px-5 py-2 bg-[#c4a47c] hover:bg-[#b0916a] text-stone-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition"
                >
                  {shareCopied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{shareCopied ? '¡Copiado!' : 'Copiar Mensaje'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
