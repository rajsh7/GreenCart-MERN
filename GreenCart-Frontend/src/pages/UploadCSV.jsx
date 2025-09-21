// src/pages/UploadCSV.jsx
import React, { useState } from "react";
import axios from "axios";

export default function UploadCSV() {
  const token = localStorage.getItem("token");
  const [file, setFile] = useState(null);
  const [type, setType] = useState("drivers");
  const [message, setMessage] = useState("");

  // Use your deployed backend
  const API_BASE = "https://greencart-mern.onrender.com/api";

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_BASE}/load_csv/${type}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(`✅ ${res.data.message} (${res.data.count} records)`);
      setFile(null); // reset file after upload
    } catch (err) {
      if (err.response) {
        setMessage(`❌ Upload failed: ${err.response.data.error}`);
      } else {
        setMessage(`❌ Upload failed: Server unreachable`);
      }
    }
  };

  return (
    <div className="page-container">
      <h2>📂 Upload CSV</h2>

      <div className="form-row">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="drivers">Drivers</option>
          <option value="routes">Routes</option>
          <option value="orders">Orders</option>
        </select>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={handleUpload}>⬆️ Upload</button>
      </div>

      {file && <p>Selected: {file.name}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}
