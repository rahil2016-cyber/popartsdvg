import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Gift,
  ArrowRight,
  Cake,
  Baby,
  Heart,
  Sparkles,
  Briefcase,
  Crown,
  Wand2,
  ShoppingBag,
  Star,
  Package,
  Mail
} from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import api from '../services/api';
import HeroSection from '../components/HeroSection';
import AmoebaProductCard, { AmoebaProductCardSkeleton } from '../components/AmoebaProductCard';
import InstagramReelsSlider from '../components/InstagramReelsSlider';

const occasions = [
  { icon: Cake, name: 'Birthday Gifting', slug: 'birthday-gifting', bgColor: 'bg-rose-50', iconColor: 'text-[#ec407a]', hoverBg: 'hover:bg-rose-100/70' },
  { icon: Gift, name: 'Return Gifts', slug: 'return-gifts', bgColor: 'bg-purple-50', iconColor: 'text-[#ab47bc]', hoverBg: 'hover:bg-purple-100/70' },
  { icon: Wand2, name: 'Theme Based Gifting', slug: 'theme-based-gifting', bgColor: 'bg-pink-50', iconColor: 'text-[#f43f5e]', hoverBg: 'hover:bg-pink-100/70' },
  { icon: Baby, name: 'Traditional & Baby Arrival Hampers', slug: 'traditional-baby-arrival-hampers', bgColor: 'bg-green-50', iconColor: 'text-[#2e7d32]', hoverBg: 'hover:bg-green-100/70' },
  { icon: Sparkles, name: 'Festive Gifting', slug: 'festive-gifting', bgColor: 'bg-amber-50', iconColor: 'text-[#d97706]', hoverBg: 'hover:bg-amber-100/70' },
  { icon: Briefcase, name: 'Corporate Gifting', slug: 'corporate-gifting', bgColor: 'bg-indigo-50', iconColor: 'text-[#1565c0]', hoverBg: 'hover:bg-indigo-100/70' },
  { icon: Crown, name: 'Premium Hampers', slug: 'premium-hampers', bgColor: 'bg-yellow-50', iconColor: 'text-[#b45309]', hoverBg: 'hover:bg-yellow-100/70' },
  { icon: Heart, name: 'Personalised Gifts', slug: 'personalised-gifts', bgColor: 'bg-fuchsia-50', iconColor: 'text-[#d946ef]', hoverBg: 'hover:bg-fuchsia-100/70' },
];

const budgets = [
  {
    label: 'Under ₹499',
    range: '0-499',
    desc: 'Cute & affordable gifts for everyone',
    gradient: 'from-[#fff1f2] to-[#ffe4e6]',
    image: '/images/budget-under-499.png',
    icon: Gift,
    iconColor: 'text-[#ec407a]',
    iconBg: 'bg-pink-100/50'
  },
  {
    label: '₹500–₹999',
    range: '500-999',
    desc: 'Most popular gifting range',
    gradient: 'from-[#faf5ff] to-[#f3e8ff]',
    image: '/images/budget-500-999.png',
    icon: ShoppingBag,
    iconColor: 'text-[#ab47bc]',
    iconBg: 'bg-purple-100/50'
  },
  {
    label: '₹1000–₹1999',
    range: '1000-1999',
    desc: 'Perfect for birthdays & special moments',
    gradient: 'from-[#fffbeb] to-[#fef3c7]',
    image: '/images/budget-1000-1999.png',
    icon: Star,
    iconColor: 'text-[#d97706]',
    iconBg: 'bg-amber-100/50'
  },
  {
    label: '₹2000+',
    range: '2000+',
    desc: 'Premium hampers for unforgettable celebrations',
    gradient: 'from-[#fff1f2] to-[#ffe4e6]',
    image: '/images/budget-2000-above.png',
    icon: Crown,
    iconColor: 'text-[#ec407a]',
    iconBg: 'bg-rose-100/50'
  },
];

const hamperCollections = [
  { 
    title: 'Birthday Special Hampers', 
    desc: 'Make birthdays extra special', 
    link: '/products?category=birthday-gifting', 
    gradient: 'from-[#fff0f3] to-[#ffe4e6]', 
    image: '/images/birthday-hamper.png' 
  },
  { 
    title: 'Return Gift Hampers', 
    desc: 'Perfect for parties & celebrations', 
    link: '/products?category=return-gifts', 
    gradient: 'from-[#fffbeb] to-[#fef3c7]', 
    image: '/images/return-gift-hamper.png' 
  },
  { 
    title: 'Traditional & Baby Arrival Hampers', 
    desc: 'Not just stationery', 
    link: '/products?category=traditional-baby-arrival-hampers', 
    gradient: 'from-[#ffe4e6] to-[#fecdd3]', 
    image: '/images/baby-hamper.png' 
  },
  { 
    title: 'Custom Hampers', 
    desc: 'Personalize it your way', 
    link: '/build-hamper', 
    gradient: 'from-[#e0f2fe] to-[#bae6fd]', 
    image: '/images/custom-hamper.png' 
  },
];



