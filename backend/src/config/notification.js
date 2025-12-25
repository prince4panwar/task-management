const nodemailer = require("nodemailer");
require("dotenv").config();

const sender = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // REQUIRED
  secure: false,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

sender.verify((error, success) => {
  if (error) {
    console.error("❌ Email server error:", error.message);
  } else {
    console.log("✅ Email server ready");
  }
});

module.exports = sender;
