// src/components/ChartDeliveries.jsx
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

export default function ChartDeliveries({ history }) {
  if (!history || history.length === 0) return <p>No deliveries data.</p>;

  const data = history.map((h, idx) => ({
    name: `Run ${idx + 1}`,
    onTime: h.result?.on_time || 0,
    total: h.result?.total_deliveries || 0,
  }));

  return (
    <div style={{ marginTop: 20 }}>
      <h3>📦 Deliveries Performance</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#3498db" name="Total Deliveries" />
          <Bar dataKey="onTime" fill="#2ecc71" name="On-time Deliveries" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
