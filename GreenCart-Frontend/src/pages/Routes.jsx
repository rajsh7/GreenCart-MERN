// src/pages/Routes.jsx
import React, { useEffect, useState } from "react";
import { getRoutes, createRoute, updateRoute, deleteRoute } from "../api";

export default function RoutesPage() {
  const token = localStorage.getItem("token");
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({
    route_id: "",
    distance_km: "",
    traffic_level: "Low",
    base_time_min: "",
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRoutes = async () => {
    try {
      const data = await getRoutes(token);
      setRoutes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching routes", err);
      setError("⚠️ Could not load routes.");
    }
  };

  useEffect(() => {
    fetchRoutes();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.route_id.trim()) {
      setError("Route ID is required.");
      return;
    }
    const distance = parseFloat(form.distance_km);
    const time = parseFloat(form.base_time_min);
    if (isNaN(distance) || distance <= 0) {
      setError("Distance must be positive.");
      return;
    }
    if (isNaN(time) || time <= 0) {
      setError("Base time must be positive.");
      return;
    }

    setLoading(true);
    try {
      if (editId) await updateRoute(token, editId, { ...form, distance_km: distance, base_time_min: time });
      else await createRoute(token, { ...form, distance_km: distance, base_time_min: time });

      setForm({ route_id: "", distance_km: "", traffic_level: "Low", base_time_min: "" });
      setEditId(null);
      fetchRoutes();
    } catch (err) {
      console.error(err);
      setError("⚠️ Could not save route.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (route) => {
    setForm({
      route_id: route.route_id,
      distance_km: route.distance_km,
      traffic_level: route.traffic_level,
      base_time_min: route.base_time_min,
    });
    setEditId(route._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this route?")) return;
    try {
      await deleteRoute(token, id);
      fetchRoutes();
    } catch (err) {
      console.error(err);
      setError("⚠️ Could not delete route.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛣 Routes Management</h2>
      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

      <div style={{ marginBottom: "20px" }}>
        <input name="route_id" placeholder="Route ID" value={form.route_id} onChange={handleChange} />
        <input name="distance_km" type="number" placeholder="Distance (km)" value={form.distance_km} onChange={handleChange} />
        <select name="traffic_level" value={form.traffic_level} onChange={handleChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input name="base_time_min" type="number" placeholder="Base Time (min)" value={form.base_time_min} onChange={handleChange} />
        <button onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : editId ? "Update Route" : "Add Route"}</button>
      </div>

      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Route ID</th>
            <th>Distance (km)</th>
            <th>Traffic Level</th>
            <th>Base Time (min)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.length > 0 ? (
            routes.map((r) => (
              <tr key={r._id}>
                <td>{r.route_id}</td>
                <td>{r.distance_km}</td>
                <td>{r.traffic_level}</td>
                <td>{r.base_time_min}</td>
                <td>
                  <button onClick={() => handleEdit(r)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(r._id)}>❌ Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5" style={{ textAlign: "center" }}>No routes found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
