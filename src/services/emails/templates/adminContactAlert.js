// adminContactAlert.js
module.exports = function adminContactAlert(contact) {
  return {
    subject: `New Contact Form Submission from ${contact.fullName}`,
    text: `New message from ${contact.fullName}:\nEmail: ${contact.email}\nPhone: ${contact.phone}\nSubject: ${contact.subject}\nMessage: ${contact.message}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Contact Form Submission 🚨</h2>
        <ul>
          <li><strong>Name:</strong> ${contact.fullName}</li>
          <li><strong>Email:</strong> ${contact.email}</li>
          <li><strong>Phone:</strong> ${contact.phone}</li>
          <li><strong>Subject:</strong> ${contact.subject}</li>
          <li><strong>Message:</strong> ${contact.message}</li>
        </ul>
        <p>Please respond to this message promptly.</p>
      </div>
    `
  };
};
