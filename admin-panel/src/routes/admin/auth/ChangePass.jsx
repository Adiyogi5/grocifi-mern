import React, { useState } from 'react'
import * as Yup from "yup";
import { toast } from 'react-toastify'
import MyForm from '../../../components/MyForm';
import AxiosHelper from '../../../helper/AxiosHelper';

const ChangePass = () => {

    const [errors, setErrors] = useState({})
    const initialValues = {
        password: '',
        new_password: '',
        confrim_password: '',
    }

    const validSchema = Yup.object().shape({
        password: Yup.string().min(2).max(50).required(),
        new_password: Yup.string().min(2).max(50).required(),
        confrim_password: Yup.string().min(2).max(50).required().oneOf([Yup.ref('new_password'), null], 'Passwords must match')
    });


    const fields = [
        {
            label: "Old Password",
            name: "password",
            type: "password",
            hideLabel: true
        },
        {
            label: "New Password",
            name: "new_password",
            type: "password",
            hideLabel: true
        },
        {
            label: "Confirm Password",
            name: "confrim_password",
            type: "password",
            hideLabel: true
        },
        {
            label: "Change Password",
            name: "submit",
            type: "submit",
        }
    ];

    return (
        <div className="card">
            <div className="card-header">
                <h5>Password Change</h5>
            </div>
            <div className="card-body overflow-hidden pt-0">
                <MyForm errors={errors} fields={fields} initialValues={initialValues} isReset={true} validSchema={validSchema} onSubmit={async (values) => {
                    var { data } = await AxiosHelper.postData("change-password", values);
                    if (data?.status === true) {
                        toast.success(data?.message);
                    } else {
                        setErrors(data?.data)
                        toast.error(data?.message);
                    }
                }} />
            </div>
        </div>
    )
}

export default ChangePass