import { createClient } from "@supabase/supabase-js";

// Cliente con la anon key, usado SOLO para Auth (login/logout/sesión).
// Las lecturas/escrituras de datos siempre pasan por el servidor local
// (ver src/lib/api.ts), nunca por este cliente directamente.
export const authClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
