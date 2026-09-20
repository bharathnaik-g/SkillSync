const User = require("../models/User");

// FIND STUDENTS WHO CAN TEACH SKILLS
// OR SEARCH STUDENTS BY QUERY
exports.findMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const queryStr = (req.query.q || req.query.search || req.query.skill || "").trim();

    let filter = { _id: { $ne: currentUser._id } };

    if (queryStr) {
      const regex = new RegExp(queryStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [
        { name: regex },
        { skillsToTeach: regex },
        { skillsToLearn: regex },
        { department: regex }
      ];
    } else if (currentUser.skillsToLearn && currentUser.skillsToLearn.length > 0) {
      filter.skillsToTeach = {
        $in: currentUser.skillsToLearn.map(skill => new RegExp(
          `^${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          "i"
        ))
      };
    }

    const matches = await User.find(filter).select("-password").sort({ updatedAt: -1 });

    let message = "";
    if (matches.length === 0 && !queryStr && (!currentUser.skillsToLearn || currentUser.skillsToLearn.length === 0)) {
      message = "Add skills you want to learn in your profile or try searching for a skill above.";
    }

    res.status(200).json({
      totalMatches: matches.length,
      matches,
      message
    });

  } catch (error) {
    console.error("Match API Error:", error);

    res.status(500).json({
      message: "Server error while finding matches"
    });
  }
};