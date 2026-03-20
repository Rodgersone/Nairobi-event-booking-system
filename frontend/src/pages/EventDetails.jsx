import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEventById } from '../api/eventService'; 
import { initiateMpesaPayment } from '../api/paymentService';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // 1. New state to allow manual entry/verification of phone number
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const getEvent = async () => {
      try {
        const data = await fetchEventById(id);
        setEvent(data);
        
        // Pre-fill phone number from local storage if it exists
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.phone) {
          setPhoneNumber(storedUser.phone);
        }
      } catch (err) { 
        console.error("Fetch Event Error:", err); 
      }
    };
    getEvent();
  }, [id]);

  const handlePayment = async () => {
    // 2. Validate the input field instead of just the hidden localStorage
    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Please enter a valid M-Pesa phone number (e.g., 0712345678)");
      return;
    }

    setLoading(true);
    try {
      const payload = { 
        amount: event.price, 
        phoneNumber: phoneNumber, // Use the state value
        eventId: id 
      };

      const response = await initiateMpesaPayment(payload);
      
      // Checking for Safaricom's "0" Success code
      if (response.ResponseCode === "0") {
        alert("Success! Check your phone for the M-Pesa PIN prompt.");
        navigate('/my-bookings');
      } else {
        alert("M-Pesa Error: " + response.CustomerMessage);
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment Error: Initiation Failed. Check your connection.");
    } finally { 
      setLoading(false); 
    }
  };

  if (!event) return <div className="p-10 text-center">Loading Event Details...</div>;

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
      <p className="text-gray-600 mb-6">{event.description}</p>
      
      <div className="bg-gray-50 p-6 rounded-lg border shadow-sm">
        <p className="text-xl mb-2">Location: <strong>{event.location}</strong></p>
        <p className="text-2xl font-bold text-green-700 mb-6">Price: KES {event.price}</p>
        
        {/* 3. New Input Field for Phone Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            M-Pesa Phone Number
          </label>
          <input 
            type="text" 
            placeholder="e.g. 0712345678" 
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Ensure this number is registered in your Daraja "Test Credentials".
          </p>
        </div>
        
        <button 
          onClick={handlePayment} 
          disabled={loading} 
          className={`w-full p-4 text-white font-bold rounded transition-colors ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? "Requesting STK Push..." : `Pay KES ${event.price}`}
        </button>
      </div>
    </div>
  );
};

export default EventDetails;