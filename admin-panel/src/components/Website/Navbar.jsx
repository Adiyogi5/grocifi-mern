import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const active = "menu-item-home current-menu-item page_item page-item-6655 current_page_item menu-item-47";

export default () => {

    const [show, setShow] = useState(false);
    const [prevPosition, setPrevPosition] = useState(0)
    const [navClasses, setNavClasses] = useState('collapse');
    const [navClasses2, setNavClasses2] = useState('');

    const { logo, application_name } = useSelector(store => store.theme.settings);

    const handelToggle = () => {
        setShow(!show);
        if (show) {
            setNavClasses('collapsing');
            setTimeout(() => { setNavClasses('collapse') }, 200);
        } else {
            setNavClasses('collapsing');
            setTimeout(() => { setNavClasses('collapse show') }, 200);
        }
    }

    const closeMenu = () => {
        setShow(false);
        setNavClasses('collapse');
    }

    window.addEventListener("scroll", function (event) {
        closeMenu();
        var currentPosition = this.scrollY
        if (prevPosition < currentPosition) {
            setNavClasses2('scroll-down');
        } else if (currentPosition < 110) {
            setNavClasses2('');
        } else {
            setNavClasses2('scroll-up');
        }
        setPrevPosition(currentPosition);
    }, false);

    return (
        <div className="navbar-area navbar-area-2 style-2 extra-margin-top">
            <nav className={`navbar navbar-area navbar-expand-lg nav-transparent ${navClasses2} ${show ? 'expand_close' : ''}`}>
                <div className="container nav-container nav-white">
                    <div className="responsive-mobile-menu">
                        <div className="logo">
                            <Link onClick={closeMenu} className="standard-logo" to="/home"><img src={logo} alt={application_name} /></Link>
                            <Link onClick={closeMenu} className="retina-logo d-none" to="/home"><img src={logo} alt={application_name} /></Link>
                        </div>
                        <button onClick={handelToggle} className={`s7t-header-menu toggle-btn d-block d-lg-none ${show ? 'open' : 'collapsed'}`} data-toggle="collapse" data-target="#yogastic_main_menu" aria-expanded={show} aria-label="Toggle navigation">
                            <span className="icon-left" />
                            <span className="icon-right" />
                        </button>
                    </div>
                    <div id="yogastic_main_menu" className={`navbar-collapse ${navClasses}`}>
                        <ul id="menu-menu" className="navbar-nav">
                            <Single onClick={closeMenu} label="Home" link="/home" />
                            <Multiple label="Offerings" onSelect={closeMenu} links={[
                                { label: "Retreats", link: "/programs/wellness-retreats" },
                                { label: "Corporate Wellness", link: "/programs/corporate-wellness" },
                                { label: "Online Programs", link: "/programs/online-programs" }
                            ]} />
                            <Single onClick={closeMenu} label="Know yourself" link="/know-yourself" />
                            <Single onClick={closeMenu} label="About Us" link="/about" />
                            <Single onClick={closeMenu} label="Join Us" link="/join-us" />
                            <Single onClick={closeMenu} label="Contact Us" link="/contact-us" />
                            <Single onClick={closeMenu} label="Login" link="/user/login" />

                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

const Single = ({ label, link, onClick, className = '' }) => {
    const { pathname } = useLocation();
    return <li onClick={onClick} className={`${className} menu-item menu-item-type-post_type menu-item-object-page ${pathname === link ? active : ''}`}>
        <NavLink className="text-decoration-none" to={link}>{label}</NavLink>
    </li>
}

const Multiple = ({ label, links, onSelect = () => null }) => {
    const [show, setShow] = useState(false)
    return <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-50">
        <a href="" onClick={(e) => {
            e.preventDefault();
            setShow(!show)
        }}>{label}</a>
        <ul className={`sub-menu mt-lg-0 mt-2 ${show ? 'd-block' : ''}`}>
            {links.map(({ label, link }, i) => <li onClick={onSelect} className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2566" key={i}><NavLink className="text-decoration-none" to={link}>{label}</NavLink></li>)}
        </ul>
    </li>
}



export { Single, Multiple }