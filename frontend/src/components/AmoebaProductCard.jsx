import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { blobVariants } from './blobVariants';

const AmoebaProductCard = ({
  product,
  index = 0,
  animateOnView = true,
  className = '',
}) => {
  const blob = blobVariants[index % blobVariants.length];
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : (import.meta.env.PROD ? '' : 'http://localhost:5000');
  const image = product.primary_image 
    ? (product.primary_image.startsWith('http') ? product.primary_image : API_BASE_URL + product.primary_image) 
    : product.image 
    ? (product.image.startsWith('http') ? product.image : API_BASE_URL + product.image)
    : (product.images && product.images.length > 0)
    ? (product.images[0].image_url.startsWith('http') ? product.images[0].image_url : API_BASE_URL + product.images[0].image_url)
    : 'https://placehold.co/400?text=No+Image';

  const slug = product.slug;
  const price = product.discount_price || product.price;
  const hasDiscount = product.discount_price && Number(product.discount_price) < Number(product.price);
  const isSoldOut = product.is_sold_out;
  const showSale = !isSoldOut && (product.is_sale || hasDiscount);

  const discountPercent = hasDiscount ? Math.round(((product.price - product.discount_price) / product.price) * 100) : 0;



  // Entrance animations based on viewport visibility
  const entranceProps = animateOnView
    ? {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-40px' },
        transition: { duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] },
      }
    : {};

  // Framer motion variants to trigger animations on hover
  const glowVariants = {
    rest: { 
      scale: 1, 
      opacity: 0.3,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    hover: { 
      scale: [1, 1.04, 1],
      opacity: 1,
      transition: { 
        scale: {
          repeat: Infinity, 
          duration: 3.5, 
          ease: 'easeInOut' 
        },
        opacity: { duration: 0.3 }
      }
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product.id, 1);
      toast.success('Added to cart!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add to cart');
    }
  };

  return (
    <motion.div 
      {...entranceProps}
      whileHover="hover"
      className={`group flex-shrink-0 ${className}`}
    >
      <div className="relative mx-auto w-full max-w-[260px]">
        {/* Amoeba glow - animates ONLY on hover */}
        <motion.div
          variants={glowVariants}
          initial="rest"
          className={`absolute -inset-3 bg-gradient-to-br from-purple-200/80 via-pink-100/70 to-violet-200/60 blur-md ${blob.glow} ${blob.rotate} transition-transform duration-700 ${blob.hoverRotate}`}
        />

        {/* Amoeba frame */}
        <div
          className={`relative overflow-hidden bg-white p-3 shadow-lg transition-all duration-500 ${blob.frame} ${blob.rotate} group-hover:shadow-xl group-hover:shadow-purple-200/50 ${blob.hoverRotate}`}
        >
          <Link to={`/product/${slug}`} className="relative block">
            {/* Rectangular inner image container to make product fully visible */}
            <div className="relative overflow-hidden rounded-xl bg-gray-50 aspect-square flex items-center justify-center">
              <img 
                src={image} 
                alt={product.name || 'Product Image'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {isSoldOut ? (
              <span className="absolute left-3 top-3 z-10 rounded-full bg-gray-800/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                Sold out
              </span>
            ) : hasDiscount ? (
              <span className="absolute left-3 top-3 z-10 rounded-full bg-[#ec407a] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                -{discountPercent}%
              </span>
            ) : (
              <span className="absolute left-3 top-3 z-10 rounded-full bg-[#ab47bc] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                NEW
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="mt-5 text-left px-2 max-w-[260px] mx-auto">
        <Link to={`/product/${slug}`}>
          <h3 className="line-clamp-1 text-sm font-semibold text-[#1b1842] hover:text-[#ec407a] transition-colors md:text-[15px]">
            {product.name}
          </h3>
        </Link>



        {/* Prices row */}
        <div className="mt-1 flex items-baseline gap-2">
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">₹{Number(product.price).toFixed(2)}</span>
          )}
          <span className="text-sm font-bold text-gray-900 md:text-base">₹{Number(price).toFixed(2)}</span>
        </div>

        {/* Add to Cart Actions */}
        <div className="mt-3 flex items-center gap-2">
          <button
            disabled={isSoldOut}
            onClick={handleAddToCart}
            className={`flex-1 font-semibold py-2 px-3 rounded-lg text-[13px] transition duration-200 ${
              isSoldOut
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#ec407a] hover:bg-[#d81b60] text-white shadow-sm hover:shadow'
            }`}
          >
            {isSoldOut ? 'Sold Out' : 'Add to Cart'}
          </button>
          <button
            disabled={isSoldOut}
            onClick={handleAddToCart}
            className={`p-2 border rounded-lg transition duration-200 ${
              isSoldOut
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-[#ec407a] text-[#ec407a] hover:bg-pink-50'
            }`}
            aria-label="Quick Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const AmoebaProductCardSkeleton = () => (
  <div className="mx-auto w-full max-w-[260px] animate-pulse">
    <div className="h-56 rounded-[45%_55%_60%_40%/50%_50%_50%_50%] bg-gradient-to-br from-purple-100 to-pink-100" />
    <div className="mx-auto mt-5 h-4 w-3/4 rounded bg-gray-200" />
    <div className="mx-auto mt-2 h-5 w-1/3 rounded bg-gray-200" />
  </div>
);

export default AmoebaProductCard;
