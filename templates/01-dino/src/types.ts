export interface Guest {
  id: string;
  name: string;
  attending: boolean;
  adults: number;
  children: number;
  message?: string;
  timestamp: string;
  foodAllergies?: string;
  avatar?: string; // Selected emoji animal/avatar like dino, giraffe, elephant etc.
}

export interface Wish {
  id: string;
  name: string;
  message: string;
  avatar: string;
  timestamp: string;
}

export interface BabyShowerDetails {
  eventoId: string;   // slug único que conecta con Supabase, ej: 'baby-shower-thomas'
  babyName: string;
  parentsNames: string;
  date: string; // "2026-07-12"
  time: string; // "16:00"
  locationName: string; // "Jardín de Eventos Los Olivos"
  locationAddress: string; // "Av. Las Palmeras #450, San Isidro"
  locationMapUrl: string; // Google Maps URL
  giftRegistryUrl?: string; // Gift registry website or details
  giftRegistryStore?: string; // Amazon / Liverpool etc
  rsvpDeadline: string; // "2026-06-30"
  dressCode: string; // "Azul pastel, beige y blanco"
}

export const DEFAULT_SHOWER_DETAILS: BabyShowerDetails = {
  eventoId: "baby-shower-thomas",
  babyName: "Thomas",
  parentsNames: "Sofía & Alejandro",
  date: "2026-07-05",
  time: "10:30",
  locationName: "Edificio Jade",
  locationAddress: "Carrera 14A # 109-55 - Piso 13 (Terraza con espacio cubierto), Bogotá",
  locationMapUrl: "https://maps.google.com/?q=Carrera+14A+%23109-55+Edificio+Jade+Bogota",
  giftRegistryStore: "Amazon & Liverpool",
  giftRegistryUrl: "https://www.amazon.com",
  rsvpDeadline: "26 de junio",
  dressCode: "Azul Serenity, Blanco y Tonos Tierra (Beige/Café claro)"
};
