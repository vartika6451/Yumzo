'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, Search } from 'lucide-react';
import { getRestaurantBySlug, getMenuItems } from '../../../services/foodService';
import useCartStore from '../../../store/useCartStore';
import RestaurantHeader from '../../../components/RestaurantHeader';
import CategoryFilter from '../../../components/CategoryFilter';
import FoodGrid from '../../../components/FoodGrid';
import SearchBar from '../../../components/SearchBar';
import EmptyState from '../../../components/EmptyState';

export default function DynamicRestaurantPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const { items: cartItems, toggleCart } = useCartStore();
  const totalItemsCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    async function fetchRestaurantData() {
      setLoading(true);
      setNotFound(false);

      // 1. Fetch restaurant by slug
      const resResult = await getRestaurantBySlug(slug);

      if (!isMounted) return;

      if (!resResult.isConfigured) {
        setIsConfigured(false);
      }

      if (!resResult.data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setRestaurant(resResult.data);

      // 2. Fetch food items for this restaurant
      const itemsResult = await getMenuItems({
        restaurantId: resResult.data.id,
        availableOnly: true
      });

      if (!isMounted) return;

      const items = itemsResult.data || [];
      setMenuItems(items);

      // Extract unique categories
      const uniqueCats = ["All", ...new Set(items.map((i) => i.category).filter(Boolean))];
      setCategories(uniqueCats);

      setLoading(false);
    }

    fetchRestaurantData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Client-side filtering by category & search query
  const filteredItems = menuItems.filter((item) => {
    if (activeCategory !== "All" && item.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  // Handle 404
  if (notFound) {
    return (
      <div className="min-h-screen bg-[#FFF7EA] text-[#2F1D1D] px-4 py-16 flex flex-col items-center justify-center">
        <EmptyState
          title="Restaurant Not Found"
          message={`We couldn't find a kitchen registered under the slug "${slug}". It might have moved or the link is incorrect.`}
          type="error"
          actionText="Back to Food Discovery"
          actionHref="/home"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7EA] text-[#2F1D1D] antialiased selection:bg-[#FFC857]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#FFF7EA]/90 backdrop-blur-md border-b border-[#F5E8D3] px-4 sm:px-8 lg:px-14 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/home" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">🥟</span>
            <span className="text-2xl font-black text-[#2F1D1D] tracking-tight">
              yumzo<span className="text-[#F65C45]">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleCart}
              className="flex items-center gap-2 bg-[#F65C45] hover:bg-[#E04B35] text-white px-4 py-2 rounded-full font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <ShoppingBag size={14} />
              <span>{totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 py-8">
        {/* Restaurant Header */}
        <RestaurantHeader restaurant={restaurant} />

        {/* Menu Section Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2F1D1D] tracking-tight">
              Chef&apos;s Imaginary Menu
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6464] font-semibold mt-1">
              Select dishes to add to your virtual feast tray.
            </p>
          </div>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
            placeholder={`Search ${restaurant?.name || 'menu'}...`}
          />
        </div>

        {/* Category Filter Pills */}
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>

        {/* Food Grid */}
        <FoodGrid
          items={filteredItems}
          loading={loading}
          emptyTitle="No Dishes In This Category"
          emptyMessage="No available dishes match the current filter or search."
          emptyType={!isConfigured ? "database_empty" : "filter"}
          onReset={() => {
            setActiveCategory("All");
            setSearchQuery("");
          }}
        />
      </main>

      {/* Floating Cart Button */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={toggleCart}
            className="px-6 py-3.5 bg-[#F65C45] hover:bg-[#E04B35] text-white rounded-full font-black text-sm shadow-2xl hover:shadow-[#F65C45]/30 active:scale-95 transition-all flex items-center gap-2 border-2 border-white/60 cursor-pointer"
          >
            <FaShoppingCart size={15} />
            <span>My feast · {totalItemsCount} {totalItemsCount === 1 ? 'dish' : 'dishes'}</span>
            <span>➔</span>
          </button>
        </div>
      )}
    </div>
  );
}
