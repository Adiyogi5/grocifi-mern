import React, { useState, useCallback,useEffect } from 'react'
import MyForm from '../../../components/MyForm'
import * as Yup from "yup";
import { toast } from 'react-toastify';
import AxiosHelper from '../../../helper/AxiosHelper';
import { FILE_SIZE,SUPPORTED_FORMATS_IMAGE,STATUS,GENDER } from '../../../constant/fromConfig';
import { Link, useNavigate } from 'react-router-dom';


const addUser = () => {
    const navigate = useNavigate()
    const [errors, setErrors] = useState({ name: '', status: '' })
    const initialValues = {
        slug:"",
        name: "",
        email: "",
        dateOfBirth: "",
        mobile: "",
        whatsapp_number: "",
        profile:"",
        gender:"",
        password:"",
        confirm_passowrd:"",
        address:"",
        status: "",
        createdAt: "",
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required').min(2, ' Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
        profile: Yup.mixed()
            .test("fileSize", "File too large", (value) => {
                if (value && (typeof value) !== 'string') return value.size <= FILE_SIZE;
                return true;
            }),
        // roleId: Yup.string().required('Name is required').min(2, 'First Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'), 
        mobile: Yup.number().required('Mobile number is required'), 
        gender: Yup.string().required('Gender is required'), 
        email: Yup.string().email().required('Email is required'), 
        // passowrd: Yup.string().required('Password is required').min(6, 'Password  must be at least 6 characters').max(16, 'Password must be less than 16 characters'), 
        // confirm_passowrd: Yup.string().required('Password is required').oneOf([Yup.ref('password'), null], 'Passwords must match'),
        // status: Yup.boolean().required('Status is required'),
    });

    const fields = [
        {
            label: "Name",
            name: "name",
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
            label: "Whatsapp Number",
            name: "whatsapp_number",
            type: "text",
            col: 6
        },
        {
            label: "Date Of Birth",
            name: "dateOfBirth",
            type: "date",
            col: 6
        },
        {
            label: "Gendar",
            name: "gender",
            type: "select2",
            options:GENDER,
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
            label: "Status",
            name: "status",
            type: "select2",
            options: STATUS,
            col: 6
        },
        {
            label: "Profile Image",
            name: "profile",
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
                                    <h5 className="mb-0" data-anchor="data-anchor">Add Customer</h5>
                                </div>
                                <div className="col-auto ms-auto">
                                    <Link to={`/admin/customer`}>
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
                                data = await AxiosHelper.postData("user/add", values, true);
                                if (data?.data?.status === true) {
                                    toast.success(data?.data?.message);
                                    navigate('/admin/customer')
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

export default addUser
