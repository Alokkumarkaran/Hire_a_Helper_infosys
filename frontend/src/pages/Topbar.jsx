import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import api from "../services/api";
import "./style/Topbar.css";
import { logout } from "../services/auth";
import { useLocation } from "react-router-dom";

function LogoutPopup({ onConfirm, onCancel }) {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3>Confirm Logout</h3>
        <p>Are you sure you want to log out of your account?</p>
        <div className="popup-actions">
          <button className="btn-confirm" onClick={onConfirm}>
            Yes, Logout
          </button>
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Topbar() {
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const API_BASE = "http://localhost:8000";
   const location = useLocation();
 

  // Map route paths to display titles
  const pageTitles = {
    "/app/feed": "Feed",
    "/app/my-tasks": "My Tasks",
    "/app/requests": "Requests",
    "/app/my-requests": "My Requests",
    "/app/add-task": "Add Task",
    "/app/settings": "Settings",
    "/app": "Dashboard", // default for /app
  };

  

  useEffect(() => {
    async function fetchData() {
      try {
        const notifRes = await api.get("/notifications");
        setNotifications(notifRes.data || []);
        const userRes = await api.get("/users/me");
        setUser(userRes.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  // close dropdowns when clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") {
        setNotifOpen(false);
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    alert(`Searching for: ${search}`);
  }

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutPopup(false);
    window.location.replace("/");
  };
  const currentTitle = pageTitles[location.pathname] || "HireHelper";

  return (
    <header className="th-topbar">
      <div className="th-left">
        <div className="th-brand">{currentTitle}</div>

        <form className="th-search" onSubmit={handleSearch}>
          <input
            className="th-search-input"
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search tasks"
          />
          <button className="th-search-btn" type="submit" aria-label="Search">
            <FaSearch />
          </button>
        </form>
      </div>

      <div className="th-right">
        {/* Notifications */}
        <div className="th-notif-wrapper" ref={notifRef}>
          <button
            className="th-icon-btn"
            onClick={() => {
              setNotifOpen((s) => !s);
              setProfileOpen(false);
            }}
          >
            <FaBell />
            {notifications.length > 0 && <span className="th-badge">{notifications.length}</span>}
          </button>

          {notifOpen && (
            <div className="th-dropdown th-notif-dropdown">
              <div className="th-dropdown-title">Notifications</div>
              {notifications.length === 0 ? (
                <div className="th-empty">No new notifications</div>
              ) : (
                <ul className="th-notif-list">
                  {notifications.map((n) => (
                    <li key={n._id} className="th-notif-item">{n.body}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Profile */}
<div className="th-profile-wrapper" ref={profileRef}>
  <button
    className="th-profile-btn"
    onClick={() => {
      setProfileOpen((s) => !s);
      setNotifOpen(false);
    }}
  >
    {user?.profilePicture ? (
      <img
        src={`${API_BASE}${user.profilePicture}`}
        alt="profile"
        className="th-avatar"
      />
    ) : user?.firstName ? (
      <div className="th-avatar-placeholder">
        {user.firstName.charAt(0).toUpperCase()}
      </div>
    ) : (
      <img
        src="https://via.placeholder.com/40"
        alt="profile"
        className="th-avatar"
      />
    )}
    <div className="th-name-block">
      <div className="th-name">{user ? `${user.firstName} ${user.lastName}` : "Guest"}</div>
      <div className="th-email">{user?.email}</div>
    </div>
  </button>

  {profileOpen && (
    <div className="th-dropdown th-profile-dropdown">
      {user?.profilePicture ? (
        <img
          className="th-avatar-lg"
          src={`${API_BASE}${user.profilePicture}`}
          alt="profile large"
        />
      ) : user?.firstName ? (
        <div className="th-avatar-placeholder-lg">
          {user.firstName.charAt(0).toUpperCase()}
        </div>
      ) : (
        <img
          className="th-avatar-lg"
          src="https://via.placeholder.com/80"
          alt="profile large"
        />
      )}
      <div className="th-profile-info">
        <strong>{user ? `${user.firstName} ${user.lastName}` : "Guest User"}</strong>
        <div className="th-profile-email">{user?.email}</div>
      </div>
      <hr className="th-sep" />
      <a className="th-dd-link" href="/app/settings">Settings</a>
      <button
        className="th-dd-link th-logout"
        onClick={() => setShowLogoutPopup(true)}
      >
        Logout
      </button>
    </div>
  )}
</div>

      </div>

      {/* Logout Popup */}
      {showLogoutPopup && (
        <LogoutPopup
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutPopup(false)}
        />
      )}
    </header>
  );
}
