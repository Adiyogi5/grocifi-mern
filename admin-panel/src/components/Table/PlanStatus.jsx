import React, { useState } from 'react';
import moment from "moment";

const PlanStatus = ({ data_id, status: defaultStatus, data }) => {

    // const currentDate = new Date();
    // const purchase = new Date(data?.purchase_date);
    // const expiry = new Date(data?.expiry_date);
    const currentDate = moment().format("YYYY-MM-DD");
    const purchase = moment(data?.purchase_date).format("YYYY-MM-DD");
    const expiry = moment(data?.expiry_date).format("YYYY-MM-DD");

    let statusText = "Current Plan";
    let badgeClass = "badge-soft-success";
    let icon = "fas fa-check";

    if (currentDate < purchase) {
        statusText = "Upcoming Plan";
        badgeClass = "badge-soft-info";
        icon = "fas fa-clock";
    } else if (currentDate > expiry) {
        statusText = "Expired Plan";
        badgeClass = "badge-soft-danger";
        icon = "fas fa-ban";
    }

    if(data?.status != 1 ){
        statusText = "Faild";
        badgeClass = "badge-soft-warning";
        icon = "fas fa-exclamation-triangle";
    }

    return (
        <small className={`badge fw-semi-bold rounded-pill status ${badgeClass} cursor-pointer`}>
            {statusText} <span className={`ms-1 ${icon}`} data-fa-transform="shrink-2"></span>
        </small>
    );
}

export default PlanStatus;
