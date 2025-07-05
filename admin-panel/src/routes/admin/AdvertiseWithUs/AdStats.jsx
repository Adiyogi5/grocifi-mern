import React, { useState, useEffect, useCallback } from "react";
import AxiosHelper from "../../../helper/AxiosHelper";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const AdStats = () => {
  const [stats, setStats] = useState([]);
  const [param, setParam] = useState({
    ad_id: "",
    time_range: "all",
    group_by: "day",
  });

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await AxiosHelper.getData("advertise/stats", param);
      if (data?.status) {
        setStats(data.data);
      } else {
        toast.error(data?.message || "Failed to fetch stats.");
      }
    } catch (error) {
      toast.error("Error fetching stats.");
    }
  }, [param]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setParam((prev) => ({ ...prev, [name]: value }));
  };

  // Add pagination params to state
  useEffect(() => {
    setParam((prev) => ({
      ...prev,
      pageNo: 1,
      limit: 10,
    }));
  }, []);

  // Handle page change
  const handlePageChange = (pageNo) => {
    setParam((prev) => ({
      ...prev,
      pageNo,
    }));
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card mb-4">
          <div className="card-header">
            <div className="row flex-between-end">
              <div className="col-auto">
                <h5>Advertisement Statistics</h5>
              </div>
              <div className="col-auto">
                <Link to="/admin/dashboard" className="btn btn-sm btn-falcon-default">
                  <i className="bi bi-house"></i> Dashboard
                </Link>
              </div>
            </div>
          </div>
          <div className="card-body pt-0">
            <div className="row justify-content-between mb-3">
              <div className="col-md-6 d-flex gap-3">
                {/* Filters can be enabled here */}
              </div>
            </div>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Pages</th>
                  <th>Sections</th>
                  <th>Impressions</th>
                  <th>Clicks</th>
                  <th>Duration (Days)</th>
                  <th>Price (₹)</th>
                  <th>Categories</th>
                  <th>Tags</th>
                  <th>Locations</th>
                  <th>CreatedAt</th>
                </tr>
              </thead>
              <tbody>
                {stats?.record?.length > 0 ? (
                  stats?.record?.map((stat) => (
                    <tr key={stat.ad_id}>
                      <td>{stat.usersName || "Untitled"}</td>
                      <td>{stat.type}</td>
                      <td>{stat.page_names}</td>
                      <td>{stat.section_names}</td>
                      <td>{stat.total_impressions?.toLocaleString?.() ?? 0}</td>
                      <td>{stat.total_clicks?.toLocaleString?.() ?? 0}</td>
                      <td>{stat.duration}</td>
                      <td>{stat.price?.toLocaleString?.() ?? 0}</td>
                      <td>{stat.categories?.join(", ")}</td>
                      <td>{stat.tags?.join(", ")}</td>
                      <td>{stat.locations?.join("; ")}</td>
                      <td>{new Date(stat.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center">
                      No statistics available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="row align-items-center mt-3">
              <div className="col">
                <p className="mb-0 fs--1">
                  <span className="d-none d-sm-inline-block" data-list-info="data-list-info">
                    {((param.pageNo - 1) * param.limit + 1)} to {Math.min(param.pageNo * param.limit, stats?.count || 0)} of {stats?.count || 0}
                  </span>
                  <span className="d-none d-sm-inline-block"> </span>
                </p>
              </div>
              <div className="col-auto">
                <div className="d-flex justify-content-center align-items-center">
                  <button
                    type="button"
                    disabled={param.pageNo === 1}
                    className="btn btn-falcon-default btn-sm"
                    onClick={() => handlePageChange(1)}
                  >
                    <span className="fas fa-chevron-left" />
                  </button>
                  <ul className="pagination mb-0 mx-1">
                    {(stats?.pagination || []).map((row) => (
                      <li key={row}>
                        <button
                          onClick={() => handlePageChange(row)}
                          type="button"
                          className={`page me-1 btn btn-sm ${row === param.pageNo ? "btn-primary" : "btn-falcon-default"}`}
                        >
                          {row}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    disabled={param.pageNo === stats?.totalPages}
                    className="btn btn-falcon-default btn-sm"
                    onClick={() => handlePageChange(stats?.totalPages)}
                  >
                    <span className="fas fa-chevron-right"> </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdStats