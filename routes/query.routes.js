import express from "express";
import {
  saveQuery,
  getTotalQueries,
  getFlaggedQueries,
  getSafeQueries,
  getAverageRiskScore,
  getDashboardStats
} from "../controllers/query.controller.js";

const router = express.Router();

// Save query
router.post("/query", saveQuery);

// Individual stats
router.get("/total", getTotalQueries);
router.get("/flagged", getFlaggedQueries);
router.get("/safe", getSafeQueries);
router.get("/average-risk", getAverageRiskScore);

// Combined stats
router.get("/stats", getDashboardStats);

export default router;
