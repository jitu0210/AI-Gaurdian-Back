import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URL); // no deprecated options

    // Show cluster name and host
    console.log(`✅ Database connected successfully: ${conn.connection.name}`);
    console.log(`Cluster host: ${conn.connection.host}`);

  } catch (error) {
    console.error("❌ Database connection failed...");
    console.error(error);
    process.exit(1); // exit process if DB fails to connect
  }
};

export default connectDB;
