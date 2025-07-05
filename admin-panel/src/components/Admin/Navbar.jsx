import { NavDropdown } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Avatar } from "../../assets/images";


const AvatarBox = () => {
    const { image } = useSelector(store => store.admin);
    return (
        <div className="avatar avatar-xl">
            <img className="rounded-circle border border-primary border-2" src={image ? image : Avatar} alt="" />
        </div>
    )
}

const Navbar = ({ toggle, setToggle, dark, setDark }) => {

    const { name } = useSelector(store => store.admin);
    const { logo, application_name } = useSelector(store => store.theme.settings);

    return (
        <nav className="navbar navbar-light navbar-glass navbar-top navbar-expand navbar-glass-shadow">
            <button onClick={() => setToggle(!toggle)} className="btn navbar-toggler-humburger-icon navbar-toggler me-1 me-sm-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarVerticalCollapse" aria-controls="navbarVerticalCollapse" aria-expanded="false" aria-label="Toggle Navigation">
                <span className="navbar-toggle-icon"><span className="toggle-line" /></span>
            </button>
            <Link className="navbar-brand me-1 me-sm-3" to={`/dashboard`}>
                <div className="d-flex align-items-center">
                    <img className="me-2" src={logo} alt={application_name} style={{ maxWidth: 180, maxHeight: 45 }} />
                </div>
            </Link>
            <ul className="navbar-nav navbar-nav-icons ms-auto flex-row align-items-center">
                <li className="nav-item">
                    <div className="px-2">
                        {dark ?
                            <label className="mb-0 p-2 theme-control-toggle-label d-print-none theme-control-toggle-light" onClick={() => setDark(false)}>
                                <span className="fas fa-sun fs-0"></span>
                            </label>
                            :
                            <label className="mb-0 p-2 theme-control-toggle-label d-print-none theme-control-toggle-dark" onClick={() => setDark(true)}>
                                <span className="fas fa-moon fs-0"></span>
                            </label>
                        }
                    </div>
                </li>

                <li className="fw-bold fs-0 text-primary my-0 d-none d-lg-block d-xl-block">
                    <span>{name}</span>
                </li>
                <li className="nav-item dropdown">
                    <NavDropdown title={<AvatarBox />} className="" id="navbarScrollingDropdown">
                        <span className="dropdown-item fw-bold text-warning my-0">
                            <span>{name}</span>
                        </span>
                        <NavDropdown.Divider className="my-1" />
                        <NavLink className="dropdown-item" to={`/admin/profile`}>Profile &amp; account </NavLink>
                        <NavLink className="dropdown-item" to={`/admin/logout`}>Logout</NavLink>
                    </NavDropdown>
                </li>
            </ul>
        </nav>
    );
};


export default Navbar;