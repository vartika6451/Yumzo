import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '../../../../lib/supabase/admin.js';
import { isSupabaseConfigured } from '../../../../lib/supabase/helpers.js';
import { emitSocketEvent } from '../../../../lib/socket.js';

export async function POST(req) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecret || stripeSecret.startsWith('sk_test_placeholder')) {
    return NextResponse.json({ received: true, mode: 'simulation' });
  }

  const stripe = new Stripe(stripeSecret);
  const sig = req.headers.get('stripe-signature');

  let event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      if (isSupabaseConfigured()) {
        const adminClient = createAdminClient();
        if (adminClient) {
          await adminClient
            .from('orders')
            .update({ payment_status: 'Paid', status: 'Accepted', updated_at: new Date().toISOString() })
            .eq('id', orderId);
        }
      }

      emitSocketEvent('order:status_updated', {
        orderId: orderId,
        status: 'Accepted',
        updatedAt: new Date().toISOString(),
      });
    }
  }

  return NextResponse.json({ received: true });
}
