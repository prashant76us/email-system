// config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

logger.info("🧩 Initializing MySQL connection pool...");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

logger.info("✅ MySQL pool created successfully");

// Test the DB connection once
(async () => {
  try {
    logger.info("🧠 Testing database connection...");
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    logger.info("✅ Database connected successfully");
  } catch (err) {
    logger.error("❌ Database connection failed: " + err.message);
    logger.error(`📍 Host: ${process.env.DB_HOST}`);
    logger.error(`👤 User: ${process.env.DB_USER}`);
    logger.error(`🔐 Password starts with: ${process.env.DB_PASSWORD?.substring(0, 3)}***`);
    logger.error(`📚 Database: ${process.env.DB_NAME}`);
  }
})();

export default pool;
