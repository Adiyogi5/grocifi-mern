import React, { useState, useEffect,useCallback } from 'react'
import * as Yup from "yup";
import { Modal, CloseButton } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getDeleteConfig, ucFirst } from '../../helper/StringHelper'
import AxiosHelper from '../../helper/AxiosHelper'
import MyFrom from '../../components/MyForm';
import Action from "../../components/Table/Action"
import Status from "../../components/Table/Status"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Link } from 'react-router-dom';
import PermissionBlock from '../../components/PermissionBlock';
import { STATUS} from '../../constant/fromConfig';
import useRowSelection from '../../helper/helperFunctions';
const MySwal = withReactContent(Swal)

const OurTeam = () => {
    const table = "ourteams"

    const [data, setData] = useState({ count: 0, record: [], totalPages: 0, pagination: [] });
    // *******************************************
    const [show, setShow] = useState(false);
    const [initialValues, setInitialValues] = useState({ name: '',designation:"", status: 1 })
    const [param, setParam] = useState({ limit: 10, pageNo: 1, query: "", orderBy: 'createdAt', orderDirection: -1 })
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formType, setFormType] = useState('add')
    const [errors, setErrors] = useState({ name: '', status: '' })


    const getDataForTable = useCallback(async () => {
        const { data } = await AxiosHelper.getData("ourteam-datatable", param);
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

    useEffect(() => { getDataForTable() }, [])

    // ********************************* For Add designation **************************************

    const validSchema = Yup.object().shape({
        name: Yup.string().min(2).max(50).required(),
        status: Yup.bool().required(),
    });

    const fields = [
        {
            label: "Name",
            name: "name",
            type: "text",
            col: 12
        },
        {
            label: "Designation",
            name: "designation",
            type: "text",
            col: 12
        },
        {
            label: "Image",
            name: "image",
            type: "file",
            col: 12
        },
        
        {
            label: "Status",
            name: "status",
            type: "select2",
            options:STATUS,
            col: 12
        },
        {
            label: "Submit",
            name: "submit",
            type: "submit",
        }
    ];

    // ********************************* For Edit Role **************************************

    const editData = async (event) => {
        var { id, name, image,designation, status } = JSON.parse(event.target.attributes.getNamedItem('main-data').value);
        setInitialValues({ id, name, image, designation, status });
        setErrors({ name: '', id: '' })
        setFormType('edit')
        setShow(true);
    }

    // ********************************* For Delete Role **************************************

    const deleteData = async (event) => {

        var { isConfirmed } = await MySwal.fire(getDeleteConfig({}))
        if (isConfirmed) {
            var { id } = JSON.parse(event.target.attributes.getNamedItem('main-data').value);
            var { data } = await AxiosHelper.deleteData(`delete-record/ourteams/${id}`);
            if (data?.status === true) {
                getDataForTable()
                toast.success(data?.message);
            } else {
                toast.error(data?.message);
            }
        }
    }


    const dropList = [
        {
            name: "Edit",
            module_id: "OurTeam",
            action:'edit',
            onClick: editData
        },
        {
            name: "Delete",
            module_id: "OurTeam",
            action:'delete',
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
        <>
            <div className="row" >
                <div className="col-md-12" >
                    <div className="card mb-3">
                        <div className="card-header">
                            <div className="row flex-between-end">
                                <div className="col-auto align-self-center">
                                    <h5 className="mb-0" data-anchor="data-anchor">
                                        Manage Our Team :: Our Team List
                                    </h5>
                                </div>
                                <div className="col-auto ms-auto">

                                    <div className="mt-2" role="tablist">
                                        <Link to={`admin/dashboard`} className="me-2 btn btn-sm btn-falcon-default">
                                            <i className="fa fa-home me-1"></i>
                                            <span className="d-none d-sm-inline-block ms-1">Dashboard</span>
                                        </Link>
                                        <PermissionBlock module={'OurTeam'}>
                                            <button onClick={() => {
                                                setInitialValues({ name:"", image:"",designation:"",status:"" })
                                                setErrors({ name: '', id: '' })
                                                setFormType('add')
                                                setShow(true)
                                            }} className="btn btn-sm btn-falcon-default">
                                                <i className="fa fa-plus me-1"></i>
                                                Add OurTeam
                                            </button>
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
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "name" && (param?.orderDirection === 1 ? 'asc' : 'desc')}`} data-sort="name">Name</th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "designation" && (param?.orderDirection === 1 ? 'asc' : 'desc')}`} data-sort="designation">Designation</th>
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
                                                            <td className="fw-bold"> <img src={row.image} data-dz-thumbnail="data-dz-thumbnail" alt="" width={100} /></td>
                                                            <td className="fw-bold " main-data={JSON.stringify(row)} >{row.name}</td>
                                                            <td>{row.designation}</td>
                                                            <td><Status table='ourteams' status={row.status} data_id={row._id} /></td>
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
            </div >
            <Modal size="md" show={show} fullscreen={false} onHide={() => setShow(false)} centered>
                <Modal.Header>
                    <Modal.Title>{ucFirst(formType)} Our Team</Modal.Title>
                    <CloseButton
                        className="btn btn-circle btn-sm transition-base p-0"
                        onClick={() => setShow(false)}
                    />
                </Modal.Header>
                <Modal.Body>
                    <MyFrom errors={errors} onSubmit={async (valuesData) => {
                        valuesData.status = Number(valuesData.status)
                        var data = "";
                        if (formType === 'add') {
                            data = await AxiosHelper.postData("ourteam/add", valuesData,true) ;
                        } else {
                            data = await AxiosHelper.putData(`ourteam/edit/${valuesData.id}`, valuesData, true);
                        }

                        if (data?.data?.status === true) {
                            getDataForTable()
                            setShow(false)
                            toast.success(data?.data?.message);
                        } else {
                            setErrors(data?.data?.data)
                            toast.error(data?.data?.message);
                        }
                        setIsSubmitted(false)

                    }} fields={fields} initialValues={initialValues} validSchema={validSchema} setIsSubmitted={setIsSubmitted} setInitialValues={setInitialValues} />
                </Modal.Body>
            </Modal>
        </>
    )
}

export default OurTeam