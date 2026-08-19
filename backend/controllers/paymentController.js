import Stripe from 'stripe';
import Order from '../models/Order.js';

export const createCheckoutSession = async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const line_items = order.items.map((item) => {
      // Ensure price is treated as a number
      const price = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.-]+/g, '')) : Number(item.price);
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name || 'Food Item',
          },
          unit_amount: Math.round(price * 100), // Stripe requires cents
        },
        quantity: item.quantity || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `http://localhost:5173/order-success/${orderId}`,
      cancel_url: `http://localhost:5173/order-cancelled`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const stripeWebhook = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // req.body must be raw buffer here
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    try {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = 'Paid';
        // Auto-update status to Accepted once paid
        order.status = 'Accepted'; 
        await order.save();

        // Emit socket event to frontend
        const io = req.app.locals.io;
        if (io) {
          io.emit('order:status_updated', {
            orderId: order._id,
            status: order.status,
            updatedAt: order.updatedAt,
          });
        }
        console.log(`Order ${orderId} marked as Paid!`);
      }
    } catch (error) {
      console.error('Error updating order on webhook:', error);
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};
