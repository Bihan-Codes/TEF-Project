const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// 🔥 CRASH PROTECTION
process.on('uncaughtException', err => {
    console.error("UNCAUGHT:", err);
});

process.on('unhandledRejection', err => {
    console.error("UNHANDLED:", err);
});

// 🔥 DB CONNECTION
const db = require("./db");

const app = express();

// 🔥 MIDDLEWARE (CLEAN ORDER)
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// 🔥 STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

// 🔥 ROOT ROUTE (IMPORTANT FOR RAILWAY)
app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

// 🔥 ROUTES
const loginRoute = require('./api/login_api');
app.use('/api', loginRoute);

// ================= EMAIL CONFIG =================
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'tittu318@gmail.com',
        pass: 'zhzmekcqziwhcdoo'
    },
    tls: {
        rejectUnauthorized: false
    }
});

// ================= OTP STORAGE =================
let otpStorage = {};

// ================= SEND EMAIL OTP =================
app.post('/send-otp', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required!" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStorage[email] = otp;

    const mailOptions = {
        from: '"Trijal Foundation" <tittu318@gmail.com>',
        to: email,
        subject: 'Verification OTP',
        html: `
            <div style="font-family: Arial; padding: 20px;">
                <h2>Verification OTP</h2>
                <h1>${otp}</h1>
                <p>This OTP is valid for one time use only.</p>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.error("Mail Error:", error);
            return res.status(500).json({ message: "Failed to send OTP" });
        }
        console.log(`OTP Sent to ${email}: ${otp}`);
        res.json({ message: "OTP sent successfully" });
    });
});

// ================= VERIFY EMAIL OTP =================
app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (otpStorage[email] && otpStorage[email] === otp) {
        delete otpStorage[email];
        return res.json({ message: "Verified" });
    }

    res.status(400).json({ message: "Invalid OTP" });
});

// ================= SEND PHONE OTP =================
app.post('/send-phone-otp', (req, res) => {
    const { phone } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStorage[phone] = otp;

    console.log(`OTP for ${phone}: ${otp}`);

    res.json({ message: "OTP sent (check server logs)" });
});

// ================= VERIFY PHONE OTP =================
app.post('/verify-phone-otp', (req, res) => {
    const { phone, otp } = req.body;

    if (otpStorage[phone] && otpStorage[phone] === otp) {
        delete otpStorage[phone];
        return res.json({ message: "Phone Verified" });
    }

    res.status(400).json({ message: "Invalid OTP" });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Started on port ${PORT}`);
});