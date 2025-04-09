const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send WhatsApp message
 * @param {string} to - WhatsApp number (with "whatsapp:" prefix)
 * @param {string} message - The message content
 */
async function sendWhatsApp(to, message) {
  try {
    const response = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to,
      body: message,
    });
    console.log("✅ WhatsApp sent to:", to);
    return response;
  } catch (err) {
    console.error("❌ Failed to send WhatsApp:", err.message);
  }
}

module.exports = sendWhatsApp;
