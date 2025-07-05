import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// Style Sheets 
import '../assets/css/admin/theme.min.css'
import '../assets/css/admin/custom.css'

const AdminAuthLayout = () => {
    var { isLoggedIn } = useSelector(store => store.admin);
    return isLoggedIn ? <Navigate to={`/admin/dashboard`} /> : <Outlet />;
};

export default AdminAuthLayout;
