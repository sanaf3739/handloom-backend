const express = require("express");
const { addToCart, getCart, removeFromCart, updateCart, clearCart } = require("../controllers/cart.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.get("/", authMiddleware, getCart);
router.post("/add", authMiddleware, addToCart);
router.put("/update", authMiddleware, updateCart);
router.delete("/remove/:productId", authMiddleware, removeFromCart);
router.delete("/clear", authMiddleware, clearCart);

module.exports = router;
