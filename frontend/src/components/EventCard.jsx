import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <img 
        src={event.image} 
        alt={event.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase">
          {event.category}
        </span>
        <h3 className="text-xl font-bold mt-2 text-gray-800">{event.title}</h3>
        <p className="text-gray-600 text-sm mt-1">📍 {event.location}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold text-green-600">KES {event.price}</span>
          <Link 
            to={`/event/${event._id}`} 
            className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;