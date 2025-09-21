// src/components/Sidebar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const nav = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    nav("/");
  }

  return (
    <aside
      style={{
        width: "220px",
        background: "#2c3e50",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h2 style={{ color: "#ecf0f1", marginBottom: "30px" }}>GreenCart</h2>
      <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>
          📊 Dashboard
        </Link>
        <Link to="/drivers" style={{ color: "white", textDecoration: "none" }}>
          🚚 Drivers
        </Link>
        <Link to="/orders" style={{ color: "white", textDecoration: "none" }}>
          📦 Orders
        </Link>
        <Link to="/routes" style={{ color: "white", textDecoration: "none" }}>
          🛣 Routes
        </Link>
        <Link to="/upload" style={{ color: "white", textDecoration: "none" }}>
          📂 Upload CSV
        </Link>
        <Link to="/simulation" style={{ color: "white", textDecoration: "none" }}>
          ⚡ Simulation History
        </Link>
        <button
          onClick={handleLogout}
          style={{
            marginTop: "20px",
            background: "#e74c3c",
            border: "none",
            padding: "10px",
            color: "white",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          🔒 Logout
        </button>
      </nav>
    </aside>
  );
}
