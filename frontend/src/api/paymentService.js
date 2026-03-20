import axios from 'axios';

const API_URL = 'http://localhost:5000/api/payments';

export const initiateMpesaPayment = async (payload) => {
  try {
    const token = localStorage.getItem('token');
    
    // We send the entire payload object { amount, phoneNumber, eventId }
    const response = await axios.post(
      `${API_URL}/stk-push`, 
      payload, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data;
  } catch (error) {
    // This captures the detailed error message from your debug controller
    const message = error.response?.data?.message || "Payment initiation failed";
    throw message;
  }
};