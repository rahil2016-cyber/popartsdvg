import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-gray-800">
      <h1 className="text-4xl font-bold text-hot-pink mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-lg">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you make a purchase, create an account, or communicate with us. This may include your name, email address, phone number, shipping address, and payment information.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p>We use the information we collect to process transactions, deliver your orders, communicate with you about your orders, and improve our services.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Information Sharing</h2>
          <p>We do not share your personal information with third parties except as necessary to process payments (e.g., Cashfree Payment Gateway) or deliver orders (e.g., shipping carriers).</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
          <p>We implement reasonable security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at our email address or phone number listed on the Contact page.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
