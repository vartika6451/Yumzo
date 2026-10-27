import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Order from '../../../../models/Order.js';
import { getAuthenticatedUser } from '../../../../lib/auth.js';

export async function GET() {
  try {
    await connectDB();
    const user = await getAuthenticatedUser();
    const userId = user ? user._id : '651f4d9b23b1c1d8a4f91e32';

    const orders = await Order.find({ user: userId })
      .populate('restaurant', 'name image address')
      .sort('-createdAt');

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching my orders:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
