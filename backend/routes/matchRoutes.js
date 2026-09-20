const express = require("express");
const cors = require("cors");
const router = express.Router();

router.use(cors());

const { findMatches } = require("../controllers/matchController");
const protect = require("../middleware/authMiddleware");

router.get("/", protect, findMatches);

module.exports = router;