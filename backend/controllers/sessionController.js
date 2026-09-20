const mongoose = require("mongoose");
const Session = require("../models/Session");
const Message = require("../models/Message");
const Review = require("../models/Review");

// 1. Create a session request
exports.createSession = async (req, res) => {
  try {
    const { mentorId, skill, message, scheduledAt } = req.body;

    // Validate required fields
    if (!mentorId || !skill || !scheduledAt) {
      return res.status(400).json({
        message: "Mentor ID, skill, date and time are required"
      });
    }

    // Validate mentor ID
    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return res.status(400).json({
        message: "Invalid mentor ID"
      });
    }

    // Prevent requesting yourself
    if (mentorId === req.user.id) {
      return res.status(400).json({
        message: "You cannot request a session with yourself"
      });
    }

    // Validate date and time
    const sessionDate = new Date(scheduledAt);

    if (isNaN(sessionDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date and time"
      });
    }

    // Session must be in the future
    if (sessionDate <= new Date()) {
      return res.status(400).json({
        message: "Session date and time must be in the future"
      });
    }

    // Create session request
    const session = await Session.create({
      requester: req.user.id,
      mentor: mentorId,
      skill,
      message: message || "",
      scheduledAt: sessionDate,
      status: "pending"
    });

    return res.status(201).json({
      message: "Session request sent successfully",
      session
    });

  } catch (error) {
    console.error("Create Session Error:", error);

    return res.status(500).json({
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

    return res.status(200).json({
      totalSessions: sessions.length,
      sessions
    });

  } catch (error) {
    console.error("Get Sessions Error:", error);

    return res.status(500).json({
      message: "Server error while fetching sessions"
    });
  }
};


// 3. Accept or reject a session request
exports.updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be accepted or rejected"
      });
    }

    // Find session
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

    // Only pending requests can be processed
    if (session.status !== "pending") {
      return res.status(400).json({
        message: "This request has already been processed"
      });
    }

    // Update session status
    session.status = status;
    await session.save();

    return res.status(200).json({
      message: `Session ${status} successfully`,
      session
    });

  } catch (error) {
    console.error("Update Session Error:", error);

    return res.status(500).json({
      message: "Server error while updating session"
    });
  }
};


// 4. Update Google Meet link for an accepted session
exports.updateMeetingLink = async (req, res) => {
  try {
    const { meetingLink } = req.body;

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Only the mentor (teacher) can set or update the meeting link
    const userId = req.user.id;
    if (session.mentor.toString() !== userId) {
      return res.status(403).json({
        message: "Only the mentor can add or update the meeting link",
      });
    }

    // Check if session is accepted
    if (session.status !== "accepted" && session.status !== "completed") {
      return res.status(400).json({
        message: "Meeting link can only be set for accepted sessions",
      });
    }

    session.meetingLink = (meetingLink || "").trim();
    await session.save();

    const updatedSession = await Session.findById(session._id)
      .populate("requester", "name email")
      .populate("mentor", "name email");

    return res.status(200).json({
      message: "Meeting link updated successfully",
      session: updatedSession,
    });
  } catch (error) {
    console.error("Update Meeting Link Error:", error);
    return res.status(500).json({ message: "Server error while updating meeting link" });
  }
};


// 5. Get chat history for an accepted session
exports.getSessionMessages = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const userId = req.user.id;
    if (
      session.requester.toString() !== userId &&
      session.mentor.toString() !== userId
    ) {
      return res.status(403).json({ message: "Not authorized for this session chat" });
    }

    if (session.status !== "accepted" && session.status !== "completed") {
      return res.status(400).json({
        message: "Chat is only accessible for accepted sessions",
      });
    }

    const messages = await Message.find({ session: req.params.id })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Get Session Messages Error:", error);
    return res.status(500).json({ message: "Server error while fetching chat messages" });
  }
};


// 6. Submit a review for a completed/accepted session
exports.submitReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const sessionId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating between 1 and 5 is required" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const userId = req.user.id;
    if (
      session.requester.toString() !== userId &&
      session.mentor.toString() !== userId
    ) {
      return res.status(403).json({ message: "Not authorized to review this session" });
    }

    if (session.status !== "accepted" && session.status !== "completed") {
      return res.status(400).json({ message: "Can only review accepted or completed sessions" });
    }

    // Identify who is being reviewed
    const mentorId =
      session.requester.toString() === userId
        ? session.mentor
        : session.requester;

    // Create or update review
    const review = await Review.findOneAndUpdate(
      { session: sessionId, reviewer: userId },
      {
        session: sessionId,
        reviewer: userId,
        mentor: mentorId,
        rating: Number(rating),
        comment: (comment || "").trim(),
      },
      { upsert: true, new: true, runValidators: true }
    ).populate("reviewer", "name email");

    // Mark session as completed
    session.status = "completed";
    await session.save();

    return res.status(200).json({
      message: "Review submitted successfully",
      review,
      session,
    });
  } catch (error) {
    console.error("Submit Review Error:", error);
    return res.status(500).json({ message: "Server error while submitting review" });
  }
};


// 7. Get reviews for a specific user/mentor
exports.getUserReviews = async (req, res) => {
  try {
    const targetUserId = req.params.userId || req.user.id;
    const reviews = await Review.find({ mentor: targetUserId })
      .populate("reviewer", "name email")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
        : null;

    return res.status(200).json({
      totalReviews,
      averageRating: averageRating ? Number(averageRating) : null,
      reviews,
    });
  } catch (error) {
    console.error("Get User Reviews Error:", error);
    return res.status(500).json({ message: "Server error while fetching reviews" });
  }
};