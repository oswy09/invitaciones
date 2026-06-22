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
  extra?: Record<string, unknown>;
}

export interface TemplateInfo {
  id: string;
  nombre: string;
  descripcion: string;
  emoji: string;
  /** Puerto del dev server local (solo desarrollo — en producción esto sería la URL real publicada). */
  devPort: number;
}

export const CATALOGO: TemplateInfo[] = [
  { id: "01-dino", nombre: "Dino", descripcion: "Baby shower de dinosaurios, con sobre interactivo", emoji: "🦖", devPort: 3101 },
  { id: "02-stork", nombre: "Cigüeña", descripcion: "Baby shower de cigüeña y nubes, intro animada", emoji: "🦢", devPort: 3102 },
  { id: "03-space", nombre: "Espacio", descripcion: "Baby shower espacial, cohete y estrellas", emoji: "🚀", devPort: 3103 },
];

export function detallesVacios(templateId: string): InvitationData {
  return {
    eventoId: "",
    templateId,
    pagado: false,
    tituloEvento: "",
    nombresPrincipales: [""],
    anfitriones: "",
    fecha: "",
    hora: "10:30",
    lugar: { nombre: "", direccion: "", mapUrl: "" },
    vestimenta: "",
    whatsappNumero: "",
    features: { muroDeseos: true, rsvp: true, countdown: true, mapa: true, musica: false },
  };
}
