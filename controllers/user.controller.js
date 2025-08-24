import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../config/jwt.js";


const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existedUser = await User.findOne({
      $or: [{ email , username}]
    });
    if (existedUser) {
      return res
        .status(400)
        .json({ error: "User with the same email or username already exists" });
    }

    const newUser = await User.create({
      username,
      email: email.toLowerCase(),
      password,
    });

    
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid email or password" });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.refreshToken = null; 
    await user.save();

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const generateApiKey = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // generate new API key
    const apiKey = crypto.randomBytes(32).toString("hex");
    user.apiKey = apiKey;
    await user.save();

    res.json({ apiKey });
  } catch (err) {
    console.error("API Key Generation Error:", err);
    res.status(500).json({ error: "Failed to generate API key" });
  }
};

export { register, login, logout ,generateApiKey };
