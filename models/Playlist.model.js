import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: { type: String, required: true },
  description: { type: String },
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video"
    }
  ],
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist