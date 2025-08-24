import mongoose from "mongoose";

const querySchema = new mongoose.Schema(
  {
    text: { type: String, required: true },       // User ka query
    isFlagged: { type: Boolean, default: false }, // true = unsafe query
    riskScore: { type: Number, default: 0 }       // 0-100 score
  },
  { timestamps: true }
);

export const Query = mongoose.model("Query", querySchema);
