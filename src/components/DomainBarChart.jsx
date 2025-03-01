// src/components/visualizations/DomainBarChart.js
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./Visualizations.css";

const COLORS = [
  "#4e73df",
  "#1cc88a",
  "#36b9cc",
  "#f6c23e",
  "#e74a3b",
  "#6f42c1",
  "#fd7e14",
];

const DomainBarChart = ({ data }) => {
  // Sort data by count in descending order
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={sortedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="domain"
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
          />
          <YAxis
            label={{
              value: "Number of Risks",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip formatter={(value) => [`${value} risks`, "Count"]} />
          <Bar
            dataKey="count"
            name="Risks"
            fill={(entry, index) => COLORS[index % COLORS.length]}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DomainBarChart;
