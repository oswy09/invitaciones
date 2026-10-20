import React, { useEffect, useRef } from 'react';
import { ItineraryItem, ItineraryIconType } from '../types';
import TornEdge from './TornEdge';

const renderIcon = (type: ItineraryIconType) => {
  switch (type) {
    case 'church':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v5M10 4h4" />
          <path d="M12 7L5 13v9h14V13L12 7z" />
          <path d="M10 22v-6a2 2 0 0 1 4 0v6" />
          <circle cx="12" cy="13" r="1.5" fill="currentColor" opacity="0.4" />
        </svg>
      );
    case 'cocktail':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3h18l-9 10-9-10z" />
          <path d="M12 13v8" />
          <path d="M8 21h8" />
          <path d="M6 1.5L10 6" opacity="0.6" />
          <circle cx="16" cy="6" r="1.5" fill="currentColor" opacity="0.4" />
        </svg>
      );
    case 'entrance':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C9.5 4 7 6 9 9c2 2 5 1 6-1s0-5-3-6z" fill="currentColor" opacity="0.15" />
          <path d="M12 2C9.5 4 7 6 9 9c2 2 5 1 6-1s0-5-3-6z" />
          <path d="M7 8C4.5 10 4 13 6 15c2 2 5 1.5 7 0" />
          <path d="M17 8C19.5 10 20 13 18 15c-2 2-5 1.5-7 0" />
          <path d="M12 15v8" />
          <path d="M9 19h6" />
        </svg>
      );
    case 'dinner':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="13" r="5" />
          <path d="M4 5v8a3 3 0 0 0 3 3v4" />
          <path d="M4 5h3v5" />
          <path d="M5.5 5v4" />
          <path d="M20 5v15" />
          <path d="M18 5h2a2 2 0 0 1 2 2v4h-4" />
        </svg>
      );
    case 'party':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="14" r="6" />
          <path d="M12 4v4" />
          <path d="M5.5 14h13" />
          <path d="M7.5 10h9" />
          <path d="M7.5 18h9" />
          <path d="M4 6l2 2" opacity="0.6" />
          <path d="M20 6l-2 2" opacity="0.6" />
          <path d="M12 2l.5-1M11.5 1l1 2" opacity="0.5" />
        </svg>
      );
    case 'farewell':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s-7-6.686-7-12a7 7 0 0 1 14 0c0 5.314-7 12-7 12z" fill="currentColor" opacity="0.1" />
          <path d="M12 22s-7-6.686-7-12a7 7 0 0 1 14 0c0 5.314-7 12-7 12z" />
          <circle cx="12" cy="10" r="3" fill="currentColor" opacity="0.25" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
  }
};

const iconAnimations: Record<ItineraryIconType, string> = {
  church: 'animate-church',
  cocktail: 'animate-cocktail',
  entrance: 'animate-entrance',
  dinner: 'animate-dinner',
  party: 'animate-party',
  farewell: 'animate-farewell',
};

export const ItinerarySection: React.FC<{ items: ItineraryItem[] }> = ({ items }) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current?.querySelectorAll('.icon-wrapper').forEach((el, i) => {
            (el as HTMLElement).style.transitionDelay = `${i * 0.18}s`;
            el.classList.add('icon-visible');
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full my-6 select-none" ref={sectionRef}>
      <div className="relative w-full py-8 px-6 overflow-hidden">
        {/* Fondo acuarela */}
        <img
          src="/images/background-acuarella.jpg"
          alt=""
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
        />

        <div className="relative z-10 max-w-[340px] mx-auto" style={{ position: 'relative', zIndex: 1 }}>
          <h3 className="font-cinzel text-[13px] tracking-[0.32em] text-[#1A2518] text-center font-bold uppercase mb-8">
            Itinerario
          </h3>

          <div className="space-y-6">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              return (
                <div key={item.id} className="flex items-start gap-5 relative group">
                  {/* Animated icon */}
                  <div className="icon-wrapper w-9 h-9 flex items-center justify-center shrink-0 rounded-full"
                    style={{
                      background: 'rgba(45,56,43,0.08)',
                      color: '#2D382B',
                      opacity: 0,
                      transform: 'scale(0.5) rotate(-15deg)',
                      transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
                    }}>
                    {renderIcon(item.icon)}
                  </div>

                  {/* Timeline line + dot */}
                  <div className="relative flex flex-col items-center shrink-0 self-stretch">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#3D4E3A] border-2 border-[#bfc9bb] z-10 shrink-0 mt-1.5 shadow-sm" />
                    {!isLast && <div className="w-[1px] bg-[#2D382B]/40 flex-grow my-0.5" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-1">
                    <span className="block font-cinzel text-[11px] tracking-[0.18em] font-bold text-[#1A2518] uppercase">
                      {item.time}
                    </span>
                    <span className="block font-garamond text-[17px] text-[#1A2518] font-normal leading-snug">
                      {item.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>


      <style>{`
        .icon-visible {
          opacity: 1 !important;
          transform: scale(1) rotate(0deg) !important;
        }
        .icon-wrapper:nth-child(odd) { --rot-start: 15deg; }
        .icon-wrapper:nth-child(even) { --rot-start: -15deg; }
      `}</style>
    </div>
  );
};

export default ItinerarySection;
