import React, { useState } from "react";
import api from "../services/api";
import Topbar from "./Topbar";
import "./style/AddTask.css"; // new CSS

export default function AddTask() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    startTime: "",
    endTime: "",
  });
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();

    let startTimeISO, endTimeISO;
    if (form.startTime) {
      const start = new Date(form.startTime);
      if (isNaN(start.getTime())) {
        setMsg("⚠️ Invalid start time format");
        return;
      }
      startTimeISO = start.toISOString();
    }
    if (form.endTime) {
      const end = new Date(form.endTime);
      if (isNaN(end.getTime())) {
        setMsg("⚠️ Invalid end time format");
        return;
      }
      endTimeISO = end.toISOString();
    }

    try {
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description);
      payload.append("location", form.location);
      if (startTimeISO) payload.append("startTime", startTimeISO);
      if (endTimeISO) payload.append("endTime", endTimeISO);
      if (image) payload.append("picture", image);

      const { data } = await api.post("/tasks", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg("✅ Task created: " + data.title);
      setForm({ title: "", description: "", location: "", startTime: "", endTime: "" });
      setImage(null);
    } catch (err) {
      setMsg(err.response?.data?.error || "❌ Error creating task");
    }
  }

  return (
    <div>
      <Topbar />
      <div className="addtask-page">
        <div className="addtask-header">
          {msg && <div className="form-msg">{msg}</div>}
        </div>

        <div className="addtask-card">
          <form onSubmit={submit} className="task-form">
            <label>
              Task Title
              <input
                type="text"
                placeholder="Enter task title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </label>

            <label>
              Description
              <textarea
                placeholder="Describe the task"
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              ></textarea>
            </label>

            <label>
              Location
              <input
                type="text"
                placeholder="Where is this task?"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </label>

            <div className="form-row">
              <label>
                Start Time
                <input
                  type="datetime-local"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  required
                />
              </label>

              <label>
                End Time (optional)
                <input
                  type="datetime-local"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                />
              </label>
            </div>

            <label className="file-upload">
              Upload Task Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>

            <button className="btn-submit" type="submit">
              🚀 Create Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
