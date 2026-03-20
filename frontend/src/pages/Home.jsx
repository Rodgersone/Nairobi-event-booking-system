import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // SAFE RETRIEVAL: Check if user exists and isn't "undefined" before parsing
  const storedUser = localStorage.getItem('user');
  const user = (storedUser && storedUser !== "undefined") ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/events');
        setEvents(res.data);
      } catch (err) {
        console.error("Connection failed:", err.message);
        setError("Cannot connect to the server. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center font-medium">Searching for events in Nairobi...</div>;
  if (error) return <div className="p-10 text-center text-red-500 bg-red-50 rounded-xl m-10 border border-red-100">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          {user ? `Karibu, ${user.name || 'Juma'}!` : "Find your next experience"}
        </h1>
        
        <div className="mt-6 flex max-w-md bg-white border rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-green-500 transition-all">
          <span className="px-4 flex items-center text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search KICC, Alchemist, or events..." 
            className="w-full py-3 outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard key={event._id} event={event} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No events found matching "{searchTerm}"</p>
            <button 
              onClick={() => setSearchTerm("")}
              className="mt-2 text-green-600 font-bold hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;