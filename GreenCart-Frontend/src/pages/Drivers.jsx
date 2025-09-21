import React, { useEffect, useState } from "react";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({ name: "", current_shift_hours: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchDrivers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/drivers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch drivers");
      const data = await res.json();
      setDrivers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching drivers:", err);
      setError("⚠️ Could not load drivers.");
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // clear errors on typing
  };

  const handleSubmit = async () => {
    // 🔎 Validation
    if (!form.name.trim()) {
      setError("Driver name is required.");
      return;
    }
    const hours = parseFloat(form.current_shift_hours);
    if (isNaN(hours) || hours < 0 || hours > 24) {
      setError("Shift hours must be a number between 0 and 24.");
      return;
    }

    setLoading(true);
    try {
      const method = editId ? "PUT" : "POST";
      const url = editId
        ? `http://localhost:5000/api/drivers/${editId}`
        : "http://localhost:5000/api/drivers";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, current_shift_hours: hours }),
      });

      if (!res.ok) throw new Error("Failed to save driver");

      setForm({ name: "", current_shift_hours: "" });
      setEditId(null);
      fetchDrivers();
    } catch (err) {
      console.error(err);
      setError("⚠️ Could not save driver.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (d) => {
    setForm({ name: d.name, current_shift_hours: d.current_shift_hours });
    setEditId(d._id);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/drivers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete driver");
      fetchDrivers();
    } catch (err) {
      console.error(err);
      setError("⚠️ Could not delete driver.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🚚 Drivers Management</h2>

      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

      {/* Form */}
      <div style={{ marginBottom: "20px" }}>
        <input
          name="name"
          placeholder="Driver Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="current_shift_hours"
          type="number"
          placeholder="Shift Hours (0-24)"
          value={form.current_shift_hours}
          onChange={handleChange}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : editId ? "Update Driver" : "Add Driver"}
        </button>
      </div>

      {/* Table */}
      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Shift Hours</th>
            <th>Past 7 Days</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers.length > 0 ? (
            drivers.map((d) => (
              <tr key={d._id}>
                <td>{d.name}</td>
                <td>{d.current_shift_hours}</td>
                <td>{d.past_7_days?.join(", ") || "-"}</td>
                <td>
                  <button onClick={() => handleEdit(d)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(d._id)}>❌ Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No drivers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
