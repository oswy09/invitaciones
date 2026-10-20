import React from 'react';

export const TopPlantDecoration: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => (
  <img
    src="/images/planta.png"
    alt=""
    aria-hidden="true"
    className={`pointer-events-none select-none ${className}`}
    style={{ objectFit: 'contain', display: 'block', ...style }}
  />
);

export const TopHangingEucalyptus: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 320 230"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-52 sm:w-64 h-auto pointer-events-none select-none ${className}`}
  >
    {/* Main stems */}
    <path d="M0,0 C20,30 55,58 105,80 C148,98 195,93 258,118" stroke="#6d8068" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    <path d="M55,60 C72,92 100,128 142,155" stroke="#6d8068" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    <path d="M105,80 C128,110 158,142 196,168" stroke="#6d8068" strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
    <path d="M0,12 C40,42 88,58 152,56" stroke="#7a9175" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" />
    <path d="M152,56 C185,54 215,62 248,80" stroke="#7a9175" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />

    {/* Leaf clusters - top left */}
    <ellipse cx="22" cy="20" rx="18" ry="13" transform="rotate(-28 22 20)" fill="#8faa89" opacity="0.9" />
    <ellipse cx="23" cy="20" rx="13" ry="8" transform="rotate(-28 23 20)" fill="#a8c0a2" opacity="0.75" />
    <ellipse cx="46" cy="34" rx="21" ry="15" transform="rotate(38 46 34)" fill="#7d9878" opacity="0.9" />
    <ellipse cx="47" cy="34" rx="15" ry="9" transform="rotate(38 47 34)" fill="#96b290" opacity="0.7" />
    <ellipse cx="76" cy="39" rx="23" ry="16" transform="rotate(-18 76 39)" fill="#8ca887" opacity="0.85" />
    <ellipse cx="77" cy="39" rx="16" ry="10" transform="rotate(-18 77 39)" fill="#a5bea0" opacity="0.65" />

    {/* Round berry accents */}
    <circle cx="30" cy="15" r="4" fill="#c2d4be" opacity="0.6" />
    <circle cx="32" cy="17" r="2.5" fill="#dae8d7" opacity="0.5" />
    <circle cx="60" cy="28" r="3.5" fill="#b8ceB4" opacity="0.55" />

    {/* Mid section leaves */}
    <ellipse cx="100" cy="70" rx="25" ry="18" transform="rotate(42 100 70)" fill="#778f72" opacity="0.9" />
    <ellipse cx="101" cy="69" rx="18" ry="11" transform="rotate(42 101 69)" fill="#93a88e" opacity="0.7" />
    <ellipse cx="132" cy="80" rx="26" ry="19" transform="rotate(-32 132 80)" fill="#849f80" opacity="0.88" />
    <ellipse cx="133" cy="80" rx="18" ry="12" transform="rotate(-32 133 80)" fill="#9eb59a" opacity="0.65" />

    {/* Lower left branch */}
    <ellipse cx="88" cy="115" rx="24" ry="17" transform="rotate(-48 88 115)" fill="#81977c" opacity="0.87" />
    <ellipse cx="89" cy="115" rx="17" ry="11" transform="rotate(-48 89 115)" fill="#9aae96" opacity="0.65" />
    <ellipse cx="116" cy="140" rx="25" ry="18" transform="rotate(28 116 140)" fill="#748b70" opacity="0.87" />
    <ellipse cx="148" cy="158" rx="22" ry="16" transform="rotate(-22 148 158)" fill="#8ca087" opacity="0.8" />
    <circle cx="145" cy="153" r="3.5" fill="#c0d4bc" opacity="0.5" />

    {/* Top right arc leaves */}
    <ellipse cx="160" cy="54" rx="20" ry="14" transform="rotate(-10 160 54)" fill="#8fa489" opacity="0.8" />
    <ellipse cx="192" cy="60" rx="19" ry="13" transform="rotate(15 192 60)" fill="#7e9878" opacity="0.8" />
    <ellipse cx="224" cy="72" rx="18" ry="12" transform="rotate(-5 224 72)" fill="#8ca085" opacity="0.75" />

    {/* Far right branch */}
    <ellipse cx="168" cy="100" rx="24" ry="17" transform="rotate(46 168 100)" fill="#7d9278" opacity="0.87" />
    <ellipse cx="200" cy="112" rx="23" ry="16" transform="rotate(-28 200 112)" fill="#8ea289" opacity="0.83" />
    <ellipse cx="235" cy="122" rx="20" ry="14" transform="rotate(22 235 122)" fill="#7c9278" opacity="0.8" />
    <ellipse cx="258" cy="130" rx="16" ry="11" transform="rotate(12 258 130)" fill="#96aa91" opacity="0.75" />
    <circle cx="252" cy="118" r="3" fill="#bdd0ba" opacity="0.5" />
    <circle cx="275" cy="128" r="3.5" fill="#c4d8c0" opacity="0.45" />

    {/* Vein details */}
    <path d="M14,20 Q22,20 30,20" stroke="#5a7055" strokeWidth="0.8" opacity="0.45" />
    <path d="M39,28 Q46,34 53,40" stroke="#5a7055" strokeWidth="0.8" opacity="0.45" />
    <path d="M93,64 Q100,70 107,76" stroke="#5a7055" strokeWidth="0.8" opacity="0.4" />
    <path d="M125,84 Q132,80 139,76" stroke="#5a7055" strokeWidth="0.8" opacity="0.4" />
    <path d="M160,97 Q168,100 176,103" stroke="#5a7055" strokeWidth="0.7" opacity="0.35" />
  </svg>
);

