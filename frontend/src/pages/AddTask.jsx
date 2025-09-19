import React, { useState } from 'react'
import api from '../services/api'
import Topbar from "./Topbar";

export default function AddTask() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    startTime: '',
    endTime: ''
  });
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState('');

  async function submit(e) {
    e.preventDefault();

    let startTimeISO, endTimeISO;
    if (form.startTime) {
      const start = new Date(form.startTime);
      if (isNaN(start.getTime())) {
        setMsg("Invalid start time format");
        return;
      }
      startTimeISO = start.toISOString();
    }
    if (form.endTime) {
      const end = new Date(form.endTime);
      if (isNaN(end.getTime())) {
        setMsg("Invalid end time format");
        return;
      }
      endTimeISO = end.toISOString();
    }

    try {
      // Use FormData instead of plain object
      const payload = new FormData();
      payload.append('title', form.title);
      payload.append('description', form.description);
      payload.append('location', form.location);
      if (startTimeISO) payload.append('startTime', startTimeISO);
      if (endTimeISO) payload.append('endTime', endTimeISO);
      if (image) payload.append('picture', image);

      const { data } = await api.post('/tasks', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMsg('Task created: ' + data.title);
      setForm({ title: '', description: '', location: '', startTime: '', endTime: '' });
      setImage(null);
    } catch (err) {
      setMsg(err.response?.data?.error || "Error creating task");
    }
  }

  return (
    <div>
      <Topbar />
      <div className="topbar"><h2>Add Task</h2></div>
      {msg && <div className="card">{msg}</div>}
      <div className="card">
        <form onSubmit={submit}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            rows={4}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          ></textarea>
          <input
            placeholder="Location"
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
          />
          <input
            placeholder="Start time"
            type="datetime-local"
            value={form.startTime}
            onChange={e => setForm({ ...form, startTime: e.target.value })}
          />
          <input
            placeholder="End time (optional)"
            type="datetime-local"
            value={form.endTime}
            onChange={e => setForm({ ...form, endTime: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
          />
          <button className="btn" type="submit">Create</button>
        </form>
      </div>
    </div>
  )
}
