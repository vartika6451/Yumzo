import { useNavigate } from "react-router-dom"
import FoodItem from "./FoodItem"

const FoodSection = () => {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-[180vh] bg-black text-white px-10 py-40 flex flex-col">
      
      {/* EXISTING FOOD UI (UNCHANGED) */}
      <FoodItem image="/images/download.png" label="Pizza" direction="from-left" />
      <FoodItem image="/images/burger.png" label="Burger" direction="from-right" />
      <FoodItem image="/images/noodles.png" label="Noodles" direction="from-left" />
      <FoodItem image="/images/drink.png" label="Drinks" direction="from-right" />

      {/* 👉 ENTRY BUTTON (ADDED) */}
      <button
        onClick={() => navigate("/login")}
        className="fixed bottom-10 right-10 px-6 py-3 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 transition"
      >
        Order Now
      </button>

    </div>
  )
}

export default FoodSection
