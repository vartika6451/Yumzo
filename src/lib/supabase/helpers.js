/**
 * Check if Supabase environment variables are properly configured.
 */
export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  return Boolean(
    url &&
    key &&
    !url.includes('your-project-url') &&
    !key.includes('your-publishable-key')
  );
}
