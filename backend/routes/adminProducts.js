const express = require("express");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();
router.use(protect, adminOnly); // ALL routes here: admin only

// ─── GET /api/admin/products ──────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/admin/products ─────────────────────────────────────────────────
// Body: { name, description, price, category, stock, image }
router.post("/", async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;
    if (!name || !price || !category)
      return res.status(400).json({ message: "name, price and category are required" });

    const product = await Product.create({
      name, description, price, category, stock, image, createdBy: req.user._id,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PUT /api/admin/products/:id ─────────────────────────────────────────────
// Body: any subset of product fields to update
router.put("/:id", async (req, res) => {
  try {
    const allowed = ["name", "description", "price", "category", "stock", "image"];
    const updates = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── DELETE /api/admin/products/:id ──────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: `Product "${product.name}" deleted` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
