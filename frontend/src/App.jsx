import React from 'react'
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOtp from './pages/VerifyOtp'
import Dashboard from './pages/Dashboard'
import Feed from './pages/Feed'
import MyTasks from './pages/MyTasks'
import AddTask from './pages/AddTask'
import Requests from './pages/Requests'
import MyRequests from './pages/MyRequests'
import Settings from './pages/Settings'
import { getToken, logout } from './services/auth'

function Sidebar(){
  return (
    <div className="sidebar">
      <h2>HireHelper</h2>
      <Link to="/app/feed">Feed</Link>
      <Link to="/app/my-tasks">My Tasks</Link>
      <Link to="/app/requests">Requests</Link>
      <Link to="/app/my-requests">My Requests</Link>
      <Link to="/app/add-task">Add Task</Link>
      <Link to="/app/settings">Settings</Link>
      <a
  href="#"
  onClick={() => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      logout();                     
      window.location.replace("/"); 
    }
  }}
>
  Logout
</a>


    </div>
  )
}

function Protected({children}){
  if(!getToken()) return <Navigate to="/" />
  return <div className="layout"><Sidebar/><div className="content">{children}</div></div>
}

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp/>} />
      <Route path="/app" element={<Protected><Dashboard/></Protected>} />
      <Route path="/app/feed" element={<Protected><Feed/></Protected>} />
      <Route path="/app/my-tasks" element={<Protected><MyTasks/></Protected>} />
      <Route path="/app/add-task" element={<Protected><AddTask/></Protected>} />
      <Route path="/app/requests" element={<Protected><Requests/></Protected>} />
      <Route path="/app/my-requests" element={<Protected><MyRequests/></Protected>} />
      <Route path="/app/settings" element={<Protected><Settings/></Protected>} />
    </Routes>
  )
}
