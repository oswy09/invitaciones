import { Pedido, WishRow, RsvpRow } from "../types";
import { authClient } from "./authClient";

const sb = authClient;

function raise(msg: string): never {
  throw new Error(msg);
}

export const api = {
  async listarPedidos(): Promise<Pedido[]> {
    const { data, error } = await sb
      .from("eventos")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) raise(error.message);
    return data as Pedido[];
  },

  async listarWishes(eventoId: string): Promise<WishRow[]> {
    const { data, error } = await sb
      .from("muro_deseos")
      .select("*")
      .eq("evento_id", eventoId)
      .order("created_at", { ascending: false });
    if (error) raise(error.message);
    return data as WishRow[];
  },

  async listarRsvps(eventoId: string): Promise<RsvpRow[]> {
    const { data, error } = await sb
      .from("confirmaciones_rsvp")
      .select("*")
      .eq("evento_id", eventoId)
      .order("created_at", { ascending: false });
    if (error) raise(error.message);
    return data as RsvpRow[];
  },

  async actualizarPedido(
    eventoId: string,
    cambios: { pagado?: boolean; aprobado?: boolean; datos?: any; nombre_evento?: string; template_id?: string }
  ): Promise<{ ok: true }> {
    const { error } = await sb.from("eventos").update(cambios).eq("id", eventoId);
    if (error) raise(error.message);
    return { ok: true };
  },

  async actualizarWish(wishId: string, oculto: boolean): Promise<{ ok: true }> {
    const { error } = await sb.from("muro_deseos").update({ oculto }).eq("id", wishId);
    if (error) raise(error.message);
    return { ok: true };
  },

  async obtenerPrecios(): Promise<Record<string, { cop: number; usd: number }>> {
    const { data, error } = await sb
      .from("eventos")
      .select("datos")
      .eq("id", "config-precios")
      .maybeSingle();
    if (error) raise(error.message);
    if (!data) return { "01-dino": { cop: 70000, usd: 20 }, "02-stork": { cop: 60000, usd: 18 }, "03-space": { cop: 70000, usd: 20 } };
    return (data.datos as any).precios ?? {};
  },

  async guardarPrecios(precios: Record<string, { cop: number; usd: number }>): Promise<{ ok: true }> {
    const { error } = await sb.from("eventos").upsert(
      {
        id: "config-precios",
        template_id: "config",
        nombre_evento: "Configuración de Precios",
        fecha_evento: null,
        datos: { precios },
        pagado: true,
        aprobado: true,
      },
      { onConflict: "id" }
    );
    if (error) raise(error.message);
    return { ok: true };
  },

  async eliminarPedido(eventoId: string): Promise<{ ok: true }> {
    await sb.from("confirmaciones_rsvp").delete().eq("evento_id", eventoId);
    await sb.from("muro_deseos").delete().eq("evento_id", eventoId);
    const { error } = await sb.from("eventos").delete().eq("id", eventoId);
    if (error) raise(error.message);
    return { ok: true };
  },
};
