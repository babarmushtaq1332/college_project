const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const Student = require("./models/student");

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend static files
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// In-memory fallback data
let fallbackStudents = [
  { id: 1, name: "Ashutosh", course: "CSE" },
  { id: 2, name: "Krish", course: "IT" },
  { id: 3, name: "Khushi", course: "ECE" },
  { id: 4, name: "Riya", course: "ME" },
  { id: 5, name: "Sakshi", course: "CE" }
];
let useDb = false;

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cms";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    useDb = true;
    console.log("✓ Connected to MongoDB");
  })
  .catch(err => {
    useDb = false;
    console.warn("✗ MongoDB connection failed:", err.message);
    console.log("→ Using in-memory data store");
  });

// ===================== API ROUTES =====================

// GET all students
app.get("/students", async (req, res) => {
  try {
    if (useDb) {
      const students = await Student.find().sort({ _id: 1 }).lean();
      return res.json(students.map(s => ({ id: s._id, name: s.name, course: s.course })));
    }
    res.json(fallbackStudents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new student
app.post("/students", async (req, res) => {
  try {
    const { name, course } = req.body;
    if (!name || !course) return res.status(400).json({ error: "name and course are required" });

    if (useDb) {
      const s = new Student({ name, course });
      const saved = await s.save();
      return res.json({ id: saved._id, name: saved.name, course: saved.course });
    }

    const student = { id: fallbackStudents.length + 1, name, course };
    fallbackStudents.push(student);
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== SPA FALLBACK =====================
// Modern safe fallback for Node 25 + Express
app.use((req, res, next) => {
  // Skip API requests
  if (req.path.startsWith("/students")) return next();
  
  // Serve index.html for everything else
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ===================== START SERVER =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));

