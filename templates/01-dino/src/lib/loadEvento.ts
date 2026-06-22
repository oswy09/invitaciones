import { supabase } from "./supabase";
import { BabyShowerDetails, InvitationData, fromInvitationData, DEFAULT_SHOWER_DETAILS } from "../types";

export interface EventoResult {
  details: BabyShowerDetails;
  pagado: boolean;
  aprobado: boolean;
  notFound: boolean;
}

function getEventoIdFromUrl(): string {
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
