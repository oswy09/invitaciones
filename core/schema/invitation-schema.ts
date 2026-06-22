export interface InvitationData {
  // Identificación
  eventoId: string; // slug único, ej: "baby-shower-thomas-2026"
  templateId: string; // qué plantilla usa, ej: "01-dino"
  pagado: boolean; // controla si se muestra marca de agua

  // Datos del evento (genéricos, aplican a cualquier tipo de celebración)
  tituloEvento: string; // ej: "Baby Shower de Thomas" / "Boda de Ana y Luis"
  nombresPrincipales: string[]; // ej: ["Thomas"] o ["Ana", "Luis"]
  anfitriones?: string; // ej: "Sofía & Alejandro" (padres, padrinos, quien organiza)
  fecha: string; // ISO: "2026-07-05"
  hora: string; // "10:30"
  fechaTexto?: string; // versión legible opcional: "Sábado, 4 de Julio de 2026"

  lugar: {
    nombre: string;
    direccion: string;
    mapUrl: string; // Google Maps URL
  };

  vestimenta?: string; // dress code, opcional
  mensajePersonalizado?: string; // texto libre que el cliente puede escribir

  registroRegalos?: {
    tienda: string;
    url?: string;
    codigo?: string;
    notaAlternativa?: string;
  }[];

  // Personalización visual
  paletaColores?: string; // referencia a una paleta predefinida, ej: "azul-pastel"
  fotos?: string[]; // URLs de fotos subidas por el cliente

  // Contacto para RSVP por WhatsApp (si la plantilla lo usa)
  whatsappNumero?: string;

  // Features activas (declara qué módulos de core/features/ debe cargar la plantilla)
  features: {
    muroDeseos: boolean;
    rsvp: boolean;
    countdown: boolean;
    mapa: boolean;
    musica: boolean;
  };

  extra?: Record<string, unknown>; // campos específicos de una plantilla puntual
}
