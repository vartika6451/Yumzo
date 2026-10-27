'use client';
import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import useCartStore from "../store/useCartStore";

function Card({ item, badge = null }) {
  const [isLiked, setIsLiked] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Derive badge if not provided
  const displayBadge = badge || (
    item.rating >= 4.7 ? "Bestseller" :
    item.rating >= 4.4 ? "Popular" :
    item.id % 3 === 0 ? "New" : null
  );

  const getBadgeStyle = (b) => {
    switch (b) {
      case "Bestseller":
        return "bg-[#FFC857] text-[#2F1D1D]";
      case "Popular":
        return "bg-[#FFE082] text-[#2F1D1D]";
      case "New":
        return "bg-[#C7D2FE] text-[#1E1B4B]";
      default:
        return "bg-[#E1EDCB] text-[#2F1D1D]";
    }
  };

  return (
    <div className="bg-[#FFFCF7] rounded-3xl border border-[#F2E5D5] p-3.5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full flex flex-col justify-between group shadow-sm">
      {/* Image Container with Badges */}
      <div className="relative overflow-hidden rounded-2xl h-48 w-full bg-[#FFF2DE]">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge Top Left */}
        {displayBadge && (
          <span className={`absolute top-2.5 left-2.5 px-3 py-1 rounded-full text-xs font-black shadow-sm tracking-wide ${getBadgeStyle(displayBadge)}`}>
            {displayBadge}
          </span>
        )}

        {/* Heart Favorite Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#F65C45] hover:scale-110 active:scale-95 transition-all shadow-sm"
          title="Save to favorites"
        >
          {isLiked ? <FaHeart size={14} className="text-[#F65C45]" /> : <FaRegHeart size={14} className="text-[#2F1D1D]/60 hover:text-[#F65C45]" />}
        </button>
      </div>

      {/* Item Details */}
      <div className="mt-3.5 px-1 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-extrabold text-[#2F1D1D] group-hover:text-[#F65C45] transition-colors line-clamp-1">
            {item.name}
          </h3>
          <p className="text-xs text-[#7A6464] mt-1 line-clamp-2 leading-relaxed">
            {item.description || `Classic culinary delight with fresh ingredients, herbs and gourmet seasoning.`}
          </p>
        </div>

        {/* Footer: Price & Add to Feast */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F5EAD9]">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black text-[#2F1D1D]">
              ₹{item.price}
            </span>
            <span className="text-[10px] font-semibold text-[#8C7676]">
              (imaginary)
            </span>
          </div>

          <button 
            onClick={() => addItem({ ...item, quantity: 1 })}
            className="px-3.5 py-1.5 bg-[#F65C45] text-white text-xs font-extrabold rounded-full hover:bg-[#E04B35] transition-all shadow-sm hover:shadow-md hover:shadow-[#F65C45]/20 active:scale-95 flex items-center gap-1"
          >
            <span>+</span>
            <span>Add to feast</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
