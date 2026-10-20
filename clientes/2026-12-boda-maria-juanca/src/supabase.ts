import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const EVENTO_ID = 'maria-juanca-2026';

export async function saveRsvp(nombre: string, asiste: boolean) {
  const { error } = await supabase
    .from('rsvp_responses')
    .upsert(
      { nombre, asiste, evento_id: EVENTO_ID },
      { onConflict: 'nombre,evento_id' }
    );
  if (error) throw new Error(error.message);
}
