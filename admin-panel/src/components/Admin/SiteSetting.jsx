import { useEffect } from "react"
import { useLocation } from "react-router-dom";

const SiteSetting = ({ setToggle, toggle, hover, dark }) => {

    let location = useLocation();

    useEffect(() => {
        if (window.screen.width <= 1200)
            setToggle(true);

    }, [location, setToggle]);

    useEffect(() => {

        var bodyClass = ['windows']

        if (navigator.userAgent.indexOf("Chrome") !== -1) {
            bodyClass.push('chrome');
        } else if (navigator.userAgent.indexOf("Firefox") !== -1) {
            bodyClass.push('firefox');
        }

        if (toggle)
            bodyClass.push('navbar-vertical-collapsed')

        if (hover) {
            bodyClass.push('navbar-vertical-collapsed')
            bodyClass.push('navbar-vertical-collapsed-hover')
        }

        if (dark)
            bodyClass.push('dark')

        document.documentElement.className = ""
        bodyClass.forEach(className => document.documentElement.classList.add(className))

    }, [toggle, hover, dark])


    return null;
}

export default SiteSetting