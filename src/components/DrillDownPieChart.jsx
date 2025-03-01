import { useState } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { PieChart } from "@mui/x-charts/PieChart";
import { List } from "@mui/material";

// Function to format pie chart values
const valueFormatter = (value) => `${value}`;

// 🔹 Process API data into a domain → subdomains mapping
const processData = (data) => {
  const domainMap = {};

  data.forEach(({ label, subdomain, value }) => {
    if (label !== "Unlabeled") {
      if (!domainMap[label]) {
        domainMap[label] = {};
      }

      if (!domainMap[label][subdomain]) {
        domainMap[label][subdomain] = 0;
      }

      domainMap[label][subdomain] += Number(value) || 0;
    }
  });

  return domainMap;
};

export default function DrilldownPieChart({ risksData }) {
  const [currentDomain, setCurrentDomain] = useState(null);

  // Convert flat risksData into a structured domain-to-subdomain map
  const domainMap = processData(risksData);
  console.log(domainMap);
  // 🔹 Aggregate domain values
  const domainSeries = Object.keys(domainMap).map((domain) => ({
    label: domain,
    value: Number(
      Object.values(domainMap[domain]).reduce((sum, count) => sum + count, 0)
    ),
  }));
  console.log("series", domainSeries);

  // 🔹 Generate subdomain-level pie chart when a domain is clicked
  const subdomainSeries = currentDomain
    ? Object.keys(domainMap[currentDomain]).map((subdomain) => ({
        label: subdomain,
        value: domainMap[currentDomain][subdomain],
      }))
    : [];

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={{ xs: 0, md: 4 }}
      sx={{ width: "100%" }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <PieChart
          series={[
            {
              innerRadius: 0,
              outerRadius: 80,
              highlightScope: { fade: "global", highlight: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
              id: "domain-series",
              data: currentDomain ? subdomainSeries : domainSeries,
            },
          ]}
          width={400}
          height={300}
          slotProps={{ legend: { hidden: true } }}
          onItemClick={(event, _, item) => {
            if (!currentDomain) {
              setCurrentDomain(item.label);
            }
          }}
        />
      </Box>

      <Stack direction="column" sx={{ width: { xs: "100%", md: "40%" } }}>
        <Box
          sx={{
            // display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>
            {currentDomain
              ? `Subdomains in ${currentDomain}`
              : "Click a domain"}
          </Typography>

          {currentDomain && (
            <>
              <Box sx={{ mt: 2 }}>
                <ul>
                  {Object.keys(domainMap[currentDomain]).map((subdomain) => (
                    <li key={subdomain}>
                      {subdomain}: {domainMap[currentDomain][subdomain]}
                    </li>
                  ))}
                </ul>
              </Box>
            </>
          )}

          {currentDomain && (
            <IconButton
              aria-label="reset"
              size="small"
              onClick={() => setCurrentDomain(null)}
            >
              Reset 🔄
            </IconButton>
          )}
        </Box>
      </Stack>
    </Stack>
  );
}
