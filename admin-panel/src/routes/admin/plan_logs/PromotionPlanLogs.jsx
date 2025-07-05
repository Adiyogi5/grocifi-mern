import React, { useState, useEffect, useCallback } from 'react'

import { toast } from 'react-toastify'
import { formatDateDDMMYYYY, ucFirst, } from '../../../helper/StringHelper'
import AxiosHelper from '../../../helper/AxiosHelper'
import { Link, useNavigate } from 'react-router-dom';

import PlanStatus from '../../../components/Table/PlanStatus';
import Action from '../../../components/Table/Action';

const PromotionPlanLogs = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({ count: 0, record: [], totalPages: 0, pagination: [] });
    const [param, setParam] = useState({ limit: 10, pageNo: 1, query: "", orderBy: 'createdAt', orderDirection: -1 })


    const getDataForTable = useCallback(async () => {
        const { data } = await AxiosHelper.getData("log-user-promotion-purchases", param);
        
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

        navigate(`/admin/promotion-view/${data._id}`)
    }

    const dropList = [
        {
            name: "View",
            module_id: "PromotionPlan",
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
                                        Manage Promotion Plan Logs : : Promotion Plan Logs
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
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "userName" && (param?.orderDirection === 1 ? 'asc' : 'desc')}`} data-sort="userName">Customer</th>
                                                    <th>Plan Name</th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "ads_title" && (param?.orderDirection === 1 ? 'asc' : 'desc')}`} data-sort="ads_title"> Plan For </th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "expiry_date" && (param?.orderDirection === 1 ? 'asc' : 'desc')}`} data-sort="expiry_date">Plan Duration</th>
                                                    <th>Payment Status</th>
                                                    <th>Purchase Status</th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "createdAt" && (param?.orderDirection === 1 ? 'asc' : 'desc')}`} data-sort="createdAt">CreatedAt</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="list">
                                                {data?.record && data?.record?.map((row, i) => {

                                                    return (
                                                        <tr key={i}>
                                                            <td onClick={viewData} className="fw-bold text-primary cursor-pointer" main-data={JSON.stringify(row)}>{ ucFirst(row?.userName)}</td>
                                                            <td className='fw-bold'>{row?.planName} <br />
                                                                <PlanStatus data={row} />
                                                            </td>
                                                            <td className='fw-bold'>
                                                                <div>{row?.ads_title} </div>
                                                                <span className={`badge ${row?.promotionFor === 'business'
                                                                    ? 'badge-soft-warning'
                                                                    : 'badge-soft-info'}`}>
                                                                    { ucFirst(row?.promotionFor)}
                                                                </span>
                                                            </td>
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
                                                                        <div className="badge bg-danger  mt-1" style={{ fontSize: '12px', padding: '6px 12px' }}>
                                                                            {formatDateDDMMYYYY(row?.expiry_date)}
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
                                                                <span className={`fs13 badge ${row.status === 1
                                                                    ? 'badge-soft-success'
                                                                    : 'badge-soft-warning'}`}>
                                                                    {row.status === 1 ? 'Success' : 'Pending'}
                                                                </span>
                                                            </td>
                                                            <td>{formatDateDDMMYYYY(row?.createdAt)}</td>
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

export default PromotionPlanLogs