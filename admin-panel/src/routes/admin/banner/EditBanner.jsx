import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MyForm from '../../../components/MyForm';
import * as Yup from "yup";
import { toast } from 'react-toastify';
import AxiosHelper from '../../../helper/AxiosHelper';
import { FILE_SIZE, SUPPORTED_FORMATS_IMAGE, STATUS } from '../../../constant/fromConfig';

const EditBanner = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [pagelist, setPagelist] = useState([]);
    const [sectionlist, setSectionlist] = useState([]);
    const [initialValues, setInitialValues] = useState({
        tag: "",
        order: "",
        title: "",
        short_description: "",
        page_id: "",
        section_id: "",
        button1_text: "",
        button1_url: "",
        button2_text: "",
        button2_url: "",
        status: "",
        image: null,
        image_size: ""
    });
    const [errors, setErrors] = useState({ name: '', status: '' });
    const [imageSize, setImageSize] = useState();

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
        const fetchData = async () => {
            await fetchPagelist();
            if (initialValues?.page_id) {
                await fetchSectionList(initialValues.page_id);
            }
        };
        fetchData();
    }, [fetchPagelist, initialValues.page_id]);

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

    const fetchBannerData = useCallback(async () => {
        try {
            const { data } = await AxiosHelper.getData(`banner-edit/${slug}`);
            if (data?.status === true) {
                let response = data.data;
                setInitialValues({
                    id: response._id || '',
                    tag: response.tag || '',
                    order: response.order || '',
                    title: response.title || '',
                    short_description: response.short_description || '',
                    page_id: response.page_id || '',
                    section_id: response.section_id || '',
                    button1_text: response.button1?.text || '',
                    button1_url: response.button1?.url || '',
                    button2_text: response.button2?.text || '',
                    button2_url: response.button2?.url || '',
                    status: response.status || '',
                    image: response.image || '',
                    image_size: response?.section == "Main Slider Banner" ? "566*566" : response.image_size || '',
                });
                // setImageSize(response?.image_size);
            } else {
                toast.error(data?.message);
                navigate('/admin/banner');
            }
        } catch (error) {
            console.error("Error fetching retreat data:", error);
        }
    }, [slug, navigate]);

    useEffect(() => {
        fetchBannerData();
    }, [fetchBannerData]);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 50 characters'),
        image: Yup.mixed()
            .test("fileSize", "File too large", (value) => {
                if (value && (typeof value) !== 'string') return value.size <= FILE_SIZE;
                return true;
            })
        // .test("fileDimensions", `Image must be at least ${Math.floor(imageSize?.split('*')[0] / 2)}*${Math.floor(imageSize?.split('*')[1] / 2)} and at most ${imageSize}`, async (value) => {
        //     if (value && (typeof value) !== 'string') {
        //         const dimensions = await getImageDimensions(value);
        //         const [maxWidth, maxHeight] = imageSize?.split('*').map(Number);
        //         const minWidth = Math.floor(maxWidth / 2);
        //         const minHeight = Math.floor(maxHeight / 2);
        //         return dimensions.width >= minWidth && dimensions.height >= minHeight && dimensions.width <= maxWidth && dimensions.height <= maxHeight;
        //     }
        //     return true;
        // }),
        // status: Yup.boolean().required('Status is required'),
    });

    // const getImageDimensions = (file) => {
    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //             const img = new Image();
    //             img.onload = () => {
    //                 resolve({ width: img.width, height: img.height });
    //             };
    //             img.onerror = reject;
    //             img.src = e.target.result;
    //         };
    //         reader.onerror = reject;
    //         reader.readAsDataURL(file);
    //     });
    // };

    const fields = [
        {
            label: "Sub tittle",
            name: "tag",
            type: "text",
            col: 6
        },
        {
            label: "Order",
            name: "order",
            type: "text",
            col: 6
        },
        {
            label: "Title",
            name: "title",
            type: "text",
            col: 6
        },
        {
            label: "Short Description",
            name: "short_description",
            type: "textarea",
            col: 6
        },
        {
            label: "Page",
            name: "page_id",
            type: "select2",
            options: pagelist,
            onChangeCustom: async (e) => { setSectionlist([]); fetchSectionList(e?._id) },
            col: 6
        },
        {
            label: "Section",
            name: "section_id",
            type: "select2",
            options: sectionlist,
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
            label: "Button 2 Text",
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
            label: "Status",
            name: "status",
            type: "select2",
            options: STATUS,
            col: 6
        },
        {
            label: "Submit",
            name: "submit",
            type: "submit",
        }
    ].filter(field => initialValues[field.name] != `${import.meta.env.VITE_FIELD_NS_CODE}`);

    if (initialValues.image_size !== `${import.meta.env.VITE_FIELD_NS_CODE}`) {
        fields.splice(fields.length - 1, 0, {
            label: `Image (${initialValues?.image_size})`,
            name: "image",
            type: "file",
            col: 6
        });
    }

    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-3">
                        <div className="card-header">
                            <div className="row flex-between-end">
                                <div className="col-auto align-self-center">
                                    <h5 className="mb-0" data-anchor="data-anchor">Edit Banner</h5>
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
                            <MyForm
                                errors={errors}
                                fields={fields}
                                initialValues={initialValues}
                                validSchema={validationSchema}
                                onSubmit={async (values) => {
                                    const data = await AxiosHelper.putData(`banner?id=${values.id}`, values, true);
                                    if (data?.data?.status === true) {
                                        toast.success(data?.data?.message);
                                        navigate('/admin/banner');
                                    } else {
                                        setErrors(data?.data?.data);
                                        toast.error(data?.data?.message);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditBanner;
