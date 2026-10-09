require("dotenv").config();

const mongoose = require("mongoose");
const { connectDatabase, resetDatabase } = require("./database");

async function reset() {
  try {
    await connectDatabase();
    await resetDatabase();
    console.log("Database reset. Sample templates have been restored.");
  } catch (error) {
    console.error("Could not reset the database:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

reset();
