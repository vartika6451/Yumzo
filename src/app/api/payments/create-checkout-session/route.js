import { NextResponse } from 'next/server';

/**
 * Fictional Food-Delivery Simulation Checkout Handler:
 * Simulates payment confirmation safely without charging real credit cards or payments.
 */
export async function POST(req) {
  try {
    const { orderId } = await req.json();

    // Fictional Simulation Mode:
    // Returns url: null so the client gracefully redirects directly to /order-success/[id]
    return NextResponse.json({
      url: null,
      orderId,
      message: 'Simulated checkout successful. Redirecting to live tracking.',
    });
  } catch (error) {
    console.error('Simulation checkout handler error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
