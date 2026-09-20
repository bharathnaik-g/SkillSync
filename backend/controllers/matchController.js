const User = require("../models/User");
const Review = require("../models/Review");

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

    const rawMatches = await User.find(filter).select("-password").sort({ updatedAt: -1 });

    // Populate actual ratings and review count dynamically for each match
    const matches = await Promise.all(
      rawMatches.map(async (student) => {
        const studentObj = student.toObject();
        const reviews = await Review.find({ mentor: student._id });
        const totalReviews = reviews.length;
        const avgRating =
          totalReviews > 0
            ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
            : null;

        return {
          ...studentObj,
          rating: avgRating,
          totalReviews,
        };
      })
    );

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