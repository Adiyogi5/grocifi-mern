import { Dropdown } from "react-bootstrap"
import checkPermission   from "../../components/checkPermission"

const Action = ({ dropList, data, ...rest_props }) => {
    return (
        <Dropdown className="d-inline mx-2">
            <Dropdown.Toggle id="dropdown-autoclose-true" variant={null} className="btn btn-link text-600 btn-sm dropdown-toggle dropdown-caret-none btn-reveal-sm transition-none">
                <span className="fas fa-ellipsis-h fs--2"></span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {dropList.map((row, i) => {
                    const { className, name, ...rest } = row
                    return (checkPermission({module_id:row?.module_id || true, action: row?.action||'view'}) ? <Dropdown.Item  {...rest} key={i} main-data={JSON.stringify(data)} className={`dropdown-item ${className ? className : ""}`} eventKey={i}>{row.name}</Dropdown.Item> : null)
                    // return <Dropdown.Item  {...rest} key={i} main-data={JSON.stringify(data)} className={`dropdown-item ${className ? className : ""}`} eventKey={i}>{row.name}</Dropdown.Item>
                })}
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default Action