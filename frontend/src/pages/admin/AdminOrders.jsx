
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gift, Package, LogOut, Eye, Truck, PlayCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders', { params: { limit: 100 } });
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { order_status: status });
      toast.success('Order status updated!');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully!');
    navigate('/admin/login');
  };

  const viewOrderDetails = async (id) => {
    try {
      const res = await api.get(`/admin/orders/${id}`);
      setSelectedOrder(res.data);
      setShowOrderModal(true);
    } catch (error) {
      toast.error('Failed to load order details');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <Gift className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-playfair font-bold text-gray-900">POPARTS</h2>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-2">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition">
            <Package className="h-5 w-5" />
            Dashboard
          </Link>
          <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition">
            <Gift className="h-5 w-5" />
            Products
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-50 text-purple-700 font-semibold">
            <Truck className="h-5 w-5" />
            Orders
          </Link>
          <Link to="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition">
            <Gift className="h-5 w-5" />
            Categories
          </Link>
          <Link to="/admin/coupons" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition">
            <Gift className="h-5 w-5" />
            Coupons
          </Link>
          <Link to="/admin/reels" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition">
            <PlayCircle className="h-5 w-5" />
            Reels
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-500 mt-1">View and manage customer orders</p>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs uppercase text-gray-500 font-semibold">
                  <th className="px-6 py-4 pl-8">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Delivery Type</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4 text-right pr-8">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">Loading orders...</td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 pl-8">
                        <p className="font-semibold text-gray-900">#{order.order_number}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.customer_name}</p>
                          <p className="text-sm text-gray-500">{order.customer_phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          order.delivery_type === 'pickup' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {order.delivery_type || 'shipping'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          order.payment_status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                          {order.order_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">₹{order.total_amount?.toFixed(2)}</p>
                      </td>
                      <td className="px-6 py-4 pr-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => viewOrderDetails(order.id)}
                            className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm font-medium"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                          <div className="flex gap-1 ml-2">
                            {order.order_status !== 'processing' && (
                              <button
                                onClick={() => handleUpdateStatus(order.id, 'processing')}
                                className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100"
                              >
                                Process
                              </button>
                            )}
                            {order.order_status === 'processing' && (
                              <button
                                onClick={() => handleUpdateStatus(order.id, 'shipped')}
                                className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100"
                              >
                                Ship
                              </button>
                            )}
                            {order.order_status === 'shipped' && (
                              <button
                                onClick={() => handleUpdateStatus(order.id, 'delivered')}
                                className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100"
                              >
                                Deliver
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">No orders yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-playfair font-bold text-gray-900">
                  Order Details #{selectedOrder.order_number}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={selectedOrder.order_status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-xl"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Gift className="h-5 w-5" /> Customer Info
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold text-gray-700">Name:</span> {selectedOrder.customer_name}</p>
                    <p><span className="font-semibold text-gray-700">Email:</span> {selectedOrder.customer_email}</p>
                    <p><span className="font-semibold text-gray-700">Phone:</span> {selectedOrder.customer_phone}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Truck className="h-5 w-5" /> Shipping Address
                  </h3>
                  <div className="text-sm text-gray-700">
                    {selectedOrder.shipping_address ? (
                      typeof selectedOrder.shipping_address === 'string' 
                        ? selectedOrder.shipping_address 
                        : JSON.stringify(selectedOrder.shipping_address, null, 2)
                    ) : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr className="text-left text-sm text-gray-500 font-medium">
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Quantity</th>
                        <th className="px-4 py-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrder.items?.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              {item.product_image && (
                                <img src={item.product_image} alt={item.name} className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
                              )}
                              <p className="font-medium text-gray-900">{item.name}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700">₹{item.price.toFixed(2)}</td>
                          <td className="px-4 py-4 text-sm text-gray-700">
                            <span className="bg-gray-100 px-2 py-1 rounded">Qty: {item.quantity}</span>
                          </td>
                          <td className="px-4 py-4 text-right font-semibold text-gray-900">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-5">
                <div className="space-y-2 max-w-md ml-auto">
                  {selectedOrder.discount_amount > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Discount:</span>
                      <span className="text-green-600">-₹{selectedOrder.discount_amount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Payment Method:</span>
                    <span className="capitalize">{selectedOrder.payment_method}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Payment Status:</span>
                    <span className={selectedOrder.payment_status === 'completed' ? 'text-green-600' : 'text-yellow-600'}>
                      {selectedOrder.payment_status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Order Status:</span>
                    <span className="capitalize">{selectedOrder.order_status}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 border-t border-gray-200 pt-3 mt-3">
                    <span>Total Amount:</span>
                    <span>₹{selectedOrder.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
