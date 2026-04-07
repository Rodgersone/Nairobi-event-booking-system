import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import MyBookings from './pages/MyBookings';
import EventDetails from './pages/EventDetails';

function App() {
  return (
    <Router>
      {/* FLEX COLUMN LAYOUT FOR STICKY FOOTER */}
      <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">

        {/* NAVBAR */}
        <Navbar />

        {/* MAIN CONTENT */}
        <main className="flex-grow pt-20 px-2 sm:px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Routes>
        </main>

        {/* FOOTER */}
        <Footer />

      </div>
    </Router>
  );
}

export default App;