import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Privileged database client. Call only from the Next.js server or the
 * operator-machine importer. Never import this from a client component.
 */
export function createServiceRoleClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
