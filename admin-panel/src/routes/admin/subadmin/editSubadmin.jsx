import React, { useState, useCallback,useEffect } from 'react'
import MyForm from '../../../components/MyForm'
import * as Yup from "yup";
import { toast } from 'react-toastify';
import AxiosHelper from '../../../helper/AxiosHelper';
import { FILE_SIZE,SUPPORTED_FORMATS_IMAGE,STATUS } from '../../../constant/fromConfig';
import { Link, useNavigate,useParams } from 'react-router-dom';


const editSubadmin = () => {
    const navigate = useNavigate()
    const [errors, setErrors] = useState({ name: '', status: '' })
    const [roleData, setroleData] = useState([]);
    const { id } = useParams();
  
     const [initialValues, setInitialValues] = useState({
            name:"",
            firstName: "",
            lastName: "",
            email: "",
            roleId: "",
            mobile: "",
            image:"",
            password:"",
            status: 1,
        });


    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('Name is required').min(2, 'First Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
        image: Yup.mixed()
            .test("fileSize", "File too large", (value) => {
                if (value && (typeof value) !== 'string') return value.size <= FILE_SIZE;
                return true;
            }),
        mobile: Yup.string().min(10, 'Mobile Number must be 10 characters').max(10, 'Mobile Number must be 10 characters').required('Mobile is required'), 
        roleId: Yup.string().required('Role is required'), 
        email: Yup.string().email().required('Email is required'), 
        // status: Yup.boolean().required('Status is required'),
    });

    const fetchUserData = useCallback(async () => {
        try {
            const { data } = await AxiosHelper.getData(`subadmin/${id}`);

            if (data?.status === true) {
                let response  = data.data
               
                setInitialValues({
                    id: response._id || '',
                    firstName: response?.firstName||"",
                    lastName: response?.lastName||"",
                    email: response.email,
                    roleId: response.roleId,
                    mobile: response.mobile,
                    image:response.image,
                    password:"",
                    status: response.status,
                })
                
                // setInitialValues(data?.data);
            } else {
                toast.error(data?.message);
                navigate('/admin/subadmin');
            }
        } catch (error) {
            console.error("Error fetching User data:", error);
        }
    }, [id, navigate]);
   
    const getRoleData = useCallback(async () => {
        const { data } = await AxiosHelper.getData("role");
        if (data?.status === true) {
            setroleData(data?.data);
        }
    }, []);

    
    useEffect(() => { getRoleData() }, [])
    useEffect(() => {
        fetchUserData();
        }, [fetchUserData]);
   
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
                                    <h5 className="mb-0" data-anchor="data-anchor">Edit Sub-Admin</h5>
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
                            
                                // data = await AxiosHelper.putData(`user/edit/${values.id}`, values, true);
                                const data = await AxiosHelper.putData(`subadmin/edit/${values.id}`, values,true);
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

export default editSubadmin
