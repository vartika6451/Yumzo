import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server.js';
import { createAdminClient } from '../../../lib/supabase/admin.js';
import { isSupabaseConfigured } from '../../../lib/supabase/helpers.js';
import { emitSocketEvent } from '../../../lib/socket.js';

export async function POST(req) {
  try {
    const { orderItems, deliveryAddress, restaurantId, totalPrice: clientTotalPrice } = await req.json();

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return NextResponse.json({ message: 'Cart items cannot be empty' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const adminClient = createAdminClient() || supabase;

      // 1. Authenticate user if logged in via Supabase Auth
      let userId = null;
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id || null;
      }

      // 2. Fetch restaurants to ensure valid restaurant_id or pick first available
      let verifiedRestaurantId = restaurantId;
      const { data: restaurants } = await adminClient.from('restaurants').select('id').limit(1);
      const defaultRestaurantId = restaurants?.[0]?.id || null;

      // Check if restaurantId is a valid UUID
      const isValidUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
      if (!isValidUUID(verifiedRestaurantId)) {
        verifiedRestaurantId = defaultRestaurantId;
      }

      // 3. SERVER-SIDE PRICE VALIDATION:
      // Never trust client-supplied totals. Fetch real prices from menu_items table.
      const itemNames = orderItems.map((i) => i.name);
      const { data: dbMenuItems } = await adminClient
        .from('menu_items')
        .select('id, name, price')
        .in('name', itemNames);

      const priceMap = new Map();
      const idMap = new Map();
      (dbMenuItems || []).forEach((dbItem) => {
        priceMap.set(dbItem.name, Number(dbItem.price));
        idMap.set(dbItem.name, dbItem.id);
      });

      let calculatedTotal = 0;
      const preparedOrderItems = orderItems.map((item) => {
        const quantity = Math.max(1, parseInt(item.quantity || 1, 10));
        // Use verified DB price if present; otherwise fallback to sanitized item price
        const fallbackPrice = typeof item.price === 'string'
          ? parseFloat(item.price.replace(/[^0-9.-]+/g, ''))
          : Number(item.price);
        const unitPrice = priceMap.has(item.name)
          ? priceMap.get(item.name)
          : (isNaN(fallbackPrice) ? 500 : fallbackPrice);

        const itemTotal = unitPrice * quantity;
        calculatedTotal += itemTotal;

        return {
          menu_item_id: idMap.get(item.name) || (isValidUUID(item.id) ? item.id : null),
          item_name: item.name || 'Food Item',
          unit_price: unitPrice,
          quantity: quantity,
          total_price: itemTotal,
        };
      });

      // 4. Insert Order into Supabase
      const { data: order, error: orderErr } = await adminClient
        .from('orders')
        .insert({
          user_id: userId,
          restaurant_id: verifiedRestaurantId,
          total_price: calculatedTotal,
          delivery_address: deliveryAddress || '123 Gourmet St, Connaught Place, New Delhi',
          status: 'Placed',
          payment_status: 'Paid', // Simulation: immediate confirmation
        })
        .select()
        .single();

      if (orderErr) {
        console.error('Supabase order creation error:', orderErr.message);
        throw new Error(orderErr.message);
      }

      // 5. Insert Order Items into Supabase
      const orderItemsPayload = preparedOrderItems.map((item) => ({
        ...item,
        order_id: order.id,
      }));

      const { error: itemsErr } = await adminClient
        .from('order_items')
        .insert(orderItemsPayload);

      if (itemsErr) {
        console.warn('Warning: Order items insertion issue:', itemsErr.message);
      }

      // 6. Emit Real-time Socket.io notification
      emitSocketEvent('order:status_updated', {
        orderId: order.id,
        status: 'Placed',
        updatedAt: order.created_at,
      });

      return NextResponse.json({
        ...order,
        _id: order.id, // For backward compatibility with existing frontend expectations
        items: preparedOrderItems,
      }, { status: 201 });
    }

    // Fallback simulation mode if Supabase is not configured yet
    const demoOrderId = 'ord_' + Date.now();
    const fallbackOrder = {
      _id: demoOrderId,
      id: demoOrderId,
      totalPrice: clientTotalPrice || 1200,
      deliveryAddress: deliveryAddress || '123 Gourmet St, Connaught Place, New Delhi',
      status: 'Placed',
      paymentStatus: 'Paid',
      items: orderItems,
      createdAt: new Date().toISOString(),
    };

    emitSocketEvent('order:status_updated', {
      orderId: demoOrderId,
      status: 'Placed',
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(fallbackOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
