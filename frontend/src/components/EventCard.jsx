import React from 'react';
import { Link } from 'react-router-dom';

// Default placeholder image if event.image is missing
const DEFAULT_IMAGE = '/images/default-event.jpg'; // place this in your public/images folder

const EventCard = ({ event }) => {
  // Format price with commas
  const formattedPrice = new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(event.price);

  // Format date nicely
  const eventDate = new Date(event.date).toLocaleDateString('en-KE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <img 
        src={event.image || DEFAULT_IMAGE} 
        alt={event.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase">
          {event.category}
        </span>
        <h3 className="text-xl font-bold mt-2 text-gray-800">{event.title}</h3>
        <p className="text-gray-600 text-sm mt-1">📍 {event.location}</p>
        <p className="text-gray-500 text-sm mt-1">📅 {eventDate}</p>
        <p className="text-gray-500 text-sm mt-1">🎟️ {event.availableTickets} tickets available</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold text-green-600">{formattedPrice}</span>
          <Link 
            to={`/event/${event._id}`} 
            className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors duration-200"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;