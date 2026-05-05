const express = require("express");
const Order   = require("../models/Order");
const Cart    = require("../models/Cart");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

// ─── GET /api/orders ──────────────────────────────────────────────────────────
// Returns order history for the logged-in customer
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/orders/:id ──────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/orders ─────────────────────────────────────────────────────────
// Checkout: converts cart → order, deducts stock, clears cart
router.post("/", async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    // Validate stock for each item
    for (const item of cart.items) {
      if (item.product.stock < item.qty)
        return res.status(400).json({ message: `Insufficient stock for ${item.product.name}` });
    }

    // Build order items snapshot
    const items = cart.items.map((i) => ({
      product: i.product._id,
      name:    i.product.name,
      price:   i.product.price,
      qty:     i.qty,
    }));

    const total = items.reduce((s, i) => s + i.price * i.qty, 0);

    // Create order
    const order = await Order.create({ user: req.user._id, items, total });

    // Deduct stock
    await Promise.all(
      cart.items.map((i) =>
        Product.findByIdAndUpdate(i.product._id, { $inc: { stock: -i.qty } })
      )
    );

    // Clear cart
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PUT /api/orders/:id/status ── (admin only) ───────────────────────────────
router.put("/:id/status", adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
