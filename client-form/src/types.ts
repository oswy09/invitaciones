// Copia de core/schema/invitation-schema.ts — ver ese archivo para la versión canónica.
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
  lugar: {
    nombre: string;
    direccion: string;
    mapUrl: string;
  };
  vestimenta?: string;
  mensajePersonalizado?: string;
  registroRegalos?: {
    tienda: string;
    url?: string;
    codigo?: string;
    notaAlternativa?: string;
  }[];
  paletaColores?: string;
  fotos?: string[];
  whatsappNumero?: string;
  features: {
    muroDeseos: boolean;
    rsvp: boolean;
    countdown: boolean;
    mapa: boolean;
    musica: boolean;
  };
  asistido?: boolean;
  extra?: Record<string, unknown>;
}

export interface TemplateInfo {
  id: string;
  nombre: string;
  descripcion: string;
  emoji: string;
  /** URL real publicada en Netlify. Vacío = todavía no está publicada. */
  baseUrl: string;
}

export const WHATSAPP_CONTACTO = "573057502790";

export const CATALOGO: TemplateInfo[] = [
  { id: "01-dino", nombre: "Dino", descripcion: "Baby shower de dinosaurios, con sobre interactivo", emoji: "🦖", baseUrl: "https://celebrarte-dino.netlify.app" },
  { id: "02-stork", nombre: "Cigüeña", descripcion: "Baby shower de cigüeña y nubes, intro animada", emoji: "🦢", baseUrl: "" },
  { id: "03-space", nombre: "Espacio", descripcion: "Baby shower espacial, cohete y estrellas", emoji: "🚀", baseUrl: "" },
];

const DIAS_SEMANA = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function fechaTextoDe(fecha: Date): string {
  return `${DIAS_SEMANA[fecha.getDay()]}, ${fecha.getDate()} de ${MESES[fecha.getMonth()]} de ${fecha.getFullYear()}`;
}

/** Datos de ejemplo realistas, para que la plantilla se vea como una invitación real desde el primer momento. */
export function datosEjemplo(templateId: string): InvitationData {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 30);
  const fechaISO = fecha.toISOString().slice(0, 10);

  return {
    eventoId: "preview",
    templateId,
    pagado: false,
    tituloEvento: "Baby Shower de Sofía",
    nombresPrincipales: ["Sofía"],
    anfitriones: "Familia Pérez",
    fecha: fechaISO,
    hora: "15:00",
    fechaTexto: fechaTextoDe(fecha),
    lugar: {
      nombre: "Salón Jardín Encantado",
      direccion: "Calle 123 #45-67, Bogotá",
      mapUrl: "",
    },
    vestimenta: "Casual elegante, tonos pastel",
    mensajePersonalizado: "Acompáñanos a compartir una mañana especial al aire libre, llena de amor, buenos momentos y muchas bendiciones.",
    whatsappNumero: "573000000000",
    features: { muroDeseos: true, rsvp: true, countdown: true, mapa: true, musica: false },
  };
}
