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
  Wand2
} from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import api from '../services/api';
import HeroSection from '../components/HeroSection';
import AmoebaProductCard, { AmoebaProductCardSkeleton } from '../components/AmoebaProductCard';
import InstagramReelsSlider from '../components/InstagramReelsSlider';

const occasions = [
  { icon: Cake, name: 'Birthday Gifts', slug: 'birthday-gifts', bgColor: 'bg-rose-50', iconColor: 'text-[#ec407a]', hoverBg: 'hover:bg-rose-100/70' },
  { icon: Gift, name: 'Return Gifts', slug: 'return-gifts', bgColor: 'bg-purple-50', iconColor: 'text-[#ab47bc]', hoverBg: 'hover:bg-purple-100/70' },
  { icon: Baby, name: 'Baby Hampers', slug: 'baby-hampers', bgColor: 'bg-green-50', iconColor: 'text-[#2e7d32]', hoverBg: 'hover:bg-green-100/70' },
  { icon: Heart, name: 'Bridal Gifting', slug: 'bridal-gifting', bgColor: 'bg-pink-50', iconColor: 'text-[#f43f5e]', hoverBg: 'hover:bg-pink-100/70' },
  { icon: Sparkles, name: 'Festive Gifts', slug: 'festive-gifts', bgColor: 'bg-amber-50', iconColor: 'text-[#d97706]', hoverBg: 'hover:bg-amber-100/70' },
  { icon: Briefcase, name: 'Corporate Gifting', slug: 'corporate-gifting', bgColor: 'bg-indigo-50', iconColor: 'text-[#1565c0]', hoverBg: 'hover:bg-indigo-100/70' },
  { icon: Crown, name: 'Premium Hampers', slug: 'premium-hampers', bgColor: 'bg-yellow-50', iconColor: 'text-[#b45309]', hoverBg: 'hover:bg-yellow-100/70' },
  { icon: Wand2, name: 'Personalised Gifts', slug: 'personalised-gifts', bgColor: 'bg-fuchsia-50', iconColor: 'text-[#d946ef]', hoverBg: 'hover:bg-fuchsia-100/70' },
];

const budgets = [
  { label: 'Under ₹499', range: '0-499', color: 'bg-pink-50 border-pink-200 text-pink-700' },
  { label: '₹500–₹999', range: '500-999', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { label: '₹1000–₹1999', range: '1000-1999', color: 'bg-violet-50 border-violet-200 text-violet-700' },
  { label: '₹2000+', range: '2000+', color: 'bg-gradient-to-br from-purple-600 to-pink-500 border-transparent text-white' },
];

const hamperCollections = [
  { 
    title: 'Birthday Special Hampers', 
    desc: 'Make birthdays extra special', 
    link: '/products?category=birthday-gifts', 
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
    title: 'Baby Hampers', 
    desc: 'Adorable gifts for little ones', 
    link: '/products?category=baby-hampers', 
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

      {/* Section 4.2: Shop by Budget */}
      <section className="bg-gradient-to-b from-purple-50/50 to-white py-16 md:py-20 border-b border-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-[#ec407a]">
              Budget Friendly
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1b1842]">Shop by Budget</h2>
            <p className="text-sm text-gray-500 mt-2">
              Gifting shoppers think in budget — find the perfect hamper in your range.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {budgets.map((budget, index) => (
              <motion.div
                key={budget.range}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Link
                  to={`/products?budget=${budget.range}`}
                  className={`flex h-32 flex-col items-center justify-center rounded-2xl border-2 p-6 text-center transition hover:-translate-y-1 hover:shadow-lg md:h-40 ${budget.color}`}
                >
                  <span className="text-lg font-bold md:text-xl">{budget.label}</span>
                  <span className="mt-2 flex items-center gap-1 text-sm opacity-80">
                    Shop now <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4.3: Build Your Own Hamper CTA */}
      <section id="build-hamper" className="py-16 md:py-20 relative">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-br from-[#1b1842] to-[#2d2866] rounded-[2.5rem] p-8 md:p-14 text-center shadow-2xl relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-pink-300">
              Game Changer
            </span>
            <h2 className="font-playfair text-4xl md:text-5xl text-white mb-6">Design the Perfect Gift</h2>
            <p className="mx-auto max-w-2xl text-purple-100 text-lg mb-10">
              People love customization! Build a personalized hamper step-by-step. Choose a premium box, add their favorite items, pick a greeting card, and we'll curate it beautifully.
            </p>
            
            <Link
              to="/build-hamper"
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 px-10 py-5 text-lg font-bold text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              <Gift className="w-6 h-6" />
              Build Your Own Hamper Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
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
