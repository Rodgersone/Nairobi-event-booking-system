import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const storedUser = localStorage.getItem('user');
  const user = (storedUser && storedUser !== "undefined") ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-black">
          NAIROBI<span className="text-green-600">EVENTS</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-bold text-gray-600 hover:text-black">Home</Link>

          {user ? (
            <div className="flex items-center gap-6">

              {user.role === 'admin' && (
                <Link to="/create-event" className="font-bold text-green-600 hover:text-black">
                  Create Event
                </Link>
              )}

              <Link to="/my-bookings" className="font-bold text-gray-600 hover:text-black">
                My Bookings
              </Link>

              <div className="flex items-center gap-4 pl-6 border-l">
                <span className="font-bold">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-100 text-red-600 px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="font-bold text-gray-600">Sign In</Link>
              <Link to="/register" className="bg-black text-white px-6 py-2 rounded-lg">
                Join Now
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Button */}
        <button 
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t px-6 py-4 space-y-3">

          <Link to="/" onClick={() => setIsOpen(false)} className="block font-bold">
            Home
          </Link>

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/create-event" onClick={() => setIsOpen(false)} className="block font-bold text-green-600">
                  Create Event
                </Link>
              )}

              <Link to="/my-bookings" onClick={() => setIsOpen(false)} className="block font-bold">
                My Bookings
              </Link>

              <div className="border-t pt-3">
                <p className="font-bold">Hi, {user.name}</p>
                <button
                  onClick={handleLogout}
                  className="mt-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg w-full"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="block font-bold">
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block bg-black text-white px-4 py-2 rounded-lg text-center"
              >
                Join Now
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;