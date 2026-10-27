'use client';
import React from 'react';
import FoodCard from './FoodCard';
import SkeletonCard from './SkeletonCard';
import EmptyState from './EmptyState';

export default function FoodGrid({
  items = [],
  loading = false,
  emptyTitle = "No Dishes Found",
  emptyMessage = "We couldn't find any dishes matching your current selection.",
  emptyType = "filter",
  onReset = null,
  badgeResolver = null
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
        type={emptyType}
        onReset={onReset}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item, idx) => (
        <FoodCard
          key={item.id || idx}
          item={item}
          badge={badgeResolver ? badgeResolver(item, idx) : null}
        />
      ))}
    </div>
  );
}
