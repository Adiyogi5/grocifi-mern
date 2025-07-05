import React, { useState, useCallback,useEffect } from 'react'
import MyForm from '../../../components/MyForm'
import * as Yup from "yup";
import { formatDateYYMMDD } from '../../../helper/StringHelper';
import { toast } from 'react-toastify';
import AxiosHelper from '../../../helper/AxiosHelper';
import { FILE_SIZE,SUPPORTED_FORMATS_IMAGE,STATUS,GENDER } from '../../../constant/fromConfig';
import { Link, useNavigate,useParams } from 'react-router-dom';
import useOnlineStatus from "../../../customhook/useOnlineStatus";

const editUser = () => {
    const navigate = useNavigate()
    const [errors, setErrors] = useState({ name: '', status: '' })
    const [userid, setUserId] = useState(null)
    const isOnline = useOnlineStatus(userid)
   
    const { slug } = useParams();

     const [initialValues, setInitialValues] = useState({
            name: "",
            email: "",
            dateOfBirth: "",
            mobile: "",
            whatsapp_number: "",
            profile:"",
            gender:"",
            address:"",
            password:"",
            status: "",
            createdAt: "",
            social_profile: {
                facebook: "",
                youtube: "",
                instagram: "",
                x: "",
                linkedin: "",
            },
        });


    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters').max(50, 'must be less than 50 characters'),
        profile: Yup.mixed()
            .test("fileSize", "File too large", (value) => {
                if (value && (typeof value) !== 'string') return value.size <= FILE_SIZE;
                return true;
            }),
        // mobile: Yup.number().required('Mobile number is required').min(10, 'Mobile number must be at least 10 characters').max(10, 'Mobile number must be less than 10 characters'), 
        gender: Yup.string().required('Gender is required'), 
        email: Yup.string().email().required('Email is required'), 
        mobile: Yup.number().required('Mobile number is required'), 
        // status: Yup.boolean().required('Status is required'),
    });

    const fetchUserData = useCallback(async () => {
        try {
            const { data } = await AxiosHelper.getData(`user/slug/${slug}`);

            if (data?.status === true) {
                let response  = data.data
                setInitialValues({
                    id: response._id || '',
                    name: response.name,
                    email: response.email,
                    dateOfBirth:formatDateYYMMDD(response.dateOfBirth),
                    mobile: response.mobile,
                    whatsapp_number: response.whatsapp_number,
                    profile:response.profile,
                    password:"",
                    gender:response.gender,
                    address:response.address,
                    status: response.status,
                    social_profile:response.social_profile
                })
                setUserId(response._id)
            } else {
                toast.error(data?.message);
                navigate('/admin/user');
            }
        } catch (error) {
            toast.error(error);
        }
    }, [slug, navigate]);
   

   
   
    useEffect(() => {
        fetchUserData();
        }, [fetchUserData]);

 
   
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
            label: "Website URL",
            name: "social_profile.website",
            type: "text",
            col: 4,
        },
        {
            label: "Facebook",
            name: "social_profile.facebook",
            type: "text",
            col: 4,
        },
        {
            label: "Linkedin",
            name: "social_profile.linkedin",
            type: "text",
            col: 4,
        },
        {
            label: "Instagram",
            name: "social_profile.instagram",
            type: "text",
            col: 4,
        },
        {
            label: "Youtube",
            name: "social_profile.youtube",
            type: "text",
            col: 4,
        },
        {
            label: "X",
            name: "social_profile.x",
            type: "text",
            col: 4,
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
                                    <h5 className="mb-0" data-anchor="data-anchor">Edit Customer  {isOnline ? <i className="fa fa-circle text-success"/> : <i className="fa fa-circle text-danger"/>}</h5>
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
                            
                                // data = await AxiosHelper.putData(`user/edit/${values.id}`, values, true);
                                const data = await AxiosHelper.putData(`user/edit/${values.id}`, values,true);
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

export default editUser
