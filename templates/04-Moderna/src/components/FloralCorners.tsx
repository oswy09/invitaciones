import React from 'react';

interface FloralCornersProps {
  style: 'sage' | 'rose_gold' | 'royal_blue' | 'burgundy' | 'classic_gold' | 'natural_tones';
  accentColor: string;
}

export default function FloralCorners({ style, accentColor }: FloralCornersProps) {
  if (style === 'natural_tones') {
    return (
      <>
        {/* Top Left Corner */}
        <div className="absolute top-6 left-6 w-24 h-24 pointer-events-none z-10 opacity-60 border-t-2 border-l-2" style={{ borderColor: accentColor }} />
        {/* Top Right Corner */}
        <div className="absolute top-6 right-6 w-24 h-24 pointer-events-none z-10 opacity-60 border-t-2 border-r-2" style={{ borderColor: accentColor }} />
        {/* Bottom Left Corner */}
        <div className="absolute bottom-6 left-6 w-24 h-24 pointer-events-none z-10 opacity-60 border-b-2 border-l-2" style={{ borderColor: accentColor }} />
        {/* Bottom Right Corner */}
        <div className="absolute bottom-6 right-6 w-24 h-24 pointer-events-none z-10 opacity-60 border-b-2 border-r-2" style={{ borderColor: accentColor }} />
      </>
    );
  }

  // Define colors based on theme
  const colors = {
    sage: {
      leafPrimary: '#5c755c',
      leafSecondary: '#7da17d',
      flowerPrimary: '#ffffff',
      flowerCenter: '#eed5b7',
      stem: '#cbd8cb'
    },
    rose_gold: {
      leafPrimary: '#8c7070',
      leafSecondary: '#c7b2b2',
      flowerPrimary: '#fcedee',
      flowerCenter: '#e8afb0',
      stem: '#e3d5d5'
    },
    royal_blue: {
      leafPrimary: '#263a57',
      leafSecondary: '#54739c',
      flowerPrimary: '#ffffff',
      flowerCenter: '#cfab53',
      stem: '#cfab53'
    },
    burgundy: {
      leafPrimary: '#4a1d23',
      leafSecondary: '#945e65',
      flowerPrimary: '#ffffff',
      flowerCenter: '#c99f47',
      stem: '#d9c293'
    },
    classic_gold: {
      leafPrimary: '#7a684d',
      leafSecondary: '#b09b7a',
      flowerPrimary: '#fafaf0',
      flowerCenter: '#cfab53',
      stem: '#cfab53'
    }
  }[style] || {
    leafPrimary: '#5c755c',
    leafSecondary: '#7da17d',
    flowerPrimary: '#ffffff',
    flowerCenter: '#eed5b7',
    stem: '#cbd8cb'
  };

  return (
    <>
      {/* Top Left Corner */}
      <div className="absolute top-0 left-0 w-48 h-48 pointer-events-none z-10 opacity-80 select-none">
        <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Main Stems */}
          <path d="M-10 -10 C30 10, 50 40, 60 80 M-10 -10 C10 30, 40 50, 80 60" stroke={colors.stem} strokeWidth="1.2" opacity="0.6"/>
          
          {/* Leaves */}
          <path d="M12 2 C22 2, 28 12, 20 20 C10 20, 2 12, 12 2 Z" fill={colors.leafPrimary} />
          <path d="M2 12 C12 12, 12 22, 20 30 C12 30, 2 22, 2 12 Z" fill={colors.leafSecondary} />
          <path d="M25 15 C35 20, 35 30, 30 42 C20 35, 15 25, 25 15 Z" fill={colors.leafPrimary} />
          <path d="M15 25 C25 30, 30 40, 42 30 C35 20, 25 15, 15 25 Z" fill={colors.leafSecondary} />
          <path d="M40 30 C50 35, 52 48, 45 58 C35 52, 30 40, 40 30 Z" fill={colors.leafPrimary} />
          
          {/* Smaller leaves */}
          <path d="M55 50 C62 53, 62 62, 57 68" stroke={colors.leafSecondary} strokeWidth="3" strokeLinecap="round" />
          <path d="M50 55 C53 62, 62 62, 68 57" stroke={colors.leafPrimary} strokeWidth="3" strokeLinecap="round" />

          {/* Big Flower top-left-ish */}
          <circle cx="20" cy="20" r="14" fill={colors.flowerPrimary} />
          <circle cx="20" cy="20" r="4" fill={colors.flowerCenter} />
          {/* Soft petals texture overlay */}
          <circle cx="20" cy="20" r="14" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="3 3" />
          
          {/* Medium Flower */}
          <circle cx="48" cy="18" r="9" fill={colors.flowerPrimary} />
          <circle cx="48" cy="18" r="2.5" fill={colors.flowerCenter} />
          
          {/* Little Flower */}
          <circle cx="18" cy="48" r="9" fill={colors.flowerPrimary} />
          <circle cx="18" cy="48" r="2.5" fill={colors.flowerCenter} />

          {/* Golden Sprinkles */}
          <circle cx="35" cy="45" r="1" fill={accentColor} />
          <circle cx="55" cy="35" r="1.5" fill={accentColor} />
          <circle cx="25" cy="65" r="0.8" fill={accentColor} />
          <circle cx="65" cy="25" r="1.2" fill={accentColor} />
        </svg>
      </div>

      {/* Bottom Right Corner */}
      <div className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none z-10 opacity-80 select-none rotate-180">
        <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Main Stems */}
          <path d="M-10 -10 C30 10, 50 40, 60 80 M-10 -10 C10 30, 40 50, 80 60" stroke={colors.stem} strokeWidth="1.2" opacity="0.6"/>
          
          {/* Leaves */}
          <path d="M12 2 C22 2, 28 12, 20 20 C10 20, 2 12, 12 2 Z" fill={colors.leafPrimary} />
          <path d="M2 12 C12 12, 12 22, 20 30 C12 30, 2 22, 2 12 Z" fill={colors.leafSecondary} />
          <path d="M25 15 C35 20, 35 30, 30 42 C20 35, 15 25, 25 15 Z" fill={colors.leafPrimary} />
          <path d="M15 25 C25 30, 30 40, 42 30 C35 20, 25 15, 15 25 Z" fill={colors.leafSecondary} />
          <path d="M40 30 C50 35, 52 48, 45 58 C35 52, 30 40, 40 30 Z" fill={colors.leafPrimary} />

          {/* Big Flower */}
          <circle cx="20" cy="20" r="14" fill={colors.flowerPrimary} />
          <circle cx="20" cy="20" r="4" fill={colors.flowerCenter} />
          <circle cx="20" cy="20" r="14" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="3 3" />
          
          {/* Medium Flower */}
          <circle cx="48" cy="18" r="9" fill={colors.flowerPrimary} />
          <circle cx="48" cy="18" r="2.5" fill={colors.flowerCenter} />
          
          {/* Little Flower */}
          <circle cx="18" cy="48" r="9" fill={colors.flowerPrimary} />
          <circle cx="18" cy="48" r="2.5" fill={colors.flowerCenter} />

          {/* Golden Sprinkles */}
          <circle cx="35" cy="45" r="1" fill={accentColor} />
          <circle cx="55" cy="35" r="1.5" fill={accentColor} />
          <circle cx="25" cy="65" r="0.8" fill={accentColor} />
          <circle cx="65" cy="25" r="1.2" fill={accentColor} />
        </svg>
      </div>
    </>
  );
}
