import User from "../models/User.model.js";

// Middleware to allow only admin users
const adminMiddleware = async (req, res, next) => {
  try {
    // Extract API key from headers
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) {
      return res.status(401).json({ message: "API key is required" });
    }

    // Find user with this API key
    const user = await User.findOne({ apiKey });
    if (!user) {
      return res.status(403).json({ message: "Invalid API key" });
    }

    // Check if user is admin
    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default adminMiddleware;
