import { supabase } from "./supabase";
import { StorkDetails, InvitationData, fromInvitationData } from "../types";

export interface EventoResult {
  details: StorkDetails | null;
  pagado: boolean;
  aprobado: boolean;
  notFound: boolean;
}

export function getEventoIdFromUrl(): string {
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
