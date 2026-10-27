'use client';
import { Heart } from "lucide-react";
import useCartStore from "../store/useCartStore";

export default function FoodCard({ item, badge = null }) {
  const [isLiked, setIsLiked] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const isAvailable = item.is_available !== false;

  // Derive badge
  const displayBadge = badge || (
    !isAvailable ? "Unavailable" :
    item.is_popular ? "Popular" :
    item.rating >= 4.8 ? "Bestseller" : null
  );

  const getBadgeStyle = (b) => {
    switch (b) {
      case "Unavailable":
        return "bg-gray-400 text-white";
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

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!isAvailable) return;
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || item.image_url,
      quantity: 1,
      restaurant_id: item.restaurant_id,
      restaurantName: item.restaurantName,
      category: item.category,
      is_available: isAvailable
    });
  };

  return (
    <div className={`bg-[#FFFCF7] rounded-3xl border border-[#F2E5D5] p-3.5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full flex flex-col justify-between group shadow-sm ${!isAvailable ? 'opacity-70' : ''}`}>
      {/* Image Container with Badges */}
      <div className="relative overflow-hidden rounded-2xl h-48 w-full bg-[#FFF2DE]">
        <img
          src={item.image || item.image_url || '/images/pizza.jpg'}
          alt={item.name}
          className={`h-full w-full object-cover transition-transform duration-500 ${isAvailable ? 'group-hover:scale-105' : 'grayscale'}`}
        />

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute bottom-2.5 left-2.5 z-10 bg-white/90 backdrop-blur-xs p-1 rounded-md shadow-xs">
          <div className={`w-3 h-3 border flex items-center justify-center ${item.is_veg ? 'border-green-600' : 'border-red-600'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${item.is_veg ? 'bg-green-600' : 'bg-red-600'}`}></div>
          </div>
        </div>

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
          {isLiked ? (
            <Heart size={14} className="text-[#F65C45] fill-[#F65C45]" />
          ) : (
            <Heart size={14} className="text-[#2F1D1D]/60 hover:text-[#F65C45]" />
          )}
        </button>
      </div>

      {/* Item Details */}
      <div className="mt-3.5 px-1 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1">
            <h3 className="text-base font-extrabold text-[#2F1D1D] group-hover:text-[#F65C45] transition-colors line-clamp-1">
              {item.name}
            </h3>
            {item.category && (
              <span className="text-[10px] font-bold text-[#8C7676] bg-[#FFF2DE] px-2 py-0.5 rounded-md shrink-0">
                {item.category}
              </span>
            )}
          </div>

          <p className="text-xs text-[#7A6464] mt-1 line-clamp-2 leading-relaxed">
            {item.description || `Classic culinary delight with fresh ingredients, herbs and gourmet seasoning.`}
          </p>

          {item.restaurantName && (
            <p className="text-[11px] font-semibold text-[#A89494] mt-1 truncate">
              by {item.restaurantName}
            </p>
          )}
        </div>

        {/* Footer: Price & Add to Feast */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F5EAD9]">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black text-[#2F1D1D]">
              ₹{Number(item.price).toFixed(0)}
            </span>
            <span className="text-[10px] font-semibold text-[#8C7676]">
              (imaginary)
            </span>
          </div>

          <button 
            onClick={handleAdd}
            disabled={!isAvailable}
            className={`px-3.5 py-1.5 text-xs font-extrabold rounded-full transition-all shadow-sm flex items-center gap-1 ${
              isAvailable 
                ? 'bg-[#F65C45] text-white hover:bg-[#E04B35] hover:shadow-md hover:shadow-[#F65C45]/20 active:scale-95 cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>{isAvailable ? '+' : '✕'}</span>
            <span>{isAvailable ? 'Add to feast' : 'Unavailable'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
