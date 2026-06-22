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
  whatsappNumber?: string; // dígitos, ej: "573154384042"
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

// InvitationData es el esquema estándar compartido (core/schema/invitation-schema.ts).
// Se duplica aquí la forma mínima necesaria para no acoplar esta plantilla a una
// ruta de import fuera de su propio proyecto Vite.
export interface InvitationData {
  eventoId: string;
  templateId: string;
  pagado: boolean;
  tituloEvento: string;
  nombresPrincipales: string[];
  anfitriones?: string;
  fecha: string;
  hora: string;
  fechaTexto?: string;
  lugar: { nombre: string; direccion: string; mapUrl: string };
  vestimenta?: string;
  registroRegalos?: { tienda: string; url?: string; codigo?: string; notaAlternativa?: string }[];
  whatsappNumero?: string;
  extra?: Record<string, unknown>;
}

// Convierte el esquema estándar InvitationData (lo que vive en eventos.datos)
// a la forma BabyShowerDetails que ya consume el resto de esta plantilla.
export function fromInvitationData(data: InvitationData): BabyShowerDetails {
  const registro = data.registroRegalos?.[0];
  return {
    eventoId: data.eventoId,
    babyName: data.nombresPrincipales[0] ?? "",
    parentsNames: data.anfitriones ?? "",
    date: data.fecha,
    time: data.hora,
    locationName: data.lugar.nombre,
    locationAddress: data.lugar.direccion,
    locationMapUrl: data.lugar.mapUrl,
    giftRegistryStore: registro?.tienda,
    giftRegistryUrl: registro?.url,
    rsvpDeadline: (data.extra?.rsvpDeadline as string) ?? "",
    dressCode: data.vestimenta ?? "",
    whatsappNumber: data.whatsappNumero?.replace(/[^+\d]/g, ""),
  };
}
