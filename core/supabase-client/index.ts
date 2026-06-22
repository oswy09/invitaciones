import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function createSupabaseClient(url: string, anonKey: string): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error(
      "Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Revisa el .env de la plantilla."
    );
  }
  return createClient(url, anonKey);
}
