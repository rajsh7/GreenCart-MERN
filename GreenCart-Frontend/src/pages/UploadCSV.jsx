import React, { useState } from "react";
import { uploadCSV } from "../api";

export default function UploadCSV() {
  const token = localStorage.getItem("token");
  const [file, setFile] = useState(null);
  const [type, setType] = useState("drivers");
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");
    try {
      const res = await uploadCSV(token, type, file);
      setMessage(`✅ ${res.data.message} (${res.data.count} records)`);
      setFile(null);
    } catch (err) {
      if (err.response) setMessage(`❌ Upload failed: ${err.response.data.error}`);
      else setMessage("❌ Upload failed: Server unreachable");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📂 Upload CSV</h2>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="drivers">Drivers</option>
        <option value="routes">Routes</option>
        <option value="orders">Orders</option>
      </select>
      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>⬆️ Upload</button>
      {file && <p>Selected: {file.name}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}
