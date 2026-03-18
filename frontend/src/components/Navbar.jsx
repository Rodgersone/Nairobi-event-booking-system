import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  
  const userItem = localStorage.getItem('user');
  const user = userItem && userItem !== "undefined" ? JSON.parse(userItem) : null;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-gray-900">
          NAIROBI<span className="text-green-600">EVENTS</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="font-medium text-gray-600 hover:text-green-600 transition">Home</Link>
          
          {user ? (
            <div className="flex items-center gap-6 border-l pl-6 border-gray-200">
              <Link to="/my-bookings" className="font-medium text-gray-600 hover:text-green-600">My Bookings</Link>
              <span className="font-semibold text-gray-800">Hello, {user.name.split(' ')[0]}</span>
              <button 
                onClick={handleLogout} 
                className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-600 hover:text-white transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="font-medium text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link to="/register" className="bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition">
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;