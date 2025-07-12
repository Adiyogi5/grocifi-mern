import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AxiosHelper from '../../../helper/AxiosHelper';
import Swal from 'sweetalert2';
import { formatDateDDMMYYYY, getDeleteConfig } from '../../../helper/StringHelper';
import Status from '../../../components/Table/Status';
import Action from '../../../components/Table/Action';
import { CloseButton, Modal } from 'react-bootstrap';
import withReactContent from 'sweetalert2-react-content';
import PermissionBlock from '../../../components/PermissionBlock';
import useRowSelection from '../../../helper/helperFunctions';
import { toast } from 'react-toastify';
import { FaUser, FaStore } from 'react-icons/fa';

const MySwal = withReactContent(Swal);

const ListCustomer = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ count: 0, record: [], totalPages: 0, pagination: [] });
  const [showView, setShowView] = useState(false);
  const [param, setParam] = useState({ 
    limit: 10, 
    pageNo: 1, 
    query: '', 
    orderBy: 'created', 
    orderDirection: -1
  });
  const [initialValues, setInitialValues] = useState({
    fname: '',
    lname: '',
    email: '',
    phone_no: '',
    roleId: '',
    image: '',
    status: 1,
    created: '',
    wholesaler_firmname: '',
    gst_no: '',
    visiting_card: '',
    is_wholesaler: false
  });

  const getDataForTable = useCallback(async () => {
    try {
      const { data } = await AxiosHelper.getData('customer', param);
      if (data?.status === true) {
        const { count, totalPages, record, pagination } = data?.data;
        setData({ count, totalPages, record, pagination });
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  }, [param]);

  const handleSort = (event) => {
    const orderBy = event.target.attributes.getNamedItem('data-sort').value;
    if (param?.orderBy !== orderBy) {
      setParam({ ...param, orderBy });
    } else {
      setParam({ ...param, orderDirection: param?.orderDirection * -1 });
    }
  };

  const handlePageChange = (pageNo) => {
    setParam({ ...param, pageNo });
  };

  useEffect(() => {
    getDataForTable();
  }, [getDataForTable]);

  const deleteData = async (event) => {
    const { isConfirmed } = await MySwal.fire(getDeleteConfig({}));
    if (isConfirmed) {
      const { _id } = JSON.parse(event.target.attributes.getNamedItem('main-data').value);
      const { data } = await AxiosHelper.deleteData(`customer/delete/${_id}`);
      if (data?.status === true) {
        getDataForTable();
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
    }
  };

  const viewData = async (event) => {
    const data = JSON.parse(event.target.attributes.getNamedItem('main-data').value);
    setInitialValues(data);
    setShowView(true);
  };

  const dropList = [
    {
      name: 'View',
      module_id: 'customer',
      onClick: viewData,
    },
    {
      name: 'Edit',
      module_id: 'customer',
      action: 'edit',
      onClick: (event) => {
        const data = JSON.parse(event.target.attributes.getNamedItem('main-data').value);
        navigate(`/admin/customer/edit/${data._id}`);
      },
    },
    {
      name: 'Delete',
      module_id: 'customer',
      action: 'delete',
      onClick: deleteData,
      className: 'text-danger',
    },
  ];

  const { selectedRows, toggleRowSelection, toggleSelectAll, handleMultipleDelete, selectAll } = useRowSelection({
    table: 'users',
    getDataForTable,
  });

  const renderUserTypeIcon = (isWholesaler) => {
    return isWholesaler ? (
      <span className="badge bg-success me-2" title="Wholesaler">
        <FaStore className="me-1" /> Wholesaler
      </span>
    ) : (
      <span className="badge bg-primary me-2" title="Customer">
        <FaUser className="me-1" /> Customer
      </span>
    );
  };

  const renderWholesalerField = (value, isWholesaler) => {
    return isWholesaler ? (
      value || '-'
    ) : (
      <span className="text-muted" title="Not applicable for customer">
        <i className="fas fa-minus"></i>
      </span>
    );
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <div className="card mb-3">
            <div className="card-header">
              <div className="row flex-between-end">
                <div className="col-auto align-self-center">
                  <h5 className="mb-0" data-anchor="data-anchor">
                    Customer Management
                  </h5>
                </div>
                <div className="col-auto ms-auto">
                  <div className="mt-2" role="tablist">
                    <Link to="/admin/dashboard" className="me-2 btn btn-sm btn-falcon-default">
                      <i className="fa fa-home me-1"></i>
                      <span className="d-none d-sm-inline-block ms-1">Dashboard</span>
                    </Link>
                    <PermissionBlock module="customer" action="add">
                      <Link to="/admin/customer/add">
                        <button className="btn btn-sm btn-falcon-default">
                          <i className="fa fa-plus me-1"></i>
                          Add Customer
                        </button>
                      </Link>
                    </PermissionBlock>
                    {selectedRows.length > 0 && (
                      <button onClick={handleMultipleDelete} className="btn btn-sm btn-danger mx-2">
                        <i className="bi bi-trash"></i> Delete Selected ({selectedRows.length})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body pt-0">
              <div className="row justify-content-between mb-3">
                <div className="col-md-6 d-flex">
                  <span className="pe-2">Show</span>
                  <select
                    className="w-auto form-select form-select-sm"
                    onChange={(e) => setParam({ ...param, limit: e.target.value })}
                  >
                    {[10, 20, 50].map((row) => (
                      <option key={row} value={row}>{row}</option>
                    ))}
                  </select>
                  <span className="ps-1">entries</span>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="position-relative input-group">
                    <input
                      placeholder="Search..."
                      onChange={(e) => setParam({ ...param, query: e.target.value, pageNo: 1 })}
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
              <div className="tab-content">
                <div id="tableExample2" data-list="">
                  <div className="table-responsive">
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
                          <th>Type</th>
                          <th>Profile</th>
                          <th
                            onClick={handleSort}
                            className={`sort ${param?.orderBy === 'fname' && (param?.orderDirection === 1 ? 'asc' : 'desc')}`}
                            data-sort="fname"
                          >
                            Name
                          </th>
                          <th
                            onClick={handleSort}
                            className={`sort ${param?.orderBy === 'wholesaler_firmname' && (param?.orderDirection === 1 ? 'asc' : 'desc')}`}
                            data-sort="wholesaler_firmname"
                          >
                            Firm Name
                          </th>
                          <th
                            onClick={handleSort}
                            className={`sort ${param?.orderBy === 'gst_no' && (param?.orderDirection === 1 ? 'asc' : 'desc')}`}
                            data-sort="gst_no"
                          >
                            GST No.
                          </th>
                          <th
                            onClick={handleSort}
                            className={`sort ${param?.orderBy === 'email' && (param?.orderDirection === 1 ? 'asc' : 'desc')}`}
                            data-sort="email"
                          >
                            Email
                          </th>
                          <th
                            onClick={handleSort}
                            className={`sort ${param?.orderBy === 'phone_no' && (param?.orderDirection === 1 ? 'asc' : 'desc')}`}
                            data-sort="phone_no"
                          >
                            Mobile
                          </th>
                          <th
                            onClick={handleSort}
                            className={`sort ${param?.orderBy === 'created' && (param?.orderDirection === 1 ? 'asc' : 'desc')}`}
                            data-sort="created"
                          >
                            Created At
                          </th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody className="list">
                        {data?.record && data?.record.map((row, i) => (
                          <tr key={i}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedRows.includes(row._id)}
                                onChange={() => toggleRowSelection(row._id)}
                              />
                            </td>
                            <td>
                              {renderUserTypeIcon(row.is_wholesaler)}
                            </td>
                            <td>
                              <img 
                                src={row?.img || '/assets/img/team/avatar.png'} 
                                alt="" 
                                width={50} 
                                style={{objectFit: 'contain'}}
                                height={50}
                                className="rounded-circle"
                              />
                            </td>
                            <td
                              className="fw-bold text-primary cursor-pointer"
                              main-data={JSON.stringify(row)}
                              onClick={viewData}
                            >
                              {row.fname + ' ' + row.lname}
                            </td>
                            <td>
                              {renderWholesalerField(row.wholesaler_firmname, row.is_wholesaler)}
                            </td>
                            <td>
                              {renderWholesalerField(row.gst_no, row.is_wholesaler)}
                            </td>
                            <td>{row.email}</td>
                            <td>{row.phone_no}</td>
                            <td>{formatDateDDMMYYYY(row.created)}</td>
                            <td>
                              <Status table="users" status={row.status} data_id={row._id} />
                            </td>
                            <td>
                              <Action dropList={dropList} data={row} />
                            </td>
                          </tr>
                        ))}
                        {data?.record.length === 0 && (
                          <tr>
                            <td colSpan="12" className="text-danger text-center">
                              No data available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row align-items-center mt-3">
                  <div className="col">
                    <p className="mb-0 fs--1">
                      <span className="d-none d-sm-inline-block" data-list-info="data-list-info">
                        {(param.pageNo - 1) * param.limit + 1} to{' '}
                        {param.pageNo * param.limit > data?.count ? data?.count : param.pageNo * param.limit} of{' '}
                        {data?.count}
                      </span>
                    </p>
                  </div>
                  <div className="col-auto">
                    <div className="d-flex justify-content-center align-items-center">
                      <button
                        type="button"
                        className="btn btn-falcon-default btn-sm"
                        onClick={() => handlePageChange(1)}
                      >
                        <span className="fas fa-chevron-left" />
                      </button>
                      <ul className="pagination mb-0 mx-1">
                        {data?.pagination.map((row, i) => (
                          <li key={row}>
                            <button
                              onClick={() => handlePageChange(row)}
                              type="button"
                              className={`page me-1 btn btn-sm ${row === param.pageNo ? 'btn-primary' : 'btn-falcon-default'}`}
                            >
                              {row}
                            </button>
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        className="btn btn-falcon-default btn-sm"
                        onClick={() => handlePageChange(data?.totalPages)}
                      >
                        <span className="fas fa-chevron-right"></span>
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
            View {initialValues.is_wholesaler ? 'Wholesaler' : 'Customer'} Details
          </Modal.Title>
          <CloseButton onClick={() => setShowView(false)} />
        </Modal.Header>
        <Modal.Body>
          <ul className="list-group">
            <li className="list-group-item text-center">
              <img 
                src={initialValues.img || '/assets/img/team/avatar.png'} 
                alt="Profile" 
                className="img-fluid rounded-circle" 
                width={150} 
                height={150}
              />
            </li>
            {initialValues.is_wholesaler && initialValues.visiting_card && (
              <li className="list-group-item text-center">
                <img 
                  src={initialValues.visiting_card} 
                  alt="Visiting Card" 
                  className="img-fluid" 
                  style={{ maxHeight: '200px' }}
                />
                <div className="mt-2 small text-muted">Visiting Card</div>
              </li>
            )}
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs--1 mb-0">User Type</label>
              <span className="fs--1">
                {renderUserTypeIcon(initialValues.is_wholesaler)}
              </span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs--1 mb-0">Name</label>
              <span className="fs--1 text-muted">{initialValues.fname + ' ' + initialValues.lname}</span>
            </li>
            {initialValues.is_wholesaler && (
              <>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <label className="fs--1 mb-0">Firm Name</label>
                  <span className="fs--1">{initialValues.wholesaler_firmname || '-'}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <label className="fs--1 mb-0">GST Number</label>
                  <span className="fs--1">{initialValues.gst_no || '-'}</span>
                </li>
              </>
            )}
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs--1 mb-0">Email</label>
              <span className="fs--1">{initialValues.email}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs--1 mb-0">Mobile</label>
              <span className="fs--1 text-muted ps-3">{initialValues.phone_no}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs--1 mb-0">Status</label>
              <Status 
                table="users" 
                status={initialValues.status} 
                data_id={initialValues._id} 
              />
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs--1 mb-0">Created At</label>
              <span className="fs--1 text-muted">{formatDateDDMMYYYY(initialValues.created)}</span>
            </li>
          </ul>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ListCustomer;