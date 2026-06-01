
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Gift,
  Heart,
  Package,
  Sparkles,
  Star,
  Truck,
  Users,
  Wand2,
} from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';
import HeroSection from '../components/HeroSection';
import FeatureBar from '../components/FeatureBar';
import AmoebaProductCard, { AmoebaProductCardSkeleton } from '../components/AmoebaProductCard';
import AmoebaOccasionCard from '../components/AmoebaOccasionCard';
import InstagramReelsSlider from '../components/InstagramReelsSlider';

const occasions = [
  { emoji: '🎂', name: 'Birthdays', slug: 'birthday-gifts', color: 'from-pink-400 to-rose-500', image: '/images/hero-return-gifts.png' },
  { emoji: '👶', name: 'Baby Hampers', slug: 'baby-hampers', color: 'from-purple-400 to-violet-500', image: '/images/hero-hamper-toys.png' },
  { emoji: '🎁', name: 'Return Gifts', slug: 'return-gifts', color: 'from-amber-400 to-orange-500', image: '/images/hero-return-gifts.png' },
  { emoji: '💍', name: 'Bridal / Wedding Gifting', slug: 'bridal-gifting', color: 'from-rose-300 to-pink-500', image: '/images/hero-dream-flower.png' },
  { emoji: '👩', name: "Mother's Day / Women's Gifting", slug: 'womens-gifting', color: 'from-fuchsia-400 to-purple-500', image: '/images/hero-dream-flower.png' },
  { emoji: '🏢', name: 'Corporate Gifting', slug: 'corporate-gifting', color: 'from-slate-500 to-slate-700', image: '/images/hero-summer-beach.png' },
  { emoji: '🎄', name: 'Festive Hampers', slug: 'festive-gifts', color: 'from-emerald-400 to-teal-500', image: '/images/hero-hamper-toys.png' },
  { emoji: '💖', name: 'Just Because', slug: 'just-because', color: 'from-pink-300 to-purple-400', image: '/images/hero-dream-flower.png' },
];

