const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for 587
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      logger.info('✅ Email transporter initialized');
    } catch (error) {
      logger.error('❌ Failed to initialize email transporter:', error);
    }
  }

  async sendEmail({ to, subject, text, html }) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`📨 Email sent: ${info.messageId}`);
    } catch (error) {
      logger.error('❌ Failed to send email:', error);
    }
  }
}

module.exports = new EmailService();
