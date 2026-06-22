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
// a la forma InvitationDetails que ya consume el resto de esta plantilla.
export function fromInvitationData(data: InvitationData): InvitationDetails {
  const [mother, father] = (data.anfitriones ?? "").split("&").map((s) => s.trim());
  return {
    babyName: data.nombresPrincipales[0] ?? "",
    parents: { mother: mother ?? "", father: father ?? "" },
    date: data.fechaTexto ?? data.fecha,
    time: data.hora,
    timestamp: `${data.fecha}T${data.hora}:00`,
    locationName: data.lugar.nombre,
    locationAddress: data.lugar.direccion,
    locationMapUrl: data.lugar.mapUrl,
    dressCode: data.vestimenta ?? "",
    giftRegistry: (data.registroRegalos ?? []).map((r) => ({
      shopName: r.tienda,
      code: r.codigo ?? "",
      url: r.url ?? "#",
      alternativeText: r.notaAlternativa,
    })),
    whatsappNumber: data.whatsappNumero ?? "",
  };
}
