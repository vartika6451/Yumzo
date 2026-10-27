'use client';
import React, { useEffect, useState } from 'react';
import { Clock, RefreshCw, ChevronLeft } from 'lucide-react';
import useCartStore from '../../store/useCartStore';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const router = useRouter();

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (orderItems) => {
    orderItems.forEach((item) => {
      addItem({
        id: item.menuItem || item.name,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      });
    });
    toggleCart();
    router.push('/home');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Preparing':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Out for Delivery':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <button
          onClick={() => router.push('/home')}
          className="flex items-center text-gray-500 hover:text-gray-900 transition mb-6 font-bold text-sm"
        >
          <ChevronLeft size={18} className="mr-1" />
          Back to Menu
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">My Account</h1>
            <p className="text-gray-500 text-sm mt-1">Manage and track your recent culinary orders</p>
          </div>
          <button
            onClick={fetchMyOrders}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold text-sm shadow-sm transition"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200/80 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Clock className="text-red-500" /> Order History
          </h2>

          {loading ? (
            <div className="text-center py-16 text-gray-400 font-medium">Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-medium">No orders found.</p>
              <button
                onClick={() => router.push('/home')}
                className="mt-4 px-6 py-2.5 bg-red-500 text-white rounded-full font-bold text-sm hover:bg-red-600 transition shadow-md"
              >
                Go Order Food 🍔
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs text-gray-400 font-mono block mb-1">
                        Order #{order._id?.slice(-6) || '123456'}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block font-black text-xl text-gray-900">
                        ${Number(order.totalPrice || 0).toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Today'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3.5 mb-4">
                    <ul className="text-sm text-gray-700 space-y-1.5">
                      {order.items?.map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span className="font-medium text-gray-800">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="text-gray-500 font-mono">
                            ${(Number(item.price || 0) * (item.quantity || 1)).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => router.push(`/orders/${order._id}`)}
                      className="text-sm font-bold text-red-500 hover:text-red-700 transition"
                    >
                      Track Live Progress ➔
                    </button>
                    <button
                      onClick={() => handleReorder(order.items || [])}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs transition"
                    >
                      <RefreshCw size={14} /> Reorder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
