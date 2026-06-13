import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const categoriesDropdownLinks = [
  { label: 'Birthday Gifting', to: '/products?category=birthday-gifting' },
  { label: 'Return Gifts', to: '/products?category=return-gifts' },
  { label: 'Theme Based Gifting', to: '/products?category=theme-based-gifting' },
  { label: 'Traditional & Baby Arrival Hampers', to: '/products?category=traditional-baby-arrival-hampers' },
  { label: 'Festive Gifting', to: '/products?category=festive-gifting' },
  { label: 'Corporate Gifting', to: '/products?category=corporate-gifting' },
  { label: 'Premium Hampers', to: '/products?category=premium-hampers' },
  { label: 'Personalised Gifts', to: '/products?category=personalised-gifts' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
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
    const currentPath = location.pathname + location.search;
    if (path === '/') return location.pathname === '/';
    return currentPath === path || (path !== '/products' && currentPath.startsWith(path));
  };

  const closeMobile = () => {
    setIsMenuOpen(false);
    setCategoriesOpen(false);
  };

  const navItemClass = (path) =>
    `text-sm font-semibold transition-colors py-1 relative whitespace-nowrap ${isActive(path)
      ? 'text-[#ec407a] border-b-2 border-[#ec407a]'
      : 'text-[#4a4458] hover:text-[#ec407a]'
    }`;

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
            <Link to="/" className="shrink-0 transition-transform duration-300 hover:scale-[1.03] block" title="POPARTS DVG Home">
              <img
                src="/images/logo.png"
                alt="POPARTS DVG"
                className="h-14 w-auto md:h-16 filter drop-shadow-[0_2px_8px_rgba(103,58,183,0.15)] hover:drop-shadow-[0_4px_12px_rgba(236,64,122,0.25)] transition-all duration-300"
              />
            </Link>

            <div className="hidden items-center gap-6 xl:flex">
              <Link to="/" className={navItemClass('/')}>
                Home
              </Link>

              <Link to="/products" className={navItemClass('/products')}>
                Shop
              </Link>

              <Link to="/products?category=premium-hampers" className={navItemClass('/products?category=premium-hampers')}>
                Hampers
              </Link>

              {/* Categories Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setCategoriesOpen(true)}
                onMouseLeave={() => setCategoriesOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className={`flex items-center gap-1 text-sm font-semibold transition py-1 ${isActive('/products?category') && !isActive('/products?category=premium-hampers')
                    ? 'text-[#ec407a] border-b-2 border-[#ec407a]'
                    : 'text-[#4a4458] hover:text-[#ec407a]'
                    }`}
                >
                  Categories
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>
                {categoriesOpen && (
                  <div className="absolute left-1/2 top-full z-50 pt-2 w-56 -translate-x-1/2">
                    <div className="rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
                      {categoriesDropdownLinks.map((link) => (
                        <Link
                          key={link.label}
                          to={link.to}
                          onClick={() => setCategoriesOpen(false)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-[#ec407a] font-medium"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link to="/build-hamper" className={navItemClass('/build-hamper')}>
                Build Your Own Hamper
              </Link>

              <Link to="/about" className={navItemClass('/about')}>
                About Us
              </Link>

              <Link to="/contact" className={navItemClass('/contact')}>
                Contact
              </Link>
            </div>

            <div className="flex items-center gap-4 xl:hidden">
              <Link to="/cart" className="relative text-[#3d3654] transition hover:text-[#ec407a]" aria-label="Cart">
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
                className="text-[#3d3654] transition hover:text-[#ec407a]"
                aria-label="Search"
              >
                <Search className="h-5 w-5" strokeWidth={1.75} />
              </button>

              {user ? (
                <div className="group relative">
                  <button type="button" className="text-[#3d3654] transition hover:text-[#ec407a]" aria-label="Account menu">
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
                <Link to="/login" className="text-[#3d3654] transition hover:text-[#ec407a]" aria-label="Account">
                  <User className="h-5 w-5" strokeWidth={1.75} />
                </Link>
              )}

              <Link to="/cart" className="relative text-[#3d3654] transition hover:text-[#ec407a]" aria-label="Cart">
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
              <Link to="/products" onClick={closeMobile} className="block py-2.5 font-medium text-gray-800">Shop</Link>
              <Link to="/products?category=premium-hampers" onClick={closeMobile} className="block py-2.5 font-medium text-gray-800">Hampers</Link>

              {/* Mobile Categories Dropdown */}
              <button type="button" onClick={() => setCategoriesOpen(!categoriesOpen)} className="flex w-full items-center justify-between py-2.5 font-medium text-gray-800">
                Categories
                <ChevronDown className={`h-4 w-4 transition ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              {categoriesOpen && (
                <div className="ml-3 space-y-1 border-l-2 border-pink-100 pl-4">
                  {categoriesDropdownLinks.map((link) => (
                    <Link key={link.label} to={link.to} onClick={closeMobile} className="block py-2 text-sm text-gray-600 font-medium">
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}

              <Link to="/build-hamper" onClick={closeMobile} className="block py-2.5 font-medium text-gray-800">Build Your Own Hamper</Link>
              <Link to="/about" onClick={closeMobile} className="block py-2.5 font-medium text-gray-800">About Us</Link>
              <Link to="/contact" onClick={closeMobile} className="block py-2.5 font-medium text-gray-800">Contact</Link>

              <form onSubmit={handleSearch} className="flex pt-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 rounded-l-full border border-gray-300 px-4 py-2 focus:outline-none"
                />
                <button type="submit" className="rounded-r-full bg-[#ec407a] px-4 py-2 text-white">
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
