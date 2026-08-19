import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';

const Cart = () => {
  const {
    items,
    isCartOpen,
    toggleCart,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCartStore();
  const navigate = useNavigate();

  const totalPrice = items.reduce((total, item) => {
    const price = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(/[^0-9.-]+/g, '')) 
      : Number(item.price);
    const validPrice = isNaN(price) ? 0 : price;
    return total + (validPrice * (item.quantity || 1));
  }, 0);

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'YUMZO10') {
      setDiscount(0.1); // 10% off
      setPromoError('');
    } else {
      setDiscount(0);
      setPromoError('Invalid promo code');
    }
  };

  const finalPrice = totalPrice - (totalPrice * discount);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
              <button
                onClick={toggleCart}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <p className="text-lg">Your cart is empty.</p>
                  <button
                    onClick={toggleCart}
                    className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  >
                    Start Ordering
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item, idx) => {
                    const parsedPrice = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.-]+/g, '')) : Number(item.price);
                    const price = isNaN(parsedPrice) ? 0 : parsedPrice;
                    return (
                      <div key={item.id || item.name || idx} className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-red-500 font-bold">${price.toFixed(2)}</p>
                          
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center bg-white rounded-md border border-gray-200">
                              <button
                                onClick={() => updateQuantity(item.id || item.name, -1)}
                                className="px-3 py-1 hover:bg-gray-100 rounded-l-md text-gray-600"
                              >
                                -
                              </button>
                              <span className="px-3 font-medium text-sm">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id || item.name, 1)}
                                className="px-3 py-1 hover:bg-gray-100 rounded-r-md text-gray-600"
                              >
                                +
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeItem(item.id || item.name)}
                              className="text-gray-400 hover:text-red-500 p-1"
                              title="Remove item"
                            >
                              <FaTrashAlt size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="p-5 border-t border-gray-100 bg-white">
                {/* Promo Code */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (YUMZO10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-red-400 text-sm"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
                  {discount > 0 && <p className="text-green-500 text-xs mt-1">10% discount applied!</p>}
                </div>

                {/* Summary */}
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (10%)</span>
                      <span>-${(totalPrice * discount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg text-gray-800 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>${finalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={async () => {
                    try {
                      // 1. Create Order
                      const orderRes = await fetch('http://localhost:5000/api/orders', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          orderItems: items,
                          deliveryAddress: '123 Test Street', // Mock address since we don't have an address input yet
                          restaurantId: items[0]?.restaurant || '651f4d9b23b1c1d8a4f91e32', // Mock restaurant ID if undefined
                          totalPrice: finalPrice
                        }),
                      });
                      
                      const orderData = await orderRes.json();
                      if (!orderRes.ok) throw new Error(orderData.message);

                      // 2. Get Stripe Checkout URL
                      const stripeRes = await fetch('http://localhost:5000/api/payments/create-checkout-session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderId: orderData._id }),
                      });

                      const stripeData = await stripeRes.json();
                      if (!stripeRes.ok) throw new Error(stripeData.message);

                      // 3. Redirect to Stripe Checkout
                      window.location.href = stripeData.url;
                    } catch (error) {
                      console.error('Payment Error:', error);
                      alert('Failed to initiate payment: ' + error.message);
                    }
                  }}
                  className="w-full py-3 bg-red-500 text-white rounded-lg font-bold text-lg hover:bg-red-600 transition shadow-lg shadow-red-500/30"
                >
                  Pay with Stripe
                </button>
                <button
                  onClick={clearCart}
                  className="w-full py-2 mt-2 text-gray-500 text-sm font-medium hover:text-red-500 transition"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;
