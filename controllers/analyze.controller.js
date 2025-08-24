import Analysis from "../models/Analyze.model.js";
import { analyzePrompt as analyzeWithGemini } from "../services/geminiService.js";

/**
 * POST /api/analyze
 * Analyze a user prompt using Gemini LLM and save the result.
 */
export const createAnalysis = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ success: false, message: "Prompt is required and must be a non-empty string" });
    }

    // Call Gemini LLM
    const result = await analyzeWithGemini(userId, prompt);

    // Save result in DB
    const analysis = await Analysis.create({
      userId,
      prompt,
      isSafe: result.safety === "safe",
      emotions: result.emotions,
      category: result.category || null,
      severity: result.severity || 0,
    });

    return res.status(201).json({
      success: true,
      message: "Prompt analyzed successfully",
      data: analysis,
    });
  } catch (error) {
    console.error("❌ Error analyzing prompt:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to analyze prompt",
      error: error.message,
    });
  }
};

/**
 * GET /api/analyze
 * Fetch all analysis results for the authenticated user.
 * Supports optional query params: limit, page
 */
export const getAnalysis = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { limit = 20, page = 1 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const analyses = await Analysis.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Analysis.countDocuments({ userId });

    return res.status(200).json({
      success: true,
      message: "Fetched analyses successfully",
      data: analyses,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching analyses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch analyses",
      error: error.message,
    });
  }
};
