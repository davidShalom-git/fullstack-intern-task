const mongoose = require("mongoose");
const User = require("../models/User");
const Template = require("../models/Template");
const Favorite = require("../models/Favorite");

const starterTemplates = [
  {
    name: "Studio Portfolio",
    description:
      "A calm, editorial portfolio for designers and independent studios.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    category: "Portfolio",
  },
  {
    name: "Northstar Dashboard",
    description:
      "A focused analytics dashboard with clear charts and useful summaries.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85",
    category: "Dashboard",
  },
  {
    name: "Sunday Market",
    description:
      "A warm storefront template for small shops and thoughtful products.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85",
    category: "E-commerce",
  },
  {
    name: "Fieldnotes Journal",
    description:
      "A readable blog layout made for long-form writing and photography.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=85",
    category: "Blog",
  },
  {
    name: "Launchpad SaaS",
    description:
      "A straightforward landing page for a new product or software service.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=85",
    category: "Landing page",
  },
  {
    name: "Gather Events",
    description:
      "A clean event page for sharing a schedule, speakers, and registration details.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=85",
    category: "Events",
  },
];

async function connectDatabase() {
  const uri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/template-store";
  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");
}

async function seedTemplates() {
  if ((await Template.countDocuments()) === 0) {
    await Template.insertMany(starterTemplates);
    console.log(`Added ${starterTemplates.length} sample templates.`);
  }
}

async function resetDatabase() {
  await Promise.all([
    User.deleteMany({}),
    Favorite.deleteMany({}),
    Template.deleteMany({}),
  ]);
  await seedTemplates();
}

module.exports = { connectDatabase, seedTemplates, resetDatabase };
