import { cookies, headers } from 'next/headers';
import { createClient } from './supabase/server.js';
import { isSupabaseConfigured } from './supabase/helpers.js';
import { verifyTokenString } from './jwt.js';

export async function getAuthenticatedUser() {
  // 1. Check Supabase Auth first
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, role')
            .eq('id', user.id)
            .single();

          return {
            _id: user.id,
            id: user.id,
            email: user.email,
            name: profile?.name || user.user_metadata?.name || user.email.split('@')[0],
            role: profile?.role || user.user_metadata?.role || 'customer',
          };
        }
      }
    }
  } catch (err) {
    console.warn('Supabase auth session check note:', err.message);
  }

  // 2. Fallback to Legacy JWT Cookie / Bearer Token
  let token = null;
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    if (tokenCookie) {
      token = tokenCookie.value;
    }
  } catch {
    // Ignore cookie read error
  }

  if (!token) {
    try {
      const headerList = await headers();
      const authHeader = headerList.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    } catch {
      // Ignore header read error
    }
  }

  if (!token) return null;

  const decoded = verifyTokenString(token);
  if (!decoded || !decoded.id) return null;

  return {
    _id: decoded.id,
    id: decoded.id,
    email: 'user@example.com',
    role: 'customer',
  };
}
