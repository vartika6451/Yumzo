import { NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server.js';
import { isSupabaseConfigured } from '../../../../lib/supabase/helpers.js';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return NextResponse.json({ message: error.message }, { status: 401 });
        }

        // Retrieve profile role and name
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, role')
          .eq('id', data.user.id)
          .single();

        return NextResponse.json({
          _id: data.user.id,
          id: data.user.id,
          name: profile?.name || data.user.user_metadata?.name || email.split('@')[0],
          email: data.user.email,
          role: profile?.role || data.user.user_metadata?.role || 'customer',
          message: 'Logged in successfully with Supabase Auth',
        });
      }
    }

    // Demo fallback for testing without Supabase
    return NextResponse.json({
      _id: 'usr_demo_123',
      id: 'usr_demo_123',
      name: email.split('@')[0],
      email: email,
      role: 'customer',
      message: 'Demo login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
