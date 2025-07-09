import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MyForm from '../../../components/MyForm';
import AxiosHelper from '../../../helper/AxiosHelper';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [initialValues, setInitialValues] = useState({
    fname: '',
    lname: '',
    email: '',
    phone_no: '',
   roleId: roles.length > 0 ? roles[0].id : '',
    image: '',
  });

  const validationSchema = Yup.object().shape({
    fname: Yup.string().required('First Name is required'),
    lname: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Valid Email is required').required('Email is required'),
    phone_no: Yup.string().matches(/^[0-9]{10}$/, 'Phone Number must be 10 digits').required('Phone Number is required'),
    roleId: Yup.string().required('Role is required'),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await AxiosHelper.getData(`customer/edit/${id}`);
        if (data.status) {
          setRoles(data.data.roles.map((role) => ({ id: role._id, name: role.name })));
          setInitialValues(data.data.user);
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
        if (key === 'image' && values[key] instanceof File) {
          formData.append(key, values[key]);
        } else {
          formData.append(key, values[key]);
        }
      });
      const { data } = await AxiosHelper.postData(`customer/edit/${id}`, formData, true);
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
    { name: 'roleId', label: 'Role', type: 'select', options: roles, col: 6 },
    { name: 'image', label: 'Profile Image', type: 'file', col: 6 },
    { name: 'submit', label: 'Update', type: 'submit', col: 12 },
  ];

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card mb-3">
          <div className="card-header">
            <div className="row flex-between-end">
              <div className="col-auto align-self-center">
                <h5 className="mb-0">Edit Customer</h5>
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

export default EditCustomer;