import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEventById } from '../api/eventService'; 
import { initiateMpesaPayment } from '../api/paymentService';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ticketsCount, setTicketsCount] = useState(1); // Default to 1 ticket

  useEffect(() => {
    const getEvent = async () => {
      try {
        const data = await fetchEventById(id);
        setEvent(data);
        
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
    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Please enter a valid M-Pesa phone number (e.g., 0712345678)");
      return;
    }

    setLoading(true);
    try {
      const payload = { 
        amount: event.price * ticketsCount, 
        phoneNumber: phoneNumber,
        eventId: id,
        ticketsCount: ticketsCount // Matches your updated Booking model
      };

      const response = await initiateMpesaPayment(payload);
      
      // ResponseCode "0" means Safaricom accepted the request and sent the prompt
      if (response.ResponseCode === "0") {
        alert("Success! Check your phone for the M-Pesa PIN prompt.");
        navigate('/my-bookings');
      } else {
        // Handle cases where Safaricom rejects the request (e.g., invalid phone)
        alert(`M-Pesa Error: ${response.CustomerMessage || "Request rejected"}`);
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      
      // If the backend sent a 500 error, we try to show the specific reason
      const errorMessage = error.response?.data?.details?.CustomerMessage 
        || error.response?.data?.message 
        || "Initiation Failed. Check your backend connection.";
        
      alert("Payment Error: " + errorMessage);
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
        
        <div className="flex items-center gap-4 mb-6">
            <p className="text-2xl font-bold text-green-700">Price: KES {event.price}</p>
            <div className="flex items-center border rounded">
                <button 
                  className="px-3 py-1 bg-gray-200"
                  onClick={() => setTicketsCount(Math.max(1, ticketsCount - 1))}
                >-</button>
                <span className="px-4 font-bold">{ticketsCount}</span>
                <button 
                  className="px-3 py-1 bg-gray-200"
                  onClick={() => setTicketsCount(ticketsCount + 1)}
                >+</button>
            </div>
            <p className="text-sm text-gray-500">Total: KES {event.price * ticketsCount}</p>
        </div>
        
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
            Ensure this is the number used in your Daraja sandbox credentials.
          </p>
        </div>
        
        <button 
          onClick={handlePayment} 
          disabled={loading} 
          className={`w-full p-4 text-white font-bold rounded transition-colors ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? "Processing..." : `Pay KES ${event.price * ticketsCount}`}
        </button>
      </div>
    </div>
  );
};

export default EventDetails;