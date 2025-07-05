const Divider = ({ name }) => {
    return (
        <li className="nav-item ">
            <div className="row navbar-vertical-label-wrapper mt-3 mb-2">
                <div className="col-auto navbar-vertical-label">{name}</div>
                <div className="col ps-0">
                    <hr className="mb-0 navbar-vertical-divider" />
                </div>
            </div>
        </li>
    )
}

export default Divider