// src/components/ChartEfficiency.jsx
import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function ChartEfficiency({ history }) {
  if (!history || history.length === 0) return <p>No efficiency data.</p>;

  const data = history.map((h, idx) => ({
    name: `Run ${idx + 1}`,
    efficiency: h.result?.efficiency || 0,
  }));

  return (
    <div style={{ marginTop: 20 }}>
      <h3>⚡ Efficiency Over Runs</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="efficiency" stroke="#27ae60" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
