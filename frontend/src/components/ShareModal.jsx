import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const ShareModal = ({ isOpen, onClose, product }) => {
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const shareUrl = `${window.location.origin}/product/${product.slug || product.id}`;
  const shareTitle = product.name;
  const shareText = `Check out this amazing product: ${product.name}!`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      toast.error('Failed to copy link');
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      color: 'bg-[#25D366] hover:bg-[#20ba59]',
      icon: (
        <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966C16.59 1.975 14.113.95 11.483.95c-5.45 0-9.88 4.37-9.884 9.8.001 1.77.476 3.5 1.376 5.007l-.994 3.63 3.733-.969c1.554.84 3.195 1.282 4.887 1.282zm10.03-7.574c-.269-.134-1.593-.778-1.84-.866-.246-.088-.426-.132-.606.134-.18.267-.696.866-.853 1.045-.157.179-.314.202-.583.067-.27-.134-1.137-.414-2.167-1.321-.803-.709-1.346-1.586-1.503-1.854-.157-.269-.017-.414.118-.549.121-.12.269-.314.403-.472.135-.157.179-.269.269-.449.09-.179.045-.337-.022-.472-.068-.134-.606-1.437-.83-1.97-.218-.522-.459-.45-.63-.45-.164-.002-.353-.002-.542-.002-.19 0-.5.07-.763.353-.263.285-1.006.968-1.006 2.361 0 1.393 1.03 2.74 1.17 2.92.143.18 2.025 3.05 4.898 4.27 2.73 1.16 2.73.772 3.227.724.497-.048 1.594-.64 1.816-1.258.224-.617.224-1.143.157-1.258-.067-.113-.247-.18-.517-.314z" />
        </svg>
      )
    },
    {
      name: 'Telegram',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      color: 'bg-[#0088cc] hover:bg-[#0077b3]',
      icon: (
        <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.6 1.5-1.58 2.77-3 2.87-3.4-.04-.04-.08-.06-.13-.06s-.12.02-.21.08c-.13.08-1.69 1.1-4.79 3.18-.45.3-.87.45-1.25.44-.42-.01-1.22-.24-1.82-.44-.73-.24-1.3-.37-1.25-.78.03-.22.33-.44.9-.68 3.52-1.53 5.86-2.54 7.03-3.03 3.35-1.4 4.04-1.64 4.5-.15z" />
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-[#1877F2] hover:bg-[#166fe5]',
      icon: (
        <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    },
    {
      name: 'Twitter / X',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      color: 'bg-[#1DA1F2] hover:bg-[#1a90da]',
      icon: (
        <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative z-10 w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 border border-gray-100 focus:outline-none overflow-hidden max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 mb-5">
              <h3 className="text-xl font-bold text-gray-800 font-playfair">Share Product</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Close share panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Card Inside Modal */}
            <div className="flex items-center gap-4 p-3 bg-pink-50/50 rounded-2xl border border-pink-100/50 mb-6">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-gray-100">
                <img
                  src={
                    product.primary_image ||
                    (product.images && product.images[0]?.image_url) ||
                    'https://placehold.co/100?text=Product'
                  }
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-gray-900 text-sm truncate">{product.name}</p>
                <p className="text-xs text-purple-600 font-medium">{product.category_name || 'Product'}</p>
                <p className="font-bold text-gray-800 text-sm mt-0.5">
                  ₹{product.discount_price || product.price}
                </p>
              </div>
            </div>

            {/* Share Grid */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {shareOptions.map((option) => (
                <a
                  key={option.name}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 ${option.color}`}>
                    {option.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                    {option.name}
                  </span>
                </a>
              ))}
            </div>

            {/* Copy Link Input */}
            <div className="bg-gray-50 rounded-xl p-2 border border-gray-100 flex items-center justify-between gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="bg-transparent text-xs text-gray-500 font-mono px-2 outline-none w-full truncate cursor-default"
                onClick={(e) => e.target.select()}
              />
              <button
                onClick={handleCopyLink}
                className={`shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all duration-300 ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-gradient-to-r from-hot-pink to-royal-purple hover:opacity-95 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
