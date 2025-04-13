const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  widthFeet: { type: Number, required: true },  // Width in Feet
  widthCm: { type: Number, required: true },    // Width in CM
  heightFeet: { type: Number, required: function () { return !this.isRound; } }, // Height in Feet (if not round)
  heightCm: { type: Number, required: function () { return !this.isRound; } },  // Height in CM (if not round)
  isRound: { type: Boolean, default: false },   // If true, it's a round size
});

module.exports = mongoose.model("Size", sizeSchema);
