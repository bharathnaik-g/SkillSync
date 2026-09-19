
const Session = require("../models/Session");

// 1. Create a session request
exports.createSession = async (req, res) => {
  try {
    const { mentorId, skill, message, scheduledAt } = req.body;

    if (!mentorId || !skill) {
      return res.status(400).json({
        message: "Mentor ID and skill are required"
      });
    }

    if (mentorId === req.user.id) {
      return res.status(400).json({
        message: "You cannot request a session with yourself"
      });
    }

    const session = await Session.create({
      requester: req.user.id,
      mentor: mentorId,
      skill,
      message,
      scheduledAt
    });

    res.status(201).json({
      message: "Session request sent successfully",
      session
    });
  } catch (error) {
    console.error("Create Session Error:", error);
    res.status(500).json({
      message: "Server error while creating session"
    });
  }
};

// 2. Get sent and received session requests
exports.getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [
        { requester: req.user.id },
        { mentor: req.user.id }
      ]
    })
      .populate("requester", "name email")
      .populate("mentor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      totalSessions: sessions.length,
      sessions
    });
  } catch (error) {
    console.error("Get Sessions Error:", error);
    res.status(500).json({
      message: "Server error while fetching sessions"
    });
  }
};

// 3. Accept or reject a session request
exports.updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be accepted or rejected"
      });
    }

    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found"
      });
    }

    // Only the mentor can accept or reject
    if (session.mentor.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only the mentor can update this request"
      });
    }

    if (session.status !== "pending") {
      return res.status(400).json({
        message: "This request has already been processed"
      });
    }

    session.status = status;
    await session.save();

    res.status(200).json({
      message: `Session ${status} successfully`,
      session
    });
  } catch (error) {
    console.error("Update Session Error:", error);
    res.status(500).json({
      message: "Server error while updating session"
    });
  }
};