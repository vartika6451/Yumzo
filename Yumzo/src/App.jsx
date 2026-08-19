import {Routes, Route } from "react-router-dom"
import { FaAngleDown } from "react-icons/fa"

import FoodSection from "./components/FoodSection"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Home from "./pages/Home"
import Cart from "./components/Cart"
import useCartStore from "./store/useCartStore"
import { motion, AnimatePresence } from "framer-motion"
import OrderDetails from "./pages/OrderDetails"
import OrderSuccess from "./pages/OrderSuccess"
import OrderCancelled from "./pages/OrderCancelled"
import ProtectedRoute from "./components/ProtectedRoute"
import RestaurantDashboard from "./pages/dashboards/RestaurantDashboard"
import DriverDashboard from "./pages/dashboards/DriverDashboard"
import Account from "./pages/Account"

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
            Discover the best food near you
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
  const toastMessage = useCartStore((state) => state.toastMessage);

  return (
      <>
        {/* Global Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 50, x: "-50%" }}
              className="fixed bottom-10 left-1/2 z-50 bg-gray-800 text-white px-6 py-3 rounded-full shadow-2xl font-medium"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <Cart />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
          <Route path="/order-cancelled" element={<OrderCancelled />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard/restaurant" 
            element={
              <ProtectedRoute allowedRoles={['restaurant_owner']}>
                <RestaurantDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/driver" 
            element={
              <ProtectedRoute allowedRoles={['delivery_driver']}>
                <DriverDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/account" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Account />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </>
  )
}


export default App
