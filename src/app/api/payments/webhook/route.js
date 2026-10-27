import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '../../../../lib/db.js';
import Order from '../../../../models/Order.js';
import { emitSocketEvent } from '../../../../lib/socket.js';

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        await connectDB();
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = 'Paid';
          order.status = 'Accepted';
          await order.save();

          emitSocketEvent('order:status_updated', {
            orderId: order._id,
            status: order.status,
            updatedAt: order.updatedAt,
          });

          console.log(`Order ${orderId} marked as Paid!`);
        }
      } catch (error) {
        console.error('Error updating order on webhook:', error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
