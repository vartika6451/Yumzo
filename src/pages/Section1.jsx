import { useNavigate } from "react-router-dom"
import { FaMapMarkerAlt } from "react-icons/fa"
import { useState } from "react"

const Section1 = () => {
  const navigate = useNavigate()
  const [location, setLocation] = useState("Delhi")

  const handleLogout = () => {
    navigate("/")
  }

  const [cuisine, setCuisine] = useState('Italian')

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
}

  return (
   <div className={`min-h-screen bg-gradient-to-br ${cuisines[cuisine].bg} 
                 relative overflow-hidden transition-all duration-700`}>

      {/* LEFT HERO TEXT */}
  <div className="absolute left-24 top-1/3 -translate-y-1/3 z-10 max-w-xl">

    <h1 className="text-5xl font-bold leading-tight text-gray-800 transition-all duration-500">
      Order from your favourite <br />
      <span className="text-black">
        {cuisine}
      </span>{" "}
      restaurant
    </h1>

    <p className="mt-3 text-gray-500 text-lg">
      Discover the best {cuisine} dishes curated just for you.
    </p>

  </div>


      {/* ================= CUISINE SECTION ================= */}
<div className="absolute bottom-20 left-16 z-30">

  {/* Title */}
  <h2 className="text-2xl font-semibold text-gray-700 mb-2tracking-wide">
    All Cuisines
  </h2>

  {/* Circular Options */}
  <div className="flex gap-12">

    {[
      { name: "Indian", img: "/images/indian.jpeg" },
      { name: "Chinese", img: "/images/chinese.jpeg" },
      { name: "Japanese", img: "/images/japanese.jpg" },
      { name: "Italian", img: "/images/italian.png" },
    ].map((item) => (

      <div
        key={item.name}
        onClick={() => setCuisine(item.name)}
        className="flex flex-col items-center cursor-pointer group"
      >



        {/* Circular Image */}
        <div
          className={`w-28 h-28 rounded-full overflow-hidden
                      border-4 transition-all duration-300
                      ${cuisine === item.name
                        ? "border-black scale-110 shadow-xl"
                        : "border-gray-200 group-hover:scale-105 group-hover:shadow-md"}`}
        >
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Cuisine Name */}
        <p className={`mt-4 text-sm font-medium transition-all duration-300
                      ${cuisine === item.name
                        ? "text-black"
                        : "text-gray-500 group-hover:text-black"}`}>
          {item.name}
        </p>

      </div>

    ))}

  </div>
</div>

      {/* Background Glow Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gray-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gray-300 rounded-full blur-3xl opacity-30"></div>


       {/* Semicircle on right */}
      <div className={`absolute top-0 right-0 h-full w-[700px] 
                 rounded-l-full z-10 transition-all duration-700
                 ${cuisines[cuisine].circle}`}>
</div>
       
       {/* FEATURED IMAGE ON EDGE */}
<div className="absolute top-1/2 right-[650px] 
                -translate-y-1/2 translate-x-1/2 
                z-20 transition-all duration-700">

  <div className="w-72 h-72 rounded-full overflow-hidden
                  border-8 border-white shadow-2xl">

    <img
      src={cuisines[cuisine].image}
      alt={cuisine}
      className="w-full h-full object-cover"
    />

  </div>

</div>

      {/* ================= NAVBAR ================= */}
      <div className="relative z-10 w-full flex items-center justify-between px-12 py-5
                      bg-transparent
                      sticky top-0 transition-all duration-300">

        {/* LOGO */}
        <h1 className="text-3xl font-extrabold tracking-wide cursor-pointer
                       transform hover:scale-110 transition duration-300">
          <span className="text-red-500">Yum</span>
          <span className="text-yellow-400 italic">zo</span>
        </h1>

        {/* LOCATION */}
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 
                        rounded-full hover:bg-gray-200 transition duration-300 
                        transform hover:scale-105">

          <FaMapMarkerAlt className="text-red-500 animate-pulse" />

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

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-full 
                     shadow-md hover:bg-red-600 
                     transform hover:scale-105 transition duration-300"
        >
          Logout
        </button>

      </div>
    </div>
  )
}

export default Section1;