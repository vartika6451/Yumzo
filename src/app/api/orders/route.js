import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import Order from '../../../models/Order.js';
import { getAuthenticatedUser } from '../../../lib/auth.js';

export async function POST(req) {
  try {
    await connectDB();
    const { orderItems, deliveryAddress, restaurantId, totalPrice } = await req.json();

    const user = await getAuthenticatedUser();
    const userId = user ? user._id : '651f4d9b23b1c1d8a4f91e32';

    // Map items safely
    const mappedItems = (orderItems || []).map((item) => {
      const parsedPrice = typeof item.price === 'string'
        ? parseFloat(item.price.replace(/[^0-9.-]+/g, ''))
        : Number(item.price);
      return {
        menuItem: item.id && String(item.id).length === 24 ? item.id : '651f4d9b23b1c1d8a4f91e32',
        name: item.name || 'Food Item',
        quantity: item.quantity || 1,
        price: isNaN(parsedPrice) ? 0 : parsedPrice,
      };
    });

    const order = new Order({
      user: userId,
      restaurant: restaurantId && String(restaurantId).length === 24 ? restaurantId : '651f4d9b23b1c1d8a4f91e32',
      items: mappedItems,
      deliveryAddress: deliveryAddress || '123 Gourmet St, Connaught Place',
      totalPrice: Number(totalPrice) || 0,
      status: 'Placed',
      paymentStatus: 'Pending',
    });

    const createdOrder = await order.save();
    return NextResponse.json(createdOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
