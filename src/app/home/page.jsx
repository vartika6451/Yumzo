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
import {
  indianItems,
  chineseItems,
  japaneseItems,
  italianItems
} from "../../data/menu";
import useCartStore from "../../store/useCartStore";
import useAuthStore from "../../store/useAuthStore";
import { getMenuItems } from "../../services/foodService";
import Card from "../../components/Card";

const INITIAL_DISHES = [
  {
    id: 'loaded_pizza',
    name: 'Loaded Cheese Pizza',
    description: 'Classic delight with extra cheese, olives and fresh veggies.',
    price: 299,
    rating: 4.9,
    time: '20M',
    image: '/images/pizza.jpg',
    cuisine: 'Italian',
    category: 'Pizza'
  },
  {
    id: 'chicken_biryani',
    name: 'Chicken Biryani',
    description: 'Fragrant rice, tender chicken and a burst of spices.',
    price: 349,
    rating: 4.8,
    time: '25M',
    image: '/images/jeerarice.jpg',
    cuisine: 'Indian',
    category: 'Main Course'
  },
  {
    id: 'spicy_ramen',
    name: 'Spicy Ramen Bowl',
    description: 'A warm, spicy hug in a bowl.',
    price: 279,
    rating: 4.7,
    time: '18M',
    image: '/images/ramen.jpg',
    cuisine: 'Japanese',
    category: 'Main Course'
  },
  {
    id: 'chocolate_cake',
    name: 'Chocolate Truffle Cake',
    description: 'Rich, creamy and totally irresistible.',
    price: 249,
    rating: 4.9,
    time: '10M',
    image: '/images/tiramisu.jpg',
    cuisine: 'Italian',
    category: 'Dessert'
  },
  ...indianItems.map(item => ({ ...item, cuisine: 'Indian', category: 'Main Course' })),
  ...chineseItems.map(item => ({ ...item, cuisine: 'Chinese', category: 'Main Course' })),
  ...japaneseItems.map(item => ({ ...item, cuisine: 'Japanese', category: 'Main Course' })),
  ...italianItems.map(item => ({ ...item, cuisine: 'Italian', category: 'Main Course' })),
];

