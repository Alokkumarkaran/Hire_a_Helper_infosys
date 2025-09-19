import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Topbar from "./Topbar";
import "./style/Requests.css";

const API_BASE = "http://localhost:8000";

export default function Requests() {
  const [list, setList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/requests/received', {
          headers: { "Cache-Control": "no-cache" },
        });
        setList(data);
      } catch (err) {
        console.error("Error fetching requests", err);
      }
    })();
  }, []);

  async function act(id, status) {
    try {
      await api.put('/requests/' + id, { status });
      setList(list.map(x => x._id === id ? { ...x, status } : x));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <Topbar />
      <div className="topbar"><h2>Requests (for my tasks)</h2></div>

      {list.length === 0 && <p className="no-requests">No requests received yet.</p>}

      <div className="requests-container">
        {list.map(r => (
          <div key={r._id} className="card request-card">
            <div className="requester-info">
              <div className="avatar">
                {r.requesterId?.profilePicture ? (
                  <img
                    src={`${API_BASE}${r.requesterId.profilePicture}`}
                    alt={`${r.requesterId.firstName}'s avatar`}
                    className="avatar-img"
                  />
                ) : (
                  <span>{r.requesterId?.firstName?.[0]?.toUpperCase() || "U"}</span>
                )}
              </div>

              <div className="requester-details">
                <p><b>Name:</b> {r.requesterId ? `${r.requesterId.firstName} ${r.requesterId.lastName}` : "Unknown"}</p>
                <p><b>Email:</b> {r.requesterId?.email || "—"}</p>
                <p><b>Task:</b> {r.taskId?.title || "—"}</p>
                <p><b>Status:</b> <span className={`status ${r.status}`}>{r.status}</span></p>
              </div>
            </div>

            <div className="request-actions">
              <button className="btn accept" onClick={() => act(r._id, 'accepted')}>Accept</button>
              <button className="btn reject" onClick={() => act(r._id, 'rejected')}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
