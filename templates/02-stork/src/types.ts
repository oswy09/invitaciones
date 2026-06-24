export interface StorkDetails {
  babyName: string;
  timestamp: string; // ISO, ej: "2026-07-05T10:30:00"
  locationName: string;
  locationAddress: string;
  locationMapUrl: string;
  whatsappNumber: string; // solo dígitos, ej: "573154384042"
  welcomeMessage?: string;
  tituloEvento?: string;
  extra?: Record<string, unknown>; // Campo para textos y configuraciones personalizadas del admin
}

export const DEFAULT_STORK_DETAILS: StorkDetails = {
  babyName: "Thomas",
  timestamp: "2026-07-05T10:30:00",
  locationName: "Edificio Jade",
  locationAddress: "Carrera 14A #109-55 Edificio Jade - Piso 13, Bogotá",
  locationMapUrl: "https://maps.google.com/?q=Carrera+14A+%23109-55+Edificio+Jade+Bogota",
  whatsappNumber: "573154384042",
  welcomeMessage: "¡Acompáñanos a compartir una mañana especial al aire libre, llena de amor, buenos momentos y bendiciones!",
  tituloEvento: "Baby Shower"
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
  fecha: string;
  hora: string;
  lugar: { nombre: string; direccion: string; mapUrl: string };
  whatsappNumero?: string;
  mensajePersonalizado?: string;
  extra?: Record<string, unknown>;
}

export function fromInvitationData(data: InvitationData): StorkDetails {
  return {
    babyName: data.nombresPrincipales[0] ?? "",
    timestamp: `${data.fecha}T${data.hora}:00`,
    locationName: data.lugar.nombre,
    locationAddress: data.lugar.direccion,
    locationMapUrl: data.lugar.mapUrl || "",
    whatsappNumber: (data.whatsappNumero ?? "").replace(/[^+\d]/g, ""),
    welcomeMessage: data.mensajePersonalizado || "¡Acompáñanos a compartir una mañana especial al aire libre, llena de amor, buenos momentos y bendiciones!",
    tituloEvento: data.tituloEvento || "Baby Shower",
    extra: data.extra,
  };
}
