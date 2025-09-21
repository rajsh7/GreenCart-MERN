// src/api.js
import axios from "axios";

// Set base URL depending on environment
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://greencart-mern.onrender.com/api");

// Helper function to create headers with token
const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

// 🔑 Auth
export const login = (username, password) => {
  return axios.post(`${API_BASE}/login`, { username, password });
};

// 🚚 Simulation
export const runSim = (token, payload) => {
  return axios.post(`${API_BASE}/simulate`, payload, { headers: authHeader(token) });
};

export const getSimHistory = (token) => {
  return axios.get(`${API_BASE}/simulate/history`, { headers: authHeader(token) });
};

// 📂 CSV Loader
export const uploadCSV = (token, type, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${API_BASE}/load_csv/${type}`, formData, {
    headers: {
      ...authHeader(token),
      "Content-Type": "multipart/form-data",
    },
  });
};

// 📄 PDF Report
export const getReport = (token) => {
  return axios.get(`${API_BASE}/report`, {
    headers: authHeader(token),
    responseType: "blob",
  });
};

// 👨‍✈️ Drivers
export const getDrivers = (token) => {
  return axios.get(`${API_BASE}/drivers`, { headers: authHeader(token) });
};

export const createDriver = (token, payload) => {
  return axios.post(`${API_BASE}/drivers`, payload, { headers: authHeader(token) });
};

export const updateDriver = (token, id, payload) => {
  return axios.put(`${API_BASE}/drivers/${id}`, payload, { headers: authHeader(token) });
};

export const deleteDriver = (token, id) => {
  return axios.delete(`${API_BASE}/drivers/${id}`, { headers: authHeader(token) });
};

// 📦 Orders
export const getOrders = (token) => {
  return axios.get(`${API_BASE}/orders`, { headers: authHeader(token) });
};

export const createOrder = (token, payload) => {
  return axios.post(`${API_BASE}/orders`, payload, { headers: authHeader(token) });
};

export const updateOrder = (token, id, payload) => {
  return axios.put(`${API_BASE}/orders/${id}`, payload, { headers: authHeader(token) });
};

export const deleteOrder = (token, id) => {
  return axios.delete(`${API_BASE}/orders/${id}`, { headers: authHeader(token) });
};

// 🛣 Routes
export const getRoutes = (token) => {
  return axios.get(`${API_BASE}/routes`, { headers: authHeader(token) });
};

export const createRoute = (token, payload) => {
  return axios.post(`${API_BASE}/routes`, payload, { headers: authHeader(token) });
};

export const updateRoute = (token, id, payload) => {
  return axios.put(`${API_BASE}/routes/${id}`, payload, { headers: authHeader(token) });
};

export const deleteRoute = (token, id) => {
  return axios.delete(`${API_BASE}/routes/${id}`, { headers: authHeader(token) });
};
