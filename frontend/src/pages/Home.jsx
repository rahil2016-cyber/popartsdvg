import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Heart,
  Gift,
  Truck,
  RotateCcw,
  Mail,
  ArrowRight
} from 'lucide-react';
import { FaInstagram, FaFacebookF, FaYoutube, FaPinterestP } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';
import HeroSection from '../components/HeroSection';
import AmoebaProductCard, { AmoebaProductCardSkeleton } from '../components/AmoebaProductCard';

const occasions = [
  { emoji: '🎂', name: 'Birthday Gifts', slug: 'birthday-gifts', bgColor: 'bg-[#fff0f3]', hoverBg: 'hover:bg-[#ffe4e6]' },
  { emoji: '🎁', name: 'Return Gifts', slug: 'return-gifts', bgColor: 'bg-[#f3e8ff]', hoverBg: 'hover:bg-[#fae8ff]' },
  { emoji: '👶', name: 'Baby Hampers', slug: 'baby-hampers', bgColor: 'bg-[#e8f5e9]', hoverBg: 'hover:bg-[#e8f5e9]/80' },
  { emoji: '🎒', name: 'School Essentials', slug: 'school-essentials', bgColor: 'bg-[#e3f2fd]', hoverBg: 'hover:bg-[#e3f2fd]/80' },
  { emoji: '🍱', name: 'Lunch Boxes', slug: 'lunch-boxes', bgColor: 'bg-[#fae8ff]', hoverBg: 'hover:bg-[#fae8ff]/80' },
  { emoji: '🍼', name: 'Water Bottles', slug: 'water-bottles', bgColor: 'bg-[#fffbeb]', hoverBg: 'hover:bg-[#fffbeb]/80' },
  { emoji: '✏️', name: 'Stationery', slug: 'stationery', bgColor: 'bg-[#ffe4e6]', hoverBg: 'hover:bg-[#ffe4e6]/80' },
  { emoji: '⭐', name: 'Personalized Gifts', slug: 'personalised-gifts', bgColor: 'bg-[#fdf4ff]', hoverBg: 'hover:bg-[#fdf4ff]/80' },
];

const hamperCollections = [
  { 
    title: 'Birthday Special Hampers', 
    desc: 'Make birthdays extra special', 
    link: '/products?category=birthday-gifts', 
    gradient: 'from-[#fff0f3] to-[#ffe4e6]', 
    image: '/images/hero-return-gifts.png' 
  },
  { 
    title: 'Return Gift Hampers', 
    desc: 'Perfect for parties & celebrations', 
    link: '/products?category=return-gifts', 
    gradient: 'from-[#fffbeb] to-[#fef3c7]', 
    image: '/images/hero-hamper-toys.png' 
  },
  { 
    title: 'Baby Hampers', 
    desc: 'Adorable gifts for little ones', 
    link: '/products?category=baby-hampers', 
    gradient: 'from-[#ffe4e6] to-[#fecdd3]', 
    image: '/images/hero-dream-flower.png' 
  },
  { 
    title: 'Custom Hampers', 
    desc: 'Personalize it your way', 
    link: '/build-hamper', 
    gradient: 'from-[#e0f2fe] to-[#bae6fd]', 
    image: '/images/hero-summer-beach.png' 
  },
];

