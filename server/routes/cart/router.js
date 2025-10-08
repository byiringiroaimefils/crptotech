const express = require("express");
const Cart = require("../../models/Cart");
const { Auth } = require("../../middleware/Auth");

const router = express.Router();

// GET user cart
router.get("/", Auth, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
  res.json(cart || { items: [] });
});

// ADD or UPDATE item
router.post("/", Auth, async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) {
    cart = new Cart({ userId: req.user.id, items: [] });
  }

  const existingItem = cart.items.find((item) => item.productId.equals(productId));
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();
  res.json(cart);
});

// REMOVE item
router.delete("/:productId", Auth, async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ userId: req.user.id });

  if (cart) {
    cart.items = cart.items.filter((item) => !item.productId.equals(productId));
    await cart.save();
  }

  res.json(cart);
});

module.exports = router;
