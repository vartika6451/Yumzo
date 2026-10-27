'use client';
import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Package, ChevronLeft, RefreshCw } from 'lucide-react';
import OrderTracker from '../../../components/OrderTracker';
import { useRouter } from 'next/navigation';

export default function DriverDashboardPage() {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchAvailableOrders();
    const active = typeof window !== 'undefined' ? localStorage.getItem('activeDelivery') : null;
    if (active) setActiveOrderId(active);
  }, []);

  const fetchAvailableOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/driver/available-orders');
      if (res.ok) {
        const data = await res.json();
        setAvailableOrders(data);
      }
    } catch (error) {
      console.error('Error fetching driver orders', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptDelivery = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/assign-driver`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setActiveOrderId(orderId);
        localStorage.setItem('activeDelivery', orderId);
        fetchAvailableOrders();
      }
    } catch (error) {
      console.error('Failed to assign driver', error);
    }
  };

  const completeDelivery = async () => {
    if (!activeOrderId) return;
    try {
      await fetch(`/api/orders/${activeOrderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Delivered' }),
      });
      setActiveOrderId(null);
      localStorage.removeItem('activeDelivery');
      fetchAvailableOrders();
    } catch (error) {
      console.error('Failed to complete delivery', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <button
              onClick={() => router.push('/home')}
              className="flex items-center text-gray-500 hover:text-gray-900 transition font-bold text-sm mb-2"
            >
              <ChevronLeft size={16} className="mr-1" /> Back to Store
            </button>
            <h1 className="text-3xl font-black text-gray-900">Delivery Driver Hub</h1>
            <p className="text-gray-500 text-sm mt-0.5">Pick up ready orders and synchronize customer dispatch</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAvailableOrders}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold text-xs shadow-sm transition"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <div className="flex items-center gap-2 text-green-700 bg-green-100/70 border border-green-200 px-4 py-2 rounded-full font-black text-xs uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Online &amp; Active
            </div>
          </div>
        </div>

        {activeOrderId ? (
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center shadow-inner">
                <Navigation size={26} />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-red-500">In Transit</span>
                <h2 className="text-2xl font-black text-gray-900">Active Delivery Mission</h2>
                <p className="text-gray-500 text-xs mt-0.5">Order #{activeOrderId.slice(-6)} • Follow progress below</p>
              </div>
            </div>
            
            <OrderTracker orderId={activeOrderId} initialStatus="Out for Delivery" />
            
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button 
                onClick={completeDelivery}
                className="px-8 py-3.5 bg-green-500 text-white rounded-xl font-black text-base hover:bg-green-600 shadow-xl shadow-green-500/30 transition active:scale-95"
              >
                ✓ Complete &amp; Mark as Delivered
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="text-red-500" /> Available Pickups ({availableOrders.length})
            </h2>
            
            {availableOrders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
                <p className="text-gray-400 font-bold">No orders currently ready for pickup.</p>
                <p className="text-gray-400 text-xs mt-1">Orders marked &quot;Ready&quot; by restaurant kitchens appear here.</p>
              </div>
            ) : (
              availableOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono font-bold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-md">
                        #{order._id.slice(-6)}
                      </span>
                      <span className="text-xs font-extrabold text-green-600 bg-green-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mt-2">
                      <MapPin size={16} className="text-red-500 shrink-0" />
                      <span className="font-semibold text-sm">
                        Deliver to: {order.deliveryAddress || 'Standard Delivery Address'}
                      </span>
                    </div>
                    {order.restaurant?.name && (
                      <p className="text-xs text-gray-400 mt-1 pl-6">
                        From: {order.restaurant.name}
                      </p>
                    )}
                  </div>
                  <button 
                    onClick={() => acceptDelivery(order._id)}
                    className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white font-extrabold text-sm rounded-xl hover:bg-gray-800 transition active:scale-95 shadow-md"
                  >
                    Accept Pickup ➔
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
