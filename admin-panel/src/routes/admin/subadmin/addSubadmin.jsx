import React, { useState, useCallback,useEffect } from 'react'
import MyForm from '../../../components/MyForm'
import * as Yup from "yup";
import { toast } from 'react-toastify';
import AxiosHelper from '../../../helper/AxiosHelper';
import { FILE_SIZE,SUPPORTED_FORMATS_IMAGE,STATUS,GENDER } from '../../../constant/fromConfig';
import { Link, useNavigate } from 'react-router-dom';


const addSubadmin = () => {
    const navigate = useNavigate()
    const [errors, setErrors] = useState({ name: '', status: '' })
    const [roleData, setroleData] = useState([]);
    const initialValues = {
        firstName: "",
        lastName: "",
        email: "",
        roleId: "",
        mobile: "",
        image:"",
        password:"",
        confirm_passowrd:"",
        status: "",
        createdAt: "",
    };

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('Name is required').min(2, 'First Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
        image: Yup.mixed()
            .test("fileSize", "File too large", (value) => {
                if (value && (typeof value) !== 'string') return value.size <= FILE_SIZE;
                return true;
            }),
        roleId: Yup.string().required('Role is required'),
        email: Yup.string().email().required('Email is required'), 
        mobile: Yup.string().min(10, 'Mobile Number must be 10 characters').max(10, 'Mobile Number must be 10 characters').required('Mobile is required'), 
        // passowrd: Yup.string().required('Password is required').min(6, 'Password  must be at least 6 characters').max(16, 'Password must be less than 16 characters'), 
        // confirm_passowrd: Yup.string().required('Password is required').oneOf([Yup.ref('password'), null], 'Passwords must match'),
        // status: Yup.boolean().required('Status is required'),
    });


    const getRoleData = useCallback(async () => {
        const data = await AxiosHelper.getData("role");
        if (data?.data?.status === true) {
            setroleData(data?.data.data);
        }
    }, []);

    useEffect(() => { getRoleData() }, [])
   
    const fields = [
        {
            label: "First Name",
            name: "firstName",
            type: "text",
            col: 6
        },
        {
            label: "Last Name",
            name: "lastName",
            type: "text",
            col: 6
        },
        {
            label: "Email",
            name: "email",
            type: "text",
            col: 6
        },
        {
            label: "Mobile",
            name: "mobile",
            type: "text",
            col: 6
        },
       
        {
            label: "Role",
            name: "roleId",
            type: "select2",
            options:roleData,
            col: 6
        },
        {
            label: "Status",
            name: "status",
            type: "select2",
            options: STATUS,
            col: 6
        },
        {
            label: "Password",
            name: "password",
            type: "text",
            col: 6
        },
        {
            label: "Confirm Passowrd",
            name: "confirm_passowrd",
            type: "text",
            col: 6
        },
        {
            label: "Profile Image",
            name: "image",
            type: "file",
            col: 6
        },
        {
            label: "Submit",
            name: "submit",
            type: "submit",
        }
    ];

    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-3">
                        <div className="card-header">
                            <div className="row flex-between-end">
                                <div className="col-auto align-self-center">
                                    <h5 className="mb-0" data-anchor="data-anchor">Add Sub-Admin</h5>
                                </div>
                                <div className="col-auto ms-auto">
                                    <Link to={`/admin/subadmin`}>
                                        <button className="btn btn-sm btn-falcon-default">
                                            <i className="fa fa-arrow-left me-2"></i>
                                            Go Back
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className='card-body'>
                            <MyForm errors={errors} fields={fields} initialValues={initialValues} validSchema={validationSchema} onSubmit={async (values) => {
                                var data = "";
                                data = await AxiosHelper.postData("subadmin/add", values, true);
                                if (data?.data?.status === true) {
                                    toast.success(data?.data?.message);
                                    navigate('/admin/subadmin')
                                } else {
                                    setErrors(data?.data?.data)
                                    toast.error(data?.data?.message);
                                }
                            }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default addSubadmin
