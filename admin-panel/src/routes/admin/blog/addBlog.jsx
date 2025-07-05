import React, { useState, useCallback,useEffect } from 'react'
import MyForm from '../../../components/MyForm'
import * as Yup from "yup";
import { toast } from 'react-toastify';
import AxiosHelper from '../../../helper/AxiosHelper';
import { FILE_SIZE,SUPPORTED_FORMATS_IMAGE,STATUS } from '../../../constant/fromConfig';
import { Link, useNavigate } from 'react-router-dom';
import {  fetchBlogAuthor, fetchCategories} from '../../../helper/ApiService';

const addBlog = () => {
    const navigate = useNavigate()
    const [errors, setErrors] = useState({ name: '', status: '' })
    const [authorData, setAuthorData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);

    const initialValues = {
        title                   : "",
        sort_description        : "",
        content                 : "",
        read_time               : "",
        tags                    : "",
        author_id               : "",
        category_id             : "",
        status                  : "",
        image                   : "",
    };

    const validationSchema = Yup.object().shape({
        title : Yup.string().required('Title is required').min(2, 'Title must be at least 2 characters').max(100, 'Name must be less than 50 characters'),
        sort_description : Yup.string().required('Sort Description is required'),
        // content : Yup.string().required('Content is required'),
        image: Yup.mixed()
            .test("fileSize", "File too large", (value) => {
                if (value && (typeof value) !== 'string') return value.size <= FILE_SIZE;
                return true;
            }),
            
        // author_id: Yup.string().required('Author is required'), 
        category_id: Yup.string().required('Category is required'), 
        // status: Yup.boolean().required('Status is required'),
    });

    const fetchData = useCallback(async () => {
        try {
            const [ author ,categories] = await Promise.all([
                fetchBlogAuthor(),
                fetchCategories(),
            ]);

            setAuthorData(author)
            setCategoryData(categories);
        } catch (error) {
            toast.error(error.message);
        }
    }, []);

    
    useEffect(() => { fetchData() }, [fetchData]);
  
   
    const fields = [
        {
            label: "Category",
            name: "category_id",
            type: "select2",
            options:categoryData,
            col: 12
        },
   
        {
            label: "Title",
            name: "title",
            type: "text",
            col: 6
        },
        {
            label: "Sort Description",
            name: "sort_description",
            type: "text",
            col: 6
        },
        {
            label: "content",
            name: "content",
            type: "text-editer",
            col: 12
        },
      
        {
            label: "Author",
            name: "author_id",
            type: "select2",
            options:authorData,
            col: 6
        },
        {
            label: "Tags (Enter Tag in comma separated)",
            name: "tags",
            type: "text",
            col: 6
        },   
        {
            label: "Read Time in minutes *",
            name: "read_time",
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
                                    <h5 className="mb-0" data-anchor="data-anchor">Add Blog</h5>
                                </div>
                                <div className="col-auto ms-auto">
                                    <Link to={`/admin/blog`}>
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
                                data = await AxiosHelper.postData("blog/add", values, true);
                                if (data?.data?.status === true) {
                                    toast.success(data?.data?.message);
                                    navigate('/admin/blog')
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

export default addBlog
