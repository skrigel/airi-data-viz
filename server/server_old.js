// server.js
const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store (in production, you'd use a database)
let risksData = [];

function loadData() {
  return new Promise((resolve, reject) => {
    let data = [];
    fs.createReadStream(path.join(__dirname, "data", "risks.csv"))
      .pipe(csv())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
        risksData = data; // Store the loaded data in memory
        console.log("CSV data successfully loaded", risksData);
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

// // Load data from CSV on startup
// function loadData() {
//   risksData = [];
//   fs.createReadStream(path.join(__dirname, "data", "risks.csv"))
//     .pipe(csv())
//     .on("data", (row) => {
//       console.log("row", row);
//       // Transform keys to camelCase and parse data
//       //   const transformedRow = {
//       //     title: row.Title,
//       //     quickRef: row.QuickRef,
//       //     categoryLevel: row.Category_level,
//       //     riskCategory: row["Risk category"],
//       //     riskSubcategory: row["Risk subcategory"],
//       //     description: row.Description,
//       //     additionalEv: row["Additional ev."],
//       //     pDef: row.P_Def,
//       //     pAddEv: row.p_AddEv,
//       //     entity: row.Entity,
//       //     intent: row.Intent,
//       //     timing: row.Timing,
//       //     domain: row.Domain,
//       //     subDomain: row["Sub-domain"],
//       //   };
//       risksData.push(row);
//     })
//     .on("end", () => {
//       console.log("CSV data successfully loaded");
//     });
// }

// Load data when server starts
loadData();
console.log("here is riskData now", risksData);
// API Routes

// Get all risks
// app.get("/api/risks", (req, res) => {
//   loadData();

//   console.log("in api", risksData);
//   const riskJson = res.json(risksData);
//   res.send(riskJson);
// });

app.get("/api/risks", async (req, res) => {
  try {
    if (risksData.length === 0) {
      await loadData(); // Ensure data is loaded before responding
    }
    console.log("Returning risks data:", risksData);
    res.json(risksData);
  } catch (error) {
    console.error("Error loading data:", error);
    res.status(500).json({ error: "Failed to load risks data" });
  }
});

// Get filtered risks
app.get("/api/risks/filter", (req, res) => {
  let filteredData = [...risksData];

  // Apply filters from query parameters
  const { domain, subdomain, entity, intent, timing } = req.query;

  if (domain) {
    filteredData = filteredData.filter((risk) => risk.domain === domain);
  }

  if (subdomain) {
    filteredData = filteredData.filter((risk) => risk.subDomain === subdomain);
  }

  if (entity) {
    filteredData = filteredData.filter((risk) => risk.entity === entity);
  }

  if (intent) {
    filteredData = filteredData.filter((risk) => risk.intent === intent);
  }

  if (timing) {
    filteredData = filteredData.filter((risk) => risk.timing === timing);
  }

  res.json(filteredData);
});

// Get domain aggregation
app.get("/api/aggregation/domain", (req, res) => {
  const domainCounts = {};

  risksData.forEach((risk) => {
    if (risk.domain) {
      domainCounts[risk.domain] = (domainCounts[risk.domain] || 0) + 1;
    }
  });

  const result = Object.keys(domainCounts).map((domain) => ({
    domain,
    count: domainCounts[domain],
  }));

  res.json(result);
});

// Get domain × causal factors heatmap data
app.get("/api/aggregation/heatmap", (req, res) => {
  const domains = [
    ...new Set(risksData.filter((r) => r.domain).map((r) => r.domain)),
  ];
  const timings = [
    ...new Set(risksData.filter((r) => r.timing).map((r) => r.timing)),
  ];

  const heatmapData = domains.map((domain) => {
    const result = { domain };

    timings.forEach((timing) => {
      result[timing] = risksData.filter(
        (r) => r.domain === domain && r.timing === timing
      ).length;
    });

    result.total = risksData.filter((r) => r.domain === domain).length;

    return result;
  });

  res.json(heatmapData);
});

// Get subdomain breakdown data
app.get("/api/aggregation/subdomain", (req, res) => {
  const { domain } = req.query;

  let filteredData = risksData;
  if (domain) {
    filteredData = filteredData.filter((risk) => risk.domain === domain);
  }

  const subdomainCounts = {};

  filteredData.forEach((risk) => {
    if (risk.subDomain) {
      subdomainCounts[risk.subDomain] =
        (subdomainCounts[risk.subDomain] || 0) + 1;
    }
  });

  const result = Object.keys(subdomainCounts).map((subdomain) => ({
    subdomain,
    count: subdomainCounts[subdomain],
    domain: domain || "All",
  }));

  res.json(result);
});

// Get entity aggregation
app.get("/api/aggregation/entity", (req, res) => {
  const entityCounts = {};

  risksData.forEach((risk) => {
    if (risk.entity) {
      entityCounts[risk.entity] = (entityCounts[risk.entity] || 0) + 1;
    }
  });

  const result = Object.keys(entityCounts).map((entity) => ({
    entity,
    count: entityCounts[entity],
  }));

  res.json(result);
});

// Get intent aggregation
app.get("/api/aggregation/intent", (req, res) => {
  const intentCounts = {};

  risksData.forEach((risk) => {
    if (risk.intent) {
      intentCounts[risk.intent] = (intentCounts[risk.intent] || 0) + 1;
    }
  });

  const result = Object.keys(intentCounts).map((intent) => ({
    intent,
    count: intentCounts[intent],
  }));

  res.json(result);
});

// Get unique values for filters
app.get("/api/filters", (req, res) => {
  const filters = {
    domains: [
      ...new Set(risksData.filter((r) => r.domain).map((r) => r.domain)),
    ],
    subdomains: [
      ...new Set(risksData.filter((r) => r.subDomain).map((r) => r.subDomain)),
    ],
    entities: [
      ...new Set(risksData.filter((r) => r.entity).map((r) => r.entity)),
    ],
    intents: [
      ...new Set(risksData.filter((r) => r.intent).map((r) => r.intent)),
    ],
    timings: [
      ...new Set(risksData.filter((r) => r.timing).map((r) => r.timing)),
    ],
  };

  res.json(filters);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
