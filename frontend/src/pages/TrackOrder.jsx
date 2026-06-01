import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const TrackOrder = () => {
  const [orderCode, setOrderCode] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderCode.trim()) {
      toast.error('Please enter your tracking code');
      return;
    }
    
    // The Tracking Code is just the order_number (e.g. POP123456)
    navigate(`/order/${orderCode.trim()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-24">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-8 text-center">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-playfair font-bold text-white mb-2">Track Your Order</h1>
            <p className="text-purple-100">Enter your unique tracking code below</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleTrack} className="space-y-6">
              <div>
                <label htmlFor="orderCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Order Tracking Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="orderCode"
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value)}
                    className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition text-lg uppercase"
                    placeholder="e.g. POPMPVO..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl hover:bg-gray-800 transition shadow-lg hover:shadow-xl font-semibold text-lg"
              >
                Track Now
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                You can find your tracking code in the order confirmation email or receipt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
