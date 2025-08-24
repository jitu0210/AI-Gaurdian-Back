import { Query } from "../models/query.model.js";

// ✅ Save Query
export const saveQuery = async (req, res) => {
  try {
    const { text, isFlagged, riskScore } = req.body;
    const query = new Query({ text, isFlagged, riskScore });
    await query.save();

    res.status(201).json({ message: "Query saved", query });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Total Queries
export const getTotalQueries = async (req, res) => {
  try {
    const total = await Query.countDocuments();
    res.json({ totalQueries: total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Flagged Queries
export const getFlaggedQueries = async (req, res) => {
  try {
    const flagged = await Query.countDocuments({ isFlagged: true });
    res.json({ flaggedQueries: flagged });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Safe Queries
export const getSafeQueries = async (req, res) => {
  try {
    const safe = await Query.countDocuments({ isFlagged: false });
    res.json({ safeQueries: safe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Average Risk Score
export const getAverageRiskScore = async (req, res) => {
  try {
    const avgRisk = await Query.aggregate([
      { $group: { _id: null, avg: { $avg: "$riskScore" } } }
    ]);
    res.json({ averageRiskScore: avgRisk[0]?.avg || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Combined Stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalQueries = await Query.countDocuments();
    const flaggedQueries = await Query.countDocuments({ isFlagged: true });
    const safeQueries = await Query.countDocuments({ isFlagged: false });

    const avgRisk = await Query.aggregate([
      { $group: { _id: null, avg: { $avg: "$riskScore" } } }
    ]);

    res.json({
      totalQueries,
      flaggedQueries,
      safeQueries,
      averageRiskScore: avgRisk[0]?.avg || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
