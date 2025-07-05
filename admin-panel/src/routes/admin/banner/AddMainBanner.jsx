import React, { useCallback, useEffect, useState } from 'react'
import MyForm from '../../../components/MyForm'
import * as Yup from "yup";
import { toast } from 'react-toastify';
import AxiosHelper from '../../../helper/AxiosHelper';
import { FILE_SIZE, SUPPORTED_FORMATS_IMAGE, STATUS } from '../../../constant/fromConfig';
import { Link, useNavigate } from 'react-router-dom';


const AddMainBanner = () => {
    const navigate = useNavigate()
    const [errors, setErrors] = useState({ name: '', status: '' })
    const [pagelist, setPagelist] = useState([]);
    const [sectionlist, setSectionlist] = useState([]);

    const initialValues = {
        tag: "",
        order: 0,
        type:"",
        image_size:"",
        title: "",
        short_description: "",
        page_id: "6786286cf34d072f1ad6fbaa",
        section_id: "678653a829eedd6ef542540a",
        button1_text: "",
        button1_url: "",
        button2_text: "",
        button2_url: "",
        status: "",
        image: "",
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required').min(2, 'Name must be at least 2 characters'),
        image: Yup.mixed()
            .test("fileSize", "File too large", (value) => {
                if (value && (typeof value) !== 'string') return value.size <= FILE_SIZE;
                return true;
            })
            
    });

    const fields = [
        
        {
            label: "Title",
            name: "title",
            type: "text",
            col: 12
        },
        {
            label: "Short Description",
            name: "short_description",
            type: "textarea",
            col: 12
        },
        {
            label: "Sub tittle",
            name: "tag",
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
            label: "Button 1 Text",
            name: "button1_text",
            type: "text",
            col: 6
        },
        {
            label: "Button 1 Url",
            name: "button1_url",
            type: "text",
            col: 6
        },
        {
            label: "Button 2 Tax",
            name: "button2_text",
            type: "text",
            col: 6
        },
        {
            label: "Button 2 Url",
            name: "button2_url",
            type: "text",
            col: 6
        },
        {
            label: "Image (566*566)",
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


    const fetchPagelist = useCallback(async () => {
        try {
            const { data } = await AxiosHelper.getData('page-list');
            if (data?.status === true) {
                setPagelist(data.data);
            } else {
                toast.error(data?.message || 'Failed to fetch page list');
            }
        } catch (error) {
            console.error("Error fetching page list:", error);
            toast.error('An error occurred while fetching the page list');
        }
    }, []);

    useEffect(() => {
        fetchPagelist();
    }, [fetchPagelist]);

    const fetchSectionList = useCallback(async (pageId) => {
        try {
            const { data } = await AxiosHelper.getData(`section-list/${pageId}`);
            if (data?.status === true) {
                setSectionlist(data.data);
            } else {
                toast.error(data?.message || 'Failed to fetch section list');
                return [];
            }
        } catch (error) {
            console.error("Error fetching section list:", error);
            toast.error('An error occurred while fetching the section list');
            return [];
        }
    }, []);

    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-3">
                        <div className="card-header">
                            <div className="row flex-between-end">
                                <div className="col-auto align-self-center">
                                    <h5 className="mb-0" data-anchor="data-anchor">Add Main slider Banner</h5>
                                </div>
                                <div className="col-auto ms-auto">
                                    <Link to={`/admin/banner`}>
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
                                data = await AxiosHelper.postData("banner", values, true);
                                if (data?.data?.status === true) {
                                    toast.success(data?.data?.message);
                                    navigate('/admin/banner')
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

export default AddMainBanner
