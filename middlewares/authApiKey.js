import User from "../models/User.model.js";

export const authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({ message: "API key is required" });
    }

    const user = await User.findOne({ apiKey });
    if (!user) {
      return res.status(403).json({ message: "Invalid API key" });
    }

    // attach user info to request for later use
    req.user = user;
    next();
  } catch (error) {
    console.error("API Key Auth Error:", error);
    res.status(500).json({ message: "Server error during API authentication" });
  }
};
