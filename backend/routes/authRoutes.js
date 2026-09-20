const express = require("express");
const cors = require("cors");
const router = express.Router();

router.use(cors());

const { register, login } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

module.exports = router;