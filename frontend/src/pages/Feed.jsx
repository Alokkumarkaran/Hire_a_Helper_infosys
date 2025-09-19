import React, { useEffect, useState } from "react";
import api from "../services/api";
import Topbar from "./Topbar";
import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";
import "./style/Feed.css";

export default function Feed() {
  const [tasks, setTasks] = useState([]);
  const [msg, setMsg] = useState(""); 
  

  useEffect(() => {
  (async () => {
    try {
      const { data } = await api.get("/tasks/feed", {
        headers: { "Cache-Control": "no-cache" },
      });
      setTasks(data);
    } catch (err) {
      console.error("Error loading feed", err);
    }
  })();
}, []);


  async function requestTask(id) {
    try {
      await api.post("/requests/" + id);
      setMsg("Request Sent.");
    } catch (err) {
      setMsg(err.response?.data?.error || "Error requesting task");
    }
  }

  return (
    <div>
      <Topbar />
      <div className="feed-container">
        <h2 className="page-title">Feed</h2>
        {msg && <div className="status-msg">{msg}</div>}

        <div className="feed-list">
          {tasks.map((t) => (
            <div key={t._id} className="feed-card">
              {/* Image */}
              <div className="feed-image">
                {t.picture ? (
                  <img
                    src={`http://localhost:8000/uploads/${t.picture}`}
                    alt={t.title}
                  />
                ) : (
                  <span className="no-image">No Image</span>
                )}
              </div>

              {/* Content */}
              <div className="feed-content">
                <div className="feed-header">
                  <span className="tag">{t.category || "general"}</span>
                  <span className="date">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="feed-title">{t.title}</h3>
                <p className="feed-desc">
                  {t.description?.slice(0, 80) || "No description"}...
                </p>

                <div className="feed-meta">
                  <span>
                    <FaMapMarkerAlt className="icon" /> {t.location || "—"}
                  </span>
                  <span>
                    <FaRegCalendarAlt className="icon" />{" "}
                    {new Date(t.startTime).toLocaleString()}
                  </span>
                </div>

                <div className="feed-footer">
  <div className="owner">
    <div className="avatar">
      {t.userId?.profilePicture ? (
        <img
          src={`http://localhost:8000${t.userId.profilePicture}`}
          alt={`${t.userId.firstName}'s avatar`}
          className="avatar-img"
        />
      ) : (
        <span>{t.userId?.firstName?.[0]?.toUpperCase() || "U"}</span>
      )}
    </div>
    <span>
      {t.userId
        ? `${t.userId.firstName || ""} ${t.userId.lastName || ""}`.trim()
        : "Unknown"}
    </span>
  </div>
  <button
    className="btn-request"
    onClick={() => requestTask(t._id)}
  >
    Request
  </button>
</div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
