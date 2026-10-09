const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const requireAuth = require("../config/authMiddleware");

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function makeToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
}

router.post("/register", async (req, res, next) => {
  try {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const password =
      typeof req.body?.password === "string" ? req.body.password : "";

    if (name.length < 2 || name.length > 80) {
      return res
        .status(400)
        .json({ message: "Name must be between 2 and 80 characters." });
    }
    if (!emailPattern.test(email) || email.length > 254) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }
    if (password.length < 8 || password.length > 72) {
      return res
        .status(400)
        .json({ message: "Password must be between 8 and 72 characters." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const createdUser = await User.create({ name, email, passwordHash });
    const user = { id: createdUser.id, name, email };
    return res.status(201).json({ token: makeToken(user), user });
  } catch (error) {
    if (error.code === 11000)
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const password =
      typeof req.body?.password === "string" ? req.body.password : "";
    if (
      !emailPattern.test(email) ||
      password.length === 0 ||
      password.length > 72
    ) {
      return res
        .status(400)
        .json({ message: "Enter a valid email and password." });
    }

    const user = await User.findOne({ email });
    const passwordMatches =
      user && (await bcrypt.compare(password, user.passwordHash));
    if (!passwordMatches) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect." });
    }

    const safeUser = { id: user.id, name: user.name, email: user.email };
    return res.json({ token: makeToken(safeUser), user: safeUser });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("name email");
    if (!user)
      return res
        .status(401)
        .json({ message: "This account no longer exists." });
    return res.json({
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
