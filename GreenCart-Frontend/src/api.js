// src/api.js
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://greencart-mern.onrender.com/api");

const API = axios.create({ baseURL: API_BASE });

// Orders
export const getOrders = (token) =>
  API.get("/orders", { headers: { Authorization: `Bearer ${token}` } });

export const createOrder = (token, data) =>
  API.post("/orders", data, { headers: { Authorization: `Bearer ${token}` } });

export const updateOrder = (token, id, data) =>
  API.put(`/orders/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });

export const deleteOrder = (token, id) =>
  API.delete(`/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// Routes
export const getRoutes = (token) =>
  API.get("/routes", { headers: { Authorization: `Bearer ${token}` } });

export const createRoute = (token, data) =>
  API.post("/routes", data, { headers: { Authorization: `Bearer ${token}` } });

export const updateRoute = (token, id, data) =>
  API.put(`/routes/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });

export const deleteRoute = (token, id) =>
  API.delete(`/routes/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// CSV Upload
export const uploadCSV = (token, type, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post(`/load_csv/${type}`, formData, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
  });
};
