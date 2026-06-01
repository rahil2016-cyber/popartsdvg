
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
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
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const budgetParam = searchParams.get('budget') || '';

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
      
      // Handle budget ranges
      if (budgetParam) {
        switch(budgetParam) {
          case '0-499':
            params.set('max_price', '499');
            break;
          case '500-999':
            params.set('min_price', '500');
            params.set('max_price', '999');
            break;
          case '1000-1999':
            params.set('min_price', '1000');
            params.set('max_price', '1999');
            break;
          case '2000+':
            params.set('min_price', '2000');
            break;
        }
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="font-playfair text-4xl text-[#1b1842] mb-4">
          {searchQuery ? `Search: "${searchQuery}"` : 'Our Products'}
        </h1>
        <p className="text-gray-600">
          {total} {total === 1 ? 'product' : 'products'} found
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Categories
            </h3>
            <div className="space-y-2 mb-8">
              <Link
                to="/products"
                className={`block px-3 py-2 rounded-lg transition-colors ${!categoryParam && !budgetParam ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                All Products
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.slug}`}
                  className={`block px-3 py-2 rounded-lg transition-colors ${categoryParam === category.slug ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {category.name}
                </Link>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Range</h3>
            <div className="space-y-2">
              {[
                { label: 'Under ₹499', value: '0-499' },
                { label: '₹500 - ₹999', value: '500-999' },
                { label: '₹1000 - ₹1999', value: '1000-1999' },
                { label: '₹2000+', value: '2000+' }
              ].map((budget) => (
                <Link
                  key={budget.value}
                  to={`/products?budget=${budget.value}`}
                  className={`block px-3 py-2 rounded-lg transition-colors ${budgetParam === budget.value ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {budget.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
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
