import { NextResponse } from 'next/server';
import { createClient } from '../../../../../lib/supabase/server.js';
import { isSupabaseConfigured } from '../../../../../lib/supabase/helpers.js';
import { indianItems } from '../../../../../data/menu.js';

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', id)
          .eq('is_available', true)
          .order('name');

        if (!error && data && data.length > 0) {
          return NextResponse.json(data);
        }
      }
    }

    return NextResponse.json(indianItems);
  } catch (error) {
    console.error('Error fetching restaurant menu:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
