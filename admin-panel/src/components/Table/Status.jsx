import { useState } from 'react'
import { toast } from 'react-toastify'
import AxiosHelper from '../../helper/AxiosHelper';

const Status = ({ data_id, status: defaultStatus, table }) => {
    const [status, setstatus] = useState(defaultStatus)
    
    const toggleStatus = async () => {
        var { data } = await AxiosHelper.deleteData(`toggle-status/${table}/${data_id}`);
        if (data?.status === true) {
            let toggle = status == 1 ? 2 : 1;
            setstatus(toggle)
            toast.success(data?.message);
        } else {
            toast.error(data?.message);
        }
    }

    return (
        <>
            {status == 1 ? <small onClick={toggleStatus} className="badge fw-semi-bold rounded-pill status badge-soft-success cursor-pointer">
                Active <span className="ms-1 fas fa-check" data-fa-transform="shrink-2"></span>
            </small> : <small onClick={toggleStatus} className="badge fw-semi-bold rounded-pill status badge-soft-danger cursor-pointer">
                Inactive <span className="ms-1 fas fa-ban" data-fa-transform="shrink-2"></span>
            </small>}
        </>
    )
}

export default Status