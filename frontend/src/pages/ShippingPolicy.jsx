import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-gray-800">
      <h1 className="text-4xl font-bold text-hot-pink mb-8">Shipping & Delivery Policy</h1>
      <div className="space-y-6 text-lg">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Processing Time</h2>
          <p>All orders are processed within 1 to 3 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Domestic Shipping Rates and Estimates</h2>
          <p>Shipping charges for your order will be calculated and displayed at checkout. Standard delivery times range from 3 to 7 business days depending on your location within India.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. In-Store Pickup</h2>
          <p>You can skip the shipping fees with free local pickup at our store in Davanagere. After placing your order and selecting local pickup at checkout, your order will be prepared and ready for pick up within 1 to 2 business days. We will send you an email when your order is ready along with instructions.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Order Tracking</h2>
          <p>When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.</p>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicy;
