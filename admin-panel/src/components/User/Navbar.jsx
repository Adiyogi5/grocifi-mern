import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Multiple, Single } from '../Website/Navbar';

export default () => {

    const [show, setShow] = useState(false);
    const [prevPosition, setPrevPosition] = useState(0)
    const [navClasses, setNavClasses] = useState('collapse');
    const [navClasses2, setNavClasses2] = useState('');

    const { logo, application_name } = useSelector(store => store.theme.settings);
    const { first_name, last_name } = useSelector(store => store.user);

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
                            <Link className="standard-logo" to="/home"><img src={logo} alt={application_name} /></Link>
                            <Link className="retina-logo d-none" to="/home"><img src={logo} alt={application_name} /></Link>
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
                            <Multiple label={`${first_name} ${last_name}`.trim()} onSelect={closeMenu} links={[
                                { label: "Profile & Account", link: "/user/profile" },
                                { label: "Booking History", link: "/user/booking-history" },
                                { label: "Logout", link: "/user/logout" }
                            ]} />

                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