const budgets = [
  { label: 'Under ₹499', range: '0-499', color: 'bg-pink-50 border-pink-200 text-pink-700' },
  { label: '₹500–₹999', range: '500-999', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { label: '₹1000–₹1999', range: '1000-1999', color: 'bg-violet-50 border-violet-200 text-violet-700' },
  { label: '₹2000+', range: '2000+', color: 'bg-gradient-to-br from-purple-600 to-pink-500 border-transparent text-white' },
];

const bestsellers = [
  { name: 'Princess Return Gift Box', price: 499, discount_price: 299, is_sale: true, image: '/images/hero-return-gifts.png', slug: 'princess-return-gift-box' },
  { name: 'Rainy Explorer Kit', price: 599, discount_price: 449, is_sale: true, image: '/images/hero-hamper-toys.png', slug: 'rainy-explorer-kit' },
  { name: 'Luxury Spa Hamper', price: 1599, discount_price: 1299, is_sale: true, image: '/images/hero-dream-flower.png', slug: 'luxury-spa-hamper' },
  { name: 'Baby Welcome Box', price: 1099, discount_price: 899, is_sale: true, image: '/images/hero-hamper-toys.png', slug: 'baby-welcome-box' },
  { name: 'Stationery Dream Hamper', price: 799, discount_price: 599, is_sale: true, image: '/images/hero-dream-flower.png', slug: 'stationery-dream-hamper' },
  { name: 'Bride Tribe Box', price: 1899, discount_price: 1499, is_sale: true, image: '/images/hero-summer-beach.png', slug: 'bride-tribe-box' },
];

const differentiators = [
  'Premium curated gifting',
  'Personalisation available',
  'Bulk order friendly',
  'Fast Bangalore delivery',
  'Custom themes for birthdays',
  'Luxury packaging',
  'Thoughtfully sourced products',
];

const buildSteps = ['Choose Occasion', 'Choose Budget', 'Choose Theme', 'Add Personalisation', 'Submit Request'];

const buildOptions = {
  occasions: ['Birthday', 'Baby Shower', 'Wedding', 'Return Gifts', 'Corporate', 'Festive', 'Just Because'],
  budgets: ['Under ₹499', '₹500–₹999', '₹1000–₹1999', '₹2000+'],
  themes: ['Pastel Princess', 'Minimal Luxe', 'Cute & Colourful', 'Floral Dream', 'Custom Theme'],
};

const customerReviews = [
  { name: 'Ananya K.', location: 'Bangalore', review: 'The return gift boxes were a HUGE hit at my daughter\'s birthday! Every parent asked where I got them from 💕', type: 'WhatsApp' },
  { name: 'Rohit & Meera', location: 'Bangalore', review: 'Our bridal hampers looked straight out of Pinterest. Premium packaging, on-time delivery!', type: 'Instagram' },
  { name: 'Sneha P.', location: 'HSR Layout', review: 'Ordered 50 corporate gift bags — flawless execution. POPARTSDVG is now our go-to!', type: 'Photo Review' },
  { name: 'Divya M.', location: 'Indiranagar', review: 'Baby welcome box was so thoughtfully curated. The teddy, notebook, everything was perfect ✨', type: 'WhatsApp' },
];

const howItWorks = [
  { step: 1, title: 'Pick a hamper', desc: 'Browse by occasion or budget', icon: Gift },
  { step: 2, title: 'Customize if needed', desc: 'Add names, themes & personal touches', icon: Wand2 },
  { step: 3, title: 'We curate beautifully', desc: 'Hand-packed with premium packaging', icon: Package },
  { step: 4, title: 'Delivered with love', desc: 'Fast & safe delivery across Bangalore', icon: Truck },
];

const instagramPosts = [
  { type: 'image', src: '/images/1780126221238-927013708.jpg' },
  { type: 'image', src: '/images/1780126386214-771546619.jpg' },
  { type: 'image', src: '/images/1780136542317-873618929.jpg' },
  { type: 'image', src: '/images/1780136952180-552318272.jpeg' },
  { type: 'image', src: '/images/1780137034714-708195589.jpeg' },
  { type: 'image', src: '/images/my-hero-image.jpg.png' },
  { type: 'image', src: '/images/another-image.jpg.png' },
];

const SectionHeading = ({ eyebrow, title, subtitle }) => (
  <div className="mb-10 text-center md:mb-12">
    {eyebrow && (
      <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-[#8e44ad]">
        {eyebrow}
      </span>
    )}
    <h2 className="font-playfair text-3xl text-[#1b1842] md:text-4xl">{title}</h2>
    {subtitle && <p className="mx-auto mt-3 max-w-2xl text-[#5a5678]">{subtitle}</p>}
  </div>
);

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState(bestsellers);
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buildStep, setBuildStep] = useState(0);
  const [buildForm, setBuildForm] = useState({ occasion: '', budget: '', theme: '', personalisation: '' });
  const [conciergeForm, setConciergeForm] = useState({ name: '', phone: '', recipient: '', budget: '', message: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, reelsRes] = await Promise.all([
          api.get('/products?featured=true&limit=8'),
          api.get('/reels')
        ]);
        if (productsRes.data.products?.length > 0) {
          setFeaturedProducts(productsRes.data.products);
        }
        if (reelsRes.data?.length > 0) {
          setInstagramPosts(reelsRes.data);
        }
      } catch {
        /* use sample data */
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleBuildSubmit = (e) => {
    e.preventDefault();
    toast.success('Request submitted! Our team will curate your hamper within 24 hours.');
    setBuildStep(0);
    setBuildForm({ occasion: '', budget: '', theme: '', personalisation: '' });
  };

  const handleConciergeSubmit = (e) => {
    e.preventDefault();
    toast.success('Gift Concierge request received! We\'ll reach out shortly.');
    setConciergeForm({ name: '', phone: '', recipient: '', budget: '', message: '' });
  };

  const buildFieldKey = ['occasion', 'budget', 'theme', 'personalisation'][buildStep];
  const buildFieldOptions = [
    buildOptions.occasions,
    buildOptions.budgets,
    buildOptions.themes,
    null,
  ][buildStep];

  return (
    <div className="overflow-hidden">
      <HeroSection />
      <FeatureBar />

      {/* Section 2: Best Sellers */}
      <section id="bestsellers" className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Fan Favourites"
            title="Most Loved by Bangalore"
            subtitle="Our bestsellers — premium hampers customers can't stop ordering."
          />
          {loading ? (
            <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide md:justify-center">
              {[...Array(5)].map((_, i) => (
                <AmoebaProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide md:justify-center md:overflow-visible md:pb-0">
              {(featuredProducts.length ? featuredProducts : bestsellers).slice(0, 8).map((product, index) => (
                <AmoebaProductCard
                  key={product.slug || product.id || index}
                  product={product}
                  index={index}
                  className="w-64"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 3: Shop by Budget */}
      <section className="bg-gradient-to-b from-purple-50/50 to-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Budget Friendly"
            title="Shop by Budget"
            subtitle="Gifting shoppers think in budget — find the perfect hamper in your range."
          />
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

      {/* Section 4: Build Your Own Hamper */}
      <section id="build-hamper" className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Game Changer"
            title="Build Your Own Hamper"
            subtitle="People love customization — tell us what you want and we'll curate it beautifully."
          />

          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {buildSteps.map((step, index) => (
              <div
                key={step}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium sm:text-sm ${
                  index <= buildStep
                    ? 'bg-[#673ab7] text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {index < buildStep ? <Check className="h-3.5 w-3.5" /> : <span>{index + 1}</span>}
                <span className="hidden sm:inline">{step}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleBuildSubmit} className="rounded-3xl border border-purple-100 bg-white p-6 shadow-xl md:p-8">
            <h3 className="mb-4 text-lg font-semibold text-[#1b1842]">{buildSteps[buildStep]}</h3>

            {buildStep < 3 && buildFieldOptions && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {buildFieldOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setBuildForm({ ...buildForm, [buildFieldKey]: option });
                      setBuildStep(buildStep + 1);
                    }}
                    className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition hover:border-[#673ab7] hover:bg-purple-50 ${
                      buildForm[buildFieldKey] === option
                        ? 'border-[#673ab7] bg-purple-50 text-[#673ab7]'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {buildStep === 3 && (
              <div>
                <textarea
                  value={buildForm.personalisation}
                  onChange={(e) => setBuildForm({ ...buildForm, personalisation: e.target.value })}
                  placeholder="Names, messages, colour preferences, quantity..."
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#673ab7] focus:outline-none focus:ring-2 focus:ring-purple-100"
                />
                <button
                  type="button"
                  onClick={() => setBuildStep(4)}
                  className="mt-4 rounded-full bg-[#673ab7] px-8 py-3 text-sm font-semibold text-white hover:bg-[#5e35b1]"
                >
                  Continue
                </button>
              </div>
            )}

            {buildStep === 4 && (
              <div className="text-center">
                <div className="mb-6 rounded-xl bg-purple-50 p-4 text-left text-sm text-gray-700">
                  <p><strong>Occasion:</strong> {buildForm.occasion}</p>
                  <p><strong>Budget:</strong> {buildForm.budget}</p>
                  <p><strong>Theme:</strong> {buildForm.theme}</p>
                  <p><strong>Personalisation:</strong> {buildForm.personalisation || 'None'}</p>
                </div>
                <button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-[#673ab7] to-[#ec407a] px-10 py-4 font-semibold text-white shadow-lg hover:shadow-xl"
                >
                  Submit Request
                </button>
              </div>
            )}

            {buildStep > 0 && buildStep < 4 && (
              <button
                type="button"
                onClick={() => setBuildStep(buildStep - 1)}
                className="mt-4 text-sm text-gray-500 hover:text-[#673ab7]"
              >
                ← Back
              </button>
            )}
          </form>
        </div>
      </section>

      {/* Section 5: Real Orders & Customer Reactions */}
      <section className="bg-gradient-to-b from-purple-50/30 to-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="@popartsdvg"
            title="Real Orders & Customer Reactions"
            subtitle="Your visuals are our biggest selling asset — follow us for daily gifting inspo and reels!"
          />
          <InstagramReelsSlider posts={instagramPosts} />
          <div className="mt-10 text-center">
            <a
              href="https://www.instagram.com/popartsdvg?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 px-10 py-4 font-semibold text-white shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
            >
              <FaInstagram className="h-6 w-6" />
              Follow @popartsdvg on Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
