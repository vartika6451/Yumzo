'use client';
import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import useCartStore from '../../../store/useCartStore';

export default function OrderSuccessPage() {
  const params = useParams();
  const id = params?.id || 'demo_order';
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-gray-100"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
        >
          <CheckCircle size={44} />
        </motion.div>

        <span className="text-xs font-bold uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
          Payment Verified
        </span>

        <h1 className="text-3xl font-black text-gray-900 mt-3 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Thank you for choosing Yumzo! The kitchen has received your order and is preparing it with passion.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.push(`/orders/${id}`)}
            className="w-full py-3.5 bg-gradient-to-r from-red-500 to-yellow-500 text-white rounded-xl font-extrabold text-base hover:opacity-95 transition shadow-lg shadow-red-500/25"
          >
            Track Live Order ➔
          </button>
          
          <button
            onClick={() => router.push('/home')}
            className="w-full py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-base hover:bg-gray-200 transition"
          >
            Back to Menu
          </button>
        </div>
      </motion.div>
    </div>
  );
}
