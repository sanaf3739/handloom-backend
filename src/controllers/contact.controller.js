const contactSchema = require("../validators/contact.validator");
const Contact = require("../models/contact.model.js");
const userContactConfirmation = require("../services/emails/templates/userContactConfirmation.js");
const adminContactAlert = require("../services/emails/templates/adminContactAlert.js");
const sendEmail = require("../services/emailService.js");
const handleContact = async (req, res) => {
  console.log(req.body);
  try {
    const { data, error } = contactSchema.safeParse(req.body);

    if (error) {
      const formattedErrors = {};
      error.errors.forEach((error) => {
        formattedErrors[error.path[0]] = error.message;
      });
      return res.status(400).json({ success: false, errors: formattedErrors });
    }

    const newContact = new Contact(data);
    await newContact.save();
    await sendContactEmail(newContact)
    return res
      .status(200)
      .json({ success: true, message: "Contact form submitted and saved." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = {
  handleContact,
};

async function sendContactEmail(contact) {
  // send email to the user
  const userEmail = userContactConfirmation(contact);
  await sendEmail({
    to: contact.email,
    ...userEmail,
  });

  // send email to the admin
  const adminEmail = adminContactAlert(contact);
  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    ...adminEmail,
  });
}
