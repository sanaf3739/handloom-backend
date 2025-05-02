const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, minlength: 2 },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    subject: { type: String, required: true, minlength: 3 },
    message: { type: String, required: true, minlength: 10 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
