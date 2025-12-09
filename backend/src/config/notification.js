const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();
const sender = nodemailer.createTransport({
  // host: "smtp.gmail.com",
  // port: 587,
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = sender;
