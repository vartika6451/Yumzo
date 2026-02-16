import React from "react";
import { useState } from "react";

function Card({ item }) {
  const [quantity, setQuantity] = useState(1);

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
      <div className="h-50 bg-gray-200 rounded-md mb-3 flex items-center justify-center text-gray-500">
        🍽️ Image
      </div>

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

      <button className="mt-3 w-full bg-pink-400 text-black  py-2 rounded-md hover:bg-pink-600">
        Add to Cart
      </button>
    </div>
  );
}

export default Card;

