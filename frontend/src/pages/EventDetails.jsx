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
  const [testAmount, setTestAmount] = useState(""); 
  const [isTestMode, setIsTestMode] = useState(false);

  // SAFE USER RETRIEVAL: Prevents crash if user isn't logged in
  const storedUser = localStorage.getItem('user');
  const user = (storedUser && storedUser !== "undefined") ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const getEvent = async () => {
      try {
        const data = await fetchEventById(id);
        setEvent(data);
        setTestAmount(data.price); 
        
        // Auto-fill from Kevin Kevo's profile if available
        if (user && user.phone) {
          setPhoneNumber(user.phone);
        }
      } catch (err) { 
        console.error("Fetch Event Error:", err); 
      }
    };
    getEvent();
  }, [id]);

  const handlePayment = async () => {
    // SECURITY CHECK: Ensure user is actually logged in before processing
    if (!user) {
      alert("Please login first to book this event.");
      navigate('/login');
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Please enter a valid M-Pesa phone number");
      return;
    }

    setLoading(true);
    try {
      const payload = { 
        amount: isTestMode ? Number(testAmount) : event.price, 
        phoneNumber: phoneNumber, 
        eventId: id,
        ticketsCount: 1
      };

      const response = await initiateMpesaPayment(payload);
      
      if (response.ResponseCode === "0") {
        alert("Success! Check your phone for the M-Pesa prompt.");
        navigate('/my-bookings');
      } else {
        alert("M-Pesa Error: " + response.CustomerMessage);
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment Error: Initiation Failed. Check backend connection.");
    } finally { 
      setLoading(false); 
    }
  };

  if (!event) return <div className="p-10 text-center">Loading event...</div>;

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-4xl font-black mb-6 text-gray-900">{event.title}</h1>
      
      <div className="bg-white p-8 rounded-3xl border shadow-xl">
        <div className="flex justify-between items-start mb-8">
            <div>
                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Event Cost</p>
                <p className="text-3xl font-black text-green-600">KES {event.price}</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-yellow-600"
                      checked={isTestMode} 
                      onChange={() => setIsTestMode(!isTestMode)} 
                    />
                    <span className="text-sm font-black text-yellow-800">Test 1 Bob Mode</span>
                </label>
            </div>
        </div>

        {isTestMode && (
          <div className="mb-8">
            <label className="block text-xs font-bold text-red-500 uppercase mb-2">Manual Amount Override</label>
            <input 
              type="number" 
              value={testAmount}
              onChange={(e) => setTestAmount(e.target.value)}
              className="w-full p-4 bg-red-50 border-2 border-red-100 rounded-2xl font-bold text-red-700 outline-none focus:border-red-300"
            />
          </div>
        )}
        
        <div className="mb-8">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">M-Pesa Number</label>
          <input 
            type="text" 
            placeholder="e.g. 2547..."
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 font-medium"
          />
        </div>
        
        {/* Conditional Button UI based on login status */}
        {user ? (
          <button 
            onClick={handlePayment} 
            disabled={loading} 
            className={`w-full p-5 text-white font-black rounded-2xl shadow-lg transition-all transform active:scale-95 ${
              loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 shadow-green-100'
            }`}
          >
            {loading ? "COMMUNICATING WITH SAFARICOM..." : `CONFIRM & PAY KES ${isTestMode ? testAmount : event.price}`}
          </button>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            className="w-full p-5 bg-black text-white font-black rounded-2xl hover:bg-gray-800 transition-all"
          >
            LOGIN TO BOOK TICKETS
          </button>
        )}
      </div>
    </div>
  );
};

export default EventDetails;