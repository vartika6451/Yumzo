import { NextResponse } from 'next/server';
import { createClient } from '../../../../../lib/supabase/server.js';
import { createAdminClient } from '../../../../../lib/supabase/admin.js';
import { isSupabaseConfigured } from '../../../../../lib/supabase/helpers.js';
import { emitSocketEvent } from '../../../../../lib/socket.js';

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;

    // Emit live Socket.io event
    emitSocketEvent('order:status_updated', {
      orderId: id,
      status: 'Out for Delivery',
      updatedAt: new Date().toISOString(),
    });

    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const adminClient = createAdminClient() || supabase;

      let driverId = null;
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        driverId = user?.id || null;
      }

      const updatePayload = {
        status: 'Out for Delivery',
        updated_at: new Date().toISOString(),
      };
      if (driverId) updatePayload.driver_id = driverId;

      const { data: updatedOrder, error } = await adminClient
        .from('orders')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.warn('Supabase assign driver note:', error.message);
      }

      return NextResponse.json({
        ...updatedOrder,
        _id: id,
        status: 'Out for Delivery',
      });
    }

    return NextResponse.json({
      _id: id,
      id: id,
      status: 'Out for Delivery',
      message: 'Driver assigned successfully',
    });
  } catch (error) {
    console.error('Error assigning driver:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
