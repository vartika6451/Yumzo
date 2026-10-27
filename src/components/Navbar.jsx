'use client';
import React from 'react';
import { FaMapMarkerAlt, FaShoppingCart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';

const Navbar = ({ location = 'Delhi', setLocation, query = '', handleSearch, handleLogout }) => {
  const { items, toggleCart } = useCartStore();
  const { user, setRole } = useAuthStore();
  const router = useRouter();
  const totalItems = items.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const onLogout = () => {
    if (handleLogout) {
      handleLogout();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="relative z-50 w-full flex flex-wrap items-center justify-between px-6 md:px-12 py-5 sticky top-0 bg-white/70 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      {/* LOGO */}
      <h1 
        onClick={() => router.push('/')}
        className="text-3xl font-extrabold tracking-wide cursor-pointer hover:opacity-90 transition select-none"
      >
        <span className="text-red-500">Yum</span>
        <span className="text-yellow-500 italic">zo</span>
      </h1>

      {/* LOCATION */}
      <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
        <FaMapMarkerAlt className="text-red-500" />
        <select
          value={location}
          onChange={(e) => setLocation && setLocation(e.target.value)}
          className="bg-transparent outline-none cursor-pointer text-sm font-semibold text-gray-700"
        >
          <option>Delhi</option>
          <option>Mumbai</option>
          <option>Bangalore</option>
          <option>Hyderabad</option>
        </select>
      </div>

      {/* SEARCH BAR */}
      <div className="relative my-2 sm:my-0 order-last sm:order-none w-full sm:w-auto">
        <input
          type="text"
          placeholder="Search food or cuisine..."
          value={query}
          onChange={handleSearch}
          className="w-full sm:w-72 px-5 py-2.5 rounded-full bg-gray-50 border border-gray-200 shadow-inner
                     outline-none focus:ring-2 focus:ring-red-400 focus:bg-white text-sm
                     transition-all duration-300"
        />
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {/* ROLE SWITCHER */}
        <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Role:</span>
          <select 
            value={user?.role || 'customer'}
            onChange={(e) => {
              const newRole = e.target.value;
              setRole(newRole);
              if (newRole === 'restaurant_owner') router.push('/dashboard/restaurant');
              else if (newRole === 'delivery_driver') router.push('/dashboard/driver');
              else router.push('/account');
            }}
            className="bg-transparent text-xs font-bold outline-none cursor-pointer text-gray-800"
          >
            <option value="customer">Customer</option>
            <option value="restaurant_owner">Kitchen</option>
            <option value="delivery_driver">Driver</option>
          </select>
        </div>

        {/* CART ICON */}
        <button
          onClick={toggleCart}
          className="relative p-2.5 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
          title="Open Cart"
        >
          <FaShoppingCart size={22} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-pulse">
              {totalItems}
            </span>
          )}
        </button>

        {/* LOGOUT / SIGN IN */}
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-5 py-2 rounded-full font-bold text-sm
                     hover:bg-red-600 shadow-md hover:shadow-red-500/30 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
