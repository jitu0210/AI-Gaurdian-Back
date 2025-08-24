import Analysis from "../models/Analyze.model.js";
import { analyzePrompt as analyzeWithGemini } from "../services/geminiService.js";

// POST /analyze → Analyze prompt using Gemini
export const createAnalysis = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.user?._id || null;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    // Call Gemini LLM
    const result = await analyzeWithGemini(userId, prompt);

    // Save result in DB
    const analysis = await Analysis.create({
      userId,
      prompt,
      isSafe: result.safety === "safe",
      emotions: result.emotions,
    });

    return res.status(201).json({
      message: "Prompt analyzed successfully",
      data: analysis,
    });
  } catch (error) {
    console.error("Error analyzing prompt:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /analyze → Fetch all analysis results for the user
export const getAnalysis = async (req, res) => {
  try {
    const userId = req.user?._id || null;

    const analyses = await Analysis.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Fetched analysis successfully",
      data: analyses,
    });
  } catch (error) {
    console.error("Error fetching analyses:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
