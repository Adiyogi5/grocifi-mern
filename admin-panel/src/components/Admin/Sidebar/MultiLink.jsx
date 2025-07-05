import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const MultiLink = ({ name, icon, children }) => {
    const [show, setShow] = useState(false);
    const { pathname } = useLocation()

    return <li className="nav-item">
        <a
            className={`nav-link dropdown-indicator ${show === true ? 'dropdown-indicator-active' : ''}`}
            role="button"
            href='!#'
            onClick={(e) => {
                e.preventDefault()
                setShow(!show)
            }}
        >
            <div className="d-flex align-items-center">
                <span className="nav-link-icon">
                    <span className={icon} />
                </span>
                <span className="nav-link-text ps-1">{name}</span>
            </div>
        </a>
        <ul
            className="nav collapse"
            id="dashboard"
            style={{ display: show === true ? 'block' : 'none' }}
        >
            {children && children.map((link, i) => <li className="nav-item" key={i}>
                <Link className={`nav-link ${pathname === link.url && 'active'}`} to={link.url} data-bs-toggle aria-expanded="false">
                    <div className="d-flex align-items-center"><span className="nav-link-text ps-1">{link.name}</span>
                    </div>
                </Link>
            </li>)
            }
        </ul>
    </li>
}

export default MultiLink