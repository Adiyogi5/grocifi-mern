import React, { useEffect, useState } from "react";
import AxiosHelper from "../../helper/AxiosHelper";
import { Link } from "react-router-dom";
import { Modal, CloseButton, Button } from "react-bootstrap";
import Action from "../../../src/components/Table/Action";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newReport, setNewReport] = useState({ report: "" });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [param, setParam] = useState({ pageNo: 1, limit: 10, query: "" });

  const fetchReports = async () => {
    try {
      const res = await AxiosHelper.getData("/reports");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async () => {
    const { report } = newReport;
    if (!report) {
      alert("Report field is required.");
      return;
    }

    try {
      if (editMode) {
        await AxiosHelper.putData(`/reports/${editId}`, newReport);
      }
      setShowModal(false);
      setEditMode(false);
      setEditId(null);
      setNewReport({ report: "" });
      fetchReports();
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await AxiosHelper.deleteData(`/reports/${id}`);
      fetchReports();
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  const handleEdit = (report) => {
    setNewReport({ report: report.report });
    setEditId(report._id);
    setEditMode(true);
    setShowModal(true);
  };

  const handlePageChange = (page) => setParam({ ...param, pageNo: page });

  // Search filter
  const filteredReports = reports.filter((r) =>
    r.report.toLowerCase().includes(param.query.toLowerCase())
  );

  const totalCount = filteredReports.length;
  const totalPages = Math.ceil(totalCount / param.limit);
  const paginationList = Array.from({ length: totalPages }, (_, i) => i + 1);

  const paginatedReports = filteredReports.slice(
    (param.pageNo - 1) * param.limit,
    param.pageNo * param.limit
  );

  const dropList = (row) => [
    {
      name: "Edit",
      module_id: "Report",
      action: "edit",
      onClick: () => handleEdit(row),
    },
    {
      name: "Delete",
      module_id: "Report",
      action: "delete",
      onClick: () => handleDelete(row._id),
      className: "text-danger",
    },
  ];

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card mb-3">
          <div className="card-header d-flex justify-content-between">
            <h5 className="mb-0">Manage Reports</h5>
            <div>
              <Link to="/admin/dashboard" className="btn btn-sm btn-falcon-default me-2">
                <i className="fa fa-home me-1"></i>Dashboard
              </Link>
            </div>
          </div>

          <div className="card-body pt-0">
            {/* Search bar */}
            <div className="row justify-content-between mb-4">
              <div className="col-md-6 d-flex">
                <span className='pe-2'>Show</span>
                <select
                  className="w-auto form-select form-select-sm"
                  onChange={(e) => setParam({ ...param, limit: parseInt(e.target.value), pageNo: 1 })}
                >
                  {[10, 20, 50].map((row) => <option key={row} value={row}>{row}</option>)}
                </select>
                <span className='ps-1'>entries</span>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="position-relative input-group">
                  <input placeholder="Search..." onChange={(e) => setParam({ ...param, query: e.target.value, pageNo: 1 })} type="search" id="search" className="shadow-none form-control form-control-sm" />
                  <span className="bg-transparent input-group-text">
                    <div className="fa fa-search text-primary"></div>
                  </span>
                </div>
              </div>
            </div>


            {/* Table */}
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead style={{ backgroundColor: "#EDF2F9" }}>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Report</th>
                    <th>Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReports.length > 0 ? (
                    paginatedReports.map((report, index) => (
                      <tr key={report._id}>
                        <td>{(param.pageNo - 1) * param.limit + index + 1}</td>
                        <td>{report.user_id?.name || "N/A"}</td>
                        <td>{report.user_id?.email || "N/A"}</td>
                        <td>{report.report}</td>
                        <td>{new Date(report.date).toLocaleString()}</td>
                        <td className="text-center">
                          <Action dropList={dropList(report)} data={report} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-danger">
                        No reports found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between mt-3">
              <p className="fs--1 mb-0">
                Showing {(param.pageNo - 1) * param.limit + 1} to{" "}
                {param.pageNo * param.limit > totalCount
                  ? totalCount
                  : param.pageNo * param.limit}{" "}
                of {totalCount}
              </p>
              <div className="d-flex">
                <button
                  className="btn btn-sm btn-falcon-default"
                  onClick={() => handlePageChange(1)}
                >
                  <i className="fas fa-chevron-left" />
                </button>
                <ul className="pagination mb-0 mx-2">
                  {paginationList.map((pg) => (
                    <li key={pg}>
                      <button
                        className={`btn btn-sm me-1 ${pg === param.pageNo ? "btn-primary" : "btn-falcon-default"
                          }`}
                        onClick={() => handlePageChange(pg)}
                      >
                        {pg}
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  className="btn btn-sm btn-falcon-default"
                  onClick={() => handlePageChange(totalPages)}
                >
                  <i className="fas fa-chevron-right" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header>
            <Modal.Title>{editMode ? "Edit Report" : "Add Report"}</Modal.Title>
            <CloseButton onClick={() => setShowModal(false)} />
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label>Report</label>
              <textarea
                className="form-control"
                value={newReport.report}
                onChange={(e) => setNewReport({ ...newReport, report: e.target.value })}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editMode ? "Update Report" : "Add Report"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Reports;
