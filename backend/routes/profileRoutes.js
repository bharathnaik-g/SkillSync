const express = require("express");
const cors = require("cors");
const router = express.Router();

router.use(cors());

const {
  getProfile,
  updateProfile
} = require("../controllers/profileController");

const protect = require("../middleware/authMiddleware");

router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);

module.exports = router;