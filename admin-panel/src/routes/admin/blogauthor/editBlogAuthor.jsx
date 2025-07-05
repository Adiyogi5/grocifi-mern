import React, { useState, useCallback,useEffect } from 'react'
import MyForm from '../../../components/MyForm'
import * as Yup from "yup";
import { toast } from 'react-toastify';
import AxiosHelper from '../../../helper/AxiosHelper';
import { FILE_SIZE,SUPPORTED_FORMATS_IMAGE,STATUS,ISFEATURE } from '../../../constant/fromConfig';
import { Link, useNavigate,useParams } from 'react-router-dom';

import { fetchBusiness, fetchDesignation ,fetchBlogAutherBySlug} from '../../../helper/ApiService';
const editBlogAuthor = () => {
    const navigate = useNavigate()
    const { slug } = useParams();
    const [errors, setErrors] = useState({ name: '', status: '' })
    const [designationData, setDesignationData] = useState([]);
    const [businessData, setbusinessData] = useState([]);
    const [initialValues, setInitialValues] = useState({
        author_name         : "",
        about_author        : "",
        designation_id      : "",
        business_id         : "",
        youtube_url         : "",
        facebook_url        : "",
        linkedin_url        : "",
        instagram_url       : "",
        x_url               : "",
        status              : "",
    });
 
    const validationSchema = Yup.object().shape({
        author_name : Yup.string().required('Author Name is required').min(2, 'Author Name must be at least 2 characters').max(100, 'Author Name must be less than 50 characters'),
        about_author : Yup.string().required('About Author is required'),
        image: Yup.mixed()
            .test("fileSize", "File too large", (value) => {
                if (value && (typeof value) !== 'string') return value.size <= FILE_SIZE;
                return true;
            }),
        business_id: Yup.string().required('Business is required'), 
        designation_id: Yup.string().required('Designation is required'), 
        status: Yup.boolean().required('Status is required'),
    });

   
    const fetchData = useCallback(async () => {
        try {
            const [blogauthor, business, designation] = await Promise.all([
                fetchBlogAutherBySlug(slug),
                fetchBusiness(),
                fetchDesignation(),
            ]);
            if (blogauthor?.status === true) {
                setInitialValues(blogauthor.data);
                setDesignationData(designation.data);
                setbusinessData(business.data);
            }else{
                //  navigate('/admin/business');
                toast.error(blogauthor?.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, [slug]);

  
    useEffect(() => { fetchData() }, [fetchData]);

     const fields = [
        {
            label: "Author Name",
            name: "author_name",
            type: "text",
            col: 6
        },
        {
            label: "Designation",
            name: "designation_id",
            type: "select2",
            options: designationData,
            col: 6
        },
        {
            label: "About Author",
            name: "about_author",
            type: "textarea",
            col: 12
        },
        {
            label: "Business",
            name: "business_id",
            type: "select2",
            options: businessData,
            col: 6
        },     
        {
            label: "Youtube URL",
            name: "youtube_url",
            type: "text",
            col: 6
        },
        {
            label: "Facebook URL",
            name: "facebook_url",
            type: "text",
            col: 6
        },
        {
            label: "Linkedin URL",
            name: "linkedin_url",
            type: "text",
            col: 6
        },
        {
            label: "Instagram URL",
            name: "instagram_url",
            type: "text",
            col: 6
        },
        {
            label: "X URL",
            name: "x_url",
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
            label: "Image",
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
                                    <h5 className="mb-0" data-anchor="data-anchor">Edit Blog Author</h5>
                                </div>
                                <div className="col-auto ms-auto">
                                    <Link to={`/admin/blogauthor`}>
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
                                const data = await AxiosHelper.putData(`blogauthor/edit/${values.id}`, values,true);
                                if (data?.data?.status === true) {
                                    toast.success(data?.data?.message);
                                    navigate('/admin/blogauthor')
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

export default editBlogAuthor
