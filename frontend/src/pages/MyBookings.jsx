import React, { useEffect, useState } from 'react';
import API from '../api/axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        // This hits the route we defined in server.js
        const { data } = await API.get('/bookings/my-bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(data);
      } catch (error) {
        console.error("Fetch bookings error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div className="p-20 text-center font-bold">Loading your experiences...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 pt-24">
      <h1 className="text-3xl font-black mb-8 text-gray-900">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-10 text-center border-2 border-dashed">
          <p className="text-gray-500">You haven't booked any events yet!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{booking.event?.title}</h3>
                <p className="text-gray-500 text-sm">Tickets: {booking.quantity}</p>
                <p className="text-green-600 font-bold mt-1">KES {booking.totalAmount}</p>
              </div>
              <div className="text-right">
                <span className={`px-4 py-1 rounded-full text-xs font-black uppercase ${
                  booking.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {booking.status}
                </span>
                <p className="text-gray-400 text-[10px] mt-2">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;