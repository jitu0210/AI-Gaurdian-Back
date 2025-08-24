import express from "express";
import { createApiKey, revokeApiKey } from "../controllers/admin.controller.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Only admin can create/revoke API keys
router.post("/create-key", adminMiddleware, createApiKey);
router.post("/revoke-key", adminMiddleware, revokeApiKey);

export default router;
