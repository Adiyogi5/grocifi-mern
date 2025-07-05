import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card mb-4">
          <div className="card-header">
            <h5>Admin Dashboard</h5>
          </div>
          <div className="card-body">
            <h6>Welcome to the Advertisement Management System</h6>
            <div className="row">
              <div className="col-md-3">
                <Link to="/admin/ads" className="btn btn-primary btn-block mb-2">
                  Manage Ads
                </Link> 
              </div>
              <div className="col-md-3">
                <Link to="/admin/pages" className="btn btn-primary btn-block mb-2">
                  Manage Pages
                </Link>
              </div>
              <div className="col-md-3">
                <Link to="/admin/sections" className="btn btn-primary btn-block mb-2">
                  Manage Sections
                </Link>
              </div>
              <div className="col-md-3">
                <Link to="/admin/logs" className="btn btn-primary btn-block mb-2">
                  View Logs
                </Link>
              </div>
              <div className="col-md-3">
                <Link to="/admin/stats" className="btn btn-primary btn-block mb-2">
                  View Statistics
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;