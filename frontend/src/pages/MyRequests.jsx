import React, { useEffect, useState } from "react";
import api from "../services/api";
import Topbar from "./Topbar";
import "./style/MyRequests.css";

const API_BASE = "http://localhost:8000";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/requests/mine");
        setRequests(data || []);
      } catch (err) {
        console.error("Error loading requests", err);
      }
    })();
  }, []);

  function buildImageUrl(picture) {
    if (!picture) return null;
    if (picture.startsWith("http://") || picture.startsWith("https://"))
      return picture;
    return `${API_BASE}/uploads/${picture}`;
  }

  return (
    <div>
      <Topbar />

      <div className="task-list">
        {requests.length === 0 ? (
          <p className="empty-text">No requests found.</p>
        ) : (
          requests.map((r) => {
            const task = r.taskId || {};
            const taskImage = buildImageUrl(task.picture);

            return (
              <div key={r._id} className="task-card">
                {/* Image */}
                <div className="task-image">
                  {taskImage ? (
                    <img src={taskImage} alt={task.title} />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>

                {/* Content */}
                <div className="task-content">
                  {/* Tags */}
                  <div className="task-tags">
                    <span className={`tag status ${r.status?.toLowerCase()}`}>
                      {r.status || "pending"}
                    </span>
                  </div>

                  {/* Title */}
                  <h3>Task Name: {task.title || "Untitled"}</h3>

                  {/* Description */}
                  <p className="desc">{task.description || "No description"}</p>

                  {/* Footer */}
                  <div className="task-footer">
                    <p>📍 {task.location || "No location"}</p>
                    <p>
                      📅{" "}
                      {task.startTime
                        ? new Date(task.startTime).toLocaleDateString()
                        : "No Date"}{" "}
                      – 🕒{" "}
                      {task.startTime
                        ? new Date(task.startTime).toLocaleTimeString()
                        : "—"}
                      {task.endTime
                        ? ` - ${new Date(task.endTime).toLocaleTimeString()}`
                        : ""}
                    </p>
                  </div>

                  {/* User’s message */}
                  {r.message && (
                    <div className="user-message">
                      <strong>Your message:</strong> {r.message}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
