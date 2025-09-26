import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import api from "../services/api";
import "./style/Topbar.css";

export default function Topbar() {
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const API_BASE = "http://localhost:8000";


  useEffect(() => {
    async function fetchData() {
      try {
        const notifRes = await api.get("/notifications");
        setNotifications(notifRes.data || []);
        const userRes = await api.get("/users/me");
        setUser(userRes.data);
      } catch (err) {
        // silent fail if no auth during dev
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
    // Replace this with real search handling
    alert(`Searching for: ${search}`);
  }

  return (
    <header className="th-topbar">
      <div className="th-left">
        <div className="th-brand">HireHelper</div>

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
            aria-haspopup="true"
            aria-expanded={notifOpen}
          >
            <FaBell />
            {notifications.length > 0 && (
              <span className="th-badge">{notifications.length}</span>
            )}
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
    aria-haspopup="true"
    aria-expanded={profileOpen}
  >
    <img
      src={
        user?.profilePicture
          ? `${API_BASE}${user.profilePicture}`
          : "https://via.placeholder.com/40"
      }
      alt="profile"
      className="th-avatar"
    />
    <div className="th-name-block">
      <div className="th-name">
        {user ? `${user.firstName} ${user.lastName}` : "Guest"}
      </div>
      <div className="th-email">{user?.email}</div>
    </div>
  </button>

  {profileOpen && (
    <div className="th-dropdown th-profile-dropdown">
      <img
        className="th-avatar-lg"
        src={
          user?.profilePicture
            ? `${API_BASE}${user.profilePicture}`
            : "https://via.placeholder.com/80"
        }
        alt="profile large"
      />
      <div className="th-profile-info">
        <strong>
          {user ? `${user.firstName} ${user.lastName}` : "Guest User"}
        </strong>
        <div className="th-profile-email">{user?.email}</div>
      </div>
      <hr className="th-sep" />
      <a className="th-dd-link" href="/app/settings">Settings</a>
      <button
  className="th-dd-link th-logout"
  onClick={() => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.clear();
      window.location.replace("/"); // use replace so back button won’t reload old page
    }
  }}
>
  Logout
</button>

    </div>
  )}
</div>
        
      </div>
    </header>
  );
}
