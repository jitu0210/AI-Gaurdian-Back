import express from "express";
import {
  login,
  logout,
  register,
  generateApiKey,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.post("/logout", authMiddleware, logout);
router.post("/generate-api-key", authMiddleware, generateApiKey);

export default router;
