const express = require("express");
const Cart    = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect); // all cart routes require login

// ─── GET /api/cart ────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/cart ───────────────────────────────────────────────────────────
// Body: { productId, qty }  — adds item or increments qty
router.post("/", async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product)         return res.status(404).json({ message: "Product not found" });
    if (product.stock < qty) return res.status(400).json({ message: "Insufficient stock" });

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [{ product: productId, qty }] });
    } else {
      const idx = cart.items.findIndex((i) => i.product.toString() === productId);
      if (idx > -1) cart.items[idx].qty += qty;
      else          cart.items.push({ product: productId, qty });
      await cart.save();
    }

    await cart.populate("items.product");
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PUT /api/cart/:productId ─────────────────────────────────────────────────
// Body: { qty }  — set exact quantity (0 = remove)
router.put("/:productId", async (req, res) => {
  try {
    const { qty } = req.body;
    const cart    = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    if (qty <= 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    } else {
      const item = cart.items.find((i) => i.product.toString() === req.params.productId);
      if (item) item.qty = qty;
    }

    await cart.save();
    await cart.populate("items.product");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── DELETE /api/cart/:productId ──────────────────────────────────────────────
router.delete("/:productId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();
    res.json({ message: "Item removed", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── DELETE /api/cart ─────────────────────────────────────────────────────────
// Clear entire cart (called after checkout)
router.delete("/", async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
