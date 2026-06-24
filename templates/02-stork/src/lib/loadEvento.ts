import { supabase } from "./supabase";
import { StorkDetails, InvitationData, fromInvitationData } from "../types";

export interface EventoResult {
  details: StorkDetails | null;
  pagado: boolean;
  aprobado: boolean;
  notFound: boolean;
}

export function getEventoIdFromUrl(): string {
  // Patrón de hosting (ver docs/PLAN..., sección 2.3): una plantilla publicada
  // en Netlify sirve a N clientes por ruta, ej. stork.tudominio.com/boda-juan-2026.
  const path = window.location.pathname.replace(/^\/+/, "").replace(/\/+$/, "");
  if (path) return decodeURIComponent(path.split("/")[0]);

  // Compatibilidad: ?evento=slug sigue funcionando por si algún link viejo lo usa.
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
    // Sin evento en Supabase: la plantilla sigue funcionando con sus datos por defecto.
    return { details: null, pagado: true, aprobado: true, notFound: true };
  }

  const invitationData = data.datos as InvitationData;
  return {
    details: fromInvitationData(invitationData),
    pagado: data.pagado,
    aprobado: data.aprobado,
    notFound: false,
  };
}
