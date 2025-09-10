const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendAlertEmail = async ({ subject, text, to }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
    });
    console.log("📨 Alert email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
  }
};

module.exports = sendAlertEmail;
