import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./style/Forpass.css"; // shared styles with Register & Login

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setMsg("OTP sent to your email.");
      setTimeout(() => nav(`/reset-password?userId=${data.userId}`), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Error sending OTP");
    }
  }

  return (
    <div className="auth-container">
      {/* Left Illustration */}
      <div className="auth-left">
        <img src="/src/pages/Hire_Helper.png" alt="Forgot Password" />
      </div>

      {/* Right Form */}
      <div className="auth-right">
        <div className="form-card">
          <div className="logo">
            <img src="/logo.png" alt="logo" />
            <h1>Hire-a-Helper</h1>
          </div>

          <h2>Forgot Password?</h2>
          <p>Enter your email to receive an OTP</p>

          {msg && <div className="success">{msg}</div>}
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="signin-link">
              I remembered my password? <a href="/">Sign in</a>
            </p>

            <button type="submit" className="btn-primary">
              Send OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