const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featuredRes, latestRes, reelsRes] = await Promise.all([
          api.get('/products?featured=true&limit=8'),
          api.get('/products?limit=8'),
          api.get('/reels')
        ]);
        if (featuredRes.data.products?.length > 0) {
          setFeaturedProducts(featuredRes.data.products);
        }
        if (latestRes.data.products?.length > 0) {
          setNewArrivals(latestRes.data.products);
        }
        if (reelsRes.data?.length > 0) {
          setInstagramPosts(reelsRes.data);
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
                    <occ.icon className={`w-7 h-7 md:w-9 md:h-9 ${occ.iconColor}`} />
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
      <section id="bestsellers" className="py-10 md:py-14 bg-white border-b border-gray-50">
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
                    loading="lazy"
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

      {/* Section 4.2: Shop by Budget */}
      <section className="bg-gradient-to-b from-purple-50/20 to-white py-16 md:py-20 border-b border-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#ec407a]">
              ✨ Budget Friendly ✨
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1b1842]">Shop by Budget</h2>
            <p className="text-sm text-gray-500 mt-2">
              Find the perfect hamper in your budget range.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {budgets.map((budget, index) => (
              <motion.div
                key={budget.range}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className={`group relative overflow-hidden rounded-[2rem] p-4 md:p-5 bg-gradient-to-br ${budget.gradient} h-36 md:h-44 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 border border-pink-50/30`}
              >
                <div className="flex flex-col justify-between h-full flex-1 min-w-0 pr-2">
                  <div>
                    {/* Circle icon */}
                    <div className={`w-8 h-8 rounded-full ${budget.iconBg} flex items-center justify-center`}>
                      <budget.icon className={`w-4 h-4 ${budget.iconColor}`} />
                    </div>
                    <h4 className="text-sm md:text-base font-extrabold text-[#1b1842] mt-2.5 leading-tight truncate">{budget.label}</h4>
                    <p className="text-[10px] md:text-xs text-gray-500 mt-1 leading-normal max-w-[130px] line-clamp-2">{budget.desc}</p>
                  </div>
                  <Link
                    to={`/products?budget=${budget.range}`}
                    className="inline-flex items-center gap-1 text-[#ec407a] hover:text-[#d81b60] text-[10px] md:text-xs font-bold transition-colors mt-2"
                  >
                    Shop now <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="w-[76px] h-[76px] md:w-[100px] md:h-[100px] rounded-2xl overflow-hidden shrink-0 shadow-sm relative bg-white border border-pink-50/20">
                  <img
                    src={budget.image}
                    alt={budget.label}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4.3: Build Your Own Hamper CTA */}
      <section id="build-hamper" className="py-16 md:py-20 relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-[#1b1842] rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10 text-left">
              {/* Left col */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-pink-300">
                  Game Changer
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                  Design the Perfect Gift
                </h2>
                <p className="text-purple-100 text-sm md:text-base leading-relaxed mb-8 max-w-sm">
                  Create a personalized hamper step-by-step. You choose, we curate it beautifully.
                </p>
                <Link
                  to="/build-hamper"
                  className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 px-8 py-4.5 text-base font-bold text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all self-start"
                >
                  <Gift className="w-5 h-5" />
                  Build Your Own Hamper
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {/* Center col: timeline */}
              <div className="lg:col-span-4 relative pl-4 lg:pl-6 flex flex-col gap-6 before:absolute before:left-[36px] before:top-2 before:bottom-2 before:w-[2px] before:border-l before:border-dashed before:border-pink-300/30">
                {/* Step 1 */}
                <div className="flex items-start gap-4 relative">
                  <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white shrink-0 shadow-md">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="text-pink-300">1.</span> Choose Your Box
                    </h4>
                    <p className="text-xs text-purple-200 mt-0.5 leading-normal max-w-[200px]">
                      Pick a premium box that fits the occasion.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4 relative">
                  <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white shrink-0 shadow-md">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="text-pink-300">2.</span> Add Your Favorites
                    </h4>
                    <p className="text-xs text-purple-200 mt-0.5 leading-normal max-w-[200px]">
                      Select fun and useful products they'll love.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4 relative">
                  <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white shrink-0 shadow-md">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="text-pink-300">3.</span> Add a Greeting Card
                    </h4>
                    <p className="text-xs text-purple-200 mt-0.5 leading-normal max-w-[200px]">
                      Personalize it with your special message.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-4 relative">
                  <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white shrink-0 shadow-md">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="text-pink-300">4.</span> We Pack Beautifully
                    </h4>
                    <p className="text-xs text-purple-200 mt-0.5 leading-normal max-w-[200px]">
                      We pack it with love and deliver happiness.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right col: Image */}
              <div className="lg:col-span-3 flex justify-center items-center z-10">
                <div className="relative rounded-[2rem] overflow-hidden max-w-[320px] lg:max-w-none w-full shadow-lg">
                  <img
                    src="/images/build-hamper-banner-right.png"
                    alt="Build Your Own Hamper"
                    className="w-full h-auto object-contain hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4.5: Real Orders & Customer Reactions (Instagram Reels) */}
      <section className="py-10 md:py-14 bg-white border-b border-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-[#ec407a]">
              @popartsdvg
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-[#1b1842]">
              Real Orders & Customer Reactions
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Your visuals are our biggest selling asset — follow us for daily gifting info and reels!
            </p>
          </div>
          <InstagramReelsSlider posts={instagramPosts} />
          <div className="mt-8 text-center">
            <a
              href="https://www.instagram.com/popartsdvg?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 px-8 py-3 text-xs font-bold text-white shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              <FaInstagram className="h-4 w-4" />
              Follow @popartsdvg on Instagram
            </a>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;
