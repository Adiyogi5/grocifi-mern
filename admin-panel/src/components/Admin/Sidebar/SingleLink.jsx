
import { useLocation, Link } from "react-router-dom";

const SingleLink = ({ url, icon, name }) => {
    const { pathname } = useLocation()
    return (
        <li className="nav-item ">
            <Link className={`nav-link ${pathname === url && 'active'}`} to={url}>
                <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                        <span className={icon} />
                    </span>
                    <span className="nav-link-text"> {name}</span></div>
            </Link>
        </li>
    )
}

export default SingleLink