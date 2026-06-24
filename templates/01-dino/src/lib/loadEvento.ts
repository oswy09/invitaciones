import { supabase } from "./supabase";
import { BabyShowerDetails, InvitationData, fromInvitationData, DEFAULT_SHOWER_DETAILS } from "../types";

export interface EventoResult {
  details: BabyShowerDetails;
  pagado: boolean;
  aprobado: boolean;
  notFound: boolean;
}

function getEventoIdFromUrl(): string {
  // Patrón de hosting (ver docs/PLAN..., sección 2.3): una plantilla publicada
  // en Netlify sirve a N clientes por ruta, ej. dino.tudominio.com/boda-juan-2026.
  const path = window.location.pathname.replace(/^\/+/, "").replace(/\/+$/, "");
  if (path) return decodeURIComponent(path.split("/")[0]);

  // Compatibilidad: ?evento=slug sigue funcionando (usado por el admin-dashboard
  // y client-form de esta sesión) por si algún link viejo lo usa todavía.
  const params = new URLSearchParams(window.location.search);
  return params.get("evento") ?? "baby-shower-demo";
}

export async function loadEvento(): Promise<EventoResult> {
  const eventoId = getEventoIdFromUrl();

  const { data, error } = await supabase
    .from("eventos")
    .select("datos, pagado, aprobado")
    .eq("id", eventoId)
    .single();

  if (error || !data) {
    // Fallback a datos de ejemplo si el evento no existe o aún no hay conexión configurada.
    return { details: DEFAULT_SHOWER_DETAILS, pagado: true, aprobado: true, notFound: true };
  }

  const invitationData = data.datos as InvitationData;
  return {
    details: fromInvitationData(invitationData),
    pagado: data.pagado,
    aprobado: data.aprobado,
    notFound: false,
  };
}
