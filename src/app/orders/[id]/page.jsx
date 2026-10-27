'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import OrderTracker from '../../../components/OrderTracker';
import { ChevronLeft } from 'lucide-react';

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params?.id || 'demo_order';
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-8 font-bold text-sm"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back
        </button>

        <div className="mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100">
            Live Order Status
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">Order #{id}</h1>
          <p className="text-gray-500 mt-1 text-sm">Real-time status synchronization powered by Socket.io</p>
        </div>

        {/* Real-time Tracker Component */}
        <OrderTracker orderId={id} initialStatus="Placed" />

        {/* Order Summary Card */}
        <div className="mt-8 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">Order Information</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
              <span className="text-gray-500">Assigned Restaurant</span>
              <span className="font-bold text-gray-900">The Indian Spice</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
              <span className="text-gray-500">Destination</span>
              <span className="font-bold text-gray-900 text-right">123 Gourmet Street, Connaught Place</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
              <span className="text-gray-500">Estimated Arrival</span>
              <span className="font-bold text-green-600">20-30 mins</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-base font-bold text-gray-900">Payment Status</span>
              <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                Confirmed (Paid)
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
