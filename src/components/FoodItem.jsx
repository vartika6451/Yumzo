'use client';
import { ScrollAnimation } from "./ScrollAnimation";
import useCartStore from "../store/useCartStore";

const FoodItem = ({ image, label, direction }) => {
  const { ref, visible } = ScrollAnimation();
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div
      ref={ref}
      className={`food-item max-w-md mx-auto my-12 flex flex-col items-center ${direction} ${visible ? "show" : ""}`}
    >
      <div className="w-56 h-56 rounded-full flex items-center justify-center p-2 bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
        <img
          src={image}
          alt={label}
          className="w-48 h-48 object-contain hover:scale-110 transition-transform duration-500"
        />
      </div>

      <h2 className="mt-4 text-white text-3xl font-extrabold text-center tracking-wide">
        {label}
      </h2>

      <div className="w-16 h-1 bg-yellow-400 mx-auto mt-2 mb-4 rounded-full" />

      <div className="flex justify-center">
        <button
          onClick={() => addItem({ id: label, name: label, image, price: 10, quantity: 1 })}
          className="bg-yellow-400 text-black px-8 py-2.5 rounded-full font-bold hover:bg-yellow-500 transition shadow-lg hover:shadow-yellow-400/30 active:scale-95"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default FoodItem;
