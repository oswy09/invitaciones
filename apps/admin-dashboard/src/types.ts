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
  mensajePersonalizado?: string;
  registroRegalos?: { tienda: string; url?: string; codigo?: string; notaAlternativa?: string }[];
  whatsappNumero?: string;
  features: { muroDeseos: boolean; rsvp: boolean; countdown: boolean; mapa: boolean; musica: boolean };
  asistido?: boolean;
  extra?: Record<string, unknown>;
}

export interface Pedido {
  id: string;
  template_id: string;
  nombre_evento: string;
  fecha_evento: string | null;
  datos: InvitationData;
  pagado: boolean;
  aprobado: boolean;
  created_at: string;
}

export interface WishRow {
  id: string;
  evento_id: string;
  nombre_invitado: string;
  mensaje: string;
  avatar: string;
  oculto: boolean;
  created_at: string;
}

export interface RsvpRow {
  id: string;
  evento_id: string;
  nombre_invitado: string;
  asiste: boolean;
  num_adultos: number;
  restricciones_alimentarias: string;
  restriccion_detalle: string;
  created_at: string;
}

/** URL real publicada en Netlify por plantilla. Vacío = todavía no está publicada (usa localhost de desarrollo). */
export const BASE_URL_POR_TEMPLATE: Record<string, string> = {
  "01-dino": "https://dino.celebrarte.com.co",
  "02-stork": "https://stork.celebrarte.com.co",
  "03-space": "https://space.celebrarte.com.co",
  "04-Moderna": "https://boda-moderna.celebrarte.com.co",
};

/** Puertos de dev server local, usados como fallback mientras una plantilla no esté publicada. */
export const DEV_PORT_POR_TEMPLATE: Record<string, number> = {
  "01-dino": 3101,
  "02-stork": 3102,
  "03-space": 3103,
  "04-Moderna": 3104,
};
