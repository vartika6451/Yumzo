import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db.js';
import Order from '../../../../../models/Order.js';
import { emitSocketEvent } from '../../../../../lib/socket.js';
import { getAuthenticatedUser } from '../../../../../lib/auth.js';

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    const user = await getAuthenticatedUser();
    order.driver = user ? user._id : '651f4d9b23b1c1d8a4f91e32';
    order.status = 'Out for Delivery';

    const updatedOrder = await order.save();

    // Emit live Socket.io event
    emitSocketEvent('order:status_updated', {
      orderId: updatedOrder._id,
      status: updatedOrder.status,
      updatedAt: updatedOrder.updatedAt,
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error assigning driver:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
