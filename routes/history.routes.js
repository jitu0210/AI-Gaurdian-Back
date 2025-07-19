import express from "express";
import protect from "../middlewares/auth.middleware.js";
import {
  saveToHistory,
  getHistory,
  deleteFromHistory,
  clearHistory
} from "../controllers/history.controller.js";

const router = express.Router();

router.get("/", protect, getHistory);
router.post("/add/:videoId", protect, saveToHistory);
router.delete("/remove/:videoId", protect, deleteFromHistory);
router.delete("/clear", protect, clearHistory);

export default router;