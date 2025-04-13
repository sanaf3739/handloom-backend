const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: function () {
        return Math.ceil(((this.originalPrice - this.price) / this.originalPrice) * 100);
      },
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },
    size: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Size",
      required: true,
    }, // Reference Size collection
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    }, // Reference Category collection
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ], // Store image filename (backend handles Cloudinary),
    stock: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
