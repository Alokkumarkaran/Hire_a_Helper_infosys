import React, { useEffect, useState } from "react";
import api from "../services/api";
import Topbar from "./Topbar";
import "./style/MyTasks.css"; // Import CSS file

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/tasks/mine");
        setTasks(data);
      } catch (err) {
        console.error("Error loading tasks", err);
      }
    })();
  }, []);

  return (
    <div>
      <Topbar />
      <div className="topbar">
        <h2>My Tasks</h2>
      </div>
      <div className="task-list">
        {tasks.map((t) => (
          <div key={t._id} className="task-card">
            {/* Image */}
            <div className="task-image">
              {t.picture ? (
                <img
                  src={`http://localhost:8000/uploads/${t.picture}`}
                  alt={t.title}
                />
              ) : (
                <span>No Image</span>
              )}
            </div>

            {/* Content */}
            <div className="task-content">
              {/* Tags (category + status) */}
              <div className="task-tags">
                <span className="tag category">tech</span>
                <span className={`tag status ${t.status.toLowerCase()}`}>
                  {t.status}
                </span>
              </div>

              <h3>{t.title}</h3>
              <p className="desc">{t.description}</p>

              {/* Footer */}
              <div className="task-footer">
                <p>📍 {t.location || "Your Location"}</p>
                <p>📅 {t.date || "Jul 6, 2024"} – 🕒 {t.time || "3:00 PM - 6:00 PM"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
