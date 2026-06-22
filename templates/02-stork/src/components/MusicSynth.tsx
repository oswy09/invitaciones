import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, CornerDownRight } from 'lucide-react';

export const MusicSynth: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoplayAttemptedRef = useRef(false);

  useEffect(() => {
    // Create audio instance with John Lennon - Beautiful Boy MP3
    const audio = new Audio('https://res.cloudinary.com/ddqbnr9vo/video/upload/v1779927259/BEAUTIFUL_BOY_JOHN_LENNON_fb85tn.mp3');
    audio.loop = true;
    audio.volume = 0.4;
    audio.preload = 'auto';
    audio.setAttribute('playsinline', 'true');
    audioRef.current = audio;

    const tryAutoplay = (forceMuted = true) => {
      if (!audioRef.current) {
        return;
      }

      const currentAudio = audioRef.current;
      if (!currentAudio.paused) {
        setIsPlaying(true);
        return;
      }

      if (forceMuted) {
        currentAudio.muted = true;
        currentAudio.volume = 0;
      }

      currentAudio
        .play()
        .then(() => {
          if (forceMuted) {
            window.setTimeout(() => {
              if (!audioRef.current) {
                return;
              }
              audioRef.current.muted = false;
              audioRef.current.volume = 0.4;
            }, 120);
          }
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Reproduccion automatica bloqueada por el navegador:', err);
          setIsPlaying(false);
        });
    };

    // Try autoplay immediately on invitation mount.
    if (!autoplayAttemptedRef.current) {
      autoplayAttemptedRef.current = true;
      tryAutoplay(true);
      window.setTimeout(() => tryAutoplay(true), 500);
    }

    // If blocked by policy, resume on earliest interaction.
    const resumeFromGesture = () => {
      if (!audioRef.current || !audioRef.current.paused) return;
      tryAutoplay(false);
    };

    window.addEventListener('pointerdown', resumeFromGesture, { once: true, passive: true });
    window.addEventListener('touchstart', resumeFromGesture, { once: true, passive: true });
    window.addEventListener('keydown', resumeFromGesture, { once: true });
    window.addEventListener('click', resumeFromGesture, { once: true, passive: true });
    window.addEventListener('scroll', resumeFromGesture, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', resumeFromGesture);
      window.removeEventListener('touchstart', resumeFromGesture);
      window.removeEventListener('keydown', resumeFromGesture);
      window.removeEventListener('click', resumeFromGesture);
      window.removeEventListener('scroll', resumeFromGesture);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.muted = false;
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const togglePlayback = () => {
    setIsPlaying(prev => !prev);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-45 px-4 pb-5 select-none pointer-events-none">
      {/* Centered glassmorphic floating playback capsule with spring introduction */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 100, damping: 15 }}
        className="max-w-[480px] mx-auto bg-white/95 backdrop-blur-lg border border-sky-150/80 shadow-[0_12px_40px_rgba(14,165,233,0.2)] rounded-3xl p-3 flex items-center justify-between gap-3 font-cormorant relative overflow-hidden pointer-events-auto"
      >
        {/* Animated outer glowing border */}
        {isPlaying && (
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-radial from-sky-100/30 via-transparent to-pink-50/10 pointer-events-none" 
          />
        )}
        
        {/* Playful inner dashed line frame */}
        <div className="absolute inset-1 border border-dashed border-sky-200/50 rounded-[20px] pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          
          {/* Animated Vinyl Disk / Record disk spinning */}
          <div className="relative w-12 h-12 flex-shrink-0">
            <motion.div 
              animate={isPlaying ? { rotate: [0, 360] } : { rotate: 0 }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
              className={`w-full h-full rounded-full bg-gradient-to-br from-sky-300 via-blue-500 to-blue-700 border-2 border-white flex items-center justify-center shadow-md relative ${
                isPlaying ? 'ring-3 ring-sky-200' : ''
              }`}
            >
              <div className="absolute top-[6px] right-[8px] w-1.5 h-1.5 rounded-full bg-white/95 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />

              {/* Disc grooved circles */}
              <div className="absolute inset-1 border border-blue-100/70 rounded-full" />
              <div className="absolute inset-2.5 border border-blue-100/70 rounded-full" />
              <div className="absolute inset-4 border border-blue-100/70 rounded-full" />
              
              {/* Center elegant metallic center hole */}
              <div className="w-4 h-4 rounded-full bg-sky-100 border border-white/90 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-800" />
              </div>
            </motion.div>

            {/* Floating musical notes */}
            {isPlaying && (
              <>
                <motion.div
                  animate={{ y: [-10, -28], x: [0, 10], opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeOut" }}
                  className="absolute -top-1 -right-1 text-sky-500 font-bold text-sm"
                >
                  ♪
                </motion.div>
                <motion.div
                  animate={{ y: [-8, -24], x: [0, -10], opacity: [0, 1, 0], scale: [0.8, 1.1, 0.8] }}
                  transition={{ repeat: Infinity, duration: 2.0, ease: "easeOut", delay: 0.6 }}
                  className="absolute -top-1 -left-1 text-pink-400 font-bold text-[11px]"
                >
                  ♬
                </motion.div>
              </>
            )}
          </div>

          {/* Song text info using elegant Cormorant font for text */}
          <div className="text-left font-cormorant leading-tight">
            <p className="text-sm font-bold text-slate-800 tracking-wide mt-1 font-fredoka">
              “Beautiful Boy”
            </p>
            <p className="text-xs text-slate-500 font-medium italic mt-0.5 leading-none">
              John Lennon
            </p>
          </div>

        </div>

        {/* Action button & Animated Equalizer bars */}
        <div className="flex items-center gap-3 relative z-10">
          
          {/* Animated sound waves equalizer */}
          <div className="flex items-end gap-[2px] h-4.5 w-8 px-1">
            {[1, 2, 3, 4].map((bar) => (
              <motion.span
                key={bar}
                animate={{
                  height: isPlaying 
                    ? [4, bar * 4.5, 3, bar * 3 + 2, 4] 
                    : 4
                }}
                transition={{
                  duration: 0.5 + bar * 0.12,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`w-[3px] rounded-full ${
                  bar % 2 === 0 ? 'bg-sky-500' : 'bg-pink-400'
                }`}
              />
            ))}
          </div>

          {!isPlaying && (
            <div className="flex items-center gap-1 text-sky-600">
              <CornerDownRight className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-wide">dar play</span>
            </div>
          )}

          {/* Mute/Play controller */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlayback}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm border ${
              isPlaying 
                ? 'bg-sky-500 text-white border-sky-400' 
                : 'bg-sky-50 text-sky-600 border-sky-100 hover:bg-sky-100/80'
            }`}
            title={isPlaying ? "Pausar música" : "Dar play"}
            aria-label={isPlaying ? 'Pausar musica' : 'Reproducir musica'}
            id="btn-bottom-audio-mute"
          >
            {isPlaying ? (
              <Pause className="w-4.5 h-4.5 animate-pulse" />
            ) : (
              <Play className="w-4.5 h-4.5" />
            )}
          </motion.button>

        </div>

      </motion.div>
    </div>
  );
};
