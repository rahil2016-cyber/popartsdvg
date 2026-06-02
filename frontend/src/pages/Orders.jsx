import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Star } from 'lucide-react';
import api from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState({
    delivered: false,
    cancelled: false,
    returned: false,
    pending: false,
    shipped: false
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : (import.meta.env.PROD ? '' : 'http://localhost:5000');

  const getFullImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/150';
    return url.startsWith('http') ? url : API_BASE_URL + url;
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get('/orders/my');
      setOrders(res.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Flatten orders into individual items
  const allItems = orders.flatMap(order => {
    return (order.items || []).map(item => ({
      ...item,
      order_number: order.order_number,
      order_status: order.order_status,
      created_at: order.created_at,
      payment_method: order.payment_method
    }));
  });

  // Apply filters
  const filteredItems = allItems.filter(item => {
    // Search filter
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Status filter
    const activeFilters = Object.entries(statusFilters).filter(([_, isActive]) => isActive).map(([key]) => key);
    if (activeFilters.length > 0) {
      // Map frontend filters to backend status
      // Backend statuses: pending, processing, shipped, delivered, cancelled
      let itemStatus = item.order_status;
      if (itemStatus === 'processing' || itemStatus === 'shipped') itemStatus = 'shipped';
      if (!activeFilters.includes(itemStatus)) {
        return false;
      }
    }
    return true;
  });

  const getStatusDisplay = (status, date) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    switch(status) {
      case 'delivered':
        return (
          <div>
            <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              Delivered on {formattedDate}
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-4.5">Your item has been delivered</p>
            <div className="mt-3 flex items-center gap-1 text-blue-600 text-sm font-medium ml-4.5">
              <Star className="w-4 h-4 fill-current" /> Rate & Review Product
            </div>
          </div>
        );
      case 'cancelled':
        return (
          <div>
            <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              Cancelled on {formattedDate}
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-4.5">Your order has been cancelled.</p>
          </div>
        );
      case 'shipped':
      case 'processing':
        return (
          <div>
            <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
              On the way
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-4.5">Your item is being processed and shipped.</p>
          </div>
        );
      case 'pending':
      default:
        return (
          <div>
            <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
              Order Placed
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-4.5">Awaiting confirmation or payment.</p>
          </div>
        );
    }
  };

  const handleFilterChange = (filterName) => {
    setStatusFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  return (
    <div className="bg-[#f1f3f6] min-h-screen pt-4 pb-12">
      <div className="max-w-[1200px] mx-auto px-2 sm:px-4 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/profile" className="hover:text-blue-600">My Account</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-800">My Orders</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-[250px] shrink-0">
            <div className="bg-white rounded-sm shadow-[0_1px_2px_0_rgba(0,0,0,0.2)] pb-4">
              <h2 className="text-lg font-medium px-4 py-3 border-b border-gray-200">Filters</h2>
              
              <div className="px-4 py-4 border-b border-gray-100">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Order Status</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded-sm focus:ring-blue-500" 
                      checked={statusFilters.shipped} onChange={() => handleFilterChange('shipped')} />
                    <span className="text-sm text-gray-700">On the way</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded-sm focus:ring-blue-500" 
                      checked={statusFilters.delivered} onChange={() => handleFilterChange('delivered')} />
                    <span className="text-sm text-gray-700">Delivered</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded-sm focus:ring-blue-500" 
                      checked={statusFilters.cancelled} onChange={() => handleFilterChange('cancelled')} />
                    <span className="text-sm text-gray-700">Cancelled</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            
            {/* Search Bar */}
            <div className="flex mb-4">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Search your orders here" 
                  className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-l-sm focus:outline-none focus:border-blue-500 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="bg-[#2874f0] text-white px-6 py-2.5 rounded-r-sm font-medium flex items-center gap-2 hover:bg-[#1b64d8] transition-colors">
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search Orders</span>
              </button>
            </div>

            {/* Orders List */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white h-32 rounded-sm shadow-sm animate-pulse border border-gray-200"></div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white rounded-sm shadow-sm p-12 text-center border border-gray-200">
                <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/myorders-empty_3b4049.png" alt="Empty Orders" className="w-48 mx-auto mb-6" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Orders Found</h3>
                <p className="text-gray-500 mb-6">Looks like you haven't made any orders yet.</p>
                <Link to="/products" className="bg-[#2874f0] text-white px-8 py-3 rounded-sm font-medium hover:bg-[#1b64d8] transition-colors">
                  START SHOPPING
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredItems.map((item, index) => (
                  <Link 
                    key={`${item.order_number}-${item.id}-${index}`}
                    to={`/order/${item.order_number}`}
                    className="block bg-white border border-gray-200 rounded-sm shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow"
                  >
                    <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
                      
                      {/* Product Image & Details */}
                      <div className="flex gap-4 sm:w-2/5">
                        <div className="w-20 h-20 shrink-0">
                          <img 
                            src={getFullImageUrl(item.product_image)} 
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-blue-600">{item.name}</h3>
                          <p className="text-xs text-gray-500 mt-1">Quantity: {item.quantity}</p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="sm:w-1/5 text-sm font-semibold text-gray-900">
                        ₹{item.total}
                      </div>

                      {/* Status */}
                      <div className="sm:w-2/5">
                        {getStatusDisplay(item.order_status, item.created_at)}
                      </div>
                      
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Orders;
