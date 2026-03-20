import axios from 'axios';

// Ensure this matches your backend PORT
const API_URL = 'http://localhost:5000/api/payments';

/**
 * Initiates an M-Pesa STK Push via the protected backend route.
 * @param {Object} payload - Includes { amount, phoneNumber, eventId, ticketsCount }
 */
export const initiateMpesaPayment = async (payload) => {
  try {
    // 1. Retrieve the JWT token saved during login/registration
    const token = localStorage.getItem('token');
    
    // 2. Client-side security check: Don't even try the request if no token exists
    if (!token || token === "undefined") {
      throw new Error("You must be logged in to make a payment.");
    }

    // 3. Execute the POST request to the PROTECTED /stk-push route
    const response = await axios.post(
      `${API_URL}/stk-push`, 
      payload, 
      { 
        headers: { 
          // Crucial: This must match the 'Bearer' format your protect middleware expects
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );
    
    // 4. Return the Safaricom Response (e.g., ResponseCode: "0")
    return response.data;

  } catch (error) {
    // 5. Enhanced Error Logging for Debugging
    console.error("M-Pesa API Error:", error.response?.data || error.message);

    // Capture the specific error from your backend's global error handler
    const errorMessage = 
      error.response?.data?.details?.CustomerMessage || // Specific Safaricom Error
      error.response?.data?.message ||                 // Backend Error
      error.message ||                                  // Network/Axios Error
      "Payment initiation failed. Please check your connection.";

    throw errorMessage; 
  }
};