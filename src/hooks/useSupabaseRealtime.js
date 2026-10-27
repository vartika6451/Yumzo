'use client';
import { useEffect } from 'react';
import { createClient } from '../lib/supabase/client.js';

/**
 * Subscribes to live Postgres changes on a specific order in Supabase.
 *
 * @param {string} orderId - The UUID or ID of the order to watch
 * @param {function} onStatusUpdate - Callback invoked when status changes
 */
export function useSupabaseRealtimeOrder(orderId, onStatusUpdate) {
  useEffect(() => {
    if (!orderId) return;

    const supabase = createClient();
    if (!supabase) return;

    // Listen to changes on the orders table for this specific order
    const channel = supabase
      .channel(`order-tracking-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          if (payload?.new && onStatusUpdate) {
            onStatusUpdate(payload.new.status);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, onStatusUpdate]);
}
