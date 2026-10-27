'use client';
import React from 'react';
import Link from 'next/link';

export default function EmptyState({
  title = "No Dishes Found",
  message = "We couldn't find any delicious food matching your criteria.",
  type = "filter", // "filter" | "database_empty" | "error"
  onReset = null,
  actionText = "Reset Filters",
  actionHref = null
}) {
  return (
    <div className="w-full bg-[#FFFCF7] rounded-3xl border border-dashed border-[#EADBCC] p-8 sm:p-12 text-center my-6 shadow-xs max-w-2xl mx-auto">
      <div className="text-5xl sm:text-6xl mb-4 animate-bounce">
        {type === "database_empty" ? "🌱" : type === "error" ? "⚠️" : "🍽️"}
      </div>

      <h3 className="text-xl sm:text-2xl font-black text-[#2F1D1D] tracking-tight">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-[#7A6464] font-medium mt-2 max-w-md mx-auto leading-relaxed">
        {message}
      </p>

      {type === "database_empty" && (
        <div className="mt-5 p-4 bg-[#FFF7EA] border border-[#F4E3CD] rounded-2xl text-left text-xs text-[#523E3E] space-y-2">
          <p className="font-extrabold text-[#2F1D1D]">💡 Quick Setup Instructions:</p>
          <ol className="list-decimal list-inside space-y-1 font-medium">
            <li>Ensure <code className="bg-white px-1.5 py-0.5 rounded border border-[#EADBCC] font-bold">.env</code> has your Supabase URL & Key</li>
            <li>Run SQL migration in Supabase SQL Editor: <code className="bg-white px-1.5 py-0.5 rounded border border-[#EADBCC]">supabase/schema.sql</code></li>
            <li>Run seed script: <code className="bg-white px-1.5 py-0.5 rounded border border-[#EADBCC]">npm run seed:supabase</code> (or paste <code className="bg-white px-1.5 py-0.5 rounded border border-[#EADBCC]">supabase/seed.sql</code> in SQL Editor)</li>
          </ol>
        </div>
      )}

      <div className="mt-6 flex justify-center gap-3">
        {onReset && (
          <button
            onClick={onReset}
            className="px-6 py-2.5 bg-[#F65C45] hover:bg-[#E04B35] text-white text-xs sm:text-sm font-extrabold rounded-full shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            {actionText}
          </button>
        )}
        {actionHref && (
          <Link
            href={actionHref}
            className="px-6 py-2.5 bg-[#FFFCF7] border border-[#EADBCC] hover:border-[#2F1D1D] text-[#2F1D1D] text-xs sm:text-sm font-extrabold rounded-full transition-all"
          >
            {actionText}
          </Link>
        )}
      </div>
    </div>
  );
}
