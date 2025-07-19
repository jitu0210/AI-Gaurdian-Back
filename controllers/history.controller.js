import User from "../models/User.model.js";
import Video from "../models/Video.model.js";


const saveToHistory = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ error: "Video not found" });

    const user = await User.findById(userId);

    
    user.history = user.history.filter(
      (item) => item.video.toString() !== videoId
    );

    
    user.history.unshift({ video: videoId });

    await user.save();
    res.status(200).json({ message: "Video added to history" });
  } catch (err) {
    console.error("Save to history error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("history.video")
      .select("history");

    res.status(200).json(user.history);
  } catch (err) {
    console.error("Get history error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


const deleteFromHistory = async (req, res) => {
  try {
    const { videoId } = req.params;
    const user = await User.findById(req.user._id);

    user.history = user.history.filter(
      (item) => item.video.toString() !== videoId
    );

    await user.save();
    res.status(200).json({ message: "Video removed from history" });
  } catch (err) {
    console.error("Delete from history error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


const clearHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.history = [];
    await user.save();
    res.status(200).json({ message: "History cleared" });
  } catch (err) {
    console.error("Clear history error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  saveToHistory,
  getHistory,
  deleteFromHistory,
  clearHistory
};
