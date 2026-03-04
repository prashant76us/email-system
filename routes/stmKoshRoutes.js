// routes/stmKoshRoutes.js
import express from "express";
import { sendSingleStmKosh, sendBulkStmKosh, sendExternalStmKosh } from "../controllers/stmKoshController.js";

const router = express.Router();

/**
 * POST /api/stm-kosh/send-single
 * Body: { email: string }
 */
router.post("/send-single", sendSingleStmKosh);
router.post("/send-bulk", sendBulkStmKosh);
router.post("/send-external", sendExternalStmKosh);

export default router;
