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
          items:order_items(id, item_name, unit_price, quantity, total_price)
        `)
        .order('created_at', { ascending: false });

      if (!error && orders) {
        // Normalize data for existing frontend UI compatibility
        const formattedOrders = orders.map((o) => ({
          ...o,
          _id: o.id,
          totalPrice: o.total_price,
          deliveryAddress: o.delivery_address,
          paymentStatus: o.payment_status,
          createdAt: o.created_at,
          items: (o.items || []).map((i) => ({
            name: i.item_name,
            price: i.unit_price,
            quantity: i.quantity,
          })),
        }));

        return NextResponse.json(formattedOrders);
      }
    }

    // Default mock orders for demo fallback if Supabase has no orders yet
    return NextResponse.json([
      {
        _id: 'ord_demo_01',
        id: 'ord_demo_01',
        restaurant: { name: 'The Indian Spice', image: '/images/indian.jpeg' },
        status: 'Accepted',
        totalPrice: 1650,
        deliveryAddress: '123 Connaught Place, New Delhi',
        paymentStatus: 'Paid',
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        items: [
          { name: 'Dal Makhani', price: 750, quantity: 1 },
          { name: 'Chole Bhature', price: 900, quantity: 1 },
        ],
      },
      {
        _id: 'ord_demo_02',
        id: 'ord_demo_02',
        restaurant: { name: 'Bella Trattoria', image: '/images/italian.png' },
        status: 'Preparing',
        totalPrice: 2150,
        deliveryAddress: '45 Khan Market, New Delhi',
        paymentStatus: 'Paid',
        createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        items: [
          { name: 'Margherita Pizza', price: 1100, quantity: 1 },
          { name: 'Pasta Alfredo', price: 1050, quantity: 1 },
        ],
      },
      {
        _id: 'ord_demo_03',
        id: 'ord_demo_03',
        restaurant: { name: 'Wok This Way', image: '/images/chinese.jpeg' },
        status: 'Ready',
        totalPrice: 1600,
        deliveryAddress: 'Cyber Hub Tower B, Gurugram',
        paymentStatus: 'Paid',
        createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        items: [
          { name: 'Hakka Noodles', price: 850, quantity: 1 },
          { name: 'Spring Rolls', price: 750, quantity: 1 },
        ],
      },
    ]);
  } catch (error) {
    console.error('Error fetching dashboard orders:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
