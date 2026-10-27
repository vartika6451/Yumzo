'use client';
import React from 'react';
import Link from 'next/link';
import { Star, ArrowLeft } from 'lucide-react';

export default function RestaurantHeader({ restaurant }) {
  if (!restaurant) return null;

  return (
    <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-[#FFF2DE] mb-10">
      {/* Banner */}
      <div className="h-48 sm:h-64 w-full relative">
        <img
          src={restaurant.banner_url || restaurant.image_url || '/images/hero_feast_spread.jpg'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

        {/* Back Button */}
        <Link
          href="/home"
          className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white/90 hover:bg-white text-[#2F1D1D] px-4 py-2 rounded-full font-extrabold text-xs shadow-md transition-all active:scale-95"
        >
          <ArrowLeft size={13} />
          <span>Back to Explore</span>
        </Link>
      </div>

      {/* Info Card Overlay */}
      <div className="p-6 sm:p-8 bg-[#FFFCF7] border-t border-[#F2E5D5]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 bg-[#FFF2DE] border border-[#F4E3CD] text-[#7A5B3E] text-xs font-black rounded-full uppercase tracking-wider">
                {restaurant.cuisine}
              </span>

              {restaurant.is_featured && (
                <span className="px-3 py-1 bg-[#FFC857] text-[#2F1D1D] text-xs font-black rounded-full shadow-xs">
                  ★ Featured Kitchen
                </span>
              )}

              <div className="flex items-center gap-1 bg-[#FFF2DE] px-2.5 py-1 rounded-full text-xs font-black text-[#2F1D1D]">
                <Star size={12} className="text-[#F65C45] fill-[#F65C45]" />
                <span>{Number(restaurant.rating || 4.5).toFixed(1)} / 5.0</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-[#2F1D1D] tracking-tight">
              {restaurant.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#7A6464] font-medium max-w-2xl leading-relaxed">
              {restaurant.description || 'Specialized kitchen delivering genuine culinary imagination.'}
            </p>
          </div>

          {/* Imaginary Guarantee Tag */}
          <div className="bg-[#E1EDCB] border border-[#C2DDA1] p-3.5 rounded-2xl text-center shrink-0 self-start md:self-center">
            <span className="text-xl">✨</span>
            <p className="text-[11px] font-extrabold text-[#2F1D1D] mt-0.5">
              100% Imaginary Menu
            </p>
            <p className="text-[10px] text-[#4F682F] font-bold">
              0 Calories · Instant Joy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
