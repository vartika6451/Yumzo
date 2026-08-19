import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Clear cart upon successful payment
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle size={40} />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-8">
          Thank you for your order. We are preparing your delicious food.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate(`/orders/${id}`)}
            className="w-full py-3 bg-red-500 text-white rounded-lg font-bold text-lg hover:bg-red-600 transition shadow-lg"
          >
            Track Order
          </button>
          
          <button
            onClick={() => navigate('/home')}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-bold text-lg hover:bg-gray-200 transition"
          >
            Back to Menu
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
