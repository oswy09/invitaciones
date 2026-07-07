import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Heart, Sparkles, Play } from 'lucide-react';
import { InvitationData, ColorTheme } from '../types';

interface EnvelopeProps {
  key?: string;
  data: InvitationData;
  theme: ColorTheme;
  fontHeading: string;
  onOpen: (guestName: string) => void;
}

export default function Envelope({ data, theme, fontHeading, onOpen }: EnvelopeProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [guestName, setGuestName] = useState('');

  const initials = `${data.brideName.charAt(0)}${data.groomName.charAt(0)}`;

  const handleOpen = () => {
    setIsOpening(true);
    // Wait for the slide-out and flap animations before transitioning to the main view
    setTimeout(() => {
      onOpen(guestName);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fbf9f4] overflow-y-auto px-4 py-6 select-none">
      {/* Background marble-look texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,251,247,1)_0%,rgba(244,240,230,1)_100%)] opacity-95" />
      <div className="absolute inset-0 marble-overlay opacity-85 pointer-events-none" />
      
      {/* Delicate floating gold sparkles in background */}
      <div className="absolute inset-0 pointer-events-none opacity-85 overflow-hidden">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="gold-dust absolute"
            style={{
              width: `${Math.random() * 5 + 4}px`,
              height: `${Math.random() * 5 + 4}px`,
              left: `${Math.random() * 100}%`,
              bottom: `${5 + Math.random() * 85}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${Math.random() * 5 + 6}s`,
              boxShadow: '0 0 8px rgba(140, 102, 45, 0.7), 0 0 16px rgba(92, 64, 21, 0.4)',
              background: 'radial-gradient(circle, #b8860b 0%, #a0783a 65%, #5c4015 100%)',
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8, y: -200 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-full max-w-md md:max-w-lg min-h-[480px] md:min-h-[520px] flex flex-col justify-center z-10"
      >
        {/* Envelope Outer Shadow */}
        <div className="absolute inset-0 bg-black/40 blur-xl rounded-2xl transform translate-y-4" />

        {/* The Envelope */}
        <div className="relative w-full h-full bg-stone-100 rounded-2xl overflow-y-auto border border-stone-200/60 shadow-2xl flex flex-col justify-between p-6 md:p-10 min-h-[480px] md:min-h-[520px] scrollbar-thin">
          {/* Internal diagonal lines giving envelope look */}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.01)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.01)_50%,rgba(0,0,0,0.01)_75%,transparent_75%,transparent)] bg-[size:10px_10px]" />

          {/* Elegant Gold Borders on Envelope Back */}
          <div className="absolute inset-4 border border-[#c4a47c]/30 rounded-md pointer-events-none" />
          <div className="absolute inset-[18px] border-2 border-[#c4a47c]/10 rounded pointer-events-none" />

          {/* Decorative Corner Flairs */}
          <div className="absolute top-6 left-6 text-[#c4a47c]/40">✦</div>
          <div className="absolute top-6 right-6 text-[#c4a47c]/40">✦</div>
          <div className="absolute bottom-6 left-6 text-[#c4a47c]/40">✦</div>
          <div className="absolute bottom-6 right-6 text-[#c4a47c]/40">✦</div>

          {/* Envelope Top - Names */}
          <div className="text-center mt-4">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xs tracking-[0.25em] text-stone-500 uppercase font-medium"
            >
              NUESTRA INVITACIÓN DE BODAS
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className={`text-4xl md:text-5xl text-stone-800 my-2 ${fontHeading}`}
            >
              {data.brideName} & {data.groomName}
            </motion.h1>

            <div className="w-16 h-[1px] bg-[#c4a47c]/40 mx-auto my-3" />
          </div>

          {/* Envelope Middle - Personalized Guest Tag */}
          <div className="flex flex-col items-center justify-center my-4 md:my-6 z-10">
            <div className="w-full max-w-xs text-center">
              <label className="block text-[10px] tracking-widest text-stone-400 uppercase mb-2">
                Escribe tu nombre para personalizar
              </label>
              <input
                type="text"
                placeholder="Invitado de Honor"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full bg-white/50 border border-stone-200 focus:border-[#c4a47c] focus:ring-1 focus:ring-[#c4a47c] text-sm text-stone-800 text-center px-4 py-2 rounded-full shadow-inner outline-none transition"
              />
            </div>

            {guestName && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 px-6 py-1.5 bg-[#f5efe6] border border-[#c4a47c]/20 rounded-md shadow-sm"
              >
                <p className="text-xs text-stone-600 font-serif italic text-center">
                  Reservado con cariño para: <strong className="text-stone-800 not-italic block mt-1 text-sm">{guestName}</strong>
                </p>
              </motion.div>
            )}
          </div>

          {/* Envelope Bottom - Open Button / Wax Seal */}
          <div className="flex flex-col items-center justify-center mb-2 z-10">
            <AnimatePresence mode="wait">
              {!isOpening ? (
                <motion.button
                  key="seal-button"
                  onClick={handleOpen}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group flex flex-col items-center justify-center cursor-pointer focus:outline-none"
                >
                  {/* Glowing Ring */}
                  <div className="absolute inset-0 bg-[#c4a47c]/20 rounded-full blur-md group-hover:bg-[#c4a47c]/35 transition-all duration-300" />
                  
                  {/* Wax Seal Circle */}
                  <div className="relative w-20 h-20 bg-gradient-to-br from-[#8c251e] via-[#6e1c16] to-[#4d100b] rounded-full shadow-[inset_2px_2px_5px_rgba(255,255,255,0.2),3px_5px_15px_rgba(0,0,0,0.4)] border-2 border-[#54120e] flex flex-col items-center justify-center text-[#ffeedd]">
                    <span className="text-[10px] tracking-widest uppercase font-serif opacity-70">ABRIR</span>
                    <span className="text-lg font-bold font-serif tracking-wider select-none leading-none -mt-0.5">{initials}</span>
                    <Heart size={10} className="fill-current text-[#ffeedd]/80 mt-1 pulse-custom" />
                  </div>

                  <span className="mt-2 text-[10px] text-stone-500 tracking-[0.2em] font-medium group-hover:text-[#c4a47c] transition uppercase">
                    Toca para abrir
                  </span>
                </motion.button>
              ) : (
                <motion.div
                  key="opening-loader"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center"
                >
                  {/* Custom opening animation effect */}
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 border-2 border-dashed border-[#c4a47c] rounded-full"
                    />
                    <Sparkles className="text-[#c4a47c] animate-pulse" size={24} />
                  </div>
                  <span className="mt-3 text-xs text-[#c4a47c] tracking-[0.25em] font-serif italic animate-pulse">
                    Abriendo con amor...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Foreground Floating Sparkles over Envelope */}
      <div className="absolute inset-0 pointer-events-none opacity-85 overflow-hidden z-20">
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
    </div>
  );
}
