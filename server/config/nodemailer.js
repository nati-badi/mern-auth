import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Use "service" instead of "host" for Gmail
  port: 465, // Port
  secure: true, // This is important for Gmail
  auth: {
    user: process.env.SMTP_USER, // Your Gmail address
    pass: process.env.SMTP_PASS, // App Password (not your real password)
  },
});

export default transporter;
