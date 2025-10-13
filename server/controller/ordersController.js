const Order = require("../models/Order");
const mongoose = require("mongoose");

/**
 * Create a new order (status: pending until paid)
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { products, totalAmount, shippingAddress, shippingMethod, paymentMethod } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products are required" });
    }

    if (!totalAmount || typeof totalAmount !== "number") {
      return res.status(400).json({ message: "totalAmount (number) is required" });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.city ||
      !shippingAddress.district ||
      !shippingAddress.phone
    ) {
      return res.status(400).json({ message: "Complete shippingAddress is required" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: "paymentMethod is required" });
    }

    // ✅ Use "new" before ObjectId
    const order = new Order({
      account: req.user.id,
      products: products.map((p) => ({
        product: new mongoose.Types.ObjectId(p.product),
        quantity: p.quantity,
        price: p.price,
      })),
      totalAmount,
      shippingAddress,
      shippingMethod,
      paymentMethod,
    });

    await order.save();

    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    console.error("Error creating order:", err);
    next(err);
  }
};

/**
 * Get all orders for the logged-in user
 */
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate("products.product", "name price image")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (err) {
    next(err);
  }
};
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ account: req.user.id })
      .populate("products.product", "name price image")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

/**
 * Get a single order (must belong to logged-in user)
 */
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid order id" });

    const order = await Order.findById(id).populate("products.product", "name price image");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.account.toString() !== req.user.id && req.user.role==!"admin")
      return res.status(403).json({ message: "Not authorized" });
    res.json({ order });
  } catch (err) {
    next(err);
  }
};

/**
 * Cancel order — only if it's still pending
 */
exports.cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid order id" });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.account.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    if (order.orderStatus !== "pending") {
      return res.status(400).json({ message: "Only pending orders can be cancelled" });
    }

    order.orderStatus = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    next(err);
  }
};

/**
 * Mark an order as paid
 */
exports.markOrderPaid = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid order id" });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.account.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "Order already paid" });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "paid";
    await order.save();

    res.json({ message: "Order marked as paid", order });
  } catch (err) {
    next(err);
  }
};
