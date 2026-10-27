'use client';
import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({
  value = '',
  onChange,
  onClear,
  placeholder = "Search dishes or restaurants..."
}) {
  return (
    <div className="relative flex items-center bg-[#FFFCF7] border border-[#F2E5D5] rounded-full px-4 py-2 shadow-xs w-full max-w-md focus-within:border-[#F65C45] focus-within:ring-2 focus-within:ring-[#F65C45]/20 transition-all">
      <Search size={14} className="text-[#8C7676] mr-2.5 shrink-0" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent outline-none text-xs sm:text-sm font-semibold w-full text-[#2F1D1D] placeholder:text-[#A89494]"
      />
      {value && (
        <button
          onClick={onClear}
          className="text-xs text-[#8C7676] hover:text-[#2F1D1D] ml-2 font-bold cursor-pointer"
          title="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
