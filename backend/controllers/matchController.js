
const User = require("../models/User");

// FIND STUDENTS WHO CAN TEACH SKILLS
// THAT THE LOGGED-IN USER WANTS TO LEARN
exports.findMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const skills = currentUser.skillsToLearn || [];

    if (skills.length === 0) {
      return res.status(200).json({
        message: "Add skills you want to learn to find matches",
        matches: []
      });
    }

    const matches = await User.find({
      _id: { $ne: currentUser._id },
      skillsToTeach: {
        $in: skills.map(skill => new RegExp(
          `^${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          "i"
        ))
      }
    }).select("-password");

    res.status(200).json({
      totalMatches: matches.length,
      matches
    });

  } catch (error) {
    console.error("Match API Error:", error);

    res.status(500).json({
      message: "Server error while finding matches"
    });
  }
};