import express from "express";
import { topUnsafePrompts, emotionTrend } from "../controllers/analytics.controller.js";
import { authenticateApiKey } from "../middlewares/authApiKey.js";

const router = express.Router();
router.get("/top-unsafe-prompts", authenticateApiKey, topUnsafePrompts);
router.get("/emotion-trend", authenticateApiKey, emotionTrend);

export default router;
