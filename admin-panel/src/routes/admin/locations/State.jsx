import React, { useCallback, useEffect, useState } from 'react'
import AxiosHelper from '../../../helper/AxiosHelper';
import * as Yup from "yup";
import { Link} from 'react-router-dom';
import Status from '../../../components/Table/Status';
import { toast } from 'react-toastify';
import MyFrom from '../../../components/MyForm';
import Action from "../../../components/Table/Action"
import { ucFirst } from '../../../helper/StringHelper'
import { Modal, CloseButton } from 'react-bootstrap'

const State = () => {
   
    const [data, setData] = useState({ count: 0, record: [], totalPages: 0, pagination: [] });
    const [param, setParam] = useState({ limit: 10, pageNo: 1, query: "", orderBy: 'createdAt', orderDirection: -1 })
    const [show, setShow] = useState(false);
    const [showView, setShowView] = useState(false);
    const [formType, setFormType] = useState('add')
    const [errors, setErrors] = useState({ name: '', status: '' })
    const [initialValues, setInitialValues] = useState({ name: '', image:'',banner:'', title:'', description:'' })
    const [isSubmitted, setIsSubmitted] = useState(false);
    // get Table Data 
    const getDataForTable = useCallback(async () => {
        const { data } = await AxiosHelper.getData("state", param);
     
        if (data?.status === true) {
            let { count, totalPages, record, pagination } = data?.data
            setData({ count, totalPages, record, pagination })
        } else {
            toast.error(data?.message);
        }
    }, [param])

    const validSchema = Yup.object().shape({
        name: Yup.string().min(2).max(50).required(),
    });
    
    const handelSort = (event) => {
        var orderBy = event.target.attributes.getNamedItem('data-sort').value;
        if (param?.orderBy !== orderBy) {
            setParam({ ...param, orderBy })
        } else {
            setParam({ ...param, orderDirection: param?.orderDirection * -1 })
        }
    }

    const editData = async (event) => {
        var { id, name, image, title, banner,description, status } = JSON.parse(event.target.attributes.getNamedItem('main-data').value);
        setInitialValues({ id, name, title,banner, description, image, status });
        setErrors({ name: '', id: '' })
        setFormType('edit')
        setShow(true);
    }

    const viewData = async (event) => {
        var data = JSON.parse(event.target.attributes.getNamedItem('main-data').value);
        setInitialValues(data)
        setShowView(true)
    }

    const fields = [
        {
            label: "State Name",
            name: "name",
            type: "text",
            col: 12
        },
        {
            label: "Title",
            name: "title",
            type: "text",
            col: 12
        },
        {
            label: "Description",
            name: "description",
            type: "text-editer",
            col: 12
        },
        {
            label: "Image",
            name: "image",
            type: "file",
            col: 6
        },
        {
            label: "Banner",
            name: "banner",
            type: "file",
            col: 6
        },
        {
            label: "Submit",
            name: "submit",
            type: "submit",
        }
    ];
      
    const dropList = [
        {
            name: "View",
            module_id: "State",
            onClick: viewData
        },
        {
            name: "Edit",
            module_id: "State",
            action: "edit",
            onClick: editData
        },
    ]
    const handelPageChange = (pageNo) => { setParam({ ...param, pageNo }) }

    useEffect(() => { getDataForTable() }, [param])

    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-3">
                        <div className="card-header">
                            <div className="row flex-between-end">
                                <div className="col-auto align-self-center">
                                    <h5 className="mb-0" data-anchor="data-anchor">State</h5>
                                </div>
                                <div className="col-auto ms-auto">
                                    <div className="mt-2" role="tablist">
                                        <Link to={`/admin/dashboard`} className="me-2 btn btn-sm btn-falcon-default">
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
                                                    <th>Image</th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "name" && (param?.orderDirection === 1 ? 'asc' : 'desc')}`} data-sort="name">Name</th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "state_code" && (param?.orderDirection === 1 ? 'asc' : 'desc')}`} data-sort="state_code">State code</th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "country_name" && (param?.orderDirection === 1 ? 'asc' : 'desc')}`} data-sort="country_name">Country</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="list">
                                                {data?.record && data?.record.map((row, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td> <img src={row.image} data-dz-thumbnail="data-dz-thumbnail" alt="" width={100} /> </td>
                                                            <td className="fw-bold text-primary cursor-pointer" main-data={JSON.stringify(row)} onClick={viewData}>{row.name}</td>
                                                            <td>{row.state_code}</td>
                                                            <td>{row.country_name}</td>
                                                            <td><Status table='states' status={row.status} data_id={row._id} /></td>
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
                show={show}
                centered={true}
                onHide={() => setShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header>
                    <Modal.Title>{ucFirst(formType)} State</Modal.Title>
                    <CloseButton
                        className="btn btn-circle btn-sm transition-base p-0"
                        onClick={() => setShow(false)}
                    />
                </Modal.Header>
                <Modal.Body>
                    <MyFrom errors={errors} onSubmit={async (valuesData) => {
                        valuesData.status = Number(valuesData.status)
                        var data = await AxiosHelper.putData(`updateState/${valuesData.id}`, valuesData, true);

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
            <Modal
                size="lg"
                show={showView}
                centered={true}
                onHide={() => setShowView(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        View State
                    </Modal.Title>
                    <CloseButton onClick={() => setShowView(false)} />
                </Modal.Header>
                <Modal.Body>
                <ul className="list-group">
                    <li className="list-group-item text-center">
                        <img src={initialValues?.banner} alt="Thumbnail" className="img-fluid" width={250} />
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        <label className="fs--1 mb-0">Name</label>
                        <span className="fs--1 text-muted">{initialValues?.name} </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        <label className="fs--1 mb-0">Country name</label>
                        <span className="fs--1">{initialValues?.country_name}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        <label className="fs--1 mb-0"> Title </label>
                        <span className="fs--1 text-muted ps-3">{initialValues?.title}</span>
                    </li>
                   
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        <label className="fs--1 mb-0"> image </label>
                        <img src={initialValues?.image} alt="Thumbnail" className="img-fluid" width={100} />
                        {/* <span className="fs--1 text-muted ps-3">{initialValues?.image}</span> */}
                    </li>
                 
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        <label className="fs--1 mb-0">Status</label>
                        <Status table='users' status={initialValues.status} data_id={initialValues._id} />
                    </li>
                </ul>
                </Modal.Body>
            </Modal>
        </div >
    )
}

export default State
