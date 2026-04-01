const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// MAIN ROUTE (THIS WAS MISSING ❌)
app.post("/generate", (req, res) => {
  const { goal } = req.body;

  const roadmap = `
🚀 Learning Path for ${goal}

📅 Week 1-2:
- Understand basics of ${goal}
- Watch YouTube tutorials

📅 Week 3-4:
- Build small projects related to ${goal}

📅 Week 5-6:
- Learn advanced concepts
- Practice problems

📅 Week 7-8:
- Build a major project
- Prepare portfolio

🎯 Final Goal:
- Apply for internships/jobs in ${goal}
`;

  res.json({ result: roadmap });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});