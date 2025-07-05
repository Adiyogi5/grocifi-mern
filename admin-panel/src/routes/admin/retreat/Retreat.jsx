import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import AxiosHelper from '../../../helper/AxiosHelper';
import Swal from 'sweetalert2'
import { formatDateDDMMYYYY, getDeleteConfig } from '../../../helper/StringHelper';
import Status from '../../../components/Table/Status';
import Action from '../../../components/Table/Action';
import { CloseButton, Modal } from 'react-bootstrap';
import { CONFIG_GST } from '../../../constant/fromConfig';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal)

const Retreat = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({ count: 0, record: [], totalPages: 0, pagination: [] });
    const [showView, setShowView] = useState(false);
    const [param, setParam] = useState({ limit: 10, pageNo: 1, query: "", orderBy: 'createdAt', orderDirection: -1 })
    const [initialValues, setInitialValues] = useState({
        name: "",
        short_description: "",
        location: "",
        access: "",
        check_in: "",
        check_out: "",
        image: "",
        itinerary: "",
        status: "",
        booked: "",
        maximum_bookings: "",
        prices: [
            {
                occupancy_type: 1,
                currency: 1,
                amount: "",
            },
            {
                occupancy_type: 2,
                currency: 1,
                amount: "",
            },
            {
                occupancy_type: 3,
                currency: 1,
                amount: "",
            },
            {
                occupancy_type: 1,
                currency: 2,
                amount: "",
            },
            {
                occupancy_type: 2,
                currency: 2,
                amount: "",
            },
            {
                occupancy_type: 3,
                currency: 2,
                amount: "",
            }
        ],

        details: "",
    });

    // ********************************* For Getting Data **************************************

    // get Table Data 
    const getDataForTable = useCallback(async () => {
        const { data } = await AxiosHelper.getData("/retreat-datatable", param);
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
            var { data } = await AxiosHelper.deleteData(`delete-record/retreats/${id}`);
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
            onClick: viewData
        },
        {
            name: "Edit",
            onClick: (event) => {
                var data = JSON.parse(event.target.attributes.getNamedItem('main-data').value);
                navigate(`/admin/retreat/edit/${data.slug}`)
            }
        },
        {
            name: "Delete",
            onClick: deleteData,
            className: "text-danger"
        },
    ]
    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-3">
                        <div className="card-header">
                            <div className="row flex-between-end">
                                <div className="col-auto align-self-center">
                                    <h5 className="mb-0" data-anchor="data-anchor">Retreate</h5>
                                </div>
                                <div className="col-auto ms-auto">
                                    <div className="mt-2" role="tablist">
                                        <Link to={`/admin/dashboard`} className="me-2 btn btn-sm btn-falcon-default">
                                            <i className="fa fa-home me-1"></i>
                                            <span className="d-none d-sm-inline-block ms-1">Dashboard</span>
                                        </Link>
                                        <Link to={`/admin/retreat/add`}>
                                            <button className="btn btn-sm btn-falcon-default">
                                                <i className="fa fa-plus me-1"></i>
                                                Add Retreate
                                            </button>
                                        </Link>
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

                            <div className="tab-content">
                                <div id="tableExample2" data-list="">
                                    <div className="table-responsive1 ">
                                        <table className="table table-bordered table-striped fs--1 mb-0">
                                            <thead className="bg-200 text-900">
                                                <tr>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "name" && (param?.orderDirection === 1 ? 'asc' : 'desc')}`} data-sort="name">Name</th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "short_description" && (param?.orderDirection === 1 ? 'asc' : 'desc')}`} data-sort="short_description">short_description</th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "check_in" && (param?.orderDirection === 1 ? 'asc' : 'desc')}`} data-sort="check_in">Check In</th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "check_out" && (param?.orderDirection === 1 ? 'asc' : 'desc')}`} data-sort="check_out">Check Out</th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "booked" && (param?.orderDirection === 1 ? 'asc' : 'desc')}`} data-sort="booked">Booked</th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "createdAt" && (param?.orderDirection === 1 ? 'asc' : 'desc')}`} data-sort="createdAt">Created Date</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="list">
                                                {data?.record && data?.record.map((row, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td className="fw-bold text-primary cursor-pointer" main-data={JSON.stringify(row)} onClick={viewData}>{row.name}</td>
                                                            <td>{row.short_description}</td>
                                                            <td>{formatDateDDMMYYYY(row.check_in)}</td>
                                                            <td>{formatDateDDMMYYYY(row.check_out)}</td>
                                                            <td>{formatDateDDMMYYYY(row.createdAt)}</td>
                                                            <td>{row.booked}</td>
                                                            <td><Status table='retreats' status={row.status} data_id={row._id} /></td>
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
                        View Coupon
                    </Modal.Title>
                    <CloseButton onClick={() => setShowView(false)} />
                </Modal.Header>
                <Modal.Body>
                    <ul className="list-group">
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <label className='fs--1 m-0'>Name</label>
                            <span className="fs--1">{initialValues?.name}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <label className='fs--1 m-0'>Short Description</label>
                            <span className="fs--1 ps-5 text-center">{initialValues?.short_description}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <label className='fs--1 m-0'>Status</label>
                            <span className="fs--1">{initialValues?.status === 1 ? `Sold Out` : initialValues?.status === 2 ? `Past` : `Book Now`}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <label className='fs--1 m-0'>Location</label>
                            <span className="fs--1 ps-5 text-center">{initialValues?.location}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <label className='fs--1 m-0'>Access</label>
                            <span className="fs--1 ps-5 text-center">{initialValues?.access}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <label className='fs--1 m-0'>Check In</label>
                            <span className="fs--1">{formatDateDDMMYYYY(initialValues?.check_in)}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <label className='fs--1 m-0'>Check Out</label>
                            <span className="fs--1">{formatDateDDMMYYYY(initialValues?.check_out)}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <label className='fs--1 m-0'>Maximum Booked</label>
                            <span className="fs--1">{initialValues?.maximum_bookings}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <label className='fs--1 m-0'>Booked</label>
                            <span className="fs--1">{initialValues?.booked}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <label className='fs--1 m-0'>Retreat Created Date</label>
                            <span className="fs--1">{formatDateDDMMYYYY(initialValues?.createdAt)}</span>
                        </li>
                        <li className="list-group-item d-flex flex-column justify-content-start align-items-start">
                            <h5>Price:</h5>
                            <div className='w-100 px-2'>
                                <h6 className='text-decoration-underline mb-0'>Indian Nationals:</h6>
                                {initialValues?.prices && Array.isArray(initialValues?.prices) ? (
                                    initialValues?.prices.map((price, index) => (
                                        <div key={index} className='d-flex justify-content-between align-items-center w-100'>
                                            <label className='fs--1 m-0'>{price.occupancy_type == 1 && price.currency == 1 ? 'Single Occupancy:' : price.occupancy_type == 2 && price.currency == 1 ? 'Double Occupancy:' : price.occupancy_type == 3 && price.currency == 1 ? 'Triple Occupancy:' : ''} </label>
                                            <span className="fs--1">{price.currency === 1 ? `${price.amount} Rs + ${CONFIG_GST}% GST` : ''}</span>
                                        </div>
                                    ))
                                ) : (<></>)}
                                <h6 className='text-decoration-underline mt-2 mb-0'>Foreign Nationals:</h6>
                                {initialValues?.prices && Array.isArray(initialValues?.prices) ? (
                                    initialValues?.prices.map((price, index) => (
                                        <div key={index} className='d-flex justify-content-between align-items-center w-100'>
                                            <label className='fs--1 m-0'>{price.occupancy_type == 1 && price.currency == 2 ? 'Single Occupancy:' : price.occupancy_type == 2 && price.currency == 2 ? 'Double Occupancy:' : price.occupancy_type == 3 && price.currency == 2 ? 'Triple Occupancy:' : ''} </label>
                                            <span className="fs--1">{price.currency === 2 ? `${price.amount} USD + ${CONFIG_GST}% GST` : ''}</span>
                                        </div>
                                    ))
                                ) : (<></>)}
                            </div>
                        </li>
                    </ul>
                </Modal.Body>
            </Modal>
        </div >
    )
}

export default Retreat
