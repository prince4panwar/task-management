// const nodemailer = require("nodemailer");
// const dotenv = require("dotenv");

// dotenv.config();
// const sender = nodemailer.createTransport({
//   // host: "smtp.gmail.com",
//   // port: 587,
//   service: "Gmail",
//   auth: {
//     user: process.env.EMAIL_ID,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// module.exports = sender;

const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sender = {
  sendMail: async ({ to, subject, text, html }) => {
    return await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to,
      subject,
      text,
      html,
    });
  },
};

module.exports = sender;
