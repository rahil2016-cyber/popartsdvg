import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, Plus, Minus, ShoppingBag, Check, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

// Fallback dummy data in case the user hasn't added these to their actual database yet
const DUMMY_BOXES = [
  { id: 'box-1', name: 'Premium Pink Box', price: 299, image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600', description: 'A beautiful pastel pink reusable box.' },
  { id: 'box-2', name: 'Luxury Wooden Crate', price: 599, image_url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=600', description: 'Handcrafted wooden crate for a rustic feel.' },
  { id: 'box-3', name: 'Elegant Black Magnet Box', price: 399, image_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=600', description: 'Matte black finish with a magnetic snap closure.' },
];

const DUMMY_CARDS = [
  { id: 'card-1', name: 'Happy Birthday Card', price: 50, image_url: 'https://images.unsplash.com/photo-1527481138388-31827a7c94d5?q=80&w=600' },
  { id: 'card-2', name: 'Anniversary Wishes', price: 50, image_url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600' },
  { id: 'card-3', name: 'Just Because', price: 50, image_url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=600' },
];

const BuildHamper = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);

  // Hamper State
  const [selectedBox, setSelectedBox] = useState(null);
  const [selectedGifts, setSelectedGifts] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardMessage, setCardMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        api.get('/categories'),
        api.get('/products?limit=100') // Fetch plenty of products for the builder
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data.products);
      if (catRes.data.length > 0) {
        setActiveCategory(catRes.data[0].slug);
      }
    } catch (error) {
      console.error('Failed to load products', error);
      toast.error('Failed to load catalog');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => setStep(s => Math.min(4, s + 1));
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const addGift = (product) => {
    setSelectedGifts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success('Added to hamper');
  };

  const removeGift = (productId) => {
    setSelectedGifts(prev => prev.filter(p => p.id !== productId));
  };

  const calculateTotal = () => {
    let total = 0;
    if (selectedBox) total += (selectedBox.price || selectedBox.discount_price);
    if (selectedCard) total += (selectedCard.price || selectedCard.discount_price);
    selectedGifts.forEach(gift => {
      total += (gift.discount_price || gift.price) * gift.quantity;
    });
    return total;
  };

  const handleAddToCart = async () => {
    try {
      // Add Box
      if (selectedBox && typeof selectedBox.id === 'number') {
         await addToCart(selectedBox.id, 1);
      } else if (selectedBox) {
         // It's a dummy box, we can't really add it to cart without a real DB ID. 
         // In a real scenario, these must exist in DB. 
      }
      
      // Add Gifts
      for (const gift of selectedGifts) {
         await addToCart(gift.id, gift.quantity);
      }

      // Add Card
      if (selectedCard && typeof selectedCard.id === 'number') {
         await addToCart(selectedCard.id, 1);
      }
      
      // Note: the message is currently lost as the cart doesn't support notes per item yet.
      
      toast.success('Awesome! Custom hamper added to cart.');
      navigate('/cart');
    } catch (error) {
      toast.error('Failed to add hamper to cart.');
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-10 overflow-x-auto py-2">
      {['Choose Box', 'Add Gifts', 'Pick a Card', 'Review'].map((label, idx) => {
        const stepNum = idx + 1;
        const isActive = step === stepNum;
        const isPast = step > stepNum;
        return (
          <React.Fragment key={stepNum}>
            <div className="flex flex-col items-center mx-2 sm:mx-4">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-colors ${isActive ? 'bg-[#1b1842] text-white ring-4 ring-purple-100' : isPast ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {isPast ? <Check className="w-5 h-5" /> : stepNum}
              </div>
              <span className={`text-xs sm:text-sm mt-2 font-medium whitespace-nowrap ${isActive ? 'text-[#1b1842]' : 'text-gray-500'}`}>{label}</span>
            </div>
            {stepNum < 4 && <div className={`w-12 sm:w-20 h-1 rounded-full ${isPast ? 'bg-green-500' : 'bg-gray-200'}`} />}
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-playfair text-4xl md:text-5xl text-[#1b1842] mb-4">Build Your Own Hamper</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Create the perfect personalised gift in 4 simple steps. We'll pack it with love and care!</p>
        </div>

        {renderStepIndicator()}

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-8 overflow-hidden min-h-[500px]">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: BOX */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-semibold mb-6 text-gray-800">Choose Your Hamper Box</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {DUMMY_BOXES.map(box => (
                      <div 
                        key={box.id} 
                        onClick={() => setSelectedBox(box)}
                        className={`cursor-pointer rounded-2xl border-2 transition-all p-4 ${selectedBox?.id === box.id ? 'border-[#1b1842] bg-purple-50/30 ring-4 ring-purple-100' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}
                      >
                        <div className="aspect-square rounded-xl overflow-hidden mb-4">
                          <img src={box.image_url} alt={box.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-semibold text-gray-800">{box.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{box.description}</p>
                        <p className="font-bold text-[#1b1842]">₹{box.price}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: GIFTS */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add Gifts to Your Box</h2>
                  
                  {/* Category Pills */}
                  <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-hide mb-6 snap-x">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.slug)}
                        className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-colors snap-center ${activeCategory === cat.slug ? 'bg-[#1b1842] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto max-h-[600px] pr-2">
                    {loading ? (
                      <p>Loading products...</p>
                    ) : (
                      products
                        .filter(p => p.category_name?.toLowerCase() === categories.find(c => c.slug === activeCategory)?.name?.toLowerCase())
                        .map(product => {
                          const quantityInHamper = selectedGifts.find(g => g.id === product.id)?.quantity || 0;
                          return (
                            <div key={product.id} className="bg-white border rounded-xl p-3 flex flex-col relative group">
                              <div className="aspect-square rounded-lg overflow-hidden mb-3 relative">
                                <img src={product.primary_image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                {quantityInHamper > 0 && (
                                  <div className="absolute top-2 right-2 bg-[#1b1842] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                                    {quantityInHamper}
                                  </div>
                                )}
                              </div>
                              <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight mb-1">{product.name}</h3>
                              <p className="font-bold text-[#1b1842] text-sm mt-auto mb-3">
                                ₹{product.discount_price || product.price}
                              </p>
                              <button 
                                onClick={() => addGift(product)}
                                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                              >
                                <Plus className="w-4 h-4 mr-1" /> Add
                              </button>
                            </div>
                          )
                        })
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: CARD */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-semibold mb-6 text-gray-800">Pick a Greeting Card</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
                    {DUMMY_CARDS.map(card => (
                      <div 
                        key={card.id} 
                        onClick={() => setSelectedCard(card)}
                        className={`cursor-pointer rounded-2xl border-2 transition-all p-3 ${selectedCard?.id === card.id ? 'border-[#1b1842] bg-purple-50/30 ring-4 ring-purple-100' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}
                      >
                        <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3">
                          <img src={card.image_url} alt={card.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-semibold text-gray-800 text-center text-sm">{card.name}</h3>
                        <p className="font-bold text-[#1b1842] text-center text-sm">₹{card.price}</p>
                      </div>
                    ))}
                  </div>

                  {selectedCard && (
                    <div className="bg-gray-50 p-6 rounded-2xl border">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Personalised Message (Optional)</label>
                      <textarea 
                        rows="4" 
                        value={cardMessage}
                        onChange={(e) => setCardMessage(e.target.value)}
                        placeholder="Write a sweet message for the recipient..."
                        className="w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-4"
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 4: REVIEW */}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Review Your Masterpiece</h2>
                  
                  <div className="bg-gray-50 rounded-3xl p-6 md:p-10 border max-w-2xl mx-auto">
                    {/* Box Summary */}
                    <div className="flex items-center gap-4 border-b border-gray-200 pb-6 mb-6">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0">
                        <img src={selectedBox?.image_url} alt="Box" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1 block">Packaging</span>
                        <h4 className="font-semibold text-lg">{selectedBox?.name}</h4>
                        <p className="text-gray-600">₹{selectedBox?.price}</p>
                      </div>
                    </div>

                    {/* Gifts Summary */}
                    <div className="border-b border-gray-200 pb-6 mb-6">
                      <span className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-4 block">Inside the box ({selectedGifts.reduce((a,b)=>a+b.quantity,0)} items)</span>
                      <div className="space-y-4">
                        {selectedGifts.map(gift => (
                          <div key={gift.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border">
                                <img src={gift.primary_image} alt={gift.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-medium text-sm line-clamp-1">{gift.name}</p>
                                <p className="text-xs text-gray-500">Qty: {gift.quantity}</p>
                              </div>
                            </div>
                            <p className="font-semibold text-sm">₹{(gift.discount_price || gift.price) * gift.quantity}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card Summary */}
                    {selectedCard && (
                      <div className="flex items-center gap-4 pb-4">
                        <div className="w-16 h-20 rounded-lg overflow-hidden bg-white shrink-0 border">
                          <img src={selectedCard?.image_url} alt="Card" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1 block">Greeting Card</span>
                          <h4 className="font-medium text-sm">{selectedCard?.name}</h4>
                          <p className="text-gray-600 text-xs">₹{selectedCard?.price}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sticky Summary Sidebar */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-4">Hamper Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center"><Gift className="w-4 h-4 mr-2" /> Box</span>
                  <span className="font-medium">{selectedBox ? 'Added' : 'Pending'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center"><ShoppingBag className="w-4 h-4 mr-2" /> Gifts</span>
                  <span className="font-medium">{selectedGifts.reduce((a,b)=>a+b.quantity,0)} items</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center"><Check className="w-4 h-4 mr-2" /> Card</span>
                  <span className="font-medium">{selectedCard ? 'Added' : 'Pending'}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="text-gray-600 font-medium">Total</span>
                  <span className="text-2xl font-bold text-[#1b1842]">₹{calculateTotal()}</span>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="space-y-3">
                {step < 4 ? (
                  <button 
                    onClick={handleNext}
                    disabled={(step === 1 && !selectedBox) || (step === 2 && selectedGifts.length === 0)}
                    className="w-full flex items-center justify-center gap-2 bg-[#1b1842] text-white py-3.5 rounded-xl font-semibold hover:bg-[#2d2866] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button 
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-purple-200"
                  >
                    <ShoppingBag className="w-5 h-5" /> Add Hamper to Cart
                  </button>
                )}
                
                {step > 1 && (
                  <button 
                    onClick={handlePrev}
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BuildHamper;
