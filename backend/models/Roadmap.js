
const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    skill: {
      type: String,
      required: true,
    },

    currentLevel: {
      type: String,
      default: "Beginner",
    },

    goal: {
      type: String,
      default: "",
    },

    steps: [
      {
        title: String,
        topics: [String],
        project: String,
        duration: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Roadmap", roadmapSchema);