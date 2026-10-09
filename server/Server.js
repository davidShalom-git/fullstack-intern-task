require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectDatabase, seedTemplates } = require("./config/database");
const userRouter = require("./router/User");
const templatesRouter = require("./router/Templates");
const favoritesRouter = require("./router/Favorites");

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 24) {
  throw new Error("JWT_SECRET must contain at least 24 characters.");
}

const app = express();
const port = Number(process.env.PORT) || 4000;
let databaseReady;

function ensureDatabase() {
  if (!databaseReady) {
    databaseReady = connectDatabase()
      .then(seedTemplates)
      .catch((error) => {
        databaseReady = null;
        throw error;
      });
  }

  return databaseReady;
}

// Middleware reads and prepares incoming requests before they reach a route.
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "10kb" }));

// A Vercel function can start without a warm database connection.
app.use((_req, _res, next) => {
  ensureDatabase().then(() => next()).catch(next);
});

// API routes are grouped by the kind of data they work with.
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", userRouter);
app.use("/api/templates", templatesRouter);
app.use("/api/favorites", favoritesRouter);

// Return a clear response when no route matches the request.
app.use((_req, res) => res.status(404).json({ message: "Route not found." }));

// Handle errors passed from route handlers in one place.
app.use((error, _req, res, _next) => {
  console.error(error);

  const statusCode =
    Number.isInteger(error.status) && error.status >= 400 && error.status < 500
      ? error.status
      : 500;
  const message =
    statusCode === 500
      ? "Something went wrong. Please try again."
      : "The request could not be read. Check the submitted data and try again.";

  return res.status(statusCode).json({ message });
});

async function startServer() {
  try {
    await ensureDatabase();

    app.listen(port, () => {
      console.log(`Template Store API is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Could not start the server:", error.message);
    process.exitCode = 1;
  }
}

module.exports = { app, startServer };
