'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ChefHat, CheckCircle2, Bike, RefreshCw, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useSocket from '../../../hooks/useSocket';

const STATUSES = ['Accepted', 'Preparing', 'Ready'];

export default function RestaurantDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const socket = useSocket();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
      fetchOrders();
    };

    socket.on('order:status_updated', handleUpdate);
    return () => {
      socket.off('order:status_updated', handleUpdate);
    };
  }, [socket]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const advanceStatus = async (orderId, currentStatus) => {
    const nextStatusIndex = STATUSES.indexOf(currentStatus) + 1;
    if (nextStatusIndex >= STATUSES.length) return;
    
    const nextStatus = STATUSES[nextStatusIndex];
    
    try {
      // Optimistic update
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: nextStatus } : o)));
      
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Failed to update status', error);
      fetchOrders();
    }
  };

  const getOrdersByStatus = (status) =>
    orders.filter((o) => o.status === status || (status === 'Accepted' && o.status === 'Placed'));

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle2 size={18} className="text-blue-500" />;
      case 'Preparing':
        return <ChefHat size={18} className="text-orange-500" />;
      case 'Ready':
        return <Bike size={18} className="text-green-500" />;
      default:
        return <Clock size={18} className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <button
              onClick={() => router.push('/home')}
              className="flex items-center text-gray-500 hover:text-gray-900 transition font-bold text-sm mb-2"
            >
              <ChevronLeft size={16} className="mr-1" /> Back to Store
            </button>
            <h1 className="text-3xl font-black text-gray-900">Restaurant Kitchen Dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5">Live order pipeline &amp; kitchen status advancement</p>
          </div>

          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold text-sm shadow-sm transition"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh Queue
          </button>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATUSES.map((status) => {
            const columnOrders = getOrdersByStatus(status);
            return (
              <div
                key={status}
                className="bg-white rounded-3xl shadow-sm border border-gray-200/80 p-5 flex flex-col h-[75vh]"
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    {getStatusIcon(status)}
                    <h2 className="text-lg font-extrabold text-gray-800">{status}</h2>
                  </div>
                  <span className="bg-gray-100 text-gray-700 px-3 py-0.5 rounded-full text-xs font-black">
                    {columnOrders.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  {columnOrders.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400 text-xs font-semibold">
                      No orders currently {status.toLowerCase()}
                    </div>
                  ) : (
                    columnOrders.map((order) => (
                      <motion.div
                        layoutId={order._id}
                        key={order._id}
                        className="bg-gray-50 border border-gray-100 hover:border-gray-300 shadow-sm p-4 rounded-2xl hover:shadow-md transition cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-2.5">
                          <span className="text-xs font-mono font-bold text-gray-500">
                            #{order._id?.slice(-6) || '123456'}
                          </span>
                          <span
                            className={`text-xs font-black px-2 py-0.5 rounded ${
                              order.paymentStatus === 'Paid'
                                ? 'text-green-600 bg-green-100'
                                : 'text-orange-600 bg-orange-100'
                            }`}
                          >
                            {order.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid'}
                          </span>
                        </div>

                        <ul className="text-sm font-semibold text-gray-800 mb-4 space-y-1">
                          {order.items?.map((item, idx) => (
                            <li key={idx} className="flex justify-between">
                              <span>
                                {item.quantity}x {item.name}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {status !== 'Ready' ? (
                          <button
                            onClick={() => advanceStatus(order._id, status)}
                            className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-xs font-extrabold hover:bg-gray-800 transition active:scale-98 shadow-sm"
                          >
                            Advance to {STATUSES[STATUSES.indexOf(status) + 1]} ➔
                          </button>
                        ) : (
                          <div className="text-center py-2 bg-green-50 text-green-700 border border-green-200 rounded-xl text-xs font-extrabold">
                            ✓ Ready for Driver Pickup
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
