// src/components/ChartProfit.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ChartProfit({ details }) {
  if (!details || details.length === 0) {
    return <div>No data available</div>;
  }

  // Group profits by driver
  const dataByDriver = details.reduce((acc, d) => {
    if (!acc[d.driver]) {
      acc[d.driver] = { driver: d.driver, totalProfit: 0, deliveries: 0 };
    }
    acc[d.driver].totalProfit += d.profit || 0;
    acc[d.driver].deliveries += 1;
    return acc;
  }, {});

  const chartData = Object.values(dataByDriver);

  return (
    <div style={{ marginTop: "20px" }}>
      <h4>Profit by Driver</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="driver" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalProfit" fill="#82ca9d" name="Total Profit (₹)" />
          <Bar dataKey="deliveries" fill="#8884d8" name="Deliveries" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
