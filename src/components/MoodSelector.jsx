'use client';
import React from 'react';

const MOOD_STYLES = {
  cheesy: {
    bg: "bg-[#FFF3D6] hover:bg-[#FFE9B8] border-[#FFE2A1]",
    desc: "Everything is better with cheese"
  },
  spicy: {
    bg: "bg-[#FDE8E5] hover:bg-[#FCD7D2] border-[#FBC4BD]",
    desc: "For the heat lovers"
  },
  midnight: {
    bg: "bg-[#ECEFFE] hover:bg-[#DFE4FD] border-[#D1D9FB]",
    desc: "For late night cravings"
  },
  sweet: {
    bg: "bg-[#FDE9EF] hover:bg-[#FCD8E3] border-[#FBC4D4]",
    desc: "Because dessert is always a good idea"
  },
  surprise: {
    bg: "bg-[#E1EDCB] hover:bg-[#D5E6B8] border-[#C2DDA1]",
    desc: "Show me something random"
  }
};

export default function MoodSelector({
  moods = [],
  selectedMood = null,
  onSelectMood
}) {
  // Default fallback moods if Supabase moods table is not populated yet
  const displayMoods = moods.length > 0 ? moods : [
    { id: 'b1', slug: 'cheesy', name: 'Cheesy', emoji: '🧀' },
    { id: 'b2', slug: 'spicy', name: 'Spicy', emoji: '🌶️' },
    { id: 'b3', slug: 'midnight', name: 'Midnight snacks', emoji: '🌙' },
    { id: 'b4', slug: 'sweet', name: 'Sweet tooth', emoji: '🍰' },
    { id: 'b5', slug: 'surprise', name: 'Surprise me!', emoji: '🎲' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {displayMoods.map((mood) => {
        const style = MOOD_STYLES[mood.slug] || {
          bg: "bg-[#FFF3D6] hover:bg-[#FFE9B8] border-[#FFE2A1]",
          desc: "Craving delight"
        };
        const isSelected = selectedMood === mood.slug;

        return (
          <div
            key={mood.id || mood.slug}
            onClick={() => onSelectMood(mood.slug)}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-start gap-3 select-none ${
              isSelected
                ? 'ring-3 ring-[#F65C45] scale-102 shadow-md'
                : 'shadow-xs hover:-translate-y-0.5 hover:shadow-sm'
            } ${style.bg}`}
          >
            <span className="text-2xl sm:text-3xl shrink-0 mt-0.5">{mood.emoji}</span>
            <div>
              <h3 className="font-extrabold text-sm text-[#2F1D1D] leading-tight">
                {mood.name}
              </h3>
              <p className="text-[11px] text-[#695656] font-medium mt-0.5 leading-snug">
                {style.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
