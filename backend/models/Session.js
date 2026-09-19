
const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    skill: {
      type: String,
      required: true
    },

    message: {
      type: String,
      default: ""
    },

    scheduledAt: {
      type: Date,
      default: null
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);