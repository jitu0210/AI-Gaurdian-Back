import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    // 1️⃣ Check for API Key in headers
    const apiKey = req.header("x-api-key");
    if (apiKey) {
      const user = await User.findOne({ apiKey }).select("-password");
      if (!user) {
        return res.status(403).json({ error: "Invalid API Key" });
      }
      req.user = user;
      return next(); // ✅ proceed if API key valid
    }

    // 2️⃣ Fallback to JWT token
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Use the same key as in token payload
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }

    next();
  } catch (err) {
    console.error("Auth Error:", err);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid or expired credentials" });
  }
};

export default authMiddleware;
