import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, ChefHat, Bike, Home } from 'lucide-react';
import useSocket from '../hooks/useSocket';

const STAGES = [
  { id: 'Placed', label: 'Order Placed', icon: Clock },
  { id: 'Accepted', label: 'Accepted', icon: CheckCircle2 },
  { id: 'Preparing', label: 'Preparing', icon: ChefHat },
  { id: 'Out for Delivery', label: 'Out for Delivery', icon: Bike },
  { id: 'Delivered', label: 'Delivered', icon: Home },
];

const OrderTracker = ({ orderId, initialStatus = 'Placed' }) => {
  const [status, setStatus] = useState(initialStatus);
  const [toastMsg, setToastMsg] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('order:status_updated', (data) => {
      if (data.orderId === orderId) {
        setStatus(data.status);
        showToast(`Order status updated to: ${data.status}`);
      }
    });

    return () => {
      socket.off('order:status_updated');
    };
  }, [socket, orderId]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const currentStageIndex = STAGES.findIndex((stage) => stage.id === status);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">Track Your Order</h2>
      
      {/* Progress Bar Container */}
      <div className="relative flex justify-between items-center mb-8">
        
        {/* Background Track */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0 rounded-full" />
        
        {/* Active Track */}
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 z-0 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Stages */}
        {STAGES.map((stage, index) => {
          const isCompleted = index <= currentStageIndex;
          const isActive = index === currentStageIndex;
          const Icon = stage.icon;

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center group">
              <motion.div 
                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${
                  isCompleted 
                    ? 'bg-green-500 border-green-200 text-white shadow-lg shadow-green-500/30' 
                    : 'bg-white border-gray-200 text-gray-400'
                } ${isActive ? 'scale-110' : ''}`}
                initial={false}
                animate={{ scale: isActive ? 1.1 : 1 }}
              >
                <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
              </motion.div>
              <div className={`mt-3 text-sm font-semibold transition-colors duration-300 ${
                isActive ? 'text-green-600' : isCompleted ? 'text-gray-800' : 'text-gray-400'
              }`}>
                {stage.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Local Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center justify-center gap-3 shadow-md"
          >
            <CheckCircle2 size={20} />
            <span className="font-medium">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default OrderTracker;
