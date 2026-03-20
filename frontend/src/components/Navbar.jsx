import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  // 1. Check if user is logged in from localStorage
  const storedUser = localStorage.getItem('user');
  const user = (storedUser && storedUser !== "undefined") ? JSON.parse(storedUser) : null;

  // 2. Logout function to clear session
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.clear(); // Ensure no "undefined" strings remain
    navigate('/login');
    window.location.reload(); // Refresh to update UI state
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-100 z-50 h-20 flex items-center px-10">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-black tracking-tighter text-gray-900">
          NAIROBI<span className="text-green-600">EVENTS</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="font-bold text-gray-600 hover:text-black transition">Home</Link>
          
          {user ? (
            // Logic for LOGGED IN User
            <div className="flex items-center gap-6">
              <Link to="/my-bookings" className="font-bold text-gray-600 hover:text-black transition">My Bookings</Link>
              <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
                <span className="font-black text-gray-900">Hi, {user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 px-6 py-2 rounded-xl font-bold hover:bg-red-100 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            // Logic for GUEST User
            <div className="flex items-center gap-4">
              <Link to="/login" className="font-bold text-gray-600 hover:text-black transition px-4">Sign In</Link>
              <Link 
                to="/register" 
                className="bg-black text-white px-8 py-3 rounded-2xl font-black hover:bg-gray-800 transition shadow-lg shadow-black/10"
              >
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