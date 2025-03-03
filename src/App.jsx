// App.js - Main React component

import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
// import FilterPanel from "./components/FilterPanel";
// import RiskTable from "./components/RiskTable";
import "./App.css";
import { get, post } from "./utilities";

function App() {
  // const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [timingData, setTimingData] = useState([])
  const [heatmapData, setHeatmapData] = useState([]);
  const [domainData, setDomainData] = useState([]);
  const [subdomainData, setSubdomainData] = useState([]);

  // const [loading, setLoading] = useState(true);
  // const [risks, setRisks] = useState([]);

  const [filters, setFilters] = useState({
    domains: [],
    subdomains: [],
    entities: [],
    intents: [],
    timings: [],
  });

  // Handle filter change
  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Reset all filters
  //REMINDER: CANT SET subdomain filters if domain filter isn't set
  const resetFilters = () => {
    setFilters({
      domain: [],
      subdomain: [],
      entity: [],
      intent: [],
      timing: [],
    });
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

        console.log("🔥 Heatmap Data Before Setting State:", subData); // Check transformed data

        setSubdomainData(subData);

        const timeData = data.map((item) => ({
          domain: item.Domain?.trim() ,
          subdomain: item["Sub-domain"]?.trim(),
          timing: item["Timing"]?.trim()
        }));

        setTimingData(timeData);

        console.log(timeData)
        
        // // Transform data into heatmapData structure
        // const heatmap = data.map((item) => ({
        //   domain: item["Domain"] || "Unknown",
        //   subdomain: item["Sub-domain"] || "Unknown",
        //   total: 1, // Placeholder count (adjust as needed)
        // }));

        // // Aggregate domain data
        // const domainCounts = heatmap.reduce((acc, item) => {
        //   acc[item.domain] = (acc[item.domain] || 0) + 1;
        //   return acc;
        // }, {});

        // const domainArray = Object.keys(domainCounts).map((key) => ({
        //   name: key,
        //   value: domainCounts[key],
        // }));

        // // Aggregate subdomain data
        // const subdomainCounts = heatmap.reduce((acc, item) => {
        //   acc[item.subdomain] = (acc[item.subdomain] || 0) + 1;
        //   return acc;
        // }, {});

        // const subdomainArray = Object.keys(subdomainCounts).map((key) => ({
        //   name: key,
        //   value: subdomainCounts[key],
        // }));

        // Set state

        // setHeatmapData(heatmap);
        // console.log("heatmap", heatmap, heatmapData);
        // setDomainData(domainArray);
        // setSubdomainData(subdomainArray);
      })
      .catch((error) => console.error("❌ Error fetching risks:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Replace with <LoadingSpinner /> if needed
  }

  // GOAL: filters, pie chart for causal, bar chart for just domain frequency, 

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Risk Database Dashboard</h1>
      </header>
      <main className="app-content">

        {/* <FilterPanel
          filters={filters}
          options={filterOptions}
          onChange={handleFilterChange}
          onReset={resetFilters}
        /> */}
        <Dashboard
          loading={true}
          domainData={subdomainData}
          timingData={timingData}
        />
        {/* <RiskTable risks={risks} loading={loading} /> */}
      </main>
    </div>
  );
}

export default App;

// // src/App.js
// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import axios from "axios";

// // Components
// // import Header from "./components/Header";
// import Dashboard from "./components/Dashboard";
// import RiskDetails from "./components/RiskDetails";

// // Styles
// import "./App.css";

// // API base URL
// // const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// const API_URL = "URL";

// function App() {
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     domain: "",
//     subdomain: "",
//     entity: "",
//     intent: "",
//     timing: "",
//   });
//   const [filterOptions, setFilterOptions] = useState({
//     domains: [],
//     subdomains: [],
//     entities: [],
//     intents: [],
//     timings: [],
//   });

//   // Fetch filter options when component mounts
//   useEffect(() => {
//     const fetchFilterOptions = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/filters`);
//         setFilterOptions(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching filter options:", error);
//         setLoading(false);
//       }
//     };

//     // fetchFilterOptions();
//   }, []);

//   // Handle filter change
//   const handleFilterChange = (type, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [type]: value,
//     }));
//   };

//   // Reset all filters
//   const resetFilters = () => {
//     setFilters({
//       domain: "",
//       subdomain: "",
//       entity: "",
//       intent: "",
//       timing: "",
//     });
//   };

//   return (
//     <Router>
//       <div className="app">
//         {/* <Header /> */}
//         {loading ? (
//           <div className="loading">Loading...</div>
//         ) : (
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 <Dashboard
//                   filters={filters}
//                   filterOptions={filterOptions}
//                   onFilterChange={handleFilterChange}
//                   onResetFilters={resetFilters}
//                   apiUrl={API_URL}
//                 />
//               }
//             />
//             <Route
//               path="/risk/:id"
//               element={<RiskDetails apiUrl={API_URL} />}
//             />
//           </Routes>
//         )}
//       </div>
//     </Router>
//   );
// }

// export default App;

// // import { useState } from 'react'
// // import reactLogo from './assets/react.svg'
// // import viteLogo from '/vite.svg'
// // import './App.css'

// // function App() {
// //   const [count, setCount] = useState(0)

// //   return (
// //     <>
// //       <div>
// //         <a href="https://vite.dev" target="_blank">
// //           <img src={viteLogo} className="logo" alt="Vite logo" />
// //         </a>
// //         <a href="https://react.dev" target="_blank">
// //           <img src={reactLogo} className="logo react" alt="React logo" />
// //         </a>
// //       </div>
// //       <h1>Vite + React</h1>
// //       <div className="card">
// //         <button onClick={() => setCount((count) => count + 1)}>
// //           count is {count}
// //         </button>
// //         <p>
// //           Edit <code>src/App.jsx</code> and save to test HMR
// //         </p>
// //       </div>
// //       <p className="read-the-docs">
// //         Click on the Vite and React logos to learn more
// //       </p>
// //     </>
// //   )
// // }

// // export default App
