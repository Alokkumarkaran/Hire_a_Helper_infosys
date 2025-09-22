import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { saveToken, saveUserId } from "../services/auth";
import "./style/Login.css"; // custom css

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      saveToken(data.token);
      nav("/app/feed");
    } catch (err) {
      const d = err.response?.data;
      if (d?.error === "OTP required") {
        saveUserId(d.userId);
        nav("/verify-otp");
      } else {
        setError(d?.error || "Login failed");
      }
    }
  }

  return (
    <div className="login-container">
      {/* Left illustration */}
      <div className="login-left">
        <img src="./Hire_Helper.png" alt="Welcome back" />
      </div>

      {/* Right form */}
      <div className="login-right">
        <div className="form-card">
           <div className="otp-header">
          <img src="./logo.png" alt="Hire-a-Helper" className="otp-logo" />
          </div>
          <h2>Sign in</h2>
          <p>Enter your credentials to access your account</p>

          {error && <div className="error">{error}</div>}

          <form onSubmit={submit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn-primary">
              Login
            </button>

          

            <p className="signup-link">
              New here? <Link to="/register">Create account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