export const SideEucalyptusSprig: React.FC<{
  position?: 'right' | 'left';
  className?: string;
}> = ({ position = 'right', className = '' }) => {
  const isRight = position === 'right';
  return (
    <svg
      viewBox="0 0 170 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-28 sm:w-36 h-auto pointer-events-none select-none opacity-90 ${
        isRight ? 'scale-x-100' : '-scale-x-100'
      } ${className}`}
    >
      {/* Main stem */}
      <path d="M165,268 Q108,200 85,130 Q62,60 12,8" stroke="#6d8068" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
      <path d="M85,130 Q52,98 18,88" stroke="#6d8068" strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
      <path d="M115,180 Q88,170 55,175" stroke="#6d8068" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />

      {/* Lower cluster */}
      <ellipse cx="130" cy="210" rx="24" ry="17" transform="rotate(-38 130 210)" fill="#80957b" opacity="0.9" />
      <ellipse cx="131" cy="210" rx="17" ry="11" transform="rotate(-38 131 210)" fill="#9ab097" opacity="0.72" />
      <ellipse cx="95" cy="168" rx="26" ry="18" transform="rotate(32 95 168)" fill="#768d72" opacity="0.88" />
      <ellipse cx="96" cy="168" rx="18" ry="12" transform="rotate(32 96 168)" fill="#92a88e" opacity="0.68" />

      {/* Mid clusters */}
      <ellipse cx="74" cy="118" rx="23" ry="16" transform="rotate(-42 74 118)" fill="#849f80" opacity="0.87" />
      <ellipse cx="75" cy="118" rx="16" ry="10" transform="rotate(-42 75 118)" fill="#9cb798" opacity="0.65" />
      <ellipse cx="42" cy="88" rx="21" ry="15" transform="rotate(28 42 88)" fill="#778f73" opacity="0.87" />
      <ellipse cx="43" cy="88" rx="14" ry="9" transform="rotate(28 43 88)" fill="#92a68e" opacity="0.65" />

      {/* Upper cluster */}
      <ellipse cx="50" cy="52" rx="20" ry="14" transform="rotate(-32 50 52)" fill="#8ba587" opacity="0.85" />
      <ellipse cx="51" cy="52" rx="14" ry="9" transform="rotate(-32 51 52)" fill="#a2bc9e" opacity="0.65" />
      <ellipse cx="22" cy="26" rx="16" ry="11" transform="rotate(18 22 26)" fill="#9ab096" opacity="0.8" />

      {/* Side branch leaves */}
      <ellipse cx="58" cy="178" rx="18" ry="12" transform="rotate(55 58 178)" fill="#7a9476" opacity="0.75" />
      <ellipse cx="38" cy="190" rx="14" ry="10" transform="rotate(20 38 190)" fill="#8aa786" opacity="0.7" />

      {/* Berry accents */}
      <circle cx="125" cy="198" r="3.5" fill="#c0d4bc" opacity="0.55" />
      <circle cx="88" cy="155" r="3" fill="#bed2ba" opacity="0.5" />
      <circle cx="45" cy="78" r="3" fill="#c2d6be" opacity="0.5" />
    </svg>
  );
};

export const BotanicalWreathDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-3 select-none pointer-events-none ${className}`}>
    {/* Left branch */}
    <svg width="72" height="28" viewBox="0 0 72 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M70,14 C52,13 34,15 6,18" stroke="#7E8E7A" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M58,13 Q52,6 43,8 Q50,13 58,13 Z" fill="#859d80" opacity="0.88" />
      <path d="M46,14 Q40,20 31,18 Q38,14 46,14 Z" fill="#7a9376" opacity="0.85" />
      <path d="M33,15 Q27,8 18,10 Q25,15 33,15 Z" fill="#8ca588" opacity="0.82" />
      <path d="M18,16 Q12,22 5,20 Q11,16 18,16 Z" fill="#9fb79a" opacity="0.78" />
      <circle cx="62" cy="11" r="2.5" fill="#c0d4bc" opacity="0.55" />
      <circle cx="36" cy="13" r="2" fill="#bdd0b9" opacity="0.45" />
    </svg>

    <span className="text-[#8a9e86] text-[11px] leading-none">♥</span>

    {/* Right branch */}
    <svg width="72" height="28" viewBox="0 0 72 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="-scale-x-100">
      <path d="M70,14 C52,13 34,15 6,18" stroke="#7E8E7A" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M58,13 Q52,6 43,8 Q50,13 58,13 Z" fill="#859d80" opacity="0.88" />
      <path d="M46,14 Q40,20 31,18 Q38,14 46,14 Z" fill="#7a9376" opacity="0.85" />
      <path d="M33,15 Q27,8 18,10 Q25,15 33,15 Z" fill="#8ca588" opacity="0.82" />
      <path d="M18,16 Q12,22 5,20 Q11,16 18,16 Z" fill="#9fb79a" opacity="0.78" />
      <circle cx="62" cy="11" r="2.5" fill="#c0d4bc" opacity="0.55" />
      <circle cx="36" cy="13" r="2" fill="#bdd0b9" opacity="0.45" />
    </svg>
  </div>
);

export const HeartDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-3 text-[#AAB7A6] select-none ${className}`}>
    <div className="w-14 h-[1px] bg-gradient-to-r from-transparent to-[#C8D5C4]" />
    <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
      <path d="M6 10.5C6 10.5 0.5 6.5 0.5 3.5C0.5 2 1.7 1 3 1C4.2 1 5.2 1.8 6 2.8C6.8 1.8 7.8 1 9 1C10.3 1 11.5 2 11.5 3.5C11.5 6.5 6 10.5 6 10.5Z" fill="#a8bca4" opacity="0.7" />
    </svg>
    <div className="w-14 h-[1px] bg-gradient-to-l from-transparent to-[#C8D5C4]" />
  </div>
);
