'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

export default function Cart() {
  const { items, isCartOpen, toggleCart } = useCartStore();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-[#FFFCF7] shadow-2xl z-50 flex flex-col border-l border-[#F2E5D5]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#F2E5D5] bg-[#FFF7EA]">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧺</span>
                <h2 className="text-xl font-black text-[#2F1D1D] tracking-tight">
                  Your Imaginary Feast Tray
                </h2>
              </div>
              <button
                onClick={toggleCart}
                className="w-8 h-8 rounded-full bg-white border border-[#EADBCC] flex items-center justify-center text-[#7A6464] hover:text-[#F65C45] transition-colors cursor-pointer"
                title="Close"
              >
                <X size={15} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <span className="text-6xl mb-3">🍽️</span>
                  <p className="text-base font-extrabold text-[#2F1D1D]">
                    Your feast tray is empty!
                  </p>
                  <p className="text-xs text-[#7A6464] mt-1 max-w-xs font-medium">
                    Pick mouthwatering imaginary dishes from any restaurant menu to build your dream spread.
                  </p>
                  <button
                    onClick={toggleCart}
                    className="mt-5 px-6 py-2.5 bg-[#F65C45] text-white rounded-full font-black text-xs hover:bg-[#E04B35] transition shadow-md"
                  >
                    Start Exploring Cravings
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && <CartSummary />}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
