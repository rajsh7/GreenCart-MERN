import React, { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    order_id: "",
    route_id: "",
    revenue: "",
    cost: "",
    status: "pending",
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("order_id");
  const [sortOrder, setSortOrder] = useState("asc");

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:5000/api/orders/${editId}`
      : "http://localhost:5000/api/orders";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    setForm({
      order_id: "",
      route_id: "",
      revenue: "",
      cost: "",
      status: "pending",
    });
    setEditId(null);
    fetchOrders();
  };

  const handleEdit = (o) => {
    setForm({
      order_id: o.order_id,
      route_id: o.route_id,
      revenue: o.revenue,
      cost: o.cost,
      status: o.status,
    });
    setEditId(o._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    await fetch(`http://localhost:5000/api/orders/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchOrders();
  };

  // 🔎 Filter + Sorting
  const filtered = orders
    .filter((o) =>
      o.order_id?.toString().toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[sortField] ?? "";
      const valB = b[sortField] ?? "";
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const toggleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 Orders Management</h2>

      {/* Search */}
      <input
        placeholder="Search by Order ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "10px" }}
      />

      {/* Form */}
      <div style={{ marginBottom: "20px" }}>
        <input
          name="order_id"
          placeholder="Order ID"
          value={form.order_id}
          onChange={handleChange}
        />
        <input
          name="route_id"
          placeholder="Route ID"
          value={form.route_id}
          onChange={handleChange}
        />
        <input
          name="revenue"
          placeholder="Revenue (₹)"
          type="number"
          value={form.revenue}
          onChange={handleChange}
        />
        <input
          name="cost"
          placeholder="Cost (₹)"
          type="number"
          value={form.cost}
          onChange={handleChange}
        />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button onClick={handleSubmit}>
          {editId ? "Update Order" : "Add Order"}
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
            <th onClick={() => toggleSort("order_id")}>Order ID ⬍</th>
            <th onClick={() => toggleSort("route_id")}>Route ID ⬍</th>
            <th onClick={() => toggleSort("revenue")}>Revenue ⬍</th>
            <th onClick={() => toggleSort("cost")}>Cost ⬍</th>
            <th onClick={() => toggleSort("status")}>Status ⬍</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((o) => (
              <tr key={o._id}>
                <td>{o.order_id}</td>
                <td>{o.route_id}</td>
                <td>₹{o.revenue}</td>   {/* ✅ fixed */}
                <td>₹{o.cost}</td> 
                <td>{o.status}</td>
                <td>
                  <button onClick={() => handleEdit(o)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(o._id)}>❌ Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
