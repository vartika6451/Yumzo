import { NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server.js';
import { createAdminClient } from '../../../../lib/supabase/admin.js';
import { isSupabaseConfigured } from '../../../../lib/supabase/helpers.js';

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const adminClient = createAdminClient() || supabase;

      const { data: orders, error } = await adminClient
        .from('orders')
        .select(`
          *,
          restaurant:restaurants(name, address, image),
          items:order_items(item_name, quantity, unit_price)
        `)
        .eq('status', 'Ready')
        .order('created_at', { ascending: false });

      if (!error && orders) {
        const formatted = orders.map((o) => ({
          ...o,
          _id: o.id,
          totalPrice: o.total_price,
          deliveryAddress: o.delivery_address,
          items: (o.items || []).map((i) => ({
            name: i.item_name,
            quantity: i.quantity,
          })),
        }));
        return NextResponse.json(formatted);
      }
    }

    // Default mock available order for driver testing
    return NextResponse.json([
      {
        _id: 'ord_driver_01',
        id: 'ord_driver_01',
        status: 'Ready',
        totalPrice: 1600,
        deliveryAddress: 'Cyber Hub Tower B, Gurugram',
        restaurant: {
          name: 'Wok This Way',
          address: 'DLF Cyber Hub, Sector 24, Gurugram',
          image: '/images/chinese.jpeg',
        },
        items: [
          { name: 'Hakka Noodles', quantity: 1 },
          { name: 'Spring Rolls', quantity: 1 },
        ],
      },
    ]);
  } catch (error) {
    console.error('Error fetching available driver orders:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
