import express from "express";
import { createAnalysis, getAnalysis } from "../controllers/analyze.controller.js";
import { authenticateApiKey } from "../middlewares/authApiKey.js";

const router = express.Router();
router.post("/analyze", authenticateApiKey, createAnalysis);
router.get("/analyze", authenticateApiKey, getAnalysis);

export default router;
