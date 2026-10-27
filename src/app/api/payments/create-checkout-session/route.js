import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '../../../../lib/db.js';
import Order from '../../../../models/Order.js';

export async function POST(req) {
  try {
    await connectDB();
    const { orderId } = await req.json();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || stripeKey.startsWith('sk_test_placeholder')) {
      // In development without real Stripe keys configured, return a mock fallback url
      return NextResponse.json({
        url: null,
        message: 'Stripe secret key not configured. Using demo mode.',
      });
    }

    const stripe = new Stripe(stripeKey);
    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const line_items = (order.items || []).map((item) => {
      const price = typeof item.price === 'string'
        ? parseFloat(item.price.replace(/[^0-9.-]+/g, ''))
        : Number(item.price);
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name || 'Food Item',
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: item.quantity || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${origin}/order-success/${orderId}`,
      cancel_url: `${origin}/order-cancelled`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    order.stripeSessionId = session.id;
    await order.save();

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
