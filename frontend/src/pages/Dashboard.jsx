import React from "react";
import { Link } from "react-router-dom";
import Topbar from "./Topbar"; // Import Topbar

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Include Topbar */}
      <Topbar />

      {/* Dashboard Content */}
      <div className="p-6">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <p>Welcome to HireHelper. Use the sidebar to navigate.</p>
          <p>
            Quick links:{" "}
            <Link to="/app/add-task" className="text-blue-600 hover:underline">
              Add Task
            </Link>{" "}
            ·{" "}
            <Link to="/app/feed" className="text-blue-600 hover:underline">
              Browse Feed
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}