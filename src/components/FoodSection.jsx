'use client';
import { useRouter } from "next/navigation";
import FoodItem from "./FoodItem";

const FoodSection = () => {
  const router = useRouter();

  return (
    <div className="relative min-h-[160vh] bg-black text-white px-6 sm:px-10 py-32 flex flex-col justify-around">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-red-400 to-pink-500">
          Craving Something Special?
        </h2>
        <p className="text-gray-400 mt-3 text-lg">Freshly prepared, swiftly delivered right to your doorstep.</p>
      </div>

      <div className="space-y-20 max-w-4xl mx-auto w-full">
        <FoodItem image="/images/download.png" label="Pizza" direction="from-left" />
        <FoodItem image="/images/burger.png" label="Burger" direction="from-right" />
        <FoodItem image="/images/noodles.png" label="Noodles" direction="from-left" />
        <FoodItem image="/images/drink.png" label="Drinks" direction="from-right" />
      </div>

      {/* ENTRY BUTTON */}
      <div className="fixed bottom-10 right-10 z-40">
        <button
          onClick={() => router.push("/home")}
          className="px-8 py-4 bg-gradient-to-r from-red-500 to-yellow-500 text-white font-extrabold text-lg rounded-full shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 border-2 border-white/20"
        >
          <span>Order Now</span>
          <span className="text-xl">➔</span>
        </button>
      </div>
    </div>
  );
};

export default FoodSection;
