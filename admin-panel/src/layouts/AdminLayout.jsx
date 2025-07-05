import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation, useNavigation } from "react-router-dom";
import { logdedOutAdmin, updateAdmin, updatePermission } from "../redux/admin/adminSlice";
import AxiosHelper from "../helper/AxiosHelper";
import SiteSetting from "../components/Admin/SiteSetting";
import Footer from "../components/Admin/Footer";
import Navbar from "../components/Admin/Navbar";
import SideBar from "../components/Admin/SideBar";
import menu_data from "../data/menu_data";
import Loader from "../components/Admin/Loader";

// Style Sheets 
import '../assets/css/admin/theme.min.css'
import '../assets/css/admin/custom.css'

const AdminLayout = () => {

    const location = useLocation();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [isLoggedIn, setIsLoggedIn] = useState(null)
    const [hover, setHover] = useState(false);
    const [toggle, setToggle] = useState(localStorage.getItem('isToggle') === "1" ? true : false);
    const [dark, setDark] = useState(localStorage.getItem('isDark') === "1" ? true : false)

    const setDarkMiddle = (value) => {
        localStorage.setItem('isDark', value ? 1 : 0)
        setDark(value)
    }

    const setToggleMiddle = (value) => {
        localStorage.setItem('isToggle', value ? 1 : 0)
        setToggle(value)
    }

    const updateDataAdmin = useCallback(async () => {
        const { data } = await AxiosHelper.getData(`profile`);
        if (data?.status === true) {
            dispatch(updateAdmin(data?.data?.user))
            dispatch(updatePermission(data?.data?.permissions))
            setIsLoggedIn(true)
            return true;
        } else {
            dispatch(logdedOutAdmin())
            setIsLoggedIn(false)
            return false;
        }
    }, [])

    useEffect(() => { updateDataAdmin() }, [updateDataAdmin])
    if (navigation.state !== "idle" || isLoggedIn === null) return <Loader />

    return isLoggedIn ?
        <div className="main" id="top">
            <SiteSetting hover={hover} setToggle={setToggle} toggle={toggle} dark={dark} />
            <div className="container-fluid" data-layout="container">
                <SideBar logoUrl={`/admin/dashboard`} toggle={toggle} menu={menu_data} setToggle={setToggleMiddle} setHover={setHover} />
                <div className="content">
                    <Navbar toggle={toggle} setToggle={setToggleMiddle} dark={dark} setDark={setDarkMiddle} />
                    <div className="mt-2"><Outlet /></div>
                    <Footer />
                </div>
            </div>
        </div>
        :
        <Navigate to={`/admin/login`} state={{ from: location }} replace />
};

export default AdminLayout;