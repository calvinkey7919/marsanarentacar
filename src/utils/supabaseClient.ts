import { createClient } from '@supabase/supabase-js';

// Supabase client initialisation.
//
// On the client side we use the anon key provided via NEXT_PUBLIC_SUPABASE_ANON_KEY.
// On the server side (e.g. in API routes or server actions) you can use the
// SUPABASE_SERVICE_ROLE_KEY for elevated privileges.  Never expose your
// service role key to the browser.  See README.md for details.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// If you need a server‑side client with the service role key, create and
// export another client using process.env.SUPABASE_SERVICE_ROLE_KEY.
export function createServerSupabaseClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  return createClient(supabaseUrl, serviceKey);
}