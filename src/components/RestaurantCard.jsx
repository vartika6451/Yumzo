'use client';
import React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';

export default function RestaurantCard({ restaurant }) {
  if (!restaurant) return null;

  return (
    <div className="bg-[#FFFCF7] rounded-3xl border border-[#F2E5D5] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group shadow-sm">
      {/* Banner / Image */}
      <div className="relative h-44 w-full bg-[#FFF2DE] overflow-hidden">
        <img
          src={restaurant.image_url || restaurant.banner_url || '/images/hero_feast_spread.jpg'}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Cuisine Tag Top Left */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black shadow-sm bg-white/90 backdrop-blur-xs text-[#2F1D1D]">
          {restaurant.cuisine}
        </span>

        {/* Rating Top Right */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-black shadow-sm bg-[#FFC857] text-[#2F1D1D] flex items-center gap-1">
          <Star size={11} className="text-[#2F1D1D] fill-[#2F1D1D]" />
          <span>{Number(restaurant.rating || 4.5).toFixed(1)}</span>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-lg font-black text-[#2F1D1D] group-hover:text-[#F65C45] transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          <p className="text-xs text-[#7A6464] mt-1 line-clamp-2 leading-relaxed">
            {restaurant.description || 'Specialized chef-crafted recipes crafted for genuine imaginary feasts.'}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-[#F5EAD9] flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#8C7676]">
            🍽️ Chef Menu Available
          </span>

          <Link
            href={`/restaurants/${restaurant.slug}`}
            className="px-4 py-1.5 bg-[#F65C45] text-white text-xs font-extrabold rounded-full hover:bg-[#E04B35] transition-all shadow-sm hover:shadow-md hover:shadow-[#F65C45]/20 active:scale-95 flex items-center gap-1"
          >
            <span>Explore Menu</span>
            <span>➔</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
