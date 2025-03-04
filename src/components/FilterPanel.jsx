import React from "react";
import { Box } from "@mui/material"

export default function FilterPanel({ filters, handleFilterChange, resetFilters }) {
  // Options for each filter category (these should be dynamically fetched or passed as props)

  const filterOptions = {domain:
["6. Socioeconomic and Environmental","7. AI System Safety, Failures, & Limitations",
"4. Malicious Actors & Misuse",
"1. Discrimination & Toxicity",
"2. Privacy & Security",
"3. Misinformation",
"5. Human-Computer Interaction"], 
entity:
["1 - Human",
"2 - AI",
"3 - Other",
"4 - Not coded"],

intent:
["2 - Unintentional",
"1 - Intentional",
"3 - Other",
"4 - Not coded"],

subdomain:["All"],
timing: [
"3 - Other", 
"2 - Post-deployment",
"1 - Pre-deployment",
"4 - Not coded"]};


  return (
    <div>
      {/* Generate a select dropdown for each filter type */}
      <Box>
      {Object.keys(filters).map((filterType) => (
        <select
          key={filterType}
          name={filterType}
          value={filters[filterType] || ""}
          onChange={(e) => handleFilterChange(filterType, e.target.value)}
        >
          <option value="">All {filterType}</option>
          {filterOptions[filterType].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ))}

      {/* Reset Button */}
      <button onClick={()=> resetFilters()}>Reset Filters</button>
      </Box>
     
    </div>
  );
}