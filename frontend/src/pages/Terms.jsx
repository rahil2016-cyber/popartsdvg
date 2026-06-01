import React from 'react';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-gray-800">
      <h1 className="text-4xl font-bold text-hot-pink mb-8">Terms & Conditions</h1>
      <div className="space-y-6 text-lg">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. General</h2>
          <p>By accessing and placing an order with POPARTS DVG, you confirm that you are in agreement with and bound by the terms of service contained in the Terms & Conditions outlined below.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Products and Pricing</h2>
          <p>All prices are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Accuracy of Billing and Account Information</h2>
          <p>We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Governing Law</h2>
          <p>These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India.</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
