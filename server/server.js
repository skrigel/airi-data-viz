require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const app = express();
// const PORT = process.env.PORT || 3000;
const PORT = 10000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON requests

// In-memory data store
let risksData = [];

// Function to load data from CSV
async function loadData() {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(path.join(__dirname, "data", "risks.csv"))
      .pipe(csv())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
        risksData = data;
        console.log(
          "✅ CSV data successfully loaded:",
          risksData.length,
          "entries"
        );
        resolve();
      })
      .on("error", (err) => {
        console.error("❌ Error loading CSV:", err);
        reject(err);
      });
  });
}

// Load CSV on startup
loadData().catch((err) => console.error("Error initializing CSV:", err));

// API Endpoint to get risks data
app.get("/api/risks", async (req, res) => {
  console.log("📥 Received request for /api/risks");

  try {
    if (risksData.length === 0) {
      console.log("🔄 Reloading data before serving request...");
      await loadData();
    }

    console.log("📤 Sending risks data:", risksData.length, "entries");
    res.json(risksData);
  } catch (error) {
    console.error("❌ Error fetching risks:", error);
    res.status(500).json({ error: "Failed to load risks data" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
