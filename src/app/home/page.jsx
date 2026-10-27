'use client';
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FaSearch, 
  FaShoppingCart, 
  FaChevronLeft, 
  FaChevronRight, 
  FaDownload, 
  FaShareAlt, 
  FaSyncAlt, 
  FaTrophy,
  FaInstagram,
  FaTwitter,
  FaYoutube
} from "react-icons/fa";
import useCartStore from "../../store/useCartStore";
import useAuthStore from "../../store/useAuthStore";
import { getMenuItems, getRestaurants, getMoods } from "../../services/foodService";
import FoodGrid from "../../components/FoodGrid";
import RestaurantCard from "../../components/RestaurantCard";
import MoodSelector from "../../components/MoodSelector";
import CategoryFilter from "../../components/CategoryFilter";
import SearchBar from "../../components/SearchBar";

export default function HomePage() {
  const router = useRouter();
  const { items: cartItems, toggleCart, addItem, showToast } = useCartStore();
  const { user, setRole } = useAuthStore();

  const [activeTab, setActiveTab] = useState("All");
  const [selectedMood, setSelectedMood] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [moodsList, setMoodsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDbEmpty, setIsDbEmpty] = useState(false);
  const [isFeastServed, setIsFeastServed] = useState(false);

  const feastSectionRef = useRef(null);
  const featuredSectionRef = useRef(null);
  const restaurantsSectionRef = useRef(null);

  // Total items in imaginary feast
  const totalItemsCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  // 1. Fetch Supabase Data (Restaurants, Menu Items, Moods)
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);

      const [itemsRes, restRes, moodsRes] = await Promise.all([
        getMenuItems(),
        getRestaurants({ featuredOnly: true }),
        getMoods()
      ]);

      if (!isMounted) return;

      const items = itemsRes.data || [];
      const rests = restRes.data || [];
      const moods = moodsRes.data || [];

      setMenuItems(items);
      setRestaurants(rests);
      if (moods.length > 0) setMoodsList(moods);

      // Check if DB is empty or unconfigured
      if (items.length === 0 && (!itemsRes.isConfigured || itemsRes.count === 0)) {
        setIsDbEmpty(true);
      } else {
        setIsDbEmpty(false);
      }

      setLoading(false);
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter tabs
  const filterTabs = ["All", "Pizzas", "Mains", "Starters", "Desserts", "Beverages", "Indian", "Italian", "Chinese", "Japanese"];

  // 2. Filter logic based on tab, mood, and search query
  const filteredDishes = menuItems.filter((item) => {
    // Search query: matches food name, description, cuisine, or restaurant name
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchCuisine = item.cuisine?.toLowerCase().includes(q);
      const matchRest = item.restaurantName?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCuisine && !matchRest) return false;
    }

    // Category / Cuisine tabs
    if (activeTab === "Pizzas" && !item.name.toLowerCase().includes("pizza") && item.category !== "Pizzas") return false;
    if (activeTab === "Mains" && item.category !== "Mains") return false;
    if (activeTab === "Starters" && item.category !== "Starters") return false;
    if (activeTab === "Desserts" && item.category !== "Desserts") return false;
    if (activeTab === "Beverages" && item.category !== "Beverages") return false;
    if (activeTab === "Indian" && item.cuisine?.toLowerCase() !== "indian") return false;
    if (activeTab === "Italian" && item.cuisine?.toLowerCase() !== "italian") return false;
    if (activeTab === "Chinese" && item.cuisine?.toLowerCase() !== "chinese") return false;
    if (activeTab === "Japanese" && item.cuisine?.toLowerCase() !== "japanese") return false;

    // Mood filtering using food_moods junction data
    if (selectedMood && selectedMood !== "all") {
      if (item.moods && item.moods.length > 0) {
        const hasMood = item.moods.some((m) => m.slug.toLowerCase() === selectedMood.toLowerCase());
        if (!hasMood) return false;
      } else {
        // Fallback name matching if moods not yet populated in junction
        if (selectedMood === "cheesy" && !item.name.toLowerCase().includes("pizza") && !item.name.toLowerCase().includes("pasta") && !item.name.toLowerCase().includes("lasagna") && !item.name.toLowerCase().includes("cheese")) return false;
        if (selectedMood === "spicy" && !item.name.toLowerCase().includes("spicy") && !item.name.toLowerCase().includes("kung pao") && !item.name.toLowerCase().includes("biryani") && !item.name.toLowerCase().includes("samosa") && !item.name.toLowerCase().includes("ramen")) return false;
        if (selectedMood === "sweet" && !item.name.toLowerCase().includes("cake") && !item.name.toLowerCase().includes("tiramisu") && !item.name.toLowerCase().includes("matcha") && !item.name.toLowerCase().includes("lassi")) return false;
        if (selectedMood === "midnight" && !item.is_popular) return false;
      }
    }

    return true;
  });

  // Handle Mood Click
  const handleMoodSelect = (moodSlug) => {
    if (moodSlug === "surprise") {
      if (menuItems.length > 0) {
        const randomItem = menuItems[Math.floor(Math.random() * menuItems.length)];
        addItem({ ...randomItem, quantity: 1 });
        showToast(`🎲 Surprise craving added: ${randomItem.name}!`);
      } else {
        showToast('🎲 Pick a dish once data is loaded!');
      }
      return;
    }

    if (selectedMood === moodSlug) {
      setSelectedMood(null);
    } else {
      setSelectedMood(moodSlug);
      featuredSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Add Movie Snack Combo
  const handleTryChallenge = () => {
    // Find matching items from loaded menu or notify
    const pizzaItem = menuItems.find(i => i.name.toLowerCase().includes('pizza')) || menuItems[0];
    const burgerItem = menuItems.find(i => i.name.toLowerCase().includes('burger')) || menuItems[1];
    const drinkItem = menuItems.find(i => i.name.toLowerCase().includes('cola') || i.category === 'Beverages') || menuItems[2];

    if (pizzaItem) addItem({ ...pizzaItem, quantity: 1 });
    if (burgerItem) addItem({ ...burgerItem, quantity: 1 });
    if (drinkItem) addItem({ ...drinkItem, quantity: 1 });

    showToast('🍿 Movie-night snack table combo added to your feast!');
    feastSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Serve feast
  const handleServeFeast = () => {
    setIsFeastServed(true);
    showToast('🪄 Voila! Your imaginary feast has been served with 0 calories!');
    setTimeout(() => setIsFeastServed(false), 5000);
  };

  // Share creation
  const handleShareCreation = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('🔗 Feast link copied! Share with your fellow foodies.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7EA] text-[#2F1D1D] antialiased selection:bg-[#FFC857] selection:text-[#2F1D1D]">
      
      {/* ============================================================== */}
      {/* 1. TOP NAVBAR                                                  */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-[#FFF7EA]/90 backdrop-blur-md border-b border-[#F5E8D3] px-4 sm:px-8 lg:px-14 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Logo & Nav Links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group select-none">
              <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">🥟</span>
              <span className="text-2xl sm:text-3xl font-black text-[#2F1D1D] tracking-tight">
                yumzo<span className="text-[#F65C45]">.</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-[#725E5E]">
              <button 
                onClick={() => { setActiveTab("All"); setSelectedMood(null); featuredSectionRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                className="text-[#F65C45] relative pb-1 border-b-2 border-[#F65C45] cursor-pointer"
              >
                Explore
              </button>
              <button 
                onClick={() => restaurantsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-[#2F1D1D] transition-colors cursor-pointer"
              >
                Kitchens
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById("challenge-section");
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#2F1D1D] transition-colors cursor-pointer"
              >
                Today&apos;s challenge
              </button>
              <button 
                onClick={() => feastSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-[#2F1D1D] transition-colors cursor-pointer"
              >
                My feast
              </button>
            </nav>
          </div>

          {/* Right: Search, Cart, Imaginary Pill, Role */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Search Input / Icon */}
            <div className="relative flex items-center">
              {isSearchOpen ? (
                <div className="flex items-center bg-[#FFFCF7] border border-[#F2E5D5] rounded-full px-3 py-1.5 shadow-sm">
                  <FaSearch className="text-[#8C7676] mr-2 text-xs" />
                  <input
                    type="text"
                    placeholder="Search dishes or restaurants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="bg-transparent outline-none text-xs font-semibold w-36 sm:w-56 text-[#2F1D1D]"
                  />
                  <button 
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} 
                    className="text-xs text-[#8C7676] hover:text-[#2F1D1D] ml-1 font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="w-9 h-9 rounded-full bg-[#FFFCF7] border border-[#F2E5D5] flex items-center justify-center text-[#725E5E] hover:text-[#2F1D1D] hover:bg-white transition-all shadow-sm cursor-pointer"
                  title="Search dishes"
                >
                  <FaSearch size={13} />
                </button>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="flex items-center gap-2 bg-[#F65C45] hover:bg-[#E04B35] text-white px-4 py-2 rounded-full font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg hover:shadow-[#F65C45]/20 active:scale-95 transition-all cursor-pointer"
            >
              <FaShoppingCart size={14} />
              <span>{totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}</span>
            </button>

            {/* 100% Imaginary Pill Badge */}
            <div className="hidden lg:flex items-center gap-1.5 bg-[#FFF2DE] border border-[#F7E1C3] text-[#7A5B3E] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <span>😊</span>
              <span>100% imaginary · No food delivered</span>
            </div>

            {/* Role Switcher Pill */}
            <div className="hidden sm:flex items-center bg-[#FFFCF7] border border-[#F2E5D5] px-2.5 py-1 rounded-full text-xs font-bold text-[#725E5E]">
              <span className="text-[10px] text-[#A38E8E] mr-1 uppercase">Role:</span>
              <select
                value={user?.role || "customer"}
                onChange={(e) => {
                  setRole(e.target.value);
                  if (e.target.value === "restaurant_owner") router.push("/dashboard/restaurant");
                  else if (e.target.value === "delivery_driver") router.push("/dashboard/driver");
                }}
                className="bg-transparent outline-none cursor-pointer font-bold text-[#2F1D1D]"
              >
                <option value="customer">Customer</option>
                <option value="restaurant_owner">Kitchen</option>
                <option value="delivery_driver">Driver</option>
              </select>
            </div>

          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. HERO BANNER                                                 */}
      {/* ============================================================== */}
      <section className="relative px-4 sm:px-8 lg:px-14 pt-8 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Hero Text (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Big Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#2F1D1D] tracking-tight leading-[1.08]">
              Not hungry. <br />
              <span className="text-[#F65C45] inline-flex items-center gap-2">
                Just craving?
                <span className="text-[#FFC857] text-4xl sm:text-5xl inline-block -translate-y-2">✨</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#655252] font-semibold max-w-lg leading-relaxed">
              Build your dream food order. Zero payment. Zero delivery. All fun.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={() => featuredSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3.5 bg-[#F65C45] text-white font-extrabold text-sm sm:text-base rounded-full hover:bg-[#E04B35] shadow-lg shadow-[#F65C45]/25 hover:shadow-xl hover:shadow-[#F65C45]/35 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Feed my imagination</span>
                <span className="text-lg">➔</span>
              </button>

              <button 
                onClick={() => { setActiveTab("All"); featuredSectionRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                className="px-4 py-3 text-sm sm:text-base font-extrabold text-[#2F1D1D] hover:text-[#F65C45] transition-colors flex items-center gap-1 group cursor-pointer"
              >
                <span className="underline decoration-2 underline-offset-4 decoration-[#2F1D1D]/30 group-hover:decoration-[#F65C45]">Browse all foods</span>
                <span className="group-hover:translate-x-1 transition-transform">›</span>
              </button>
            </div>

            {/* Mini Proof Tags */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs sm:text-sm font-bold text-[#6D5A5A]">
              <span className="flex items-center gap-1.5">
                <span>😊</span> 100% Fun
              </span>
              <span className="flex items-center gap-1.5">
                <span>❤️</span> 0 Calories
              </span>
              <span className="flex items-center gap-1.5">
                <span>👥</span> Happier You
              </span>
            </div>

          </div>

          {/* Right Hero Feast Image & Doodles (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Background Glow */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#FFE4BA] blur-3xl -z-0 opacity-70"></div>

            {/* Feast Platter Image Container */}
            <div className="relative z-10 w-full max-w-md aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white group">
              <img
                src="/images/hero_feast_spread.jpg"
                alt="Delicious Imaginary Feast Spread"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Handwritten Doodle Note */}
            <div className="absolute -top-4 right-2 sm:right-6 z-20 font-handwriting text-xl sm:text-2xl text-[#2F1D1D] font-bold rotate-6 select-none bg-white/80 backdrop-blur-xs px-3 py-1 rounded-2xl shadow-sm border border-[#F0E2D0]">
              <span>0 calories in your imagination ♡</span>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. "WHAT'S YOUR CRAVING MOOD?" SECTION                         */}
      {/* ============================================================== */}
      <section className="px-4 sm:px-8 lg:px-14 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="flex justify-between items-baseline mb-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2F1D1D] tracking-tight">
                What&apos;s your craving mood?
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6464] font-semibold mt-1">
                Pick a mood and we&apos;ll show you delicious options.
              </p>
            </div>

            <button 
              onClick={() => setSelectedMood(null)}
              className="text-xs sm:text-sm font-extrabold text-[#F65C45] hover:text-[#2F1D1D] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{selectedMood ? 'Clear filter' : 'See all moods'}</span>
              <span>➔</span>
            </button>
          </div>

          {/* Mood Cards */}
          <MoodSelector
            moods={moodsList}
            selectedMood={selectedMood}
            onSelectMood={handleMoodSelect}
          />

        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. FEATURED KITCHENS / RESTAURANTS SECTION                     */}
      {/* ============================================================== */}
      {restaurants.length > 0 && (
        <section ref={restaurantsSectionRef} className="px-4 sm:px-8 lg:px-14 py-10 bg-[#FFF2DE]/50 border-y border-[#F5EAD9]">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-baseline mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#2F1D1D] tracking-tight">
                  Featured Kitchens
                </h2>
                <p className="text-xs sm:text-sm text-[#7A6464] font-semibold mt-1">
                  Explore curated imaginary restaurants and their signature menus.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((rest) => (
                <RestaurantCard key={rest.id} restaurant={rest} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 5. "FEATURED PICKS FOR YOU" SECTION                            */}
      {/* ============================================================== */}
      <section ref={featuredSectionRef} className="px-4 sm:px-8 lg:px-14 py-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Header & Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2F1D1D] tracking-tight">
                Featured picks for you
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6464] font-semibold mt-1">
                Handpicked deliciousness for your imaginary feast.
              </p>
            </div>

            {/* Filter Tabs & Arrows */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              <CategoryFilter
                categories={filterTabs}
                activeCategory={activeTab}
                onSelectCategory={setActiveTab}
              />

              {/* Prev / Next Arrows */}
              <div className="hidden sm:flex items-center gap-1 ml-1">
                <button 
                  onClick={() => {
                    const idx = filterTabs.indexOf(activeTab);
                    setActiveTab(filterTabs[(idx - 1 + filterTabs.length) % filterTabs.length]);
                  }}
                  className="w-8 h-8 rounded-full bg-[#FFFCF7] border border-[#F2E5D5] flex items-center justify-center text-[#725E5E] hover:text-[#2F1D1D] transition shadow-xs cursor-pointer"
                  title="Previous category"
                >
                  <FaChevronLeft size={11} />
                </button>
                <button 
                  onClick={() => {
                    const idx = filterTabs.indexOf(activeTab);
                    setActiveTab(filterTabs[(idx + 1) % filterTabs.length]);
                  }}
                  className="w-8 h-8 rounded-full bg-[#FFFCF7] border border-[#F2E5D5] flex items-center justify-center text-[#725E5E] hover:text-[#2F1D1D] transition shadow-xs cursor-pointer"
                  title="Next category"
                >
                  <FaChevronRight size={11} />
                </button>
              </div>
            </div>
          </div>

          {/* Food Grid with Skeletons and Empty State */}
          <FoodGrid
            items={filteredDishes}
            loading={loading}
            emptyTitle={isDbEmpty ? "Supabase Database Empty" : "No Dishes Found"}
            emptyMessage={
              isDbEmpty
                ? "Your Supabase tables are ready but contain 0 records. Run the seed script to instantly populate 5 restaurants and 30 dishes!"
                : "No dishes found matching this mood or search query. Try clearing filters!"
            }
            emptyType={isDbEmpty ? "database_empty" : "filter"}
            onReset={() => {
              setActiveTab("All");
              setSelectedMood(null);
              setSearchQuery("");
            }}
            badgeResolver={(item, idx) => (
              idx === 0 ? "Bestseller" : idx === 1 ? "Popular" : idx === 2 ? "New" : null
            )}
          />

        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. "TODAY'S TINY CHALLENGE" BANNER                             */}
      {/* ============================================================== */}
      <section id="challenge-section" className="px-4 sm:px-8 lg:px-14 py-6">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#FFC857] via-[#FFD066] to-[#FFBC3B] rounded-3xl p-6 sm:p-10 border border-[#F4BE49] shadow-lg relative overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            
            {/* Left Content (7 cols) */}
            <div className="md:col-span-7 space-y-3.5">
              
              <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-xs text-[#2F1D1D] rounded-full text-xs font-black uppercase tracking-wider shadow-xs">
                TODAY&apos;S TINY CHALLENGE
              </span>

              <h2 className="text-2xl sm:text-4xl font-black text-[#2F1D1D] tracking-tight leading-tight">
                Build the ultimate movie-night snack table 🍿
              </h2>

              <p className="text-xs sm:text-sm text-[#463232] font-bold">
                Pick at least 3 different snacks and create your dream combo.
              </p>

              <div className="pt-2">
                <button
                  onClick={handleTryChallenge}
                  className="px-6 py-3 bg-[#F65C45] hover:bg-[#E04B35] text-white font-extrabold text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Try challenge</span>
                  <span>➔</span>
                </button>
              </div>

            </div>

            {/* Right Graphic & Doodles (5 cols) */}
            <div className="md:col-span-5 relative flex justify-center items-center">
              
              {/* Image Container */}
              <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden shadow-xl border-4 border-white/80 rotate-2">
                <img
                  src="/images/movie_snacks_combo.jpg"
                  alt="Movie Night Snacks Table"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Doodled Note */}
              <div className="absolute -top-3 -right-2 font-handwriting text-xl text-[#2F1D1D] font-bold rotate-12 select-none bg-white/80 px-3 py-0.5 rounded-xl border border-white">
                Same rules. More fun! 😊
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. "YOUR IMAGINARY FEAST" LIVE TRAY SECTION                     */}
      {/* ============================================================== */}
      <section ref={feastSectionRef} className="px-4 sm:px-8 lg:px-14 py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2F1D1D] tracking-tight flex items-center gap-2">
                <span className="text-[#FFC857]">✨</span>
                <span>Your imaginary feast</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6464] font-semibold mt-1">
                Place your imaginary order and see your delicious feast come to life.
              </p>
            </div>

            <span className="text-xs font-bold text-[#8C7676] italic">
              Pick. Arrange. Make it yours. Share the happiness!
            </span>
          </div>

          {/* Grid Layout: Left Flatlay + Right Feast Status Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Feast Flatlay Image (7 cols) */}
            <div className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-[#FFF2DE]">
              <img
                src="/images/feast_table_flatlay.jpg"
                alt="Your 2 AM Imaginary Feast Table Flatlay"
                className="w-full h-auto object-cover"
              />

              {/* Celebration Overlay if Feast is Served */}
              {isFeastServed && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center text-white p-6 text-center animate-fade-in">
                  <span className="text-5xl animate-bounce">🎉</span>
                  <h3 className="text-3xl font-black mt-2">Feast Served!</h3>
                  <p className="text-sm font-semibold text-white/90 mt-1 max-w-sm">
                    Enjoy every single imaginary bite with 0 calories and 100% pure satisfaction.
                  </p>
                </div>
              )}
            </div>

            {/* Right Summary Card (5 cols) */}
            <div className="lg:col-span-5 bg-[#FFFCF7] rounded-3xl border border-[#F2E5D5] p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
              
              {/* Top: Selected mini thumbnails */}
              <div>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {cartItems.length > 0 ? (
                    cartItems.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#F65C45] bg-[#FFF2DE] shrink-0 shadow-xs">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ))
                  ) : (
                    <div className="flex gap-2">
                      <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-[#EADBCC] flex items-center justify-center text-xs text-[#8C7676] bg-[#FFF7EA]">
                        🍕
                      </div>
                      <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-[#EADBCC] flex items-center justify-center text-xs text-[#8C7676] bg-[#FFF7EA]">
                        🍔
                      </div>
                      <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-[#EADBCC] flex items-center justify-center text-xs text-[#8C7676] bg-[#FFF7EA]">
                        🍜
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-black text-[#2F1D1D] mt-6">
                  {cartItems.length > 0 ? "Your dream feast is ready!" : "Your feast tray is waiting..."}
                </h3>
                <p className="text-xs sm:text-sm text-[#7A6464] font-medium mt-1 leading-relaxed">
                  {cartItems.length > 0 
                    ? `A perfect mix of ${totalItemsCount} delicious craving ${totalItemsCount === 1 ? 'dish' : 'dishes'}. Looks delicious, right?`
                    : "Add dishes from the menu above to assemble your ultimate imaginary spread."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Link
                  href="/checkout"
                  className="w-full py-3.5 bg-[#F65C45] hover:bg-[#E04B35] text-white font-extrabold text-sm sm:text-base rounded-full shadow-lg shadow-[#F65C45]/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🪄</span>
                  <span>Serve my feast &amp; Customize</span>
                  <span>➔</span>
                </Link>

                <button
                  onClick={handleShareCreation}
                  className="w-full py-3 bg-[#FFFCF7] hover:bg-white text-[#2F1D1D] border-2 border-[#EADBCC] hover:border-[#2F1D1D] font-extrabold text-sm rounded-full transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <FaShareAlt size={13} />
                  <span>Share your creation</span>
                </button>
              </div>

              {/* 4 Bottom Micro-Actions */}
              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-[#F5EAD9] text-center">
                <Link 
                  href="/checkout"
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#FFF7EA] text-[#7A6464] hover:text-[#2F1D1D] transition-colors"
                >
                  <FaDownload size={14} />
                  <span className="text-[10px] font-extrabold leading-tight">Download as image</span>
                </Link>

                <button 
                  onClick={handleShareCreation}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#FFF7EA] text-[#7A6464] hover:text-[#2F1D1D] transition-colors cursor-pointer"
                >
                  <FaShareAlt size={14} />
                  <span className="text-[10px] font-extrabold leading-tight">Share with friends</span>
                </button>

                <button 
                  onClick={() => {
                    if (menuItems.length > 2) {
                      addItem({ ...menuItems[Math.floor(Math.random() * menuItems.length)], quantity: 1 });
                      showToast('🔄 Feast remixed with new random craving!');
                    }
                  }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#FFF7EA] text-[#7A6464] hover:text-[#2F1D1D] transition-colors cursor-pointer"
                >
                  <FaSyncAlt size={14} />
                  <span className="text-[10px] font-extrabold leading-tight">Remix this feast</span>
                </button>

                <button 
                  onClick={handleTryChallenge}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#FFF7EA] text-[#7A6464] hover:text-[#2F1D1D] transition-colors cursor-pointer"
                >
                  <FaTrophy size={14} />
                  <span className="text-[10px] font-extrabold leading-tight">Try a challenge</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. FLOATING BOTTOM-RIGHT CART ACTION PILL                      */}
      {/* ============================================================== */}
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

      {/* ============================================================== */}
      {/* 9. FOOTER                                                      */}
      {/* ============================================================== */}
      <footer className="border-t border-[#F2E5D5] bg-[#FFF7EA] px-4 sm:px-8 lg:px-14 py-12 text-[#7A6464]">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Logo & Tagline */}
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥟</span>
                <span className="text-2xl font-black text-[#2F1D1D]">yumzo.</span>
              </div>
              <span className="hidden sm:inline text-[#C4B2A0]">|</span>
              <p className="text-xs sm:text-sm font-semibold">
                Good food. Brighter moods. No delivery needed.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex items-center gap-6 text-xs sm:text-sm font-bold text-[#635050]">
              <a href="#" className="hover:text-[#2F1D1D] transition">About</a>
              <a href="#" className="hover:text-[#2F1D1D] transition">How it works</a>
              <a href="#challenge-section" className="hover:text-[#2F1D1D] transition">Today&apos;s challenge</a>
              <a href="#" className="hover:text-[#2F1D1D] transition">Feedback</a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 text-[#2F1D1D]/70 text-base">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#F65C45] transition">
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#F65C45] transition">
                <FaTwitter />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#F65C45] transition">
                <FaYoutube />
              </a>
            </div>

          </div>

          {/* Copyright & Disclaimer */}
          <div className="pt-6 border-t border-[#F5EAD9] flex flex-col sm:flex-row justify-between items-center text-[11px] font-semibold gap-2">
            <span>© 2026 Yumzo. All fun reserved.</span>
            <span>Nothing here is actually delivered. It&apos;s all in your imagination. 😊</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
