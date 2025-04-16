const express = require("express");
const axios = require("axios");
const router = express.Router();
const nodemailer = require("nodemailer");
const Request = require("../models/Request");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const crypto = require("crypto");
const session = require("express-session");

// Session middleware (you can move this to your main app.js/server.js)
router.use(
  session({
    secret: process.env.SESSION_SECRET || "secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// Setup Nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Step 1: Redirect to Google OAuth consent screen
router.get("/auth/google", (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.BACKEND_URL}/requests/auth/google/callback`
  );

  const state = crypto.randomBytes(32).toString("hex");
  req.session.state = state;

  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
    include_granted_scopes: true,
    state,
  });

  res.redirect(url);
});

// Step 2: Google OAuth callback
router.get("/auth/google/callback", async (req, res) => {
  const { code, state } = req.query;

  if (state !== req.session.state) {
    return res.status(403).send("Invalid state");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.BACKEND_URL}/requests/auth/google/callback`
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const { data: profile } = await oauth2.userinfo.get();

    const user = {
      email: profile.email,
      name: profile.name,
    };

    console.log("the user is ", user);

    // Generate JWT
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.redirect(`${process.env.FRONTEND_URL}/oauth-error`);
  }
});

// Authenticated POST to save request and send email
router.post("/", async (req, res) => {
  const { category, comments } = req.body;
  const authHeader = req.headers.authorization;
  console.log("🔐 Incoming auth header:", authHeader);

  try {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ Missing or malformed Authorization header");
      return res.status(401).json({ error: "Token missing or malformed" });
    }

    const token = authHeader.split(" ")[1];
    console.log("🔑 Extracted token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded JWT payload:", decoded);

    const email = decoded.email;
    if (!email) {
      console.log("❌ No email found in token");
      return res.status(400).json({ error: "Invalid token payload" });
    }

    console.log("📩 Email extracted from token:", email);
    console.log("📝 Request data:", { category, comments });

    const newRequest = new Request({ category, comments, email });
    await newRequest.save();
    console.log("✅ Request saved to database");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `New Feedback Received [${category}]`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <div style="background-color: #4A90E2; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">📣 New Customer Feedback</h2>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p style="font-size: 16px; color: #333;"><strong>Category:</strong> <span style="color: #4A90E2;">${category}</span></p>
            <p style="font-size: 16px; color: #333;"><strong>Comments:</strong></p>
            <blockquote style="background: #e6f0ff; border-left: 5px solid #4A90E2; margin: 10px 0; padding: 10px 15px; font-style: italic; color: #444;">
              ${comments}
            </blockquote>
            <p style="font-size: 14px; color: #777; text-align: right;">— From <strong>${email}</strong></p>
          </div>
          <div style="background-color: #4A90E2; color: white; padding: 10px; text-align: center;">
            <small>Thank you for staying in touch with us!</small>
          </div>
        </div>
      `
    };
    

    console.log("📧 Sending email with options:", mailOptions);
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");

    res.status(201).json({ message: "Request saved & email sent" });
  } catch (err) {
    console.error("❌ Request error:", err.message);
    res.status(500).json({ error: "Request failed" });
  }
});

// Get all or filter by category
router.get("/", async (req, res) => {
  const { category } = req.query;
  try {
    const requests = await Request.find(category ? { category } : {});
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

module.exports = router;
