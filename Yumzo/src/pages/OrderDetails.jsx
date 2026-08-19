import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderTracker from '../components/OrderTracker';
import { ChevronLeft } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order #{id}</h1>
          <p className="text-gray-500 mt-2">Real-time status tracking</p>
        </div>

        {/* Real-time Tracker Component */}
        <OrderTracker orderId={id} initialStatus="Placed" />

        {/* Dummy Order Summary */}
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-gray-600">Restaurant</span>
              <span className="font-semibold text-gray-900">The Indian Spice</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-gray-600">Delivery Address</span>
              <span className="font-semibold text-gray-900 text-right">123 Main Street<br/>Apt 4B</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-green-600">$45.00</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;
