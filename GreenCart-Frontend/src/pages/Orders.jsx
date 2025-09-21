import React, { useEffect, useState } from "react";
import { API } from "../api";

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
      const res = await API.get(`/orders?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      if (editId) {
        await API.put(
          `/orders/${editId}`,
          {
            order_id: form.order_id,
            route_id: form.route_id,
            revenue: Number(form.revenue || 0),
            cost: Number(form.cost || 0),
            status: form.status,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await API.post(
          "/orders",
          {
            order_id: form.order_id,
            route_id: form.route_id,
            revenue: Number(form.revenue || 0),
            cost: Number(form.cost || 0),
            status: form.status,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setForm({ order_id: "", route_id: "", revenue: "", cost: "", status: "pending" });
      setEditId(null);
      fetchOrders();
    } catch (err) {
      console.error("❌ Error saving order:", err);
    }
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
    try {
      await API.delete(`/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (err) {
      console.error("❌ Error deleting order:", err);
    }
  };

  const filtered = orders
    .filter((o) =>
      (o.order_id || "").toString().toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[sortField] ?? "";
      const valB = b[sortField] ?? "";
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const toggleSort = (field) => {
    if (field === sortField) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 Orders Management</h2>

      <input
        placeholder="Search by Order ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "10px" }}
      />

      <div style={{ marginBottom: "20px" }}>
        <input name="order_id" placeholder="Order ID" value={form.order_id} onChange={handleChange} />
        <input name="route_id" placeholder="Route ID" value={form.route_id} onChange={handleChange} />
        <input name="revenue" placeholder="Revenue (₹)" type="number" value={form.revenue} onChange={handleChange} />
        <input name="cost" placeholder="Cost (₹)" type="number" value={form.cost} onChange={handleChange} />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button onClick={handleSubmit}>{editId ? "Update Order" : "Add Order"}</button>
      </div>

      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
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
                <td>₹{o.revenue}</td>
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
