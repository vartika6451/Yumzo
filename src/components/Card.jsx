'use client';
import React, { useState } from "react";
import useCartStore from "../store/useCartStore";

function Card({ item }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const increase = () => {
    setQuantity(quantity + 1);
  };

  const decrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-xl transition-all duration-300 w-full max-w-xs flex flex-col justify-between group">
      <div className="overflow-hidden rounded-xl mb-3 h-48 w-full bg-gray-100">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.name}</h3>
        <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
          <span>⭐ {item.rating}</span>
          <span>•</span>
          <span>⏱ {item.time}</span>
        </p>
        <p className="text-red-500 font-extrabold text-lg mt-2">
          ${item.price}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4 mb-3 bg-gray-50 p-1.5 rounded-lg border border-gray-100">
        <button
          onClick={decrease}
          className="bg-white px-3 py-1 rounded-md hover:bg-gray-200 transition font-bold text-gray-700 shadow-sm"
        >
          -
        </button>

        <span className="font-bold text-base text-gray-800">{quantity}</span>

        <button
          onClick={increase}
          className="bg-white px-3 py-1 rounded-md hover:bg-gray-200 transition font-bold text-gray-700 shadow-sm"
        >
          +
        </button>
      </div>

      <button 
        onClick={() => addItem({ ...item, quantity })}
        className="w-full bg-yellow-400 text-gray-900 font-bold py-2.5 rounded-xl hover:bg-yellow-500 transition shadow-md hover:shadow-lg active:scale-95"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default Card;
