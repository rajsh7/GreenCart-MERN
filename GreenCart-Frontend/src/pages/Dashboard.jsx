// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { runSim, getSimHistory, getReport } from "../api";
import ChartProfit from "../components/ChartProfit";
import ChartEfficiency from "../components/ChartEfficiency";
import ChartDeliveries from "../components/ChartDeliveries";
import ChartProfitCost from "../components/ChartProfitCost"; // ⬅️ NEW

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const [numDrivers, setNumDrivers] = useState(3);
  const [maxHours, setMaxHours] = useState(8);
  const [startTime, setStartTime] = useState("09:00");
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    if (!token) return;
    getSimHistory(token)
      .then((res) => setHistory(res.data))
      .catch((err) => console.error("Failed to load history", err));
  }, [token]);

  async function handleRun() {
    if (!token) {
      alert("Please login again!");
      nav("/");
      return;
    }
    setLoading(true);
    try {
      const res = await runSim(token, {
        num_drivers: numDrivers,
        route_start_time: startTime,
        max_hours_per_driver: maxHours,
      });
      setKpis(res.data);

      const histRes = await getSimHistory(token);
      setHistory(histRes.data);
    } catch (err) {
      alert("Simulation failed: " + (err?.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    try {
      const res = await getReport(token);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download report: " + (err?.response?.data?.error || err.message));
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    nav("/");
  }

  return (
    <div className="page-container">
      <h2>📊 Dashboard</h2>

      {/* Simulation Controls */}
      <div className="form-row">
        <label>
          Drivers:
          <input
            type="number"
            min="1"
            value={numDrivers}
            onChange={(e) => setNumDrivers(parseInt(e.target.value || 1))}
          />
        </label>
        <label>
          Max Hours:
          <input
            type="number"
            value={maxHours}
            onChange={(e) => setMaxHours(parseFloat(e.target.value || 8))}
          />
        </label>
        <label>
          Start Time:
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
        <button onClick={handleRun} disabled={loading}>
          {loading ? "Running..." : "Run Simulation"}
        </button>

        {/* PDF Download Button */}
        <button onClick={handleDownload} style={{ marginLeft: "10px" }}>
          📄 Download Report (PDF)
        </button>
      </div>

      {/* KPIs */}
      {kpis && (
        <div className="kpis">
          <h3>📈 KPIs</h3>
          <div>Total Profit: ₹{kpis.total_profit}</div>
          <div>Efficiency: {kpis.efficiency}%</div>
          <div>
            On-time: {kpis.on_time} / {kpis.total_deliveries}
          </div>
        </div>
      )}

      {/* Charts */}
      {history.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <ChartProfit details={kpis?.details || []} />
          <ChartEfficiency history={history} />
          <ChartDeliveries history={history} />
          <ChartProfitCost history={history} /> {/* ⬅️ NEW */}
        </div>
      )}

      {/* Simulation History */}
      <div className="history">
        <h3>⚡ Simulation History</h3>
        {history.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Drivers</th>
                <th>Max Hours</th>
                <th>Start</th>
                <th>Profit</th>
                <th>Efficiency</th>
                <th>On-time</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h._id}>
                  <td>{new Date(h.createdAt).toLocaleString()}</td>
                  <td>{h.input_params?.num_drivers}</td>
                  <td>{h.input_params?.max_hours_per_driver}</td>
                  <td>{h.input_params?.route_start_time}</td>
                  <td>₹{h.result?.total_profit}</td>
                  <td>{h.result?.efficiency}%</td>
                  <td>
                    {h.result?.on_time} / {h.result?.total_deliveries}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No simulations found.</p>
        )}
      </div>
    </div>
  );
}
