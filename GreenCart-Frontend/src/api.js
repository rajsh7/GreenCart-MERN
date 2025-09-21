// src/api.js
import axios from "axios";

// Default to Render backend in production, localhost in dev
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV
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
  return API.get("/drivers", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function createDriver(token, payload) {
  return API.post("/drivers", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function updateDriver(token, id, payload) {
  return API.put(`/drivers/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function deleteDriver(token, id) {
  return API.delete(`/drivers/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
