// Run with: node seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const Product  = require("./models/Product");
const User     = require("./models/User");

const products = [
  { name: "Wireless Headphones Pro",  category: "Electronics", price: 2999, stock: 15, image: "🎧", description: "Noise-cancelling, 30hr battery, foldable design." },
  { name: "Smart Watch Series X",     category: "Electronics", price: 5499, stock: 8,  image: "⌚", description: "GPS, SpO2 sensor, AMOLED always-on display." },
  { name: "Mechanical Keyboard TKL",  category: "Electronics", price: 1599, stock: 20, image: "⌨️", description: "Tactile switches, per-key RGB, aluminium frame." },
  { name: "Premium Leather Jacket",   category: "Fashion",     price: 3999, stock: 5,  image: "🧥", description: "Full-grain leather, quilted inner lining." },
  { name: "Cloud Run Sneakers",       category: "Fashion",     price: 1299, stock: 12, image: "👟", description: "Responsive foam sole, breathable mesh upper." },
  { name: "Ceramic Coffee Mug Set",   category: "Home",        price: 599,  stock: 30, image: "☕", description: "Set of 4 handcrafted mugs, 350 ml each." },
  { name: "Scented Candle Trio",      category: "Home",        price: 899,  stock: 25, image: "🕯️", description: "Vanilla · Cedarwood · Jasmine, 40hr burn each." },
  { name: "Design Thinking Handbook", category: "Books",       price: 449,  stock: 40, image: "📚", description: "Human-centered design from ideation to launch." },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Create default admin
  const adminExists = await User.findOne({ email: "admin@bazaar.com" });
  if (!adminExists) {
    await User.create({ name: "Admin", email: "admin@bazaar.com", password: "admin123", role: "admin" });
    console.log("✅ Admin created — admin@bazaar.com / admin123");
  }

  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`✅ ${products.length} products seeded`);

  mongoose.disconnect();
}

seed().catch(console.error);
