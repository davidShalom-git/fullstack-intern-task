const express = require("express");
const mongoose = require("mongoose");
const Favorite = require("../models/Favorite");
const Template = require("../models/Template");
const requireAuth = require("../config/authMiddleware");

const router = express.Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id })
      .populate("templateId")
      .sort({ createdAt: -1 })
      .lean();
    const templates = favorites
      .filter((favorite) => favorite.templateId)
      .map(({ templateId }) => ({
        id: templateId._id.toString(),
        name: templateId.name,
        description: templateId.description,
        thumbnail_url: templateId.thumbnail_url,
        category: templateId.category,
      }));
    return res.json({ templates });
  } catch (error) {
    return next(error);
  }
});

router.post("/:templateId", async (req, res, next) => {
  try {
    const templateId = req.params.templateId;
    if (!mongoose.isValidObjectId(templateId)) {
      return res.status(400).json({ message: "Template id is invalid." });
    }
    const template = await Template.findById(templateId).select("_id");
    if (!template)
      return res.status(404).json({ message: "Template not found." });

    const existing = await Favorite.findOne({
      userId: req.user.id,
      templateId,
    });
    if (existing)
      return res
        .status(200)
        .json({ message: "This template is already in your favorites." });

    await Favorite.create({ userId: req.user.id, templateId });
    return res.status(201).json({ message: "Template added to favorites." });
  } catch (error) {
    if (error.code === 11000)
      return res
        .status(200)
        .json({ message: "This template is already in your favorites." });
    return next(error);
  }
});

router.delete("/:templateId", async (req, res, next) => {
  try {
    const templateId = req.params.templateId;
    if (!mongoose.isValidObjectId(templateId))
      return res.status(400).json({ message: "Template id is invalid." });
    const removed = await Favorite.findOneAndDelete({
      userId: req.user.id,
      templateId,
    });
    if (!removed)
      return res.status(404).json({ message: "Favorite not found." });
    return res.json({ message: "Template removed from favorites." });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
