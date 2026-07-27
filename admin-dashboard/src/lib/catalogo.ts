// Catálogo de plantillas — fuente de verdad para el admin.
// Cuando se cree una nueva plantilla en client-form/src/types.ts, añadirla aquí también.

export interface PlantillaAdmin {
  id: string;
  nombre: string;
  emoji: string;
  descripcion: string;
  categoria: "Baby Shower" | "Boda" | "Cumpleaños" | "Quinceaños";
  baseUrl: string;
  esFree?: boolean;
  precioDefault: { cop: number; usd: number };
  colorChip: string; // clases tailwind para el chip en listas
  barColor: string;  // clase tailwind para la barra de progreso en el chart
}

export const CATALOGO_ADMIN: PlantillaAdmin[] = [
  {
    id: "01-dino",
    nombre: "Baby Dino",
    emoji: "🦖",
    descripcion: "Baby shower de dinosaurios, con sobre interactivo",
    categoria: "Baby Shower",
    baseUrl: "https://dino.celebrarte.com.co",
    precioDefault: { cop: 70000, usd: 20 },
    colorChip: "bg-emerald-50 text-emerald-700",
    barColor: "bg-emerald-500",
  },
  {
    id: "02-stork",
    nombre: "Cigüeña Dulce",
    emoji: "🦢",
    descripcion: "Baby shower de cigüeña y nubes, intro animada",
    categoria: "Baby Shower",
    baseUrl: "https://stork.celebrarte.com.co",
    precioDefault: { cop: 60000, usd: 18 },
    colorChip: "bg-sky-50 text-sky-700",
    barColor: "bg-sky-500",
  },
  {
    id: "03-space",
    nombre: "Aventura Espacial",
    emoji: "🚀",
    descripcion: "Baby shower espacial, cohete y estrellas",
    categoria: "Baby Shower",
    baseUrl: "https://space.celebrarte.com.co",
    precioDefault: { cop: 70000, usd: 20 },
    colorChip: "bg-indigo-50 text-indigo-700",
    barColor: "bg-indigo-500",
  },
  {
    id: "04-Moderna",
    nombre: "Boda Moderna",
    emoji: "💍",
    descripcion: "Invitación de bodas elegante, sobre animado y música",
    categoria: "Boda",
    baseUrl: "https://boda-moderna.celebrarte.com.co",
    precioDefault: { cop: 80000, usd: 22 },
    colorChip: "bg-rose-50 text-rose-700",
    barColor: "bg-rose-400",
  },
  {
    id: "free-01-cumple",
    nombre: "Cumpleaños Festivo",
    emoji: "🎂",
    descripcion: "Invitación de cumpleaños gratuita, lista en segundos",
    categoria: "Cumpleaños",
    baseUrl: "https://free-01.celebrarte.com.co",
    esFree: true,
    precioDefault: { cop: 0, usd: 0 },
    colorChip: "bg-amber-50 text-amber-700",
    barColor: "bg-amber-400",
  },
];

// URL del formulario de pedido asistido (para compartir por WhatsApp)
export const FORM_CONTACTO_URL = "https://celebrarte.com.co/formulario-solicitud";
// URL del catálogo de plantillas
export const CATALOGO_URL = "https://celebrarte.com.co/plantillas";
