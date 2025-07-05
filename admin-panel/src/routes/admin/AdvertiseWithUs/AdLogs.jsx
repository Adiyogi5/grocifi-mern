import React, { useState, useEffect, useCallback } from "react";
import AxiosHelper from "../../../helper/AxiosHelper";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const AdLogs = () => {
  const [logs, setLogs] = useState({ count: 0, record: [], totalPages: 0, pagination: [] });
  const [param, setParam] = useState({
    limit: 10,
    pageNo: 1,
    action: "all",
    ad_id: "",
  });

  const fetchLogs = useCallback(async () => {
    const { data } = await AxiosHelper.getData("advertise/logs", param);
    if (data?.status) {
      setLogs(data.data);
    } else if (data?.message) {
      toast.error(data.message);
    }
  }, [param]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handlePageChange = (pageNo) => {
    setParam((prev) => ({ ...prev, pageNo }));
  };

  // Fix typo: handelPageChange -> handlePageChange
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card mb-4">
          <div className="card-header">
            <div className="row">
              <div className="col-auto">
                <h5>Ad Activity</h5>
              </div>
              {/* <div className="col-auto">
                <Link to="/dashboard" className="btn btn-sm btn-falcon-default me-2">
                  <i className="bi bi-house"></i> Dashboard
                </Link>
              </div> */}
            </div>
          </div>
          <div className="card-body pt-0">
            <div className="row justify-content-between mb-3">
              <div className="col-md-6 d-flex">
                <span className="pe-2">Show</span>
                <select
                  className="w-auto form-select form-select-sm"
                  value={param.limit}
                  onChange={(e) => setParam({ ...param, limit: parseInt(e.target.value) })}
                >
                  {[10, 25, 50].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <span className="ps-2">entries</span>
                <select
                  className="ms-3 form-select"
                  value={param.action}
                  onChange={(e) => setParam({ ...param, action: e.target.value })}
                >
                  <option value="all">All Actions</option>
                  <option value="created">Created</option>
                  <option value="impression">Impression</option>
                  <option value="click">Click</option>
                  <option value="payment_attempt">Payment Attempt</option>
                  <option value="payment_success">Payment Success</option>
                </select>
              </div>
              {/* <div className="col-md-4">
                <input
                  type="text"
                  placeholder="Search by Ad ID..."
                  className="form-control form-control-sm"
                  value={param.ad_id}
                  onChange={(e) => setParam({ ...param, ad_id: e.target.value, pageNo: 1 })}
                />
              </div> */}
            </div>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Ad Type</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.record.map((log) => (
                  <tr key={log._id}>
                    <td>{log.advertiseWithUs_Ad_id?.type}</td>
                    <td>{log.user_id ? log.user_id.name || "Anonymous" : "-"}</td>
                    <td>{log.action}</td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
                {logs.record.length === 0 && (
                  <tr>
                    <td colSpan="100" className="text-center">
                      No logs available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="row align-items-center mt-3">
              <div className="col">
                <p className="mb-0 fs--1">
                  <span className="d-none d-sm-inline-block" data-list-info="data-list-info">
                    {(param.pageNo - 1) * param.limit + 1} to {param.pageNo * param.limit > logs?.count ? logs?.count : param.pageNo * param.limit} of {logs?.count}
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
                    {logs?.pagination.map((row) => (
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
                    disabled={param.pageNo === logs?.totalPages}
                    className="btn btn-falcon-default btn-sm"
                    onClick={() => handlePageChange(logs?.totalPages)}
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

export default AdLogs;