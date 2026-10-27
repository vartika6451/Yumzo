'use client';
import React from 'react';

export default function CategoryFilter({
  categories = ["All"],
  activeCategory = "All",
  onSelectCategory
}) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
      <div className="flex items-center gap-1.5 bg-[#FFF2DE] p-1 rounded-full border border-[#F4E3CD]">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#FFFCF7] text-[#2F1D1D] shadow-sm'
                  : 'text-[#7A6464] hover:text-[#2F1D1D]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
