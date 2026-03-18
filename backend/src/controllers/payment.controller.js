const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// Helper to generate Safaricom TimeStamp
const getTimeStamp = () => {
    const date = new Date();
    return (
        date.getFullYear() +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        ("0" + date.getDate()).slice(-2) +
        ("0" + date.getHours()).slice(-2) +
        ("0" + date.getMinutes()).slice(-2) +
        ("0" + date.getSeconds()).slice(-2)
    );
};

// @desc    Initiate M-Pesa STK Push
// @route   POST /api/payments/stk-push
// @access  Private
exports.stkPush = async (req, res) => {
    try {
        const { amount, phoneNumber } = req.body;

        // 1. Format Phone Number (Ensures 254...)
        const phone = phoneNumber.startsWith('0') 
            ? `254${phoneNumber.substring(1)}` 
            : phoneNumber;

        const timestamp = getTimeStamp();
        const shortcode = process.env.MPESA_PAYBILL || '174379';
        const passkey = process.env.MPESA_PASSKEY;
        
        // Generate Password
        const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');

        // Note: You would normally get the access_token from a middleware/service
        const accessToken = req.token; 

        const stkData = {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount, // KES
            PartyA: phone,
            PartyB: shortcode,
            PhoneNumber: phone,
            CallBackURL: "https://yourdomain.com/api/payments/callback",
            AccountReference: "NairobiEvents",
            TransactionDesc: "Event Booking Payment"
        };

        // For now, since we are debugging connectivity, we return success manually
        // Once your Daraja credentials are in .env, use axios.post to Safaricom
        console.log("✅ STK Push Payload Ready:", stkData);

        res.status(200).json({
            ResponseCode: "0",
            CustomerMessage: "Success. Request accepted for processing",
            CheckoutRequestID: "ws_CO_123456789" // Mock ID for testing
        });

    } catch (error) {
        console.error("❌ M-Pesa Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "STK Push Failed", error: error.message });
    }
};