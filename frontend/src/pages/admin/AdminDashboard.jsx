
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Users, Package, DollarSign, Gift, Heart, Smile, Truck, LogOut, PlayCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 0, totalUsers: 0, totalProducts: 0, totalRevenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
  const getFullImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : API_BASE_URL + url;
  };

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats({
        totalOrders: Number(res.data.totalOrders || 0),
        totalUsers: Number(res.data.totalUsers || 0),
        totalProducts: Number(res.data.totalProducts || 0),
        totalRevenue: Number(res.data.totalRevenue || 0)
      });
      setRecentOrders(res.data.recentOrders || []);
      setTopProducts(res.data.topProducts || []);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully!');
    navigate('/admin/login');
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
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-50 text-purple-700 font-semibold">
            <Package className="h-5 w-5" />
            Dashboard
          </Link>
          <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition">
            <Gift className="h-5 w-5" />
            Products
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition">
            <ShoppingCart className="h-5 w-5" />
            Orders
          </Link>
          <Link to="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition">
            <Heart className="h-5 w-5" />
            Categories
          </Link>
          <Link to="/admin/coupons" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition">
            <Smile className="h-5 w-5" />
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
        {loading ? (
          <div className="space-y-8">
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
                      <div className="h-8 w-20 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-playfair font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-500 mt-1">Welcome back, Admin!</p>
            </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Sales</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">₹{Number(stats.totalRevenue || 0).toFixed(2)}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalOrders || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Products</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalProducts || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Customers</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <Link
                to="/admin/orders"
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">#{order.order_number}</p>
                      <p className="text-xs text-gray-500">{order.user_name || order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">₹{Number(order.total_amount || 0).toFixed(2)}</p>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        order.order_status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.order_status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.order_status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No orders yet</p>
              )}
            </div>
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Products & Offers</h3>
              <Link
                to="/admin/products"
                className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 bg-gray-900 text-white px-3 py-1.5 rounded-lg"
              >
                + Add Product
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
                    <th className="pb-3 pl-3">Product</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Offer Price</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3 text-right pr-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topProducts.slice(0, 5).map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                      <td className="py-4 pl-3">
                        <div className="flex items-center gap-3">
                          {product.image_url && (
                            <img
                              src={getFullImageUrl(product.image_url)}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            {product.featured && (
                              <p className="text-xs text-purple-600 bg-purple-50 inline-block px-2 py-0.5 rounded-full mt-1">On Sale</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <p className="text-sm text-gray-400 line-through">₹{Number(product.price || 0).toFixed(2)}</p>
                      </td>
                      <td className="py-4">
                        <p className="text-sm font-semibold text-green-600">₹{Number(product.discount_price || product.price || 0).toFixed(2)}</p>
                      </td>
                      <td className="py-4">
                        <p className="text-xs text-gray-500">{product.category_name}</p>
                      </td>
                      <td className="py-4 pr-3 text-right">
                        <Link
                          to="/admin/products"
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
