import { NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server.js';
import { isSupabaseConfigured } from '../../../../lib/supabase/helpers.js';

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          return NextResponse.json(data);
        }
      }
    }

    return NextResponse.json({
      id,
      name: 'The Indian Spice',
      cuisine: 'Indian',
      address: 'Block M, Connaught Place, New Delhi',
      rating: 4.8,
      delivery_time: '25-35 min',
      image: '/images/indian.jpeg',
    });
  } catch (error) {
    console.error('Error fetching restaurant by id:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
