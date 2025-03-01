// src/components/visualizations/CausalDonutChart.js
import React from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip,
//   Legend,
// } from "recharts";
import { PieChart } from "@mui/x-charts/PieChart";
import "../App.css";

// const COLORS = ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b"];

// const RADIAN = Math.PI / 180;
// const renderCustomizedLabel = ({
//   cx,
//   cy,
//   midAngle,
//   innerRadius,
//   outerRadius,
//   percent,
//   name,
// }) => {
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);

//   return (
//     <text
//       x={x}
//       y={y}
//       fill="white"
//       textAnchor={x > cx ? "start" : "end"}
//       dominantBaseline="central"
//       fontSize={12}
//     >
//       {`${(percent * 100).toFixed(0)}%`}
//     </text>
//   );
// };

// 🎨 Define colors (optional)
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#d45087"];

const CausalDonutChart = ({ data }) => {
  const filteredPieData = data.filter(
    (item) => item.domain !== "Unlabeled" && item.subdomain !== "Unlabeled"
  );
  return (
    <PieChart
      series={[
        {
          arcLabel: (item) => `${item.value}%`,
          data: filteredPieData,
          highlightScope: { fade: "global", highlight: "item" },
          faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
        },
      ]}
      height={800}
    />
    // <PieChart width={800} height={800}>
    //   <Pie
    //     data={filteredPieData}
    //     dataKey="value"
    //     nameKey="subdomain"
    //     cx="50%"
    //     cy="50%"
    //     outerRadius={200}
    //     fill="#8884d8"
    //     label={({ name, value }) => `${name}: ${value}`} // Show subdomain & value on slices
    //   >
    //     {filteredPieData.map((entry, index) => (
    //       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    //     ))}
    //   </Pie>
    //   <Tooltip
    //     formatter={(value, name, props) => [
    //       `Count: ${value}`,
    //       `Domain: ${props.payload.domain} | Subdomain: ${name}`,
    //     ]}
    //   />
    // </PieChart>
  );
};

// const CausalDonutChart = ({ data }) => {
//   // Calculate total for percentages
//   const total = data.reduce((sum, item) => sum + item.value, 0);
//   console.log("inside data", data);
//   // Add percentage to each item for display
//   const chartData = data.map((item) => ({
//     ...item,
//     percentage: ((item.value / total) * 100).toFixed(1),
//   }));

//   return (
//     <div className="chart-container">
//       <ResponsiveContainer width="100%" height={300}>
//         <PieChart>
//           <Pie
//             data={chartData}
//             cx="50%"
//             cy="50%"
//             labelLine={false}
//             label={renderCustomizedLabel}
//             outerRadius={100}
//             innerRadius={40}
//             fill="#8884d8"
//             dataKey="value"
//             animationDuration={1500}
//           >
//             {chartData.map((entry, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 fill={COLORS[index % COLORS.length]}
//               />
//             ))}
//           </Pie>
//           <Tooltip
//             formatter={(value, name, props) => [
//               `${value} (${props.payload.percentage}%)`,
//               "Count",
//             ]}
//           />
//           <Legend
//             formatter={(value, entry) => (
//               <span style={{ color: "#495057" }}>
//                 {value} ({entry.payload.percentage}%)
//               </span>
//             )}
//           />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

export default CausalDonutChart;
