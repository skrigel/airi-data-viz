// components/Dashboard.js - Main visualization dashboard

// import React, {Box, Container, Row, Column} from "react";
import HeatmapChart from "./HeatMapChart";
import DomainBarChart from "./DomainBarChart";
// import LoadingSpinner from "./LoadingSpinner";
// import "./Dashboard.css";
import DrilldownPieChart from "./DomainPieChart";
import {Box, Container} from "@mui/material"

const aggregateDataCounts = (domainData, sublabel) =>{
  const domainBreakdown = {};

  // Iterate through each row in heatmapData
  domainData.forEach((item) => {
    const domain = item["domain"].trim() === "" ? "Unlabeled" : item["domain"];
    const subdomain =
      item[sublabel].trim() === "" ? "Unlabeled" : item[sublabel];

    // Initialize the domain entry if not already present
    if (!domainBreakdown[domain]) {
      domainBreakdown[domain] = {};
    }

    // Initialize the subdomain count if not already present
    if (!domainBreakdown[domain][subdomain]) {
      domainBreakdown[domain][subdomain] = 0;
    }

    // Increment the subdomain count
    domainBreakdown[domain][subdomain] += 1;
  });
  
  return domainBreakdown;
}

const Dashboard = ({ loading, domainData, timingData }) => {
 
  
  const domainBreakdownBySubdomain = aggregateDataCounts(domainData, "subdomain");

  const domainBreakdownByTiming = aggregateDataCounts(timingData, "timing")

  console.log("timing", domainBreakdownByTiming);


  // Convert into a format suitable for visualization

  const timingCategories = Array.from(
    new Set(Object.values(domainBreakdownByTiming).flatMap(Object.keys))
  );
  
  // 🔹 Process data dynamically  
  const barData  = Object.keys(domainBreakdownByTiming)
    .filter((domain) => domain !== "Unlabeled") // Exclude "Unlabeled"
    .map((domain) => {
      let entry = { domain: domain };
      timingCategories.forEach((category) => {
        // Remove numbering prefix and default to 0 if missing
        entry[category.replace(/^\d+ - /, "")] = domainBreakdownByTiming[domain][category] || 0;
      });
      return entry;
    });
  

  console.log('bar', barData);

  const pieData = Object.keys(domainBreakdownBySubdomain).flatMap((domain) =>
    Object.keys(domainBreakdownBySubdomain[domain]).map((subdomain) => ({
      label: domain,
      subdomain: subdomain,
      value: domainBreakdownBySubdomain[domain][subdomain],
    }))
  );

  console.log("📊 Pie Chart Data (Domain → Subdomains):", pieData);

  return (
    <Container>

      {/* <FilterBar></FilterBar> */}
      <Box>
        <h2>Timing By Domain</h2>
      <DomainBarChart barData={barData} />
      </Box>

      <Box>
           <h2>Domain Frequency</h2>
          <DrilldownPieChart risksData={pieData}></DrilldownPieChart>
      </Box>

      {/* <div className="dashboard-row">
        <div className="dashboard-card large">
          <h2>Subdomain Breakdown</h2>
          <SubdomainTreemap data={subdomainData} />
        </div>
      </div> */}
    </Container>
  );
};

export default Dashboard;
