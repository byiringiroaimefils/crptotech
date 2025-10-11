const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController");
const requireAuth = require("../middleware/Auth"); // your JWT auth middleware

// All routes require authentication
router.use(requireAuth.Auth);

// Create order
router.post("/", ordersController.createOrder);

// Get current user's orders
router.get("/", ordersController.getMyOrders);
// Get current user's orders
router.get("/all", ordersController.getAllOrders);

// Get specific order
router.get("/:id", ordersController.getOrderById);

// Cancel order
router.put("/:id/cancel", ordersController.cancelOrder);

// Mark order as paid (optional; use with caution — better via verified payment webhook)
router.post("/:id/pay", ordersController.markOrderPaid);

module.exports = router;