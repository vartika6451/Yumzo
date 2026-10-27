'use client';
import React from 'react';
import { FaAngleDown } from 'react-icons/fa';
import FoodSection from '../components/FoodSection';

export default function LandingPage() {
  return (
    <>
      <section className="relative w-full min-h-screen overflow-hidden flex flex-col justify-center items-center">
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
        <div className="absolute top-0 left-0 w-full h-full bg-black/45 z-1"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white text-center px-4">
          <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tight drop-shadow-lg">
            <span className="text-yellow-400">Yum</span>
            <span className="italic text-white">zo</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-lg text-gray-200 drop-shadow">
            Discover and crave the finest dishes around you.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 w-full flex flex-col items-center z-10 text-white animate-bounce">
          <span className="text-xs font-bold tracking-widest uppercase mb-1">Scroll down</span>
          <FaAngleDown size={18} />
          <FaAngleDown size={18} className="-mt-2" />
        </div>
      </section>

      <FoodSection />
    </>
  );
}
