
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [guestOrders, setGuestOrders] = useState([]);
  
  useEffect(() => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
      setGuestOrders(savedOrders);
    } catch (e) {
      console.error(e);
    }
  }, []);

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
        <div className="mt-6">
          <Link to={user ? "/orders" : "/track-order"} className="text-gray-500 hover:text-hot-pink transition-colors underline font-medium">
            View Order History & Track Order
          </Link>
        </div>

        {/* Guest Recent Orders Section */}
        {guestOrders.length > 0 && !user && (
          <div className="mt-12 max-w-2xl mx-auto text-left">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-hot-pink" />
              Your Recent Orders
            </h3>
            <div className="space-y-4">
              {guestOrders.map((order, idx) => (
                <Link
                  key={idx}
                  to={`/order/${order.order_number}`}
                  className="block bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold text-gray-900">Order #{order.order_number}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center text-hot-pink font-semibold gap-2">
                      Track <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items List */}
        <div className="flex-1">
          <div className="flex flex-col gap-6">
            {cart.items.map((item, index) => {
              const price = item.discount_price || item.price;
              const itemTotal = price * item.quantity;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex flex-col sm:flex-row items-center gap-6 py-6 border-b border-gray-200"
                >
                  <Link to={`/product/${item.slug}`} className="shrink-0">
                    <img
                      src={getFullImageUrl(item.product_image)}
                      alt={item.name}
                      className="w-32 h-32 object-cover bg-gray-50"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col sm:flex-row justify-between w-full">
                    <div className="flex-1 pr-6">
                      <Link
                        to={`/product/${item.slug}`}
                        className="text-lg text-gray-800 hover:text-hot-pink transition-colors"
                      >
                        {item.name}
                      </Link>

                      {item.metadata && item.metadata.items && item.metadata.items.length > 0 && (
                        <ul className="mt-1 text-sm text-gray-500 list-disc list-inside space-y-1">
                          {item.metadata.items.map((bundleItem, idx) => (
                            <li key={idx}>
                              {bundleItem.name} {bundleItem.quantity > 1 ? `(x${bundleItem.quantity})` : ''}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="flex items-center gap-8 mt-4 sm:mt-0">
                      <div className="text-gray-500 font-medium whitespace-nowrap">
                        ₹{price}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded-full bg-white h-10 px-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-medium text-gray-800 w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 text-gray-500 hover:text-gray-900 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-lg text-gray-800 whitespace-nowrap w-20 text-right">
                        ₹{itemTotal}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 border-t border-[#d18e8a] pt-4 inline-block">
            <Link 
              to="/products"
              className="text-[#d18e8a] font-bold text-sm tracking-widest uppercase hover:opacity-80 flex items-center"
            >
              &larr; CONTINUE SHOPPING
            </Link>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:w-96 shrink-0">
          <div className="bg-gray-50 rounded-2xl p-8 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{cart.total}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold text-gray-800">Total</span>
              <span className="text-2xl font-bold text-gray-900">₹{cart.total}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-gray-900 text-white py-4 font-bold text-lg hover:bg-gray-800 transition-all uppercase tracking-wider"
            >
              Checkout
            </button>
            
            {guestOrders.length > 0 && !user && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">
                  Recent Orders
                </h3>
                <div className="space-y-3">
                  {guestOrders.slice(0, 3).map((order, idx) => (
                    <Link
                      key={idx}
                      to={`/order/${order.order_number}`}
                      className="block p-3 rounded bg-white border border-gray-100 hover:border-gray-300 transition-all"
                    >
                      <p className="font-bold text-gray-900 text-sm">#{order.order_number}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
