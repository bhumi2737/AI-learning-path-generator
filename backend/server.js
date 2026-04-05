const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Learning resources database
const learningResources = {
  "data structures": {
    prerequisites: ["Basic Programming", "Mathematics (Complexity Analysis)"],
    core: ["Arrays", "Linked Lists", "Stacks & Queues", "Trees", "Graphs", "Hashing", "Sorting Algorithms", "Dynamic Programming"],
    projects: ["Implement DSA library", "Build a custom search engine", "Create a file system simulator"],
    resources: ["GeeksforGeeks DSA", "LeetCode", "Codeforces", "Princeton Algorithms (Coursera)", "Cracking the Coding Interview"],
    timeline: "3-4 months"
  },
  "web development": {
    prerequisites: ["HTML", "CSS", "JavaScript basics"],
    core: ["Frontend (React/Vue)", "Backend (Node/Django)", "Databases (SQL/NoSQL)", "APIs (REST/GraphQL)", "Deployment"],
    projects: ["Todo App", "E-commerce Store", "Social Media Clone", "Real-time Chat App"],
    resources: ["FreeCodeCamp", "MDN Docs", "Vue/React Official Docs", "Udemy Courses", "freeCodeCamp YouTube"],
    timeline: "4-6 months"
  },
  "machine learning": {
    prerequisites: ["Python", "Math (Linear Algebra, Calculus)", "Statistics"],
    core: ["Supervised Learning", "Unsupervised Learning", "Neural Networks", "Deep Learning", "NLP", "Computer Vision"],
    projects: ["Iris Classifier", "Movie Recommendation System", "Sentiment Analysis", "Image Recognition"],
    resources: ["Andrew Ng's ML Course", "Fast.ai", "Kaggle", "TensorFlow/PyTorch Docs", "Stanford CS229"],
    timeline: "5-7 months"
  },
  "python": {
    prerequisites: ["Programming basics"],
    core: ["Data Types", "Functions", "OOP", "Modules & Libraries", "File Handling", "Exception Handling", "Decorators"],
    projects: ["Web Scraper", "Automation Scripts", "Data Analysis Tool", "REST API"],
    resources: ["Python.org Docs", "Real Python", "Automate the Boring Stuff", "Python Crash Course", "Codecademy"],
    timeline: "2-3 months"
  },
  "devops": {
    prerequisites: ["Linux Basics", "Networking", "Scripting"],
    core: ["Docker", "Kubernetes", "CI/CD", "Infrastructure as Code", "Monitoring", "Cloud Platforms (AWS/Azure)"],
    projects: ["Dockerize an App", "Deploy with Kubernetes", "Setup CI/CD Pipeline", "Infrastructure Automation"],
    resources: ["Docker Docs", "Kubernetes.io", "Linux Academy", "Udemy DevOps Courses", "TechWorld with Nana"],
    timeline: "4-6 months"
  },
  "cloud computing": {
    prerequisites: ["Networking", "Operating Systems", "Server Basics"],
    core: ["AWS Core", "Azure Fundamentals", "GCP Basics", "Cloud Architecture", "Serverless Computing"],
    projects: ["Deploy Web App on AWS", "Build serverless API", "Setup Auto-scaling", "Multi-region deployment"],
    resources: ["AWS Free Tier Docs", "ACloudGuru", "Linux Academy", "Cloud Provider Official Courses"],
    timeline: "3-5 months"
  },
  "javascript": {
    prerequisites: ["Programming concepts"],
    core: ["ES6+", "Async/Await", "DOM Manipulation", "Event Handling", "Frameworks (React/Vue/Angular)"],
    projects: ["Interactive Web Page", "Weather App", "Todo List", "Portfolio Website"],
    resources: ["JavaScript.info", "MDN", "Eloquent JavaScript", "FreeCodeCamp", "You Don't Know JS"],
    timeline: "2-3 months"
  },
  "react": {
    prerequisites: ["JavaScript", "HTML/CSS"],
    core: ["Components", "Hooks", "State Management", "Routing", "API Integration", "Performance Optimization"],
    projects: ["Social Media Feed", "E-commerce App", "Dashboard", "Real-time Chat"],
    resources: ["React Official Docs", "FreeCodeCamp React Course", "Scrimba", "The Complete React Guide", "React Router Docs"],
    timeline: "2-3 months"
  },
  "node.js": {
    prerequisites: ["JavaScript", "Networking basics"],
    core: ["Express.js", "Middleware", "Routing", "Database Integration", "Authentication", "RESTful APIs"],
    projects: ["REST API", "Blog Platform", "Real-time Chat Server", "Authentication System"],
    resources: ["Node.js Official Docs", "Express.js Docs", "The Complete Node.js Course", "FreeCodeCamp Node Course", "Udemy Courses"],
    timeline: "2-3 months"
  },
  "sql": {
    prerequisites: ["Database basics"],
    core: ["SELECT Queries", "JOINs", "Aggregations", "Subqueries", "Indexes", "Optimization", "Transactions"],
    projects: ["Database Design", "Complex Queries", "Performance Optimization", "Data Analysis"],
    resources: ["SQL Tutorial", "W3Schools SQL", "HackerRank SQL", "Mode SQL Tutorial", "SQLZoo"],
    timeline: "1-2 months"
  },
};

