import React, { useState, useCallback,useEffect } from 'react'
import MyForm from '../../../components/MyForm'
import * as Yup from "yup";
import { toast } from 'react-toastify';
import AxiosHelper from '../../../helper/AxiosHelper';
import { FILE_SIZE,SUPPORTED_FORMATS_IMAGE,STATUS,ISFEATURE, DAYS } from '../../../constant/fromConfig';
import { Link, useNavigate,useParams } from 'react-router-dom';

import { fetchBusinessEdit, fetchUsers, fetchCategories, fetchCountries, fetchAdoption,fetchStates, fetchConstant,fetchCities } from '../../../helper/ApiService';

let  opening_hours =  DAYS.reduce((acc, day) => {
    acc[day] = { open: "00:00",  close: "00:00", enabled: false };
    return acc;
}, {});

let code = []
const editBusiness = () => {
    const navigate = useNavigate()
    const { slug } = useParams();
    const [errors, setErrors] = useState({ name: '', status: '' })
    const [userData, setUserData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [countryData, setCountryData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [cityData, setCityData] = useState([]);
    const [optionData, setoptionData] = useState([]);
    const [constData, setConst] = useState([]);

    const [initialValues, setInitialValues] = useState({
        business_name       : "",
        category_id         : "",
        country_id          : "",
        state_id            : "",
        city_id             : "",
        story               : "",
        specialities        : "",
        business_tag        : [],
        hour_type           : false,
        opening_hours       : "",
        business_label      : "",
        time_in_business    : "",
        year_ago            : "",

        logo                : "",
        banner              : "",
        gallery             : [],
        attachments         : "",
        video               : "",

        name                : "",
        email               : "",
        phone               : "",
        whatsapp            : "",
        phone_code          : "",
        social_profile      : { facebook:"", youtube:"", instagram:"",x:"", linkedin:""},
        address             : "",
        zip                 : "",
        website             : "",
        is_feature          : "",
        status              : "",
    });
 
    const validationSchema = Yup.object().shape({
        business_name: Yup.string()
            .trim()
            .required('Business Name is required')
            .min(2, 'Business Name must be at least 2 characters')
            .max(50, 'Business Name must be less than 50 characters'),
    
        name: Yup.string()
            .trim()
            .required('Name is required')
            .min(2, 'Name must be at least 2 characters')
            .max(50, 'Name must be less than 50 characters'),
    
        time_in_business: Yup.string()
            .required('Time in business is required'),
    
        business_label: Yup.string()
            .required('Business label is required'),
    
        phone: Yup.string()
            .required('Mobile is required')
            .matches(/^[0-9]{10}$/, 'Mobile must be exactly 10 digits'),
    
        whatsapp: Yup.string()
            .nullable()
            .matches(/^[0-9]{10}$/, 'WhatsApp must be exactly 10 digits'),
    
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
    
        logo: Yup.mixed()
            .nullable()
            .test('fileSize', 'File size should be less than 2MB', (value) => {
                if (value && typeof value !== 'string') return value.size <= FILE_SIZE;
                return true;
            })
            .test('fileFormat', 'Unsupported file format. Allowed formats: JPG, JPEG, PNG, WEBP', (value) => {
                if (value && typeof value !== 'string') return SUPPORTED_FORMATS_IMAGE.includes(value.type);
                return true;
            }),
    
        owner_id: Yup.string().required('Owner is required'),
        country_id: Yup.string().required('Country is required'),
        state_id: Yup.string().required('State is required'),
        city_id: Yup.string().required('City is required'),
    
        story: Yup.string()
            .trim()
            .required('Story is required')
            .min(10, 'Story must be at least 10 characters long')
            .max(1000, 'Story must be less than 1000 characters'),
    });
    
   
    const fetchData = useCallback(async () => {
        try {
            const [business, users, categories, countries, constants, options] = await Promise.all([
                fetchBusinessEdit(slug),
                fetchUsers(),
                fetchCategories(),
                fetchCountries(),
                fetchConstant(),
                fetchAdoption(),
            ]);

            if (business?.status === true) {
                if (business.data?.hour_type == "selected") {
                    business.data.hour_type = true;
                    let hours = business.data.opening_hours;
                    business.data.opening_hours = hours.reduce((acc, dayData) => {
                        acc[dayData.day] = { open: dayData.open, close: dayData.close, enabled: dayData.enabled || false };
                        return acc;
                    }, {});
                } else {
                    business.data.opening_hours = opening_hours
                    business.data.hour_type = false;
                }
                
                setInitialValues(business.data);
                setUserData(users);
                setCategoryData(categories);
                setConst(constants);
                setoptionData(options);
                setCountryData(countries);
                if (business.data.country_id) {
                    code = countries.map(function(country) {
                        return { id: country.phone_code, name: country.phone_code };
                    });

                    business.data.business_tag = business.data.business_tag.map(function(tag) {
                        return  tag.id ;
                    });
                    
                    const states = await fetchStates(business.data.country_id);
                    setStateData(states);
                    if (business.data.state_id) {
                        const cities = await fetchCities(business.data.state_id);
                        setCityData(cities);
                    }
                }
            } else {
                navigate('/admin/business');
                toast.error(business?.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, [slug]);

    const handleCountryChange = useCallback(async (countryId) => {
        try {
            const states = await fetchStates(countryId);
            setStateData(states);
        } catch (error) {
            toast.error(error.message);
        }
    }, []);
    
    const handleStateChange = useCallback(async (stateId) => {
        try {
            const cities = await fetchCities(stateId);
            setCityData(cities);
        } catch (error) {
            toast.error(error.message);
        }
    }, []);
    
    useEffect(() => { fetchData() }, [fetchData]);

    const fields = [
        {
            label: "Business Name",
            name: "business_name",
            type: "text",
            col: 6
        },
        {
            label: "Business Email ",
            name: "email",
            type: "text",
            col: 6
        },
        {
            label: "Owner",
            name: "owner_id",
            type: "select2",
            options:userData,
            col: 6
        },
       
        {
            label: "Category",
            name: "category_id",
            type: "select-multiple",
            options:categoryData,
            col: 6
        },
        {
            label: "Business Mobile",
            name: "phone",
            type: "text",
            col: 3
        },
        {
            label: "Code",
            name: "phone_code",
            type: "select2",
            options:code,
            col: 2,
        },
        {
            label: "Whatsapp",
            name: "whatsapp",
            type: "text",
            col: 3
        },
        {
            label: "Name",
            name: "name",
            type: "text",
            col: 4
        },
        {
            label: "Time In Business",
            name: "time_in_business",
            type: "select2",
            options:optionData?.condition,
            col: 4
        },
        {
            label: "Business Tags",
            name: "business_tag",
            type: "select-multiple",
            options:optionData?.tag,
            col: 4,
        }, 
        {
            label: "Business Label",
            name: "business_label",
            type: "select2",
            options:optionData?.adlabel,
            col: 4,
        },
        {
            label: "Business Story",
            name: "story",
            type: "textarea",
            col: 12
        },
        {
            label: "Business Address",
            name: "address",
            type: "text",
            col: 4
        },
      
        {
            label: "Country",
            name: "country_id",
            type: "select2",
            options:countryData,
            onChangeCustom: (selectedCountry) => {   
                handleCountryChange(selectedCountry.id);
            },
            col: 4
        },
        {
            label: "State",
            name: "state_id",
            type: "select2",
            options:stateData,
            onChangeCustom: (selectedState) => { 
                handleStateChange(selectedState.id);
            },
            col: 4
        },
        {
            label: "City",
            name: "city_id",
            type: "select2",
            options:cityData,
            col: 4
        },
        {
            label: "Zip",
            name: "zip",
            type: "number",
            col: 4
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
            label: "Is Feature",
            name: "is_feature",
            type: "select2",
            options:ISFEATURE,
            col: 4
        },    
        {
            label: "Status",
            name: "status",
            type: "select2",
            options: STATUS,
            col: 4
        },
        {
            label: "Logo",
            name: "logo",
            type: "file",
            col: 4
        },
        {
            label: "Banner",
            name: "banner",
            type: "file",
            col: 4
        },
        {
            label: "Gallery",
            name: "gallery",
            type: "multi-file",
            col: 4
        },
        {
            label: "Opening Hours",
            name: "opening_hours",
            type: "opening_hr",
            options: constData?.OPENING_HOURS,
            col: 12
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
                                    <h5 className="mb-0" data-anchor="data-anchor">Edit Business</h5>
                                </div>
                                <div className="col-auto ms-auto">
                                    <Link to={`/admin/business`}>
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
                            
                                const data = await AxiosHelper.putData(`business/edit/${values.id}`, values,true);
                                if (data?.data?.status === true) {
                                    toast.success(data?.data?.message);
                                    navigate('/admin/business')
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

export default editBusiness
