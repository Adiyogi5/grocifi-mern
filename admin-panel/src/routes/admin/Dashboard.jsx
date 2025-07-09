import React from 'react'
import backgroundImage1 from "../../assets/images/admin/icons/corner-3.png";
import backgroundImage2 from "../../assets/images/admin/icons/corner-1.png";
import backgroundImage3 from "../../assets/images/admin/icons/corner-2.png";
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
const quickLinks = [
    { icon: "fa fa-square-poll-horizontal", title: "------", description: "----", color: "primary" },
    { icon: "fa fa-business-time", title: "------", description: "----", color: "warning" },
    { icon: "fa-solid fa-user-tie-hair", title: "Customer", description: "Manage and update your Customer", color: "success" },
    { icon: "fa-solid fa-square-kanban", title: "------", description: "----", color: "info" }
];
const Dashboard = () => {
    var { application_name } = useSelector(store => store.theme.settings);
    return (
        <>
            <div className="row g-3 mb-3">
                <div className="col-xxl-6 col-lg-12">
                    <div className="card h-100">
                        <div
                            className="bg-holder bg-card"
                            style={{ backgroundImage: `url(${backgroundImage1})` }}
                        ></div>
                        <div className="card-header z-index-1">
                            <h5 className="text-primary">Welcome to {application_name}!</h5>
                            <h6 className="text-600">Here are some quick links for you to start</h6>
                        </div>
                        <div className="card-body z-index-1">
                            <div className="row g-2 h-100 align-items-end">
                                {quickLinks.map((item, index) => (
                                    <div key={index} className="col-sm-6 col-md-5">
                                        <div className="d-flex position-relative">
                                            <div className={`icon-item icon-item-sm border rounded-3 shadow-none me-2 text-${item.color}`}>
                                                <i className={item.icon}></i>
                                            </div>
                                            <div className="flex-1">
                                                <a className="stretched-link" href="#!">
                                                    <h6 className="text-800 mb-0">{item.title}</h6>
                                                </a>
                                                <p className="mb-0 fs--2 text-500">{item.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard