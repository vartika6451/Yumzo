import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useState } from "react";

const Section1 = ({ selectedCuisine, setSelectedCuisine }) => {
  const navigate = useNavigate();

  const [location, setLocation] = useState("Delhi");
  const [query, setQuery] = useState(""); // ✅ Search state

  const handleLogout = () => {
    navigate("/");
  };

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const cuisines = {
    Indian: {
      image: "/images/indian.jpeg",
      bg: "from-orange-100 to-white",
      circle: "bg-yellow-200"
    },
    Chinese: {
      image: "/images/chinese.jpeg",
      bg: "from-red-100 to-white",
      circle: "bg-red-200"
    },
    Japanese: {
      image: "/images/japanese.jpg",
      bg: "from-gray-100 to-white",
      circle: "bg-gray-300"
    },
    Italian: {
      image: "/images/italian.png",
      bg: "from-green-100 to-white",
      circle: "bg-green-200"
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${cuisines[selectedCuisine].bg}
                  relative overflow-hidden transition-all duration-700`}
    >

      {/* ================= NAVBAR ================= */}
      <div className="relative z-50 w-full flex items-center justify-between px-12 py-5 sticky top-0">

        {/* LOGO */}
        <h1 className="text-3xl font-extrabold tracking-wide cursor-pointer">
          <span className="text-red-500">Yum</span>
          <span className="text-yellow-400 italic">zo</span>
        </h1>

        {/* LOCATION */}
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
          <FaMapMarkerAlt className="text-red-500" />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-transparent outline-none cursor-pointer"
          >
            <option>Delhi</option>
            <option>Mumbai</option>
            <option>Bangalore</option>
            <option>Hyderabad</option>
          </select>
        </div>

        {/* SEARCH BAR */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search food..."
            value={query}
            onChange={handleSearch}
            className="px-5 py-2 rounded-full bg-gray-100 
                       outline-none focus:ring-2 focus:ring-red-400
                       transition-all duration-300 w-64"
          />
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-full 
                     hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>

      </div>

      {/* ================= HERO TEXT ================= */}
      <div className="absolute left-24 top-1/3 -translate-y-1/3 z-10 max-w-xl">
        <h1 className="text-5xl font-bold leading-tight text-gray-800">
          Order from your favourite <br />
          <span className="text-black">{selectedCuisine}</span> restaurant
        </h1>

        <p className="mt-3 text-gray-500 text-lg">
          Discover the best {selectedCuisine} dishes curated just for you.
        </p>
      </div>

      {/* ================= CUISINE SECTION ================= */}
      <div className="absolute bottom-20 left-16 z-30">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2 tracking-wide">
          All Cuisines
        </h2>

        <div className="flex gap-12">
          {Object.keys(cuisines).map((name) => (
            <div
              key={name}
              onClick={() => setSelectedCuisine(name)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`w-28 h-28 rounded-full overflow-hidden
                            border-4 transition-all duration-300
                            ${selectedCuisine === name
                    ? "border-black scale-110 shadow-xl"
                    : "border-gray-200 group-hover:scale-105 group-hover:shadow-md"}`}
              >
                <img
                  src={cuisines[name].image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className={`mt-4 text-sm font-medium
                            ${selectedCuisine === name
                  ? "text-black"
                  : "text-gray-500 group-hover:text-black"}`}>
                {name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gray-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gray-300 rounded-full blur-3xl opacity-30"></div>

      {/* Right Semicircle */}
      <div
        className={`absolute top-0 right-0 h-full w-[700px] 
                    rounded-l-full z-10 transition-all duration-700
                    ${cuisines[selectedCuisine].circle}`}
      ></div>

      {/* Featured Image */}
      <div className="absolute top-1/2 right-[650px] 
                      -translate-y-1/2 translate-x-1/2 z-20">
        <div className="w-72 h-72 rounded-full overflow-hidden
                        border-8 border-white shadow-2xl">
          <img
            src={cuisines[selectedCuisine].image}
            alt={selectedCuisine}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

    </div>
  );
};

export default Section1;
