// src/pages/Simulation.jsx
import React, { useState } from "react";
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

export default function Simulation() {
  const [numDrivers, setNumDrivers] = useState(3);
  const [maxHours, setMaxHours] = useState(8);
  const [startTime, setStartTime] = useState("09:00");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const runSimulation = async () => {
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          num_drivers: numDrivers,
          route_start_time: startTime,
          max_hours_per_driver: maxHours,
        }),
      });

      if (!res.ok) throw new Error("Simulation request failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Simulation</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>
          Number of Drivers:
          <input
            type="number"
            value={numDrivers}
            onChange={(e) => setNumDrivers(e.target.value)}
          />
        </label>{" "}
        <label>
          Max Hours per Driver:
          <input
            type="number"
            value={maxHours}
            onChange={(e) => setMaxHours(e.target.value)}
          />
        </label>{" "}
        <label>
          Start Time:
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>{" "}
        <button onClick={runSimulation}>Run Simulation</button>
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {result && (
        <div>
          <h3>Results</h3>
          <p>
            Total Deliveries: {result.total_deliveries} | On Time:{" "}
            {result.on_time} | Efficiency: {result.efficiency}% | Profit: ₹
            {result.total_profit}
          </p>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={result.details}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="order_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="profit" fill="#82ca9d" />
              <Bar dataKey="fuel" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          {/* Details */}
          <h4>Order Details</h4>
          <table border="1" cellPadding="5" style={{ marginTop: "10px" }}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Driver</th>
                <th>Profit</th>
                <th>Fuel</th>
                <th>Bonus</th>
                <th>Penalty</th>
                <th>Late?</th>
              </tr>
            </thead>
            <tbody>
              {result.details.map((d, i) => (
                <tr key={i}>
                  <td>{d.order_id}</td>
                  <td>{d.driver}</td>
                  <td>{d.profit}</td>
                  <td>{d.fuel}</td>
                  <td>{d.bonus}</td>
                  <td>{d.penalty}</td>
                  <td>{d.late ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
