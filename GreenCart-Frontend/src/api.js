// src/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const API = axios.create({ baseURL: `${API_BASE}/api` });

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

// 📂 CSV Loader (if still needed)
export function loadCSVs(token, basePath) {
  return API.post(
    "/load_csvs",
    { base_path: basePath },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export function getReport(token) {
  return axios.get(`${API_BASE}/api/report`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob" // ensures PDF download
  });
}