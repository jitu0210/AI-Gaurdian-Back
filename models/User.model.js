import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    apiKey: {
      type: String,
      unique: true,
      sparse: true, 
    },
    isAdmin: {
      type: Boolean,
      default: false
   },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

// Generate API Key (for user after registration/login)
userSchema.methods.generateApiKey = function () {
  const apiKey = crypto.randomBytes(32).toString("hex"); // secure random key
  this.apiKey = apiKey;
  return apiKey;
};

const User = mongoose.model("User", userSchema);

export default User;
