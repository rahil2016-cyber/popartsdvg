
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const statusSteps = [
    { status: 'pending', label: 'Order Placed' },
    { status: 'processing', label: 'Processing' },
    { status: 'shipped', label: 'Shipped' },
    { status: 'delivered', label: 'Delivered' }
  ];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-100 rounded w-1/4"></div>
          <div className="bg-gray-100 rounded-2xl h-64"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order not found</h2>
        <Link to="/orders" className="text-hot-pink hover:underline">Back to orders</Link>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(step => step.status === order.order_status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-hot-pink mb-8 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Order #{order.order_number}</h1>
            <p className="text-gray-600">
              {new Date(order.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(order.order_status)}`}>
            {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
          </span>
        </div>

        <div className="mb-8">
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-purple-900 mb-1">Your Tracking Code</h3>
              <p className="text-purple-700 text-sm">Save this code to track your order anytime from our website.</p>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg border border-purple-200 shadow-sm flex items-center gap-3">
              <span className="font-mono text-xl font-bold text-gray-900">{order.order_number}</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(order.order_number);
                  toast.success('Tracking code copied!');
                }}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, index) => (
              <div key={step.status} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    index <= currentStepIndex
                      ? 'bg-gradient-to-r from-hot-pink to-royal-purple text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-sm mt-2 text-gray-600">{step.label}</span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-10 right-10 h-1 bg-gray-200"></div>
            <div
              className="absolute top-0 left-10 h-1 bg-gradient-to-r from-hot-pink to-royal-purple"
              style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Items</h2>
        <div className="space-y-4">
          {order.items?.map((item) => (
            <div key={item.id} className="flex gap-4">
              <img
                src={item.product_image || 'https://via.placeholder.com/80'}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div className="flex-1">
                <Link
                  to={`/product/${item.slug}`}
                  className="font-semibold text-gray-800 hover:text-hot-pink transition-colors"
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

                <p className="text-gray-600 mt-1">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-900">₹{item.total}</p>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 mt-6">
          <div className="flex justify-between text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>₹{order.total_amount}</span>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between text-green-600 mb-2">
              <span>Discount</span>
              <span>-₹{order.discount_amount}</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-4">
            <span>Total</span>
            <span>₹{order.total_amount}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Shipping Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-hot-pink" />
              Address
            </h3>
            <div className="text-gray-600">
              <p className="font-semibold">{order.customer_name}</p>
              <p>{order.customer_phone}</p>
              <p className="mt-2">{order.shipping_address}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-hot-pink" />
              Payment
            </h3>
            <div className="text-gray-600">
              <p className="font-semibold">{order.payment_method}</p>
              <p>Status: <span className="capitalize">{order.payment_status}</span></p>
              {order.tracking_number && (
                <p className="mt-2">Tracking: {order.tracking_number}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
