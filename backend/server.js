const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// home route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.post("/generate-roadmap", (req, res) => {
  const { skills, goal } = req.body;

  res.json({
    message: "Roadmap generated successfully",
    data: {
      skills,
      goal,
      roadmap: `Learn basics of ${goal} starting from your skills: ${skills}`
    }
  });
});

// start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});