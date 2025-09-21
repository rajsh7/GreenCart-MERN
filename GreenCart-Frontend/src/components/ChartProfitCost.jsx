// src/components/ChartProfitCost.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ChartProfitCost({ history }) {
  // Transform history into chart-friendly data
  const data = history.map((h, i) => ({
    name: `Run ${i + 1}`,
    revenue: h.result?.total_revenue || 0,
    cost: h.result?.total_cost || 0,
  }));

  return (
    <div style={{ marginTop: 30 }}>
      <h3>💰 Revenue vs. Cost Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#4caf50" name="Revenue (₹)" />
          <Line type="monotone" dataKey="cost" stroke="#f44336" name="Cost (₹)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
