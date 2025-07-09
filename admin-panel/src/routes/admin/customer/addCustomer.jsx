import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosHelper from '../../../helper/AxiosHelper';
import MyForm from '../../../components/MyForm';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

const AddCustomer = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const initialValues = {
    fname: '',
    lname: '',
    email: '',
    phone_no: '',
    password: '',
  roleId: roles.length > 0 ? roles[0].id : '',
    image: '',
  };

  const validationSchema = Yup.object().shape({
    fname: Yup.string().required('First Name is required'),
    lname: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Valid Email is required').required('Email is required'),
    phone_no: Yup.string().matches(/^[0-9]{10}$/, 'Phone Number must be 10 digits').required('Phone Number is required'),
    password: Yup.string().required('Password is required'),
    roleId: Yup.string().required('Role is required'),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await AxiosHelper.getData('customer/add');
        if (data.status) {
          setRoles(data.data.map((role) => ({ id: role._id, name: role.name })));
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error('Failed to fetch roles');
      }
    };
    fetchData();
  }, []);

   const getRoleData = useCallback(async () => {
        const data = await AxiosHelper.getData("role");
        if (data?.data?.status === true) {
            setRoles(data?.data.data);
        }
    }, []);

    useEffect(() => { getRoleData() }, [])

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === 'image' && values[key] instanceof File) {
          formData.append(key, values[key]);
        } else {
          formData.append(key, values[key]);
        }
      });
      const { data } = await AxiosHelper.postData('customer/add', formData, true);
      if (data.status) {
        toast.success(data.message);
        navigate('/admin/customer');
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
    { name: 'password', label: 'Password', type: 'password', col: 6 },
    { name: 'roleId', label: 'Role', type: 'select2', options: roles, col: 6 },
    { name: 'image', label: 'Profile Image', type: 'file', col: 6 },
    { name: 'submit', label: 'Add', type: 'submit', col: 12 },
  ];

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card mb-3">
          <div className="card-header">
            <div className="row flex-between-end">
              <div className="col-auto align-self-center">
                <h5 className="mb-0">Add Customer</h5>
              </div>
              <div className="col-auto ms-auto">
                <Link to="/admin/customer" className="btn btn-sm btn-falcon-default">
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

export default AddCustomer;