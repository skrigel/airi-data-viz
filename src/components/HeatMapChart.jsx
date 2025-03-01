import React, { useState } from "react";

import { Card, CardContent, CardHeader, Typography } from "@mui/material";

const HeatmapChart = () => {
  // Sample data - in production, this would come from your API
  const [data, setData] = useState([
    {
      domain: "Misinformation",
      "Pre-deployment": 37,
      Deployment: 65,
      "Post-deployment": 28,
      "Human-caused": 47,
      total: 177,
    },
    {
      domain: "Privacy",
      "Pre-deployment": 52,
      Deployment: 33,
      "Post-deployment": 48,
      "Human-caused": 25,
      total: 158,
    },
    {
      domain: "Security",
      "Pre-deployment": 18,
      Deployment: 42,
      "Post-deployment": 39,
      "Human-caused": 61,
      total: 160,
    },
    {
      domain: "Fairness",
      "Pre-deployment": 46,
      Deployment: 29,
      "Post-deployment": 56,
      "Human-caused": 33,
      total: 164,
    },
    {
      domain: "Safety",
      "Pre-deployment": 29,
      Deployment: 57,
      "Post-deployment": 30,
      "Human-caused": 42,
      total: 158,
    },
    {
      domain: "Autonomy",
      "Pre-deployment": 41,
      Deployment: 36,
      "Post-deployment": 22,
      "Human-caused": 39,
      total: 138,
    },
    {
      domain: "Labor",
      "Pre-deployment": 15,
      Deployment: 27,
      "Post-deployment": 18,
      "Human-caused": 21,
      total: 81,
    },
  ]);

  // Find max value for scaling the colors
  const maxValue = Math.max(
    ...data.flatMap((item) =>
      Object.entries(item)
        .filter(([key]) => key !== "domain" && key !== "total")
        .map(([_, value]) => value)
    )
  );

  // Get all causal factors (columns)
  const causalFactors = Object.keys(data[0]).filter(
    (key) => key !== "domain" && key !== "total"
  );

  // Calculate color intensity based on value
  const getColorIntensity = (value) => {
    const normalizedValue = value / maxValue;
    // Blue color scale from light to dark
    return `rgba(25, 118, 210, ${normalizedValue * 0.9 + 0.1})`;
  };

  // State for tooltip
  const [tooltip, setTooltip] = useState({
    show: false,
    content: "",
    x: 0,
    y: 0,
  });

  const showTooltip = (domain, factor, value, event) => {
    setTooltip({
      show: true,
      content: `${domain} × ${factor}: ${value} risks`,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const hideTooltip = () => {
    setTooltip({ ...tooltip, show: false });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <Typography>AI Risk Heatmap: Domain × Causal Factor</Typography>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Heatmap grid */}
          <div className="grid grid-cols-1 gap-1">
            {/* Header row */}
            <div className="grid grid-cols-7 gap-1">
              <div className="h-10 flex items-center justify-center font-medium"></div>
              {causalFactors.map((factor) => (
                <div
                  key={factor}
                  className="h-10 flex items-center justify-center font-medium"
                >
                  {factor}
                </div>
              ))}
            </div>

            {/* Data rows */}
            {data.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-7 gap-1">
                {/* Domain name */}
                <div className="h-12 flex items-center font-medium">
                  {row.domain}
                </div>

                {/* Heatmap cells */}
                {causalFactors.map((factor) => (
                  <div
                    key={`${row.domain}-${factor}`}
                    className="h-12 flex items-center justify-center text-sm transition-colors hover:brightness-110 cursor-pointer"
                    style={{
                      backgroundColor: getColorIntensity(row[factor]),
                      color: row[factor] > maxValue * 0.5 ? "white" : "black",
                    }}
                    onMouseEnter={(e) =>
                      showTooltip(row.domain, factor, row[factor], e)
                    }
                    onMouseLeave={hideTooltip}
                  >
                    {row[factor]}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Tooltip */}
          {tooltip.show && (
            <div
              className="absolute bg-white shadow-lg rounded p-2 z-10 text-sm"
              style={{
                left: `${tooltip.x}px`,
                top: `${tooltip.y}px`,
                transform: "translate(-50%, -100%)",
                pointerEvents: "none",
              }}
            >
              {tooltip.content}
            </div>
          )}
        </div>

        {/* Color scale legend */}
        <div className="flex justify-end items-center mt-4">
          <div className="text-xs mr-2">Low</div>
          <div className="w-32 h-4 bg-gradient-to-r from-blue-100 to-blue-800 rounded"></div>
          <div className="text-xs ml-2">High</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeatmapChart;
