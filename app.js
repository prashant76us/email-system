import dotenv from "dotenv";
dotenv.config();

import express from "express";
import pool from "./config/db.js";
import mg from "./config/mailgun.js";
import logger from "./utils/logger.js";

import webinarRoutes from "./routes/webinarRoutes.js";
import stmKoshRoutes from "./routes/stmKoshRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());


// Health route
app.get("/", (req, res) => {
  res.send("✅ Dozen Diamonds Email System is running...");
});

// Routes
app.use("/api/webinar", webinarRoutes);
app.use("/api/stm-kosh", stmKoshRoutes);

// Test DB connection
(async () => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    logger.info("✅ Database connected successfully");
 } catch (err) {
    logger.error(`❌ Database connection failed: ${err.message}`);
    logger.error(`📍 Host: ${process.env.DB_HOST}`);
    logger.error(`👤 User: ${process.env.DB_USER}`);
    logger.error(`📚 Database: ${process.env.DB_NAME}`);
  }
})();

// Test Mailgun connection
(async () => {
  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: process.env.FROM_EMAIL,
      to: "test@example.com", // test only
      subject: "Mailgun Test Connection",
      text: "Mailgun setup successful!",
    });
    logger.info("✅ Mailgun connected successfully");
  } catch (err) {
    logger.error("❌ Mailgun connection failed: " + err.message);
  }
})();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`))
  .on("error", (err) => logger.error(`❌ Server failed to start: ${err.message}`));
