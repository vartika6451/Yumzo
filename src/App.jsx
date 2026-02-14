import { Routes, Route } from "react-router-dom"
import { FaAngleDown } from "react-icons/fa"

import FoodSection from "./components/FoodSection"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Home from "./pages/Home"

const Landing = () => {
  return (
    <>
      <section className="relative w-full min-h-screen overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/food.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/35"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white">
          <h1 className="text-6xl font-extrabold mb-4">
            <span className="text-yellow-300">Yum</span>
            <span className="italic">zo</span>
          </h1>
          <p className="text-xl">
            Discover the best food & restaurants near you
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 w-full flex flex-col items-center z-10 text-white animate-bounce">
          <h4>Scroll down</h4>
          <FaAngleDown />
          <FaAngleDown />
        </div>
      </section>

      <FoodSection />
    </>
  )
}

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  )
}

export default App