// Generate roadmap based on topic
function generateRoadmap(goal, difficulty = "intermediate") {
  const topic = goal.toLowerCase();
  
  // Find matching topic
  let data = null;
  for (const [key, value] of Object.entries(learningResources)) {
    if (topic.includes(key) || key.includes(topic)) {
      data = value;
      break;
    }
  }
  
  // If no exact match, create generic roadmap
  if (!data) {
    data = {
      prerequisites: ["Fundamentals", "Prerequisites for " + goal],
      core: ["Core Concept 1", "Core Concept 2", "Core Concept 3", "Advanced Topics"],
      projects: ["Beginner Project", "Intermediate Project", "Advanced Project"],
      resources: ["Official Documentation", "Online Courses", "YouTube Tutorials", "Community Forums"],
      timeline: "3-4 months"
    };
  }

  // Adjust content based on difficulty
  let adjustedCore = data.core;
  if (difficulty === "beginner") {
    adjustedCore = data.core.slice(0, Math.ceil(data.core.length / 2));
  } else if (difficulty === "advanced") {
    adjustedCore = [...data.core, "System Design", "Advanced Patterns", "Performance Tuning"];
  }

  // Format roadmap
  const roadmap = `
╔═══════════════════════════════════════════════════════════════════════════╗
║              📚 PERSONALIZED LEARNING ROADMAP FOR ${goal.toUpperCase()}
║                     ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level - ${data.timeline}
╚═══════════════════════════════════════════════════════════════════════════╝

┌─ PREREQUISITES (Start here if you don't know these)
${data.prerequisites.map((p, i) => `│ ${i + 1}. ${p}`).join('\n')}
│
└─ Estimated time: 1-2 weeks

┌─ CORE CONCEPTS TO MASTER (The foundation)
${adjustedCore.map((c, i) => `│ ${i + 1}. ${c}`).join('\n')}
│
└─ Estimated time: ${difficulty === "beginner" ? "6-8 weeks" : difficulty === "intermediate" ? "8-12 weeks" : "12-16 weeks"}

┌─ PROJECTS TO BUILD (Learn by doing)
${data.projects.map((p, i) => `│ ${i + 1}. ${p}`).join('\n')}
│
└─ Estimated time: 3-5 projects spread throughout learning period

┌─ RECOMMENDED RESOURCES
${data.resources.map((r, i) => `│ ${i + 1}. ${r}`).join('\n')}

┌─ TOTAL TIMELINE: ${data.timeline}

📋 STEP-BY-STEP PLAN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Week 1-2: Setup & Prerequisites
   • Review prerequisite concepts
   • Set up development environment
   • Choose learning resources

✅ Week 3-6: Learn Core Concepts
   • Study 1-2 topics per week
   • Take notes and create flashcards
   • Practice with exercises

✅ Week 7-10: Build Projects
   • Start with beginner projects
   • Move to intermediate complexity
   • Deploy projects publicly

✅ Week 11+: Advanced & Specialization
   • Deep dive into specific areas
   • Contribute to open source
   • Build a portfolio

💡 TIPS FOR SUCCESS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Practice daily (1-2 hours minimum)
• Build projects as you learn
• Join communities and get feedback
• Don't skip prerequisites
• Review and reinforce concepts
• Teach others to solidify understanding
• Stay consistent and patient

🎯 You've got this! Start today and track your progress! 🚀
`;

  return roadmap;
}

// test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is healthy" });
});

// MAIN ROUTE - Generate Learning Roadmap (Local)
app.post("/generate", async (req, res) => {
  const { goal } = req.body;
  let difficulty = "intermediate";

  // Extract difficulty level from goal if present
  if (goal && goal.toLowerCase().includes("beginner")) {
    difficulty = "beginner";
  } else if (goal && goal.toLowerCase().includes("advanced")) {
    difficulty = "advanced";
  }

  console.log("📝 Generating roadmap for:", goal, `(${difficulty})`);

  // Validate input
  if (!goal || goal.trim().length === 0) {
    return res.status(400).json({
      result: "❌ Please enter a valid learning goal",
    });
  }

  try {
    const roadmap = generateRoadmap(goal, difficulty);
    
    console.log("✅ Roadmap generated successfully");

    res.json({
      result: roadmap,
      success: true,
      topic: goal,
      difficulty: difficulty,
    });

  } catch (error) {
    console.error("❌ Error in /generate route:", error.message);

    res.status(500).json({
      result: "❌ Error generating roadmap. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ result: "❌ Endpoint not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 POST /generate - Generate learning roadmap (LOCAL - NO API NEEDED!)`);
  console.log(`🏥 GET /health - Check server status`);
  console.log(`\n✅ Ready to generate learning paths!`);
});