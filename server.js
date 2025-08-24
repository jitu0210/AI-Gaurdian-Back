import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB();

// Import routes
import userRoutes from "./routes/user.routes.js";
import analyzeRoutes from "./routes/analyze.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js"; 
import adminRoutes from "./routes/admin.routes.js";
import queryRoutes from "./routes/query.routes.js";


// Route middlewares
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/analysis", analyzeRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/admin", adminRoutes);
<<<<<<< HEAD
app.use("/dashboard", queryRoutes);
=======
app.use("/api/analyze", analyzeRoutes);
>>>>>>> a8b911d634d452a07d9246da06d7c8c95cdc1b42


app.get("/api/v1/users/test", (req, res) => {
  res.send("User route is working!");
});

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`⚙️ Server is running on port ${port}`);
});
