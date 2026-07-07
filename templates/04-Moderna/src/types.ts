export interface ColorTheme {
  id: string;
  name: string;
  primary: string;      // Primary accent color (e.g. hex #2d4a22 for sage green)
  secondary: string;    // Secondary soft color (e.g. hex #f4f6f3)
  textDark: string;     // Dark text color (e.g. #1c2e15)
  textLight: string;    // Light text color (e.g. #6b7f64)
  accent: string;       // Highlight/Gold color (e.g. #c5a880)
  bgGradient: string;   // Background base color or gradient
  buttonHover: string;  // Button hover color
  floralStyle: 'sage' | 'rose_gold' | 'royal_blue' | 'burgundy' | 'classic_gold' | 'natural_tones';
}

export interface InvitationData {
  id: string;
  brideName: string;
  groomName: string;
  phrase: string;       // e.g., "Please join us as we celebrate our marriage"
  welcomeText: string;  // e.g., "Con la bendición de nuestros padres..." or "We are so excited to share our day with you..."
  
  // Ceremony Details
  ceremonyName: string; // e.g., "Iglesia de San Francisco"
  ceremonyTime: string; // e.g., "09:00 AM"
  ceremonyDate: string; // e.g., "2026-12-10"
  ceremonyAddress: string;
  ceremonyMapUrl: string;
  
  // Reception Details
  receptionName: string;
  receptionTime: string;
  receptionDate: string;
  receptionAddress: string;
  receptionMapUrl: string;
  
  // Additional details
  dressCodeType: 'formal' | 'formal_guayabera' | 'cocktail' | 'casual';
  dressCodeText: string; // "Traje formal para caballeros y vestido largo para damas"
  giftTableText: string; // "El mejor regalo es tu presencia, pero si deseas tener un detalle..."
  giftRegistryAmazon: string;
  giftRegistryLiverpool: string;
  bankAccountOwner: string;
  bankAccountNumber: string;
  bankName: string;
  clabe: string;
  
  // UI & Audio
  musicUrl: string;
  musicTitle: string;
  selectedThemeId: string;
  selectedFontId: string;
  illustrationType: 'couple' | 'rings' | 'church' | 'flowers';
  
  // Sections toggles
  showCountdown: boolean;
  showWelcome: boolean;
  showCeremony: boolean;
  showReception: boolean;
  showDressCode: boolean;
  showGiftTable: boolean;
  showGallery: boolean;
  showRSVP: boolean;
  showGuestbook: boolean;
  
  // Parents names (traditional and highly appreciated in Latin America)
  brideParents: string; // e.g., "María López & Roberto García"
  groomParents: string; // e.g., "Helena Smith & John Doe"
  godparents: string;   // e.g., "Patricia García & Antonio Pérez"
}

export interface RSVPResponse {
  id: string;
  guestName: string;
  isAttending: boolean;
  adultCount: number;
  childCount: number;
  dietaryRestrictions: string;
  message: string;
  submittedAt: string;
}

export interface GuestbookSignature {
  id: string;
  guestName: string;
  message: string;
  createdAt: string;
}

export interface FontOption {
  id: string;
  name: string;
  headingClass: string;   // font family class for headings (Names)
  bodyClass: string;      // font family class for body text
  serifClass: string;     // elegant serif class
}
