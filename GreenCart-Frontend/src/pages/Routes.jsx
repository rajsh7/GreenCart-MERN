// src/pages/Routes.jsx
import { useEffect, useState } from "react";
import { getRoutes, createRoute } from "../api";

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoute, setNewRoute] = useState({ start: "", end: "" });

  useEffect(() => {
    fetchRoutes();
  }, []);

  async function fetchRoutes() {
    try {
      const { data } = await getRoutes();
      setRoutes(data);
    } catch (err) {
      console.error("❌ Error fetching routes:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateRoute(e) {
    e.preventDefault();
    try {
      await createRoute(newRoute);
      setNewRoute({ start: "", end: "" });
      fetchRoutes();
    } catch (err) {
      console.error("❌ Error creating route:", err);
    }
  }

  return (
    <div>
      <h1>🛣️ Routes</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {routes.map((r) => (
            <li key={r.id}>
              {r.start} → {r.end}
            </li>
          ))}
        </ul>
      )}

      <h2>Create Route</h2>
      <form onSubmit={handleCreateRoute}>
        <input
          type="text"
          placeholder="Start"
          value={newRoute.start}
          onChange={(e) => setNewRoute({ ...newRoute, start: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="End"
          value={newRoute.end}
          onChange={(e) => setNewRoute({ ...newRoute, end: e.target.value })}
          required
        />
        <button type="submit">Add Route</button>
      </form>
    </div>
  );
}
