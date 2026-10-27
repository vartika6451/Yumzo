'use client';
import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';

export const FEAST_THEMES = [
  { id: 'midnight', name: 'Midnight Munchies', emoji: '🌙', bg: 'bg-[#ECEFFE] border-[#D1D9FB]' },
  { id: 'movie', name: 'Cozy Movie Night', emoji: '🎬', bg: 'bg-[#FFF3D6] border-[#FFE2A1]' },
  { id: 'party', name: 'Party Extravaganza', emoji: '🎉', bg: 'bg-[#FDE8E5] border-[#FBC4BD]' },
  { id: 'royal', name: 'Royal Banquet Spread', emoji: '👑', bg: 'bg-[#E1EDCB] border-[#C2DDA1]' },
  { id: 'sweet', name: 'Sweet Tooth Escape', emoji: '🍰', bg: 'bg-[#FDE9EF] border-[#FBC4D4]' },
];

export default function CheckoutSummary({
  items,
  totalPrice,
  theme,
  setTheme,
  title,
  setTitle,
  onCompleteCheckout,
  loading = false,
  validationError = null
}) {
  return (
    <div className="space-y-6">
      {/* 1. Theme Selection */}
      <div className="bg-[#FFFCF7] p-6 rounded-3xl border border-[#F2E5D5] shadow-xs">
        <label className="block text-sm font-black text-[#2F1D1D] mb-2">
          1. Choose Feast Theme
        </label>
        <p className="text-xs text-[#7A6464] mb-3">
          Select an aesthetic mood for your virtual feast banquet canvas.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {FEAST_THEMES.map((t) => {
            const isSelected = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  isSelected ? 'ring-2 ring-[#F65C45] scale-102 shadow-xs' : 'opacity-80 hover:opacity-100'
                } ${t.bg}`}
              >
                <span className="text-xl">{t.emoji}</span>
                <span className="text-xs font-black text-[#2F1D1D] truncate">
                  {t.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Feast Title */}
      <div className="bg-[#FFFCF7] p-6 rounded-3xl border border-[#F2E5D5] shadow-xs">
        <label className="block text-sm font-black text-[#2F1D1D] mb-1">
          2. Name Your Dream Feast
        </label>
        <p className="text-xs text-[#7A6464] mb-3">
          Personalize the headline on your celebration card.
        </p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. My 2 AM Ultimate Craving Feast"
          className="w-full px-4 py-3 bg-[#FFF7EA] border border-[#EADBCC] rounded-2xl outline-none focus:border-[#F65C45] font-bold text-sm text-[#2F1D1D]"
        />
      </div>

      {/* 3. Items Breakdown */}
      <div className="bg-[#FFFCF7] p-6 rounded-3xl border border-[#F2E5D5] shadow-xs">
        <h3 className="text-sm font-black text-[#2F1D1D] mb-3">
          3. Feast Tray Review ({items.reduce((acc, i) => acc + (i.quantity || 1), 0)} items)
        </h3>

        <div className="divide-y divide-[#F5EAD9] max-h-60 overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={item.image || '/images/pizza.jpg'}
                  alt={item.name}
                  className="w-9 h-9 rounded-lg object-cover border border-[#EADBCC]"
                />
                <div className="truncate">
                  <span className="font-extrabold text-[#2F1D1D] truncate block">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-[#8C7676]">
                    Qty: {item.quantity || 1}
                  </span>
                </div>
              </div>
              <span className="font-black text-[#2F1D1D] shrink-0 ml-2">
                ₹{(Number(item.price) * (item.quantity || 1)).toFixed(0)}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing Total */}
        <div className="mt-4 pt-4 border-t border-[#F2E5D5] space-y-1 text-xs">
          <div className="flex justify-between text-[#7A6464] font-semibold">
            <span>Simulated Subtotal</span>
            <span>₹{totalPrice.toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-[#7A6464] font-semibold">
            <span>Simulated Delivery & Tax</span>
            <span className="text-green-700 font-bold">₹0.00 (Zero Delivery)</span>
          </div>
          <div className="flex justify-between font-black text-lg text-[#2F1D1D] pt-2 border-t border-[#F5EAD9]">
            <span>Total Feast Value</span>
            <span className="text-[#F65C45]">₹{totalPrice.toFixed(0)}</span>
          </div>
        </div>
      </div>

      {/* 4. Imaginary Disclaimer Alert */}
      <div className="bg-[#FFF2DE] border border-[#F4E3CD] p-4 rounded-2xl flex items-start gap-3 text-xs text-[#7A5B3E]">
        <FaShieldAlt className="text-lg text-[#F65C45] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-black text-[#2F1D1D]">100% Imaginary Food Ordering Guarantee</p>
          <p className="font-medium leading-relaxed">
            No real money will ever be charged. No delivery rider will arrive. This feast exists exclusively in your imagination and will generate a gorgeous digital banquet you can download and share!
          </p>
        </div>
      </div>

      {validationError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold">
          ⚠️ {validationError}
        </div>
      )}

      {/* 5. Complete Button */}
      <button
        type="button"
        onClick={onCompleteCheckout}
        disabled={loading || items.length === 0}
        className="w-full py-4 bg-[#F65C45] hover:bg-[#E04B35] text-white font-black text-sm sm:text-base rounded-full shadow-lg shadow-[#F65C45]/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        <span>🪄</span>
        <span>{loading ? 'Assembling Dream Feast...' : 'Serve My Virtual Feast (Complete)'}</span>
        <span>➔</span>
      </button>
    </div>
  );
}
