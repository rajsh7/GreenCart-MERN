import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Drivers from "./pages/Drivers";
import Orders from "./pages/Orders";
import RoutesPage from "./pages/Routes";
import Simulation from "./pages/Simulation"; // ✅ simulation page
import UploadCSV from "./pages/UploadCSV"; // ✅ import
import "./index.css";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>}>
        <Route index element={<Login/>} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="drivers" element={<Drivers />} />
        <Route path="orders" element={<Orders />} />
        <Route path="routes" element={<RoutesPage />} />
        <Route path="upload" element={<UploadCSV />} /> 
      </Route>
    </Routes>
  </BrowserRouter>
);
