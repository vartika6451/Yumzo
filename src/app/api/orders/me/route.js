import { NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server.js';
import { createAdminClient } from '../../../../lib/supabase/admin.js';
import { isSupabaseConfigured } from '../../../../lib/supabase/helpers.js';

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const adminClient = createAdminClient() || supabase;

      let userId = null;
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id || null;
      }

      let query = adminClient
        .from('orders')
        .select(`
          *,
          restaurant:restaurants(name, image, address),
          items:order_items(item_name, quantity, unit_price)
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: orders, error } = await query;

      if (!error && orders) {
        const formatted = orders.map((o) => ({
          ...o,
          _id: o.id,
          totalPrice: o.total_price,
          deliveryAddress: o.delivery_address,
          paymentStatus: o.payment_status,
          createdAt: o.created_at,
          items: (o.items || []).map((i) => ({
            name: i.item_name,
            quantity: i.quantity,
            price: i.unit_price,
          })),
        }));
        return NextResponse.json(formatted);
      }
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching my orders:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
