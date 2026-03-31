const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// AI roadmap route (mock AI)
app.post("/generate-roadmap", (req, res) => {
  const { skills, goal } = req.body;

  // simple validation
  if (!skills || !goal) {
    return res.status(400).json({
      error: "Please provide skills and goal",
    });
  }

  // smart mock AI logic
  const roadmap = {
    goal: goal,
    startingPoint: skills,
    steps: [
      {
        week: "Week 1-2",
        topic: "Core Fundamentals",
        details: `Revise and strengthen basics of ${skills}`,
      },
      {
        week: "Week 3-4",
        topic: "Intermediate Concepts",
        details: `Learn intermediate concepts required for ${goal}`,
      },
      {
        week: "Week 5-6",
        topic: "Advanced Topics",
        details: `Deep dive into advanced ${goal} topics`,
      },
      {
        week: "Week 7-8",
        topic: "Project Building",
        details: `Build real-world projects using ${skills}`,
      },
      {
        week: "Week 9-10",
        topic: "Interview Prep",
        details: `Practice DSA, system design, and mock interviews`,
      },
    ],
    projects: [
      `Build a ${goal} project using ${skills}`,
      `Create a full-stack project showcasing ${goal} skills`,
      `Deploy a real-world application`,
    ],
  };

  res.json({
    message: "AI roadmap generated (mock)",
    roadmap,
  });
});

// start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});