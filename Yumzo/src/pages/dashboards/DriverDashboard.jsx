import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Package } from 'lucide-react';
import OrderTracker from '../../components/OrderTracker';

const DriverDashboard = () => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeOrderId, setActiveOrderId] = useState(null);

  useEffect(() => {
    fetchAvailableOrders();
    const active = localStorage.getItem('activeDelivery');
    if (active) setActiveOrderId(active);
  }, []);

  const fetchAvailableOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/driver/available-orders');
      const data = await res.json();
      setAvailableOrders(data);
    } catch (error) {
      console.error('Error fetching driver orders', error);
    }
  };

  const acceptDelivery = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/assign-driver`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
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
      await fetch(`http://localhost:5000/api/orders/${activeOrderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Delivered' })
      });
      setActiveOrderId(null);
      localStorage.removeItem('activeDelivery');
    } catch (error) {
      console.error('Failed to complete', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full font-bold">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Online
          </div>
        </div>

        {activeOrderId ? (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                <Navigation size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Active Delivery</h2>
                <p className="text-gray-500 text-sm">Follow the tracker and tap complete when delivered.</p>
              </div>
            </div>
            
            <OrderTracker orderId={activeOrderId} initialStatus="Out for Delivery" />
            
            <div className="mt-8 flex justify-end">
              <button 
                onClick={completeDelivery}
                className="px-8 py-3 bg-green-500 text-white rounded-lg font-bold text-lg hover:bg-green-600 shadow-lg shadow-green-500/30 transition"
              >
                Mark as Delivered
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="text-gray-400" /> Available Pickups ({availableOrders.length})
            </h2>
            
            {availableOrders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 font-medium">No orders ready for pickup currently.</p>
              </div>
            ) : (
              availableOrders.map(order => (
                <div key={order._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center hover:shadow-md transition">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded">#{order._id.slice(-6)}</span>
                      <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">{order.status}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mt-3">
                      <MapPin size={16} className="text-red-400" />
                      <span className="font-medium text-sm">Deliver to: {order.deliveryAddress}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => acceptDelivery(order._id)}
                    className="px-6 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition"
                  >
                    Accept Delivery
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
