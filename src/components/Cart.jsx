'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrashAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

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
  const [loading, setLoading] = useState(false);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'YUMZO10') {
      setDiscount(0.1); // 10% off
      setPromoError('');
    } else {
      setDiscount(0);
      setPromoError('Invalid promo code. Try YUMZO10');
    }
  };

  const finalPrice = totalPrice - (totalPrice * discount);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);

    try {
      // 1. Create Order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderItems: items,
          deliveryAddress: '123 Gourmet Street, Connaught Place, New Delhi',
          restaurantId: items[0]?.restaurant || '651f4d9b23b1c1d8a4f91e32',
          totalPrice: finalPrice,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || 'Order creation failed');

      // 2. Try Stripe Checkout session
      const stripeRes = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderData._id }),
      });

      const stripeData = await stripeRes.json();
      if (stripeRes.ok && stripeData.url) {
        window.location.href = stripeData.url;
      } else {
        // Fallback for offline/demo testing without live Stripe key
        console.warn('Stripe checkout unavailable, redirecting directly to order confirmation:', stripeData.message);
        toggleCart();
        router.push(`/order-success/${orderData._id}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
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
              <h2 className="text-2xl font-black text-gray-800">Your Cart</h2>
              <button
                onClick={toggleCart}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Close"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <p className="text-lg font-medium">Your cart is empty.</p>
                  <button
                    onClick={toggleCart}
                    className="mt-4 px-6 py-2.5 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition shadow-md"
                  >
                    Start Ordering
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, idx) => {
                    const parsedPrice = typeof item.price === 'string' 
                      ? parseFloat(item.price.replace(/[^0-9.-]+/g, '')) 
                      : Number(item.price);
                    const price = isNaN(parsedPrice) ? 0 : parsedPrice;
                    return (
                      <div key={item.id || item.name || idx} className="flex gap-4 items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-18 h-18 object-cover rounded-lg border border-gray-200"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 text-sm truncate">{item.name}</h3>
                          <p className="text-red-500 font-extrabold mt-0.5">${price.toFixed(2)}</p>
                          
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
                              <button
                                onClick={() => updateQuantity(item.id || item.name, -1)}
                                className="px-2.5 py-0.5 hover:bg-gray-100 rounded-l-lg text-gray-600 font-bold"
                              >
                                -
                              </button>
                              <span className="px-3 font-semibold text-xs text-gray-800">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id || item.name, 1)}
                                className="px-2.5 py-0.5 hover:bg-gray-100 rounded-r-lg text-gray-600 font-bold"
                              >
                                +
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeItem(item.id || item.name)}
                              className="text-gray-400 hover:text-red-500 p-1.5 transition-colors"
                              title="Remove item"
                            >
                              <FaTrashAlt size={14} />
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
              <div className="p-5 border-t border-gray-100 bg-white shadow-inner">
                {/* Promo Code */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (YUMZO10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-red-400 text-sm bg-gray-50 uppercase"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-red-500 text-xs mt-1 font-medium">{promoError}</p>}
                  {discount > 0 && <p className="text-green-600 text-xs mt-1 font-bold">🎉 10% discount applied!</p>}
                </div>

                {/* Summary */}
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Discount (10%)</span>
                      <span>-${(totalPrice * discount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-extrabold text-lg text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-red-500">${finalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-red-500 to-yellow-500 text-white rounded-xl font-extrabold text-base hover:opacity-95 transition shadow-lg shadow-red-500/25 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Proceed to Checkout ➔'}
                </button>
                <button
                  onClick={clearCart}
                  className="w-full py-2 mt-2 text-gray-400 text-xs font-semibold hover:text-red-500 transition"
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
