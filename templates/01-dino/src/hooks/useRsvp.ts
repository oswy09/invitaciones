import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface RsvpEntry {
  id: string;
  name: string;
  attending: boolean;
  adults: number;
  dietRestriction: string;
  dietDetail: string;
  timestamp: string;
}

interface RsvpRow {
  id: string;
  evento_id: string;
  nombre_invitado: string;
  asiste: boolean;
  num_adultos: number;
  restricciones_alimentarias: string;
  restriccion_detalle: string;
  created_at: string;
}

function toRsvp(r: RsvpRow): RsvpEntry {
  return {
    id: r.id,
    name: r.nombre_invitado,
    attending: r.asiste,
    adults: r.num_adultos,
    dietRestriction: r.restricciones_alimentarias,
    dietDetail: r.restriccion_detalle,
    timestamp: r.created_at,
  };
}

/**
 * Hook reutilizable para confirmaciones de asistencia (RSVP).
 * Cada plantilla pasa su propio cliente de Supabase (ver core/supabase-client).
 */
export function useRsvp(supabase: SupabaseClient, eventoId: string) {
  const [confirmations, setConfirmations] = useState<RsvpEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase
      .from("confirmaciones_rsvp")
      .select("*")
      .eq("evento_id", eventoId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!active) return;
        if (data) setConfirmations(data.map(toRsvp));
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [supabase, eventoId]);

  async function submitRsvp(input: {
    name: string;
    attending: boolean;
    adults: number;
    dietRestriction?: string;
    dietDetail?: string;
  }) {
    const { data, error } = await supabase
      .from("confirmaciones_rsvp")
      .insert({
        evento_id: eventoId,
        nombre_invitado: input.name,
        asiste: input.attending,
        num_adultos: input.adults,
        restricciones_alimentarias: input.dietRestriction ?? "",
        restriccion_detalle: input.dietDetail ?? "",
      })
      .select()
      .single();

    if (error) throw error;

    const entry = toRsvp(data as RsvpRow);
    setConfirmations((prev) => [entry, ...prev]);
    return entry;
  }

  return { confirmations, loading, submitRsvp };
}
