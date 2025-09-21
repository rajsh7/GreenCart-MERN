// src/pages/UploadCSV.jsx
import React, { useState } from "react";
import { uploadCSV } from "../api";

export default function UploadCSV() {
  const token = localStorage.getItem("token");
  const [file, setFile] = useState(null);
  const [type, setType] = useState("drivers");
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadCSV(token, type, formData);
      setMessage(`✅ ${res.message} (${res.count} records)`);
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage(`❌ Upload failed: ${err.message || "Server unreachable"}`);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📂 Upload CSV</h2>

      <div style={{ marginBottom: "10px" }}>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="drivers">Drivers</option>
          <option value="routes">Routes</option>
          <option value="orders">Orders</option>
        </select>
        <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUpload}>⬆️ Upload</button>
      </div>

      {file && <p>Selected file: {file.name}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}
