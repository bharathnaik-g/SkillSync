
const User = require("../models/User");
const Review = require("../models/Review");

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    // Check whether authMiddleware attached the user
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized: User not found in request"
      });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user
    });

  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      message: "Server error while fetching profile",
      error: error.message
    });
  }
};

// GET PUBLIC STUDENT PROFILE BY ID (WITH REVIEWS)
exports.getUserProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "Student profile not found"
      });
    }

    const reviews = await Review.find({ mentor: userId })
      .populate("reviewer", "name profileImage department college")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
        : null;

    res.status(200).json({
      message: "Student profile fetched successfully",
      user: {
        ...user.toObject(),
        rating: avgRating,
        totalReviews,
      },
      reviews
    });
  } catch (error) {
    console.error("Get User Profile By ID Error:", error);
    res.status(500).json({
      message: "Server error while fetching student profile",
      error: error.message
    });
  }
};


// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized: User not found in request"
      });
    }

    const allowedFields = [
      "name",
      "college",
      "department",
      "year",
      "bio",
      "profileImage",
      "availability",
      "skillsToTeach",
      "skillsToLearn"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid profile fields provided"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user
    });

  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      message: "Server error while updating profile",
      error: error.message
    });
  }
};