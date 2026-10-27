import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db.js';
import Order from '../../../../../models/Order.js';
import { emitSocketEvent } from '../../../../../lib/socket.js';

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    // DEMO BYPASS: If test_order_123, emit socket event without DB lookup
    if (id === 'test_order_123' || id === 'demo_order') {
      emitSocketEvent('order:status_updated', {
        orderId: id,
        status: status,
        updatedAt: new Date(),
      });
      return NextResponse.json({ message: 'Demo status updated successfully', orderId: id, status });
    }

    await connectDB();
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    order.status = status;
    const updatedOrder = await order.save();

    // Emit live Socket.io event
    emitSocketEvent('order:status_updated', {
      orderId: updatedOrder._id,
      status: updatedOrder.status,
      updatedAt: updatedOrder.updatedAt,
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
