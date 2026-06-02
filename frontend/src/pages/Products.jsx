
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, Check } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import AmoebaProductCard, { AmoebaProductCardSkeleton } from '../components/AmoebaProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const budgetParam = searchParams.get('budget') || '';

  const selectedCategories = categoryParam ? categoryParam.split(',') : [];
  const selectedBudgets = budgetParam ? budgetParam.split(',') : [];

  const toggleCategory = (slug) => {
    let newCats = [...selectedCategories];
    if (newCats.includes(slug)) {
      newCats = newCats.filter(c => c !== slug);
    } else {
      newCats.push(slug);
    }
    setSearchParams(prev => {
      if (newCats.length > 0) prev.set('category', newCats.join(','));
      else prev.delete('category');
      prev.set('page', '1');
      return prev;
    });
  };

  const clearCategories = () => {
    setSearchParams(prev => {
      prev.delete('category');
      prev.set('page', '1');
      return prev;
    });
  };

  const toggleBudget = (val) => {
    let newBudgets = [...selectedBudgets];
    if (newBudgets.includes(val)) {
      newBudgets = newBudgets.filter(b => b !== val);
    } else {
      newBudgets.push(val);
    }
    setSearchParams(prev => {
      if (newBudgets.length > 0) prev.set('budget', newBudgets.join(','));
      else prev.delete('budget');
      prev.set('page', '1');
      return prev;
    });
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [searchParams]);

  const loadCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage);
      if (searchQuery) params.set('search', searchQuery);
      if (categoryParam) params.set('category', categoryParam);
      
      // Handle budget ranges (comma separated)
      if (budgetParam) {
        params.set('budget', budgetParam);
      }

      const res = await api.get(`/products?${params}`);
      setProducts(res.data.products);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-x-hidden">
      <div className="mb-12">
        <h1 className="font-playfair text-4xl text-[#1b1842] mb-4">
          {searchQuery ? `Search: "${searchQuery}"` : 'Our Products'}
        </h1>
        <p className="text-gray-600">
          {total} {total === 1 ? 'product' : 'products'} found
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 overflow-hidden">
        <aside className="lg:w-64 flex-shrink-0 max-w-[100vw]">
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:sticky lg:top-24 max-w-full">
            
            <div className="mb-6 lg:mb-8">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Categories
              </h3>
              <div className="flex flex-row lg:flex-col overflow-x-auto gap-3 lg:gap-1 pb-2 lg:pb-0 scrollbar-hide snap-x whitespace-nowrap lg:whitespace-normal">
                <button
                  onClick={clearCategories}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#ec407a] transition-colors flex-shrink-0 text-left"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${selectedCategories.length === 0 ? 'bg-[#ec407a] border-[#ec407a] text-white' : 'border-gray-300 bg-white'}`}>
                    {selectedCategories.length === 0 && <Check className="w-3 h-3 stroke-[3px]" />}
                  </div>
                  <span>All Products</span>
                </button>
                {categories.map((category) => {
                  const isChecked = selectedCategories.includes(category.slug);
                  return (
                    <button
                      key={category.id}
                      onClick={() => toggleCategory(category.slug)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#ec407a] transition-colors flex-shrink-0 text-left"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${isChecked ? 'bg-[#ec407a] border-[#ec407a] text-white' : 'border-gray-300 bg-white'}`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3px]" />}
                      </div>
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Price Range</h3>
              <div className="flex flex-row lg:flex-col overflow-x-auto gap-3 lg:gap-1 pb-2 lg:pb-0 scrollbar-hide snap-x whitespace-nowrap lg:whitespace-normal">
                {[
                  { label: 'Under ₹499', value: '0-499' },
                  { label: '₹500 - ₹999', value: '500-999' },
                  { label: '₹1000 - ₹1999', value: '1000-1999' },
                  { label: '₹2000+', value: '2000+' }
                ].map((budget) => {
                  const isChecked = selectedBudgets.includes(budget.value);
                  return (
                    <button
                      key={budget.value}
                      onClick={() => toggleBudget(budget.value)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#ec407a] transition-colors flex-shrink-0 text-left"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${isChecked ? 'bg-[#ec407a] border-[#ec407a] text-white' : 'border-gray-300 bg-white'}`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3px]" />}
                      </div>
                      <span>{budget.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </aside>

        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-10">
              {[...Array(6)].map((_, i) => (
                <AmoebaProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">No products found</h2>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-10">
                {products.map((product, index) => (
                  <AmoebaProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onAddToCart={handleAddToCart}
                    animateOnView={false}
                  />
                ))}
              </div>

              {pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
                    <Link
                      key={page}
                      to={`/products?${new URLSearchParams({ ...Object.fromEntries(searchParams), page }).toString()}`}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                        page === currentPage
                          ? 'bg-gradient-to-r from-hot-pink to-royal-purple text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
