import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import { FaUser, FaLock } from "react-icons/fa";

export default function Login() {
  const [username, setUsername] = useState("manager");
  const [password, setPassword] = useState("managerpass");
  const [error, setError] = useState("");
  const nav = useNavigate();

  async function doLogin(e) {
    e.preventDefault();
    try {
      const res = await login(username, password);
      const token = res.data?.token;
      if (!token) throw new Error("No token received");
      localStorage.setItem("token", token);
      nav("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>GreenCart Login</h2>
        {error && <div className="error">{error}</div>}

        <form onSubmit={doLogin}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn">LOGIN</button>
          <p className="forgot-text">Forgot Username / Password?</p>
        </form>
      </div>
    </div>
  );
}
