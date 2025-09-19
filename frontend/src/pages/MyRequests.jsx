import React, { useEffect, useState } from "react";
import api from "../services/api";
import Topbar from "./Topbar";
import "./style/MyRequests.css";

const API_BASE = "http://localhost:8000";

export default function MyRequests() {
  const [list, setList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/requests/mine");
        setList(data);
      } catch (err) {
        console.error("Error loading requests", err);
      }
    })();
  }, []);

  return (
    <div>
      <Topbar />
      <div className="my-requests-container">
        <h2 className="page-title">My Requests</h2>

        {list.length === 0 ? (
          <p className="empty-text">No requests found.</p>
        ) : (
          <div className="requests-list">
            {list.map((r) => {
              const owner = r.taskId?.userId; // Task owner

              return (
                <div key={r._id} className="request-card">
                  <div className="request-header">
                    {/* Avatar */}
                    <div className="avatar">
                      {owner?.profilePicture ? (
                        <img
                          src={`${API_BASE}/uploads/${owner.profilePicture}`}
                          alt={`${owner.firstName}'s avatar`}
                          className="avatar-img"
                        />
                      ) : (
                        <span>{owner?.firstName?.[0]?.toUpperCase() || "U"}</span>
                      )}
                    </div>

                    {/* Owner info */}
                    <div className="owner-info">
                      <h3 className="task-title">
                        {r.taskId?.title || "Untitled Task"}{" "}
                        <span className="tag">{r.taskId?.category || "general"}</span>
                      </h3>
                      <p className="task-owner">
                        Owner: {owner ? `${owner.firstName} ${owner.lastName}` : "Unknown"}
                      </p>
                      <p className="task-owner-email">{owner?.email || "—"}</p>
                    </div>

                    <span className={`status-badge ${r.status}`}>{r.status}</span>
                  </div>

                  {/* User message */}
                  {r.message && (
                    <div className="message-box">
                      <b>Your message:</b> {r.message}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="request-footer">
                    <span>📅 {r.taskId?.date || "—"}</span>
                    <span>📍 {r.taskId?.location || "—"}</span>
                  </div>

                  {/* Task image */}
                  {r.taskId?.image && (
                    <div className="request-image">
                      <img src={r.taskId.image} alt="task" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
