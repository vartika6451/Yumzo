'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useCartStore from '../store/useCartStore';

export default function CartSummary({ onAfterCheckout = null }) {
  const router = useRouter();
  const { items, clearCart, toggleCart } = useCartStore();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');

  const subtotal = items.reduce((total, item) => {
    const price = Number(item.price) || 0;
    return total + price * (item.quantity || 1);
  }, 0);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'YUMZO10') {
      setDiscount(0.1);
      setPromoError('');
    } else {
      setDiscount(0);
      setPromoError('Try promo code: YUMZO10');
    }
  };

  const finalTotal = subtotal - subtotal * discount;

  const handleProceed = () => {
    toggleCart(); // Close drawer
    if (onAfterCheckout) onAfterCheckout();
    router.push('/checkout');
  };

  return (
    <div className="p-5 border-t border-[#F2E5D5] bg-[#FFFCF7]">
      {/* Promo Code */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Promo code (YUMZO10)"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="flex-1 px-3.5 py-1.5 border border-[#EADBCC] rounded-xl outline-none focus:border-[#F65C45] text-xs bg-[#FFF7EA] uppercase font-bold text-[#2F1D1D]"
          />
          <button
            onClick={handleApplyPromo}
            className="px-4 py-1.5 bg-[#2F1D1D] hover:bg-black text-white rounded-xl text-xs font-black transition cursor-pointer"
          >
            Apply
          </button>
        </div>
        {promoError && <p className="text-[#F65C45] text-[11px] mt-1 font-bold">{promoError}</p>}
        {discount > 0 && <p className="text-green-700 text-[11px] mt-1 font-bold">🎉 10% imaginary discount applied!</p>}
      </div>

      {/* Calculations */}
      <div className="space-y-1.5 mb-4 text-xs font-bold text-[#7A6464]">
        <div className="flex justify-between">
          <span>Imaginary Subtotal</span>
          <span>₹{subtotal.toFixed(0)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-700">
            <span>Promo Discount (10%)</span>
            <span>-₹{(subtotal * discount).toFixed(0)}</span>
          </div>
        )}
        <div className="flex justify-between text-xs text-[#8C7676]">
          <span>Delivery & Taxes</span>
          <span>₹0.00 (Imaginary)</span>
        </div>
        <div className="flex justify-between font-black text-base text-[#2F1D1D] pt-2 border-t border-[#F5EAD9]">
          <span>Total Feast Value</span>
          <span className="text-[#F65C45]">₹{finalTotal.toFixed(0)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleProceed}
        className="w-full py-3.5 bg-[#F65C45] hover:bg-[#E04B35] text-white rounded-full font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <span>Proceed to Virtual Feast</span>
        <span>➔</span>
      </button>

      <button
        onClick={clearCart}
        className="w-full py-2 mt-2 text-[#A89494] hover:text-[#F65C45] text-[11px] font-bold transition text-center cursor-pointer"
      >
        Clear Feast Tray
      </button>
    </div>
  );
}
