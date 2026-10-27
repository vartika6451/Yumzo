import { NextResponse } from 'next/server';
import { createClient } from '../../../../../lib/supabase/server.js';
import { createAdminClient } from '../../../../../lib/supabase/admin.js';
import { isSupabaseConfigured } from '../../../../../lib/supabase/helpers.js';
import { emitSocketEvent } from '../../../../../lib/socket.js';

const VALID_STATUSES = [
  'Placed',
  'Accepted',
  'Preparing',
  'Ready',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ message: `Invalid status: ${status}` }, { status: 400 });
    }

    // Always emit live Socket.io event for instant UI feedback
    emitSocketEvent('order:status_updated', {
      orderId: id,
      status: status,
      updatedAt: new Date().toISOString(),
    });

    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const adminClient = createAdminClient() || supabase;

      const { data: updatedOrder, error } = await adminClient
        .from('orders')
        .update({ status: status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.warn('Supabase status update note:', error.message);
      }

      return NextResponse.json({
        ...updatedOrder,
        _id: id,
        status: status,
      });
    }

    // Fallback demo response
    return NextResponse.json({
      _id: id,
      id: id,
      status: status,
      message: 'Status updated successfully',
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
