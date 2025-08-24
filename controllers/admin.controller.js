import User from "../models/User.model.js";
import crypto from "crypto";

// Generate new API key for a user
export const createApiKey = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate secure API key
    const apiKey = crypto.randomBytes(32).toString("hex");
    user.apiKey = apiKey;
    await user.save();

    return res.status(201).json({ message: "API key created", apiKey });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Revoke API key
export const revokeApiKey = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.apiKey = null;
    await user.save();

    return res.status(200).json({ message: "API key revoked" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
