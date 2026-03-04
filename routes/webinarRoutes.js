// routes/webinarRoutes.js
import express from "express";
import { sendSingleWebinar,sendBulkWebinar } from "../controllers/webinarController.js";

const router = express.Router();

/**
 * POST /api/webinar/send-single
 * Body: { email: string }
 */
router.post("/send-single", sendSingleWebinar);
router.post("/send-bulk", sendBulkWebinar); // Placeholder for bulk route

export default router;
