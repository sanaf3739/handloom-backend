const nodemailer = require("nodemailer");

// Create and export a reusable transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string|string[]} options.to - Recipient(s)
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text version
 * @param {string} options.html - HTML version
 * @param {Array} [options.attachments] - Optional attachments
 */
async function sendEmail({ to, subject, text, html, attachments = [] }) {
  try {
    await transporter.sendMail({
      from: `"Ibrahim Handloom" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
      attachments,
    });
    console.log("✅ Email sent to:", to);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
}

module.exports = sendEmail;
