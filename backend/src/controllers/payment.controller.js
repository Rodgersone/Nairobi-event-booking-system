const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Generates a strictly formatted timestamp: YYYYMMDDHHMMSS
 */
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

/**
 * Gets the OAuth Access Token from Safaricom
 */
const getAccessToken = async () => {
    const key = (process.env.MPESA_CONSUMER_KEY || "").trim();
    const secret = (process.env.MPESA_CONSUMER_SECRET || "").trim();

    if (!key || !secret) {
        throw new Error("Missing M-Pesa Consumer Key or Secret in .env");
    }

    const auth = Buffer.from(`${key}:${secret}`).toString('base64');

    try {
        console.log("🔍 Fetching M-Pesa Access Token...");
        const response = await axios.get(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            { headers: { Authorization: `Basic ${auth}` } }
        );
        console.log("✅ Access Token Obtained successfully");
        return response.data.access_token;
    } catch (error) {
        console.error("❌ Auth Error:", error.response?.data || error.message);
        throw new Error("M-Pesa Authentication Failed. Check keys in .env");
    }
};

/**
 * Initiates the STK Push (Lipa Na M-Pesa Online)
 */
exports.stkPush = async (req, res) => {
    try {
        let { amount, phoneNumber } = req.body;

        // 1. Advanced Phone Formatting (Ensures 2547... format)
        // Removes any non-numeric characters like '+'
        let cleanedPhone = phoneNumber.replace(/\D/g, '');
        
        if (cleanedPhone.startsWith('0')) {
            cleanedPhone = `254${cleanedPhone.substring(1)}`;
        } else if (cleanedPhone.startsWith('7') || cleanedPhone.startsWith('1')) {
            cleanedPhone = `254${cleanedPhone}`;
        } else if (!cleanedPhone.startsWith('254')) {
            return res.status(400).json({ message: "Invalid Kenyan phone number format." });
        }

        if (!amount || !cleanedPhone) {
            return res.status(400).json({ message: "Amount and Phone Number are required." });
        }

        // 2. Credentials from .env
        const timestamp = getTimeStamp();
        const shortcode = (process.env.MPESA_SHORTCODE || "").trim();
        const passkey = (process.env.MPESA_PASSKEY || "").trim();
        const callbackUrl = (process.env.MPESA_CALLBACK_URL || "").trim();

        const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');

        // 3. Authorization
        const accessToken = await getAccessToken();

        // 4. M-Pesa Request
        console.log(`🚀 Sending STK Push: KES ${amount} to ${cleanedPhone}`);
        
        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                BusinessShortCode: shortcode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: "CustomerPayBillOnline",
                Amount: Math.round(Number(amount)),
                PartyA: cleanedPhone,
                PartyB: shortcode,
                PhoneNumber: cleanedPhone,
                CallBackURL: callbackUrl,
                AccountReference: "NairobiEvents",
                TransactionDesc: "Ticket Payment"
            },
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        console.log("✅ Safaricom Success:", response.data.CustomerMessage);
        res.status(200).json(response.data);

    } catch (error) {
        const errorDetail = error.response?.data || error.message;
        console.error("❌ STK Push Failed:", errorDetail);
        res.status(500).json({ message: "STK Push Failed", details: errorDetail });
    }
};