const trustBadges = [
  { icon: ShieldCheck, title: 'Premium Quality', desc: 'Carefully selected safe & durable products', color: 'bg-purple-50 text-[#ab47bc]' },
  { icon: Heart, title: 'Safe for Kids', desc: 'Non-toxic, child safe & BPA free', color: 'bg-green-50 text-[#2e7d32]' },
  { icon: Gift, title: 'Unique Designs', desc: 'Fun, colorful & trendy designs', color: 'bg-pink-50 text-[#ec407a]' },
  { icon: Truck, title: 'Fast & Reliable', desc: 'Quick delivery at your doorstep', color: 'bg-blue-50 text-[#1565c0]' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '7 days hassle free returns', color: 'bg-amber-50 text-[#d97706]' },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featuredRes, latestRes] = await Promise.all([
          api.get('/products?featured=true&limit=8'),
          api.get('/products?limit=8')
        ]);
        if (featuredRes.data.products?.length > 0) {
          setFeaturedProducts(featuredRes.data.products);
        }
        if (latestRes.data.products?.length > 0) {
          setNewArrivals(latestRes.data.products);
        }
      } catch (error) {
        console.error('Failed to load products for homepage:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const scrollTrack = (id, direction) => {
    const track = document.getElementById(id);
    if (track) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success('Thank you for subscribing to PopArts newsletter!');
    setEmail('');
  };

  return (
    <div className="overflow-hidden bg-white">
      {/* Hero section kept completely untouched */}
      <HeroSection />

      {/* Section 1: Shop by Occasion */}
      <section className="py-10 md:py-14 bg-white border-b border-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-[#1b1842] flex items-center gap-2">
              🎁 Shop by Occasion
            </h2>
            <Link to="/products" className="text-xs md:text-sm font-semibold text-[#ec407a] hover:text-[#d81b60] flex items-center gap-1">
              View All Categories <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative group">
            <button
              onClick={() => scrollTrack('categories-track', 'left')}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-100 rounded-full shadow-md flex items-center justify-center text-[#ec407a] hover:bg-pink-50 hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div
              id="categories-track"
              className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x scroll-smooth"
            >
              {occasions.map((occ) => (
                <Link
                  key={occ.name}
                  to={`/products?category=${occ.slug}`}
                  className="w-[100px] md:w-[120px] shrink-0 snap-center flex flex-col items-center text-center group/item"
                >
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${occ.bgColor} ${occ.hoverBg} flex items-center justify-center shadow-sm group-hover/item:shadow-md transition-all duration-300 transform group-hover/item:-translate-y-1`}>
                    <span className="text-2xl md:text-3xl">{occ.emoji}</span>
                  </div>
                  <span className="mt-3 text-[11px] md:text-xs font-semibold text-[#1b1842] group-hover/item:text-[#ec407a] transition-colors leading-tight">
                    {occ.name}
                  </span>
                </Link>
              ))}
            </div>

            <button
              onClick={() => scrollTrack('categories-track', 'right')}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-100 rounded-full shadow-md flex items-center justify-center text-[#ec407a] hover:bg-pink-50 hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Best Sellers */}
      <section className="py-10 md:py-14 bg-white border-b border-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-[#1b1842] flex items-center gap-2">
              ⭐ Best Sellers
            </h2>
            <Link to="/products?featured=true" className="text-xs md:text-sm font-semibold text-[#ec407a] hover:text-[#d81b60] flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-[180px] md:w-[240px] shrink-0">
                  <AmoebaProductCardSkeleton />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative group">
              <button
                onClick={() => scrollTrack('bestsellers-track', 'left')}
                className="absolute -left-4 top-[40%] -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-100 rounded-full shadow-md flex items-center justify-center text-[#ec407a] hover:bg-pink-50 hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div
                id="bestsellers-track"
                className="flex gap-4 md:gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x scroll-smooth"
              >
                {featuredProducts.map((product, index) => (
                  <AmoebaProductCard
                    key={product.slug || product.id || index}
                    product={product}
                    index={index}
                    className="w-[180px] md:w-[240px] shrink-0 snap-center"
                  />
                ))}
              </div>

              <button
                onClick={() => scrollTrack('bestsellers-track', 'right')}
                className="absolute -right-4 top-[40%] -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-100 rounded-full shadow-md flex items-center justify-center text-[#ec407a] hover:bg-pink-50 hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Section 3: Curated Hamper Collections */}
      <section className="py-10 md:py-14 bg-white border-b border-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-[#1b1842] flex items-center gap-2">
              🎁 Curated Hamper Collections
            </h2>
            <Link to="/products?category=premium-hampers" className="text-xs md:text-sm font-semibold text-[#ec407a] hover:text-[#d81b60] flex items-center gap-1">
              View All Hampers <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hamperCollections.map((col) => (
              <div
                key={col.title}
                className={`group relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${col.gradient} h-44 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300`}
              >
                <div className="w-[60%] z-10 flex flex-col justify-between h-full">
                  <div>
                    <h4 className="text-sm md:text-base font-bold text-[#1b1842] leading-snug">{col.title}</h4>
                    <p className="text-[10px] md:text-[11px] text-gray-500 mt-1 leading-snug">{col.desc}</p>
                  </div>
                  <Link
                    to={col.link}
                    className="inline-flex self-start bg-[#ec407a] hover:bg-[#d81b60] text-white text-[11px] font-bold px-4 py-1.5 rounded-full transition-colors mt-2"
                  >
                    Explore
                  </Link>
                </div>
                <div className="absolute right-[-12px] bottom-[-12px] w-[50%] h-[85%] flex items-end justify-end overflow-hidden">
                  <img
                    src={col.image}
                    alt={col.title}
                    className="max-w-[125%] max-h-[125%] object-contain transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: New Arrivals */}
      <section className="py-10 md:py-14 bg-white border-b border-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-[#1b1842] flex items-center gap-2">
              ✨ New Arrivals
            </h2>
            <Link to="/products?sort=newest" className="text-xs md:text-sm font-semibold text-[#ec407a] hover:text-[#d81b60] flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-[180px] md:w-[240px] shrink-0">
                  <AmoebaProductCardSkeleton />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative group">
              <button
                onClick={() => scrollTrack('newarrivals-track', 'left')}
                className="absolute -left-4 top-[40%] -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-100 rounded-full shadow-md flex items-center justify-center text-[#ec407a] hover:bg-pink-50 hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div
                id="newarrivals-track"
                className="flex gap-4 md:gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x scroll-smooth"
              >
                {newArrivals.map((product, index) => (
                  <AmoebaProductCard
                    key={product.slug || product.id || index}
                    product={product}
                    index={index}
                    className="w-[180px] md:w-[240px] shrink-0 snap-center"
                  />
                ))}
              </div>

              <button
                onClick={() => scrollTrack('newarrivals-track', 'right')}
                className="absolute -right-4 top-[40%] -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-100 rounded-full shadow-md flex items-center justify-center text-[#ec407a] hover:bg-pink-50 hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Section 5: Why Parents Love PopArts */}
      <section className="py-10 md:py-16 bg-[#fafafa]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg md:text-xl font-bold text-center text-[#1b1842] mb-10 flex items-center justify-center gap-2">
            Why Parents Love PopArts <Heart className="w-4 h-4 text-[#ec407a] fill-[#ec407a]" />
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {trustBadges.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-full ${b.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h5 className="text-xs md:text-sm font-bold text-[#1b1842] leading-tight">{b.title}</h5>
                  <p className="text-[9px] md:text-[10px] text-gray-500 mt-2 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 6: Stay Updated Banner */}
      <section className="py-10 md:py-14 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#ffeef0] via-[#fae8ff] to-[#f3e8ff] rounded-3xl p-6 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-full bg-[#ec407a] flex items-center justify-center text-white shrink-0 shadow-md">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-base md:text-lg font-bold text-[#1b1842]">Stay Updated with PopArts</h4>
                <p className="text-[11px] md:text-xs text-gray-500 mt-0.5">Get special offers, new arrivals and gifting ideas.</p>
              </div>
            </div>
            
            <form onSubmit={handleSubscribe} className="flex w-full lg:w-auto flex-1 max-w-md bg-white rounded-full p-1 border border-pink-100 shadow-sm">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent px-4 py-2 text-xs focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#ec407a] hover:bg-[#d81b60] text-white font-bold text-xs px-6 py-2.5 rounded-full transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#1b1842]">Follow Us</span>
              <div className="flex gap-2">
                <a href="https://www.instagram.com/popartsdvg" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#ec407a] hover:bg-[#d81b60] text-white flex items-center justify-center transition-colors">
                  <FaInstagram className="w-4 h-4" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#ec407a] hover:bg-[#d81b60] text-white flex items-center justify-center transition-colors">
                  <FaFacebookF className="w-4 h-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#ec407a] hover:bg-[#d81b60] text-white flex items-center justify-center transition-colors">
                  <FaYoutube className="w-4 h-4" />
                </a>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#ec407a] hover:bg-[#d81b60] text-white flex items-center justify-center transition-colors">
                  <FaPinterestP className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
