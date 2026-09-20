const express = require("express");
const cors = require("cors");
const router = express.Router();

router.use(cors());

const protect = require("../middleware/authMiddleware");

const {
  generateRoadmap,
  getMyRoadmaps,
  getRoadmapById,
} = require("../controllers/roadmapController");

router.post("/generate", protect, generateRoadmap);

router.get("/", protect, getMyRoadmaps);

router.get("/:id", protect, getRoadmapById);

module.exports = router;