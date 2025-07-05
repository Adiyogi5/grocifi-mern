import { useEffect, useState } from 'react';
// import { ADSTATUS } from '../../../../backend/src/helpers/constant';
const ADSTATUS = [
    { id: -1, name: "Draft"},
    { id: 1, name: "Live Ads"},
    { id: 2, name: "Pending"},
    { id: 3, name: "Expired"},
  ];
const AdsStatus = ({status: defaultStatus, expireDate }) => {
    const [status, setStatus] = useState(defaultStatus);

    useEffect(() => {
        if (expireDate) {
            const now = new Date();
            const expire_date = new Date(expireDate);
            if (expire_date < now) {
                setStatus(3); // 3 means expired in your logic
            }
        }
    }, [expireDate]);
 
    const getStatusLabel = (status) => {
        const found = ADSTATUS.find(item => item.id === status);
        return found ? found.name : 'Unknown';
    };

    const getBadgeClass = (status) => {
        switch (status) {
            case -1:
                return 'badge-soft-secondary';
            case 1:
                return 'badge-soft-success';
            case 2:
                return 'badge-soft-warning';
            case 3:
                return 'badge-soft-danger';
            default:
                return 'badge-soft-dark';
        }
    };

    const getIcon = (status) => {
        switch (status) {
            case -1:
                return 'fas fa-pencil-alt';
            case 1:
                return 'fas fa-bullhorn';
            case 2:
                return 'fas fa-clock';
            case 3:
                return 'fas fa-hourglass-end';
            default:
                return 'fas fa-question-circle';
        }
    };

    return (
        <small 
            className={`badge fw-semi-bold rounded-pill status cursor-pointer ${getBadgeClass(status)}`}>
            {getStatusLabel(status)}
            <span className={`ms-1 ${getIcon(status)}`} data-fa-transform="shrink-2"></span>
        </small>
    );
};

export default AdsStatus;
