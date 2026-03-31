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
  const { skills, goal, level } = req.body;

  if (!skills || !goal || !level) {
    return res.status(400).json({
      error: "Please provide skills, goal, and level",
    });
  }

  let steps = [];

  if (level === "beginner") {
    steps = [
      { week: "Week 1-2", topic: "Basics", details: `Learn fundamentals of ${skills}` },
      { week: "Week 3-4", topic: "Core Concepts", details: `Understand basic ${goal} concepts` },
      { week: "Week 5-6", topic: "Mini Projects", details: `Build small beginner projects` },
    ];
  } 
  
  else if (level === "intermediate") {
    steps = [
      { week: "Week 1-2", topic: "Advanced Concepts", details: `Deep dive into ${goal}` },
      { week: "Week 3-5", topic: "Projects", details: `Build 2 real-world projects` },
      { week: "Week 6-8", topic: "System Design Basics", details: `Learn architecture basics` },
    ];
  } 
  
  else {
    steps = [
      { week: "Week 1-3", topic: "System Design", details: `Master scalable systems` },
      { week: "Week 4-6", topic: "Advanced Projects", details: `Build production-level apps` },
      { week: "Week 7-10", topic: "Interview Prep", details: `Focus on DSA + mock interviews` },
    ];
  }

  const roadmap = {
    goal,
    startingPoint: skills,
    level,
    steps,
    projects: [
      `Build a ${goal} project using ${skills}`,
      `Create a scalable ${goal} system`,
    ],
  };

  res.json({
    message: "Smart roadmap generated",
    roadmap,
  });
});

// start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});