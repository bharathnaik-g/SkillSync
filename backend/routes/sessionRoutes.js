const express = require("express");
const cors = require("cors");
const router = express.Router();

router.use(cors());

const {
  createSession,
  getMySessions,
  updateSessionStatus,
  updateMeetingLink,
  getSessionMessages,
} = require("../controllers/sessionController");

const protect = require("../middleware/authMiddleware");

// Send a session request
router.post("/", protect, createSession);

// Get sent and received session requests
router.get("/", protect, getMySessions);

// Accept or reject a session request
router.patch("/:id/status", protect, updateSessionStatus);

// Update Google Meet link for an accepted session
router.patch("/:id/meeting-link", protect, updateMeetingLink);

// Fetch chat message history for an accepted session
router.get("/:id/messages", protect, getSessionMessages);

module.exports = router;