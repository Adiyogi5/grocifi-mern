import { Link } from "react-router-dom";
import Divider from "./Sidebar/Divider";
import SingleLink from "./Sidebar/SingleLink";
import MultiLink from "./Sidebar/MultiLink";
import { useSelector } from "react-redux";

const SideBar = ({ toggle, setToggle, setHover, menu, logoUrl = '' }) => {

    const { logo, application_name } = useSelector(store => store.theme.settings);

    return (
        <>
            <nav className={`navbar navbar-vertical navbar-light navbar-expand-xl`}>
                <div className="d-flex align-items-center">
                    <div className="toggle-icon-wrapper">
                        <button onClick={() => setToggle(!toggle)} className="btn navbar-toggler-humburger-icon navbar-vertical-toggle" data-bs-toggle="tooltip" data-bs-placement="left" title="Toggle Navigation">
                            <span className="navbar-toggle-icon">
                                <span className="toggle-line" />
                            </span>
                        </button>
                    </div>
                    <Link to={logoUrl} className="navbar-brand">
                        <div className="d-flex align-items-center py-3">
                            <img className="me-2" src={logo} alt={application_name} style={{ maxWidth: 180, maxHeight: 45 }} />
                        </div>
                    </Link>
                </div>
                <div
                    onMouseEnter={() => toggle && setHover(true)}
                    onMouseLeave={() => toggle && setHover(false)}
                    className={`collapse navbar-collapse ${!toggle && 'show'}`}>
                    <div className="navbar-vertical-content scrollbar">
                        <ul className="navbar-nav  flex-column mb-3">
                            {
                                menu.map((link, i) => {
                                    if (link.children && link.children.length > 0) {
                                        return <MultiLink key={link.name} {...link} />
                                    }

                                    if (link.url && link.url.length > 0) {
                                        return <SingleLink key={link.name} {...link} />
                                    }

                                    if (link.url === undefined || link.children === undefined) {
                                        return <Divider key={link.name} {...link} />
                                    }
                                    return null;
                                })
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default SideBar;
