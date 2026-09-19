
const express = require("express");
const router = express.Router();

const { findMatches } = require("../controllers/matchController");
const protect = require("../middleware/authMiddleware");

router.get("/", protect, findMatches);

module.exports = router;