export default function HomePage() {
  const router = useRouter();
  const { items: cartItems, toggleCart, addItem, showToast } = useCartStore();
  const { user, setRole } = useAuthStore();

  const [activeTab, setActiveTab] = useState("All");
  const [selectedMood, setSelectedMood] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [menuItems, setMenuItems] = useState(INITIAL_DISHES);
  const [loading, setLoading] = useState(false);
  const [isFeastServed, setIsFeastServed] = useState(false);

  const feastSectionRef = useRef(null);
  const featuredSectionRef = useRef(null);

  // Total items in imaginary feast
  const totalItemsCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  // 1. Fetch menu items from foodService (Supabase or local)
  useEffect(() => {
    let isMounted = true;
    async function loadDishes() {
      const data = await getMenuItems();
      if (isMounted && data && data.length > 0) {
        // Merge with initial featured items to ensure first 4 remain featured
        const featuredNames = new Set(INITIAL_DISHES.slice(0, 4).map(d => d.name));
        const rest = data.filter(d => !featuredNames.has(d.name));
        setMenuItems([...INITIAL_DISHES.slice(0, 4), ...rest]);
      }
    }
    loadDishes();
    return () => { isMounted = false; };
  }, []);

  // Filter tabs
  const filterTabs = ["All", "Indian", "Pizzas", "Burgers", "Desserts", "Asian"];

  // 2. Filter logic based on tab, mood, and search query
  const filteredDishes = menuItems.filter((item) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch = item.name.toLowerCase().includes(q) || (item.cuisine && item.cuisine.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    // Category / Cuisine tabs
    if (activeTab === "Indian" && item.cuisine?.toLowerCase() !== "indian") return false;
    if (activeTab === "Pizzas" && !item.name.toLowerCase().includes("pizza")) return false;
    if (activeTab === "Burgers" && !item.name.toLowerCase().includes("burger") && !item.name.toLowerCase().includes("tikki")) return false;
    if (activeTab === "Desserts" && !["Dessert", "Beverage"].includes(item.category) && !item.name.toLowerCase().includes("cake") && !item.name.toLowerCase().includes("tiramisu") && !item.name.toLowerCase().includes("ice cream") && !item.name.toLowerCase().includes("lassi")) return false;
    if (activeTab === "Asian" && !["Chinese", "Japanese"].includes(item.cuisine)) return false;

    // Mood filtering
    if (selectedMood === "cheesy" && !item.name.toLowerCase().includes("pizza") && !item.name.toLowerCase().includes("pasta") && !item.name.toLowerCase().includes("lasagna")) return false;
    if (selectedMood === "spicy" && !item.name.toLowerCase().includes("spicy") && !item.name.toLowerCase().includes("kung pao") && !item.name.toLowerCase().includes("manchurian") && !item.name.toLowerCase().includes("tikki") && !item.name.toLowerCase().includes("ramen")) return false;
    if (selectedMood === "sweet" && !item.name.toLowerCase().includes("cake") && !item.name.toLowerCase().includes("tiramisu") && !item.name.toLowerCase().includes("matcha") && !item.name.toLowerCase().includes("lassi")) return false;

    return true;
  });

  // Mood options
  const moods = [
    {
      id: "cheesy",
      icon: "🧀",
      title: "Cheesy",
      desc: "Everything is better with cheese",
      bg: "bg-[#FFF3D6] hover:bg-[#FFE9B8] border-[#FFE2A1]",
    },
    {
      id: "spicy",
      icon: "🌶️",
      title: "Spicy",
      desc: "For the heat lovers",
      bg: "bg-[#FDE8E5] hover:bg-[#FCD7D2] border-[#FBC4BD]",
    },
    {
      id: "midnight",
      icon: "🌙",
      title: "Midnight snacks",
      desc: "For late night cravings",
      bg: "bg-[#ECEFFE] hover:bg-[#DFE4FD] border-[#D1D9FB]",
    },
    {
      id: "sweet",
      icon: "🍰",
      title: "Sweet tooth",
      desc: "Because dessert is always a good idea",
      bg: "bg-[#FDE9EF] hover:bg-[#FCD8E3] border-[#FBC4D4]",
    },
    {
      id: "surprise",
      icon: "🎲",
      title: "Surprise me!",
      desc: "Show me something random",
      bg: "bg-[#E1EDCB] hover:bg-[#D5E6B8] border-[#C2DDA1]",
    },
  ];

  // Handle Mood Click
  const handleMoodSelect = (moodId) => {
    if (moodId === "surprise") {
      if (menuItems.length > 0) {
        const randomItem = menuItems[Math.floor(Math.random() * menuItems.length)];
        addItem({ ...randomItem, quantity: 1 });
        showToast(`🎲 Surprise craving added: ${randomItem.name}!`);
      }
      return;
    }
    if (selectedMood === moodId) {
      setSelectedMood(null);
    } else {
      setSelectedMood(moodId);
      featuredSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Add Movie Snack Combo
  const handleTryChallenge = () => {
    addItem({ id: 'pizza_loaded', name: 'Loaded Cheese Pizza', price: 299, image: '/images/pizza.jpg', quantity: 1 });
    addItem({ id: 'burger_crispy', name: 'Double Cheese Burger', price: 180, image: '/images/burger.png', quantity: 1 });
    addItem({ id: 'drink_cola', name: 'Chilled Cola Fizz', price: 60, image: '/images/drink.png', quantity: 1 });
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
                onClick={() => { setActiveTab("All"); setSelectedMood(null); }}
                className="text-[#F65C45] relative pb-1 border-b-2 border-[#F65C45]"
              >
                Explore
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById("challenge-section");
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#2F1D1D] transition-colors"
              >
                Today&apos;s challenge
              </button>
              <button 
                onClick={() => feastSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-[#2F1D1D] transition-colors"
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
                    placeholder="Search craving..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="bg-transparent outline-none text-xs font-semibold w-32 sm:w-48 text-[#2F1D1D]"
                  />
                  <button 
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} 
                    className="text-xs text-[#8C7676] hover:text-[#2F1D1D] ml-1 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="w-9 h-9 rounded-full bg-[#FFFCF7] border border-[#F2E5D5] flex items-center justify-center text-[#725E5E] hover:text-[#2F1D1D] hover:bg-white transition-all shadow-sm"
                  title="Search dishes"
                >
                  <FaSearch size={13} />
                </button>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="flex items-center gap-2 bg-[#F65C45] hover:bg-[#E04B35] text-white px-4 py-2 rounded-full font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg hover:shadow-[#F65C45]/20 active:scale-95 transition-all"
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
                className="px-7 py-3.5 bg-[#F65C45] text-white font-extrabold text-sm sm:text-base rounded-full hover:bg-[#E04B35] shadow-lg shadow-[#F65C45]/25 hover:shadow-xl hover:shadow-[#F65C45]/35 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Feed my imagination</span>
                <span className="text-lg">➔</span>
              </button>

              <button 
                onClick={() => { setActiveTab("All"); featuredSectionRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                className="px-4 py-3 text-sm sm:text-base font-extrabold text-[#2F1D1D] hover:text-[#F65C45] transition-colors flex items-center gap-1 group"
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
              className="text-xs sm:text-sm font-extrabold text-[#F65C45] hover:text-[#2F1D1D] transition-colors flex items-center gap-1"
            >
              <span>{selectedMood ? 'Clear filter' : 'See all moods'}</span>
              <span>➔</span>
            </button>
          </div>

          {/* Mood Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {moods.map((mood) => {
              const isSelected = selectedMood === mood.id;
              return (
                <div
                  key={mood.id}
                  onClick={() => handleMoodSelect(mood.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-start gap-3 select-none ${
                    isSelected ? 'ring-3 ring-[#F65C45] scale-102 shadow-md' : 'shadow-xs hover:-translate-y-0.5 hover:shadow-sm'
                  } ${mood.bg}`}
                >
                  <span className="text-2xl sm:text-3xl shrink-0 mt-0.5">{mood.icon}</span>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#2F1D1D] leading-tight">
                      {mood.title}
                    </h3>
                    <p className="text-[11px] text-[#695656] font-medium mt-0.5 leading-snug">
                      {mood.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. "FEATURED PICKS FOR YOU" SECTION                            */}
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
              <div className="flex items-center gap-1.5 bg-[#FFF2DE] p-1 rounded-full border border-[#F4E3CD]">
                {filterTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${
                      activeTab === tab
                        ? 'bg-[#FFFCF7] text-[#2F1D1D] shadow-sm'
                        : 'text-[#7A6464] hover:text-[#2F1D1D]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Prev / Next Arrows */}
              <div className="hidden sm:flex items-center gap-1 ml-1">
                <button 
                  onClick={() => {
                    const idx = filterTabs.indexOf(activeTab);
                    setActiveTab(filterTabs[(idx - 1 + filterTabs.length) % filterTabs.length]);
                  }}
                  className="w-8 h-8 rounded-full bg-[#FFFCF7] border border-[#F2E5D5] flex items-center justify-center text-[#725E5E] hover:text-[#2F1D1D] transition shadow-xs"
                >
                  <FaChevronLeft size={11} />
                </button>
                <button 
                  onClick={() => {
                    const idx = filterTabs.indexOf(activeTab);
                    setActiveTab(filterTabs[(idx + 1) % filterTabs.length]);
                  }}
                  className="w-8 h-8 rounded-full bg-[#FFFCF7] border border-[#F2E5D5] flex items-center justify-center text-[#725E5E] hover:text-[#2F1D1D] transition shadow-xs"
                >
                  <FaChevronRight size={11} />
                </button>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="text-center py-20 text-[#8C7676] font-bold">
              Preparing your feast menu...
            </div>
          ) : filteredDishes.length === 0 ? (
            <div className="text-center py-16 bg-[#FFFCF7] rounded-3xl border border-dashed border-[#EADBCC] p-8">
              <p className="text-base font-extrabold text-[#2F1D1D]">No dishes found matching this mood/filter!</p>
              <button
                onClick={() => { setActiveTab("All"); setSelectedMood(null); setSearchQuery(""); }}
                className="mt-4 px-6 py-2 bg-[#F65C45] text-white rounded-full text-xs font-black shadow-md hover:bg-[#E04B35]"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredDishes.map((item, idx) => (
                <Card 
                  key={item.id || idx} 
                  item={item} 
                  badge={
                    idx === 0 ? "Bestseller" :
                    idx === 1 ? "Popular" :
                    idx === 2 ? "New" : null
                  }
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. "TODAY'S TINY CHALLENGE" BANNER                             */}
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
                  className="px-6 py-3 bg-[#F65C45] hover:bg-[#E04B35] text-white font-extrabold text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
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
      {/* 6. "YOUR IMAGINARY FEAST" LIVE TRAY SECTION                     */}
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
                <button
                  onClick={handleServeFeast}
                  className="w-full py-3.5 bg-[#F65C45] hover:bg-[#E04B35] text-white font-extrabold text-sm sm:text-base rounded-full shadow-lg shadow-[#F65C45]/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>🪄</span>
                  <span>Serve my feast</span>
                  <span>➔</span>
                </button>

                <button
                  onClick={handleShareCreation}
                  className="w-full py-3 bg-[#FFFCF7] hover:bg-white text-[#2F1D1D] border-2 border-[#EADBCC] hover:border-[#2F1D1D] font-extrabold text-sm rounded-full transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <FaShareAlt size={13} />
                  <span>Share your creation</span>
                </button>
              </div>

              {/* 4 Bottom Micro-Actions */}
              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-[#F5EAD9] text-center">
                <button 
                  onClick={() => showToast('📥 Imaginary snapshot saved to gallery!')}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#FFF7EA] text-[#7A6464] hover:text-[#2F1D1D] transition-colors"
                >
                  <FaDownload size={14} />
                  <span className="text-[10px] font-extrabold leading-tight">Download as image</span>
                </button>

                <button 
                  onClick={handleShareCreation}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#FFF7EA] text-[#7A6464] hover:text-[#2F1D1D] transition-colors"
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
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#FFF7EA] text-[#7A6464] hover:text-[#2F1D1D] transition-colors"
                >
                  <FaSyncAlt size={14} />
                  <span className="text-[10px] font-extrabold leading-tight">Remix this feast</span>
                </button>

                <button 
                  onClick={handleTryChallenge}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#FFF7EA] text-[#7A6464] hover:text-[#2F1D1D] transition-colors"
                >
                  <FaTrophy size={14} />
                  <span className="text-[10px] font-extrabold leading-tight">Try a new challenge</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. FLOATING BOTTOM-RIGHT CART ACTION PILL                      */}
      {/* ============================================================== */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={toggleCart}
          className="px-6 py-3.5 bg-[#F65C45] hover:bg-[#E04B35] text-white rounded-full font-black text-sm shadow-2xl hover:shadow-[#F65C45]/30 active:scale-95 transition-all flex items-center gap-2 border-2 border-white/60"
        >
          <FaShoppingCart size={15} />
          <span>My feast · {totalItemsCount} {totalItemsCount === 1 ? 'dish' : 'dishes'}</span>
          <span>➔</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 8. FOOTER                                                      */}
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
