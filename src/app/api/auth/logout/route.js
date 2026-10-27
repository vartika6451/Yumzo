import { NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server.js';
import { isSupabaseConfigured } from '../../../../lib/supabase/helpers.js';

export async function POST() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  }

  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.set('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  return response;
}
