import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sljydxuogmkdlznwwzms.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsanlkeHVvZ21rZGx6bnd3em1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNDYzNjUsImV4cCI6MjA5NzcyMjM2NX0.rTEp4gzAxKYQLdPNsAy2UTnVt3yuMdB1MWaId6We7VE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const EVENTO_ID = 'maria-juanca-2026';

export async function saveRsvp(nombre: string, asiste: boolean) {
  const { error } = await supabase
    .from('rsvp_responses')
    .insert({ nombre, asiste, evento_id: EVENTO_ID });
  if (error) throw new Error(error.message);
}
