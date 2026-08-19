import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const OrderCancelled = () => {
  const navigate = useNavigate();
  const toggleCart = useCartStore((state) => state.toggleCart);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
      >
        <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-gray-500 mb-8">
          Your payment was cancelled and you haven't been charged.
        </p>

        <button
          onClick={() => {
            navigate('/home');
            toggleCart(); // Reopen cart so they can try again
          }}
          className="w-full py-3 bg-gray-800 text-white rounded-lg font-bold text-lg hover:bg-gray-900 transition shadow-lg"
        >
          Return to Cart
        </button>
      </motion.div>
    </div>
  );
};

export default OrderCancelled;
