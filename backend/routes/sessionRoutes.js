
const express = require("express");
const router = express.Router();

const {
  createSession,
  getMySessions,
  updateSessionStatus
} = require("../controllers/sessionController");

const protect = require("../middleware/authMiddleware");

// Send a session request
router.post("/", protect, createSession);

// Get sent and received session requests
router.get("/", protect, getMySessions);

// Accept or reject a session request
router.patch("/:id/status", protect, updateSessionStatus);

module.exports = router;