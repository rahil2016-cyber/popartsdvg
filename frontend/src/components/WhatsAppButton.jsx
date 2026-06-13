import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const phoneNumber = '918408995588';
  const message = "Hi PopArts, I'm interested in this product.";
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-[0_4px_14px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-110 group cursor-pointer"
      aria-label="Chat on WhatsApp"
    >
      {/* Pulsing ring background */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping -z-10 group-hover:animate-none"></span>
      
      {/* WhatsApp Icon */}
      <FaWhatsapp className="w-8 h-8 transition-transform duration-300 group-hover:rotate-12" />

      {/* Hover Tooltip */}
      <div className="absolute right-16 bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        Chat with us!
      </div>
    </a>
  );
};

export default WhatsAppButton;
