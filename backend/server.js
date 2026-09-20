const express = require("express");
const http = require("http");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const matchRoutes = require("./routes/matchRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");

const Session = require("./models/Session");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);

// Enable CORS for all routes and origins
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight CORS header middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("SkillBridge Backend is running!");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/roadmaps", roadmapRoutes);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket JWT Middleware
io.use((socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace("Bearer ", "");

    if (!token) {
      return next(new Error("Authentication error: Token required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
});

// Socket.IO Connections & Event Handlers
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}, User: ${socket.user?.id}`);

  // Auto-join personal user room for targeted notifications
  if (socket.user?.id) {
    socket.join(`user:${socket.user.id}`);
  }

  // Join room for a session
  socket.on("join_room", async ({ sessionId }) => {
    try {
      const session = await Session.findById(sessionId);
      if (!session) {
        return socket.emit("error_message", "Session not found");
      }

      const userId = socket.user.id;
      if (
        session.requester.toString() !== userId &&
        session.mentor.toString() !== userId
      ) {
        return socket.emit("error_message", "Unauthorized room access");
      }

      if (session.status !== "accepted" && session.status !== "completed") {
        return socket.emit(
          "error_message",
          "Chat is only available for accepted sessions"
        );
      }

      socket.join(sessionId);
      socket.emit("room_joined", { sessionId });
    } catch (err) {
      console.error("Socket join_room error:", err);
      socket.emit("error_message", "Failed to join room");
    }
  });

  // Send real-time chat message
  socket.on("send_message", async ({ sessionId, text }) => {
    try {
      if (!text || !text.trim()) return;

      const session = await Session.findById(sessionId);
      if (!session) {
        return socket.emit("error_message", "Session not found");
      }

      const userId = socket.user.id;
      if (
        session.requester.toString() !== userId &&
        session.mentor.toString() !== userId
      ) {
        return socket.emit("error_message", "Unauthorized sender");
      }

      if (session.status !== "accepted" && session.status !== "completed") {
        return socket.emit(
          "error_message",
          "Chat is only available for accepted sessions"
        );
      }

      // Save message in MongoDB
      const createdMessage = await Message.create({
        session: sessionId,
        sender: userId,
        text: text.trim(),
      });

      const populatedMessage = await Message.findById(createdMessage._id).populate(
        "sender",
        "name email"
      );

      // Broadcast message to session chat room
      io.to(sessionId).emit("receive_message", populatedMessage);

      // Determine recipient ID and emit real-time in-app notification
      const recipientId =
        session.requester.toString() === userId
          ? session.mentor.toString()
          : session.requester.toString();

      io.to(`user:${recipientId}`).emit("new_message_notification", {
        sessionId,
        sessionSkill: session.skill,
        senderName: populatedMessage.sender.name,
        senderId: userId,
        text: populatedMessage.text,
        createdAt: populatedMessage.createdAt,
      });
    } catch (err) {
      console.error("Socket send_message error:", err);
      socket.emit("error_message", "Failed to send message");
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Start HTTP & Socket.IO server
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  server.listen(PORT, () => {
    console.log(`Server & Socket.IO running on port ${PORT}`);
  });
};

startServer();