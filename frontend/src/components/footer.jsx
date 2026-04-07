import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-black text-white">
            NAIROBI<span className="text-green-500">EVENTS</span>
          </h2>
          <p className="mt-4 text-sm text-gray-400 leading-relaxed">
            Discover the best events in Nairobi — concerts, workshops, sports, and more.
            Book tickets easily and securely with M-Pesa.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-white font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/my-bookings" className="hover:text-white transition">My Bookings</Link></li>
            <li><Link to="/login" className="hover:text-white transition">Sign In</Link></li>
            <li><Link to="/register" className="hover:text-white transition">Join Now</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-bold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>📍 Nairobi, Kenya</li>
            <li>📞 +254 700 000 000</li>
            <li>📧 support@nairobievents.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 text-center py-6 text-sm text-gray-500">
        © {year} Nairobi Events. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;