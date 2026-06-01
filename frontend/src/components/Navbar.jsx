import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const shopDropdownLinks = [
  { label: 'Best Sellers', to: '/#bestsellers' },
  { label: 'New Arrivals', to: '/products' }, // Assuming new arrivals is just products sorted by date
  { label: 'Personalized Gifts', to: '/products?category=personalised-gifts' },
  { label: 'Premium Hampers', to: '/products?category=premium-hampers' },
];

const occasionsDropdownLinks = [
  { label: 'Birthday Gifts', to: '/products?category=birthday-gifts' },
  { label: 'Return Gifts', to: '/products?category=return-gifts' },
  { label: 'Baby Hampers', to: '/products?category=baby-hampers' },
  { label: 'Bridal & Muhurtam', to: '/products?category=bridal-gifting' },
  { label: 'Festivals', to: '/products?category=festive-gifts' },
];

const mainNavLinks = [
  { label: 'Corporate Gifting', to: '/products?category=corporate-gifting' },
  { label: 'Build Your Own', to: '/#build-hamper' },
  { label: 'Track Order', to: '/track-order' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [occasionsOpen, setOccasionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const cartCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path.startsWith('/#')) return location.pathname === '/';
    return location.pathname.startsWith(path.split('?')[0]) && path !== '/';
  };

  const closeMobile = () => {
    setIsMenuOpen(false);
    setShopOpen(false);
    setOccasionsOpen(false);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-[#673ab7] via-[#ab47bc] to-[#ec407a] py-2.5 text-white">
        <p className="text-center text-xs font-medium tracking-wide sm:text-sm">
          FREE SHIPPING on orders above ₹999 &nbsp;|&nbsp; Premium Packaging &nbsp;|&nbsp; Made with Love ✨
        </p>
      </div>

      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between gap-4 md:h-20">
            <Link to="/" className="shrink-0">
              <img src="/images/logo.png" alt="POPARTS DVG" className="h-14 w-auto md:h-16" />
            </Link>

            <div className="hidden items-center gap-5 xl:flex">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  isActive('/') ? 'border-b-2 border-[#673ab7] pb-0.5 text-[#4a148c]' : 'text-[#4a4458] hover:text-[#673ab7]'
                }`}
              >
                Home
              </Link>

              {/* Shop Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
              >
                <button
                  className="flex items-center gap-1 text-sm font-medium text-[#4a4458] transition hover:text-[#673ab7]"
                >
                  Shop
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>
                {shopOpen && (
                  <div className="absolute left-1/2 top-full z-50 mt-2 w-56 -translate-x-1/2 rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
                    {shopDropdownLinks.map((link) => (
                      <Link
                        key={link.label}
                        to={link.to}
                        onClick={() => setShopOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-[#673ab7]"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Occasions Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setOccasionsOpen(true)}
                onMouseLeave={() => setOccasionsOpen(false)}
              >
                <button
                  className="flex items-center gap-1 text-sm font-medium text-[#4a4458] transition hover:text-[#673ab7]"
                >
                  Occasions
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>
                {occasionsOpen && (
                  <div className="absolute left-1/2 top-full z-50 mt-2 w-56 -translate-x-1/2 rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
                    {occasionsDropdownLinks.map((link) => (
                      <Link
                        key={link.label}
                        to={link.to}
                        onClick={() => setOccasionsOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-[#673ab7]"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Main Links */}
              {mainNavLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="whitespace-nowrap text-sm font-medium text-[#4a4458] transition hover:text-[#673ab7]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 xl:hidden">
              <Link to="/cart" className="relative text-[#3d3654] transition hover:text-[#673ab7]" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />
                <span className="absolute -right-2.5 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#ec407a] px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              </Link>
              <button type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700" aria-label="Toggle menu">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
            
            <div className="hidden items-center gap-5 lg:flex">
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="text-[#3d3654] transition hover:text-[#673ab7]"
                aria-label="Search"
              >
                <Search className="h-5 w-5" strokeWidth={1.75} />
              </button>

              {user ? (
                <div className="group relative">
                  <button type="button" className="text-[#3d3654] transition hover:text-[#673ab7]" aria-label="Account menu">
                    <User className="h-5 w-5" strokeWidth={1.75} />
                  </button>
                  <div className="invisible absolute right-0 mt-2 w-48 rounded-xl bg-white py-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600">Profile</Link>
                    <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600">My Orders</Link>
                    <button type="button" onClick={handleLogout} className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-pink-50 hover:text-pink-600">
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="text-[#3d3654] transition hover:text-[#673ab7]" aria-label="Account">
                  <User className="h-5 w-5" strokeWidth={1.75} />
                </Link>
              )}

              <Link to="/cart" className="relative text-[#3d3654] transition hover:text-[#673ab7]" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />
                <span className="absolute -right-2.5 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#ec407a] px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="border-t bg-white xl:hidden">
            <div className="max-h-[80vh] space-y-1 overflow-y-auto px-4 py-4">
              <Link to="/" onClick={closeMobile} className="block py-2.5 font-medium text-gray-800">Home</Link>

              {/* Mobile Shop Dropdown */}
              <button type="button" onClick={() => setShopOpen(!shopOpen)} className="flex w-full items-center justify-between py-2.5 font-medium text-gray-800">
                Shop
                <ChevronDown className={`h-4 w-4 transition ${shopOpen ? 'rotate-180' : ''}`} />
              </button>
              {shopOpen && (
                <div className="ml-3 space-y-1 border-l-2 border-pink-100 pl-4">
                  {shopDropdownLinks.map((link) => (
                    <Link key={link.label} to={link.to} onClick={closeMobile} className="block py-2 text-sm text-gray-600">
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}

              {/* Mobile Occasions Dropdown */}
              <button type="button" onClick={() => setOccasionsOpen(!occasionsOpen)} className="flex w-full items-center justify-between py-2.5 font-medium text-gray-800">
                Occasions
                <ChevronDown className={`h-4 w-4 transition ${occasionsOpen ? 'rotate-180' : ''}`} />
              </button>
              {occasionsOpen && (
                <div className="ml-3 space-y-1 border-l-2 border-pink-100 pl-4">
                  {occasionsDropdownLinks.map((link) => (
                    <Link key={link.label} to={link.to} onClick={closeMobile} className="block py-2 text-sm text-gray-600">
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}

              {/* Main Links */}
              {mainNavLinks.map((link) => (
                <Link key={link.label} to={link.to} onClick={closeMobile} className="block py-2 text-sm font-medium text-gray-800">
                  {link.label}
                </Link>
              ))}

              <form onSubmit={handleSearch} className="flex pt-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 rounded-l-full border border-gray-300 px-4 py-2 focus:outline-none"
                />
                <button type="submit" className="rounded-r-full bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2 text-white">
                  <Search className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
