import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEventById } from '../api/eventService';
import { initiateMpesaPayment } from '../api/paymentService';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getEvent = async () => {
      try {
        const data = await fetchEventById(id);
        setEvent(data);
      } catch (err) { console.error(err); }
    };
    getEvent();
  }, [id]);

  const handlePayment = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || !user.phone) {
      alert("Please login again to refresh your phone number.");
      return;
    }

    setLoading(true);
    try {
      const payload = { amount: event.price * quantity, phoneNumber: user.phone, eventId: id };
      const response = await initiateMpesaPayment(payload);
      if (response.ResponseCode === "0") {
        alert("STK Push Initiated!");
        navigate('/my-bookings');
      }
    } catch (error) {
      alert("Payment Error: " + error);
    } finally { setLoading(false); }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <button onClick={handlePayment} disabled={loading} className="bg-green-600 text-white p-3 mt-4">
        {loading ? "Processing..." : `Pay KES ${event.price * quantity}`}
      </button>
    </div>
  );
};

// FIXED: Added default export
export default EventDetails;
