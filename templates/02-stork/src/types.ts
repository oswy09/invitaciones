export interface StorkDetails {
  babyName: string;
  timestamp: string; // ISO, ej: "2026-07-05T10:30:00"
  locationName: string;
  locationAddress: string;
  whatsappNumber: string; // solo dígitos, ej: "573154384042"
}

export const DEFAULT_STORK_DETAILS: StorkDetails = {
  babyName: "Thomas",
  timestamp: "2026-07-05T10:30:00",
  locationName: "Edificio Jade",
  locationAddress: "Carrera 14A #109-55 Edificio Jade - Piso 13, Bogotá",
  whatsappNumber: "573154384042",
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
  extra?: Record<string, unknown>;
}

export function fromInvitationData(data: InvitationData): StorkDetails {
  return {
    babyName: data.nombresPrincipales[0] ?? "",
    timestamp: `${data.fecha}T${data.hora}:00`,
    locationName: data.lugar.nombre,
    locationAddress: data.lugar.direccion,
    whatsappNumber: (data.whatsappNumero ?? "").replace(/[^+\d]/g, ""),
  };
}
