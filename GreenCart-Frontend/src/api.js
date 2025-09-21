// src/api.js
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://greencart-mern.onrender.com/api");

const API = axios.create({ baseURL: API_BASE });

// 🔑 Auth
export function login(username, password) {
  return API.post("/login", { username, password });
}

// 🚚 Simulation
export function runSim(token, payload) {
  return API.post("/simulate", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getSimHistory(token) {
  return API.get("/simulate/history", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// 📂 CSV Loader
export function loadCSVs(token, formData, type) {
  return API.post(`/load_csv/${type}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
}

// 📄 PDF Report
export function getReport(token) {
  return API.get("/report", {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob",
  });
}

// 👨‍✈️ Drivers
export function getDrivers(token) {
  return API.get("/drivers", { headers: { Authorization: `Bearer ${token}` } });
}
export function createDriver(token, payload) {
  return API.post("/drivers", payload, { headers: { Authorization: `Bearer ${token}` } });
}
export function updateDriver(token, id, payload) {
  return API.put(`/drivers/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
}
export function deleteDriver(token, id) {
  return API.delete(`/drivers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
}

// 📦 Orders
export function getOrders(token) {
  return API.get("/orders", { headers: { Authorization: `Bearer ${token}` } });
}
export function saveOrder(token, id, payload) {
  return id
    ? API.put(`/orders/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } })
    : API.post("/orders", payload, { headers: { Authorization: `Bearer ${token}` } });
}
export function deleteOrder(token, id) {
  return API.delete(`/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } });
}

// 🛣 Routes
export function getRoutes(token) {
  return API.get("/routes", { headers: { Authorization: `Bearer ${token}` } });
}
export function saveRoute(token, id, payload) {
  return id
    ? API.put(`/routes/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } })
    : API.post("/routes", payload, { headers: { Authorization: `Bearer ${token}` } });
}
export function deleteRoute(token, id) {
  return API.delete(`/routes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
}
