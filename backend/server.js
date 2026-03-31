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

// start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});