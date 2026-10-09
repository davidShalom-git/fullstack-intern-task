const express = require("express");
const mongoose = require("mongoose");
const Template = require("../models/Template");

function publicTemplate(template) {
  return {
    id: template._id.toString(),
    name: template.name,
    description: template.description,
    thumbnail_url: template.thumbnail_url,
    category: template.category,
  };
}

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const templates = await Template.find()
      .sort({ createdAt: 1, _id: 1 })
      .lean();
    return res.json({ templates: templates.map(publicTemplate) });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Template id is invalid." });
    const template = await Template.findById(id).lean();
    if (!template)
      return res.status(404).json({ message: "Template not found." });
    return res.json({ template: publicTemplate(template) });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
