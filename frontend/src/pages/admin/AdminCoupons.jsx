
import { Link, useNavigate } from 'react-router-dom';
import { Gift, Package, LogOut, Smile, PlayCircle, Heart, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCoupons = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully!');
    navigate('/admin/login');
  };

  const isActive = (path) => window.location.pathname === path;

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
          <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive('/admin') ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
            <Package className="h-5 w-5" /> Dashboard
          </Link>
          <Link to="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive('/admin/products') ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
            <Gift className="h-5 w-5" /> Products
          </Link>
          <Link to="/admin/orders" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive('/admin/orders') ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
            <ShoppingCart className="h-5 w-5" /> Orders
          </Link>
          <Link to="/admin/categories" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive('/admin/categories') ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
            <Heart className="h-5 w-5" /> Categories
          </Link>
          <Link to="/admin/coupons" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive('/admin/coupons') ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
            <Smile className="h-5 w-5" /> Coupons
          </Link>
          <Link to="/admin/reels" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive('/admin/reels') ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
            <PlayCircle className="h-5 w-5" /> Reels
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
          <h1 className="text-3xl font-playfair font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-500 mt-1">Manage your discount coupons</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <p className="text-gray-600">Coupon management coming soon...</p>
        </div>
      </main>
    </div>
  );
};

export default AdminCoupons;
