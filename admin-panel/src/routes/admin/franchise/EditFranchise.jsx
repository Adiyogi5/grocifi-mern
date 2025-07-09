import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AxiosHelper from '../../../helper/AxiosHelper';
import MyForm from '../../../components/MyForm';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';    

const EditFranchise = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    fname: '',
    lname: '',
    email: '',
    phone_no: '',
    firmname: '',
    ownername: '',
    ownermobile: '',
    contactpersonname: '',
    contactpersonmob: '',
    commission: 0,
    logo: '',
    is_global: false,
    is_cod: true,
    isallow_global_product: true,
    min_order: '',
    min_order_wholesaler: '',
    delivery_chrge: '',
    accept_minimum_order: true,
    delivery_day_after_order: 0,
    delivery_max_day: 0,
  });

  const validationSchema = Yup.object().shape({
    fname: Yup.string().required('First Name is required'),
    lname: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Valid Email is required').required('Email is required'),
    phone_no: Yup.string().matches(/^[0-9]{10}$/, 'Phone Number must be 10 digits').required('Phone Number is required'),
    firmname: Yup.string().required('Firm Name is required'),
    ownername: Yup.string().required('Owner Name is required'),
    ownermobile: Yup.string().matches(/^[0-9]{10}$/, 'Owner Mobile must be 10 digits').required('Owner Mobile is required'),
    contactpersonname: Yup.string().required('Contact Person Name is required'),
    contactpersonmob: Yup.string().matches(/^[0-9]{10}$/, 'Contact Person Mobile must be 10 digits').required('Contact Person Mobile is required'),
    commission: Yup.number().min(0, 'Commission must be non-negative').required('Commission is required'),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await AxiosHelper.getData(`franchise/edit/${id}`);
        if (data.status) {
          setInitialValues({
            ...data.data,
            fname: data.data.userId?.fname || '',
            lname: data.data.userId?.lname || '',
            email: data.data.userId?.email || '',
            phone_no: data.data.userId?.phone_no || '',
          });
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error('Failed to fetch data');
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === 'image' || key === 'logo') {
          if (values[key] instanceof File) {
            formData.append(key, values[key]);
          }
        } else {
          formData.append(key, values[key]);
        }
      });
      const { data } = await AxiosHelper.postData(`franchise/edit/${id}`, formData, true);
      if (data.status) {
        toast.success(data.message);
        navigate('/admin/franchise');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to submit form');
    }
  };

  const fields = [
    { name: 'fname', label: 'First Name', type: 'text', col: 6 },
    { name: 'lname', label: 'Last Name', type: 'text', col: 6 },
    { name: 'email', label: 'Email', type: 'email', col: 6 },
    { name: 'phone_no', label: 'Phone Number', type: 'text', col: 6 },
    { name: 'firmname', label: 'Firm Name', type: 'text', col: 6 },
    { name: 'ownername', label: 'Owner Name', type: 'text', col: 6 },
    { name: 'ownermobile', label: 'Owner Mobile', type: 'text', col: 6 },
    { name: 'contactpersonname', label: 'Contact Person Name', type: 'text', col: 6 },
    { name: 'contactpersonmob', label: 'Contact Person Mobile', type: 'text', col: 6 },
    { name: 'commission', label: 'Commission (%)', type: 'number', col: 6 },
    { name: 'image', label: 'Profile Image', type: 'file', col: 6 },
    { name: 'logo', label: 'Logo', type: 'file', col: 6 },
    { name: 'is_global', label: 'Is Global', type: 'check', col: 3 },
    { name: 'is_cod', label: 'Cash on Delivery', type: 'check', col: 3 },
    { name: 'isallow_global_product', label: 'Allow Global Product', type: 'check', col: 3 },
    { name: 'accept_minimum_order', label: 'Accept Minimum Order', type: 'check', col: 3 },
    { name: 'min_order', label: 'Minimum Order', type: 'text', col: 6 },
    { name: 'min_order_wholesaler', label: 'Minimum Order (Wholesaler)', type: 'text', col: 6 },
    { name: 'delivery_chrge', label: 'Delivery Charge', type: 'text', col: 6 },
    { name: 'delivery_day_after_order', label: 'Delivery Day After Order', type: 'number', col: 6 },
    { name: 'delivery_max_day', label: 'Maximum Delivery Days', type: 'number', col: 6 },
    { name: 'submit', label: 'Update', type: 'submit', col: 12 },
  ];

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card mb-3">
          <div className="card-header">
            <div className="row flex-between-end">
              <div className="col-auto align-self-center">
                <h5 className="mb-0">Edit Franchise</h5>
              </div>
              <div className="col-auto ms-auto">
                <Link to="/admin/franchise" className="btn btn-sm btn-falcon-default">
                  <i className="fa fa-arrow-left me-1"></i> Back
                </Link>
              </div>
            </div>
          </div>
          <div className="card-body">
            <MyForm
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              fields={fields}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFranchise;