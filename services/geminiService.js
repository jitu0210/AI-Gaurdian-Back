import { GoogleGenerativeAI } from "@google/generative-ai";
import Analysis from "../models/Analyze.model.js"; 

// Initialize Gemini with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to analyze prompt
export const analyzePrompt = async (userId, prompt) => {
  try {
    // Load Gemini Pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Send prompt with structured JSON output request
    const response = await model.generateContent(`
      Analyze the following user input for:
      1. Whether it is SAFE or UNSAFE.
      2. Emotion scores (0-1) for anger, joy, sadness, fear, surprise.

      Input: "${prompt}"

      Return JSON format strictly like this:
      {
        "safety": "safe" | "unsafe",
        "emotions": {
          "anger": number,
          "joy": number,
          "sadness": number,
          "fear": number,
          "surprise": number
        }
      }
    `);

    // ✅ Extract response safely
    const rawText = response.response.candidates[0]?.content?.parts[0]?.text || "{}";
    const parsed = JSON.parse(rawText);

    // ✅ Save to DB (matches analysis.model.js)
    const newAnalysis = new Analysis({
      userId,
      prompt,                     // was `analyze` → changed to match schema
      isSafe: parsed.safety === "safe",
      emotions: parsed.emotions,
    });

    await newAnalysis.save();

    return parsed;

  } catch (error) {
    console.error("❌ Error in analyzePrompt:", error);
    throw new Error("Gemini analysis failed");
  }
};
