// src/components/DomainBarChart/DomainBarChart.js

// import "./Visualizations.css";


import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
// import { addLabels, balanceSheet } from './netflixsBalanceSheet';


// const chartSetting = {
//   xAxis: [
//     {
//       label: 'rainfall (mm)',
//     },
//   ],
//   width: 500,
//   height: 400,
// };

// const createLabels = (domainData) => {
//   //only keys are domain, subdomain, timing



// }

// export function addLabels(series) {
//   return series.map((item) => ({
//     ...item,
//     label: item.dataKey,
//     valueFormatter: (v) => (v ? `$ ${v.toLocaleString()}k` : '-'),
//   }));
// }
import { axisClasses } from '@mui/x-charts/ChartsAxis';

const chartSetting = {
  yAxis: [
    {
      label: 'Incidence of Risk',
    },
  ],
  xAxis: [{ scaleType: 'band', dataKey: 'domain', label: "Risk Domain", tickLabelStyle: { opacity: 0 }, }],
  // series: [{ dataKey: 'seoul', label: 'Seoul rainfall', valueFormatter }],
  height: 300,
  width: 600,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: 'translateX(-10px)',
    },
  },
};


export default function DomainBarChart({ barData }) {

  return (
    <BarChart
      dataset={barData}
      series={[
        { dataKey: "Post-deployment", label: "Post-deployment" },
        { dataKey: "Pre-deployment", label: "Pre-deployment" },
        { dataKey: "Other", label: "Other" },
        { dataKey: "Not coded", label: "Not Coded" },
  
      ]}
      slotProps={{ legend: { hidden: false } }}
      

      
      {...chartSetting}
    />
  );
}

// const COLORS = [
//   "#4e73df",
//   "#1cc88a",
//   "#36b9cc",
//   "#f6c23e",
//   "#e74a3b",
//   "#6f42c1",
//   "#fd7e14",
// ];
