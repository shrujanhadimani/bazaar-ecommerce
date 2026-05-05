const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// ─── GET /api/products ────────────────────────────────────────────────────────
// Query params: ?search=keyword&category=Electronics&page=1&limit=20
router.get("/", async (req, res) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (category && category !== "All") filter.category = category;
    if (search)   filter.$text = { $search: search };

    const skip     = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Product.countDocuments(filter),
    ]);

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/products/:id ────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
