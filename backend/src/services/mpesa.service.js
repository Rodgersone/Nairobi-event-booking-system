const axios = require('axios');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment'); //

class MpesaService {
  // 1. Generate Access Token (Keep your existing logic)
  async getAccessToken() {
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    try {
      const response = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        { headers: { Authorization: `Basic ${auth}` } }
      );
      return response.data.access_token;
    } catch (error) {
      throw new Error('Failed to generate M-Pesa access token');
    }
  }

  // 2. Trigger STK Push (Updated to handle User ID)
  async initiateSTKPush(phone, amount, bookingId, userId) {
    const token = await this.getAccessToken();
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

    const data = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: phone, 
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: `${process.env.BASE_URL}/api/payments/callback`,
      AccountReference: `Booking-${bookingId.slice(-5)}`,
      TransactionDesc: 'Nairobi Event Booking'
    };

    try {
      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.ResponseCode === "0") {
        // Update the booking with the CheckoutID so the callback can find it
        await Booking.findByIdAndUpdate(bookingId, {
          mpesaCheckoutID: response.data.CheckoutRequestID
        });

        // CRITICAL FIX: Create the Payment record with the User ID
        await Payment.create({
          booking: bookingId,
          user: userId, // This fixes the "user required" error
          amount: amount,
          phoneNumber: phone,
          checkoutRequestID: response.data.CheckoutRequestID,
          status: 'Pending'
        });
      }

      return response.data;
    } catch (error) {
      console.error('STK Push Error:', error.response?.data || error.message);
      throw new Error('M-Pesa payment initiation failed');
    }
  }
}

module.exports = new MpesaService();