import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getUserId, clearUserId } from "../services/auth";
import "./style/VerifyOtp.css";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(new Array(6).fill("")); // 6 boxes
  const [popup, setPopup] = useState(""); // popup message
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
    try {
      await api.post("/auth/verify-otp", {
        userId: getUserId(),
        code: otp.join(""),
      });

      clearUserId();
      setPopup("✅ OTP verified successfully! You can now log in to your account.");

      // redirect after 2 seconds
      setTimeout(() => {
        nav("/");
      }, 2000);
    } catch (err) {
      setPopup("❌ Incorrect or expired OTP. Please enter the correct code and try again.");
    }
  }

  return (
    <div className="otp-container">
      <div className="otp-card">
        <div className="otp-header">
          <img src="./logo.png" alt="Hire-a-Helper" className="otp-logo" />
        </div>

        <h3>Enter OTP</h3>
        <p>We have sent an OTP to your Email Id</p>

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

      {/* ✅ Popup Modal */}
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
