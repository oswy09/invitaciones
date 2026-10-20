import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DEFAULT_LOVING_INVITATION } from './constants';
import { LovingInvitationData, LocationDetail } from './types';
import { TornEdge } from './components/TornEdge';
import {
  TopPlantDecoration,
  TopHangingEucalyptus,
  SideEucalyptusSprig,
  BotanicalWreathDivider,
  HeartDivider,
} from './components/WatercolorFoliage';
import { ItinerarySection } from './components/ItinerarySection';
import { LocationModal } from './components/LocationModal';
import { GiftModal } from './components/GiftModal';
import { RSVPModal } from './components/RSVPModal';
import { AudioPlayer } from './components/AudioPlayer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [data] = useState<LovingInvitationData>(DEFAULT_LOVING_INVITATION);
  const [activeLocation, setActiveLocation] = useState<LocationDetail | null>(null);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!entered) return;
    const ctx = gsap.context(() => {
      // No initial opacity animation — overlay handles the entrance UX

      // Floating plant gentle sway
      gsap.to('.gsap-plant-top', {
        y: -8, rotation: 1.5, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut',
      });

      // Scroll-triggered sections — slide up only (no opacity, to avoid invisible elements)
      const sections = gsap.utils.toArray<HTMLElement>('.gsap-section');
      sections.forEach((el) => {
        gsap.from(el, {
          y: 30, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
        });
      });

      // Couple names — slide only
      gsap.from('.gsap-bride-name', { x: -20, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.gsap-bride-name', start: 'top 90%' } });
      gsap.from('.gsap-groom-name', { x: 20, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.gsap-groom-name', start: 'top 90%' } });
      gsap.from('.gsap-date', { scale: 0.92, duration: 0.6, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.gsap-date', start: 'top 90%' } });

      // Side foliage gentle float
      gsap.to('.gsap-foliage-right', { y: -10, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.5 });
      gsap.to('.gsap-foliage-left', { y: -10, duration: 4.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.2 });

      // Photo parallax subtle
      gsap.to('.gsap-photo', {
        y: -20,
        ease: 'none',
        scrollTrigger: { trigger: '.gsap-photo', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
      });

    }, mainRef);

    return () => ctx.revert();
  }, [entered]);

  if (!entered) {
    return (
      <div className="min-h-screen w-full relative flex items-center justify-center p-0 sm:p-6 md:p-8 bg-[#182017] selection:bg-[#7F8F7B] selection:text-white overflow-hidden select-none">
        {/* Desktop ambient blurred background */}
        <div className="fixed inset-0 pointer-events-none hidden sm:block z-0">
          <img
            src="/images/intro-boda.png"
            alt=""
            className="w-full h-full object-cover blur-3xl scale-125 opacity-35"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(30,40,28,0.45) 0%, rgba(18,24,17,0.85) 60%, rgba(12,16,11,0.96) 100%)',
            }}
          />
        </div>

        {/* Mobile-sized Card (Intro) */}
        <div
          className="relative z-10 w-full sm:max-w-[420px] h-screen sm:h-[840px] sm:max-h-[92vh] overflow-hidden sm:rounded-[32px] sm:shadow-[0_25px_70px_rgba(0,0,0,0.65)] sm:border sm:border-white/10 flex flex-col items-center justify-end select-none"
          style={{ cursor: 'pointer' }}
          onClick={() => setEntered(true)}
        >
          {/* Imagen de fondo del card */}
          <img
            src="/images/intro-boda.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ zIndex: 0 }}
          />

        {/* Overlay sutilísimo inferior para dar un ligero toque de profundidad sin tapar el fondo */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: '20%',
            background: 'linear-gradient(to top, rgba(20,28,18,0.2) 0%, transparent 100%)',
            zIndex: 1,
          }}
        />

        {/* Texto portada — alineado con precisión en el área limpia de papel, libre de la cuerda y el sello */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-10 pl-[25%] pr-[5%] select-none pointer-events-none"
          style={{ paddingBottom: '105px' }}
        >
          {/* Encabezado */}
          <p className="font-cinzel text-[10px] sm:text-[10.5px] tracking-[0.32em] font-bold uppercase mb-1" style={{ color: '#121A0F' }}>
            Con inmensa alegría
          </p>
          <p className="font-cinzel text-[9.5px] sm:text-[10px] tracking-[0.26em] font-semibold uppercase mb-3" style={{ color: '#162213' }}>
            Los invitamos a nuestra boda
          </p>

          {/* Separador */}
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-[1.5px]" style={{ background: '#121A0F' }} />
            <span style={{ color: '#121A0F', fontSize: 9 }}>&#9829;</span>
            <div className="w-8 h-[1.5px]" style={{ background: '#121A0F' }} />
          </div>

          {/* Nombres con caligrafía fluida, oscuros y nítidos */}
          <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: '56px', lineHeight: 0.98, color: '#10170E' }}>
            {data.brideName}
          </div>
          <p className="font-garamond italic text-[15px] font-bold my-0.5" style={{ color: '#162213' }}>y</p>
          <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: '56px', lineHeight: 0.98, color: '#10170E' }}>
            {data.groomName}
          </div>

          {/* Separador */}
          <div className="flex items-center gap-2 mt-2.5 mb-2.5">
            <div className="w-8 h-[1.5px]" style={{ background: '#121A0F' }} />
            <span style={{ color: '#121A0F', fontSize: 9 }}>&#9829;</span>
            <div className="w-8 h-[1.5px]" style={{ background: '#121A0F' }} />
          </div>

          {/* Fecha: Destacada, libre del adorno/sello */}
          <div className="flex flex-col items-center my-1 text-center">
            <p className="font-cinzel text-[12.5px] sm:text-[13px] tracking-[0.34em] font-bold uppercase mb-1" style={{ color: '#10170E' }}>
              {data.date.dayOfWeek}
            </p>

            <div className="flex items-center justify-center gap-2 mb-1" style={{ color: '#10170E' }}>
              <span className="font-cinzel text-[21px] sm:text-[23px] font-bold tracking-tight">{data.date.day}</span>
              <span className="text-[12px] opacity-45 font-serif mx-0.5">•</span>
              <span className="font-cinzel text-[13.5px] sm:text-[14.5px] font-bold tracking-[0.24em] uppercase">{data.date.month}</span>
              <span className="text-[12px] opacity-45 font-serif mx-0.5">•</span>
              <span className="font-cinzel text-[18px] sm:text-[19px] font-bold tracking-tight">{data.date.year}</span>
            </div>

            <p className="font-cinzel text-[10px] sm:text-[10.5px] tracking-[0.24em] font-bold uppercase" style={{ color: '#162213' }}>
              {data.ceremony.time}
            </p>
          </div>

          {/* Lugar */}
          <div className="flex flex-col items-center mt-2 text-center">
            <p className="font-cinzel text-[10.5px] sm:text-[11px] tracking-[0.2em] uppercase font-bold text-center" style={{ color: '#10170E' }}>
              {data.ceremony.placeName}
            </p>
            <p className="font-cinzel text-[9px] sm:text-[9.5px] tracking-[0.14em] uppercase font-semibold text-center mt-0.5" style={{ color: '#162213' }}>
              {data.ceremony.cityState}
            </p>
          </div>
        </div>

        {/* Botón circular elegante y animado */}
        <div className="relative z-20 mb-8 sm:mb-10 flex flex-col items-center gap-2 pl-[25%] pr-[5%]">
          {/* Contenedor relativo para el botón y las ondas concéntricas animadas */}
          <div className="relative flex items-center justify-center">
            {/* Onda expansiva dorada 1 */}
            <div
              className="absolute rounded-full border border-[#C4A76C]/60 pointer-events-none"
              style={{
                width: '100%',
                height: '100%',
                animation: 'ripple-pulse-1 2.4s cubic-bezier(0.1, 0.4, 0.8, 1) infinite',
              }}
            />
            {/* Onda expansiva dorada 2 */}
            <div
              className="absolute rounded-full border border-[#D8B979]/45 pointer-events-none"
              style={{
                width: '100%',
                height: '100%',
                animation: 'ripple-pulse-2 2.4s cubic-bezier(0.1, 0.4, 0.8, 1) 0.9s infinite',
              }}
            />
            {/* Resplandor suave aura dorada */}
            <div
              className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#C4A76C]/25 to-[#E8D49E]/25 blur-[4px] pointer-events-none"
              style={{
                animation: 'glow-fade 2.4s ease-in-out infinite',
              }}
            />

            {/* Botón circular principal */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEntered(true);
              }}
              className="relative w-[76px] h-[76px] sm:w-[82px] sm:h-[82px] rounded-full bg-gradient-to-b from-[#253622] via-[#1B271A] to-[#111A0F] border-[2px] border-[#C4A76C] shadow-[0_10px_26px_rgba(15,22,14,0.6),0_0_18px_rgba(196,167,108,0.35)] flex flex-col items-center justify-center group active:scale-95 hover:scale-105 transition-all duration-300"
              style={{
                cursor: 'pointer',
                animation: 'button-breathe 2.4s ease-in-out infinite',
              }}
              title="Toca para abrir la invitación"
            >
              {/* Aro dorado interno fino */}
              <div className="absolute inset-[3px] rounded-full border border-[#C4A76C]/40 pointer-events-none" />

              {/* Icono de sobre de boda con sello */}
              <svg
                className="w-5 h-5 text-[#E8D49E] mb-0.5 group-hover:scale-110 transition-transform duration-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.5 12V7a2 2 0 0 0-2-2h-15a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7" />
                <path d="m3 7 9 6 9-6" />
                <circle cx="18" cy="18" r="3" fill="#C4A76C" stroke="none" />
                <path d="m16.5 18 1 1 2-2" stroke="#1C271A" strokeWidth="1.5" />
              </svg>

              {/* Texto Abrir */}
              <span className="font-cinzel text-[9.5px] sm:text-[10px] font-bold tracking-[0.24em] uppercase text-[#F8F5EE] leading-none">
                Abrir
              </span>
            </button>
          </div>

          {/* Micro texto indicador con sutil rebote */}
          <div
            className="flex items-center gap-1 opacity-85"
            style={{ animation: 'bounce-hint 2s ease-in-out infinite' }}
          >
            <span className="font-cinzel text-[8.5px] sm:text-[9px] tracking-[0.26em] uppercase text-[#141C13] font-bold drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
              Toca para abrir
            </span>
          </div>
        </div>

        <style>{`
          @keyframes button-breathe {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 10px 26px rgba(15,22,14,0.6), 0 0 18px rgba(196,167,108,0.35);
            }
            50% {
              transform: scale(1.06);
              box-shadow: 0 14px 32px rgba(15,22,14,0.75), 0 0 26px rgba(196,167,108,0.6);
            }
          }
          @keyframes ripple-pulse-1 {
            0% {
              transform: scale(0.95);
              opacity: 0.85;
            }
            100% {
              transform: scale(1.52);
              opacity: 0;
            }
          }
          @keyframes ripple-pulse-2 {
            0% {
              transform: scale(0.95);
              opacity: 0.75;
            }
            100% {
              transform: scale(1.85);
              opacity: 0;
            }
          }
          @keyframes glow-fade {
            0%, 100% {
              opacity: 0.35;
              transform: scale(1);
            }
            50% {
              opacity: 0.85;
              transform: scale(1.08);
            }
          }
          @keyframes bounce-hint {
            0%, 100% {
              transform: translateY(0);
              opacity: 0.7;
            }
            50% {
              transform: translateY(3px);
              opacity: 1;
            }
          }
        `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative flex justify-center py-0 sm:py-8 px-0 sm:px-4 bg-[#182017] selection:bg-[#7F8F7B] selection:text-white">
      {/* Desktop ambient blurred background */}
      <div className="fixed inset-0 pointer-events-none hidden sm:block z-0">
        <img
          src="/images/intro-boda.png"
          alt=""
          className="w-full h-full object-cover blur-3xl scale-125 opacity-25"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(30,40,28,0.45) 0%, rgba(18,24,17,0.85) 60%, rgba(12,16,11,0.96) 100%)',
          }}
        />
      </div>

      {/* Main Single Sheet Paper Invitation Container - Mobile Sized on Desktop */}
      <main
        ref={mainRef}
        className="relative z-10 w-full sm:max-w-[420px] bg-[#FBF8F2] text-[#2D382B] shadow-2xl sm:shadow-[0_25px_80px_rgba(0,0,0,0.7)] overflow-hidden sm:rounded-[28px] sm:border sm:border-[#D4DDD2]/40 pb-10"
      >
        
        {/* ========================================================================= */}
        {/* 1. TOP FOLIAGE & BIBLE VERSE */}
        {/* ========================================================================= */}
        <div className="relative pt-6 px-7 pb-4">
          {/* Top Plant Decoration - real image, no clipping container */}
          <TopPlantDecoration
            className="absolute top-0 left-0 z-10 pointer-events-none gsap-plant-top"
            style={{ width: '62%', maxWidth: 240, height: 'auto' }}
          />

          {/* Scripture Verse */}
          <div className="relative z-10 text-center max-w-[290px] mx-auto mt-2 pt-2 gsap-verse">
            <div className="rounded-2xl px-4 py-3" style={{ background: 'rgba(251,248,242,0.42)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.45)' }}>
              <p className="font-garamond text-[15px] sm:text-[16px] tracking-wide text-[#2D3C2B] leading-relaxed italic" style={{ textShadow: 'none' }}>
                {data.bibleQuote.text}
              </p>
              <span className="block font-cinzel text-[11px] tracking-[0.24em] font-semibold text-[#4E6149] uppercase mt-2">
                {data.bibleQuote.reference}
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. MONOGRAM D | M  ANIMATED HEART + INITIALS */}
          {/* ========================================================================= */}
          <div className="mt-7 text-center select-none gsap-monogram">
            {/* Heart with sparkles */}
            <div className="relative flex justify-center mb-3">
              <svg width="48" height="44" viewBox="0 0 48 44" fill="none" className="monogram-heart">
                <path d="M24 40C24 40 4 26 4 14a10 10 0 0 1 20-2 10 10 0 0 1 20 2c0 12-20 26-20 26z"
                  fill="#b8ceb4" opacity="0.35" className="heart-fill" />
                <path d="M24 40C24 40 4 26 4 14a10 10 0 0 1 20-2 10 10 0 0 1 20 2c0 12-20 26-20 26z"
                  stroke="#8aaa86" strokeWidth="1.2" fill="none" />
              </svg>
              {/* Sparkles */}
              <span className="sparkle sparkle-1 absolute text-[10px]" style={{ top: -6, left: '42%' }}>&#10022;</span>
              <span className="sparkle sparkle-2 absolute text-[8px]" style={{ top: 2, right: '33%' }}>&#10022;</span>
              <span className="sparkle sparkle-3 absolute text-[7px]" style={{ bottom: 2, left: '30%' }}>&#10022;</span>
            </div>
            {/* Initials  draw/stroke reveal effect */}
            <div className="flex items-center justify-center gap-4 monogram-letters">
              <span className="font-script text-6xl sm:text-7xl text-[#242E22] leading-none letter-draw letter-left">{data.monogram.left}</span>
              <div className="flex flex-col items-center gap-1">
                <div className="w-[1px] h-5 bg-[#3E4C3C]/40" />
                <span className="text-[#8aaa86] text-[8px]">&#9829;</span>
                <div className="w-[1px] h-5 bg-[#3E4C3C]/40" />
              </div>
              <span className="font-script text-6xl sm:text-7xl text-[#242E22] leading-none letter-draw letter-right">{data.monogram.right}</span>
            </div>
            <span className="block font-cinzel text-[12px] tracking-[0.3em] text-[#1E2B1C] uppercase mt-3 font-semibold letter-draw letter-sub">
              {data.monogram.subtitle}
            </span>
          </div>

          <style>{`
            .monogram-heart { animation: heart-pulse 2.4s ease-in-out infinite; transform-origin: center bottom; }
            @keyframes heart-pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.08);} }
            .sparkle { color: #a0c09c; animation: sparkle-twinkle 1.8s ease-in-out infinite; }
            .sparkle-1 { animation-delay: 0s; }
            .sparkle-2 { animation-delay: 0.6s; }
            .sparkle-3 { animation-delay: 1.2s; }
            @keyframes sparkle-twinkle { 0%,100%{opacity:0.2;transform:scale(0.8) rotate(0deg);} 50%{opacity:1;transform:scale(1.3) rotate(20deg);} }

            .letter-draw { display:inline-block; padding: 0.15em 0.05em 0.25em; }
          `}</style>
        </div>

        {/* ========================================================================= */}
        {/* 3. COUPLE PHOTO #1 (BENCH) WITH TORN PAPER EDGES + FLORAL OVERLAYS */}
        {/* ========================================================================= */}
        <div className="relative w-full my-4 select-none">
          {/* Top Torn Edge */}
          <TornEdge direction="top" fill="#FBF8F2" height={48} className="relative z-10 -mb-[1px]" />

          {/* Image Container */}
          <div className="relative w-full h-[260px] sm:h-[290px] overflow-hidden bg-[#DCE4DA] gsap-photo">
            <img
              src={data.photos.bench}
              alt={`${data.brideName} y ${data.groomName}`}
              className="w-full h-full object-cover object-[center_30%] transform hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Subtle soft vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/15 pointer-events-none" />
            {/* Cloud / cotton torn paper overlay at bottom */}
            <svg
              viewBox="0 0 430 58"
              preserveAspectRatio="none"
              className="absolute bottom-0 left-0 w-full pointer-events-none select-none"
              style={{ height: 58, zIndex: 5 }}
            >
              <path
                d="M0,58 L0,36
                  Q10,20 24,30 Q34,38 46,22 Q56,10 70,24 Q80,35 94,18 Q106,6 120,20 Q132,32 146,16 Q158,4 172,18 Q184,30 198,14 Q210,2 224,16 Q238,28 252,12 Q264,1 278,16 Q292,30 306,14 Q318,2 334,18 Q346,30 360,16 Q372,5 386,20 Q398,32 414,18 Q424,8 430,22
                  L430,58 Z"
                fill="#FBF8F2"
              />
            </svg>
          </div>

          {/* Bottom Torn Edge */}
          <TornEdge direction="bottom" fill="#FBF8F2" height={48} className="relative z-10 -mt-[1px]" />
        </div>

        {/* ========================================================================= */}
        {/* 4. WELCOME & PARENTS */}
        {/* ========================================================================= */}
        <div className="relative px-7 py-2 text-center">
          {/* Side Foliage Decor */}
          <div className="absolute top-16 -right-6 pointer-events-none z-10 gsap-foliage-right">
            <SideEucalyptusSprig position="right" className="w-24 sm:w-28 opacity-75" />
          </div>

          <p className="font-garamond italic text-[16px] text-[#2A3828] leading-relaxed max-w-[300px] mx-auto" style={{fontWeight: 400}}>
            {data.welcomeText}
          </p>

          <HeartDivider className="my-5" />

          {/* Parents Columns */}
          <div className="grid grid-cols-2 gap-4 text-center max-w-[320px] mx-auto">
            {/* Groom's Parents */}
            <div>
              <span className="block font-montserrat text-[10px] tracking-[0.16em] text-[#4A5E47] uppercase font-bold mb-1">
                {data.groomParents.label}
              </span>
              <p className="font-garamond text-[14px] text-[#2D382B] leading-snug whitespace-pre-line">
                {data.groomParents.names}
              </p>
            </div>

            {/* Bride's Parents */}
            <div>
              <span className="block font-montserrat text-[10px] tracking-[0.16em] text-[#4A5E47] uppercase font-bold mb-1">
                {data.brideParents.label}
              </span>
              <p className="font-garamond text-[14px] text-[#2D382B] leading-snug whitespace-pre-line">
                {data.brideParents.names}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4B. INVITE HONOR TEXT (DESPUÉS DE LOS PADRES) */}
        {/* ========================================================================= */}
        <div className="pt-6 pb-2 text-center select-none gsap-section">
          <p className="font-cinzel text-[12px] sm:text-[13px] tracking-[0.26em] text-[#3A4E38] uppercase font-bold max-w-[280px] mx-auto">
            {data.inviteHonorText}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 5. COUPLE NAMES (CALLIGRAPHY SCRIPT) */}
        {/* ========================================================================= */}
        <div className="relative text-center py-4 select-none">
          {/* Side Foliage Decor Left */}
          <div className="absolute top-2 -left-8 pointer-events-none z-10 gsap-foliage-left">
            <SideEucalyptusSprig position="left" className="w-24 sm:w-28 opacity-70" />
          </div>

          <div className="relative z-10">
            <h1 className="font-script text-[72px] sm:text-[84px] text-[#1E2B1C] font-normal leading-none drop-shadow-sm gsap-bride-name" style={{ letterSpacing: '-0.01em' }}>
              {data.brideName}
            </h1>
            <div className="font-great-vibes text-5xl sm:text-6xl text-[#4A5E47] my-0 leading-none gsap-ampersand" style={{ lineHeight: 1.1 }}>
              &amp;
            </div>
            <h2 className="font-script text-[72px] sm:text-[84px] text-[#1E2B1C] font-normal leading-none drop-shadow-sm gsap-groom-name" style={{ letterSpacing: '-0.01em' }}>
              {data.groomName}
            </h2>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5B. GUEST NAME (DESPUÉS DE LOS NOVIOS) */}
        {/* ========================================================================= */}
        <div className="px-7 pt-2 pb-4 text-center gsap-section">
          <div className="inline-block border border-[#C8D5C4] rounded-xl px-7 py-3 shadow-sm" style={{ background: 'rgba(255,255,255,0.7)' }}>
            <span className="block font-cinzel text-[11px] tracking-[0.32em] text-[#4A5E47] uppercase mb-1.5 font-bold">Para</span>
            <span className="font-garamond text-[22px] text-[#1E2B1C] leading-tight block" style={{ fontWeight: 600 }}>{data.guestName}</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5C. MUSIC PLAYER (INLINE) */}
        {/* ========================================================================= */}
        <AudioPlayer musicUrl={data.musicUrl} title={data.musicTitle} autoPlay={entered} />

        {/* ========================================================================= */}
        {/* 6. DATE BADGE WITH FRAMED NUMBER */}
        {/* ========================================================================= */}
        <div className="py-3 text-center select-none max-w-[300px] mx-auto gsap-date">
          <span className="block font-cinzel text-[16px] tracking-[0.32em] text-[#131E11] uppercase font-bold mb-2">
            {data.date.month}
          </span>

          {/* Day / Date / Year Layout */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex-1 flex items-center">
              <div className="w-full h-[1.5px] bg-[#6B7E66]" />
              <span className="font-cinzel text-[13px] sm:text-[14px] tracking-[0.22em] font-bold text-[#131E11] uppercase px-2.5 whitespace-nowrap">
                {data.date.dayOfWeek}
              </span>
            </div>

            <span className="font-garamond text-5xl sm:text-6xl font-bold text-[#131E11] px-1 leading-none">
              {data.date.day}
            </span>

            <div className="flex-1 flex items-center">
              <span className="font-cinzel text-[13px] sm:text-[14px] tracking-[0.22em] font-bold text-[#131E11] uppercase px-2.5 whitespace-nowrap">
                {data.date.year}
              </span>
              <div className="w-full h-[1.5px] bg-[#6B7E66]" />
            </div>
          </div>

          <BotanicalWreathDivider className="mt-3 mb-1" />

          {/* Wedding date signature */}
          <div className="font-garamond italic text-base text-[#5a6e58]" style={{ fontWeight: 400 }}>
            {data.date.dayOfWeek} · {data.date.day} · {data.date.month} · {data.date.year}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 7. CEREMONY & RECEPTION */}
        {/* ========================================================================= */}
        <div className="pt-8 pb-4 px-6 text-center space-y-6 gsap-section">
          {/* Religious Ceremony */}
          <div className="space-y-1.5">
            <span className="block font-montserrat text-[13px] tracking-[0.16em] font-bold text-[#1E2B1C] uppercase">
              {data.ceremony.time}
            </span>
            <h3 className="font-cinzel text-[13px] tracking-[0.2em] font-bold text-[#1E2B1C] uppercase">
              {data.ceremony.title}
            </h3>
            <p className="font-garamond text-[18px] font-semibold text-[#1E2B1C]">
              {data.ceremony.placeName}
            </p>
            <p className="font-montserrat text-[12px] tracking-wide text-[#3D4E3A]">
              {data.ceremony.address} <br />
              {data.ceremony.cityState}
            </p>

            {/* View Location Button */}
            <div className="pt-2">
              <button
                onClick={() => setActiveLocation(data.ceremony)}
                className="inline-flex items-center justify-center py-2 px-7 rounded-full bg-[#2F3A2D] text-[#FBF8F2] text-[10px] font-montserrat uppercase tracking-[0.18em] font-semibold hover:bg-[#3D4C3B] active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <span>Ver ubicación</span>
              </button>
            </div>
          </div>

          <HeartDivider />

          {/* Reception */}
          <div className="space-y-1.5">
            <span className="block font-montserrat text-[11px] tracking-[0.16em] font-semibold text-[#2D382B] uppercase">
              {data.reception.time}
            </span>
            <h3 className="font-cinzel text-[13px] tracking-[0.2em] font-bold text-[#1E2B1C] uppercase">
              {data.reception.title}
            </h3>
            <p className="font-garamond text-[18px] font-semibold text-[#1E2B1C]">
              {data.reception.placeName}
            </p>
            <p className="font-montserrat text-[12px] tracking-wide text-[#3D4E3A]">
              {data.reception.address} <br />
              {data.reception.cityState}
            </p>

            {/* View Location Button */}
            <div className="pt-2">
              <button
                onClick={() => setActiveLocation(data.reception)}
                className="inline-flex items-center justify-center py-2 px-7 rounded-full bg-[#2F3A2D] text-[#FBF8F2] text-[10px] font-montserrat uppercase tracking-[0.18em] font-semibold hover:bg-[#3D4C3B] active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <span>Ver ubicación</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 8. ITINERARY OF ACTIVITIES (WATERCOLOR WASH BLOCK) */}
        {/* ========================================================================= */}
        <ItinerarySection items={data.itinerary} />

        {/* ========================================================================= */}
        {/* 9. RESERVED SEATS */}
        {/* ========================================================================= */}
        <div className="py-4 px-6 text-center space-y-3 gsap-section">
          {/* Chair Icon */}
          <div className="flex justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2D382B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              {/* Dining/Ceremony Chair */}
              <path d="M7 3h10v8H7z" />
              <path d="M5 11h14v4H5z" />
              <path d="M6 15v6" />
              <path d="M18 15v6" />
              <line x1="9" y1="5" x2="9" y2="9" />
              <line x1="15" y1="5" x2="15" y2="9" />
            </svg>
          </div>

          <div>
            <h4 className="font-montserrat text-[13px] tracking-[0.2em] font-bold text-[#1E2B1C] uppercase">
              Puestos reservados
            </h4>
            <span className="font-montserrat text-[11px] tracking-[0.16em] text-[#4A5E47] uppercase block mt-0.5">
              Para ti
            </span>
          </div>

          <div className="pt-1">
            <span className="font-garamond text-4xl text-[#1E2B1C]">{data.reservedSeatsCount}</span>
            <span className="font-montserrat text-[12px] tracking-[0.16em] font-semibold text-[#4A5E47] uppercase ml-2">
              {data.reservedSeatsCount === 1 ? 'puesto' : 'puestos'}
            </span>
          </div>

          <HeartDivider className="pt-2" />
        </div>

        {/* ========================================================================= */}
        {/* 10. DRESS CODE */}
        {/* ========================================================================= */}
        <div className="py-5 px-7 text-center space-y-4 gsap-section">
          {/* Hanger icon */}
          <div className="flex justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2D382B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a2 2 0 0 1 2 2c0 .74-.4 1.4-1 1.73V8l8 6H3l8-6V6.73A2 2 0 0 1 12 3z" />
              <path d="M3 14v1a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1" />
            </svg>
          </div>

          <h4 className="font-cinzel text-[13px] tracking-[0.24em] font-bold text-[#1E2B1C] uppercase">
            Código de Vestimenta
          </h4>

          <div className="flex items-center justify-center gap-5 pt-1">
            {/* Formal dress code swatches */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full border border-[#c8d4c4] shadow-sm" style={{ background: '#2c3e28' }} />
              <span className="font-montserrat text-[10px] tracking-[0.12em] text-[#3D4E3A] uppercase font-semibold">Verde Bosque</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full border border-[#c8d4c4] shadow-sm" style={{ background: '#f2ede4' }} />
              <span className="font-montserrat text-[10px] tracking-[0.12em] text-[#3D4E3A] uppercase font-semibold">Marfil</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full border border-[#c8d4c4] shadow-sm" style={{ background: '#8a9d85' }} />
              <span className="font-montserrat text-[10px] tracking-[0.12em] text-[#3D4E3A] uppercase font-semibold">Salvia</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full border border-[#c8d4c4] shadow-sm" style={{ background: '#4a3b30' }} />
              <span className="font-montserrat text-[10px] tracking-[0.12em] text-[#3D4E3A] uppercase font-semibold">Café Oscuro</span>
            </div>
          </div>

          <p className="font-garamond text-[15px] text-[#2D3C2B] leading-relaxed max-w-[300px] mx-auto italic">
            Formal elegante. Por favor evitar el blanco y colores muy vivos. Tacones con protector de punta recomendados.
          </p>

          <HeartDivider className="pt-1" />
        </div>

        {/* ========================================================================= */}
        {/* 11. CONFIRMATION (RSVP) */}
        {/* ========================================================================= */}
        <div className="py-4 px-7 text-center space-y-3 gsap-section">
          {/* Phone / WhatsApp Icon */}
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full border border-[#2D382B] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D382B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
          </div>

          <h4 className="font-montserrat text-[13px] tracking-[0.2em] font-bold text-[#1E2B1C] uppercase">
            {data.confirmation.title}
          </h4>

          <p className="font-garamond text-[15px] sm:text-[16px] text-[#2D3C2B] leading-relaxed italic">
            {data.confirmation.deadlineText}
          </p>

          <div className="pt-1">
            <button
              onClick={() => setIsRSVPModalOpen(true)}
              className="inline-flex items-center justify-center py-2.5 px-8 rounded-full bg-[#2F3A2D] text-[#FBF8F2] text-[10px] font-montserrat uppercase tracking-[0.18em] font-semibold hover:bg-[#3D4C3B] active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <span>Enviar mensaje</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Closing botanical divider */}
        {/* ========================================================================= */}
        <div className="pt-4 pb-2 text-center gsap-section">
          <BotanicalWreathDivider className="py-2" />
          <span className="block font-cinzel text-[13px] tracking-[0.22em] text-[#1E2B1C] uppercase mt-2 font-bold">
            {data.adultsOnlyNote.footerSignOff}
          </span>
        </div>

        {/* ========================================================================= */}
        {/* 13. COUPLE PHOTO #2 (WAGON) AT BOTTOM */}
        {/* ========================================================================= */}
        <div className="relative w-full mt-2 -mb-10 select-none">
          {/* Top Torn Edge */}
          <TornEdge direction="top" fill="#FBF8F2" height={48} className="relative z-10 -mb-[1px]" />

          {/* Image */}
          <div className="relative w-full h-[250px] sm:h-[270px] overflow-hidden bg-[#DCE4DA]">
            <img
              src={data.photos.wagon}
              alt={`${data.brideName} y ${data.groomName}`}
              className="w-full h-full object-cover object-[center_20%] transform hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Soft bottom shade */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none" />
          </div>
        </div>

      </main>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}
      {activeLocation && (
        <LocationModal
          location={activeLocation}
          onClose={() => setActiveLocation(null)}
        />
      )}

      {isGiftModalOpen && (
        <GiftModal
          isOpen={isGiftModalOpen}
          onClose={() => setIsGiftModalOpen(false)}
          bankAccounts={data.giftSuggestion.bankAccounts}
        />
      )}

      {isRSVPModalOpen && (
        <RSVPModal
          isOpen={isRSVPModalOpen}
          onClose={() => setIsRSVPModalOpen(false)}
          whatsappPhone={data.confirmation.whatsappPhone}
          maxSeats={data.reservedSeatsCount}
          brideName={data.brideName}
          groomName={data.groomName}
        />
      )}
    </div>
  );
}
