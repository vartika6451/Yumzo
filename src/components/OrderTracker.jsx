'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, ChefHat, Bike, Home } from 'lucide-react';
import useSocket from '../hooks/useSocket';
import { useSupabaseRealtimeOrder } from '../hooks/useSupabaseRealtime';

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

  // Listen for live updates via Supabase Realtime
  useSupabaseRealtimeOrder(orderId, (newStatus) => {
    setStatus(newStatus);
    showToast(`Order status updated to: ${newStatus} (Supabase Realtime)`);
  });

  useEffect(() => {
    if (!socket) return;

    const handleStatusUpdate = (data) => {
      if (data && (data.orderId === orderId || String(data.orderId) === String(orderId))) {
        setStatus(data.status);
        showToast(`Order status updated to: ${data.status}`);
      }
    };

    socket.on('order:status_updated', handleStatusUpdate);

    return () => {
      socket.off('order:status_updated', handleStatusUpdate);
    };
  }, [socket, orderId]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const currentStageIndex = Math.max(0, STAGES.findIndex((stage) => stage.id === status));

  return (
    <div className="w-full max-w-3xl mx-auto p-6 md:p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-black mb-8 text-gray-800 text-center">Track Your Order</h2>
      
      {/* Progress Bar Container */}
      <div className="relative flex justify-between items-center mb-8 px-4">
        
        {/* Background Track */}
        <div className="absolute top-1/2 left-8 right-8 h-1.5 bg-gray-100 -translate-y-1/2 z-0 rounded-full" />
        
        {/* Active Track */}
        <motion.div 
          className="absolute top-1/2 left-8 h-1.5 bg-gradient-to-r from-yellow-400 to-green-500 -translate-y-1/2 z-0 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `calc(${(currentStageIndex / (STAGES.length - 1)) * 100}% - 40px)` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {/* Stages */}
        {STAGES.map((stage, index) => {
          const isCompleted = index <= currentStageIndex;
          const isActive = index === currentStageIndex;
          const Icon = stage.icon;

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center">
              <motion.div 
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-500 border-green-200 text-white shadow-lg shadow-green-500/30' 
                    : 'bg-white border-gray-200 text-gray-400'
                } ${isActive ? 'scale-110 ring-4 ring-green-100' : ''}`}
                initial={false}
                animate={{ scale: isActive ? 1.15 : 1 }}
              >
                <Icon size={22} className={isActive ? 'animate-pulse' : ''} />
              </motion.div>
              <div className={`mt-3 text-xs md:text-sm font-bold text-center transition-colors duration-300 ${
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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="mt-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl flex items-center justify-center gap-3 shadow-md"
          >
            <CheckCircle2 size={20} className="text-green-600" />
            <span className="font-bold text-sm">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderTracker;
