import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import AxiosHelper from '../../../helper/AxiosHelper';
import Swal from 'sweetalert2'
import { formatDateDDMMYYYY, getDeleteConfig, convertToHr } from '../../../helper/StringHelper';
import Status from '../../../components/Table/Status';
import Action from '../../../components/Table/Action';
import { CloseButton, Modal } from 'react-bootstrap';
import withReactContent from 'sweetalert2-react-content';
import PermissionBlock from '../../../components/PermissionBlock';
import { toast } from 'react-toastify';
import { FaFilter, FaTrash, FaTimes, FaCheck } from 'react-icons/fa';
import useRowSelection from '../../../helper/helperFunctions';

const MySwal = withReactContent(Swal)

const listBlog = () => {
    const table = "blogs"

    const navigate = useNavigate();
    const [data, setData] = useState({ count: 0, record: [], totalPages: 0, pagination: [] });
    const [showView, setShowView] = useState(false);
    const [param, setParam] = useState({
        limit: 10, pageNo: 1, query: "", orderBy: 'createdAt', orderDirection: -1, status: '',
        createdAtRange: '',
        createdAtStart: '',
        createdAtEnd: ''
    })
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [initialValues, setInitialValues] = useState({
        title: "",
        sort_description: "",
        tags: "",
        content: "",
        read_time: "",
        author_id: "",
        category_id: "",
        status: "",
        image: "",
    });

    // ********************************* For Getting Data **************************************

    // get Table Data 
    const getDataForTable = useCallback(async () => {
        const { data } = await AxiosHelper.getData("blog-datatable", param);

        if (data?.status === true) {
            let { count, totalPages, record, pagination } = data?.data
            setData({ count, totalPages, record, pagination })

        } else {
            toast.error(data?.message);
        }
    }, [param])

    const handelSort = (event) => {
        var orderBy = event.target.attributes.getNamedItem('data-sort').value;
        if (param?.orderBy !== orderBy) {
            setParam({ ...param, orderBy })
        } else {
            setParam({ ...param, orderDirection: param?.orderDirection * -1 })
        }
    }

    const handelPageChange = (pageNo) => { setParam({ ...param, pageNo }) }

    useEffect(() => { getDataForTable() }, [param])


    // For Delete ...............................................................
    const deleteData = async (event) => {
        var { isConfirmed } = await MySwal.fire(getDeleteConfig({}))
        if (isConfirmed) {
            var { id } = JSON.parse(event.target.attributes.getNamedItem('main-data').value);
            var { data } = await AxiosHelper.deleteData(`delete-record/blogs/${id}`);
            if (data?.status === true) {
                getDataForTable()
                toast.success(data?.message);
            } else {
                toast.error(data?.message);
            }
        }
    }

    const viewData = async (event) => {
        var data = JSON.parse(event.target.attributes.getNamedItem('main-data').value);
        setInitialValues(data)
        setShowView(true)
    }

    const dropList = [
        {
            name: "View",
            module_id: "Blog",
            onClick: viewData
        },
        {
            name: "Edit",
            module_id: "Blog",
            action: 'edit',
            onClick: (event) => {
                var data = JSON.parse(event.target.attributes.getNamedItem('main-data').value);
                navigate(`/admin/blog/edit/${data.slug}`)
            }
        },
        {
            name: "Delete",
            module_id: "Blog",
            action: 'delete',
            onClick: deleteData,
            className: "text-danger"
        },
    ]

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
                                    <h5 className="mb-0" data-anchor="data-anchor">Blog</h5>
                                </div>
                                <div className="col-auto ms-auto">
                                    <div className="mt-2" role="tablist">
                                        <Link to={`/admin/dashboard`} className="me-2 btn btn-sm btn-falcon-default">
                                            <i className="fa fa-home me-1"></i>
                                            <span className="d-none d-sm-inline-block ms-1">Dashboard</span>
                                        </Link>
                                        <PermissionBlock module={'Blog'} action={'add'}>
                                            <Link to={`/admin/blog/add`}>
                                                <button className="btn btn-sm btn-falcon-default">
                                                    <i className="fa fa-plus me-1"></i>
                                                    Add Blog
                                                </button>
                                            </Link>
                                        </PermissionBlock>
                                        {selectedRows.length > 0 && (
                                            <button
                                                onClick={handleMultipleDelete}
                                                className="btn btn-sm btn-danger mx-2"
                                            >
                                                <i className="bi bi-trash"></i> Delete Selected ({selectedRows.length})
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="card-body pt-0">
                            <div className="row  justify-content-between mb-3">
                                <div className="col-md-6 d-flex">
                                    <span className='pe-2'>Show</span>
                                    <select className="w-auto form-select form-select-sm" onChange={(e) => setParam({ ...param, limit: e.target.value })} >
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
                            <div className="row mb-3">
                                <div className="col-md-12 text-end">
                                    <button
                                        className="btn btn-sm btn-falcon-primary position-relative"
                                        onClick={() => setShowFilterModal(true)}
                                        data-bs-toggle="tooltip"
                                        title="Apply Filters"
                                    >
                                        <FaFilter className="me-1" /> Filter by
                                        {(param.status || param.createdAtRange || param.createdAtStart || param.createdAtEnd) && (
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                {[
                                                    param.status,
                                                    param.createdAtRange || param.createdAtStart || param.createdAtEnd
                                                ].filter(Boolean).length}
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
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "author_id.name" && (param?.author_id.name === 1 ? 'asc' : 'desc')}`} data-sort="author_id.name">Author</th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "title" && (param?.title === 1 ? 'asc' : 'desc')}`} data-sort="title">Title</th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "category_id.name" && (param?.category_id.name === 1 ? 'asc' : 'desc')}`} data-sort="category_id.name">Category</th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "sort_description" && (param?.sort_description === 1 ? 'asc' : 'desc')}`} data-sort="sort_description">Sort Description</th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "createdAt" && (param?.createdAt === 1 ? 'asc' : 'desc')}`} data-sort="createdAt">createdAt</th>
                                                    <th>Status</th>
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
                                                            <td> <img src={row.image} data-dz-thumbnail="data-dz-thumbnail" alt="" width={100} /></td>
                                                            <td className="fw-bold text-primary cursor-pointer" main-data={JSON.stringify(row)} onClick={viewData}>{row?.author_id?.name}</td>
                                                            <td>{row.title}</td>
                                                            <td>{row.category_id?.name}</td>
                                                            <td>{row.sort_description}</td>
                                                            <td>{formatDateDDMMYYYY(row.createdAt)}</td>
                                                            <td><Status table='business' status={row.status} data_id={row._id} /></td>
                                                            <td><Action dropList={dropList} data={row} /></td>
                                                        </tr>
                                                    )
                                                })}
                                                {data?.record.length === 0 && <tr><td colSpan="100" className='text-danger text-center'>No data available..</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="row align-items-center mt-3">
                                    <div className="col">
                                        <p className="mb-0 fs--1">
                                            <span className="d-none d-sm-inline-block" data-list-info="data-list-info">{(param.pageNo - 1) * param.limit + 1} to {param.pageNo * param.limit > data?.count ? data?.count : param.pageNo * param.limit} of {data?.count}</span>
                                            <span className="d-none d-sm-inline-block"> </span>
                                        </p>
                                    </div>
                                    <div className="col-auto">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <button type="button" dd="disabled" className=" btn btn-falcon-default btn-sm" onClick={() => handelPageChange(1)}>
                                                <span className="fas fa-chevron-left" />
                                            </button>
                                            <ul className="pagination mb-0 mx-1">
                                                {data?.pagination.map((row, i) => {
                                                    return (
                                                        <li key={row}>
                                                            <button onClick={() => handelPageChange(row)} type="button" className={`page me-1 btn btn-sm ${row === data?.pageNo ? "btn-primary" : "btn-falcon-default"}`}>
                                                                {row}
                                                            </button>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                            <button type="button" className="btn btn-falcon-default btn-sm" onClick={() => handelPageChange(data?.totalPages)}>
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
                        View Blog
                    </Modal.Title>
                    <CloseButton onClick={() => setShowView(false)} />
                </Modal.Header>
                <Modal.Body>
                    <ul className="list-group">
                        <li className="list-group-item text-center">
                            <img src={initialValues?.image} alt="Thumbnail" className="img-fluid" width={250} />
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <label className="fs--1 mb-0">Author Name</label>
                            <span className="fs--1 text-muted">{initialValues?.author_id?.name} </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <label className="fs--1 mb-0">Category</label>
                            <span className="fs--1 text-muted">{initialValues?.category_id?.name}</span>
                        </li>

                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <label className="fs--1 mb-0">Sort Description</label>
                            <span className="fs--1">{initialValues?.sort_description}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <label className="fs--1 mb-0"> Tags </label>
                            <span className="fs--1 text-muted ps-3">{Array.isArray(initialValues?.tags) ? initialValues?.tags.join(',') : ''}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <label className="fs--1 mb-0"> Time </label>
                            <span className="fs--1 text-muted ps-3">{convertToHr(10)}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <label className="fs--1 mb-0">Status</label>
                            <Status table='admins' status={initialValues?.status} data_id={initialValues._id} />
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <label className="fs--1 mb-0">Created At</label>
                            <span className="fs--1 text-muted">{formatDateDDMMYYYY(initialValues?.createdAt)}</span>
                        </li>
                    </ul>
                </Modal.Body>
            </Modal>

            <Modal
                show={showFilterModal}
                onHide={() => setShowFilterModal(false)}
                centered
                size="md"
                animation={true}
                dialogClassName="modal-animated"
            >
                <Modal.Header className="bg-primary text-white">
                    <Modal.Title>
                        <FaFilter className="me-2 text-light" /> <span className="text-light">Filter Blogs</span>
                    </Modal.Title>
                    <CloseButton onClick={() => setShowFilterModal(false)} className="btn-close-white" />
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
                                title="Filter by blog status"
                            >
                                <option value="">All Status</option>
                                <option value="0">Inactive</option>
                                <option value="1">Active</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Created At</label>
                            <select
                                className="form-select form-select-sm shadow-sm"
                                value={param.createdAtRange}
                                onChange={(e) => setParam({ ...param, createdAtRange: e.target.value, createdAtStart: '', createdAtEnd: '' })}
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
                            {param.createdAtRange === 'custom' && (
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
                    </div>
                </Modal.Body>
                <Modal.Footer className="bg-light">
                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                            setParam({
                                ...param,
                                status: '',
                                createdAtRange: '',
                                createdAtStart: '',
                                createdAtEnd: '',
                                pageNo: 1
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
        </div >
    )
}

export default listBlog
