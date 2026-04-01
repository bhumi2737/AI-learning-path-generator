const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🚀 MAIN API
app.post("/generate-roadmap", (req, res) => {
  const { skills, goal, level, time } = req.body;

  let roadmap = [];

  // 🧠 Basic Logic
  if (goal === "backend") {
    if (level === "beginner") {
      roadmap = [
        "Learn JavaScript basics",
        "Understand Node.js fundamentals",
        "Learn Express.js",
        "Work with APIs",
        "Build simple backend projects"
      ];
    } else if (level === "intermediate") {
      roadmap = [
        "Deep dive into Node.js",
        "Learn databases (MongoDB)",
        "Authentication (JWT)",
        "Build REST APIs",
        "Deploy backend projects"
      ];
    } else {
      roadmap = [
        "System design basics",
        "Scalable backend architecture",
        "Microservices",
        "Caching (Redis)",
        "Optimize performance"
      ];
    }
  }

  // 🧠 Skill Gap Detection
  let missingSkills = [];

  if (goal === "backend") {
    if (!skills.includes("javascript")) {
      missingSkills.push("JavaScript");
    }
    if (!skills.includes("node")) {
      missingSkills.push("Node.js");
    }
    if (!skills.includes("database")) {
      missingSkills.push("Databases");
    }
  }

  // 🧠 Final Response
  res.json({
    message: "Roadmap generated successfully",
    roadmap,
    missingSkills
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});