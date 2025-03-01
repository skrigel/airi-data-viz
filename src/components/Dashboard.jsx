// components/Dashboard.js - Main visualization dashboard

import React from "react";
import HeatmapChart from "./HeatMapChart";
// import DomainBarChart from "./DomainBarChart";
import CausalDonutChart from "./CausalDonutChart";
// import SubdomainTreemap from "./charts/SubdomainTreemap";
// import LoadingSpinner from "./LoadingSpinner";
// import "./Dashboard.css";
import DrilldownPieChart from "./DrillDownPieChart";

const Dashboard = ({ loading, heatmapData, domainData, subdomainData }) => {
  //   if (loading) {
  //     return <LoadingSpinner />;
  //   }

  // Calculate causality breakdown across all domains
  const domainBreakdown = {};

  // Iterate through each row in heatmapData
  heatmapData.forEach((item) => {
    const domain = item["domain"].trim() === "" ? "Unlabeled" : item["domain"];
    const subdomain =
      item["subdomain"].trim() === "" ? "Unlabeled" : item["subdomain"];

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

  // Convert into a format suitable for visualization
  const pieData = Object.keys(domainBreakdown).flatMap((domain) =>
    Object.keys(domainBreakdown[domain]).map((subdomain) => ({
      label: domain,
      subdomain: subdomain,
      value: domainBreakdown[domain][subdomain],
    }))
  );

  console.log("📊 Pie Chart Data (Domain → Subdomains):", pieData);

  console.log("📊 Pie Chart Data:", pieData);

  return (
    <div className="dashboard">
      {/* <div className="dashboard-row">
        <div className="dashboard-card large">
          <h2>Domain × Causal Factor Heatmap</h2>
          <HeatmapChart data={heatmapData} />
        </div>
      </div> */}

      <div className="dashboard-row">
        {/* <div className="dashboard-card">
          <h2>Risk Frequency by Domain</h2>
          <DomainBarChart data={domainData} />
        </div> */}

        <div className="dashboard-card">
          <DrilldownPieChart risksData={pieData}></DrilldownPieChart>
          {/* <CausalDonutChart data={pieData} /> */}
        </div>
      </div>

      {/* <div className="dashboard-row">
        <div className="dashboard-card large">
          <h2>Subdomain Breakdown</h2>
          <SubdomainTreemap data={subdomainData} />
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
