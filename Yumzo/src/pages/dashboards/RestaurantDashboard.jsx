import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ChefHat, CheckCircle2, Bike } from 'lucide-react';

// Status sequence for Kanban
const STATUSES = ['Accepted', 'Preparing', 'Ready'];

const RestaurantDashboard = () => {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    fetchOrders();
    // In a real app, you would also listen to socket events here for new incoming orders
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/dashboard/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const advanceStatus = async (orderId, currentStatus) => {
    const nextStatusIndex = STATUSES.indexOf(currentStatus) + 1;
    if (nextStatusIndex >= STATUSES.length) return; // Cannot advance past Ready here
    
    const nextStatus = STATUSES[nextStatusIndex];
    
    try {
      // Optistic update
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: nextStatus } : o));
      
      await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
    } catch (error) {
      console.error('Failed to update status', error);
      fetchOrders(); // Revert on failure
    }
  };

  // Group orders by status
  const getOrdersByStatus = (status) => orders.filter(o => o.status === status || (status === 'Accepted' && o.status === 'Placed'));

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Accepted': return <CheckCircle2 size={18} className="text-blue-500" />;
      case 'Preparing': return <ChefHat size={18} className="text-orange-500" />;
      case 'Ready': return <Bike size={18} className="text-green-500" />;
      default: return <Clock size={18} className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Restaurant Kitchen Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATUSES.map(status => (
            <div key={status} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col h-[80vh]">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  {getStatusIcon(status)}
                  <h2 className="text-lg font-bold text-gray-800">{status}</h2>
                </div>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-bold">
                  {getOrdersByStatus(status).length}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {getOrdersByStatus(status).map(order => (
                  <motion.div 
                    layoutId={order._id}
                    key={order._id}
                    className="bg-white border border-gray-100 shadow-sm p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono text-gray-400">#{order._id.slice(-6)}</span>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        {order.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                    
                    <ul className="text-sm font-medium text-gray-800 mb-4 space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {status !== 'Ready' && (
                      <button
                        onClick={() => advanceStatus(order._id, status)}
                        className="w-full py-2 bg-gray-900 text-white rounded-md text-sm font-bold hover:bg-gray-800 transition"
                      >
                        Advance to {STATUSES[STATUSES.indexOf(status) + 1]}
                      </button>
                    )}
                    {status === 'Ready' && (
                      <div className="text-center py-2 bg-green-50 text-green-700 rounded-md text-sm font-bold">
                        Waiting for Driver
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
