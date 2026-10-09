const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true },
    thumbnail_url: { type: String, required: true },
    category: { type: String, required: true, trim: true, maxlength: 60 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Template", templateSchema);
