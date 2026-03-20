const axios = require('axios');
const Booking = require('../models/Booking');
const dotenv = require('dotenv');
dotenv.config();

const getTimeStamp = () => {
    const date = new Date();
    return date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2);
};

const getAccessToken = async () => {
    const key = (process.env.MPESA_CONSUMER_KEY || "").trim();
    const secret = (process.env.MPESA_CONSUMER_SECRET || "").trim();
    const auth = Buffer.from(`${key}:${secret}`).toString('base64');
    const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', { headers: { Authorization: `Basic ${auth}` } });
    return response.data.access_token;
};

// --- INITIATE STK PUSH ---
exports.stkPush = async (req, res) => {
    try {
        const { amount, phoneNumber, eventId, ticketsCount } = req.body;
        const phone = phoneNumber.replace(/\D/g, '').startsWith('0') ? `254${phoneNumber.substring(1)}` : phoneNumber;
        const timestamp = getTimeStamp();
        const shortcode = (process.env.MPESA_SHORTCODE || "").trim();
        const passkey = (process.env.MPESA_PASSKEY || "").trim();
        const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');
        const accessToken = await getAccessToken();

        console.log(`🚀 Requesting STK Push: KES ${amount} to ${phone}`);

        const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: Math.round(Number(amount)), // Safaricom requires integers
            PartyA: phone,
            PartyB: shortcode,
            PhoneNumber: phone,
            CallBackURL: (process.env.MPESA_CALLBACK_URL || "").trim(),
            AccountReference: "NairobiEvents",
            TransactionDesc: "Ticket Test"
        }, { headers: { Authorization: `Bearer ${accessToken}` } });

        if (response.data.ResponseCode === "0") {
            try {
                // We use the 'amount' sent from the frontend for totalAmount
                await Booking.create({
                    user: req.user.id,
                    event: eventId,
                    ticketsCount: ticketsCount || 1,
                    totalAmount: amount, 
                    mpesaCheckoutID: response.data.CheckoutRequestID,
                    paymentStatus: 'pending'
                });
                console.log(`📡 Booking Saved: ${response.data.CheckoutRequestID}`);
            } catch (dbError) {
                console.error("⚠️ DB Save Error (Duplicate ID):", dbError.message);
                // Catching this prevents the 500 error on the frontend
            }
        }

        return res.status(200).json(response.data);
    } catch (error) {
        console.error("❌ STK Push Failed:", error.response?.data || error.message);
        return res.status(500).json({ 
            message: "STK Push Failed", 
            details: error.response?.data?.CustomerMessage || "Internal Server Error" 
        });
    }
};

// --- HANDLE CALLBACK ---
exports.handleCallback = async (req, res) => {
    try {
        const { Body } = req.body;
        const result = Body.stkCallback;
        const checkoutID = result.CheckoutRequestID;

        if (result.ResultCode === 0) {
            const metadata = result.CallbackMetadata.Item;
            const receipt = metadata.find(item => item.Name === 'MpesaReceiptNumber').Value;

            await Booking.findOneAndUpdate(
                { mpesaCheckoutID: checkoutID },
                { paymentStatus: 'paid', mpesaReceiptNumber: receipt }
            );
            console.log(`✅ Payment confirmed for ${checkoutID}`);
        } else {
            await Booking.findOneAndUpdate({ mpesaCheckoutID: checkoutID }, { paymentStatus: 'failed' });
            console.log(`❌ Payment failed for ${checkoutID}`);
        }
        res.status(200).send("Callback Processed");
    } catch (error) {
        res.status(500).send("Error");
    }
};