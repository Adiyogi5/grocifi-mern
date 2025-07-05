import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import AxiosHelper from "../../../helper/AxiosHelper";
import { toast } from 'react-toastify';
import { PHONE_REG_EXP } from "../../../constant/fromConfig";
import MyForm from "../../../components/MyForm";
import { useDispatch, useSelector } from "react-redux";
import { logdedInAdmin, updatePermission } from "../../../redux/admin/adminSlice";


function Login() {
    const initialValues = { phone_no: "", password: "" };
    const navigate = useNavigate();

    var { logo, application_name } = useSelector(store => store.theme.settings);
    const dispatch = useDispatch();

    const validSchema = Yup.object().shape({
        phone_no: Yup.string().min(2).max(12).matches(PHONE_REG_EXP, "Phone number is not valid").required(),
        password: Yup.string().min(2).max(50).required(),
    });

    const fields = [
        {
            label: "Phone Number",
            name: "phone_no",
            type: "text",
        },
        {
            label: "Password",
            name: "password",
            type: "password",
        },
        {
            label: "Log In",
            name: "submit",
            type: "submit",
            className: "btn btn-primary w-100",
        },
    ];

    return (
        <>
            <div className="container" data-layout="container">
                <div className="row flex-center min-vh-100 py-6">
                    <div className="col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
                        <Link to='/admin/dashboard' className="d-flex flex-center mb-4">
                            <img className="me-2" src={logo} alt={application_name} style={{ width: 180, maxHeight: 45 }} />
                        </Link>
                        <div className="card">
                            <div className="card-body p-4 p-sm-5">
                                <div className="row flex-between-center mb-2">
                                    <div className="col-auto">
                                        <h5>Log in</h5>
                                    </div>
                                </div>
                                <MyForm
                                    fields={fields}
                                    initialValues={initialValues}
                                    validSchema={validSchema}
                                    onSubmit={async (values) => {
                                        var { data } = await AxiosHelper.postData("login", values);
                                        if (data?.status === true) {
                                            toast.success("Successfully Login..!!");
                                            
                                            dispatch(logdedInAdmin(data.data.user))
                                            dispatch(updatePermission(data.data.permissions))
                                            return navigate(`/admin/dashboard`);
                                        } else {
                                            toast.error(data?.message);
                                        }
                                    }}
                                />
                                <div className="col-auto">
                                    <Link to={`/admin/forgot-password`} className="fs--1">
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
