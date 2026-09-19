
const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");
const creditRoutes = require("./routes/creditRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const matchRoutes = require("./routes/matchRoutes");
const sessionRoutes = require("./routes/sessionRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use("/api/credits", creditRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("SkillBridge Backend is running!");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/sessions", sessionRoutes);

// Start server after DB connection
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();