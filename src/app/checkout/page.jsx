'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import useCartStore from '../../store/useCartStore';
import { validateCartCatalog, saveVirtualFeast } from '../../services/foodService';
import CheckoutSummary from '../../components/CheckoutSummary';
import FeastCanvas from '../../components/FeastCanvas';
import EmptyState from '../../components/EmptyState';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();

  const [theme, setTheme] = useState('midnight');
  const [title, setTitle] = useState('My 2 AM Dream Feast');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [createdFeast, setCreatedFeast] = useState(null);

  const totalPrice = items.reduce((total, item) => {
    const price = Number(item.price) || 0;
    return total + price * (item.quantity || 1);
  }, 0);

  const handleCompleteCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setValidationError(null);

    try {
      // 1. Validate items against Supabase catalog
      const itemIds = items.map((i) => i.id).filter(Boolean);
      const validation = await validateCartCatalog(itemIds);

      if (!validation.valid) {
        setValidationError(
          'Some items in your feast tray are no longer available in the active menu. Please review your cart.'
        );
        setLoading(false);
        return;
      }

      // 2. Save Feast (Database or local fallback)
      const feastResult = await saveVirtualFeast({
        title: title || 'My Imaginary Feast',
        theme,
        items,
        totalPrice
      });

      // 3. Clear Cart & Show Virtual Feast Canvas
      clearCart();
      setCreatedFeast(feastResult.data);
    } catch (err) {
      console.error('Checkout processing error:', err);
      setValidationError('An unexpected error occurred while serving your feast.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCreatedFeast(null);
  };

  return (
    <div className="min-h-screen bg-[#FFF7EA] text-[#2F1D1D] antialiased selection:bg-[#FFC857]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#FFF7EA]/90 backdrop-blur-md border-b border-[#F5E8D3] px-4 sm:px-8 lg:px-14 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">🥟</span>
            <span className="text-2xl font-black text-[#2F1D1D] tracking-tight">
              yumzo<span className="text-[#F65C45]">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-bold text-[#7A6464] bg-[#FFF2DE] px-3.5 py-1.5 rounded-full border border-[#F4E3CD]">
            <span>✨</span>
            <span>Simulated Checkout · No Real Payment</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {createdFeast ? (
          // Virtual Feast View
          <div className="space-y-6 animate-fade-in text-center">
            <div className="space-y-2">
              <span className="text-5xl animate-bounce inline-block">🎉</span>
              <h1 className="text-3xl sm:text-5xl font-black text-[#2F1D1D] tracking-tight">
                Your Virtual Feast is Served!
              </h1>
              <p className="text-xs sm:text-sm text-[#7A6464] font-semibold max-w-md mx-auto">
                0 calories delivered to your body, 100% pure joy delivered to your imagination. Download or share your certificate below!
              </p>
            </div>

            <FeastCanvas feast={createdFeast} onResetFeast={handleReset} />
          </div>
        ) : items.length === 0 ? (
          // Empty Tray State
          <div className="py-12">
            <EmptyState
              title="Your Feast Tray is Empty"
              message="You haven't added any delicious imaginary dishes yet! Browse restaurants or the home page to start craving."
              type="filter"
              actionText="Explore Delicious Cravings"
              actionHref="/home"
            />
          </div>
        ) : (
          // Checkout Form
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl sm:text-4xl font-black text-[#2F1D1D] tracking-tight">
                Virtual Feast Checkout
              </h1>
              <p className="text-xs sm:text-sm text-[#7A6464] font-medium max-w-md mx-auto">
                Review your imaginary order, pick a celebration theme, and generate your digital feast table.
              </p>
            </div>

            <CheckoutSummary
              items={items}
              totalPrice={totalPrice}
              theme={theme}
              setTheme={setTheme}
              title={title}
              setTitle={setTitle}
              onCompleteCheckout={handleCompleteCheckout}
              loading={loading}
              validationError={validationError}
            />
          </div>
        )}
      </main>
    </div>
  );
}
