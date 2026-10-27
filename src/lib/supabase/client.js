import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for use in Client Components (Browser).
 * Uses NEXT_PUBLIC_SUPABASE_URL and publishable/anon key.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-url')) {
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
