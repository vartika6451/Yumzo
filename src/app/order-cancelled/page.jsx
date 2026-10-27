'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';
import useCartStore from '../../store/useCartStore';

export default function OrderCancelledPage() {
  const router = useRouter();
  const toggleCart = useCartStore((state) => state.toggleCart);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-gray-100"
      >
        <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <XCircle size={44} />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
          Payment Incomplete
        </span>

        <h1 className="text-3xl font-black text-gray-900 mt-3 mb-2">Order Cancelled</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Your payment was not completed and you haven&apos;t been charged. Your selected items are still safe in your cart.
        </p>

        <button
          onClick={() => {
            router.push('/home');
            toggleCart();
          }}
          className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-extrabold text-base hover:bg-gray-800 transition shadow-lg"
        >
          Return to Cart &amp; Retry
        </button>
      </motion.div>
    </div>
  );
}
