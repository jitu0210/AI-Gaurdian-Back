import express from "express";
import { login, logout, register, generateApiKey } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// New route: regenerate API key (protected by JWT, not API key)
router.post("/generate-api-key", authMiddleware, generateApiKey);

export default router;
