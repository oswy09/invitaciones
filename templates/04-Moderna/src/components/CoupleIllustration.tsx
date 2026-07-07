import React from 'react';

interface CoupleIllustrationProps {
  color?: string; // Optional accent color override
}

export default function CoupleIllustration({ color = '#c4a47c' }: CoupleIllustrationProps) {
  return (
    <div className="relative w-64 h-72 mx-auto flex items-center justify-center filter drop-shadow-md">
      <svg
        viewBox="0 0 240 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background Aura / Soft Halo */}
        <circle cx="120" cy="140" r="85" fill="url(#halo-grad)" opacity="0.4" />
        
        {/* Gold Circular Ring Accent */}
        <circle cx="120" cy="140" r="80" stroke={color} strokeWidth="0.5" strokeDasharray="4 2" opacity="0.6" />

        {/* ==================== GROOM (LEFT) ==================== */}
        {/* Groom Suit Back / Shoulders */}
        <path
          d="M45 230 C45 160, 55 125, 80 120 C90 120, 100 125, 105 135 C110 145, 115 170, 115 230 Z"
          fill="#1c1c1e"
        />
        {/* Groom Left Sleeve */}
        <path
          d="M45 230 C43 200, 48 180, 58 150 C63 155, 68 175, 73 200 C75 210, 78 220, 80 230 Z"
          fill="#121214"
        />
        {/* Groom Neck & Collar */}
        <path
          d="M84 121 C85 110, 95 110, 96 121 Z"
          fill="#eed4cc"
        />
        {/* White shirt collar peeking */}
        <path
          d="M83 121 C88 119, 92 119, 97 121 L95 124 C90 122, 87 122, 85 124 Z"
          fill="#ffffff"
        />
        {/* Groom Hair */}
        <path
          d="M80 112 C80 94, 100 94, 100 112 C100 113, 98 121, 90 121 C82 121, 80 113, 80 112 Z"
          fill="#2b2624"
        />
        <path
          d="M81 106 C83 97, 97 97, 99 106 C95 104, 85 104, 81 106 Z"
          fill="#3d3531"
        />

        {/* ==================== BRIDE (RIGHT) ==================== */}
        {/* Bride Gown Back & Skirt */}
        <path
          d="M110 230 C110 170, 118 135, 135 130 C155 132, 172 155, 175 230 Z"
          fill="#fafafa"
        />
        {/* Bride Back Skin (V-Back Gown neckline) */}
        <path
          d="M124 133 C130 118, 140 118, 146 133 C142 145, 128 145, 124 133 Z"
          fill="#f7dfd6"
        />
        {/* Bride dress strap lines / lace overlay */}
        <path
          d="M123 133 C124 137, 126 142, 128 146 M147 133 C146 137, 144 142, 142 146"
          stroke="#ece9e6"
          strokeWidth="1.5"
        />
        {/* Soft Shadow on her dress */}
        <path
          d="M122 150 C130 200, 128 215, 125 230"
          stroke="#eaeaea"
          strokeWidth="3"
          opacity="0.5"
        />
        
        {/* Bride long wavy hair */}
        {/* Base hair */}
        <path
          d="M122 108 C122 84, 148 84, 148 108 C148 135, 118 135, 125 175 C121 160, 118 145, 120 125 C121 115, 122 110, 122 108 Z"
          fill="#593c2c"
        />
        {/* Extra wavy strands and hair volume on the right */}
        <path
          d="M130 102 C135 90, 155 100, 150 125 C146 145, 138 150, 134 165 C132 150, 136 135, 140 120 C143 110, 135 105, 130 102 Z"
          fill="#472e21"
        />
        {/* Hair highlights (Wavy strands) */}
        <path
          d="M126 102 C132 112, 122 135, 131 150 M138 105 C144 118, 135 138, 138 158"
          stroke="#73523f"
          strokeWidth="1.5"
          opacity="0.85"
        />
        {/* Delicate white hair clip */}
        <circle cx="140" cy="106" r="1.5" fill="#ffffff" />
        <circle cx="143" cy="107" r="1.5" fill="#ffffff" />
        <circle cx="146" cy="109" r="1.5" fill="#ffffff" />

        {/* ==================== CONNECTING ACTION (ARM AROUND) ==================== */}
        {/* Groom's arm around Bride's back */}
        <path
          d="M102 165 C102 165, 110 152, 122 154 C132 156, 142 168, 142 168 C142 168, 138 174, 125 170 C114 166, 102 165, 102 165 Z"
          fill="#121214"
        />
        {/* Groom's hand on Bride's waist */}
        <path
          d="M139 168 C140 165, 146 164, 147 167 C148 170, 144 174, 141 173 Z"
          fill="#eed4cc"
        />

        {/* ==================== FLORAL DETAILS & LEAVES AT COUPlE BASE ==================== */}
        {/* Soft sage leaves at the center bottom of the couple */}
        {/* Center white flower */}
        <circle cx="120" cy="225" r="16" fill="url(#flower-grad)" />
        <circle cx="120" cy="225" r="4" fill="#eed5b7" opacity="0.9" />
        
        {/* Petals */}
        <path d="M120 205 C112 215, 128 215, 120 205 Z" fill="#ffffff" opacity="0.95" />
        <path d="M120 245 C112 235, 128 235, 120 245 Z" fill="#ffffff" opacity="0.95" />
        <path d="M100 225 C110 217, 110 233, 100 225 Z" fill="#ffffff" opacity="0.95" />
        <path d="M140 225 C130 217, 130 233, 140 225 Z" fill="#ffffff" opacity="0.95" />
        
        {/* Left white flower */}
        <circle cx="95" cy="235" r="12" fill="url(#flower-grad)" />
        <circle cx="95" cy="235" r="3" fill="#eed5b7" opacity="0.9" />
        
        {/* Right white flower */}
        <circle cx="145" cy="235" r="12" fill="url(#flower-grad)" />
        <circle cx="145" cy="235" r="3" fill="#eed5b7" opacity="0.9" />

        {/* Sage green leaves branching out */}
        <path d="M75 235 C65 220, 50 225, 42 225 C50 233, 65 238, 75 235 Z" fill="#5c755c" />
        <path d="M70 228 C62 215, 52 215, 48 218" stroke="#5c755c" strokeWidth="1" />
        <circle cx="48" cy="218" r="1.5" fill="#5c755c" />
        <circle cx="56" cy="214" r="1" fill="#5c755c" />

        <path d="M165 235 C175 220, 190 225, 198 225 C190 233, 175 238, 165 235 Z" fill="#5c755c" />
        <path d="M170 228 C178 215, 188 215, 192 218" stroke="#5c755c" strokeWidth="1" />
        <circle cx="192" cy="218" r="1.5" fill="#5c755c" />

        {/* Gold flakes details at bottom */}
        <circle cx="110" cy="250" r="1.5" fill={color} opacity="0.8" />
        <circle cx="130" cy="252" r="1.2" fill={color} opacity="0.8" />
        <circle cx="85" cy="245" r="1" fill={color} opacity="0.6" />
        <circle cx="155" cy="246" r="1.8" fill={color} opacity="0.7" />

        {/* ==================== DEFINITIONS / GRADIENTS ==================== */}
        <defs>
          <radialGradient id="halo-grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          
          <radialGradient id="flower-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="75%" stopColor="#f7f5f2" />
            <stop offset="100%" stopColor="#eae6e1" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
