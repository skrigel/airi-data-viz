// server.js
const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Store data in memory
let risksData = [];
let isDataLoaded = false;

// Load data from CSV
function loadData() {
  return new Promise((resolve, reject) => {
    if (isDataLoaded) {
      resolve(risksData);
      return;
    }

    risksData = [];
    fs.createReadStream(path.join(__dirname, "data", "risks.csv"))
      .pipe(csv())
      .on("data", (data) => risksData.push(data))
      .on("end", () => {
        console.log(`Loaded ${risksData.length} risk entries`);
        isDataLoaded = true;
        resolve(risksData);
      })
      .on("error", (error) => {
        console.error("Error loading CSV data:", error);
        reject(error);
      });
  });
}

// API Routes

// Get all risks with pagination and filtering
app.get("/api/risks", async (req, res) => {
  try {
    await loadData();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const domain = req.query.domain;
    const subdomain = req.query.subdomain;
    const entity = req.query.entity;
    const intent = req.query.intent;
    const timing = req.query.timing;

    let filteredRisks = [...risksData];

    // Apply filters
    if (domain) {
      filteredRisks = filteredRisks.filter((risk) => risk.Domain === domain);
    }

    if (subdomain) {
      filteredRisks = filteredRisks.filter(
        (risk) => risk["Sub-domain"] === subdomain
      );
    }

    if (entity) {
      filteredRisks = filteredRisks.filter((risk) => risk.Entity === entity);
    }

    if (intent) {
      filteredRisks = filteredRisks.filter((risk) => risk.Intent === intent);
    }

    if (timing) {
      filteredRisks = filteredRisks.filter((risk) => risk.Timing === timing);
    }

    // Paginate results
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedRisks = filteredRisks.slice(startIndex, endIndex);

    res.json({
      total: filteredRisks.length,
      page,
      limit,
      data: paginatedRisks,
    });
  } catch (error) {
    console.error("Error fetching risks:", error);
    res.status(500).json({ error: "Failed to fetch risks" });
  }
});

// Get domain statistics
app.get("/api/risks/domains", async (req, res) => {
  try {
    await loadData();

    // Group by domain and count
    const domainStats = risksData.reduce((acc, risk) => {
      const domain = risk.Domain;
      if (!domain) return acc;

      if (!acc[domain]) {
        acc[domain] = 0;
      }
      acc[domain]++;
      return acc;
    }, {});

    // Convert to array format for visualization
    const formattedStats = Object.keys(domainStats).map((domain) => ({
      domain,
      count: domainStats[domain],
    }));

    res.json(formattedStats);
  } catch (error) {
    console.error("Error fetching domain stats:", error);
    res.status(500).json({ error: "Failed to fetch domain statistics" });
  }
});

// Get subdomain statistics
app.get("/api/risks/subdomains", async (req, res) => {
  try {
    await loadData();
    const domain = req.query.domain;

    let filteredRisks = [...risksData];
    if (domain) {
      filteredRisks = filteredRisks.filter((risk) => risk.Domain === domain);
    }

    // Group by subdomain and count
    const subdomainStats = filteredRisks.reduce((acc, risk) => {
      const subdomain = risk["Sub-domain"];
      if (!subdomain) return acc;

      if (!acc[subdomain]) {
        acc[subdomain] = 0;
      }
      acc[subdomain]++;
      return acc;
    }, {});

    // Convert to array format for visualization
    const formattedStats = Object.keys(subdomainStats).map((subdomain) => ({
      subdomain,
      count: subdomainStats[subdomain],
      domain: domain || null,
    }));

    res.json(formattedStats);
  } catch (error) {
    console.error("Error fetching subdomain stats:", error);
    res.status(500).json({ error: "Failed to fetch subdomain statistics" });
  }
});

// Get causal factors breakdown
app.get("/api/risks/causal", async (req, res) => {
  try {
    await loadData();

    // Get breakdown by Entity, Intent, and Timing
    const entityBreakdown = {};
    const intentBreakdown = {};
    const timingBreakdown = {};

    risksData.forEach((risk) => {
      // Entity breakdown
      if (risk.Entity) {
        if (!entityBreakdown[risk.Entity]) {
          entityBreakdown[risk.Entity] = 0;
        }
        entityBreakdown[risk.Entity]++;
      }

      // Intent breakdown
      if (risk.Intent) {
        if (!intentBreakdown[risk.Intent]) {
          intentBreakdown[risk.Intent] = 0;
        }
        intentBreakdown[risk.Intent]++;
      }

      // Timing breakdown
      if (risk.Timing) {
        if (!timingBreakdown[risk.Timing]) {
          timingBreakdown[risk.Timing] = 0;
        }
        timingBreakdown[risk.Timing]++;
      }
    });

    res.json({
      entity: Object.keys(entityBreakdown).map((key) => ({
        name: key,
        value: entityBreakdown[key],
      })),
      intent: Object.keys(intentBreakdown).map((key) => ({
        name: key,
        value: intentBreakdown[key],
      })),
      timing: Object.keys(timingBreakdown).map((key) => ({
        name: key,
        value: timingBreakdown[key],
      })),
    });
  } catch (error) {
    console.error("Error fetching causal breakdown:", error);
    res.status(500).json({ error: "Failed to fetch causal factors breakdown" });
  }
});

// Get domain × causal factor heatmap data
app.get("/api/risks/heatmap", async (req, res) => {
  try {
    await loadData();

    // Initialize heatmap data structure for domain × timing
    const domains = [
      ...new Set(risksData.map((risk) => risk.Domain).filter(Boolean)),
    ];
    const timings = [
      ...new Set(risksData.map((risk) => risk.Timing).filter(Boolean)),
    ];

    const heatmapData = domains.map((domain) => {
      const result = { domain };

      timings.forEach((timing) => {
        const count = risksData.filter(
          (risk) => risk.Domain === domain && risk.Timing === timing
        ).length;
        result[timing] = count;
      });

      return result;
    });

    res.json(heatmapData);
  } catch (error) {
    console.error("Error generating heatmap data:", error);
    res.status(500).json({ error: "Failed to generate heatmap data" });
  }
});

// Get list of all distinct values for filters
app.get("/api/filters", async (req, res) => {
  try {
    await loadData();

    const domains = [
      ...new Set(risksData.map((risk) => risk.Domain).filter(Boolean)),
    ];
    const subdomains = [
      ...new Set(risksData.map((risk) => risk["Sub-domain"]).filter(Boolean)),
    ];
    const entities = [
      ...new Set(risksData.map((risk) => risk.Entity).filter(Boolean)),
    ];
    const intents = [
      ...new Set(risksData.map((risk) => risk.Intent).filter(Boolean)),
    ];
    const timings = [
      ...new Set(risksData.map((risk) => risk.Timing).filter(Boolean)),
    ];

    res.json({
      domains,
      subdomains,
      entities,
      intents,
      timings,
    });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    res.status(500).json({ error: "Failed to fetch filter options" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
