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

// --- STEP 1: INITIATE STK PUSH ---
exports.stkPush = async (req, res) => {
    try {
        const { amount, phoneNumber, eventId, ticketsCount } = req.body;
        const phone = phoneNumber.replace(/\D/g, '').startsWith('0') ? `254${phoneNumber.substring(1)}` : phoneNumber;
        const timestamp = getTimeStamp();
        const shortcode = (process.env.MPESA_SHORTCODE || "").trim();
        const passkey = (process.env.MPESA_PASSKEY || "").trim();
        const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');
        const accessToken = await getAccessToken();

        const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: Math.round(Number(amount)),
            PartyA: phone,
            PartyB: shortcode,
            PhoneNumber: phone,
            CallBackURL: (process.env.MPESA_CALLBACK_URL || "").trim(),
            AccountReference: "NairobiEvents",
            TransactionDesc: "Ticket Purchase"
        }, { headers: { Authorization: `Bearer ${accessToken}` } });

        // LOGIC FIX: Don't let a DB error trigger a 500 status to the user
        if (response.data.ResponseCode === "0") {
            try {
                await Booking.create({
                    user: req.user.id,
                    event: eventId,
                    ticketsCount: ticketsCount || 1,
                    totalAmount: amount,
                    mpesaCheckoutID: response.data.CheckoutRequestID,
                    paymentStatus: 'pending'
                });
                console.log(`📡 Booking Logged: ${response.data.CheckoutRequestID}`);
            } catch (dbError) {
                console.error("⚠️ DB Error (Likely Duplicate ID):", dbError.message);
                // We do NOT return an error here because the STK prompt is already on their phone
            }
        }

        return res.status(200).json(response.data);
    } catch (error) {
        console.error("❌ STK Initiation Error:", error.response?.data || error.message);
        return res.status(500).json({ 
            message: "STK Push Failed", 
            details: error.response?.data?.CustomerMessage || "Server Error" 
        });
    }
};

// --- STEP 2: HANDLE CALLBACK ---
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
            console.log(`✅ Success: Payment for ${checkoutID} confirmed.`);
        } else {
            await Booking.findOneAndUpdate({ mpesaCheckoutID: checkoutID }, { paymentStatus: 'failed' });
            console.log(`❌ Failed: Payment for ${checkoutID} cancelled.`);
        }
        res.status(200).send("OK");
    } catch (error) {
        res.status(500).send("Error");
    }
};