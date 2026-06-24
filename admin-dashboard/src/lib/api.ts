import { Pedido, WishRow, RsvpRow } from "../types";
import { authClient } from "./authClient";

const BASE_URL = import.meta.env.VITE_ADMIN_SERVER_URL ?? "http://localhost:3301";

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const { data } = await authClient.auth.getSession();
  const token = data.session?.access_token;

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Error ${res.status}`);
  }
  return res.json();
}

export const api = {
  listarPedidos: () => req<Pedido[]>("/api/pedidos"),
  listarWishes: (eventoId: string) => req<WishRow[]>(`/api/pedidos/${eventoId}/wishes`),
  listarRsvps: (eventoId: string) => req<RsvpRow[]>(`/api/pedidos/${eventoId}/rsvps`),
  actualizarPedido: (
    eventoId: string,
    cambios: {
      pagado?: boolean;
      aprobado?: boolean;
      datos?: any;
      nombre_evento?: string;
      template_id?: string;
    }
  ) => req<{ ok: true }>(`/api/pedidos/${eventoId}`, { method: "PATCH", body: JSON.stringify(cambios) }),
  actualizarWish: (wishId: string, oculto: boolean) =>
    req<{ ok: true }>(`/api/wishes/${wishId}`, { method: "PATCH", body: JSON.stringify({ oculto }) }),
  obtenerPrecios: () => req<Record<string, { cop: number; usd: number }>>("/api/precios"),
  guardarPrecios: (precios: Record<string, { cop: number; usd: number }>) =>
    req<{ ok: true }>("/api/precios", { method: "POST", body: JSON.stringify(precios) }),
  eliminarPedido: (eventoId: string) => req<{ ok: true }>(`/api/pedidos/${eventoId}`, { method: "DELETE" }),
};
