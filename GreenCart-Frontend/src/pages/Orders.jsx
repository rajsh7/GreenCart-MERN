// src/pages/Orders.jsx
import { useEffect, useState } from "react";
import { getOrders, createOrder } from "../api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOrder, setNewOrder] = useState({ customer: "", status: "Pending" });

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const { data } = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateOrder(e) {
    e.preventDefault();
    try {
      await createOrder(newOrder);
      setNewOrder({ customer: "", status: "Pending" });
      fetchOrders();
    } catch (err) {
      console.error("❌ Error creating order:", err);
    }
  }

  return (
    <div>
      <h1>📦 Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {orders.map((o) => (
            <li key={o.id}>
              {o.customer} – <strong>{o.status}</strong>
            </li>
          ))}
        </ul>
      )}

      <h2>Create Order</h2>
      <form onSubmit={handleCreateOrder}>
        <input
          type="text"
          placeholder="Customer"
          value={newOrder.customer}
          onChange={(e) =>
            setNewOrder({ ...newOrder, customer: e.target.value })
          }
          required
        />
        <select
          value={newOrder.status}
          onChange={(e) =>
            setNewOrder({ ...newOrder, status: e.target.value })
          }
        >
          <option>Pending</option>
          <option>Delivered</option>
        </select>
        <button type="submit">Add Order</button>
      </form>
    </div>
  );
}
