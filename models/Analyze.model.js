import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    isSafe: { // decision field
      type: Boolean,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Hate Speech",
        "Harassment",
        "Sexually Explicit",
        "Dangerous & Illegal",
        "Prompt Injection",
        "Misinformation",
        null,
      ],
      default: null,
    },
    severity: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0,
    },
    emotions: {
      anger: { type: Number, default: 0 },
      joy: { type: Number, default: 0 },
      sadness: { type: Number, default: 0 },
      fear: { type: Number, default: 0 },
      surprise: { type: Number, default: 0 },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Analysis", analysisSchema);
