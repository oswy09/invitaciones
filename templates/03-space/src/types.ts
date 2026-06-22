export interface InvitationDetails {
  babyName: string;
  parents: {
    mother: string;
    father: string;
  };
  date: string; // e.g. "Sábado, 4 de Julio de 2026"
  time: string; // e.g. "16:00 hrs"
  timestamp: string; // ISO style or parseable date for countdown
  locationName: string;
  locationAddress: string;
  locationMapUrl: string;
  dressCode: string; // e.g. "Blanco o Coquet / Colores Pastel"
  giftRegistry: {
    shopName: string;
    code: string;
    url: string;
    alternativeText?: string;
  }[];
  whatsappNumber: string; // default number to RSVP
}

export interface RSVP {
  id: string;
  name: string;
  companions: number;
  message: string;
  status: 'confirmed' | 'declined';
  createdAt: string;
}
