
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  
  const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : (import.meta.env.PROD ? '' : 'http://localhost:5000');
  const sessionId = localStorage.getItem('sessionId');

  console.log('Cart.jsx: Cart data:', cart);
  console.log('Cart.jsx: Session ID:', sessionId);

  const getFullImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/150';
    return url.startsWith('http') ? url : API_BASE_URL + url;
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    updateCartItem(id, quantity);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
        <Link
          to="/products"
          className="inline-block bg-gradient-to-r from-hot-pink to-royal-purple text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item, index) => {
          const price = item.discount_price || item.price;
          const itemTotal = price * item.quantity;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-6"
            >
              <Link to={`/product/${item.slug}`} className="flex-shrink-0">
                <img
                  src={getFullImageUrl(item.product_image)}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded-xl"
                />
              </Link>

              <div className="flex-1">
                <Link
                  to={`/product/${item.slug}`}
                  className="text-xl font-semibold text-gray-800 hover:text-hot-pink transition-colors"
                >
                  {item.name}
                </Link>

                <div className="text-lg font-bold text-gray-900 mt-2">
                  ₹{price}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-hot-pink hover:text-hot-pink"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-semibold text-gray-800 w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-hot-pink hover:text-hot-pink"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-gray-900">₹{itemTotal}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-hot-pink transition-colors"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-hot-pink to-royal-purple text-white py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={clearCart}
              className="w-full mt-4 text-gray-500 hover:text-hot-pink transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
