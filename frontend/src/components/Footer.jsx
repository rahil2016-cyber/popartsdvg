
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { Mail, Phone, MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
              POPARTS DVG
            </h3>
            <p className="text-gray-400 mb-4">
              Thoughtful premium hampers and personalised gifts for every celebration.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/popartsdvg?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
                <FaInstagram className="w-6 h-6" />
              </a>
              <a href="https://wa.me/918408995588" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition-colors">
                <FaWhatsapp className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/#bestsellers" className="text-gray-400 hover:text-white transition-colors">Best Sellers</Link></li>
              <li><Link to="/#build-hamper" className="text-gray-400 hover:text-white transition-colors">Build Your Own Hamper</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="text-gray-400 hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="text-gray-400 hover:text-white transition-colors">Return Policy</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start text-gray-400">
                <MapPin className="w-5 h-5 mr-3 mt-1 text-pink-500 shrink-0" />
                <span>2633/1, MCC B Block, Near Tank Park, Davanagere, Karnataka, 577004</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="w-5 h-5 mr-3 text-pink-500 shrink-0" />
                <a href="tel:+918408995588" className="hover:text-white">+91 84089 95588</a>
              </li>
              <li className="flex items-center text-gray-400">
                <Mail className="w-5 h-5 mr-3 text-pink-500 shrink-0" />
                <a href="mailto:popartsdvg@gmail.com" className="hover:text-white">popartsdvg@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="w-full md:w-1/3">
              <p className="text-gray-400 text-sm mb-2">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 rounded-full px-4 py-2 bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-pink-500"
                />
                <button className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-2 font-semibold hover:opacity-90 transition-opacity">
                  Subscribe
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://wa.me/918408995588" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-full bg-green-600 px-6 py-2 font-semibold hover:bg-green-700 transition-colors">
                <FaWhatsapp className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
          <p className="text-center text-gray-500">
            © 2024 POPARTS DVG. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
