import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-gray-800">
      <h1 className="text-4xl font-bold text-hot-pink mb-8">Cancellation & Refund Policy</h1>
      <div className="space-y-6 text-lg">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Cancellation Policy</h2>
          <p>Orders can only be cancelled before they have been processed or shipped. Since many of our products are personalized or made-to-order, cancellations may not be possible once production has begun. Please contact us immediately if you need to cancel an order.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Refund & Exchange Policy</h2>
          <p>We strive to deliver the best quality products. Due to the personalized nature of our items, <strong>we strictly do not accept returns, and we do not offer any exchanges or refunds</strong> unless the item arrives severely damaged or defective.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Damaged or Defective Items</h2>
          <p>If you receive a damaged or defective item, please contact us within 48 hours of delivery with photographic evidence. We will arrange for a replacement or a refund to the original method of payment.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Processing Time</h2>
          <p>Approved refunds will be processed and credited to your original method of payment within 5-7 business days.</p>
        </section>
      </div>
    </div>
  );
};

export default RefundPolicy;
