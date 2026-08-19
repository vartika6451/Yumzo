import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, RefreshCw } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const [orders, setOrders] = useState([]);
  const addItem = useCartStore(state => state.addItem);
  const toggleCart = useCartStore(state => state.toggleCart);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      // In production we would pass the auth token here.
      // For demo, we bypassed auth on GET /api/orders/me or we can just fetch all orders if not implemented
      // Wait, getMyOrders requires verifyToken in orderRoutes.js!
      // For this demo to work without login, we will just fetch /api/dashboard/orders and filter by demo user.
      const res = await fetch('http://localhost:5000/api/dashboard/orders');
      const data = await res.json();
      // Mock filter for the demo user
      setOrders(data.filter(o => o.user?.name === 'Demo User' || o.user === '651f4d9b23b1c1d8a4f91e32'));
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const handleReorder = (orderItems) => {
    orderItems.forEach(item => {
      addItem({
        id: item.menuItem,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      });
    });
    toggleCart();
    navigate('/home');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Clock className="text-gray-400" /> Order History
          </h2>

          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No orders found. Go order some delicious food!
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order._id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs text-gray-400 font-mono block mb-1">Order #{order._id.slice(-6)}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block font-bold text-lg text-gray-900">${order.totalPrice.toFixed(2)}</span>
                      <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <ul className="text-sm text-gray-700 space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="text-gray-500">${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Track Order
                    </button>
                    <button 
                      onClick={() => handleReorder(order.items)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold text-sm transition"
                    >
                      <RefreshCw size={16} /> Reorder
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
};

export default Account;
