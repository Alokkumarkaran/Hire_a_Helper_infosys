import React, { useEffect, useState, useRef } from "react";
import api from "../services/api";
import Topbar from "./Topbar";
import "./style/Settings.css";

const API_BASE = "http://localhost:8000";

export default function Settings() {
  const [u, setU] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/users/me");
        setU(data);
      } catch (e) {
        console.error("Error loading user", e);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  if (!u) return null;

  // Save profile info
  async function save(e) {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      const { data } = await api.put("/users/me", u);
      setU(data);
      setMsg("Changes saved successfully.");
    } catch (error) {
      setErr(error.response?.data?.error || "Error saving changes");
    }
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setErr("Only JPG/PNG images allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErr("Image must be 5MB or smaller.");
      return;
    }
    setSelectedFile(file);
  }

  async function uploadPhoto() {
    if (!selectedFile) {
      setErr("Choose a photo first.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", selectedFile);
      const { data } = await api.post("/users/me/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setU(data);
      setMsg("Profile photo updated.");
      setSelectedFile(null);
    } catch (error) {
      setErr(error.response?.data?.error || "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function removePhoto() {
    if (!window.confirm("Remove profile photo?")) return;
    try {
      const { data } = await api.delete("/users/me/photo");
      setU(data);
      setMsg("Profile photo removed.");
    } catch (error) {
      setErr(error.response?.data?.error || "Failed to remove photo.");
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPwMsg("Fill both current and new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg("Passwords do not match.");
      return;
    }
    setPwLoading(true);
    try {
      await api.put("/users/me/password", { currentPassword, newPassword });
      setPwMsg("Password changed successfully.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (error) {
      setPwMsg(error.response?.data?.error || "Failed to change password.");
    } finally {
      setPwLoading(false);
    }
  }

  return (
    <div>
      <Topbar />
      <h2>Settings</h2>

      <div className="settings-container">
        {msg && <div className="alert success">{msg}</div>}
        {err && <div className="alert error">{err}</div>}

        {/* Profile Section */}
        <div className="profile-section">
          <div className="profile-left">
            <img
              src={
                previewUrl ||
                (u.profilePicture ? `${API_BASE}${u.profilePicture}` : "https://via.placeholder.com/100?text=User")
              }
              alt="Profile"
              className="profile-img"
            />
          </div>

          <div className="profile-actions">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              style={{ display: "none" }}
              onChange={onFileChange}
            />
            <button onClick={openFilePicker} disabled={uploading}>Change Photo</button>
            <button onClick={removePhoto} disabled={uploading}>Remove</button>

            {selectedFile && (
              <div>
                <span>{selectedFile.name}</span>
                <button onClick={uploadPhoto} disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload"}
                </button>
                <button onClick={() => setSelectedFile(null)}>Cancel</button>
              </div>
            )}
          </div>
        </div>

        {/* Personal Info */}
        <form onSubmit={save}>
          <h3>Personal Info</h3>
          <input
            value={u.firstName || ""}
            onChange={(e) => setU({ ...u, firstName: e.target.value })}
            placeholder="First Name"
          />
          <input
            value={u.lastName || ""}
            onChange={(e) => setU({ ...u, lastName: e.target.value })}
            placeholder="Last Name"
          />
          <input
            value={u.email || ""}
            onChange={(e) => setU({ ...u, email: e.target.value })}
            placeholder="Email"
          />
          <input
            value={u.phoneNumber || ""}
            onChange={(e) => setU({ ...u, phoneNumber: e.target.value })}
            placeholder="Phone Number"
          />
          <textarea
            value={u.bio || ""}
            onChange={(e) => setU({ ...u, bio: e.target.value })}
            placeholder="Bio"
          />
          <button type="submit">Save Changes</button>
        </form>

        {/* Password */}
        <form onSubmit={changePassword}>
          <h3>Change Password</h3>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" disabled={pwLoading}>
            {pwLoading ? "Saving..." : "Change Password"}
          </button>
          {pwMsg && <div>{pwMsg}</div>}
        </form>
      </div>
    </div>
  );
}
