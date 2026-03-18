import axios from 'axios';

// Ensure your backend is running on 5000
const API_URL = 'http://localhost:5000/api/events';

export const fetchEvents = async (searchTerm = '') => {
    try {
        const response = await axios.get(`${API_URL}${searchTerm ? `?search=${searchTerm}` : ''}`);
        return response.data; 
    } catch (error) {
        console.error("Network Error (fetchEvents): Backend might be offline.", error.message);
        return []; 
    }
};

export const fetchEventById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Network Error (fetchEventById):", error.message);
        throw error; 
    }
};