// userContactConfirmation.js
module.exports = function userContactConfirmation(contact) {
  return {
    subject: `Thank you for contacting Ibrahim Rugs, ${contact.fullName}`,
    text: `Hi ${contact.fullName},\n\nWe’ve received your message and will get back to you shortly.\n\nSubject: ${contact.subject}\nMessage: ${contact.message}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Thank You for Reaching Out 🙏</h2>
        <p>Hi ${contact.fullName},</p>
        <p>We’ve received your message and will get back to you as soon as possible.</p>
        <h4>Your Message Summary:</h4>
        <ul>
          <li><strong>Email:</strong> ${contact.email}</li>
          <li><strong>Phone:</strong> ${contact.phone}</li>
          <li><strong>Subject:</strong> ${contact.subject}</li>
          <li><strong>Message:</strong> ${contact.message}</li>
        </ul>
        <p>Warm regards,<br><strong>Ibrahim Rugs Team</strong></p>
      </div>
    `
  };
};
