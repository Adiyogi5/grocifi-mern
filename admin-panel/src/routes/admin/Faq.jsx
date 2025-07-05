import React, { useState, useEffect,useCallback } from 'react'
import { toast } from 'react-toastify'
import * as Yup from "yup";
import { getDeleteConfig, formatDateDDMMYYYY, ucFirst} from '../../helper/StringHelper'
import AxiosHelper from '../../helper/AxiosHelper'
import MyFrom from '../../components/MyForm';
import Action from "../../components/Table/Action"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Link } from 'react-router-dom';
import Status from '../../components/Table/Status'
import { Modal,CloseButton } from 'react-bootstrap'
import { STATUS} from '../../constant/fromConfig';
import PermissionBlock from '../../components/PermissionBlock';
import {  fetchFaqCategories } from '../../helper/ApiService';
import useRowSelection from '../../helper/helperFunctions';


const MySwal = withReactContent(Swal)
// var adminPath = process.env.REACT_APP_ADMIN_ROUTE_PREFIX

const Faq = () => {
    const table = "faqs"

    const [data, setData] = useState({ count: 0, record: [], totalPages: 0, pagination: [] });
    const [param, setParam] = useState({ limit: 10, pageNo: 1, query: "", orderBy: 'createdAt', orderDirection: -1 })
    const [initialValues, setInitialValues] = useState({  faq_category_id :"",question:"", answer:"", status:"",createdAt:"" })
    const [errors, setErrors] = useState({ name: '', status: '' })
    const [show, setShow] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formType, setFormType] = useState('add')

    const getDataForTable = useCallback(async () => {
        const { data } = await AxiosHelper.getData("faq-datatable", param);
        if (data?.status === true) {
            let { count, totalPages, record, pagination } = data?.data
            setData({ count, totalPages, record, pagination })
        } else {
            toast.error(data?.message);
        }
    }, [param])

    const fetchData = useCallback(async () => {
        try {
            const [ fetchCategories ] = await Promise.all([
                fetchFaqCategories(),
            ]);
            setCategoryData(fetchCategories);
        } catch (error) {
            toast.error(error.message);
        }
    }, []);
    const handelSort = (event) => {
        var orderBy = event.target.attributes.getNamedItem('data-sort').value;
        if (param?.orderBy !== orderBy) {
            setParam({ ...param, orderBy })
        } else {
            setParam({ ...param, orderDirection: param?.orderDirection * -1 })
        }
    }

    const handelPageChange = (pageNo) => { setParam({ ...param, pageNo }) }

    useEffect(() => { fetchData() }, [fetchData]);
    useEffect(() => { getDataForTable() }, [])
    

   const validSchema = Yup.object().shape({
        question: Yup.string().required(),
        answer: Yup.string().required(),
        status: Yup.bool().required(),
    });
    const deleteData = async (event) => {

        var { isConfirmed } = await MySwal.fire(getDeleteConfig({}))
        if (isConfirmed) {
            var { id } = JSON.parse(event.target.attributes.getNamedItem('main-data').value);
            var { data } = await AxiosHelper.deleteData(`delete-record/faqs/${id}`);
            if (data?.status === true) {
                getDataForTable()
                toast.success(data?.message);
            } else {
                toast.error(data?.message);
            }
        }
    }

    const editData = async (event) => {
        var { id, question, faq_category_id, answer, status } = JSON.parse(event.target.attributes.getNamedItem('main-data').value);
        setInitialValues({ id, faq_category_id:faq_category_id._id,question, answer, status });
        setErrors({ name: '', id: '' })
        setFormType('edit')
        setShow(true);
    }
    
    const fields = [
        {
            label: "Category",
            name: "faq_category_id",
            type: "select2",
            options:categoryData,
            col: 12
        },
        {
            label: "Question",
            name: "question",
            type: "text",
            col: 12
        },
        {
            label: "Answer",
            name: "answer",
            type: "textarea",
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
    
    const dropList = [
        {
            name: "Edit",
            module_id: "Faq",
            action:'edit',
            onClick: editData
        },
        {
            name: "Delete",
            module_id: "Faq",
            action: "delete",
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
                                        Faq  :: Faq List
                                    </h5>
                                </div>
                                <div className="col-auto ms-auto">

                                    <div className="mt-2" role="tablist">
                                        <Link to={`admin/dashboard`} className="me-2 btn btn-sm btn-falcon-default">
                                            <i className="fa fa-home me-1"></i>
                                            <span className="d-none d-sm-inline-block ms-1">Dashboard</span>
                                        </Link>
                                        <PermissionBlock module={'Faq'}>
                                            <button onClick={() => {
                                                setInitialValues({  faq_category_id :"",question:"", answer:"", status:false })
                                                setErrors({ name: '', id: '' })
                                                setFormType('add')
                                                setShow(true)
                                            }} className="btn btn-sm btn-falcon-default">
                                                <i className="fa fa-plus me-1"></i>
                                                Add FAQ
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
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "faq_category_id" && (param?.orderDirection === 1 ? 'asc' : 'desc')}`} data-sort="faq_category_id">Category</th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "question" && (param?.orderDirection === 1 ? 'asc' : 'desc')}`} data-sort="question">Question</th>
                                                    <th onClick={handelSort} className={`sort ${param?.orderBy === "answer" && (param?.orderDirection === 1 ? 'asc' : 'desc')}`} data-sort="answer">Answer</th>
                                                    <th>Status</th>
                                                    <th>created At</th>
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
                                                            <td>{row.faq_category_id?.name}</td>
                                                            <td>{row.question}</td>
                                                            <td>{row.answer || ""}</td>
                                                            <td><Status table='faqs' status={row.status} data_id={row._id} /></td>
                                                            <td>{ formatDateDDMMYYYY(row.createdAt)}</td>                                                           
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
                    <Modal.Title>{ucFirst(formType)} Faq</Modal.Title>
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
                            data = await AxiosHelper.postData("faq/add", valuesData);
                        } else {
                            data = await AxiosHelper.putData(`faq/edit/${valuesData.id}`, valuesData);
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

export default Faq