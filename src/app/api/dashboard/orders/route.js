import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Order from '../../../../models/Order.js';

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find()
      .populate('user', 'name')
      .populate('driver', 'name')
      .sort('-createdAt');

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching dashboard orders:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
