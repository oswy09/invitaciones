import { ColorTheme, FontOption, InvitationData } from './types';

export const THEMES: ColorTheme[] = [
  {
    id: 'natural_tones',
    name: 'Tonos Naturales / Natural Tones (De la Imagen)',
    primary: '#5a5a40',       // deep sage-olive for primary elements & buttons
    secondary: '#f9f7f2',     // elegant soft warm ivory
    textDark: '#2c2c28',      // deep charcoal-black
    textLight: '#4a4a40',     // soft classic neutral gray-brown
    accent: '#c5a059',        // rich warm gold
    bgGradient: 'from-[#f9f7f2] via-[#f7f4ec] to-[#f2eee4]',
    buttonHover: '#454530',
    floralStyle: 'natural_tones',
  },
  {
    id: 'sage_green',
    name: 'Verde Olivo / Sage Green',
    primary: '#435e43',       // deep sage green
    secondary: '#f2f5f2',     // soft cream sage
    textDark: '#203020',      // charcoal-sage
    textLight: '#657e65',     // soft sage gray
    accent: '#c4a47c',        // matte gold
    bgGradient: 'from-[#f7f9f7] via-[#f1f4f1] to-[#ebf0eb]',
    buttonHover: '#334b33',
    floralStyle: 'sage',
  },
  {
    id: 'rose_gold',
    name: 'Oro Rosa / Blush Rose Gold',
    primary: '#8c5e5e',       // warm rose gold
    secondary: '#faf5f5',     // very soft pinkish-cream
    textDark: '#402626',      // deep dark brown-rose
    textLight: '#a68282',     // soft dusty rose
    accent: '#d9a0a0',        // shiny rose gold
    bgGradient: 'from-[#fdfafb] via-[#faf2f4] to-[#f5e8eb]',
    buttonHover: '#734646',
    floralStyle: 'rose_gold',
  },
  {
    id: 'royal_blue',
    name: 'Azul Real y Oro / Royal Blue & Gold',
    primary: '#1d2e47',       // deep navy royal
    secondary: '#f4f6f9',     // elegant soft grayish blue
    textDark: '#0e1a2b',      // dark navy almost black
    textLight: '#53698c',     // soft steel blue
    accent: '#d1a852',        // brilliant yellow gold
    bgGradient: 'from-[#f7f9fc] via-[#f0f3f8] to-[#e4eaf2]',
    buttonHover: '#131f31',
    floralStyle: 'royal_blue',
  },
  {
    id: 'burgundy',
    name: 'Vino Tinto / Burgundy & Gold',
    primary: '#611a24',       // rich deep burgundy
    secondary: '#fbf5f6',     // soft wine cream
    textDark: '#33090e',      // deep plum black
    textLight: '#91535b',     // soft wine pink
    accent: '#c99f47',        // imperial gold
    bgGradient: 'from-[#fcf9fa] via-[#faf0f2] to-[#f4dfdf]',
    buttonHover: '#4a1118',
    floralStyle: 'burgundy',
  },
  {
    id: 'classic_gold',
    name: 'Oro Clásico y Marfil / Luxury Ivory',
    primary: '#473d2a',       // gold-touched deep bronze-black
    secondary: '#fafaf6',     // pure soft warm ivory
    textDark: '#241e14',      // dark graphite-bronze
    textLight: '#7a705e',     // warm taupe gray
    accent: '#cfab53',        // antique warm gold
    bgGradient: 'from-[#fdfdfa] via-[#FAF9F5] to-[#f4f2e9]',
    buttonHover: '#332b1e',
    floralStyle: 'classic_gold',
  },
];

export const FONTS: FontOption[] = [
  {
    id: 'natural_tones_font',
    name: 'Playfair Display & Montserrat (Alta Gama)',
    headingClass: 'font-wedding-serif italic font-light',
    bodyClass: 'font-wedding-sans font-light',
    serifClass: 'font-wedding-serif',
  },
  {
    id: 'elegant',
    name: 'Cinzel & Pinyon Script (Caligrafía Tradicional)',
    headingClass: 'font-wedding-script',
    bodyClass: 'font-wedding-sans',
    serifClass: 'font-wedding-serif',
  },
  {
    id: 'classic_serif',
    name: 'Playfair Display & Montserrat (Romántico Editorial)',
    headingClass: 'font-wedding-serif italic',
    bodyClass: 'font-wedding-sans',
    serifClass: 'font-wedding-serif',
  },
];

export const DEFAULT_INVITATION: InvitationData = {
  id: 'invite_anna_richard',
  brideName: 'Anna',
  groomName: 'Richard',
  phrase: 'Acompáñanos a celebrar nuestro matrimonio',
  welcomeText: 'Con la bendición de Dios y de nuestros padres, tenemos el honor de invitarles a celebrar la unión de nuestras vidas en el sagrado vínculo del matrimonio. Su presencia hará de este día un momento inolvidable.',
  
  // Ceremony Details
  ceremonyName: 'Santuario de San Francisco',
  ceremonyTime: '09:00 AM',
  ceremonyDate: '2026-12-10',
  ceremonyAddress: '123 Anywhere St., Any City',
  ceremonyMapUrl: 'https://maps.google.com/?q=123+Anywhere+St+Any+City',
  
  // Reception Details
  receptionName: 'Salón y Jardín Las Flores',
  receptionTime: '02:00 PM',
  receptionDate: '2026-12-10',
  receptionAddress: '456 Celebration Way, Any City',
  receptionMapUrl: 'https://maps.google.com/?q=456+Celebration+Way+Any+City',
  
  // Additional details
  dressCodeType: 'formal',
  dressCodeText: 'Traje formal para caballeros y vestido largo para damas (Evitar color blanco en damas).',
  giftTableText: 'El regalo más valioso es su presencia en este día tan especial. Sin embargo, si desean tener un detalle con nosotros, ponemos a su disposición nuestras opciones de mesa de regalos o transferencia bancaria.',
  giftRegistryAmazon: '12345678',
  giftRegistryLiverpool: '98765432',
  bankAccountOwner: 'Anna García & Richard Smith',
  bankAccountNumber: '0123 4567 8901 2345',
  bankName: 'Banco Banamex',
  clabe: '012345678901234567',
  
  // UI & Audio
  musicUrl: 'https://assets.mixkit.co/music/preview/mixkit-love-story-piano-solo-830.mp3',
  musicTitle: 'Love Story (Piano Solo)',
  selectedThemeId: 'natural_tones',
  selectedFontId: 'natural_tones_font',
  illustrationType: 'couple',
  
  // Parent details
  brideParents: 'Sofía Valenzuela & Roberto García',
  groomParents: 'Victoria Henderson & John Smith',
  godparents: 'Isabel Ortega & Fernando Sánchez',
  
  // Sections toggles
  showCountdown: true,
  showWelcome: true,
  showCeremony: true,
  showReception: true,
  showDressCode: true,
  showGiftTable: true,
  showGallery: true,
  showRSVP: true,
  showGuestbook: true,
};
