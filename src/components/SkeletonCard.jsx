'use client';
import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-[#FFFCF7] rounded-3xl border border-[#F2E5D5] p-3.5 w-full flex flex-col justify-between animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 w-full bg-[#F5EAD9] rounded-2xl"></div>

      {/* Content Skeleton */}
      <div className="mt-3.5 space-y-2 px-1">
        <div className="h-5 bg-[#F5EAD9] rounded-md w-3/4"></div>
        <div className="h-3.5 bg-[#F5EAD9] rounded-md w-full"></div>
        <div className="h-3.5 bg-[#F5EAD9] rounded-md w-1/2"></div>

        {/* Footer Skeleton */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#F5EAD9]">
          <div className="h-5 bg-[#F5EAD9] rounded-md w-16"></div>
          <div className="h-8 bg-[#F5EAD9] rounded-full w-24"></div>
        </div>
      </div>
    </div>
  );
}
