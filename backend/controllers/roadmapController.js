
const { GoogleGenAI } = require("@google/genai");
const Roadmap = require("../models/Roadmap");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateRoadmap = async (req, res) => {
  try {
    const { skill, currentLevel, goal } = req.body;

    // 1. Validate required fields
    if (!skill || !currentLevel || !goal) {
      return res.status(400).json({
        message: "Skill, current level, and goal are required",
      });
    }

    // 2. Create AI prompt
    const prompt = `
You are an expert AI learning roadmap generator.

Create a personalized learning roadmap using these details:

Skill: ${skill}
Current Level: ${currentLevel}
Goal: ${goal}

Generate 4 to 6 progressive stages.

Return ONLY valid JSON. Do not use markdown or code fences.

Use this exact JSON structure:
{
  "steps": [
    {
      "title": "Stage title",
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "project": "A practical project",
      "duration": "2 weeks"
    }
  ]
}

Make the roadmap practical, beginner-friendly when appropriate,
and focused on achieving the user's goal.
`;

    // 3. Call Gemini with retry handling
    let roadmapData;
    let lastError;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
        });

        const text = response.text;

        if (!text) {
          throw new Error("Gemini returned an empty response");
        }

        // Remove possible markdown code fences
        const cleanedText = text
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim();

        // Parse Gemini response
        roadmapData = JSON.parse(cleanedText);

        // Validate response structure
        if (
          !Array.isArray(roadmapData.steps) ||
          roadmapData.steps.length === 0
        ) {
          throw new Error("Invalid roadmap format from Gemini");
        }

        // Successful response; stop retrying
        break;
      } catch (error) {
        lastError = error;

        console.error(
          `Gemini attempt ${attempt} failed:`,
          error.message
        );

        // Retry only temporary errors
        const status = Number(error.status || error.code);

        const isTemporary =
          status === 429 ||
          status === 503 ||
          status >= 500 ||
          /high demand|unavailable|overloaded|timeout/i.test(
            error.message || ""
          );

        if (!isTemporary || attempt === 3) {
          throw error;
        }

        // Wait 2 seconds, then 4 seconds before retrying
        await new Promise((resolve) =>
          setTimeout(resolve, 2000 * attempt)
        );
      }
    }

    if (!roadmapData) {
      throw lastError || new Error("Failed to generate roadmap");
    }

    // 4. Save roadmap to MongoDB
    const savedRoadmap = await Roadmap.create({
      user: req.user.id,
      skill,
      currentLevel,
      goal,
      steps: roadmapData.steps,
    });

    // 5. Send response
    return res.status(201).json({
      message: "AI roadmap generated successfully",
      roadmap: savedRoadmap,
    });
  } catch (error) {
    console.error("Roadmap generation error:", error.message);

    // Return a useful message without exposing secrets
    if (
      error.status === 429 ||
      error.status === 503 ||
      error.status >= 500
    ) {
      return res.status(503).json({
        message:
          "AI service is temporarily unavailable. Please try again shortly.",
      });
    }

    return res.status(500).json({
      message: "Failed to generate roadmap",
      error: error.message,
    });
  }
};


const getMyRoadmaps = async (req, res) => {
    try {
      const roadmaps = await Roadmap.find({
        user: req.user.id,
      }).sort({ createdAt: -1 });
  
      res.status(200).json({
        count: roadmaps.length,
        roadmaps,
      });
    } catch (error) {
      console.error("Get roadmaps error:", error.message);
  
      res.status(500).json({
        message: "Failed to fetch roadmaps",
      });
    }
  };
  
  const getRoadmapById = async (req, res) => {
    try {
      const roadmap = await Roadmap.findOne({
        _id: req.params.id,
        user: req.user.id,
      });
  
      if (!roadmap) {
        return res.status(404).json({
          message: "Roadmap not found",
        });
      }
  
      res.status(200).json({ roadmap });
    } catch (error) {
      console.error("Get roadmap error:", error.message);
  
      res.status(500).json({
        message: "Failed to fetch roadmap",
      });
    }
  };

  module.exports = {
    generateRoadmap,
    getMyRoadmaps,
    getRoadmapById,
  };