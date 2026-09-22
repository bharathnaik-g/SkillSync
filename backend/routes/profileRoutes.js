const express = require("express");
const router = express.Router();

const {
  getProfile,
  getUserProfileById,
  updateProfile
} = require("../controllers/profileController");

const protect = require("../middleware/authMiddleware");

router.get("/", protect, getProfile);
router.get("/:userId", protect, getUserProfileById);
router.put("/", protect, updateProfile);

module.exports = router;