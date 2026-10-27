'use client';
import React from 'react';
import { Trash2 } from 'lucide-react';
import useCartStore from '../store/useCartStore';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCartStore();

  const price = Number(item.price) || 0;
  const quantity = item.quantity || 1;
  const itemTotal = price * quantity;

  return (
    <div className="flex gap-3.5 items-center bg-[#FFF7EA] p-3 rounded-2xl border border-[#F2E5D5] transition-all">
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FFF2DE] shrink-0 border border-[#EADBCC]">
        <img
          src={item.image || '/images/pizza.jpg'}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-extrabold text-[#2F1D1D] text-xs sm:text-sm truncate">
          {item.name}
        </h4>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-xs font-black text-[#F65C45]">
            ₹{itemTotal.toFixed(0)}
          </span>
          <span className="text-[10px] text-[#8C7676]">
            (₹{price.toFixed(0)} × {quantity})
          </span>
        </div>

        {/* Stepper + Remove */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center bg-white rounded-full border border-[#EADBCC] shadow-2xs">
            <button
              onClick={() => updateQuantity(item.id, -1)}
              className="w-6 h-6 flex items-center justify-center hover:bg-[#FFF7EA] rounded-l-full text-[#2F1D1D] font-black text-xs"
              title="Decrease"
            >
              -
            </button>
            <span className="px-2 font-bold text-xs text-[#2F1D1D]">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, 1)}
              className="w-6 h-6 flex items-center justify-center hover:bg-[#FFF7EA] rounded-r-full text-[#2F1D1D] font-black text-xs"
              title="Increase"
            >
              +
            </button>
          </div>

          <button
            onClick={() => removeItem(item.id)}
            className="text-[#A89494] hover:text-[#F65C45] p-1.5 transition-colors cursor-pointer"
            title="Remove dish"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
