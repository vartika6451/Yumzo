'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Card from "../../components/Card";
import {
  indianItems,
  japaneseItems,
  italianItems,
  chineseItems
} from "../../data/menu";

export default function HomePage() {
  const router = useRouter();
  const [selectedCuisine, setSelectedCuisine] = useState("Indian");
  const [location, setLocation] = useState("Delhi");
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("loggedInUser");
    }
    router.push("/");
  };

  const cuisines = {
    Indian: {
      image: "/images/indian.jpeg",
      bg: "from-orange-50 to-white",
      circle: "bg-yellow-200/60"
    },
    Chinese: {
      image: "/images/chinese.jpeg",
      bg: "from-red-50 to-white",
      circle: "bg-red-200/60"
    },
    Japanese: {
      image: "/images/japanese.jpg",
      bg: "from-gray-100 to-white",
      circle: "bg-gray-300/60"
    },
    Italian: {
      image: "/images/italian.png",
      bg: "from-green-50 to-white",
      circle: "bg-green-200/60"
    }
  };

  const cuisineMap = {
    Indian: indianItems,
    Japanese: japaneseItems,
    Italian: italianItems,
    Chinese: chineseItems
  };

  const currentItems = cuisineMap[selectedCuisine] || [];
  const filteredItems = query.trim()
    ? currentItems.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    : currentItems;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${cuisines[selectedCuisine]?.bg || 'from-orange-50 to-white'} transition-colors duration-700`}>
      {/* NAVBAR */}
      <Navbar
        location={location}
        setLocation={setLocation}
        query={query}
        handleSearch={handleSearch}
        handleLogout={handleLogout}
      />

      {/* HERO SECTION */}
      <div className="relative overflow-hidden px-6 md:px-12 pt-12 pb-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-20">
          
          {/* Left Text */}
          <div className="max-w-xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-red-100 text-red-600 text-xs font-extrabold uppercase tracking-widest mb-4">
              Premium Food Experience
            </span>
            <h1 className="text-4xl md:text-6xl font-black leading-tight text-gray-900">
              Order from your favourite <br />
              <span className="text-red-500 underline decoration-yellow-400 decoration-wavy">{selectedCuisine}</span> restaurant
            </h1>

            <p className="mt-4 text-gray-600 text-lg">
              Discover the most authentic {selectedCuisine} dishes curated with chef-crafted perfection.
            </p>

            {/* CUISINE SELECTOR PILLS */}
            <div className="mt-8">
              <h2 className="text-sm font-extrabold text-gray-400 uppercase tracking-wider mb-4">
                Explore Cuisines
              </h2>

              <div className="flex flex-wrap gap-4 sm:gap-6">
                {Object.keys(cuisines).map((name) => (
                  <div
                    key={name}
                    onClick={() => setSelectedCuisine(name)}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    <div
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden
                                  border-4 transition-all duration-300 shadow-md
                                  ${selectedCuisine === name
                          ? "border-red-500 scale-105 shadow-xl ring-4 ring-red-100"
                          : "border-white group-hover:scale-105 group-hover:border-gray-300"}`}
                    >
                      <img
                        src={cuisines[name].image}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <p className={`mt-2 text-xs sm:text-sm font-bold transition-colors
                                  ${selectedCuisine === name
                        ? "text-red-500"
                        : "text-gray-600 group-hover:text-black"}`}>
                      {name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Featured Image */}
          <div className="relative flex justify-center items-center">
            <div className={`w-72 h-72 sm:w-96 sm:h-96 rounded-full overflow-hidden border-8 border-white shadow-2xl z-10 transition-transform duration-500 hover:scale-105`}>
              <img
                src={cuisines[selectedCuisine].image}
                alt={selectedCuisine}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Background Accent Circle */}
            <div className={`absolute w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full blur-2xl -z-0 opacity-70 ${cuisines[selectedCuisine].circle}`}></div>
          </div>
        </div>
      </div>

      {/* DISHES GRID SECTION */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-3xl font-black text-gray-900">
              {selectedCuisine} Delicacies
            </h2>
            <p className="text-gray-500 text-sm mt-1">Showing {filteredItems.length} curated dishes</p>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-bold text-lg">No dishes found matching &quot;{query}&quot;</p>
            <button
              onClick={() => setQuery("")}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full font-bold text-sm hover:bg-red-600 transition"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
            {filteredItems.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
