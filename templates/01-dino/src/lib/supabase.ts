import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Types matching the DB schema
export interface WishRow {
  id: string;
  evento_id: string;
  nombre_invitado: string;
  mensaje: string;
  avatar: string;
  created_at: string;
}

export interface RsvpRow {
  id: string;
  evento_id: string;
  nombre_invitado: string;
  asiste: boolean;
  num_adultos: number;
  restricciones_alimentarias: string;
  restriccion_detalle: string;
  created_at: string;
}
