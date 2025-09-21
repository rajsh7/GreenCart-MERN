// src/App.jsx
import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

export default function App() {
  const nav = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === "/"; // ✅ hide sidebar on login page

  function handleLogout() {
    localStorage.removeItem("token");
    nav("/");
  }

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar only after login */}
      {!isLoginPage && (
        <aside className="sidebar">
          <h2 className="logo">GreenCart</h2>
          <nav>
            <Link to="/dashboard">📊 Dashboard</Link>
            <Link to="/drivers">🚚 Drivers</Link>
            <Link to="/orders">📦 Orders</Link>
            <Link to="/routes">🛣 Routes</Link>
            <Link to="/upload">📂 Upload CSV</Link>
            <button onClick={handleLogout} className="btn-logout">
              🔒 Logout
            </button>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main style={{ flex: 1, padding: "20px", marginLeft: !isLoginPage ? "220px" : "0" }}>
        <Outlet />
      </main>
    </div>
  );
}
