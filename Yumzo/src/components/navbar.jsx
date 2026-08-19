import React from 'react';
import { FaMapMarkerAlt, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';

const Navbar = ({ location, setLocation, query, handleSearch, handleLogout }) => {
  const { items, toggleCart } = useCartStore();
  const { user, setRole } = useAuthStore();
  const navigate = useNavigate();
  const totalItems = items.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <div className="relative z-50 w-full flex items-center justify-between px-12 py-5 sticky top-0">
      {/* LOGO */}
      <h1 className="text-3xl font-extrabold tracking-wide cursor-pointer">
        <span className="text-red-500">Yum</span>
        <span className="text-yellow-400 italic">zo</span>
      </h1>

      {/* LOCATION */}
      <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
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
          className="px-5 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm
                     outline-none focus:ring-2 focus:ring-red-400
                     transition-all duration-300 w-64"
        />
      </div>

      <div className="flex items-center gap-6">
        {/* ROLE SWITCHER (Demo only) */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Role:</span>
          <select 
            value={user?.role || 'customer'}
            onChange={(e) => {
              setRole(e.target.value);
              // Navigate to appropriate dashboard on role change
              if (e.target.value === 'restaurant_owner') navigate('/dashboard/restaurant');
              else if (e.target.value === 'delivery_driver') navigate('/dashboard/driver');
              else navigate('/account');
            }}
            className="bg-transparent text-sm font-semibold outline-none cursor-pointer text-gray-800"
          >
            <option value="customer">Customer</option>
            <option value="restaurant_owner">Restaurant</option>
            <option value="delivery_driver">Driver</option>
          </select>
        </div>

        {/* CART ICON */}
        <button
          onClick={toggleCart}
          className="relative p-2 text-gray-700 hover:text-red-500 transition-colors"
        >
          <FaShoppingCart size={24} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
              {totalItems}
            </span>
          )}
        </button>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-full 
                     hover:bg-red-600 shadow-md hover:shadow-lg transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
