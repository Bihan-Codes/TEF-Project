const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path')

const db = require("./db").promise()

require ("dotenv").config()

const app = express();
app.use(cors()); 
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')))

const loginRoute = require('./api/login_api')

app.use(express.json())

app.use('/api',loginRoute)




// 1. Gmail Configuration (Notun Password diye update kora hoyeche)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
        user: 'tittu318@gmail.com', 
        pass: 'zhzmekcqziwhcdoo' // Tomar notun App Password ekhane bosiye dilam
    },
    tls: {
        rejectUnauthorized: false 
    }
});

let otpStorage = {};

// 2. FRESH OTP Route
app.post('/send-otp', (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ message: "Email is required!" });
    }

    // Purono OTP delete kora jate bar bar notun code generate hoy
    if (otpStorage[email]) {
        delete otpStorage[email];
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStorage[email] = otp;

    const mailOptions = {
        from: '"Trijal Foundation" <tittu318@gmail.com>',
        to: email,
        subject: 'Trijal Foundation - Fresh Verification OTP',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #1f3a93; border-radius: 10px; max-width: 400px;">
                <h2 style="color: #1f3a93; text-align: center;">Verification OTP</h2>
                <hr>
                <p>Registration-er jonno tomar notun verification code holo:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <h1 style="color: #d35400; background: #f0f0f0; padding: 15px; display: inline-block; letter-spacing: 5px; border-radius: 5px;">${otp}</h1>
                </div>
                <p style="font-size: 12px; color: #666; text-align: center;">Ei code-ta shudhu ekhonkar jonno valid. Abar click korle purono code kaaj korbe na.</p>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Detailed Error:", error);
            return res.status(500).json({ message: "Error: Mail pathano jayni!" });
        }
        console.log("OTP Sent: " + otp + " to " + email);
        res.status(200).json({ message: "Notun OTP safolvabe pathano hoyeche." });
    });
});

// 3. Verify OTP Route
app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (otpStorage[email] && otpStorage[email] === otp) {
        delete otpStorage[email];
        res.status(200).json({ message: "Verification Successful!" });
    } else {
        res.status(400).json({ message: "Invalid or Expired OTP!" });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT}`);
});

// OTP Verify Route
app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    // Storage theke check korche
    if (otpStorage[email] && otpStorage[email] === otp) {
        // success holeo ekhon delete korlam na jate tumi test korte paro
        res.status(200).json({ message: "Verified" });
    } else {
        res.status(400).json({ message: "Invalid OTP" });
    }
});
app.post('/verify-phone-otp', (req, res) => {
    const { phone, otp } = req.body;
    
    // Ekhane email-er motoi phone storage theke check hobe
    if (otpStorage[phone] && otpStorage[phone] === otp) {
        res.status(200).json({ message: "Phone Verified" });
    } else {
        res.status(400).json({ message: "Invalid Phone OTP" });
    }
});
// Phone OTP Pathanor Route
app.post('/send-phone-otp', (req, res) => {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    otpStorage[phone] = otp; 

    // ASOL SMS Gateway ekhon nei, tai Terminal-e print hobe
    console.log(`>>> OTP for Phone ${phone} is: ${otp} <<<`); 
    
    res.status(200).json({ message: "OTP sent! Check VS Code Terminal for the code." });
});

// Phone OTP Verify Route
app.post('/verify-phone-otp', (req, res) => {
    const { phone, otp } = req.body;
    if (otpStorage[phone] && otpStorage[phone] === otp) {
        res.status(200).json({ message: "Phone Verified" });
    } else {
        res.status(400).json({ message: "Invalid OTP" });
    }
});