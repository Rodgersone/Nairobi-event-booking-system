import axios from 'axios';

/**
 * Custom Axios instance for the Nairobi Event Booking API
 * Configured to connect to the backend on port 5000
 */
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Connecting to your operational backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach JWT tokens later for secure bookings
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;