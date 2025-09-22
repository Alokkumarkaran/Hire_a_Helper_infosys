import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import "./style/Forpass.css"; // reuse same CSS

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ResetPassword() {
  const query = useQuery();
  const userId = query.get("userId");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      await api.post("/auth/reset-password", { userId, otp, newPassword });
      setMsg("Password updated! Redirecting to login...");
      setTimeout(() => nav("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Error resetting password");
    }
  }

  return (
    <div className="auth-container">
      {/* Left Illustration */}
      <div className="auth-left">
        <img src="./Hire_Helper.png" alt="Reset Password" />
      </div>

      {/* Right Form */}
      <div className="auth-right">
        <div className="form-card">
          <div className="otp-header">
          <img src="./logo.png" alt="Hire-a-Helper" className="otp-logo" />
          </div>

          <h2>Reset Password</h2>
          <p>Enter the OTP sent to your email and choose a new password</p>

          {msg && <div className="success">{msg}</div>}
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <button type="submit" className="btn-primary">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
