import React from "react";
import { useState } from "react";
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
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition w-64 h-100 flex flex-col justify-between ml-5">
     <img
     src={item.image}
     alt={item.name}
     className="h-50 w-full object-cover rounded-md mb-3"
      />

      <div>
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-600">
          ⭐ {item.rating} | ⏱ {item.time}
        </p>
        <p className="text-red-400 font-bold mt-1">
          Price: {item.price}
        </p>
      </div>

      <div className="flex items-center justify-between mb-3">
        <button
          onClick={decrease}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        > - </button>

        <span className="font-semibold text-lg">{quantity}</span>

        <button
          onClick={increase}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        > + </button>
      </div>

      <button 
        onClick={() => addItem({ ...item, quantity })}
        className="mt-3 w-full bg-pink-400 text-black  py-2 rounded-md hover:bg-pink-600"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default Card;

