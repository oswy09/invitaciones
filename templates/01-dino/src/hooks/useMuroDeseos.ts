import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface Wish {
  id: string;
  name: string;
  message: string;
  avatar: string;
  timestamp: string;
}

interface WishRow {
  id: string;
  evento_id: string;
  nombre_invitado: string;
  mensaje: string;
  avatar: string;
  oculto: boolean;
  created_at: string;
}

function toWish(r: WishRow): Wish {
  return { id: r.id, name: r.nombre_invitado, message: r.mensaje, avatar: r.avatar, timestamp: r.created_at };
}

/**
 * Hook reutilizable para el muro de deseos: carga inicial + realtime + insert.
 * Cada plantilla pasa su propio cliente de Supabase (ver core/supabase-client).
 */
export function useMuroDeseos(supabase: SupabaseClient, eventoId: string) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase
      .from("muro_deseos")
      .select("*")
      .eq("evento_id", eventoId)
      .eq("oculto", false)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!active) return;
        if (data) setWishes(data.map(toWish));
        setLoading(false);
      });

    const channel = supabase
      .channel(`muro-${eventoId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "muro_deseos", filter: `evento_id=eq.${eventoId}` },
        (payload) => {
          const r = payload.new as WishRow;
          if (r.oculto) return;
          setWishes((prev) => (prev.some((w) => w.id === r.id) ? prev : [toWish(r), ...prev]));
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [supabase, eventoId]);

  async function addWish(input: { name: string; message: string; avatar: string }) {
    const tempId = `temp-${Date.now()}`;
    const optimistic: Wish = { id: tempId, name: input.name, message: input.message, avatar: input.avatar, timestamp: new Date().toISOString() };
    setWishes((prev) => [optimistic, ...prev]);

    const { data, error } = await supabase
      .from("muro_deseos")
      .insert({ evento_id: eventoId, nombre_invitado: input.name, mensaje: input.message, avatar: input.avatar })
      .select()
      .single();

    if (error) {
      setWishes((prev) => prev.filter((w) => w.id !== tempId));
      throw error;
    }

    setWishes((prev) => prev.map((w) => (w.id === tempId ? toWish(data as WishRow) : w)));
  }

  return { wishes, loading, addWish };
}
