const Cart = require("../models/cart.model.js");
const Product = require("../models/product.model.js");

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.productId");

    //custom populate for product
    // {
    //     path:"items.productId",
    //     select: "image title"
    // }
    return res.json(cart ? cart.items : []);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const addToCart = async (req, res) => {
  // extract the product id and quantity from the request body
  const { productId, quantity } = req.body;

  // validate the data

  try {
    // if the product id is not provided then sent the validation error
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "ProductId field is required",
      });
    } else {
      // check if the given product id is exists or not
      const product = await Product.findById({ productId });
      if (!product) {
        return res.status(400).json({
          success: false,
          message: "Invalid Product ID",
        });
      }
    }
    // check if the provided quantity is not lte 0
    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity",
      });
    }
    // check if the cart is already exists
    let cart = await Cart.findOne({ user: req.user._id });
    // if the cart is not exists then create a new cart
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }
    // if the cart is already exists then find the current index of the given product by product id
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    return res.status(200).json(cart.items);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "ProductId field is required",
      });
    } else {
      // check if the given product id is exists or not
      const product = await Product.findById({ productId });
      if (!product) {
        return res.status(400).json({
          success: false,
          message: "Invalid Product ID",
        });
      }
    }
    // check if the provided quantity is not lte 0
    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity",
      });
    }
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      return res.json(cart.items);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== req.params.productId
    );
    await cart.save();
    return res.json(cart.items);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error?.message || "internal server error" });
  }
};

const clearCart = async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.json({ message: "Cart cleared" });
};

module.exports = { getCart, addToCart, updateCart, removeFromCart, clearCart };
