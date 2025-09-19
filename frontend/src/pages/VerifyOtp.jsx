import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getUserId, clearUserId } from "../services/auth";
import "./style/VerifyOtp.css";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(new Array(6).fill(""));  // 6 boxes
  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // auto-focus next box
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/verify-otp", { userId: getUserId(), code: otp.join("") });
      clearUserId();
      nav("/");
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed");
    }
  }

  return (
    <div className="otp-container">
      <div className="otp-card">
        <div className="otp-header">
          <img src="/logo.png" alt="Hire-a-Helper" className="otp-logo" />
          <h2>Hire-a-Helper</h2>
        </div>

        <h3>Enter OTP</h3>
        <p>We have sent an OTP to your Email Id</p>

        {error && <div className="otp-error">{error}</div>}

        <form onSubmit={submit}>
          <div className="otp-inputs">
            {otp.map((data, index) => (
              <input
                className="otp-box"
                type="text"
                maxLength="1"
                key={index}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>

          <button className="otp-btn" type="submit">
            Verify
          </button>
        </form>

        <p className="signin-link">
              Already have an account? <a href="/">Sign in</a>
        </p>
      </div>
    </div>
  );
}
