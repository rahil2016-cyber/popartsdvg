
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, MapPin, Phone, Mail, User, Truck, ShoppingBag, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { load } from '@cashfreepayments/cashfree-js';

const DELIVERY_CHARGE = 120;
const PICKUP_LOCATION = "Poparts DVG Store, 123 Main Street, Davanagere, Karnataka - 577001";

const Checkout = () => {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : (import.meta.env.PROD ? '' : 'http://localhost:5000');

  const getFullImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/60';
    return url.startsWith('http') ? url : API_BASE_URL + url;
  };

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'COD',
    deliveryType: 'shipping'
  });
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone || ''
      }));
    }
  }, [user]);

  if (!cart.items || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const phoneDigits = formData.phone.replace(/[^0-9]/g, '');
    if (phoneDigits.length < 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cart.items.map(item => ({ productId: item.product_id, quantity: item.quantity })),
        shippingAddress: formData.deliveryType === 'shipping' ? {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        } : { address: PICKUP_LOCATION, city: 'Davanagere', state: 'Karnataka', pincode: '577001' },
        paymentMethod: formData.paymentMethod,
        couponCode: coupon?.code,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        deliveryType: formData.deliveryType,
        deliveryCharge: formData.deliveryType === 'shipping' ? DELIVERY_CHARGE : 0
      };

      const res = await api.post('/orders', orderData);
      await clearCart();
      
      if (formData.paymentMethod === 'Cashfree') {
        const orderId = res.data.id;
        const sessionRes = await api.post('/payments/create-session', { orderId });
        
        if (sessionRes.data && sessionRes.data.payment_session_id) {
          const cashfree = await load({ mode: 'production' });
          cashfree.checkout({
            paymentSessionId: sessionRes.data.payment_session_id,
            redirectTarget: '_self'
          });
          return; // Stop execution as Cashfree will redirect
        } else {
          toast.error('Could not initiate payment session');
          navigate(`/order/${res.data.order_number}`);
        }
      } else {
        toast.success('Order placed successfully!');
        navigate(`/order/${res.data.order_number}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const discount = coupon ? (
    coupon.discount_type === 'percentage' 
      ? (cart.total * coupon.discount_value) / 100 
      : coupon.discount_value
  ) : 0;

  const deliveryCharge = formData.deliveryType === 'shipping' ? DELIVERY_CHARGE : 0;
  const finalTotal = cart.total - Math.min(discount, coupon?.max_discount || discount) + deliveryCharge;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Customer Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-hot-pink"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-hot-pink"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-hot-pink"
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Delivery Option
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <label className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors border-gray-200 hover:border-hot-pink">
                <input
                  type="radio"
                  name="deliveryType"
                  value="shipping"
                  checked={formData.deliveryType === 'shipping'}
                  onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value })}
                  className="w-4 h-4 text-hot-pink"
                />
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-gray-600" />
                  <div>
                    <span className="text-gray-800">Home Delivery</span>
                    <p className="text-sm text-gray-500">+₹{DELIVERY_CHARGE} delivery charge</p>
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors border-gray-200 hover:border-hot-pink">
                <input
                  type="radio"
                  name="deliveryType"
                  value="pickup"
                  checked={formData.deliveryType === 'pickup'}
                  onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value })}
                  className="w-4 h-4 text-hot-pink"
                />
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-gray-600" />
                  <div>
                    <span className="text-gray-800">Store Pickup</span>
                    <p className="text-sm text-gray-500">Free (No delivery charge)</p>
                  </div>
                </div>
              </label>
            </div>

            {formData.deliveryType === 'shipping' && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Delivery Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-hot-pink"
                      rows="3"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-hot-pink"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-hot-pink"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                      <input
                        type="text"
                        required
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-hot-pink"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formData.deliveryType === 'pickup' && (
              <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Store className="w-5 h-5 text-purple-600" />
                  Pickup Location
                </h3>
                <p className="text-gray-700">{PICKUP_LOCATION}</p>
              </div>
            )}

            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Method
            </h2>

            <div className="space-y-4 mb-8">
              <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors border-gray-200 hover:border-hot-pink">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-4 h-4 text-hot-pink"
                />
                <span className="ml-3 text-gray-800">Cash on Delivery</span>
              </label>
              <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors border-gray-200 hover:border-hot-pink">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cashfree"
                  checked={formData.paymentMethod === 'Cashfree'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-4 h-4 text-hot-pink"
                />
                <span className="ml-3 text-gray-800">Pay Online (Cards/UPI/NetBanking)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-hot-pink to-royal-purple text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : `Place Order - ₹${finalTotal}`}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h3>

            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <img
                    src={getFullImageUrl(item.product_image)}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    ₹{(item.discount_price || item.price) * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Subtotal</span>
                <span>₹{cart.total}</span>
              </div>
              {coupon && (
                <div className="flex justify-between text-green-600 mb-2">
                  <span>Discount ({coupon.code})</span>
                  <span>-₹{Math.min(discount, coupon.max_discount || discount)}</span>
                </div>
              )}
              {formData.deliveryType === 'shipping' && (
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Delivery Charge</span>
                  <span>₹{deliveryCharge}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-4">
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
