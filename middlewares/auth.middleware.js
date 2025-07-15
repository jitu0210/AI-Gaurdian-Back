import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const protect = async (req, res, next) => {
  try {
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
    console.log("Decoded token:", decoded);

    const userId = decoded.id || decoded.userId;

    req.user = await User.findById(userId).select("-password");

    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }

    next();
  } catch (err) {
    console.error("Auth Error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default protect;
