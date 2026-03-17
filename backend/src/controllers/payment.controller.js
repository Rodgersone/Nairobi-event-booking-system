const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Event = require('../models/Event');

// @desc    M-Pesa Callback URL (Safaricom calls this)
// @route   POST /api/payments/callback
exports.mpesaCallback = async (req, res) => {
  try {
    const { Body } = req.body;
    const io = req.app.get('socketio');

    if (!Body || !Body.stkCallback) {
      return res.status(400).json({ message: "Invalid callback format" });
    }

    const result = Body.stkCallback;
    const checkoutID = result.CheckoutRequestID;
    const resultCode = result.ResultCode;

    // Find the pending booking
    const booking = await Booking.findOne({ mpesaCheckoutID: checkoutID });
    if (!booking) {
      console.error(`Booking not found for CheckoutID: ${checkoutID}`);
      return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" }); 
    }

    // Handle Success (resultCode 0)
    if (resultCode === 0) {
      const metadata = result.CallbackMetadata.Item;
      const amount = metadata.find(i => i.Name === 'Amount')?.Value;
      const receipt = metadata.find(i => i.Name === 'MpesaReceiptNumber')?.Value;
      const phone = metadata.find(i => i.Name === 'PhoneNumber')?.Value;

      // Check if already processed to prevent duplicate inventory deduction
      if (booking.paymentStatus === 'paid') {
        return res.status(200).json({ ResultCode: 0, ResultDesc: "Already Processed" });
      }

      // 1. Update Booking Status
      booking.paymentStatus = 'paid';
      booking.mpesaReceiptNumber = receipt;
      await booking.save();

      // 2. Log Payment
      await Payment.create({
        booking: booking._id,
        user: booking.user,
        amount,
        phoneNumber: phone,
        checkoutRequestID: checkoutID,
        mpesaReceiptNumber: receipt,
        status: 'Completed',
        resultDesc: result.ResultDesc
      });

      // 3. Deduct ticket from Event inventory
      await Event.findByIdAndUpdate(booking.event, {
        $inc: { availableTickets: -booking.ticketsCount }
      });

      // 4. Notify Frontend via Socket.io
      io.emit(`paymentSuccess_${checkoutID}`, {
        message: "Payment Received! Your ticket is ready.",
        receipt
      });

      console.log(`✅ Payment Successful for Booking: ${booking._id}`);

    } else {
      // Payment Failed or Cancelled by User
      booking.paymentStatus = 'failed';
      await booking.save();

      io.emit(`paymentFailed_${checkoutID}`, {
        message: result.ResultDesc
      });

      console.log(`❌ Payment Failed for CheckoutID ${checkoutID}: ${result.ResultDesc}`);
    }

    // Safaricom expects a 200 OK to stop retrying the callback
    res.status(200).json({ ResultCode: 0, ResultDesc: "Success" });

  } catch (err) {
    console.error("Critical Callback Error:", err);
    // Still return 200 to Safaricom but log the error locally
    res.status(200).json({ ResultCode: 1, ResultDesc: "Internal Error logged" });
  }
};