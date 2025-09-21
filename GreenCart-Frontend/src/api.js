// src/api.js
import axios from "axios";

// Base URL: Vite env variable > localhost (dev) > Render (prod)
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV
    ? "http://localhost:5000/api"
    : "https://greencart-mern.onrender.com/api");

const API = axios.create({ baseURL: API_BASE });

console.log("🔗 API Base URL:", API_BASE);

// ========== AUTH ==========
export const login = (username, password) =>
  API.post("/login", { username, password });

// ========== ORDERS ==========
export const getOrders = () => API.get("/orders");
export const createOrder = (payload) => API.post("/orders", payload);

// ========== ROUTES ==========
export const getRoutes = () => API.get("/routes");
export const createRoute = (payload) => API.post("/routes", payload);

// ========== SIMULATION ==========
export const runSim = (token, payload) =>
  API.post("/simulate", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getSimHistory = (token) =>
  API.get("/simulate/history", {
    headers: { Authorization: `Bearer ${token}` },
  });

// ========== CSV ==========
export const loadCSVs = (token, formData, type) =>
  API.post(`/load_csv/${type}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

// ========== REPORT ==========
export const getReport = (token) =>
  API.get("/report", {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob",
  });

// ========== DRIVERS ==========
export const getDrivers = (token) =>
  API.get("/drivers", { headers: { Authorization: `Bearer ${token}` } });

export const createDriver = (token, payload) =>
  API.post("/drivers", payload, { headers: { Authorization: `Bearer ${token}` } });

export const updateDriver = (token, id, payload) =>
  API.put(`/drivers/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });

export const deleteDriver = (token, id) =>
  API.delete(`/drivers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
