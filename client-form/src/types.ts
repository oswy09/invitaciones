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

export interface TemplateFeature {
  emoji: string;
  label: string;
}

export interface TemplateInfo {
  id: string;
  nombre: string;
  nombreDisplay: string;
  descripcion: string;
  emoji: string;
  categoria: "Baby Shower" | "Boda" | "Cumpleaños" | "Quinceaños";
  /** URL real publicada en Netlify. Vacío = todavía no está publicada. */
  baseUrl: string;
  gradiente: string;
  textColor: string;
  esEspacio?: boolean;
  features: TemplateFeature[];
  precioDefault: { cop: number; usd: number };
}

export const WHATSAPP_CONTACTO = "573057502790";

const FEATURES_BABY_SHOWER: TemplateFeature[] = [
  { emoji: "✉️", label: "Sobre animado interactivo" },
  { emoji: "💬", label: "Muro de deseos en tiempo real" },
  { emoji: "✅", label: "Confirmación de asistencia (RSVP)" },
  { emoji: "⏱️", label: "Cuenta regresiva al evento" },
  { emoji: "🗺️", label: "Mapa interactivo del lugar" },
  { emoji: "🎵", label: "Música de fondo personalizada" },
];

export const CATALOGO: TemplateInfo[] = [
  {
    id: "01-dino",
    nombre: "Dino",
    nombreDisplay: "Baby Shower Dino",
    descripcion: "Baby shower de dinosaurios, con sobre interactivo",
    emoji: "🦖",
    categoria: "Baby Shower",
    baseUrl: "https://dino.celebrarte.com.co",
    gradiente: "linear-gradient(to bottom, #3a6b2a, #1a3a10)",
    textColor: "#c8f0a0",
    features: FEATURES_BABY_SHOWER,
    precioDefault: { cop: 70000, usd: 20 },
  },
  {
    id: "02-stork",
    nombre: "Cigüeña",
    nombreDisplay: "Cigüeña Dulce",
    descripcion: "Baby shower de cigüeña y nubes, intro animada",
    emoji: "🦢",
    categoria: "Baby Shower",
    baseUrl: "https://stork.celebrarte.com.co",
    gradiente: "linear-gradient(to bottom, #7ec8e3, #b8dff0)",
    textColor: "#1a4a6b",
    features: FEATURES_BABY_SHOWER,
    precioDefault: { cop: 60000, usd: 18 },
  },
  {
    id: "03-space",
    nombre: "Espacio",
    nombreDisplay: "Aventura Espacial",
    descripcion: "Baby shower espacial, cohete y estrellas",
    emoji: "🚀",
    categoria: "Baby Shower",
    baseUrl: "https://space.celebrarte.com.co",
    gradiente: "linear-gradient(to bottom, #0d1b3e, #000000)",
    textColor: "#e0e8ff",
    esEspacio: true,
    features: FEATURES_BABY_SHOWER,
    precioDefault: { cop: 70000, usd: 20 },
  },
  {
    id: "04-Moderna",
    nombre: "Boda Moderna",
    nombreDisplay: "Boda Moderna",
    descripcion: "Invitación de bodas elegante, sobre animado y música",
    emoji: "💍",
    categoria: "Boda",
    baseUrl: "https://boda-moderna.celebrarte.com.co",
    gradiente: "linear-gradient(to bottom, #3A1140, #5A1B5E)",
    textColor: "#f0d9a0",
    features: [
      { emoji: "✉️", label: "Sobre animado interactivo" },
      { emoji: "🎵", label: "Música de fondo personalizada" },
      { emoji: "✅", label: "Confirmación de asistencia (RSVP)" },
      { emoji: "⏱️", label: "Cuenta regresiva a la boda" },
      { emoji: "🗺️", label: "Mapa de ceremonia y recepción" },
      { emoji: "💬", label: "Muro de deseos / libro de firmas" },
    ],
    precioDefault: { cop: 80000, usd: 22 },
  },
];

export const DEV_PORT_POR_TEMPLATE: Record<string, number> = {
  "01-dino":    3101,
  "02-stork":   3102,
  "03-space":   3103,
  "04-Moderna": 3104,
};

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
