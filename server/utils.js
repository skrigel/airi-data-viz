// utils/csvParser.js
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

/**
 * Parse CSV file and return an array of objects
 * @param {string} filename - The CSV filename in the data directory
 * @returns {Promise<Array>} - Array of objects representing CSV rows
 */
function parseCSVFile(filename) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(path.join(__dirname, "..", "data", filename))
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        console.log(`Successfully parsed ${filename}: ${results.length} rows`);
        resolve(results);
      })
      .on("error", (error) => {
        console.error(`Error parsing ${filename}:`, error);
        reject(error);
      });
  });
}

/**
 * Generate a sample CSV file for testing
 * @param {string} filename - The output filename in the data directory
 * @param {number} count - Number of sample records to generate
 */
function generateSampleCSV(filename, count = 100) {
  const domains = [
    "Misinformation",
    "Privacy",
    "Security",
    "Autonomy",
    "Fairness",
    "Safety",
    "Labor",
  ];
  const subdomains = {
    Misinformation: ["False Information", "Deception", "Manipulation"],
    Privacy: ["Data Collection", "Data Usage", "Surveillance"],
    Security: ["Vulnerability", "Attack", "Defense Evasion"],
    Autonomy: ["Control", "Dependence", "Influence"],
    Fairness: ["Bias", "Discrimination", "Representation"],
    Safety: ["Physical Harm", "Psychological Harm", "Environmental Impact"],
    Labor: ["Displacement", "Exploitation", "Skills Gap"],
  };
  const entities = ["User", "System", "Developer", "Organization", "Society"];
  const intents = ["Intentional", "Unintentional"];
  const timings = ["Pre-deployment", "Deployment", "Post-deployment"];

  // Header row
  let csvContent =
    "Title,QuickRef,Ev_ID,Paper_ID,Cat_ID,SubCat_ID,AddEv_ID,Category level,Risk category,Risk subcategory,Description,Additional ev.,P.Def,p.AddEv,Entity,Intent,Timing,Domain,Sub-domain\n";

  // Generate sample rows
  for (let i = 1; i <= count; i++) {
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const subdomainOptions = subdomains[domain];
    const subdomain =
      subdomainOptions[Math.floor(Math.random() * subdomainOptions.length)];
    const entity = entities[Math.floor(Math.random() * entities.length)];
    const intent = intents[Math.floor(Math.random() * intents.length)];
    const timing = timings[Math.floor(Math.random() * timings.length)];

    csvContent += `Risk ${i},R-${i
      .toString()
      .padStart(3, "0")},E${i},P${i},C${i},SC${i},AE${i},${
      Math.floor(Math.random() * 3) + 1
    },`;
    csvContent += `Category ${i},Subcategory ${i},Sample description ${i},Additional evidence ${i},Definition ${i},`;
    csvContent += `AddEvidence ${i},${entity},${intent},${timing},${domain},${subdomain}\n`;
  }

  // Write to file
  fs.writeFileSync(path.join(__dirname, "..", "data", filename), csvContent);
  console.log(`Generated sample CSV with ${count} records at data/${filename}`);
}

module.exports = {
  parseCSVFile,
  generateSampleCSV,
};
