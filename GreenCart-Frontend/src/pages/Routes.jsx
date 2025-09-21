import React, { useEffect, useState } from "react";
import { getRoutes, createRoute, updateRoute, deleteRoute } from "../api";

export default function RoutesPage() {
  const token = localStorage.getItem("token");
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({ route_id: "", distance_km: "", traffic_level: "Low", base_time_min: "" });
  const [editId, setEditId] = useState(null);

  const fetchRoutes = async () => {
    try { const res = await getRoutes(token); setRoutes(res.data); } 
    catch (err) { console.error(err); }
  };

  useEffect(() => { fetchRoutes(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      if (editId) await updateRoute(token, editId, form);
      else await createRoute(token, form);
      setForm({ route_id: "", distance_km: "", traffic_level: "Low", base_time_min: "" });
      setEditId(null);
      fetchRoutes();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (r) => { setForm(r); setEditId(r._id); };
  const handleDelete = async (id) => { await deleteRoute(token, id); fetchRoutes(); };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛣 Routes Management</h2>
      <input name="route_id" placeholder="Route ID" value={form.route_id} onChange={handleChange} />
      <input name="distance_km" type="number" placeholder="Distance" value={form.distance_km} onChange={handleChange} />
      <select name="traffic_level" value={form.traffic_level} onChange={handleChange}>
        <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
      </select>
      <input name="base_time_min" type="number" placeholder="Base Time" value={form.base_time_min} onChange={handleChange} />
      <button onClick={handleSubmit}>{editId ? "Update" : "Add"}</button>

      <table border="1" cellPadding="8">
        <thead>
          <tr><th>Route ID</th><th>Distance</th><th>Traffic</th><th>Base Time</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {routes.map((r) => (
            <tr key={r._id}>
              <td>{r.route_id}</td><td>{r.distance_km}</td><td>{r.traffic_level}</td><td>{r.base_time_min}</td>
              <td>
                <button onClick={() => handleEdit(r)}>✏️</button>
                <button onClick={() => handleDelete(r._id)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
