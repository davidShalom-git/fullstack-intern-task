const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      required: true,
    },
  },
  { timestamps: true },
);

favoriteSchema.index({ userId: 1, templateId: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
