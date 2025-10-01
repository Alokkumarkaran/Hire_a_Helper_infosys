import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { saveUserId } from "../services/auth";
import "./style/Register.css"; // custom css

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [popup, setPopup] = useState(""); // popup message
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    try {
      const { data } = await api.post("/auth/register", form);
      saveUserId(data.userId);

      // Show popup with email
      setPopup(`OTP sent to ${form.email}`);

      // Redirect to OTP page after short delay
      setTimeout(() => {
        nav("/verify-otp");
      }, 2000);
    } catch (err) {
      setMsg("Error: " + (err.response?.data?.message || "Something went wrong"));
    }
  }

  return (
    <div className="register-container">
      {/* Left side with image */}
      <div className="register-left">
        <img src="./Hire_Helper.png" alt="Welcome banner" />
      </div>

      {/* Right side with form */}
      <div className="register-right">
        <div className="form-card">
          <div className="otp-header">
            <img src="./logo.png" alt="Hire-a-Helper" className="otp-logo" />
          </div>
          <h2>Sign up</h2>
          <p>Enter your details to sign up</p>
          {msg && <div className="msg">{msg}</div>}

          <form onSubmit={submit}>
            <div className="name-fields">
              <input
                placeholder="First name"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                required
              />
              <input
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
                required
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              placeholder="Phone Number (Optional)"
              value={form.phoneNumber}
              onChange={(e) =>
                setForm({ ...form, phoneNumber: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />

            <div className="terms">
              <input type="checkbox" required />
              <label>
                I agree with <a href="#">Terms</a> and{" "}
                <a href="#">Privacy policy</a>.
              </label>
            </div>

            <button type="submit" className="btn-primary">
              Sign up
            </button>

            <p className="signin-link">
              Already have an account? <a href="/">Sign in</a>
            </p>
          </form>
        </div>
      </div>

      {/* OTP Popup */}
      {popup && (
        <div className="popup-overlay">
          <div className="popup">
            <p>{popup}</p>
            <button onClick={() => setPopup("")}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
