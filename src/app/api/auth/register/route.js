import { NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server.js';
import { isSupabaseConfigured } from '../../../../lib/supabase/helpers.js';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || email.split('@')[0],
              role: 'customer',
            },
          },
        });

        if (error) {
          return NextResponse.json({ message: error.message }, { status: 400 });
        }

        return NextResponse.json({
          _id: data.user?.id,
          id: data.user?.id,
          name: name || email.split('@')[0],
          email: email,
          role: 'customer',
          message: 'Account created successfully with Supabase Auth',
        }, { status: 201 });
      }
    }

    // Demo fallback if Supabase credentials are not yet entered
    return NextResponse.json({
      _id: 'usr_' + Date.now(),
      id: 'usr_' + Date.now(),
      name: name || email.split('@')[0],
      email: email,
      role: 'customer',
      message: 'Demo registration successful',
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
