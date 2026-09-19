
const Session = require("../models/Session");
const User = require("../models/User");

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
// 4. Complete a session and award credits
exports.completeSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found"
      });
    }

    if (
      session.requester.toString() !== req.user.id &&
      session.mentor.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "You are not part of this session"
      });
    }

    if (session.status !== "accepted") {
      return res.status(400).json({
        message: "Only accepted sessions can be completed"
      });
    }

    session.status = "completed";
    await session.save();

    // Mentor gets 10 credits
    await User.findByIdAndUpdate(session.mentor, {
      $inc: { creditScore: 10 }
    });

    // Learner gets 5 credits
    await User.findByIdAndUpdate(session.requester, {
      $inc: { creditScore: 5 }
    });

    res.status(200).json({
      message: "Session completed and credits awarded",
      session
    });
  } catch (error) {
    console.error("Complete Session Error:", error);
    res.status(500).json({
      message: "Server error while completing session"
    });
  }
};