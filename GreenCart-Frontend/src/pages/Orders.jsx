import React, { useEffect, useState } from "react";
import { getOrders, createOrder, updateOrder, deleteOrder } from "../api";

export default function Orders() {
  const token = localStorage.getItem("token");
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ order_id: "", route_id: "", revenue: "", cost: "", status: "pending" });
  const [editId, setEditId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await getOrders(token);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
      setOrders([]);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      if (editId) await updateOrder(token, editId, form);
      else await createOrder(token, form);
      setForm({ order_id: "", route_id: "", revenue: "", cost: "", status: "pending" });
      setEditId(null);
      fetchOrders();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (o) => { setForm(o); setEditId(o._id); };
  const handleDelete = async (id) => { await deleteOrder(token, id); fetchOrders(); };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 Orders Management</h2>
      <input placeholder="Search" />
      <div style={{ marginBottom: "20px" }}>
        <input name="order_id" placeholder="Order ID" value={form.order_id} onChange={handleChange} />
        <input name="route_id" placeholder="Route ID" value={form.route_id} onChange={handleChange} />
        <input name="revenue" type="number" placeholder="Revenue" value={form.revenue} onChange={handleChange} />
        <input name="cost" type="number" placeholder="Cost" value={form.cost} onChange={handleChange} />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button onClick={handleSubmit}>{editId ? "Update Order" : "Add Order"}</button>
      </div>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Order ID</th><th>Route ID</th><th>Revenue</th><th>Cost</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{o.order_id}</td><td>{o.route_id}</td><td>{o.revenue}</td><td>{o.cost}</td><td>{o.status}</td>
              <td>
                <button onClick={() => handleEdit(o)}>✏️</button>
                <button onClick={() => handleDelete(o._id)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
