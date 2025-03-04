// App.js - Main React component

import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import FilterPanel from "./components/FilterPanel";
// import RiskTable from "./components/RiskTable";
import "./App.css";
import { get, post } from "./utilities";

function App() {
  // const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);


  const [timingData, setTimingData] = useState([])
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [subdomainData, setSubdomainData] = useState([]);
  
  // const [loading, setLoading] = useState(true);
  // const [risks, setRisks] = useState([]);

  const [filters, setFilters] = useState({
    domain: "",
    subdomain: "",
    entity: "",
    intent: "",
    timing: "",
  });

  // Handle filter change
  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      domain: "",
      subdomain: "",
      entity: "",
      intent: "",
      timing: "",
    });
    setFilteredData(originalData);
  };


  useEffect(() => {
    get("/api/risks")
      .then((data) => {
        console.log("📊 API Data Received:", data);

        const subData = data.map((item) => ({
          domain: item.Domain?.trim(),
          subdomain: item["Sub-domain"]?.trim(),
          riskCategory: item["Risk category"]?.trim(),
          riskSubcategory: item["Risk subcategory"]?.trim(),
        }));

        const processedData = data.map((item) => ({
          domain: item.Domain?.trim(),
          subdomain: item["Sub-domain"]?.trim(),
          entity: item.Entity?.trim(),
          riskCategory: item["Risk category"]?.trim(),
          riskSubcategory: item["Risk subcategory"]?.trim(),
          intent: item.Intent?.trim(),
          timing: item.Timing?.trim(),
        }));

        console.log("🔥 Processed Data:", processedData);
     
        setFilteredData(processedData); // Default: show all data
        setOriginalData(processedData);

        console.log("🔥 Heatmap Data Before Setting State:", subData); // Check transformed data

        setSubdomainData(subData);

        const timeData = data.map((item) => ({
          domain: item.Domain?.trim() ,
          subdomain: item["Sub-domain"]?.trim(),
          timing: item["Timing"]?.trim()
        }));




        setTimingData(timeData);
      
      })
      .catch((error) => console.error("❌ Error fetching risks:", error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!filteredData.length) return; // Avoid filtering before data is loaded

    const newFilteredData = filteredData.filter((item) => {
      return (
        (!filters.domain || item.domain === filters.domain) &&
        (!filters.subdomain || item.subdomain === filters.subdomain) &&
        (!filters.entity || item.entity === filters.entity) &&
        (!filters.riskCategory || item.riskCategory === filters.riskCategory) &&
        (!filters.riskSubcategory || item.riskSubcategory === filters.riskSubcategory) &&
        (!filters.intent || item.intent === filters.intent) &&
        (!filters.timing || item.timing === filters.timing)
      );
    });

    console.log("✅ Filtered Data:", newFilteredData);
    console.log(filters);
    setFilteredData(newFilteredData);

  }, [filters]);

  // const addIfNotIn = (arr, value) =>{
  //   if (!arr.includes(value) && value){
  //     arr.push(value);
  //   }
  // }


  //   filteredData.map((risk)=>{
  //     Object.entries(risk).forEach(([key, value]) => {
  //       if (Object.keys(filterOptions).includes(key)){
  //         addIfNotIn(filterOptions[key], value);
  //       }

        
  //     });

  //   })
  //   console.log("options", filterOptions);
   
  


  if (loading) {
    return <p>Loading...</p>; // Replace with <LoadingSpinner /> if needed
  }

  // GOAL: filters, pie chart for causal, bar chart for just domain frequency, 

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Risk Database Dashboard</h1>
      </header>
      <FilterPanel
        filters={filters}
        handleFilterChange={handleFilterChange}
        resetFilters={resetFilters}
      />
      <main className="app-content">
    
        <Dashboard
          loading={true}
          domainData={subdomainData}
          timingData={filteredData}
        />
        {/* <RiskTable risks={risks} loading={loading} /> */}
      </main>
    </div>
  );
}

export default App;
