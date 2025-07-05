import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AxiosHelper from "../../../helper/AxiosHelper";
import Swal from "sweetalert2";
import {
  formatDateDDMMYYYY,
  getDeleteConfig,
} from "../../../helper/StringHelper";
import Status from "../../../components/Table/Status";
import Action from "../../../components/Table/Action";
import { CloseButton, Modal } from "react-bootstrap";
import withReactContent from "sweetalert2-react-content";
import PermissionBlock from "../../../components/PermissionBlock";
import { PRICETYPE } from "../../../constant/fromConfig";
import Featured from "../../../components/Featured";
import { toast } from "react-toastify";
import AdsStatus from "../../../components/Table/AdsStatus";
import { FaFilter, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
import useRowSelection from "../../../helper/helperFunctions";

const MySwal = withReactContent(Swal);

const listAdvertisement = () => {
  const table = "advertisements";

  const navigate = useNavigate();
  const [data, setData] = useState({
    count: 0,
    record: [],
    totalPages: 0,
    pagination: [],
  });
  const [showView, setShowView] = useState(false);
  const [param, setParam] = useState({
    limit: 10,
    pageNo: 1,
    query: "",
    orderBy: "createdAt",
    orderDirection: -1,
    status: "",
    createdAtRange: "",
    createdAtStart: "",
    createdAtEnd: "",
    expiryDateRange: "",
    specificExpiryDate: "",
  });
  const [initialValues, setInitialValues] = useState({
    uniqueId: "",
    category_id: "",
    country_id: "",
    pricing: "",
    state_id: "",
    city_id: "",
    owner_id: "",
    ad_label: "",
    price: 0,
    price_type: "",
    price_unit: "",
    currency: "",
    minPrice: 0,
    maxPrice: 0,
    description: "",
    advertisement_tag: "",
    local_url: "",
    image: "",
    attachments: "",
    video: "",
    title: "",
    condition: "",
    hour_type: "",
    opening_hours: "",
    status: "",
    is_feature: "",
    createdAt: "",
    expiry_date: "",
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  // ********************************* For Getting Data **************************************

  // get Table Data
  const getDataForTable = useCallback(async () => {
    const { data } = await AxiosHelper.getData(
      "advertisement-datatable",
      param
    );

    if (data?.status === true) {
      let { count, totalPages, record, pagination } = data?.data;

      setData({ count, totalPages, record, pagination });
    } else {
      toast.error(data?.message);
    }
  }, [param]);

  const handelSort = (event) => {
    var orderBy = event.target.attributes.getNamedItem("data-sort").value;
    if (param?.orderBy !== orderBy) {
      setParam({ ...param, orderBy });
    } else {
      setParam({ ...param, orderDirection: param?.orderDirection * -1 });
    }
  };

  const handelPageChange = (pageNo) => {
    setParam({ ...param, pageNo });
  };

  useEffect(() => {
    getDataForTable();
  }, [param]);

  // For Delete ...............................................................
  const deleteData = async (event) => {
    var { isConfirmed } = await MySwal.fire(getDeleteConfig({}));
    if (isConfirmed) {
      var { _id } = JSON.parse(event.target.attributes.getNamedItem("main-data").value);
      var { data } = await AxiosHelper.deleteData(`delete-record/advertisements/${_id}`);
      if (data?.status === true) {
        getDataForTable();
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
    }
  };

    const viewData = async (event) => {
        var data = JSON.parse(event.target.attributes.getNamedItem('main-data').value);
        navigate(`/admin/advertisement/view/${data.slug}`)
    }

    const updateAdvertisementStatus = async (id, newStatus) => {
        try {
            const { data } = await AxiosHelper.putData(`advertisement/update-status/${id}`, {
                status: newStatus
            });

            if (data?.status === true) {
                toast.success(data?.message);
                getDataForTable(); // Refresh the table
            } else {
                toast.error(data?.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(error.response?.data?.message || "Error updating status");
        }
    };

  const dropList = [
    {
      name: "View",
      module_id: "Advertisement",
      onClick: viewData,
    },
    {
      name: "Edit",
      module_id: "Advertisement",
      action: "edit",
      onClick: (event) => {
        var data = JSON.parse(
          event.target.attributes.getNamedItem("main-data").value
        );
        navigate(`/admin/advertisement/edit/${data._id}`);
      },
    },
    {
      name: "Delete",
      module_id: "Advertisement",
      action: "delete",
      onClick: deleteData,
      className: "text-danger",
    },
  ];

    const {
        selectedRows,
        toggleRowSelection,
        toggleSelectAll,
        handleMultipleDelete,
        selectAll,
    } = useRowSelection({ table, getDataForTable });

  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <div className="card mb-3">
            <div className="card-header">
              <div className="row flex-between-end">
                <div className="col-auto align-self-center">
                  <h5 className="mb-0" data-anchor="data-anchor">
                    Advertisement
                  </h5>
                </div>
                <div className="col-auto ms-auto">
                  <div className="mt-2" role="tablist">
                    <Link
                      to={`/admin/dashboard`}
                      className="me-2 btn btn-sm btn-falcon-default"
                    >
                      <i className="fa fa-home me-1"></i>
                      <span className="d-none d-sm-inline-block ms-1">
                        Dashboard
                      </span>
                    </Link>
                    <PermissionBlock module={"Advertisement"} action={"add"}>
                      <Link to={`/admin/advertisement/add`}>
                        <button className="btn btn-sm btn-falcon-default">
                          <i className="fa fa-plus me-1"></i>
                          Add Advertisement
                        </button>
                      </Link>
                    </PermissionBlock>
                    {selectedRows.length > 0 && (
                      <button
                        onClick={handleMultipleDelete}
                        className="btn btn-sm btn-danger mx-2"
                      >
                        <i className="bi bi-trash"></i> Delete Selected (
                        {selectedRows.length})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body pt-0">
              <div className="row  justify-content-between mb-3">
                <div className="col-md-6 d-flex">
                  <span className="pe-2">Show</span>
                  <select
                    className="w-auto form-select form-select-sm"
                    onChange={(e) =>
                      setParam({ ...param, limit: e.target.value })
                    }
                  >
                    {[10, 20, 50].map((row) => (
                      <option key={row} value={row}>
                        {row}
                      </option>
                    ))}
                  </select>
                  <span className="ps-1">entries</span>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="position-relative input-group">
                    <input
                      placeholder="Search..."
                      onChange={(e) =>
                        setParam({ ...param, query: e.target.value, pageNo: 1 })
                      }
                      type="search"
                      id="search"
                      className="shadow-none form-control form-control-sm"
                    />
                    <span className="bg-transparent input-group-text">
                      <div className="fa fa-search text-primary"></div>
                    </span>
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-12 text-end">
                  <button
                    className="btn btn-sm btn-falcon-primary position-relative"
                    onClick={() => setShowFilterModal(true)}
                    data-bs-toggle="tooltip"
                    title="Apply Filters"
                  >
                    <FaFilter className="me-1" /> Filters
                    {(param.status ||
                      param.createdAtRange ||
                      param.createdAtStart ||
                      param.createdAtEnd ||
                      param.expiryDateRange ||
                      param.specificExpiryDate) && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {
                          [
                            param.status,
                            param.createdAtRange ||
                              param.createdAtStart ||
                              param.createdAtEnd,
                            param.expiryDateRange || param.specificExpiryDate,
                          ].filter(Boolean).length
                        }
                      </span>
                    )}
                  </button>
                </div>
              </div>

                            <div className="tab-content">
                                <div id="tableExample2" data-list="">
                                    <div className="table-responsive1 ">
                                        <table className="table table-bordered table-striped fs--1 mb-0">
                                            <thead className="bg-200 text-900">
                                                <tr>
                                                    <th>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectAll}
                                                            onChange={() => toggleSelectAll(data.record)}
                                                        />
                                                    </th>
                                                    <th>Image</th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "title" && (param?.label === 1 ? 'asc' : 'desc')}`} data-sort="title">Title</th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "price" && (param?.name === 1 ? 'asc' : 'desc')}`} data-sort="price">Price</th>
                                                    <th>Owner</th>
                                                    <th>Status</th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "createdAt" && (param?.createdAt === 1 ? 'asc' : 'desc')}`} data-sort="createdAt">Created At</th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "expiry_date" && (param?.expiry_date === 1 ? 'asc' : 'desc')}`} data-sort="expiry_date">Expiry date</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="list">
                                                {data?.record && data?.record.map((row, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedRows.includes(row._id)}
                                                                    onChange={() => toggleRowSelection(row._id)}
                                                                />
                                                            </td>
                                                            <td>
                                                                <div className='position-relative'>
                                                                    <img src={row.image?.[0]} data-dz-thumbnail="data-dz-thumbnail" alt="" width={100} />
                                                                    <Featured Classes='position-absolute top-0 start-0' status={row?.promotionPlan}></Featured>
                                                                </div>
                                                            </td>
                                                            <td className="fw-bold text-primary cursor-pointer" main-data={JSON.stringify(row)} onClick={viewData}>{row?.title} <br /> ({row?.category_id?.name})</td>
                                                            <td>{row.pricing == 'single' ? row.price : [row.minPrice + " To " + row.maxPrice]}<br /><strong className='text-danger'>({PRICETYPE.find(type => type.id === row.price_type)?.name || ''})</strong> </td>
                                                            <td>{row.owner_id?.name} </td>
                                                            <td>{row.status == 1 || row.status == 3 ?
                                                                <div className='d-flex gap-2 justify-content-center'>
                                                                    <AdsStatus status={row.status} expireDate={row?.expiry_date} />
                                                                </div>
                                                                :
                                                                row.status == 2 ?
                                                                    <div className='d-flex gap-2 justify-content-center'>
                                                                        <small
                                                                            onClick={() => updateAdvertisementStatus(row._id, 1)}
                                                                            className={`badge fw-semi-bold rounded-pill status cursor-pointer bg-success`}>
                                                                            Approve
                                                                            <span className={`ms-1 fa-solid fa-circle-check`} data-fa-transform="shrink-2"></span>
                                                                        </small>
                                                                        <button
                                                                            disabled
                                                                            onClick={() => updateAdvertisementStatus(row._id, 2)}
                                                                            className={`badge fw-semi-bold rounded-pill status cursor-pointer bg-secondary`}>
                                                                            Keep Pending
                                                                            <span className={`ms-1 fa-duotone fa-regular fa-xmark-to-slot`} data-fa-transform="shrink-2"></span>
                                                                        </button>
                                                                    </div>
                                                                    :
                                                                    <div className='d-flex gap-2 justify-content-center'>
                                                                        <small
                                                                            className={`badge fw-semi-bold rounded-pill status cursor-pointer badge-soft-warning`}>
                                                                            Draft
                                                                            <span className={`ms-1 fa-duotone fa-solid fa-clock-rotate-left`} data-fa-transform="shrink-2"></span>
                                                                        </small>
                                                                    </div>
                                                            } </td>
                                                            <td>{formatDateDDMMYYYY(row.createdAt)}</td>
                                                            <td>{formatDateDDMMYYYY(row.expiry_date)}</td>
                                                            <td><Action dropList={dropList} data={row} /></td>
                                                        </tr>
                                                    )
                                                })}
                                                {data?.record.length === 0 && <tr><td colSpan="100" className='text-danger text-center'>No data availabel..</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                <div className="row align-items-center mt-3">
                  <div className="col">
                    <p className="mb-0 fs--1">
                      <span
                        className="d-none d-sm-inline-block"
                        data-list-info="data-list-info"
                      >
                        {(param.pageNo - 1) * param.limit + 1} to{" "}
                        {param.pageNo * param.limit > data?.count
                          ? data?.count
                          : param.pageNo * param.limit}{" "}
                        of {data?.count}
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
                        onClick={() => handelPageChange(1)}
                      >
                        <span className="fas fa-chevron-left" />
                      </button>
                      <ul className="pagination mb-0 mx-1">
                        {data?.pagination.map((row, i) => {
                          return (
                            <li key={row}>
                              <button
                                onClick={() => handelPageChange(row)}
                                type="button"
                                className={`page me-1 btn btn-sm ${
                                  row === param.pageNo
                                    ? "btn-primary"
                                    : "btn-falcon-default"
                                }`}
                              >
                                {row}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                      <button
                        type="button"
                        disabled={param.pageNo === data?.totalPages}
                        className="btn btn-falcon-default btn-sm"
                        onClick={() => handelPageChange(data?.totalPages)}
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
      </div>
      <Modal
        size="lg"
        show={showView}
        centered={true}
        onHide={() => setShowView(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg">
            View Advertisement ({initialValues?.uniqueId})
          </Modal.Title>
          <CloseButton onClick={() => setShowView(false)} />
        </Modal.Header>
        <Modal.Body>
          <ul className="list-group">
            <li className="list-group-item text-center">
              <img
                src={initialValues?.image?.[0]}
                alt="Thumbnail"
                className="img-fluid"
                width={250}
              />
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs--1 mb-0">Condition</label>
              <span className="fs--1 text-muted">
                {initialValues?.condition?.name}
              </span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs--1 mb-0">Title</label>
              <span className="fs--1 text-muted">{initialValues?.title} </span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs--1 mb-0">Owner Name</label>
              <span className="fs--1 text-muted">
                {initialValues?.owner_id?.name}{" "}
              </span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs--1 mb-0">Label</label>
              <span className="fs--1 text-muted">
                {initialValues?.ad_label?.name}{" "}
              </span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs--1 mb-0">Video Url</label>
              <span className="fs--1 text-muted">{initialValues?.video} </span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs--1 mb-0">Price</label>
              <span className="fs--1 text-muted">
                {initialValues.pricing == "single"
                  ? initialValues.price
                  : [initialValues.minPrice + " To " + initialValues.maxPrice]}
                <br />
                <strong className="text-danger">
                  (
                  {PRICETYPE.find(
                    (type) => type.id === initialValues.price_type
                  )?.name || ""}
                  )
                </strong>
              </span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs--1 mb-0">Tags</label>
              <ul>
                {initialValues?.advertisement_tag &&
                  initialValues?.advertisement_tag.map((item) => (
                    <li
                      key={item.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <label className="fs--1 mb-0">{item.name}</label>
                    </li>
                  ))}
              </ul>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs--1 mb-0">Cateogry</label>
              <span className="fs--1 text-muted">
                {initialValues?.category_id?.name}{" "}
              </span>
            </li>

            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs--1 mb-0">Description</label>
              <span className="fs--1">{initialValues?.description}</span>
            </li>

            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs--1 mb-0">Status</label>
              <Status
                table="admins"
                status={initialValues?.status}
                data_id={initialValues._id}
              />
            </li>

            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs--1 mb-0">Created At</label>
              <span className="fs--1 text-muted">
                {formatDateDDMMYYYY(initialValues?.createdAt)}
              </span>
            </li>
          </ul>
        </Modal.Body>
      </Modal>

      {/* filter modal  */}
      <Modal
        show={showFilterModal}
        onHide={() => setShowFilterModal(false)}
        centered
        size="md" // Smaller size for better UX
        animation={true} // Enable animation for smooth transitions
        dialogClassName="modal-animated" // Custom class for animation
      >
        <Modal.Header className="bg-primary text-white">
          <Modal.Title>
            <FaFilter className="me-2 text-light" />{" "}
            <span className="text-light">Filter Advertisements</span>
          </Modal.Title>
          <CloseButton
            onClick={() => setShowFilterModal(false)}
            className="btn-close-white"
          />
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">Status</label>
              <select
                className="form-select form-select-sm shadow-sm"
                value={param.status}
                onChange={(e) => setParam({ ...param, status: e.target.value })}
                data-bs-toggle="tooltip"
                title="Filter by advertisement status"
              >
                <option value="">All Status</option>
                <option value="-1">Draft</option>
                <option value="1">Live Ads</option>
                <option value="2">Pending</option>
                <option value="3">Expired</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Created At</label>
              <select
                className="form-select form-select-sm shadow-sm"
                value={param.createdAtRange}
                onChange={(e) =>
                  setParam({
                    ...param,
                    createdAtRange: e.target.value,
                    createdAtStart: "",
                    createdAtEnd: "",
                  })
                }
                data-bs-toggle="tooltip"
                title="Filter by creation date range"
              >
                <option value="">All Created Dates</option>
                <option value="today">Today</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
              {param.createdAtRange === "custom" && (
                <div className="mt-3">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control form-control-sm shadow-sm"
                    value={param.createdAtStart}
                    onChange={(e) => {
                      const start = e.target.value;
                      if (param.createdAtEnd && start > param.createdAtEnd) {
                        toast.error("Start date cannot be after end date");
                        return;
                      }
                      setParam({ ...param, createdAtStart: start });
                    }}
                    data-bs-toggle="tooltip"
                    title="Select start date for custom range"
                  />
                  <label className="form-label mt-2">End Date</label>
                  <input
                    type="date"
                    className="form-control form-control-sm shadow-sm"
                    value={param.createdAtEnd}
                    onChange={(e) => {
                      const end = e.target.value;
                      if (param.createdAtStart && end < param.createdAtStart) {
                        toast.error("End date cannot be before start date");
                        return;
                      }
                      setParam({ ...param, createdAtEnd: end });
                    }}
                    data-bs-toggle="tooltip"
                    title="Select end date for custom range"
                  />
                </div>
              )}
            </div>
            {/* <div className="col-md-4">
                <label className="form-label">Expiry Date</label>
                <select
                    className="form-select form-select-sm"
                    value={param.expiryDateRange}
                    onChange={(e) => setParam({ ...param, expiryDateRange: e.target.value, specificExpiryDate: '' })}
                >
                    <option value="">All Expiry Dates</option>
                    <option value="active">Not Expired</option>
                    <option value="expired">Expired</option>
                    <option value="future">Future</option>
                </select>
                {param.expiryDateRange === 'expired' && (
                    <div className="mt-2">
                        <label className="form-label">Specific Expiry Date</label>
                        <input
                            type="date"
                            className="form-control form-control-sm"
                            value={param.specificExpiryDate}
                            onChange={(e) => setParam({ ...param, specificExpiryDate: e.target.value })}
                        />
                    </div>
                )}
            </div> */}
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              setParam({
                ...param,
                status: "",
                createdAtRange: "",
                createdAtStart: "",
                createdAtEnd: "",
                expiryDateRange: "",
                specificExpiryDate: "",
                pageNo: 1,
              });
              setShowFilterModal(false);
              toast.success("Filters cleared");
            }}
            data-bs-toggle="tooltip"
            title="Reset all filters"
          >
            <FaTrash className="me-1" /> Clear Filters
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowFilterModal(false)}
            data-bs-toggle="tooltip"
            title="Close without applying filters"
          >
            <FaTimes className="me-1" /> Cancel
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setShowFilterModal(false);
              setParam({ ...param, pageNo: 1 });
              toast.success("Filters applied");
            }}
            data-bs-toggle="tooltip"
            title="Apply selected filters"
          >
            <FaCheck className="me-1" /> OK
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default listAdvertisement;
