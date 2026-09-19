const User = require("../models/User");

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "name college department creditScore"
    )
      .sort({ creditScore: -1, name: 1 })
      .limit(20);

    res.status(200).json({
      leaderboard: users
    });
  } catch (error) {
    console.error("Leaderboard Error:", error);
    res.status(500).json({
      message: "Server error while fetching leaderboard"
    });
  }
};