import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MyForm from '../../../components/MyForm';
import AxiosHelper from '../../../helper/AxiosHelper';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { FaUser, FaStore } from 'react-icons/fa';

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [initialValues, setInitialValues] = useState({
    fname: '',
    lname: '',
    email: '',
    phone_no: '',
    roleId: '',
    image: '',
    wholesaler_firmname: '',
    gst_no: '',
    visiting_card: '',
  });
  const [isWholesaler, setIsWholesaler] = useState(false);

  const validationSchema = Yup.object().shape({
    fname: Yup.string().required('First Name is required'),
    lname: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Valid Email is required').required('Email is required'),
    phone_no: Yup.string().matches(/^[0-9]{10}$/, 'Phone Number must be 10 digits').required('Phone Number is required'),
    roleId: Yup.string().required('Role is required'),
    ...(isWholesaler && {
      wholesaler_firmname: Yup.string().required('Firm Name is required'),
      gst_no: Yup.string().required('GST Number is required')
    })
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await AxiosHelper.getData(`customer/edit/${id}`);
        if (data.status) {
          setRoles(data.data.roles.map((role) => ({ id: role._id, name: role.name })));
          const userData = data.data.user;
          console.log("userData", userData);
          setInitialValues({
            fname: userData.fname,
            lname: userData.lname,
            email: userData.email,
            phone_no: userData.phone_no,
            roleId: userData.roleId._id,
            image: userData.img || '',
            wholesaler_firmname: userData.wholesaler_firmname || '',
            gst_no: userData.gst_no || '',
            visiting_card: userData.visiting_card || '',
          });
          setIsWholesaler(userData.is_wholesaler || false);
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
        if ((key === 'image' || key === 'visiting_card') && values[key] instanceof File) {
          formData.append(key, values[key]);
        } else if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });
      formData.append('is_wholesaler', isWholesaler);

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

  const baseFields = [
    { name: 'fname', label: 'First Name', type: 'text', col: 6 },
    { name: 'lname', label: 'Last Name', type: 'text', col: 6 },
    { name: 'email', label: 'Email', type: 'email', col: 6 },
    { name: 'phone_no', label: 'Phone Number', type: 'text', col: 6 },
    { name: 'roleId', label: 'Role', type: 'select', options: roles, col: 6 },
    { name: 'image', label: 'Profile Image', type: 'file', col: 6 },
  ];

  if (isWholesaler) {
    baseFields.push(
      { name: 'wholesaler_firmname', label: 'Firm Name', type: 'text', col: 6 },
      { name: 'gst_no', label: 'GST Number', type: 'text', col: 6 },
      { name: 'visiting_card', label: 'Visiting Card', type: 'file', col: 6 }
    );
  }

  baseFields.push({ name: 'submit', label: 'Update', type: 'submit', col: 12 });

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card mb-3">
          <div className="card-header">
            <div className="row flex-between-end">
              <div className="col-auto align-self-center">
                <h5 className="mb-0">Edit {isWholesaler ? 'Wholesaler' : 'Customer'}</h5>
              </div>
              <div className="col-auto ms-auto">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckDefault"
                    checked={isWholesaler}
                    onChange={() => setIsWholesaler(!isWholesaler)}
                  />
                  <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                    {isWholesaler ? (
                      <span className="text-success"><FaStore className="me-1" /> Wholesaler</span>
                    ) : (
                      <span className="text-primary"><FaUser className="me-1" /> Customer</span>
                    )}
                  </label>
                </div>
              </div>
              <div className="col-auto">
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
              fields={baseFields}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomer;