
const User = require("../models/User");

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