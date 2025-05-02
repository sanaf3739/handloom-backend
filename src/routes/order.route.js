const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

// Create a new order (authenticated users only)
router.post("/", authMiddleware, orderController.createOrder);

// Get all orders for the logged-in user
router.get("/", authMiddleware, orderController.getOrders);

// Get a specific order by ID
router.get("/:orderId", authMiddleware, orderController.getOrderById);

// Cancel an order
router.patch("/:orderId/cancel", authMiddleware, orderController.cancelOrder);

module.exports = router;
