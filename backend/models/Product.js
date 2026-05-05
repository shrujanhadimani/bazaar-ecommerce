const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price:       { type: Number, required: true, min: 0 },
    category:    { type: String, enum: ["Electronics", "Fashion", "Home", "Books"], required: true },
    stock:       { type: Number, default: 0, min: 0 },
    image:       { type: String, default: "📦" }, // emoji icon
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Full-text search index on name + description
productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
