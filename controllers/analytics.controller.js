import Analysis from "../models/Analyze.model.js";

// GET /top-unsafe-prompts → Top unsafe prompts
export const topUnsafePrompts = async (req, res) => {
  try {
    const unsafePrompts = await Analysis.aggregate([
      { $match: { isSafe: false } },
      { $group: { _id: "$prompt", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    return res.status(200).json({ data: unsafePrompts });
  } catch (error) {
    console.error("Error fetching top unsafe prompts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /emotion-trend → Average emotions per day
export const emotionTrend = async (req, res) => {
  try {
    const trend = await Analysis.aggregate([
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          avgAnger: { $avg: "$emotions.anger" },
          avgJoy: { $avg: "$emotions.joy" },
          avgSadness: { $avg: "$emotions.sadness" },
          avgFear: { $avg: "$emotions.fear" },
          avgSurprise: { $avg: "$emotions.surprise" },
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    return res.status(200).json({ data: trend });
  } catch (error) {
    console.error("Error fetching emotion trend:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
