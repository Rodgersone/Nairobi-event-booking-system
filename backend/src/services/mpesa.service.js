const axios = require('axios');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

class MpesaService {
  async getAccessToken() {
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    try {
      const res = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
        headers: { Authorization: `Basic ${auth}` }
      });
      return res.data.access_token;
    } catch (err) {
      throw new Error('Failed to generate M-Pesa access token');
    }
  }

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
      const res = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.ResponseCode === "0") {
        await Booking.findByIdAndUpdate(bookingId, { mpesaCheckoutID: res.data.CheckoutRequestID });

        await Payment.create({
          booking: bookingId,
          user: userId,
          amount,
          phoneNumber: phone,
          checkoutRequestID: res.data.CheckoutRequestID,
          status: 'Pending'
        });
      }
      return res.data;
    } catch (err) {
      console.error('STK Push Error:', err.response?.data || err.message);
      throw new Error('M-Pesa payment initiation failed');
    }
  }
}

module.exports = new MpesaService();