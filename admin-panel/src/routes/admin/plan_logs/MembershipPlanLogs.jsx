import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { formatDateDDMMYYYY, } from '../../../helper/StringHelper'
import AxiosHelper from '../../../helper/AxiosHelper'
import { Link, useNavigate } from 'react-router-dom';
import PlanStatus from '../../../components/Table/PlanStatus'
import {CURRENCY } from '../../../constant/fromConfig';
import Action from '../../../components/Table/Action';

const MembershipPlanLogs = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({ count: 0, record: [], totalPages: 0, pagination: [] });
    const [param, setParam] = useState({ limit: 10, pageNo: 1, query: "", orderBy: 'createdAt', orderDirection: -1 })

    const getDataForTable = useCallback(async () => {
        const { data } = await AxiosHelper.getData("log-userplan-purchases", param);
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

    const viewData = async (event) => {
        var data = JSON.parse(event.target.attributes.getNamedItem('main-data').value);
  
        navigate(`/admin/membership-view/${data._id}`)
    }

    const dropList = [
        {
            name: "View",
            module_id: "MamberShipPlan",
            onClick: viewData
        },
    ]

    useEffect(() => { getDataForTable() }, [param])

    return (
        <>
            <div className="row" >
                <div className="col-md-12" >
                    <div className="card mb-3">
                        <div className="card-header">
                            <div className="row flex-between-end">
                                <div className="col-auto align-self-center">
                                    <h5 className="mb-0" data-anchor="data-anchor">
                                        Manage Membership Plan Logs : : Membership Plan Logs
                                    </h5>
                                </div>
                                <div className="col-auto ms-auto">

                                    <div className="mt-2" role="tablist">
                                        <Link to={`admin/dashboard`} className="me-2 btn btn-sm btn-falcon-default">
                                            <i className="fa fa-home me-1"></i>
                                            <span className="d-none d-sm-inline-block ms-1">Dashboard</span>
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
                                                    <th>Plan Name</th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "userName" && (param?.orderDirection === 1 ? 'asc' : 'desc')}`} data-sort="userName">Customer</th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "expiry_date" && (param?.orderDirection === 1 ? 'asc' : 'desc')}`} data-sort="expiry_date">Plan Duration</th>
                                                    <th>Plan Detail</th>
                                                    <th>Payment Status</th>
                                                    <th>Purchase Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="list">
                                                {data?.record && data?.record?.map((row, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td className="fw-bold text-primary cursor-pointer" onClick={viewData} main-data={JSON.stringify(row)}>{row?.planName} <br/>
                                                                <PlanStatus data={row}/> 
                                                            </td>
                                                            <td className='fw-bold'>{row.userName}</td>
                                                            <td>
                                                                <div className="p-1 border rounded shadow-sm bg-light">
                                                                    <div className="d-flex justify-content-between ">
                                                                        <span className="fw-bold text-secondary me-1">📅 Purchase Date </span>
                                                                        <div className="badge bg-primary mt-1" style={{ fontSize: '12px', padding: '6px 12px' }}>
                                                                            {formatDateDDMMYYYY(row?.purchase_date)}
                                                                        </div>
                                                                    </div>
                                                                    <div className="d-flex justify-content-between">
                                                                        <span className="fw-bold text-secondary me-1">⏳ Expire Date</span>
                                                                        <div className="badge bg-danger text-white mt-1" style={{ fontSize: '12px', padding: '6px 12px' }}>
                                                                            {formatDateDDMMYYYY(row?.expiry_date)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="p-2 border rounded shadow-sm  gap-1 bg-light d-flex justify-content-between align-items-center mt-2">
                                                                    <div className="d-flex flex-column align-items-center">
                                                                        <span className="fw-bold"> Price:</span>
                                                                        <span className="badge bg-primary fs13" > {CURRENCY+ ' '  + row?.plan_price}</span>
                                                                    </div>
                                                                    <div className="d-flex flex-column align-items-center">
                                                                        <span className="fw-bold"> Duration:</span>
                                                                        <span className="badge bg-warning fs13" > {row?.plan_duration} Days</span>
                                                                    </div>
                                                                    <div className="d-flex flex-column align-items-center">
                                                                        <span className="fw-bold"> Balance:</span>
                                                                        <div className="d-flex align-items-center">
                                                                            <span className="badge bg-dark me-2 fs13" >{row?.ads_balance} Ads </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className={`fs13 badge ${row.paymentStatus === 'success' 
                                                                    ? 'badge-soft-info' 
                                                                    : 'badge-soft-danger'}`}>
                                                                    {row.paymentStatus === 'success' ? 'Paid' : 'Pending'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span
                                                                    className={`fs13 badge ${
                                                                        row.status === 1
                                                                        ? 'badge-soft-success'
                                                                        : row.status === 0
                                                                        ? 'badge-soft-warning'
                                                                        : row.status === -1
                                                                        ? 'badge-soft-danger'
                                                                        : row.status === 2
                                                                        ? 'badge-soft-info'
                                                                        : ''
                                                                    }`}
                                                                    >
                                                                    {row.status === 1
                                                                        ? 'Active'
                                                                        : row.status === 0
                                                                        ? 'Pending'
                                                                        : row.status === -1
                                                                        ? 'Expired'
                                                                        : row.status === 2
                                                                        ? 'Featured'
                                                                        : 'Unknown'}
                                                                    </span>
                                                            </td>
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
                                                {data?.pagination.map((row) => {
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
            </div >
          
        </>
    )
}

export default MembershipPlanLogs