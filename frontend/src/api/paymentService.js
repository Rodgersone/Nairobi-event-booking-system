import axios from 'axios';

const API_URL = 'http://localhost:5000/api/payments';

/**
 * Sends payment request to backend
 */
export const initiateMpesaPayment = async (paymentData) => {
  try {
    const token = localStorage.getItem('token');
    
    // Safety check before calling backend
    if (!paymentData || !paymentData.phoneNumber) {
      throw new Error("Phone number is missing. Please log out and back in.");
    }

    const response = await axios.post(`${API_URL}/stk-push`, paymentData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  } catch (error) {
    // Capture the 500 error details from backend
    const message = error.response?.data?.message || error.message || "Payment Failed";
    throw message;
  }
};